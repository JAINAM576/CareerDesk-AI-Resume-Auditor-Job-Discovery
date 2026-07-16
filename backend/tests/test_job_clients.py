import pytest
from unittest.mock import MagicMock
from app.services.job_clients.remoteok import fetch_remoteok_jobs
from app.services.job_clients.arbeitnow import fetch_arbeitnow_jobs

def test_fetch_remoteok_jobs(mocker):
    # Mock response data for RemoteOK
    mock_response = [
        {"legal": "Disclaimer about scraping"},
        {
            "company": "Test Company",
            "position": "Frontend Engineer",
            "location": "Worldwide",
            "date": "2026-07-06T12:00:00Z",
            "url": "https://remoteok.com/apply-here"
        }
    ]
    
    mock_get = mocker.patch("requests.get")
    mock_get.return_value.status_code = 200
    mock_get.return_value.json.return_value = mock_response
    
    jobs = fetch_remoteok_jobs("frontend")
    
    # It should skip the first legal item and return the job item
    assert len(jobs) == 1
    assert jobs[0].company == "Test Company"
    assert jobs[0].title == "Frontend Engineer"
    assert jobs[0].mode == "remote"
    assert jobs[0].posted == "2026-07-06"
    assert jobs[0].apply_url == "https://remoteok.com/apply-here"

def test_fetch_arbeitnow_jobs(mocker):
    # Mock response data for Arbeitnow
    mock_response = {
        "data": [
            {
                "title": "Python Developer",
                "company_name": "Arbeit Co",
                "location": "Berlin",
                "created_at": "2026-07-05T12:00:00Z",
                "url": "https://arbeitnow.com/job-123",
                "tags": ["python", "django", "remote"]
            },
            {
                "title": "Graphic Designer",
                "company_name": "Design Co",
                "location": "Munich",
                "created_at": "2026-07-05T12:00:00Z",
                "url": "https://arbeitnow.com/job-456",
                "tags": ["design"]
            }
        ]
    }
    
    mock_get = mocker.patch("requests.get")
    mock_get.return_value.status_code = 200
    mock_get.return_value.json.return_value = mock_response
    
    # Search for "python"
    jobs = fetch_arbeitnow_jobs("python")
    
    # Should filter matching roles and find only the Python Developer role
    assert len(jobs) == 1
    assert jobs[0].company == "Arbeit Co"
    assert jobs[0].title == "Python Developer"
    assert jobs[0].mode == "remote"
    assert jobs[0].posted == "2026-07-05"


