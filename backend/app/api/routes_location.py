import requests
import logging
from typing import List, Dict, Any
from fastapi import APIRouter, HTTPException, status
from app.config import settings

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/location", tags=["location"])

BASE_URL = "https://api.countrystatecity.in/v1"

def get_headers():
    return {
        "X-CSCAPI-KEY": settings.COUNTRY_STATE_API_TOKEN or ""
    }

@router.get("/countries")
def get_countries():
    api_key = settings.COUNTRY_STATE_API_TOKEN
    if not api_key or api_key == "your_api_key_here":
        # Graceful mock fallback of popular countries
        return [
            {"name": "India", "iso2": "IN"},
            {"name": "United States", "iso2": "US"},
            {"name": "United Kingdom", "iso2": "GB"},
            {"name": "Canada", "iso2": "CA"}
        ]
    try:
        res = requests.get(f"{BASE_URL}/countries", headers=get_headers(), timeout=5)
        if res.status_code == 200:
            return res.json()
        logger.error(f"CSC API returned code {res.status_code}")
        raise HTTPException(status_code=500, detail="Failed to fetch countries from provider")
    except Exception as e:
        logger.error(f"Error fetching countries: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/countries/{country_code}/states")
def get_states(country_code: str):
    api_key = settings.COUNTRY_STATE_API_TOKEN
    if not api_key or api_key == "your_api_key_here":
        # Graceful mock fallback of popular states/regions
        mocks = {
            "IN": [{"name": "Gujarat", "iso2": "GJ"}, {"name": "Maharashtra", "iso2": "MH"}, {"name": "Delhi", "iso2": "DL"}, {"name": "Karnataka", "iso2": "KA"}],
            "US": [{"name": "California", "iso2": "CA"}, {"name": "New York", "iso2": "NY"}, {"name": "Texas", "iso2": "TX"}],
            "GB": [{"name": "England", "iso2": "ENG"}, {"name": "Scotland", "iso2": "SCT"}],
            "CA": [{"name": "Ontario", "iso2": "ON"}, {"name": "Quebec", "iso2": "QC"}]
        }
        return mocks.get(country_code.upper(), [])
    try:
        res = requests.get(f"{BASE_URL}/countries/{country_code.upper()}/states", headers=get_headers(), timeout=5)
        if res.status_code == 200:
            return res.json()
        logger.error(f"CSC API returned code {res.status_code}")
        raise HTTPException(status_code=500, detail="Failed to fetch states from provider")
    except Exception as e:
        logger.error(f"Error fetching states: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/countries/{country_code}/states/{state_code}/cities")
def get_cities(country_code: str, state_code: str):
    api_key = settings.COUNTRY_STATE_API_TOKEN
    if not api_key or api_key == "your_api_key_here":
        # Graceful mock fallback of popular cities
        mocks = {
            "IN_GJ": [{"name": "Ahmedabad"}, {"name": "Surat"}, {"name": "Vadodara"}, {"name": "Rajkot"}],
            "IN_MH": [{"name": "Mumbai"}, {"name": "Pune"}, {"name": "Nagpur"}],
            "IN_DL": [{"name": "New Delhi"}, {"name": "Dwarka"}],
            "IN_KA": [{"name": "Bengaluru"}, {"name": "Mysore"}],
            "US_CA": [{"name": "San Francisco"}, {"name": "Los Angeles"}, {"name": "San Jose"}],
            "US_NY": [{"name": "New York City"}, {"name": "Buffalo"}],
            "US_TX": [{"name": "Houston"}, {"name": "Austin"}, {"name": "Dallas"}],
            "GB_ENG": [{"name": "London"}, {"name": "Manchester"}, {"name": "Birmingham"}],
            "CA_ON": [{"name": "Toronto"}, {"name": "Ottawa"}]
        }
        key = f"{country_code.upper()}_{state_code.upper()}"
        return mocks.get(key, [])
    try:
        res = requests.get(f"{BASE_URL}/countries/{country_code.upper()}/states/{state_code.upper()}/cities", headers=get_headers(), timeout=5)
        if res.status_code == 200:
            return res.json()
        logger.error(f"CSC API returned code {res.status_code}")
        raise HTTPException(status_code=500, detail="Failed to fetch cities from provider")
    except Exception as e:
        logger.error(f"Error fetching cities: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
