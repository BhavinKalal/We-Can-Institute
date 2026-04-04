from __future__ import annotations

from datetime import date

from sqlalchemy import Boolean, Date, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base
from app.models.mixins import ActiveStatusMixin, TimestampMixin


class BlogPost(TimestampMixin, ActiveStatusMixin, Base):
    __tablename__ = "blog_posts"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    excerpt: Mapped[str | None] = mapped_column(Text, nullable=True)
    content: Mapped[str | None] = mapped_column(Text, nullable=True)
    category: Mapped[str | None] = mapped_column(String(100), nullable=True, index=True)
    author: Mapped[str | None] = mapped_column(String(120), nullable=True)
    read_time: Mapped[str | None] = mapped_column(String(30), nullable=True)
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="draft", index=True)  # draft | published
    featured: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False, index=True)
    cover_image_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    published_date: Mapped[date | None] = mapped_column(Date, nullable=True, index=True)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0, index=True)
