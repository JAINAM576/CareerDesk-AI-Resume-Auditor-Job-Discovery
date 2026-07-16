import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.api.routes_resume import router as resume_router
from app.api.routes_skills import router as skills_router
from app.api.routes_jobs import router as jobs_router
from app.api.routes_location import router as location_router
from app.models.db import init_db

app = FastAPI(
    title="CareerDesk API",
    description="Backend service for ATS analysis, skill gap assessment, and job recommendations.",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(resume_router, prefix="/api")
app.include_router(skills_router, prefix="/api")
app.include_router(jobs_router, prefix="/api")
app.include_router(location_router, prefix="/api")

@app.on_event("startup")
def startup_event():
    init_db()

@app.get("/api/health")
def health_check():
    return {"status": "ok", "env": settings.APP_ENV}

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.APP_HOST,
        port=settings.APP_PORT,
        reload=True if settings.APP_ENV == "development" else False
    )
