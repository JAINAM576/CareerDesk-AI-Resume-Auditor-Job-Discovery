from pydantic import BaseModel, Field
from typing import List, Optional

class IssueItem(BaseModel):
    severity: str = Field(..., description="Severity of the issue: critical, warning, suggestion")
    message: str = Field(..., description="Plain-language description of the issue and how to fix it")

class ResumeAnalyzeResponse(BaseModel):
    ats_score: int = Field(..., ge=0, le=100, description="ATS score from 0 to 100")
    summary: Optional[str] = Field(None, description="A high-level evaluation summary of the resume quality and critical needs")
    issues: List[IssueItem] = Field(default_factory=list, description="Categorized list of issues and suggestions")
    parsed_sections: List[str] = Field(default_factory=list, description="List of section headers identified in the resume")
    extracted_text: Optional[str] = Field(None, description="Extracted plain text of the resume for downstream assessments")
    resume_url: Optional[str] = Field(None, description="Secure Cloudinary URL to access the uploaded file")
    file_name: Optional[str] = Field(None, description="Original name of the uploaded resume file")

class SkillGapRequest(BaseModel):
    resume_text: str = Field(..., description="Extracted text content from the resume")
    target_role: str = Field(..., description="Target job title / role")

class SkillGapResponse(BaseModel):
    matched_skills: List[str] = Field(default_factory=list, description="Skills present in the resume matching the role")
    missing_skills: List[str] = Field(default_factory=list, description="Missing or weak skills compared to target role")
    project_suggestions: List[str] = Field(default_factory=list, description="2-3 project ideas to close the skill gaps")

class JobItem(BaseModel):
    company: str = Field(..., description="Company name")
    title: str = Field(..., description="Job title")
    location: str = Field(..., description="Job location")
    mode: str = Field(..., description="Job mode: remote, hybrid, on-site")
    posted: str = Field(..., description="Date posted or source age (e.g. YYYY-MM-DD)")
    apply_url: str = Field(..., description="URL to apply or view details")

class JobSearchResponse(BaseModel):
    results: List[JobItem] = Field(default_factory=list, description="Aggregated list of job postings")
