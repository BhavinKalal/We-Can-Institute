from __future__ import annotations

from datetime import datetime
import re
from typing import Literal

from pydantic import BaseModel, Field, field_validator


EnquiryStatus = Literal["new", "contacted", "enrolled", "closed"]
PHONE_PATTERN = re.compile(r"^[+\d][\d\s\-()]{5,29}$")


class EnquiryPublicCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=150)
    phone: str = Field(..., min_length=6, max_length=30)
    batch_name: str | None = Field(None, max_length=120)
    notes: str | None = None

    @field_validator("name")
    @classmethod
    def normalize_name(cls, value: str) -> str:
        cleaned = " ".join(value.strip().split())
        if len(cleaned) < 2:
            raise ValueError("name must be at least 2 characters")
        return cleaned

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, value: str) -> str:
        cleaned = value.strip()
        if not PHONE_PATTERN.fullmatch(cleaned):
            raise ValueError("phone must contain only digits and + - ( ) separators")
        return cleaned

    @field_validator("batch_name")
    @classmethod
    def normalize_batch_name(cls, value: str | None) -> str | None:
        if value is None:
            return None
        cleaned = " ".join(value.strip().split())
        return cleaned or None

    @field_validator("notes")
    @classmethod
    def normalize_notes(cls, value: str | None) -> str | None:
        if value is None:
            return None
        cleaned = value.strip()
        return cleaned or None


class EnquiryCreate(EnquiryPublicCreate):
    status: EnquiryStatus = "new"


class EnquiryUpdate(BaseModel):
    batch_name: str | None = Field(None, max_length=120)
    status: EnquiryStatus | None = None
    notes: str | None = None


class Enquiry(BaseModel):
    id: int
    name: str
    phone: str
    batch_name: str | None = None
    status: EnquiryStatus
    notes: str | None = None
    source: str
    submitted_at: datetime
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
