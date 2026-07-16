import re
from typing import List, Dict, Any, Tuple
from app.models.schemas import IssueItem

# Standard section regex patterns
SECTION_PATTERNS = {
    "Experience": [r"\bexperience\b", r"\bwork history\b", r"\bemployment\b", r"\bprofessional background\b"],
    "Education": [r"\beducation\b", r"\bacademic background\b", r"\bdegrees\b"],
    "Skills": [r"\bskills\b", r"\btechnical skills\b", r"\bcore competencies\b", r"\btechnologies\b"],
    "Summary": [r"\bsummary\b", r"\bprofessional summary\b", r"\bobjective\b", r"\bprofile\b"],
    "Contact Info": [r"\bcontact\b", r"\bphone\b", r"\bemail\b", r"\blinkedin\b"]
}

def check_section_presence(text: str) -> Tuple[List[str], List[IssueItem]]:
    """
    Checks for the presence of standard sections.
    Returns detected sections and list of issues.
    """
    detected_sections = []
    issues = []
    text_lower = text.lower()
    
    # 1. Experience
    if any(re.search(pat, text_lower) for pat in SECTION_PATTERNS["Experience"]):
        detected_sections.append("Experience")
    else:
        issues.append(IssueItem(
            severity="critical",
            message="Missing standard section 'Experience'. ATS parsers look for this header to categorize your work history."
        ))
        
    # 2. Education
    if any(re.search(pat, text_lower) for pat in SECTION_PATTERNS["Education"]):
        detected_sections.append("Education")
    else:
        issues.append(IssueItem(
            severity="critical",
            message="Missing standard section 'Education'. ATS parsers look for this header to categorize your academic background."
        ))

    # 3. Skills
    if any(re.search(pat, text_lower) for pat in SECTION_PATTERNS["Skills"]):
        detected_sections.append("Skills")
    else:
        issues.append(IssueItem(
            severity="critical",
            message="Missing standard section 'Skills'. ATS parsers look for this header to map your capabilities."
        ))

    # 4. Summary (Check for literal header or introductory profile statement)
    has_summary_header = any(re.search(pat, text_lower) for pat in SECTION_PATTERNS["Summary"])
    has_intro_sentence = any(phrase in text_lower[:1000] for phrase in ["engineer with", "developer with", "seeking a", "motivated", "specializing in", "professional with"])
    if has_summary_header or has_intro_sentence:
        detected_sections.append("Summary")
    else:
        issues.append(IssueItem(
            severity="warning",
            message="Missing section 'Summary'. Adding a short professional summary or profile helps showcase your background."
        ))

    # 5. Contact Info (Check if email or phone exists anywhere in text)
    email_pattern = r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+'
    phone_pattern = r'(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}'
    has_email = bool(re.search(email_pattern, text_lower))
    has_phone = bool(re.search(phone_pattern, text_lower))
    has_contact_header = any(re.search(pat, text_lower) for pat in SECTION_PATTERNS["Contact Info"])
    if has_email or has_phone or has_contact_header:
        detected_sections.append("Contact Info")
    else:
        issues.append(IssueItem(
            severity="warning",
            message="Missing section 'Contact Info'. Adding contact details (email/phone) is critical."
        ))
        
    return detected_sections, issues

def check_contact_info(text: str) -> List[IssueItem]:
    """
    Checks for completeness of contact info (email, phone, location, LinkedIn).
    """
    issues = []
    
    # Email regex
    email_pattern = r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+'
    emails = re.findall(email_pattern, text)
    if not emails:
        issues.append(IssueItem(
            severity="critical",
            message="No email address detected. Employers and ATS parsers need a clear way to contact you."
        ))
        
    # Phone regex (matches standard international and local formats)
    phone_pattern = r'(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}'
    phones = re.findall(phone_pattern, text)
    if not phones:
        issues.append(IssueItem(
            severity="critical",
            message="No phone number detected. Ensure a standard phone number format is included."
        ))
        
    # LinkedIn check
    if "linkedin.com" not in text.lower():
        issues.append(IssueItem(
            severity="warning",
            message="No LinkedIn profile URL detected. Most recruiters search for your LinkedIn profile."
        ))
        
    return issues

