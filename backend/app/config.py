import os
from typing import List, Optional
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    APP_ENV: str = "development"
    APP_PORT: int = 8000
    APP_HOST: str = "0.0.0.0"
    CORS_ALLOWED_ORIGINS: str = "http://localhost:5173"
    
    DATABASE_URL: str = "sqlite:///./careerdesk.db"
    
    OPENROUTER_API_KEY: Optional[str] = None
    OPENROUTER_MODEL: str = "meta-llama/llama-3.3-70b-instruct:free"
    
    GROQ_API_KEY: Optional[str] = None
    GROQ_API_KEY1: Optional[str] = None
    GROQ_MODEL: str = "llama-3.3-70b-versatile"
    
    ADZUNA_APP_ID: Optional[str] = None
    ADZUNA_APP_KEY: Optional[str] = None
    
    LANGUAGETOOL_API_URL: str = "https://api.languagetool.org/v2/check"
    
    JOB_SEARCH_CACHE_TTL_SECONDS: int = 3600
    LLM_RESULT_CACHE_TTL_SECONDS: int = 86400
    
    MAX_RESUME_FILE_SIZE_MB: int = 5
    ALLOWED_RESUME_EXTENSIONS: str = ".pdf,.docx"
    USE_MINERU_PARSER: bool = True
    MINERU_API_TOKEN: Optional[str] = None
    COUNTRY_STATE_API_TOKEN: Optional[str] = None
    CLOUDINARY_CLOUD_NAME: Optional[str] = None
    CLOUDINARY_API_KEY: Optional[str] = None
    CLOUDINARY_API_SECRET: Optional[str] = None

    model_config = SettingsConfigDict(
        # Look for .env in the backend folder (one level above config.py)
        env_file=os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "backend", ".env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )

    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ALLOWED_ORIGINS.split(",") if origin.strip()]

    @property
    def allowed_extensions_list(self) -> List[str]:
        return [ext.strip().lower() for ext in self.ALLOWED_RESUME_EXTENSIONS.split(",") if ext.strip()]

settings = Settings()
