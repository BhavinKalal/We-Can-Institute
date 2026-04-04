from __future__ import annotations

from sqlalchemy import Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base
from app.models.mixins import ActiveStatusMixin, TimestampMixin


class Testimonial(TimestampMixin, ActiveStatusMixin, Base):
    __tablename__ = "testimonials"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(150), nullable=False, index=True)
    role: Mapped[str | None] = mapped_column(String(180), nullable=True)
    quote: Mapped[str] = mapped_column(Text, nullable=False)
    initials: Mapped[str | None] = mapped_column(String(8), nullable=True)
    stars: Mapped[int] = mapped_column(Integer, nullable=False, default=5)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0, index=True)
