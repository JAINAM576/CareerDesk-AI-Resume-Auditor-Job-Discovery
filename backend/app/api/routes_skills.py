import hashlib
import json
from fastapi import APIRouter, HTTPException, status
from app.models.schemas import SkillGapRequest, SkillGapResponse
from app.agents.crew_setup import run_skill_gap_analysis
from app.core.cache import get_cached_value, set_cached_value
from app.config import settings

router = APIRouter(prefix="/skills", tags=["skills"])

@router.post("/gap", response_model=SkillGapResponse)
def analyze_skill_gap(request: SkillGapRequest):
    try:
        role_cleaned = request.target_role.lower().strip()
        # Compute combined hash of resume text and role
        combined_text = f"{request.resume_text.strip()}||{role_cleaned}"
        key_hash = hashlib.sha256(combined_text.encode("utf-8")).hexdigest()
        cache_key = f"skill_gap_{key_hash}"
        
        # Check cache first
        cached_res = get_cached_value(cache_key)
        if cached_res:
            try:
                cached_data = json.loads(cached_res)
                return SkillGapResponse(**cached_data)
            except Exception:
                # If cache corrupted, bypass
                pass
                
        # Call Skill Gap Agent
        agent_output = run_skill_gap_analysis(request.resume_text, request.target_role)
        
        response_data = SkillGapResponse(
            matched_skills=agent_output.matched_skills,
            missing_skills=agent_output.missing_skills,
            project_suggestions=agent_output.project_suggestions
        )
        
        # Save to SQLite Cache
        set_cached_value(
            key_hash=cache_key,
            value=response_data.model_dump_json(),
            ttl_seconds=settings.LLM_RESULT_CACHE_TTL_SECONDS
        )
        
        return response_data
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"error": {"code": "INTERNAL_ERROR", "message": f"Unexpected error: {str(e)}"}}
        )
