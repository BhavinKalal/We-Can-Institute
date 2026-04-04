from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.testimonial import Testimonial
from app.schemas.testimonial import TestimonialCreate, TestimonialUpdate


def get_testimonial(db: Session, testimonial_id: int) -> Testimonial | None:
    return db.get(Testimonial, testimonial_id)


def get_testimonials(db: Session, skip: int = 0, limit: int = 100) -> list[Testimonial]:
    statement = (
        select(Testimonial)
        .offset(skip)
        .limit(limit)
        .order_by(Testimonial.sort_order.asc(), Testimonial.id.asc())
    )
    return list(db.scalars(statement))


def create_testimonial(db: Session, testimonial_in: TestimonialCreate) -> Testimonial:
    testimonial = Testimonial(**testimonial_in.model_dump())
    db.add(testimonial)
    db.commit()
    db.refresh(testimonial)
    return testimonial


def update_testimonial(
    db: Session, testimonial_id: int, testimonial_in: TestimonialUpdate
) -> Testimonial | None:
    testimonial = get_testimonial(db, testimonial_id)
    if not testimonial:
        return None

    update_data = testimonial_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(testimonial, field, value)

    db.add(testimonial)
    db.commit()
    db.refresh(testimonial)
    return testimonial


def delete_testimonial(db: Session, testimonial_id: int) -> Testimonial | None:
    testimonial = get_testimonial(db, testimonial_id)
    if not testimonial:
        return None
    db.delete(testimonial)
    db.commit()
    return testimonial
