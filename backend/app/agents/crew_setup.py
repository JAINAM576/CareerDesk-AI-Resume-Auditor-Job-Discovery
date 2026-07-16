from typing import List, Optional
from pydantic import BaseModel, Field
from crewai import Agent, Task, Crew, LLM
from app.config import settings
import logging

logger = logging.getLogger(__name__)

# Output Pydantic schemas for the tasks
class ATSIssueSchema(BaseModel):
    severity: str = Field(..., description="Severity level: critical, warning, or suggestion")
    message: str = Field(..., description="Details of the issue and how to resolve it")

class ATSAnalyzerOutputSchema(BaseModel):
    summary: str = Field(..., description="A 2-3 sentence overall summary of the resume quality and critical recommendations.")
    issues: List[ATSIssueSchema] = Field(default_factory=list, description="List of detected formatting, structural or phrasing issues")

class SkillGapOutputSchema(BaseModel):
    matched_skills: List[str] = Field(default_factory=list, description="Skills present in the resume matching the target role")
    missing_skills: List[str] = Field(default_factory=list, description="Missing or weak skills compared to target role")
    project_suggestions: List[str] = Field(default_factory=list, description="2-3 project ideas tailored to close the skill gaps")


def get_llm(provider_preference: str = "primary") -> Optional[LLM]:
    """
    Initializes and returns the CrewAI LLM wrapper.
    If provider_preference is 'secondary_groq', it prioritizes GROQ_API_KEY1.
    If 'primary', it prioritizes OPENROUTER_API_KEY if configured, then GROQ_API_KEY.
    """
    try:
        # 1. OpenRouter (Primary preference check)
        if provider_preference == "primary" and settings.OPENROUTER_API_KEY and settings.OPENROUTER_API_KEY != "your_openrouter_api_key_here" and not settings.OPENROUTER_API_KEY.startswith("#"):
            model_name = settings.OPENROUTER_MODEL
            if not model_name.startswith("openrouter/"):
                model_name = f"openrouter/{model_name}"
            return LLM(
                model=model_name,
                api_key=settings.OPENROUTER_API_KEY,
                base_url="https://openrouter.ai/api/v1",
                temperature=0.1
            )
            
        # 2. Select Groq Key based on preference
        if provider_preference == "secondary_groq":
            groq_key = settings.GROQ_API_KEY1 or settings.GROQ_API_KEY
        else:
            groq_key = settings.GROQ_API_KEY
            
        if groq_key and groq_key != "your_groq_api_key_here":
            model_name = settings.GROQ_MODEL
            if not model_name.startswith("groq/"):
                model_name = f"groq/{model_name}"
            return LLM(
                model=model_name,
                api_key=groq_key,
                temperature=0.1
            )
    except Exception as e:
        logger.error(f"Error configuring CrewAI LLM: {str(e)}")
    
    return None


def run_ats_agent_analysis(resume_text: str, target_role: str, active_llm: Optional[LLM] = None) -> ATSAnalyzerOutputSchema:
    """
    Runs the ATSAnalyzerAgent on the resume text.
    Uses GROQ_API_KEY (Primary) and falls back to GROQ_API_KEY1 (Secondary) if it fails.
    """
    llm = active_llm or get_llm("primary")
    if not llm:
        logger.warning("No LLM API keys configured. Using mock response for ATS Agent.")
        return ATSAnalyzerOutputSchema(
            summary=f"ATS review successfully simulated for the target role '{target_role}'. (Set your GROQ_API_KEY in .env to unlock live agent feedback).",
            issues=[
                ATSIssueSchema(
                    severity="suggestion",
                    message="Review bullet points to ensure they begin with action verbs and include metrics (e.g. 'Increased efficiency by 15%')."
                )
            ]
        )

    def run_crew_with_llm(chosen_llm):
        ats_agent = Agent(
            role="Resume formatting and ATS-compatibility reviewer",
            goal="Review resume phrasing, structural details, and formatting compatibility for a target role.",
            backstory="You are an expert technical recruiter and ATS system analyst. You know exactly what phrasing triggers parsing issues and what formatting causes resumes to fail screening filters.",
            verbose=True,
            llm=chosen_llm
        )

        ats_task = Task(
            description=(
                f"Analyze the candidate's resume for compatibility with the target role: '{target_role}'.\n"
                f"Resume Text:\n---\n{resume_text}\n---\n"
                "Contrast the candidate's experience phrasing and bullet points against high-performance resume benchmarks (resumes that score 100/100 on professional ATS screenings).\n"
                "Specifically evaluate:\n"
                "1. If experience bullet points begin with strong action verbs (e.g. 'Pioneered', 'Architected', 'Spearheaded') instead of passive phrasing.\n"
                "2. If experience details include quantifiable business outcome metrics (e.g., specific percentages, speed increases, revenue, or team size). Flag any text lacking metrics.\n"
                "3. Ensure there are no generic buzzwords (e.g. 'team player', 'hard worker').\n"
                "Identify formatting, structural, keyword, or phrasing problems. Focus on high-quality actionable suggestions to reach 100/100 quality.\n"
                "Also, formulate a concise, professional summary of the overall resume quality and its most critical improvement needs."
            ),
            expected_output="A structured Pydantic object containing a concise overall resume evaluation summary and a list of categorized issues.",
            agent=ats_agent,
            output_pydantic=ATSAnalyzerOutputSchema
        )

        crew = Crew(
            agents=[ats_agent],
            tasks=[ats_task],
            verbose=True
        )
        return crew.kickoff()

    try:
        result = run_crew_with_llm(llm)
        if result and hasattr(result, "pydantic"):
            return result.pydantic
        raw_output = str(result)
        return ATSAnalyzerOutputSchema.model_validate_json(raw_output)
    except Exception as e:
        logger.error(f"ATS Agent execution failed on primary LLM: {str(e)}")
        
        # Fall back to Groq Key 1 (Secondary key)
        if settings.GROQ_API_KEY1 and settings.GROQ_API_KEY1 != "your_groq_api_key_here":
            logger.info("Attempting runtime fallback to secondary Groq key for ATS Agent...")
            try:
                fallback_llm = LLM(
                    model=f"groq/{settings.GROQ_MODEL}",
                    api_key=settings.GROQ_API_KEY1
                )
                result = run_crew_with_llm(fallback_llm)
                if result and hasattr(result, "pydantic"):
                    return result.pydantic
                raw_output = str(result)
                return ATSAnalyzerOutputSchema.model_validate_json(raw_output)
            except Exception as fallback_err:
                logger.error(f"Fallback to secondary Groq key also failed: {str(fallback_err)}")
        
        # Default mock fallback
        return ATSAnalyzerOutputSchema(
            summary="ATS Analyzer Agent experienced an error during analysis. Defaulting to local parser checks.",
            issues=[
                ATSIssueSchema(
                    severity="warning",
                    message=f"ATS Analyzer Agent experienced an error: {str(e)}. Defaulting to rule-based parser checks."
                )
            ]
        )


