from __future__ import annotations

from datetime import datetime, timezone

from fastapi import APIRouter, HTTPException, status

from app.core.config import settings
from app.db.session import check_database_connection


router = APIRouter(prefix="/health", tags=["health"])


def _timestamp() -> str:
    return datetime.now(timezone.utc).isoformat()


@router.get("")
def health() -> dict[str, str]:
    return {
        "status": "ok",
        "app": settings.app_name,
        "environment": settings.environment,
        "timestamp": _timestamp(),
    }


@router.get("/ready")
def readiness() -> dict[str, str]:
    db_ok, message = check_database_connection()
    if not db_ok:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail={
                "status": "error",
                "database": "unavailable",
                "message": message,
                "timestamp": _timestamp(),
            },
        )

    return {
        "status": "ok",
        "database": "connected",
        "timestamp": _timestamp(),
    }
