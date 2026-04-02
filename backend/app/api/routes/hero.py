from __future__ import annotations

from fastapi import APIRouter, HTTPException

from app.api.deps import SessionDep
from app.schemas.hero import HeroSection, HeroSectionUpdate
from app.services import hero_service

router = APIRouter(prefix="/hero", tags=["Hero"])

HOMEPAGE_HERO_KEY = "homepage"


@router.get("/", response_model=HeroSection)
def read_hero_section(db: SessionDep):
    """
    Retrieve the homepage hero section.
    """
    hero = hero_service.get_hero_section_by_key(db, section_key=HOMEPAGE_HERO_KEY)
    if not hero:
        raise HTTPException(status_code=404, detail="Homepage hero section not found")
    return hero


@router.put("/", response_model=HeroSection)
def update_hero_section(db: SessionDep, hero_in: HeroSectionUpdate):
    """
    Update the homepage hero section.
    """
    hero = hero_service.update_hero_section(db, section_key=HOMEPAGE_HERO_KEY, hero_in=hero_in)
    if not hero:
        raise HTTPException(status_code=404, detail="Homepage hero section not found, cannot update")
    return hero
