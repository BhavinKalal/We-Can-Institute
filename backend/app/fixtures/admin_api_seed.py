from __future__ import annotations

import json
import shutil
from datetime import date, datetime, time, timedelta, timezone
from pathlib import Path
from typing import Any

from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload

from app.core.config import settings
from app.models.batch import Batch
from app.models.blog_post import BlogPost
from app.models.enquiry import Enquiry
from app.models.faculty_member import FacultyMember
from app.models.gallery_item import GalleryItem
from app.models.hero_section import HeroSection, HeroStat
from app.models.site_settings import SiteSettings
from app.models.testimonial import Testimonial
from app.schemas.batches import BatchCreate
from app.schemas.blog import BlogPostCreate
from app.schemas.faculty import FacultyCreate
from app.schemas.gallery import GalleryItemCreate
from app.schemas.hero import HeroSectionUpdate, HeroStatUpdate
from app.schemas.settings import SettingsUpdate
from app.schemas.testimonial import TestimonialCreate


DEFAULT_FIXTURE_PATH = Path(__file__).with_name("admin_api_mock.json")
DEFAULT_PLACEHOLDER_IMAGES = (
    "frontend/assets/images/hero/hero.png",
    "frontend/assets/images/hero/hero-bg.png",
    "frontend/assets/images/hero/hero-bg1.png",
    "frontend/assets/images/wecan-log.png",
    "frontend/assets/images/wecan-log.jpeg",
)
DEFAULT_PLACEHOLDER_VIDEO = "frontend/assets/videos/hero-section-video.mp4"


def load_admin_api_mock_fixture(path: Path | None = None) -> dict[str, Any]:
    fixture_path = Path(path or DEFAULT_FIXTURE_PATH)
    with fixture_path.open("r", encoding="utf-8") as fixture_file:
        return json.load(fixture_file)


def seed_admin_api_mock_fixture(
    db: Session,
    fixture_path: Path | None = None,
    *,
    repo_root: Path | None = None,
    media_root: Path | None = None,
) -> dict[str, int]:
    payload = load_admin_api_mock_fixture(fixture_path)
    repo_dir = Path(repo_root or Path(__file__).resolve().parents[3]).resolve()
    media_dir = Path(media_root or settings.media_root).resolve()
    media_dir.mkdir(parents=True, exist_ok=True)

    try:
        _seed_hero(db, payload.get("hero") or {}, repo_dir, media_dir)
        _seed_settings(db, payload.get("settings") or {})
        _seed_batches(db, payload.get("batches") or [])
        _seed_faculty(db, payload.get("faculty") or [])
        _seed_gallery(db, payload.get("gallery") or [], repo_dir, media_dir)
        _seed_blog(db, payload.get("blog") or [])
        _seed_testimonials(db, payload.get("testimonials") or [])
        _seed_enquiries(db, payload.get("enquiries") or [])
        db.commit()
    except Exception:
        db.rollback()
        raise

    return {
        "hero_sections": 1 if payload.get("hero") else 0,
        "hero_stats": len((payload.get("hero") or {}).get("stats") or []),
        "settings": 1 if payload.get("settings") else 0,
        "batches": len(payload.get("batches") or []),
        "faculty": len(payload.get("faculty") or []),
        "gallery": len(payload.get("gallery") or []),
        "blog_posts": len(payload.get("blog") or []),
        "testimonials": len(payload.get("testimonials") or []),
        "enquiries": len(payload.get("enquiries") or []),
    }


