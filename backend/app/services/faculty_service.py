from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.faculty_member import FacultyMember
from app.schemas.faculty import FacultyCreate, FacultyUpdate
from app.services.media_file_service import delete_media_file


def get_faculty_member(db: Session, faculty_id: int) -> FacultyMember | None:
    return db.get(FacultyMember, faculty_id)


def get_faculty_members(db: Session, skip: int = 0, limit: int = 100) -> list[FacultyMember]:
    statement = (
        select(FacultyMember)
        .offset(skip)
        .limit(limit)
        .order_by(FacultyMember.sort_order.asc(), FacultyMember.id.asc())
    )
    return list(db.scalars(statement))


def create_faculty_member(db: Session, faculty_in: FacultyCreate) -> FacultyMember:
    member = FacultyMember(**faculty_in.model_dump())
    db.add(member)
    db.commit()
    db.refresh(member)
    return member


def update_faculty_member(db: Session, faculty_id: int, faculty_in: FacultyUpdate) -> FacultyMember | None:
    member = get_faculty_member(db, faculty_id)
    if not member:
        return None

    old_photo = member.profile_photo_url
    update_data = faculty_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(member, field, value)

    db.add(member)
    db.commit()
    db.refresh(member)
    if old_photo and old_photo != member.profile_photo_url:
        delete_media_file(old_photo)
    return member


def delete_faculty_member(db: Session, faculty_id: int) -> FacultyMember | None:
    member = get_faculty_member(db, faculty_id)
    if not member:
        return None
    old_photo = member.profile_photo_url
    db.delete(member)
    db.commit()
    if old_photo:
        delete_media_file(old_photo)
    return member
