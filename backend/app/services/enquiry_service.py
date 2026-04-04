from __future__ import annotations

from sqlalchemy import or_, select
from sqlalchemy.orm import Session

from app.models.enquiry import Enquiry
from app.schemas.enquiry import EnquiryCreate, EnquiryPublicCreate, EnquiryUpdate


def get_enquiry(db: Session, enquiry_id: int) -> Enquiry | None:
    return db.get(Enquiry, enquiry_id)


def get_enquiries(
    db: Session,
    skip: int = 0,
    limit: int | None = 200,
    q: str | None = None,
    batch_name: str | None = None,
    status: str | None = None,
) -> list[Enquiry]:
    statement = select(Enquiry)
    if q:
        term = f"%{q.strip()}%"
        statement = statement.where(or_(Enquiry.name.ilike(term), Enquiry.phone.ilike(term)))
    if batch_name:
        statement = statement.where(Enquiry.batch_name == batch_name)
    if status:
        statement = statement.where(Enquiry.status == status)

    statement = statement.offset(skip).order_by(Enquiry.submitted_at.desc(), Enquiry.id.desc())
    if limit is not None:
        statement = statement.limit(limit)

    return list(db.scalars(statement))


def create_enquiry(db: Session, enquiry_in: EnquiryCreate) -> Enquiry:
    enquiry = Enquiry(**enquiry_in.model_dump())
    db.add(enquiry)
    db.commit()
    db.refresh(enquiry)
    return enquiry


def create_public_enquiry(db: Session, enquiry_in: EnquiryPublicCreate) -> Enquiry:
    data = enquiry_in.model_dump()
    data["status"] = "new"
    data["source"] = "website"
    enquiry = Enquiry(**data)
    db.add(enquiry)
    db.commit()
    db.refresh(enquiry)
    return enquiry


def update_enquiry(db: Session, enquiry_id: int, enquiry_in: EnquiryUpdate) -> Enquiry | None:
    enquiry = get_enquiry(db, enquiry_id)
    if not enquiry:
        return None

    update_data = enquiry_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(enquiry, field, value)

    db.add(enquiry)
    db.commit()
    db.refresh(enquiry)
    return enquiry


def delete_enquiry(db: Session, enquiry_id: int) -> Enquiry | None:
    enquiry = get_enquiry(db, enquiry_id)
    if not enquiry:
        return None
    db.delete(enquiry)
    db.commit()
    return enquiry
