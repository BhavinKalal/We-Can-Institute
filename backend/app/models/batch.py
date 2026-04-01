from __future__ import annotations

from sqlalchemy import CheckConstraint, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base
from app.models.mixins import ActiveStatusMixin, TimestampMixin


class Batch(TimestampMixin, ActiveStatusMixin, Base):
    __tablename__ = "batches"
    __table_args__ = (
        CheckConstraint("seats >= 0", name="ck_batches_seats_non_negative"),
        CheckConstraint("filled >= 0", name="ck_batches_filled_non_negative"),
        CheckConstraint("filled <= seats", name="ck_batches_filled_lte_seats"),
        CheckConstraint("sort_order >= 0", name="ck_batches_sort_order_non_negative"),
    )

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(150), nullable=False, index=True)
    level: Mapped[str] = mapped_column(String(50), nullable=False, index=True)
    icon: Mapped[str | None] = mapped_column(String(16), nullable=True)
    duration: Mapped[str] = mapped_column(String(100), nullable=False)
    timing: Mapped[str] = mapped_column(String(150), nullable=False)
    seats: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    filled: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    badge: Mapped[str | None] = mapped_column(String(100), nullable=True)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0, index=True)
