from __future__ import annotations

from fastapi import APIRouter

from app.api.deps import AdminDep, SessionDep
from app.schemas.hero import HeroSection, HeroSectionUpdate
from app.services import hero_service

router = APIRouter(prefix="/hero", tags=["Hero"], dependencies=[AdminDep])

HOMEPAGE_HERO_KEY = "homepage"


@router.get("/", response_model=HeroSection)
def read_hero_section(db: SessionDep):
    """
    Retrieve the homepage hero section.
    """
    return hero_service.get_or_create_hero_section_by_key(db, section_key=HOMEPAGE_HERO_KEY)


@router.put("/", response_model=HeroSection)
def update_hero_section(db: SessionDep, hero_in: HeroSectionUpdate):
    """
    Update the homepage hero section.
    """
    return hero_service.update_hero_section(db, section_key=HOMEPAGE_HERO_KEY, hero_in=hero_in)
