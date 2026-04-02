from __future__ import annotations
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from app.api.deps import SessionDep
from app.schemas.batches import Batch, BatchCreate, BatchUpdate
from app.services import batch_service

router = APIRouter(prefix="/batches", tags=["Batches"])

@router.post("/", response_model=Batch, status_code=status.HTTP_201_CREATED)
def create_batch(db: SessionDep, batch_in: BatchCreate):
    """
    Create a new batch.
    """
    return batch_service.create_batch(db, batch_in)

@router.get("/", response_model=List[Batch])
def read_batches(db: SessionDep, skip: int = 0, limit: int = 100):
    """
    Retrieve a list of batches.
    """
    return batch_service.get_batches(db, skip=skip, limit=limit)

@router.get("/{batch_id}", response_model=Batch)
def read_batch(db: SessionDep, batch_id: int):
    """
    Retrieve a single batch by its ID.
    """
    batch = batch_service.get_batch(db, batch_id)
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found")
    return batch

@router.put("/{batch_id}", response_model=Batch)
def update_batch(db: SessionDep, batch_id: int, batch_in: BatchUpdate):
    """
    Update an existing batch.
    """
    batch = batch_service.update_batch(db, batch_id, batch_in)
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found, cannot update")
    return batch

@router.delete("/{batch_id}", response_model=Batch)
def delete_batch(db: SessionDep, batch_id: int):
    """
    Delete a batch.
    """
    batch = batch_service.delete_batch(db, batch_id)
    if not batch:
        raise HTTPException(status_code=404, detail="Batch not found, cannot delete")
    return batch
