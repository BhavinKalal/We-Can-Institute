from __future__ import annotations

from pydantic import BaseModel, Field


class BatchBase(BaseModel):
    name: str = Field(..., max_length=150)
    level: str = Field(..., max_length=50)
    icon: str | None = Field(None, max_length=16)
    duration: str = Field(..., max_length=100)
    timing: str = Field(..., max_length=150)
    seats: int = Field(..., ge=0)
    filled: int = Field(..., ge=0)
    description: str
    badge: str | None = Field(None, max_length=100)
    sort_order: int = Field(0, ge=0)
    is_active: bool = True


class BatchCreate(BatchBase):
    pass


class BatchUpdate(BaseModel):
    name: str | None = Field(None, max_length=150)
    level: str | None = Field(None, max_length=50)
    icon: str | None = Field(None, max_length=16)
    duration: str | None = Field(None, max_length=100)
    timing: str | None = Field(None, max_length=150)
    seats: int | None = Field(None, ge=0)
    filled: int | None = Field(None, ge=0)
    description: str | None = None
    badge: str | None = Field(None, max_length=100)
    sort_order: int | None = Field(None, ge=0)
    is_active: bool | None = None


class Batch(BatchBase):
    id: int

    class Config:
        from_attributes = True
