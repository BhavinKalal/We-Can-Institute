from __future__ import annotations

from sqlalchemy.orm import Session
from app.models.site_settings import SiteSettings
from app.schemas.settings import SettingsUpdate


def get_settings(db: Session) -> SiteSettings | None:
    """
    Retrieve the site settings.
    There should only be one row with site_key = 'default'.
    """
    return db.query(SiteSettings).filter(SiteSettings.site_key == "default").first()


def update_settings(db: Session, settings_in: SettingsUpdate) -> SiteSettings | None:
    """
    Update the site settings.
    """
    settings = get_settings(db)
    if settings:
        update_data = settings_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(settings, field, value)
        db.add(settings)
        db.commit()
        db.refresh(settings)
    return settings
