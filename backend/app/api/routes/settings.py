from __future__ import annotations

from fastapi import APIRouter, HTTPException

from app.api.deps import SessionDep
from app.schemas.settings import Settings, SettingsUpdate
from app.services import settings_service

router = APIRouter(prefix="/settings", tags=["Settings"])


@router.get("/", response_model=Settings)
def read_settings(db: SessionDep):
    """
    Retrieve site settings.
    """
    settings = settings_service.get_settings(db)
    if not settings:
        raise HTTPException(status_code=404, detail="Settings not found")
    return settings


@router.put("/", response_model=Settings)
def update_settings(db: SessionDep, settings_in: SettingsUpdate):
    """
    Update site settings.
    """
    settings = settings_service.update_settings(db, settings_in)
    if not settings:
        raise HTTPException(status_code=404, detail="Settings not found, cannot update")
    return settings
