import hashlib
import json
import logging
from concurrent.futures import ThreadPoolExecutor
from typing import List, Optional
from fastapi import APIRouter, Query, HTTPException, status
from app.models.schemas import JobSearchResponse, JobItem
from app.services.job_clients.adzuna import fetch_adzuna_jobs
from app.services.job_clients.remoteok import fetch_remoteok_jobs
from app.services.job_clients.arbeitnow import fetch_arbeitnow_jobs
from app.core.cache import get_cached_value, set_cached_value
from app.config import settings

router = APIRouter(prefix="/jobs", tags=["jobs"])
logger = logging.getLogger(__name__)

def merge_and_deduplicate(job_lists: List[List[JobItem]], target_location: str) -> List[JobItem]:
    """
    Merges job lists, removes duplicates, and sorts by relevance.
    """
    seen = set()
    merged = []
    
    for job_list in job_lists:
        for job in job_list:
            # Create a unique key for company and title
            key = f"{job.company.lower().strip()}||{job.title.lower().strip()}"
            if key not in seen:
                seen.add(key)
                merged.append(job)
                
    # Sort helper: prioritize target location matches, remote listings, then others
    loc_lower = target_location.lower().strip()
    
    def sort_key(job: JobItem):
        job_loc = job.location.lower()
        # High priority: exact/close location matches
        if loc_lower and loc_lower in job_loc:
            return 0
        # Medium priority: remote listings
        elif job.mode == "remote" or "remote" in job_loc:
            return 1
        # Low priority: everything else
        return 2

    merged.sort(key=sort_key)
    return merged

@router.get("/search", response_model=JobSearchResponse)
def search_jobs(
    role: str = Query(..., description="Target job title"),
    location: str = Query(..., description="Target location/city"),
    mode: str = Query("any", description="Filter by mode: remote, hybrid, on-site, any")
):
    try:
        role_cleaned = role.lower().strip()
        loc_cleaned = location.lower().strip()
        mode_cleaned = mode.lower().strip()
        
        # Cache key based on query params
        cache_key = f"jobs_search_{role_cleaned}_{loc_cleaned}_{mode_cleaned}"
        key_hash = hashlib.sha256(cache_key.encode("utf-8")).hexdigest()
        
        # Check SQLite Cache
        cached_res = get_cached_value(key_hash)
        if cached_res:
            try:
                cached_data = json.loads(cached_res)
                return JobSearchResponse(**cached_data)
            except Exception:
                pass
                
        # Fetch jobs concurrently using ThreadPoolExecutor
        fetched_lists = []
        with ThreadPoolExecutor(max_workers=3) as executor:
            # Start jobs fetching tasks
            future_adzuna = executor.submit(fetch_adzuna_jobs, role_cleaned, loc_cleaned)
            future_remoteok = executor.submit(fetch_remoteok_jobs, role_cleaned)
            future_arbeitnow = executor.submit(fetch_arbeitnow_jobs, role_cleaned)
            
            # Retrieve results with safe defaults on failure
            try:
                fetched_lists.append(future_adzuna.result())
            except Exception as e:
                logger.error(f"Adzuna search task failed: {str(e)}")
                
            try:
                fetched_lists.append(future_remoteok.result())
            except Exception as e:
                logger.error(f"RemoteOK search task failed: {str(e)}")
                
            try:
                fetched_lists.append(future_arbeitnow.result())
            except Exception as e:
                logger.error(f"Arbeitnow search task failed: {str(e)}")
                
        # Merge and deduplicate
        merged_jobs = merge_and_deduplicate(fetched_lists, loc_cleaned)
        
        # Filter by mode if requested and not "any"
        if mode_cleaned != "any":
            if mode_cleaned == "remote":
                merged_jobs = [j for j in merged_jobs if j.mode == "remote"]
            elif mode_cleaned == "hybrid":
                merged_jobs = [j for j in merged_jobs if j.mode in ["remote", "hybrid"]]
            elif mode_cleaned == "on-site":
                merged_jobs = [j for j in merged_jobs if j.mode in ["hybrid", "on-site"]]
                
        response_data = JobSearchResponse(results=merged_jobs[:20])  # limit to top 20
        
        # Cache results
        set_cached_value(
            key_hash=key_hash,
            value=response_data.model_dump_json(),
            ttl_seconds=settings.JOB_SEARCH_CACHE_TTL_SECONDS
        )
        
        return response_data
        
    except Exception as e:
        logger.error(f"Job search endpoint failed: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"error": {"code": "INTERNAL_ERROR", "message": f"Unexpected error: {str(e)}"}}
        )
