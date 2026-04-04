from __future__ import annotations

from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base
from app.models.mixins import TimestampMixin


class SiteSettings(TimestampMixin, Base):
    __tablename__ = "site_settings"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    site_key: Mapped[str] = mapped_column(String(50), nullable=False, unique=True, default="default")
    site_name: Mapped[str] = mapped_column(String(255), nullable=False)
    tagline: Mapped[str | None] = mapped_column(String(255), nullable=True)
    phone: Mapped[str | None] = mapped_column(String(30), nullable=True)
    email: Mapped[str | None] = mapped_column(String(255), nullable=True)
    address: Mapped[str | None] = mapped_column(Text, nullable=True)
    timings: Mapped[str | None] = mapped_column(String(150), nullable=True)
    instagram: Mapped[str | None] = mapped_column(String(500), nullable=True)
    facebook: Mapped[str | None] = mapped_column(String(500), nullable=True)
    linkedin: Mapped[str | None] = mapped_column(String(500), nullable=True)
    youtube: Mapped[str | None] = mapped_column(String(500), nullable=True)
    whatsapp: Mapped[str | None] = mapped_column(String(30), nullable=True)
    map_embed: Mapped[str | None] = mapped_column(Text, nullable=True)
    meta_title: Mapped[str | None] = mapped_column(String(255), nullable=True)
    meta_description: Mapped[str | None] = mapped_column(Text, nullable=True)
