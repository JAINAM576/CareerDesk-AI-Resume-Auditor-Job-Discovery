import hashlib
import json
import os
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, status
from app.services.resume_parser import parse_resume, ResumeParserError
from app.services.ats_checks import run_rule_based_checks, compute_ats_score
from app.services.grammar_check import check_grammar
from app.agents.crew_setup import run_ats_agent_analysis
from app.models.schemas import ResumeAnalyzeResponse, IssueItem
from app.core.cache import get_cached_value, set_cached_value
from app.config import settings
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/resume", tags=["resume"])

@router.post("/analyze", response_model=ResumeAnalyzeResponse)
def analyze_resume(
    file: UploadFile = File(..., description="Resume file (PDF or DOCX)"),
    target_role: str = Form(..., description="Target job title")
):
    try:
        file_bytes = file.file.read()
        
        # Enforce file size limit
        max_size_bytes = settings.MAX_RESUME_FILE_SIZE_MB * 1024 * 1024
        if len(file_bytes) > max_size_bytes:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail={
                    "error": {
                        "code": "LIMIT_FILE_SIZE",
                        "message": f"Resume file size exceeds the limit of {settings.MAX_RESUME_FILE_SIZE_MB}MB."
                    }
                }
            )

        # Calculate file hash for caching
        file_hash = hashlib.sha256(file_bytes).hexdigest()
        cache_key = f"ats_analysis_{file_hash}_{target_role.lower().strip()}"
        
        # Check cache
        cached_res = get_cached_value(cache_key)
        if cached_res:
            try:
                cached_data = json.loads(cached_res)
                return ResumeAnalyzeResponse(**cached_data)
            except Exception:
                # If cache corrupted, bypass
                pass
        
        # 1. Parse text from resume file
        extracted_text = parse_resume(file.filename, file_bytes)
        
        # 2. Run deterministic rule-based checks (section presence, contact info, layout, length)
        base_score, detected_sections, rule_issues = run_rule_based_checks(extracted_text)
        
        # 3. Run grammar check and LLM analysis in parallel (concurrency speed optimization)
        from concurrent.futures import ThreadPoolExecutor
        with ThreadPoolExecutor() as executor:
            future_grammar = executor.submit(check_grammar, extracted_text)
            future_agent = executor.submit(run_ats_agent_analysis, extracted_text, target_role)
            
            grammar_issues = future_grammar.result()
            agent_output = future_agent.result()
        
        # 4. Compile and merge all issues
        # Convert agent output issues to backend IssueItem models
        agent_issues = [
            IssueItem(severity=issue.severity.lower(), message=issue.message)
            for issue in agent_output.issues
        ]
        
        all_issues = rule_issues + grammar_issues + agent_issues
        
        # Recalculate final ATS score based on all compiled issues
        final_score = compute_ats_score(all_issues)
        
        # Upload resume to Cloudinary securely
        resume_url = None
        try:
            import io
            import cloudinary
            import cloudinary.uploader

            cloudinary.config(
                cloud_name=settings.CLOUDINARY_CLOUD_NAME,
                api_key=settings.CLOUDINARY_API_KEY,
                api_secret=settings.CLOUDINARY_API_SECRET,
                secure=True
            )

            # Upload raw file bytes via BytesIO buffer
            upload_res = cloudinary.uploader.upload(
                io.BytesIO(file_bytes),
                resource_type="auto",
                folder="resumes",
                public_id=f"{file.filename.split('.')[0]}_{file_hash[:8]}"
            )
            resume_url = upload_res.get("secure_url")
        except Exception as cl_err:
            logger.error(f"Failed to upload resume to Cloudinary: {cl_err}")
        
        response_data = ResumeAnalyzeResponse(
            ats_score=final_score,
            summary=getattr(agent_output, "summary", "Resume analysis completed successfully."),
            issues=all_issues,
            parsed_sections=detected_sections,
            extracted_text=extracted_text,
            resume_url=resume_url,
            file_name=file.filename
        )
        
        # Save to cache
        set_cached_value(
            key_hash=cache_key,
            value=response_data.model_dump_json(),
            ttl_seconds=settings.LLM_RESULT_CACHE_TTL_SECONDS
        )
        
        return response_data
        
    except HTTPException as e:
        raise e
    except ResumeParserError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"error": {"code": "PARSE_ERROR", "message": str(e)}}
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"error": {"code": "INTERNAL_ERROR", "message": f"Unexpected error: {str(e)}"}}
        )
