from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, Field


class TestimonialBase(BaseModel):
    name: str = Field(..., max_length=150)
    role: str | None = Field(None, max_length=180)
    quote: str = Field(..., min_length=1)
    initials: str | None = Field(None, max_length=8)
    stars: int = Field(5, ge=1, le=5)
    sort_order: int = Field(0, ge=0)
    is_active: bool = True


class TestimonialCreate(TestimonialBase):
    pass


class TestimonialUpdate(BaseModel):
    name: str | None = Field(None, max_length=150)
    role: str | None = Field(None, max_length=180)
    quote: str | None = Field(None, min_length=1)
    initials: str | None = Field(None, max_length=8)
    stars: int | None = Field(None, ge=1, le=5)
    sort_order: int | None = Field(None, ge=0)
    is_active: bool | None = None


class Testimonial(TestimonialBase):
    id: int
    updated_at: datetime

    class Config:
        from_attributes = True
