from __future__ import annotations

from fastapi import APIRouter, HTTPException, status

from app.api.deps import AdminDep, SessionDep
from app.schemas.testimonial import Testimonial, TestimonialCreate, TestimonialUpdate
from app.services import testimonial_service


router = APIRouter(prefix="/testimonials", tags=["Testimonials"], dependencies=[AdminDep])


@router.post("/", response_model=Testimonial, status_code=status.HTTP_201_CREATED)
def create_testimonial(db: SessionDep, testimonial_in: TestimonialCreate):
    return testimonial_service.create_testimonial(db, testimonial_in)


@router.get("/", response_model=list[Testimonial])
def read_testimonials(db: SessionDep, skip: int = 0, limit: int = 100):
    return testimonial_service.get_testimonials(db, skip=skip, limit=limit)


@router.get("/{testimonial_id}", response_model=Testimonial)
def read_testimonial(db: SessionDep, testimonial_id: int):
    testimonial = testimonial_service.get_testimonial(db, testimonial_id)
    if not testimonial:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    return testimonial


@router.put("/{testimonial_id}", response_model=Testimonial)
def update_testimonial(db: SessionDep, testimonial_id: int, testimonial_in: TestimonialUpdate):
    testimonial = testimonial_service.update_testimonial(db, testimonial_id, testimonial_in)
    if not testimonial:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    return testimonial


@router.delete("/{testimonial_id}", response_model=Testimonial)
def delete_testimonial(db: SessionDep, testimonial_id: int):
    testimonial = testimonial_service.delete_testimonial(db, testimonial_id)
    if not testimonial:
        raise HTTPException(status_code=404, detail="Testimonial not found")
    return testimonial
