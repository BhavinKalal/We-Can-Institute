from __future__ import annotations

import csv
import io

from fastapi import APIRouter, HTTPException, status
from fastapi.responses import Response

from app.api.deps import AdminDep, SessionDep
from app.schemas.enquiry import Enquiry, EnquiryCreate, EnquiryUpdate
from app.services import enquiry_service


router = APIRouter(prefix="/enquiries", tags=["Enquiries"], dependencies=[AdminDep])


@router.post("/", response_model=Enquiry, status_code=status.HTTP_201_CREATED)
def create_enquiry(db: SessionDep, enquiry_in: EnquiryCreate):
    return enquiry_service.create_enquiry(db, enquiry_in)


@router.get("/", response_model=list[Enquiry])
def read_enquiries(
    db: SessionDep,
    skip: int = 0,
    limit: int = 200,
    q: str | None = None,
    batch_name: str | None = None,
    status_filter: str | None = None,
):
    return enquiry_service.get_enquiries(
        db,
        skip=skip,
        limit=limit,
        q=q,
        batch_name=batch_name,
        status=status_filter,
    )


@router.get("/export.csv")
def export_enquiries_csv(
    db: SessionDep,
    q: str | None = None,
    batch_name: str | None = None,
    status_filter: str | None = None,
):
    rows = enquiry_service.get_enquiries(
        db,
        skip=0,
        limit=None,
        q=q,
        batch_name=batch_name,
        status=status_filter,
    )

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["ID", "Name", "Phone", "Batch", "Status", "Notes", "Source", "Submitted At"])
    for row in rows:
        writer.writerow(
            [
                row.id,
                row.name or "",
                row.phone or "",
                row.batch_name or "",
                row.status or "",
                row.notes or "",
                row.source or "",
                row.submitted_at.isoformat() if row.submitted_at else "",
            ]
        )

    return Response(
        content=output.getvalue(),
        media_type="text/csv; charset=utf-8",
        headers={"Content-Disposition": "attachment; filename=enquiries.csv"},
    )


@router.get("/{enquiry_id}", response_model=Enquiry)
def read_enquiry(db: SessionDep, enquiry_id: int):
    enquiry = enquiry_service.get_enquiry(db, enquiry_id)
    if not enquiry:
        raise HTTPException(status_code=404, detail="Enquiry not found")
    return enquiry


@router.put("/{enquiry_id}", response_model=Enquiry)
def update_enquiry(db: SessionDep, enquiry_id: int, enquiry_in: EnquiryUpdate):
    enquiry = enquiry_service.update_enquiry(db, enquiry_id, enquiry_in)
    if not enquiry:
        raise HTTPException(status_code=404, detail="Enquiry not found")
    return enquiry


@router.delete("/{enquiry_id}", response_model=Enquiry)
def delete_enquiry(db: SessionDep, enquiry_id: int):
    enquiry = enquiry_service.delete_enquiry(db, enquiry_id)
    if not enquiry:
        raise HTTPException(status_code=404, detail="Enquiry not found")
    return enquiry