def _seed_hero(db: Session, hero_payload: dict[str, Any], repo_root: Path, media_root: Path) -> None:
    staged_video = _stage_fixture_asset(
        raw_path=hero_payload.get("videoUrl"),
        repo_root=repo_root,
        media_root=media_root,
        target_relative=Path("fixtures/hero/hero-section-video.mp4"),
    )
    staged_poster = _stage_fixture_asset(
        raw_path=hero_payload.get("posterUrl"),
        repo_root=repo_root,
        media_root=media_root,
        target_relative=Path("fixtures/hero/hero-poster.png"),
    )

    hero_in = HeroSectionUpdate(
        section_key="homepage",
        video_url=staged_video or hero_payload.get("videoUrl"),
        poster_url=staged_poster or hero_payload.get("posterUrl"),
        video_mode=True,
        eyebrow=hero_payload.get("eyebrow"),
        title_line1=hero_payload.get("titleLine1"),
        title_line2=hero_payload.get("titleLine2"),
        title_line3=hero_payload.get("titleLine3"),
        subtitle=hero_payload.get("subtitle"),
        cta_text=hero_payload.get("ctaText"),
        cta_subtext=hero_payload.get("ctaSubtext"),
        badge_text=hero_payload.get("badgeText"),
        is_active=True,
        stats=[
            HeroStatUpdate(
                value=float(stat.get("num", 0)),
                suffix=stat.get("suffix"),
                label=str(stat.get("label", "")).strip(),
                sort_order=index,
            )
            for index, stat in enumerate(hero_payload.get("stats") or [])
        ],
    )

    hero = db.scalar(
        select(HeroSection)
        .options(selectinload(HeroSection.stats))
        .where(HeroSection.section_key == "homepage")
        .order_by(HeroSection.id.asc())
    )
    hero_data = hero_in.model_dump(exclude={"stats"})
    if hero is None:
        hero = HeroSection(**hero_data)
        db.add(hero)
        db.flush()
    else:
        for field, value in hero_data.items():
            setattr(hero, field, value)

    hero.stats = [
        HeroStat(
            value=stat.value,
            suffix=stat.suffix,
            label=stat.label,
            sort_order=index,
        )
        for index, stat in enumerate(hero_in.stats)
    ]
    db.add(hero)


def _seed_settings(db: Session, settings_payload: dict[str, Any]) -> None:
    settings_in = SettingsUpdate(
        site_name=settings_payload.get("siteName"),
        tagline=settings_payload.get("tagline"),
        phone=settings_payload.get("phone"),
        email=settings_payload.get("email"),
        address=settings_payload.get("address"),
        timings=settings_payload.get("timings"),
        instagram=settings_payload.get("instagram"),
        facebook=settings_payload.get("facebook"),
        linkedin=settings_payload.get("linkedin"),
        youtube=settings_payload.get("youtube"),
        whatsapp=settings_payload.get("whatsapp"),
        map_embed=settings_payload.get("mapEmbed") or None,
        meta_title=settings_payload.get("metaTitle"),
        meta_description=settings_payload.get("metaDescription"),
    )

    row = db.scalar(
        select(SiteSettings)
        .where(SiteSettings.site_key == "default")
        .order_by(SiteSettings.id.asc())
    )
    data = settings_in.model_dump(exclude_unset=True, mode="json")
    data["site_key"] = "default"
    if row is None:
        row = SiteSettings(**data)
    else:
        for field, value in data.items():
            setattr(row, field, value)
    db.add(row)


def _seed_batches(db: Session, items: list[dict[str, Any]]) -> None:
    for index, item in enumerate(items):
        batch_in = BatchCreate(
            name=item.get("name"),
            level=item.get("level"),
            icon=item.get("icon") or None,
            duration=item.get("duration"),
            timing=item.get("timing"),
            seats=item.get("seats", 0),
            filled=item.get("filled", 0),
            description=item.get("description") or "",
            badge=item.get("badge") or None,
            sort_order=index,
            is_active=bool(item.get("active", True)),
        )
        row = db.scalar(select(Batch).where(Batch.name == batch_in.name).order_by(Batch.id.asc()))
        data = batch_in.model_dump()
        if row is None:
            row = Batch(**data)
        else:
            for field, value in data.items():
                setattr(row, field, value)
        db.add(row)


def _seed_faculty(db: Session, items: list[dict[str, Any]]) -> None:
    for index, item in enumerate(items):
        member_in = FacultyCreate(
            name=item.get("name"),
            initials=item.get("initials") or None,
            role=item.get("role"),
            speciality=item.get("speciality") or None,
            experience=item.get("experience") or None,
            profile_photo_url=item.get("photoUrl") or None,
            tags=item.get("tags") or [],
            bio=item.get("bio") or None,
            is_active=bool(item.get("active", True)),
            sort_order=index,
        )
        row = db.scalar(
            select(FacultyMember).where(FacultyMember.name == member_in.name).order_by(FacultyMember.id.asc())
        )
        data = member_in.model_dump()
        if row is None:
            row = FacultyMember(**data)
        else:
            for field, value in data.items():
                setattr(row, field, value)
        db.add(row)


