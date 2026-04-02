from __future__ import annotations

from pydantic import BaseModel, Field


# Schemas for HeroStat
class HeroStatBase(BaseModel):
    value: float
    suffix: str | None = None
    label: str
    sort_order: int = 0


class HeroStatCreate(HeroStatBase):
    pass


class HeroStatUpdate(HeroStatBase):
    pass


class HeroStat(HeroStatBase):
    id: int

    class Config:
        from_attributes = True


# Schemas for HeroSection
class HeroSectionBase(BaseModel):
    section_key: str = "homepage"
    video_url: str | None = None
    poster_url: str | None = None
    video_mode: bool = True
    eyebrow: str | None = None
    title_line1: str | None = None
    title_line2: str | None = None
    title_line3: str | None = None
    subtitle: str | None = None
    cta_text: str | None = None
    cta_subtext: str | None = None
    badge_text: str | None = None
    is_active: bool = True


class HeroSectionCreate(HeroSectionBase):
    stats: list[HeroStatCreate] = []


class HeroSectionUpdate(HeroSectionBase):
    stats: list[HeroStatUpdate] = []


class HeroSection(HeroSectionBase):
    id: int
    stats: list[HeroStat] = []

    class Config:
        from_attributes = True
