from datetime import datetime
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime, text
from sqlalchemy.orm import declarative_base, sessionmaker
from app.config import settings

Base = declarative_base()

class CacheEntry(Base):
    __tablename__ = "cache_entries"

    id = Column(Integer, primary_key=True, index=True)
    key_hash = Column(String(64), unique=True, index=True, nullable=False)
    value = Column(Text, nullable=False)
    created_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"), nullable=False)
    expires_at = Column(DateTime, nullable=False)

class ScanHistory(Base):
    __tablename__ = "scan_history"

    id = Column(Integer, primary_key=True, index=True)
    user_email = Column(String(255), index=True, nullable=False)
    file_name = Column(String(255), nullable=False)
    target_role = Column(String(255), nullable=False)
    location = Column(String(255), nullable=False)
    job_mode = Column(String(50), nullable=False)
    ats_score = Column(Integer, nullable=False)
    ats_data = Column(Text, nullable=False)  # Stored as JSON string
    skills_data = Column(Text, nullable=False)  # Stored as JSON string
    jobs_data = Column(Text, nullable=False)  # Stored as JSON string
    resume_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, server_default=text("CURRENT_TIMESTAMP"), nullable=False)

# Setup SQLAlchemy SQLite engine
engine = create_engine(
    settings.DATABASE_URL,
    connect_args={"check_same_thread": False} if settings.DATABASE_URL.startswith("sqlite") else {}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    """Initializes tables in the SQLite database."""
    Base.metadata.create_all(bind=engine)

def get_db():
    """Dependency for DB session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