def _seed_gallery(db: Session, items: list[dict[str, Any]], repo_root: Path, media_root: Path) -> None:
    placeholder_images = _existing_placeholder_images(repo_root)
    placeholder_video = _resolve_repo_asset(DEFAULT_PLACEHOLDER_VIDEO, repo_root)

    for index, item in enumerate(items):
        media_type = str(item.get("mediaType") or "image").strip().lower()
        raw_url = str(item.get("url") or "").strip()
        media_url: str | None = None
        external_video_url: str | None = None

        if raw_url.startswith("http://") or raw_url.startswith("https://"):
            if media_type == "video":
                external_video_url = raw_url
            else:
                media_url = raw_url
        elif raw_url:
            extension = Path(raw_url).suffix or (".mp4" if media_type == "video" else ".png")
            media_url = _stage_fixture_asset(
                raw_path=raw_url,
                repo_root=repo_root,
                media_root=media_root,
                target_relative=Path(f"fixtures/gallery/item-{index + 1:02d}{extension}"),
            )

        if not media_url and not external_video_url and media_type == "image":
            placeholder = placeholder_images[index % len(placeholder_images)]
            media_url = _copy_asset_to_media(
                source=placeholder,
                media_root=media_root,
                target_relative=Path(f"fixtures/gallery/item-{index + 1:02d}{placeholder.suffix.lower()}"),
            )

        if not media_url and not external_video_url and media_type == "video" and placeholder_video is not None:
            media_url = _copy_asset_to_media(
                source=placeholder_video,
                media_root=media_root,
                target_relative=Path("fixtures/gallery/confidence-challenge.mp4"),
            )

        item_in = GalleryItemCreate(
            category=item.get("category"),
            media_type=media_type,
            caption=item.get("caption") or None,
            media_url=media_url,
            external_video_url=external_video_url,
            is_visible=bool(item.get("active", True)),
            sort_order=index,
            item_date=_parse_date(item.get("date")),
        )

        row = db.scalar(
            select(GalleryItem)
            .where(
                GalleryItem.category == item_in.category,
                GalleryItem.caption == item_in.caption,
                GalleryItem.media_type == item_in.media_type,
            )
            .order_by(GalleryItem.id.asc())
        )
        data = item_in.model_dump()
        if data.get("external_video_url") is not None:
            data["external_video_url"] = str(data["external_video_url"])
        if row is None:
            row = GalleryItem(**data)
        else:
            for field, value in data.items():
                setattr(row, field, value)
        db.add(row)


def _seed_blog(db: Session, items: list[dict[str, Any]]) -> None:
    for index, item in enumerate(items):
        post_in = BlogPostCreate(
            title=item.get("title"),
            excerpt=item.get("excerpt") or None,
            content=item.get("content") or None,
            category=item.get("category") or None,
            author=item.get("author") or None,
            read_time=item.get("readTime") or None,
            status=item.get("status") or "draft",
            featured=bool(item.get("featured", False)),
            cover_image_url=item.get("coverImageUrl") or None,
            published_date=_parse_date(item.get("date")),
            sort_order=index,
            is_active=bool(item.get("active", True)),
        )
        row = db.scalar(select(BlogPost).where(BlogPost.title == post_in.title).order_by(BlogPost.id.asc()))
        data = post_in.model_dump()
        if row is None:
            row = BlogPost(**data)
        else:
            for field, value in data.items():
                setattr(row, field, value)
        db.add(row)


def _seed_testimonials(db: Session, items: list[dict[str, Any]]) -> None:
    for index, item in enumerate(items):
        testimonial_in = TestimonialCreate(
            name=item.get("name"),
            role=item.get("role") or None,
            quote=item.get("quote"),
            initials=item.get("initials") or None,
            stars=item.get("stars", 5),
            sort_order=index,
            is_active=bool(item.get("active", True)),
        )
        row = db.scalar(
            select(Testimonial).where(Testimonial.name == testimonial_in.name).order_by(Testimonial.id.asc())
        )
        data = testimonial_in.model_dump()
        if row is None:
            row = Testimonial(**data)
        else:
            for field, value in data.items():
                setattr(row, field, value)
        db.add(row)


