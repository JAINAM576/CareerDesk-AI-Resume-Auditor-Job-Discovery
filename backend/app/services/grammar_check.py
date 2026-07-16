import requests
import logging
from typing import List
from app.config import settings
from app.models.schemas import IssueItem

logger = logging.getLogger(__name__)

def check_grammar(text: str) -> List[IssueItem]:
    """
    Checks spelling and grammar in the resume text using LanguageTool.
    Fails gracefully if the API is offline or times out.
    """
    issues = []
    
    # Restrict checked text to first 10,000 characters to prevent API rate limits/errors
    text_to_check = text[:10000]
    
    url = settings.LANGUAGETOOL_API_URL
    payload = {
        "text": text_to_check,
        "language": "en-US"
    }
    
    try:
        response = requests.post(url, data=payload, timeout=5)
        if response.status_code == 200:
            result = response.json()
            matches = result.get("matches", [])
            
            # Map matches to IssueItem
            # Limit to 5 issues to keep feedback clean
            for match in matches[:5]:
                message = match.get("message", "Grammar/spelling issue")
                short_msg = match.get("shortMessage", "")
                
                # Extract clean replacements
                replacements = [r.get("value") for r in match.get("replacements", [])[:3]]
                replacements_str = ", ".join(f"'{r}'" for r in replacements if r)
                
                fix_suggestion = f" -> Suggestion: {replacements_str}" if replacements_str else ""
                full_message = f"{message}{fix_suggestion}"
                
                # Rule category
                rule_category = match.get("rule", {}).get("category", {}).get("id", "")
                
                severity = "warning" if rule_category == "TYPOS" else "suggestion"
                
                issues.append(IssueItem(
                    severity=severity,
                    message=f"Spelling/Grammar: {full_message}"
                ))
            
            # If there were more than 5 errors, add a note
            if len(matches) > 5:
                issues.append(IssueItem(
                    severity="suggestion",
                    message=f"Spelling/Grammar: There are {len(matches) - 5} additional spelling/grammar flags in your resume."
                ))
        else:
            logger.warning(f"LanguageTool returned status code {response.status_code}")
    except requests.exceptions.RequestException as e:
        logger.error(f"LanguageTool API request failed (degrading gracefully): {str(e)}")
        # Graceful degradation - do not crash the request, just return empty issues list
    except Exception as e:
        logger.error(f"Unexpected LanguageTool error: {str(e)}")
        
    return issues
