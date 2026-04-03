from __future__ import annotations

from pydantic import BaseModel, HttpUrl, field_validator


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

    @field_validator("instagram", "facebook", "youtube", mode="before")
    @classmethod
    def empty_string_to_none(cls, value):
        if isinstance(value, str) and not value.strip():
            return None
        return value


class Settings(SettingsBase):
    class Config:
        from_attributes = True


class SettingsUpdate(SettingsBase):
    pass
