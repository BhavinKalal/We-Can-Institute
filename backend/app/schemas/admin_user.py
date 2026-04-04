from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, Field


class AdminUserBase(BaseModel):
    email: str = Field(..., min_length=3, max_length=255)
    full_name: str | None = Field(None, max_length=255)
    role: str = Field("admin", pattern="^(admin|super_admin)$")
    is_active: bool = True


class AdminUserCreate(AdminUserBase):
    password: str = Field(..., min_length=6, max_length=128)


class AdminUserUpdate(BaseModel):
    email: str | None = Field(None, min_length=3, max_length=255)
    full_name: str | None = Field(None, max_length=255)
    role: str | None = Field(None, pattern="^(admin|super_admin)$")
    is_active: bool | None = None
    password: str | None = Field(None, min_length=6, max_length=128)


class AdminUserPublic(BaseModel):
    id: int
    email: str
    full_name: str | None = None
    role: str
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
