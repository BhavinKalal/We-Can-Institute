from __future__ import annotations

from typing import Sequence
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.batch import Batch
from app.schemas.batches import BatchCreate, BatchUpdate


def get_batch(db: Session, batch_id: int) -> Batch | None:
    """Retrieve a single batch by its ID."""
    return db.query(Batch).filter(Batch.id == batch_id).first()


def get_batches(db: Session, skip: int = 0, limit: int = 100) -> Sequence[Batch]:
    """Retrieve a list of batches with pagination."""
    statement = select(Batch).offset(skip).limit(limit).order_by(Batch.sort_order, Batch.name)
    return db.execute(statement).scalars().all()


def create_batch(db: Session, batch_in: BatchCreate) -> Batch:
    """Create a new batch."""
    new_batch = Batch(**batch_in.model_dump())
    db.add(new_batch)
    db.commit()
    db.refresh(new_batch)
    return new_batch


def update_batch(db: Session, batch_id: int, batch_in: BatchUpdate) -> Batch | None:
    """Update an existing batch."""
    batch = get_batch(db, batch_id)
    if not batch:
        return None

    update_data = batch_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(batch, field, value)

    db.add(batch)
    db.commit()
    db.refresh(batch)
    return batch


def delete_batch(db: Session, batch_id: int) -> Batch | None:
    """Delete a batch."""
    batch = get_batch(db, batch_id)
    if not batch:
        return None
    db.delete(batch)
    db.commit()
    return batch
