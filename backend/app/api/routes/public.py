from __future__ import annotations

from fastapi import APIRouter

from app.api.deps import SessionDep
from app.schemas.homepage import HomepagePayload
from app.services.homepage import build_homepage_payload


router = APIRouter(prefix="/public", tags=["public"])


@router.get("/homepage", response_model=HomepagePayload)
def get_homepage(db: SessionDep) -> HomepagePayload:
    return build_homepage_payload(db)
