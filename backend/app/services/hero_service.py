from __future__ import annotations

from sqlalchemy.orm import Session, joinedload

from app.models.hero_section import HeroSection, HeroStat
from app.schemas.hero import HeroSectionUpdate


def get_hero_section_by_key(db: Session, section_key: str) -> HeroSection | None:
    """
    Retrieve a hero section by its key, loading its stats.
    """
    return (
        db.query(HeroSection)
        .options(joinedload(HeroSection.stats))
        .filter(HeroSection.section_key == section_key)
        .first()
    )


def update_hero_section(db: Session, section_key: str, hero_in: HeroSectionUpdate) -> HeroSection | None:
    """
    Update a hero section.
    This will replace the stats associated with the hero section.
    """
    hero_section = get_hero_section_by_key(db, section_key)
    if not hero_section:
        return None

    # Update hero_section fields
    update_data = hero_in.model_dump(exclude={"stats"})
    for field, value in update_data.items():
        setattr(hero_section, field, value)

    # Replace stats
    hero_section.stats = []
    for stat_in in hero_in.stats:
        new_stat = HeroStat(**stat_in.model_dump())
        hero_section.stats.append(new_stat)

    db.add(hero_section)
    db.commit()
    db.refresh(hero_section)
    return hero_section