def _seed_enquiries(db: Session, items: list[dict[str, Any]]) -> None:
    for index, item in enumerate(items):
        name = _normalize_whitespace(item.get("name"))
        batch_name = _normalize_whitespace(item.get("batch"))
        notes = _normalize_text(item.get("notes"))
        phone = _normalize_phone(item.get("phone"))
        submitted_at = _build_submitted_at(item.get("date"), index)
        row = db.scalar(
            select(Enquiry)
            .where(
                Enquiry.name == name,
                Enquiry.phone == phone,
                Enquiry.submitted_at == submitted_at,
            )
            .order_by(Enquiry.id.asc())
        )
        data = {
            "name": name,
            "phone": phone,
            "batch_name": batch_name,
            "status": item.get("status") or "new",
            "notes": notes,
        }
        data["source"] = item.get("source") or "website"
        data["submitted_at"] = submitted_at
        if row is None:
            row = Enquiry(**data)
        else:
            for field, value in data.items():
                setattr(row, field, value)
        db.add(row)


def _parse_date(value: Any) -> date | None:
    if value in {None, ""}:
        return None
    return date.fromisoformat(str(value))


def _build_submitted_at(value: Any, index: int) -> datetime:
    enquiry_date = _parse_date(value) or datetime.now(timezone.utc).date()
    return datetime.combine(enquiry_date, time(hour=9, minute=0, tzinfo=timezone.utc)) + timedelta(minutes=index)


def _normalize_phone(value: Any) -> str:
    digits = "".join(ch for ch in str(value or "") if ch.isdigit())
    if len(digits) == 12 and digits.startswith("91"):
        digits = digits[2:]
    elif len(digits) == 11 and digits.startswith("0"):
        digits = digits[1:]
    return digits


def _normalize_whitespace(value: Any) -> str | None:
    if value is None:
        return None
    cleaned = " ".join(str(value).strip().split())
    return cleaned or None


def _normalize_text(value: Any) -> str | None:
    if value is None:
        return None
    cleaned = str(value).strip()
    return cleaned or None


def _existing_placeholder_images(repo_root: Path) -> list[Path]:
    images = [path for raw_path in DEFAULT_PLACEHOLDER_IMAGES if (path := _resolve_repo_asset(raw_path, repo_root))]
    if not images:
        raise FileNotFoundError("No placeholder image assets were found for gallery fixture seeding.")
    return images


def _stage_fixture_asset(
    *,
    raw_path: str | None,
    repo_root: Path,
    media_root: Path,
    target_relative: Path,
) -> str | None:
    if not raw_path:
        return None
    if raw_path.startswith("http://") or raw_path.startswith("https://"):
        return raw_path
    source = _resolve_repo_asset(raw_path, repo_root)
    if source is None:
        return raw_path
    return _copy_asset_to_media(source=source, media_root=media_root, target_relative=target_relative)


def _resolve_repo_asset(raw_path: str, repo_root: Path) -> Path | None:
    cleaned = str(raw_path).strip().replace("\\", "/").lstrip("/")
    if not cleaned:
        return None

    candidates: list[Path] = []
    if cleaned.startswith("assets/"):
        candidates.append(repo_root / "frontend" / cleaned)
        candidates.append(repo_root / "admin-frontend" / cleaned)
    candidates.append(repo_root / cleaned)

    for candidate in candidates:
        if candidate.exists() and candidate.is_file():
            return candidate.resolve()
    return None


def _copy_asset_to_media(*, source: Path, media_root: Path, target_relative: Path) -> str:
    target_path = (media_root / target_relative).resolve()
    if media_root not in target_path.parents:
        raise ValueError(f"Refusing to write fixture media outside media root: {target_path}")
    target_path.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(source, target_path)
    return _media_url(target_relative)


def _media_url(target_relative: Path) -> str:
    prefix = settings.media_url_path.rstrip("/")
    return f"{prefix}/{target_relative.as_posix()}"
