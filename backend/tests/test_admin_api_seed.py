from __future__ import annotations

from pathlib import Path

from sqlalchemy import create_engine, select
from sqlalchemy.orm import selectinload
from sqlalchemy.orm import Session, sessionmaker

from app.db.base import Base
from app.fixtures import seed_admin_api_mock_fixture
from app.models.batch import Batch
from app.models.blog_post import BlogPost
from app.models.enquiry import Enquiry
from app.models.faculty_member import FacultyMember
from app.models.gallery_item import GalleryItem
from app.models.hero_section import HeroSection
from app.models.site_settings import SiteSettings
from app.models.testimonial import Testimonial as TestimonialModel

# Ensure model metadata is fully registered before create_all.
import app.models as _models  # noqa: F401

TestimonialModel.__test__ = False


def test_admin_api_seed_populates_all_fixture_tables(tmp_path):
    db_path = tmp_path / "seed_test.db"
    media_root = tmp_path / "media"
    engine = create_engine(f"sqlite:///{db_path}", connect_args={"check_same_thread": False})
    SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False, class_=Session)
    Base.metadata.create_all(bind=engine)

    with SessionLocal() as db:
        summary = seed_admin_api_mock_fixture(db, media_root=media_root)
        summary_second_run = seed_admin_api_mock_fixture(db, media_root=media_root)

        hero = db.scalar(
            select(HeroSection)
            .options(selectinload(HeroSection.stats))
            .where(HeroSection.section_key == "homepage")
        )
        settings = db.scalar(select(SiteSettings).where(SiteSettings.site_key == "default"))
        batches = list(db.scalars(select(Batch).order_by(Batch.sort_order.asc(), Batch.id.asc())))
        faculty = list(db.scalars(select(FacultyMember).order_by(FacultyMember.sort_order.asc(), FacultyMember.id.asc())))
        gallery = list(db.scalars(select(GalleryItem).order_by(GalleryItem.sort_order.asc(), GalleryItem.id.asc())))
        blog_posts = list(db.scalars(select(BlogPost).order_by(BlogPost.sort_order.asc(), BlogPost.id.asc())))
        testimonials = list(
            db.scalars(select(TestimonialModel).order_by(TestimonialModel.sort_order.asc(), TestimonialModel.id.asc()))
        )
        enquiries = list(db.scalars(select(Enquiry).order_by(Enquiry.submitted_at.desc(), Enquiry.id.desc())))
        assert summary == summary_second_run
        assert summary["hero_sections"] == 1
        assert summary["hero_stats"] == 4
        assert summary["batches"] == 5
        assert summary["faculty"] == 4
        assert summary["gallery"] == 6
        assert summary["blog_posts"] == 5
        assert summary["testimonials"] == 4
        assert summary["enquiries"] == 8

        assert hero is not None
        assert hero.video_url == "/media/fixtures/hero/hero-section-video.mp4"
        assert hero.poster_url == "/media/fixtures/hero/hero-poster.png"
        assert len(hero.stats) == 4

        assert settings is not None
        assert settings.site_name == "WE CAN Institute of English"
        assert settings.instagram is None
        assert settings.facebook is None
        assert settings.linkedin is None
        assert settings.youtube is None

        assert [batch.name for batch in batches] == [
            "Phonics Batch",
            "Pre Basic",
            "Basic",
            "Pre Intermediate",
            "Intermediate",
        ]
        assert [member.initials for member in faculty] == ["MK", "RM", "SP", "AS"]
        assert all(item.media_url or item.external_video_url for item in gallery)
        assert gallery[4].media_type == "video"
        assert gallery[4].media_url == "/media/fixtures/gallery/confidence-challenge.mp4"
        assert blog_posts[0].title == "5 Daily Habits to Improve Your Spoken English"
        assert testimonials[-1].name == "Rahul Verma"
        assert enquiries[0].name == "Dev Shah"
        assert enquiries[-1].phone == "3210978901"

        assert (media_root / Path("fixtures/hero/hero-section-video.mp4")).exists()
        assert (media_root / Path("fixtures/gallery/confidence-challenge.mp4")).exists()
