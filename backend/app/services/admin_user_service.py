from __future__ import annotations

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.security import hash_password
from app.models.admin_user import AdminUser
from app.schemas.admin_user import AdminUserCreate, AdminUserUpdate
from app.services.auth_service import count_super_admins, is_protected_super_admin


def get_admin_user(db: Session, user_id: int) -> AdminUser | None:
    return db.get(AdminUser, user_id)


def get_admin_users(db: Session, skip: int = 0, limit: int = 200) -> list[AdminUser]:
    return list(
        db.scalars(
            select(AdminUser)
            .offset(skip)
            .limit(limit)
            .order_by(AdminUser.role.desc(), AdminUser.email.asc())
        )
    )


def create_admin_user(db: Session, user_in: AdminUserCreate) -> AdminUser:
    email = user_in.email.strip().lower()
    exists = db.scalar(select(AdminUser).where(AdminUser.email == email).limit(1))
    if exists:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already exists")

    user = AdminUser(
        email=email,
        full_name=user_in.full_name,
        role=user_in.role,
        is_active=user_in.is_active,
        password_hash=hash_password(user_in.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def update_admin_user(db: Session, user_id: int, user_in: AdminUserUpdate) -> AdminUser | None:
    user = get_admin_user(db, user_id)
    if not user:
        return None

    update_data = user_in.model_dump(exclude_unset=True)

    if "email" in update_data and update_data["email"]:
        new_email = update_data["email"].strip().lower()
        email_owner = db.scalar(select(AdminUser).where(AdminUser.email == new_email).limit(1))
        if email_owner and email_owner.id != user_id:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already exists")
        update_data["email"] = new_email

    protected = is_protected_super_admin(user)

    if protected:
        if "email" in update_data and update_data["email"] != user.email:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Protected super admin email cannot be changed")
        if "role" in update_data and update_data["role"] != "super_admin":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Protected super admin role cannot be changed")
        if "is_active" in update_data and update_data["is_active"] is False:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Protected super admin cannot be deactivated")

    if "role" in update_data and update_data["role"] == "admin" and user.role == "super_admin":
        if count_super_admins(db) <= 1:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="At least one super admin is required")

    if "is_active" in update_data and update_data["is_active"] is False and user.role == "super_admin":
        if count_super_admins(db) <= 1:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="At least one active super admin is required")

    raw_password = update_data.pop("password", None)
    for field, value in update_data.items():
        setattr(user, field, value)

    if raw_password:
        user.password_hash = hash_password(raw_password)

    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def delete_admin_user(db: Session, user_id: int) -> AdminUser | None:
    user = get_admin_user(db, user_id)
    if not user:
        return None

    if is_protected_super_admin(user):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Protected super admin cannot be deleted")

    if user.role == "super_admin" and count_super_admins(db) <= 1:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="At least one super admin is required")

    db.delete(user)
    db.commit()
    return user
