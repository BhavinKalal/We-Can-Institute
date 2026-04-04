from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, Field


class FacultyBase(BaseModel):
    name: str = Field(..., max_length=150)
    initials: str | None = Field(None, max_length=8)
    role: str = Field(..., max_length=120)
    speciality: str | None = Field(None, max_length=255)
    experience: str | None = Field(None, max_length=100)
    profile_photo_url: str | None = Field(None, max_length=500)
    tags: list[str] = Field(default_factory=list)
    bio: str | None = None
    is_active: bool = True
    sort_order: int = Field(0, ge=0)


class FacultyCreate(FacultyBase):
    pass


class FacultyUpdate(BaseModel):
    name: str | None = Field(None, max_length=150)
    initials: str | None = Field(None, max_length=8)
    role: str | None = Field(None, max_length=120)
    speciality: str | None = Field(None, max_length=255)
    experience: str | None = Field(None, max_length=100)
    profile_photo_url: str | None = Field(None, max_length=500)
    tags: list[str] | None = None
    bio: str | None = None
    is_active: bool | None = None
    sort_order: int | None = Field(None, ge=0)


class Faculty(FacultyBase):
    id: int
    updated_at: datetime

    class Config:
        from_attributes = True
