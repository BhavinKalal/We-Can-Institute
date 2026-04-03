from __future__ import annotations

from fastapi import APIRouter, HTTPException, status

from app.api.deps import AdminDep, SessionDep
from app.schemas.faculty import Faculty, FacultyCreate, FacultyUpdate
from app.services import faculty_service


router = APIRouter(prefix="/faculty", tags=["Faculty"], dependencies=[AdminDep])


@router.post("/", response_model=Faculty, status_code=status.HTTP_201_CREATED)
def create_faculty(db: SessionDep, faculty_in: FacultyCreate):
    return faculty_service.create_faculty_member(db, faculty_in)


@router.get("/", response_model=list[Faculty])
def read_faculty(db: SessionDep, skip: int = 0, limit: int = 100):
    return faculty_service.get_faculty_members(db, skip=skip, limit=limit)


@router.get("/{faculty_id}", response_model=Faculty)
def read_faculty_member(db: SessionDep, faculty_id: int):
    member = faculty_service.get_faculty_member(db, faculty_id)
    if not member:
        raise HTTPException(status_code=404, detail="Faculty member not found")
    return member


@router.put("/{faculty_id}", response_model=Faculty)
def update_faculty(db: SessionDep, faculty_id: int, faculty_in: FacultyUpdate):
    member = faculty_service.update_faculty_member(db, faculty_id, faculty_in)
    if not member:
        raise HTTPException(status_code=404, detail="Faculty member not found")
    return member


@router.delete("/{faculty_id}", response_model=Faculty)
def delete_faculty(db: SessionDep, faculty_id: int):
    member = faculty_service.delete_faculty_member(db, faculty_id)
    if not member:
        raise HTTPException(status_code=404, detail="Faculty member not found")
    return member
