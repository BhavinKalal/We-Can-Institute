from __future__ import annotations

from fastapi import APIRouter

from app.api.deps import AdminDep, SessionDep
from app.schemas.settings import Settings, SettingsUpdate
from app.services import settings_service

router = APIRouter(prefix="/settings", tags=["Settings"], dependencies=[AdminDep])


@router.get("/", response_model=Settings)
def read_settings(db: SessionDep):
    """
    Retrieve site settings.
    """
    return settings_service.get_or_create_settings(db)


@router.put("/", response_model=Settings)
def update_settings(db: SessionDep, settings_in: SettingsUpdate):
    """
    Update site settings.
    """
    return settings_service.update_settings(db, settings_in)
