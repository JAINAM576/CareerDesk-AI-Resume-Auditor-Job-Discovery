import requests
import logging
from typing import List
from app.config import settings
from app.models.schemas import JobItem

logger = logging.getLogger(__name__)

def fetch_adzuna_jobs(role: str, location: str) -> List[JobItem]:
    """
    Fetches job listings from Adzuna.
    If credentials are not present or the API request fails, degrades gracefully.
    """
    jobs = []
    app_id = settings.ADZUNA_APP_ID
    app_key = settings.ADZUNA_APP_KEY
    
    # Degrade gracefully if credentials are not configured or are placeholder
    if not app_id or not app_key or app_id == "your_adzuna_app_id_here" or app_key == "your_adzuna_app_key_here":
        logger.info("Adzuna API keys not set. Returning empty list (graceful degradation).")
        return []
        
    # Standard search settings
    country = "us"  # default to US, can map to other countries dynamically
    if any(ind_city in location.lower() for ind_city in ["india", "ahmedabad", "bangalore", "mumbai", "delhi", "pune"]):
        country = "in"
    elif any(uk_city in location.lower() for uk_city in ["uk", "london", "manchester"]):
        country = "gb"
        
    url = f"https://api.adzuna.com/v1/api/jobs/{country}/search/1"
    params = {
        "app_id": app_id,
        "app_key": app_key,
        "results_per_page": 10,
        "what": role,
        "where": location
    }
    
    try:
        response = requests.get(url, params=params, timeout=6)
        if response.status_code == 200:
            data = response.json()
            results = data.get("results", [])
            for item in results:
                company = item.get("company", {}).get("display_name", "Confidential")
                title = item.get("title", "").replace("<strong>", "").replace("</strong>", "")
                loc = item.get("location", {}).get("display_name", location)
                posted = item.get("created", "")[:10]  # Get YYYY-MM-DD
                apply_url = item.get("redirect_url", "")
                
                # Check for hybrid/remote in title/description
                mode = "on-site"
                title_lower = title.lower()
                desc_lower = item.get("description", "").lower()
                if "remote" in title_lower or "remote" in desc_lower:
                    mode = "remote"
                elif "hybrid" in title_lower or "hybrid" in desc_lower:
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
            logger.warning(f"Adzuna API returned status code {response.status_code}")
    except requests.exceptions.RequestException as e:
        logger.error(f"Adzuna API request failed: {str(e)}")
    except Exception as e:
        logger.error(f"Unexpected error in Adzuna client: {str(e)}")
        
    return jobs
