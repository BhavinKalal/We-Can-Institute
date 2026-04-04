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


def get_or_create_settings(db: Session) -> SiteSettings:
    settings = get_settings(db)
    if settings:
        return settings

    settings = SiteSettings(site_key="default", site_name="WE CAN Institute of English")
    db.add(settings)
    db.commit()
    db.refresh(settings)
    return settings


def update_settings(db: Session, settings_in: SettingsUpdate) -> SiteSettings:
    """
    Update the site settings.
    """
    settings = get_or_create_settings(db)

    # Use JSON mode so Pydantic HttpUrl values are converted to plain strings
    # before persisting to SQLAlchemy/SQLite.
    update_data = settings_in.model_dump(exclude_unset=True, mode="json")
    for field, value in update_data.items():
        setattr(settings, field, value)

    if not settings.site_name:
        settings.site_name = "WE CAN Institute of English"

    db.add(settings)
    db.commit()
    db.refresh(settings)
    return settings
