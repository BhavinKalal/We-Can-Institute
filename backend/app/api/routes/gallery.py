from __future__ import annotations

from fastapi import APIRouter, HTTPException, status

from app.api.deps import AdminDep, SessionDep
from app.schemas.gallery import GalleryItem, GalleryItemCreate, GalleryItemUpdate
from app.services import gallery_service


router = APIRouter(prefix="/gallery", tags=["Gallery"], dependencies=[AdminDep])


@router.post("/", response_model=GalleryItem, status_code=status.HTTP_201_CREATED)
def create_gallery_item(db: SessionDep, item_in: GalleryItemCreate):
    return gallery_service.create_gallery_item(db, item_in)


@router.get("/", response_model=list[GalleryItem])
def read_gallery_items(db: SessionDep, skip: int = 0, limit: int = 200):
    return gallery_service.get_gallery_items(db, skip=skip, limit=limit)


@router.get("/{item_id}", response_model=GalleryItem)
def read_gallery_item(db: SessionDep, item_id: int):
    item = gallery_service.get_gallery_item(db, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Gallery item not found")
    return item


@router.put("/{item_id}", response_model=GalleryItem)
def update_gallery_item(db: SessionDep, item_id: int, item_in: GalleryItemUpdate):
    item = gallery_service.update_gallery_item(db, item_id, item_in)
    if not item:
        raise HTTPException(status_code=404, detail="Gallery item not found")
    return item


@router.delete("/{item_id}", response_model=GalleryItem)
def delete_gallery_item(db: SessionDep, item_id: int):
    item = gallery_service.delete_gallery_item(db, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Gallery item not found")
    return item
