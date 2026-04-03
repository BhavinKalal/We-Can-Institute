from __future__ import annotations

from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.security import hash_password, verify_password
from app.models.admin_user import AdminUser


def get_admin_by_email(db: Session, email: str) -> AdminUser | None:
    return db.scalar(select(AdminUser).where(AdminUser.email == email).limit(1))


def ensure_super_admin(db: Session) -> AdminUser:
    admin = get_admin_by_email(db, settings.super_admin_email)
    if not admin:
        admin = AdminUser(
            email=settings.super_admin_email,
            full_name=settings.super_admin_full_name,
            role="super_admin",
            is_active=True,
            password_hash=hash_password(settings.super_admin_password),
        )
        db.add(admin)
        db.commit()
        db.refresh(admin)
        return admin

    needs_update = False
    if admin.role != "super_admin":
        admin.role = "super_admin"
        needs_update = True
    if not admin.is_active:
        admin.is_active = True
        needs_update = True
    if not admin.password_hash:
        admin.password_hash = hash_password(settings.super_admin_password)
        needs_update = True

    if needs_update:
        db.add(admin)
        db.commit()
        db.refresh(admin)
    return admin


def is_protected_super_admin(admin: AdminUser) -> bool:
    return admin.email == settings.super_admin_email and admin.role == "super_admin"


def count_super_admins(db: Session) -> int:
    return int(db.scalar(select(func.count()).select_from(AdminUser).where(AdminUser.role == "super_admin")) or 0)


def authenticate_admin(db: Session, email: str, password: str) -> AdminUser | None:
    ensure_super_admin(db)
    admin = get_admin_by_email(db, email)
    if not admin or not admin.is_active:
        return None
    if not verify_password(password, admin.password_hash):
        return None
    return admin
