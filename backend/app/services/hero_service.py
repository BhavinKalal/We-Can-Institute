from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload
from app.models.hero_section import HeroSection, HeroStat
from app.schemas.hero import HeroSectionUpdate


def get_hero_section_by_key(db: Session, section_key: str) -> HeroSection | None:
    statement = (
        select(HeroSection)
        .options(selectinload(HeroSection.stats))
        .where(HeroSection.section_key == section_key)
        .order_by(HeroSection.id.asc())
    )
    return db.scalars(statement).first()


def get_or_create_hero_section_by_key(db: Session, section_key: str) -> HeroSection:
    hero_section = get_hero_section_by_key(db, section_key=section_key)
    if hero_section:
        return hero_section

    hero_section = HeroSection(section_key=section_key)
    db.add(hero_section)
    db.commit()
    return get_hero_section_by_key(db, section_key=section_key) or hero_section


def set_hero_media_path(
    db: Session,
    section_key: str,
    media_field: str,
    media_path: str,
) -> tuple[HeroSection, str | None]:
    if media_field not in {"video_url", "poster_url"}:
        raise ValueError(f"Unsupported media field: {media_field}")

    hero_section = get_or_create_hero_section_by_key(db, section_key=section_key)
    previous_path = getattr(hero_section, media_field)
    setattr(hero_section, media_field, media_path)
    db.add(hero_section)
    db.commit()
    db.refresh(hero_section)
    return hero_section, previous_path


def update_hero_section(db: Session, section_key: str, hero_in: HeroSectionUpdate) -> HeroSection:
    hero_section = get_hero_section_by_key(db, section_key=section_key)
    hero_data = hero_in.model_dump(exclude={"stats"})
    hero_data["section_key"] = section_key

    if not hero_section:
        hero_section = HeroSection(**hero_data)
        db.add(hero_section)
        db.flush()
    else:
        for key, value in hero_data.items():
            setattr(hero_section, key, value)

    # Replace stats atomically via delete-orphan cascade.
    hero_section.stats = [
        HeroStat(
            value=stat.value,
            suffix=stat.suffix,
            label=stat.label,
            sort_order=idx,
        )
        for idx, stat in enumerate(hero_in.stats)
    ]

    db.commit()
    return get_hero_section_by_key(db, section_key=section_key) or hero_section
