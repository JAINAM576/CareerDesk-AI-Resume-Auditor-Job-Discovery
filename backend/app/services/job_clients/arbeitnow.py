import requests
import logging
from typing import List
from app.models.schemas import JobItem

logger = logging.getLogger(__name__)

def fetch_arbeitnow_jobs(role: str) -> List[JobItem]:
    """
    Fetches job listings from Arbeitnow API.
    Filters matched jobs by the specified role query.
    """
    jobs = []
    url = "https://www.arbeitnow.com/api/job-board-api"
    
    try:
        # Arbeitnow API is public and paginated. We search page 1.
        response = requests.get(url, timeout=6)
        if response.status_code == 200:
            data = response.json()
            results = data.get("data", [])
            
            # Simple keyword matching for target role in title or tags
            role_keywords = [kw.lower() for kw in role.split()]
            
            for item in results:
                title = item.get("title", "")
                company = item.get("company_name", "Confidential")
                loc = item.get("location", "Germany")
                created_at = item.get("created_at")
                if isinstance(created_at, int):
                    from datetime import datetime
                    posted = datetime.fromtimestamp(created_at).strftime("%Y-%m-%d")
                elif isinstance(created_at, str):
                    posted = created_at[:10]
                else:
                    posted = ""
                apply_url = item.get("url", "")
                tags = [t.lower() for t in item.get("tags", [])]
                
                # Check if role matches
                title_lower = title.lower()
                if not any(kw in title_lower or any(kw in tag for tag in tags) for kw in role_keywords):
                    continue
                
                # Determine job mode from tags
                mode = "on-site"
                if "remote" in tags or "remote work" in tags or "working from home" in tags:
                    mode = "remote"
                elif "hybrid" in tags or "hybrid model" in tags:
                    mode = "hybrid"
                elif "remote" in title_lower:
                    mode = "remote"
                elif "hybrid" in title_lower:
                    mode = "hybrid"
                    
                jobs.append(JobItem(
                    company=company,
                    title=title,
                    location=loc,
                    mode=mode,
                    posted=posted,
                    apply_url=apply_url
                ))
        else:
            logger.warning(f"Arbeitnow API returned status code {response.status_code}")
    except requests.exceptions.RequestException as e:
        logger.error(f"Arbeitnow API request failed: {str(e)}")
    except Exception as e:
        logger.error(f"Unexpected error in Arbeitnow client: {str(e)}")
        
    return jobs
