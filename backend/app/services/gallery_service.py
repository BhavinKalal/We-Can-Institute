from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.gallery_item import GalleryItem
from app.schemas.gallery import GalleryItemCreate, GalleryItemUpdate
from app.services.media_file_service import delete_media_file


def get_gallery_item(db: Session, item_id: int) -> GalleryItem | None:
    return db.get(GalleryItem, item_id)


def get_gallery_items(db: Session, skip: int = 0, limit: int = 200) -> list[GalleryItem]:
    statement = (
        select(GalleryItem)
        .offset(skip)
        .limit(limit)
        .order_by(GalleryItem.sort_order.asc(), GalleryItem.id.asc())
    )
    return list(db.scalars(statement))


def create_gallery_item(db: Session, item_in: GalleryItemCreate) -> GalleryItem:
    data = item_in.model_dump()
    if data.get("external_video_url") is not None:
        data["external_video_url"] = str(data["external_video_url"])
    item = GalleryItem(**data)
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


def update_gallery_item(db: Session, item_id: int, item_in: GalleryItemUpdate) -> GalleryItem | None:
    item = get_gallery_item(db, item_id)
    if not item:
        return None

    old_media_url = item.media_url
    update_data = item_in.model_dump(exclude_unset=True)
    if update_data.get("external_video_url") is not None:
        update_data["external_video_url"] = str(update_data["external_video_url"])
    for field, value in update_data.items():
        setattr(item, field, value)

    db.add(item)
    db.commit()
    db.refresh(item)
    if old_media_url and old_media_url != item.media_url:
        delete_media_file(old_media_url)
    return item


def delete_gallery_item(db: Session, item_id: int) -> GalleryItem | None:
    item = get_gallery_item(db, item_id)
    if not item:
        return None
    old_media_url = item.media_url
    db.delete(item)
    db.commit()
    if old_media_url:
        delete_media_file(old_media_url)
    return item
