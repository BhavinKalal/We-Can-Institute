from __future__ import annotations

from typing import Annotated

from fastapi import Depends, Header, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db


SessionDep = Annotated[Session, Depends(get_db)]


def get_current_admin(x_admin_token: Annotated[str | None, Header()] = None) -> None:
    # This is a placeholder for a real authentication system.
    # In a real system, you would decode a JWT token here.
    # For now, we are just checking for a static token.
    if x_admin_token != "super-secret-admin-token":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )


AdminDep = Depends(get_current_admin)
