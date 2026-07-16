from datetime import datetime, timedelta
from typing import Optional
from app.models.db import SessionLocal, CacheEntry

def get_cached_value(key_hash: str) -> Optional[str]:
    """
    Retrieves the cached value for a key_hash if it exists and has not expired.
    Automatically deletes expired entries on match or miss cleanups.
    """
    db = SessionLocal()
    try:
        now = datetime.utcnow()
        # Find entry
        entry = db.query(CacheEntry).filter(CacheEntry.key_hash == key_hash).first()
        if entry:
            if entry.expires_at > now:
                return entry.value
            else:
                # Delete expired entry
                db.delete(entry)
                db.commit()
    except Exception:
        # Fail gracefully in case of database issues
        pass
    finally:
        db.close()
    return None

def set_cached_value(key_hash: str, value: str, ttl_seconds: int) -> None:
    """
    Caches the value under key_hash with a defined TTL in seconds.
    Overwrites existing keys if they exist.
    """
    db = SessionLocal()
    try:
        now = datetime.utcnow()
        expires_at = now + timedelta(seconds=ttl_seconds)
        
        # Clean up any existing key first
        db.query(CacheEntry).filter(CacheEntry.key_hash == key_hash).delete()
        
        new_entry = CacheEntry(
            key_hash=key_hash,
            value=value,
            created_at=now,
            expires_at=expires_at
        )
        db.add(new_entry)
        db.commit()
    except Exception:
        # Fail gracefully
        pass
    finally:
        db.close()
