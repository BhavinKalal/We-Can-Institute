from __future__ import annotations

from pydantic import BaseModel, Field
from fastapi import APIRouter, HTTPException, status

from app.api.deps import CurrentAdminDep, SessionDep
from app.core.config import settings
from app.core.security import create_access_token, hash_password, verify_password
from app.services.auth_service import authenticate_admin, ensure_super_admin, get_admin_by_email


router = APIRouter(prefix="/auth", tags=["auth"])


class LoginRequest(BaseModel):
    email: str = Field(..., min_length=3, max_length=255)
    password: str = Field(..., min_length=1)


class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    email: str
    full_name: str | None = None
    role: str


@router.post("/login", response_model=LoginResponse)
def login(data: LoginRequest, db: SessionDep):
    ensure_super_admin(db)
    admin = authenticate_admin(db, data.email.strip().lower(), data.password)
    if not admin:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = create_access_token(subject=admin.email, expires_minutes=settings.admin_token_exp_minutes)
    return LoginResponse(
        access_token=token,
        expires_in=settings.admin_token_exp_minutes * 60,
        email=admin.email,
        full_name=admin.full_name,
        role=admin.role,
    )


@router.get("/me")
def me(current_admin: CurrentAdminDep):
    return {
        "authenticated": True,
        "id": current_admin.id,
        "email": current_admin.email,
        "full_name": current_admin.full_name,
        "role": current_admin.role,
        "is_active": current_admin.is_active,
    }


class ChangePasswordRequest(BaseModel):
    current_password: str = Field(..., min_length=1)
    new_password: str = Field(..., min_length=6, max_length=128)


@router.post("/change-password")
def change_password(payload: ChangePasswordRequest, db: SessionDep, current_admin: CurrentAdminDep):
    admin = get_admin_by_email(db, current_admin.email)
    if not admin or not verify_password(payload.current_password, admin.password_hash):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Current password is incorrect")

    admin.password_hash = hash_password(payload.new_password)
    db.add(admin)
    db.commit()
    return {"success": True}
