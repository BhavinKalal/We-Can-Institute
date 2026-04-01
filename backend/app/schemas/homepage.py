from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class HeroStatPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    value: float
    suffix: str | None = None
    label: str
    sort_order: int


class HeroSectionPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    section_key: str
    video_url: str | None = None
    poster_url: str | None = None
    video_mode: bool
    eyebrow: str | None = None
    title_line1: str | None = None
    title_line2: str | None = None
    title_line3: str | None = None
    subtitle: str | None = None
    cta_text: str | None = None
    cta_subtext: str | None = None
    badge_text: str | None = None
    stats: list[HeroStatPublic] = Field(default_factory=list)
    updated_at: datetime


class SiteSettingsPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    site_key: str
    site_name: str
    tagline: str | None = None
    phone: str | None = None
    email: str | None = None
    address: str | None = None
    timings: str | None = None
    instagram: str | None = None
    facebook: str | None = None
    youtube: str | None = None
    whatsapp: str | None = None
    map_embed: str | None = None
    meta_title: str | None = None
    meta_description: str | None = None
    updated_at: datetime


class BatchPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    level: str
    icon: str | None = None
    duration: str
    timing: str
    seats: int
    filled: int
    description: str
    badge: str | None = None
    is_active: bool
    sort_order: int
    updated_at: datetime


class HomepagePayload(BaseModel):
    hero: HeroSectionPublic | None = None
    settings: SiteSettingsPublic | None = None
    batches: list[BatchPublic] = Field(default_factory=list)
    generated_at: datetime
