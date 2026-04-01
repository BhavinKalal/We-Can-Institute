from __future__ import annotations

from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.models.batch import Batch
from app.models.hero_section import HeroSection
from app.models.site_settings import SiteSettings
from app.schemas.homepage import HomepagePayload


def build_homepage_payload(db: Session) -> HomepagePayload:
    hero = db.scalar(
        select(HeroSection)
        .options(selectinload(HeroSection.stats))
        .where(HeroSection.section_key == "homepage", HeroSection.is_active.is_(True))
        .order_by(HeroSection.id.asc())
    )

    settings = db.scalar(
        select(SiteSettings)
        .where(SiteSettings.site_key == "default")
        .order_by(SiteSettings.id.asc())
    )

    batches = list(
        db.scalars(
            select(Batch)
            .where(Batch.is_active.is_(True))
            .order_by(Batch.sort_order.asc(), Batch.id.asc())
        )
    )

    return HomepagePayload(
        hero=hero,
        settings=settings,
        batches=batches,
        generated_at=datetime.now(timezone.utc),
    )
