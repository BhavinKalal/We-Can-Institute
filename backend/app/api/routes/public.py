from __future__ import annotations

from fastapi import APIRouter, status

from app.api.deps import SessionDep
from app.schemas.enquiry import Enquiry, EnquiryPublicCreate
from app.schemas.homepage import HomepagePayload
from app.services import enquiry_service
from app.services.homepage import build_homepage_payload


router = APIRouter(prefix="/public", tags=["public"])


@router.get("/homepage", response_model=HomepagePayload)
def get_homepage(db: SessionDep) -> HomepagePayload:
    return build_homepage_payload(db)


@router.post("/enquiries", response_model=Enquiry, status_code=status.HTTP_201_CREATED)
def create_public_enquiry(db: SessionDep, enquiry_in: EnquiryPublicCreate):
    return enquiry_service.create_public_enquiry(db, enquiry_in)
