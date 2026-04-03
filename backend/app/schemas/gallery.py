from __future__ import annotations

from datetime import date, datetime

from pydantic import BaseModel, Field, HttpUrl, model_validator


class GalleryItemBase(BaseModel):
    category: str = Field(..., max_length=50)
    media_type: str = Field(..., max_length=20)  # image | video
    caption: str | None = Field(None, max_length=255)
    media_url: str | None = Field(None, max_length=500)
    external_video_url: HttpUrl | None = None
    is_visible: bool = True
    sort_order: int = Field(0, ge=0)
    item_date: date | None = None

    @model_validator(mode="after")
    def validate_video_sources(self):
        if self.media_type == "image" and not self.media_url:
            raise ValueError("media_url is required for image items")
        if self.media_type == "video" and not (self.media_url or self.external_video_url):
            raise ValueError("Either media_url or external_video_url is required for video items")
        return self


class GalleryItemCreate(GalleryItemBase):
    pass


class GalleryItemUpdate(BaseModel):
    category: str | None = Field(None, max_length=50)
    media_type: str | None = Field(None, max_length=20)
    caption: str | None = Field(None, max_length=255)
    media_url: str | None = Field(None, max_length=500)
    external_video_url: HttpUrl | None = None
    is_visible: bool | None = None
    sort_order: int | None = Field(None, ge=0)
    item_date: date | None = None


class GalleryItem(GalleryItemBase):
    id: int
    updated_at: datetime

    class Config:
        from_attributes = True