def run_skill_gap_analysis(resume_text: str, target_role: str, active_llm: Optional[LLM] = None) -> SkillGapOutputSchema:
    """
    Runs the SkillGapAgent on the resume text to identify skill gaps against the target role.
    Uses GROQ_API_KEY1 (Secondary) and falls back to GROQ_API_KEY (Primary) if it fails.
    """
    # Prioritize secondary Groq key for the Skill Gap analysis to balance API request load
    llm = active_llm or get_llm("secondary_groq")
    if not llm:
        logger.warning("No LLM API keys configured. Using mock response for Skill Gap Agent.")
        return SkillGapOutputSchema(
            matched_skills=["React", "JavaScript", "HTML", "CSS"] if "front" in target_role.lower() else ["Python", "SQL", "FastAPI"],
            missing_skills=["TypeScript", "State Management (Redux/Zustand)", "Automated Testing"] if "front" in target_role.lower() else ["Docker", "ORM (SQLAlchemy)", "Async programming"],
            project_suggestions=[
                f"Develop a complete project using your missing skills to bridge the gap for '{target_role}'.",
                "Deploy a sample application demonstrating CI/CD pipeline integration and unit testing."
            ]
        )

    def run_crew_with_llm(chosen_llm):
        skill_gap_agent = Agent(
            role="Technical recruiter assessing skill fit for a target role",
            goal="Analyze a candidate's resume, compare their skills against requirements for a target role, identify gaps, and propose projects to close those gaps.",
            backstory="You are a senior technical hiring manager. You evaluate candidate skill profiles against target job requirements, identify missing technology stack items, and design concrete project ideas to help candidates bridge those gaps.",
            verbose=True,
            llm=chosen_llm
        )

        skill_task = Task(
            description=(
                f"Analyze the candidate's resume to assess skill-fit for the target role: '{target_role}'.\n"
                f"Resume Text:\n---\n{resume_text}\n---\n"
                "1. Extract skills already present on the resume that match the target role (matched_skills).\n"
                "2. Identify critical skills typical for this role that are missing or weak on the resume (missing_skills).\n"
                "3. Propose 2-3 concrete project ideas that would allow the candidate to learn and showcase the missing skills (project_suggestions)."
            ),
            expected_output="A structured JSON response with matched_skills, missing_skills, and project_suggestions.",
            agent=skill_gap_agent,
            output_pydantic=SkillGapOutputSchema
        )

        crew = Crew(
            agents=[skill_gap_agent],
            tasks=[skill_task],
            verbose=True
        )
        return crew.kickoff()

    try:
        result = run_crew_with_llm(llm)
        if result and hasattr(result, "pydantic"):
            return result.pydantic
        raw_output = str(result)
        return SkillGapOutputSchema.model_validate_json(raw_output)
    except Exception as e:
        logger.error(f"Skill Gap Agent execution failed on secondary LLM: {str(e)}")
        
        # Fall back to Groq Key (Primary key)
        if settings.GROQ_API_KEY and settings.GROQ_API_KEY != "your_groq_api_key_here":
            logger.info("Attempting runtime fallback to primary Groq key for Skill Gap Agent...")
            try:
                fallback_llm = LLM(
                    model=f"groq/{settings.GROQ_MODEL}",
                    api_key=settings.GROQ_API_KEY
                )
                result = run_crew_with_llm(fallback_llm)
                if result and hasattr(result, "pydantic"):
                    return result.pydantic
                raw_output = str(result)
                return SkillGapOutputSchema.model_validate_json(raw_output)
            except Exception as fallback_err:
                logger.error(f"Fallback to primary Groq key also failed: {str(fallback_err)}")
                
        return SkillGapOutputSchema(
            matched_skills=[],
            missing_skills=["Unable to determine skill gaps due to agent timeout."],
            project_suggestions=[f"Review core requirements for '{target_role}' online."]
        )
