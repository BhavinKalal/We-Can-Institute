from __future__ import annotations

from datetime import datetime
import re
from typing import Literal

from pydantic import BaseModel, Field, field_validator


EnquiryStatus = Literal["new", "contacted", "enrolled", "closed"]
INDIAN_PHONE_PATTERN = re.compile(r"^[6-9]\d{9}$")


class EnquiryPublicCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=150)
    phone: str = Field(..., min_length=10, max_length=20)
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
        raw = value.strip()
        digits = "".join(ch for ch in raw if ch.isdigit())
        if len(digits) == 12 and digits.startswith("91"):
            digits = digits[2:]
        elif len(digits) == 11 and digits.startswith("0"):
            digits = digits[1:]
        if not INDIAN_PHONE_PATTERN.fullmatch(digits):
            raise ValueError("phone must be a valid Indian 10-digit mobile number")
        return digits

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
