from __future__ import annotations

import pytest
from pydantic import ValidationError

from app.schemas.blog import BlogPostCreate
from app.schemas.enquiry import EnquiryPublicCreate


def test_enquiry_phone_rejects_too_short_digits():
    with pytest.raises(ValidationError):
        EnquiryPublicCreate(name="Test User", phone="12345", batch_name="Basic")


def test_enquiry_phone_rejects_too_long_digits():
    with pytest.raises(ValidationError):
        EnquiryPublicCreate(name="Test User", phone="+91 1234567890123456", batch_name="Basic")


def test_enquiry_phone_accepts_indian_mobile_with_country_code():
    payload = EnquiryPublicCreate(name="Test User", phone="+91 9876543210", batch_name="Basic")
    assert payload.phone == "9876543210"


def test_enquiry_phone_rejects_non_indian_start_digit():
    with pytest.raises(ValidationError):
        EnquiryPublicCreate(name="Test User", phone="1234567890", batch_name="Basic")


def test_blog_rejects_too_long_excerpt():
    with pytest.raises(ValidationError):
        BlogPostCreate(
            title="Valid Blog Title",
            excerpt="x" * 351,
            content="Valid content",
            category="Tips & Tricks",
            author="Author",
            read_time="5 min",
            status="draft",
            featured=False,
            sort_order=0,
            is_active=True,
        )


def test_blog_rejects_invalid_read_time():
    with pytest.raises(ValidationError):
        BlogPostCreate(
            title="Valid Blog Title",
            excerpt="Valid excerpt",
            content="Valid content",
            category="Tips & Tricks",
            author="Author",
            read_time="five minutes",
            status="draft",
            featured=False,
            sort_order=0,
            is_active=True,
        )
