from __future__ import annotations

from pydantic import BaseModel, HttpUrl


class SettingsBase(BaseModel):
    site_name: str | None = None
    tagline: str | None = None
    phone: str | None = None
    email: str | None = None
    address: str | None = None
    timings: str | None = None
    instagram: HttpUrl | None = None
    facebook: HttpUrl | None = None
    youtube: HttpUrl | None = None
    whatsapp: str | None = None
    map_embed: str | None = None
    meta_title: str | None = None
    meta_description: str | None = None


class Settings(SettingsBase):
    class Config:
        from_attributes = True


class SettingsUpdate(SettingsBase):
    pass
