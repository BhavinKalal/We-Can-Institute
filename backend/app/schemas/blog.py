from __future__ import annotations

from datetime import date, datetime
import re
from typing import Literal

from pydantic import BaseModel, Field, field_validator

BlogStatus = Literal["draft", "published"]
READ_TIME_PATTERN = re.compile(r"^\d{1,3}\s*(min|mins|minute|minutes)$", re.IGNORECASE)


class BlogPostInputBase(BaseModel):
    title: str = Field(..., min_length=3, max_length=120)
    excerpt: str | None = Field(None, max_length=350)
    content: str | None = Field(None, max_length=8000)
    category: str | None = Field(None, max_length=100)
    author: str | None = Field(None, max_length=80)
    read_time: str | None = Field(None, max_length=20)
    status: BlogStatus = "draft"
    featured: bool = False
    cover_image_url: str | None = Field(None, max_length=500)
    published_date: date | None = None
    sort_order: int = Field(0, ge=0)
    is_active: bool = True

    @field_validator("title", mode="before")
    @classmethod
    def normalize_title(cls, value: str) -> str:
        cleaned = " ".join(str(value or "").strip().split())
        if len(cleaned) < 3:
            raise ValueError("title must be at least 3 characters")
        return cleaned

    @field_validator("excerpt", "content", "category", "author", mode="before")
    @classmethod
    def normalize_optional_text(cls, value: str | None) -> str | None:
        if value is None:
            return None
        cleaned = str(value).strip()
        return cleaned or None

    @field_validator("read_time", mode="before")
    @classmethod
    def validate_read_time(cls, value: str | None) -> str | None:
        if value is None:
            return None
        cleaned = str(value).strip()
        if not cleaned:
            return None
        if not READ_TIME_PATTERN.fullmatch(cleaned):
            raise ValueError("read_time must look like '5 min'")
        return cleaned


class BlogPostCreate(BlogPostInputBase):
    pass


class BlogPostUpdate(BaseModel):
    title: str | None = Field(None, min_length=3, max_length=120)
    excerpt: str | None = Field(None, max_length=350)
    content: str | None = Field(None, max_length=8000)
    category: str | None = Field(None, max_length=100)
    author: str | None = Field(None, max_length=80)
    read_time: str | None = Field(None, max_length=20)
    status: BlogStatus | None = None
    featured: bool | None = None
    cover_image_url: str | None = Field(None, max_length=500)
    published_date: date | None = None
    sort_order: int | None = Field(None, ge=0)
    is_active: bool | None = None

    @field_validator("title", mode="before")
    @classmethod
    def normalize_title(cls, value: str | None) -> str | None:
        if value is None:
            return None
        cleaned = " ".join(str(value).strip().split())
        if len(cleaned) < 3:
            raise ValueError("title must be at least 3 characters")
        return cleaned

    @field_validator("excerpt", "content", "category", "author", mode="before")
    @classmethod
    def normalize_optional_text(cls, value: str | None) -> str | None:
        if value is None:
            return None
        cleaned = str(value).strip()
        return cleaned or None

    @field_validator("read_time", mode="before")
    @classmethod
    def validate_read_time(cls, value: str | None) -> str | None:
        if value is None:
            return None
        cleaned = str(value).strip()
        if not cleaned:
            return None
        if not READ_TIME_PATTERN.fullmatch(cleaned):
            raise ValueError("read_time must look like '5 min'")
        return cleaned


class BlogPost(BaseModel):
    title: str
    excerpt: str | None = None
    content: str | None = None
    category: str | None = None
    author: str | None = None
    read_time: str | None = None
    status: BlogStatus
    featured: bool
    cover_image_url: str | None = None
    published_date: date | None = None
    sort_order: int
    is_active: bool
    id: int
    updated_at: datetime

    class Config:
        from_attributes = True
