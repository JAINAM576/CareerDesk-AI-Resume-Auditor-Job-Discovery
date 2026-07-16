import requests
import logging
from typing import List
from app.models.schemas import JobItem

logger = logging.getLogger(__name__)

def fetch_remoteok_jobs(role: str) -> List[JobItem]:
    """
    Fetches job listings from RemoteOK.
    Only returns remote roles.
    """
    jobs = []
    # RemoteOK requires a real user agent to prevent 403 Forbidden
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
        "Accept": "application/json"
    }
    
    # We query remoteok passing role as a tag / query
    url = f"https://remoteok.com/api?tag={role.replace(' ', '-')}"
    
    try:
        response = requests.get(url, headers=headers, timeout=6)
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                for item in data:
                    # Skip the first item if it's the legal disclaimer
                    if "legal" in item:
                        continue
                        
                    company = item.get("company", "Remote Company")
                    title = item.get("position", "")
                    loc = item.get("location", "Remote")
                    posted = item.get("date", "")[:10]  # Get YYYY-MM-DD
                    apply_url = item.get("url", "")
                    
                    jobs.append(JobItem(
                        company=company,
                        title=title,
                        location=loc,
                        mode="remote",
                        posted=posted,
                        apply_url=apply_url
                    ))
        else:
            logger.warning(f"RemoteOK API returned status code {response.status_code}")
    except requests.exceptions.RequestException as e:
        logger.error(f"RemoteOK API request failed: {str(e)}")
    except Exception as e:
        logger.error(f"Unexpected error in RemoteOK client: {str(e)}")
        
    return jobs
