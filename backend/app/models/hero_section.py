from __future__ import annotations

from sqlalchemy import CheckConstraint, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.mixins import ActiveStatusMixin, TimestampMixin


class HeroSection(TimestampMixin, ActiveStatusMixin, Base):
    __tablename__ = "hero_sections"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    section_key: Mapped[str] = mapped_column(String(50), nullable=False, unique=True, default="homepage")
    video_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    poster_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    video_mode: Mapped[bool] = mapped_column(nullable=False, default=True)
    eyebrow: Mapped[str | None] = mapped_column(String(150), nullable=True)
    title_line1: Mapped[str | None] = mapped_column(String(150), nullable=True)
    title_line2: Mapped[str | None] = mapped_column(String(150), nullable=True)
    title_line3: Mapped[str | None] = mapped_column(String(150), nullable=True)
    subtitle: Mapped[str | None] = mapped_column(Text, nullable=True)
    cta_text: Mapped[str | None] = mapped_column(String(100), nullable=True)
    cta_subtext: Mapped[str | None] = mapped_column(String(255), nullable=True)
    badge_text: Mapped[str | None] = mapped_column(String(150), nullable=True)

    stats: Mapped[list["HeroStat"]] = relationship(
        back_populates="hero_section",
        cascade="all, delete-orphan",
        order_by="HeroStat.sort_order",
    )


class HeroStat(TimestampMixin, Base):
    __tablename__ = "hero_stats"
    __table_args__ = (
        CheckConstraint("sort_order >= 0", name="ck_hero_stats_sort_order_non_negative"),
    )

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    hero_section_id: Mapped[int] = mapped_column(ForeignKey("hero_sections.id", ondelete="CASCADE"), nullable=False, index=True)
    value: Mapped[float] = mapped_column(Float, nullable=False, default=0)
    suffix: Mapped[str | None] = mapped_column(String(20), nullable=True)
    label: Mapped[str] = mapped_column(String(100), nullable=False)
    sort_order: Mapped[int] = mapped_column(Integer, nullable=False, default=0, index=True)

    hero_section: Mapped[HeroSection] = relationship(back_populates="stats")