def check_layout_heuristics(text: str) -> List[IssueItem]:
    """
    Checks for potential layout issues like multiple columns or tables
    based on large horizontal whitespace gaps on single lines.
    """
    issues = []
    lines = text.split("\n")
    multi_column_lines = 0
    
    # Heuristic: lines containing multiple spaces separating non-space blocks
    # e.g., "Software Engineer               Google"
    for line in lines:
        if len(line.strip()) > 40:
            # Check if there's a gap of 4 or more spaces
            if re.search(r'\w\s{5,}\w', line):
                multi_column_lines += 1
                
    # If more than 10% of lines or at least 5 lines have multi-column characteristics
    if len(lines) > 0 and (multi_column_lines / len(lines) > 0.1 or multi_column_lines >= 5):
        issues.append(IssueItem(
            severity="warning",
            message="Possible multi-column or table layout detected. Some ATS parsers read left-to-right across columns, scrambling your content."
        ))
        
    return issues

def check_length_heuristics(text: str) -> List[IssueItem]:
    """
    Checks word count of the resume.
    """
    issues = []
    words = text.split()
    word_count = len(words)
    
    if word_count < 200:
        issues.append(IssueItem(
            severity="warning",
            message=f"Resume is very short ({word_count} words). Ensure you have fully documented your experience and skills."
        ))
    elif word_count > 1200:
        issues.append(IssueItem(
            severity="warning",
            message=f"Resume is long ({word_count} words). Aim for a concise 1-2 page layout (approx. 400-800 words)."
        ))
        
    return issues

def compute_ats_score(issues: List[IssueItem]) -> int:
    """
    Computes an ATS score (0-100) using a strict category-weighted model:
    - Formatting & Layout Structure (35% weight)
    - Searchability & Contact Completeness (25% weight)
    - Content Quality, Phrasing & Grammar (40% weight)
    
    This matches the weighted algorithms of professional platforms like Jobscan
    while retaining consistency through capped sub-category deductions.
    """
    # 1. Category A: Formatting & Layout Structure (Base: 100)
    score_formatting = 100
    for issue in issues:
        msg = issue.message.lower()
        if "missing standard section 'experience'" in msg:
            score_formatting -= 25
        elif "missing standard section 'education'" in msg:
            score_formatting -= 25
        elif "missing standard section 'skills'" in msg:
            score_formatting -= 25
        elif "missing section 'summary'" in msg:
            score_formatting -= 15
        elif "multi-column" in msg or "layout" in msg:
            score_formatting -= 15
        elif "resume is very short" in msg or "resume is long" in msg or "words)" in msg:
            score_formatting -= 10
    score_formatting = max(0, score_formatting)

    # 2. Category B: Searchability & Contact details (Base: 100)
    score_contact = 100
    for issue in issues:
        msg = issue.message.lower()
        if "no email address detected" in msg:
            score_contact -= 40
        elif "no phone number detected" in msg:
            score_contact -= 40
        elif "linkedin" in msg:
            score_contact -= 20
    score_contact = max(0, score_contact)

    # 3. Category C: Content Quality, Phrasing & Grammar (Base: 100)
    grammar_deductions = 0
    agent_deductions = 0
    for issue in issues:
        msg = issue.message
        if msg.startswith("Spelling/Grammar:"):
            # Deduct 4 points per spelling/grammar error (max 40)
            grammar_deductions = min(40, grammar_deductions + 4)
        elif not any(x in msg.lower() for x in [
            "missing standard section", "missing section", "no email address", "no phone number", "linkedin", "multi-column", "layout", "resume is very short", "resume is long", "words)"
        ]):
            # Subjective AI phrasing issues (lack of action verbs, metrics, buzzwords)
            # Deduct 8 points per issue (max 60)
            agent_deductions = min(60, agent_deductions + 8)
    score_content = max(0, 100 - (grammar_deductions + agent_deductions))

    # Weighted final score
    final_score = (score_formatting * 0.35) + (score_contact * 0.25) + (score_content * 0.40)
    return round(final_score)

def run_rule_based_checks(text: str) -> Tuple[int, List[str], List[IssueItem]]:
    """
    Runs all rule-based checks on the resume text.
    Returns: (ats_score, detected_sections, list_of_issues)
    """
    detected_sections, section_issues = check_section_presence(text)
    contact_issues = check_contact_info(text)
    layout_issues = check_layout_heuristics(text)
    length_issues = check_length_heuristics(text)
    
    all_issues = section_issues + contact_issues + layout_issues + length_issues
    
    # Compute base score (will be adjusted later if grammar errors or LLM checks are added)
    score = compute_ats_score(all_issues)
    
    return score, detected_sections, all_issues
