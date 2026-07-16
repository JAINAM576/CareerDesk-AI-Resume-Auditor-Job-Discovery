from app.services.ats_checks import (
    check_section_presence,
    check_contact_info,
    check_layout_heuristics,
    check_length_heuristics,
    compute_ats_score
)
from app.models.schemas import IssueItem

def test_check_section_presence_missing():
    # Missing all major sections
    text = "John Doe's details. Working since 2020."
    sections, issues = check_section_presence(text)
    
    # It should identify no sections and raise critical/warning issues
    assert "Experience" not in sections
    assert "Skills" not in sections
    # There should be critical issues for missing essential sections
    assert any(issue.severity == "critical" for issue in issues)

def test_check_section_presence_all():
    text = """
    John Doe
    Contact Info
    Summary: Active software engineer.
    Experience: Google, Software Engineer 2020-2023.
    Education: BS Computer Science.
    Skills: Python, React, SQL.
    """
    sections, issues = check_section_presence(text)
    assert "Experience" in sections
    assert "Education" in sections
    assert "Skills" in sections
    assert "Contact Info" in sections
    # No critical issues for missing sections should exist
    assert not any(issue.severity == "critical" for issue in issues)

def test_check_contact_info_missing():
    text = "No contact details here whatsoever."
    issues = check_contact_info(text)
    assert any("email" in issue.message.lower() for issue in issues)
    assert any("phone" in issue.message.lower() for issue in issues)

def test_check_contact_info_valid():
    text = "Email: test@example.com, Phone: 123-456-7890, linkedin.com/in/test"
    issues = check_contact_info(text)
    assert not any(issue.severity == "critical" for issue in issues)

def test_check_layout_heuristics():
    # Normal layout
    normal_text = "Software Engineer at Google\nWorked on frontend systems.\nLearnt python and react."
    normal_issues = check_layout_heuristics(normal_text)
    assert len(normal_issues) == 0
    
    # Multi-column layout with large gaps
    scrambled_text = "\n".join([
        "Software Engineer                       Google Inc",
        "Frontend Developer                      Facebook Inc",
        "Backend Developer                       Amazon Inc",
        "React and Python                        Node and SQL",
        "Ahmedabad, India                        Remote, US",
        "Worked on search systems                Implemented API gateways",
        "Maintained local databases              Tested with Jest",
        "Graduated in 2020                       Major in CS",
        "GPA 4.0                                 Honors List",
        "References                              Available on request"
    ])
    scrambled_issues = check_layout_heuristics(scrambled_text)
    assert len(scrambled_issues) > 0
    assert any("multi-column" in issue.message.lower() for issue in scrambled_issues)

def test_compute_ats_score():
    # 0 issues -> 100
    assert compute_ats_score([]) == 100
    
    # Missing standard section Experience -> deducts 25 from formatting (Formatting weight 35% -> final score 91)
    issues = [IssueItem(severity="critical", message="Missing standard section 'Experience'")]
    assert compute_ats_score(issues) == 91
    
    # Missing email -> deducts 40 from contact info (Contact weight 25% -> final score 90)
    issues = [IssueItem(severity="critical", message="No email address detected")]
    assert compute_ats_score(issues) == 90
    
    # Spelling errors / subjective phrasing -> deducts 4 from content quality (Content weight 40% -> final score 98)
    issues = [IssueItem(severity="warning", message="Spelling/Grammar: Typo found")]
    assert compute_ats_score(issues) == 98
