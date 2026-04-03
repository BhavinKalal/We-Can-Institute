from __future__ import annotations

from datetime import datetime, timezone

from sqlalchemy import inspect, select
from sqlalchemy.orm import Session, selectinload

from app.models.batch import Batch
from app.models.blog_post import BlogPost
from app.models.faculty_member import FacultyMember
from app.models.gallery_item import GalleryItem
from app.models.hero_section import HeroSection
from app.models.site_settings import SiteSettings
from app.models.testimonial import Testimonial
from app.schemas.homepage import HomepagePayload


def _homepage_schema_ready(db: Session) -> bool:
    inspector = inspect(db.get_bind())
    required_tables = {
        "hero_sections",
        "hero_stats",
        "site_settings",
        "batches",
        "faculty_members",
        "gallery_items",
        "blog_posts",
        "testimonials",
    }
    existing_tables = set(inspector.get_table_names())
    return required_tables.issubset(existing_tables)


def build_homepage_payload(db: Session) -> HomepagePayload:
    if not _homepage_schema_ready(db):
        return HomepagePayload(
            hero=None,
            settings=None,
            batches=[],
            faculty=[],
            gallery=[],
            blog_posts=[],
            testimonials=[],
            generated_at=datetime.now(timezone.utc),
        )

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

    faculty = list(
        db.scalars(
            select(FacultyMember)
            .where(FacultyMember.is_active.is_(True))
            .order_by(FacultyMember.sort_order.asc(), FacultyMember.id.asc())
        )
    )

    gallery = list(
        db.scalars(
            select(GalleryItem)
            .where(GalleryItem.is_visible.is_(True))
            .order_by(GalleryItem.sort_order.asc(), GalleryItem.id.asc())
        )
    )

    blog_posts = list(
        db.scalars(
            select(BlogPost)
            .where(BlogPost.is_active.is_(True), BlogPost.status == "published")
            .order_by(BlogPost.featured.desc(), BlogPost.published_date.desc().nullslast(), BlogPost.id.desc())
            .limit(8)
        )
    )

    testimonials = list(
        db.scalars(
            select(Testimonial)
            .where(Testimonial.is_active.is_(True))
            .order_by(Testimonial.sort_order.asc(), Testimonial.id.asc())
            .limit(8)
        )
    )

    return HomepagePayload(
        hero=hero,
        settings=settings,
        batches=batches,
        faculty=faculty,
        gallery=gallery,
        blog_posts=blog_posts,
        testimonials=testimonials,
        generated_at=datetime.now(timezone.utc),
    )
