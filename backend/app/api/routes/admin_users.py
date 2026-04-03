from __future__ import annotations

from fastapi import APIRouter, HTTPException, status

from app.api.deps import SessionDep, SuperAdminDep
from app.schemas.admin_user import AdminUserCreate, AdminUserPublic, AdminUserUpdate
from app.services import admin_user_service


router = APIRouter(prefix="/users", tags=["Admin Users"], dependencies=[SuperAdminDep])


@router.get("/", response_model=list[AdminUserPublic])
def read_admin_users(db: SessionDep, skip: int = 0, limit: int = 200):
    return admin_user_service.get_admin_users(db, skip=skip, limit=limit)


@router.post("/", response_model=AdminUserPublic, status_code=status.HTTP_201_CREATED)
def create_admin_user(db: SessionDep, user_in: AdminUserCreate):
    return admin_user_service.create_admin_user(db, user_in)


@router.put("/{user_id}", response_model=AdminUserPublic)
def update_admin_user(db: SessionDep, user_id: int, user_in: AdminUserUpdate):
    user = admin_user_service.update_admin_user(db, user_id, user_in)
    if not user:
        raise HTTPException(status_code=404, detail="Admin user not found")
    return user


@router.delete("/{user_id}", response_model=AdminUserPublic)
def delete_admin_user(db: SessionDep, user_id: int):
    user = admin_user_service.delete_admin_user(db, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="Admin user not found")
    return user
