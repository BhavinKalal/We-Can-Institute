from __future__ import annotations

from datetime import date, datetime
from typing import Literal

from pydantic import BaseModel, Field

BlogStatus = Literal["draft", "published"]


class BlogPostBase(BaseModel):
    title: str = Field(..., max_length=255)
    excerpt: str | None = None
    content: str | None = None
    category: str | None = Field(None, max_length=100)
    author: str | None = Field(None, max_length=120)
    read_time: str | None = Field(None, max_length=30)
    status: BlogStatus = "draft"
    featured: bool = False
    cover_image_url: str | None = Field(None, max_length=500)
    published_date: date | None = None
    sort_order: int = Field(0, ge=0)
    is_active: bool = True


class BlogPostCreate(BlogPostBase):
    pass


class BlogPostUpdate(BaseModel):
    title: str | None = Field(None, max_length=255)
    excerpt: str | None = None
    content: str | None = None
    category: str | None = Field(None, max_length=100)
    author: str | None = Field(None, max_length=120)
    read_time: str | None = Field(None, max_length=30)
    status: BlogStatus | None = None
    featured: bool | None = None
    cover_image_url: str | None = Field(None, max_length=500)
    published_date: date | None = None
    sort_order: int | None = Field(None, ge=0)
    is_active: bool | None = None


class BlogPost(BlogPostBase):
    id: int
    updated_at: datetime

    class Config:
        from_attributes = True
