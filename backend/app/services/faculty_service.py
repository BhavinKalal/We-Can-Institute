from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.faculty_member import FacultyMember
from app.schemas.faculty import FacultyCreate, FacultyUpdate


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

    update_data = faculty_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(member, field, value)

    db.add(member)
    db.commit()
    db.refresh(member)
    return member


def delete_faculty_member(db: Session, faculty_id: int) -> FacultyMember | None:
    member = get_faculty_member(db, faculty_id)
    if not member:
        return None
    db.delete(member)
    db.commit()
    return member
