from __future__ import annotations

from datetime import date, datetime

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
    linkedin: str | None = None
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


class FacultyPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    initials: str | None = None
    role: str
    speciality: str | None = None
    experience: str | None = None
    profile_photo_url: str | None = None
    tags: list[str] = Field(default_factory=list)
    bio: str | None = None
    is_active: bool
    sort_order: int
    updated_at: datetime


class GalleryItemPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    category: str
    media_type: str
    caption: str | None = None
    media_url: str | None = None
    external_video_url: str | None = None
    is_visible: bool
    sort_order: int
    item_date: date | None = None
    updated_at: datetime


class BlogPostPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    excerpt: str | None = None
    content: str | None = None
    category: str | None = None
    author: str | None = None
    read_time: str | None = None
    status: str
    featured: bool
    cover_image_url: str | None = None
    published_date: date | None = None
    sort_order: int
    updated_at: datetime


class TestimonialPublic(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    role: str | None = None
    quote: str
    initials: str | None = None
    stars: int
    sort_order: int
    updated_at: datetime


class HomepagePayload(BaseModel):
    hero: HeroSectionPublic | None = None
    settings: SiteSettingsPublic | None = None
    batches: list[BatchPublic] = Field(default_factory=list)
    faculty: list[FacultyPublic] = Field(default_factory=list)
    gallery: list[GalleryItemPublic] = Field(default_factory=list)
    blog_posts: list[BlogPostPublic] = Field(default_factory=list)
    testimonials: list[TestimonialPublic] = Field(default_factory=list)
    generated_at: datetime
