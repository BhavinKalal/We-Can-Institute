from __future__ import annotations

from pathlib import Path
from uuid import uuid4

from fastapi import APIRouter, File, HTTPException, Request, UploadFile, status

from app.api.deps import AdminDep, SessionDep
from app.core.config import settings
from app.services import hero_service
from app.services.media_file_service import delete_media_file


router = APIRouter(prefix="/media", tags=["Media"], dependencies=[AdminDep])

ALLOWED_MEDIA_KINDS: dict[str, set[str]] = {
    "hero_video": {".mp4", ".webm", ".ogg", ".mov"},
    "hero_poster": {".jpg", ".jpeg", ".png", ".webp"},
    "faculty_profile": {".jpg", ".jpeg", ".png", ".webp"},
    "gallery_image": {".jpg", ".jpeg", ".png", ".webp"},
    "gallery_video": {".mp4", ".webm", ".ogg", ".mov"},
    "blog_cover": {".jpg", ".jpeg", ".png", ".webp"},
}
MAX_FILE_SIZE_BY_KIND: dict[str, int] = {
    "hero_video": 200 * 1024 * 1024,
    "gallery_video": 1024 * 1024 * 1024,
    "hero_poster": 20 * 1024 * 1024,
    "faculty_profile": 20 * 1024 * 1024,
    "gallery_image": 20 * 1024 * 1024,
    "blog_cover": 20 * 1024 * 1024,
}
HOMEPAGE_HERO_KEY = "homepage"
HERO_KIND_TO_FIELD = {
    "hero_video": "video_url",
    "hero_poster": "poster_url",
}


@router.post("/upload")
async def upload_media(
    request: Request,
    db: SessionDep,
    kind: str,
    file: UploadFile = File(...),
) -> dict[str, str | int]:
    if kind not in ALLOWED_MEDIA_KINDS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported media kind: {kind}",
        )

    original_name = file.filename or ""
    extension = Path(original_name).suffix.lower()
    if extension not in ALLOWED_MEDIA_KINDS[kind]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file type '{extension}' for {kind}",
        )

    target_dir = Path(settings.media_root) / kind
    target_dir.mkdir(parents=True, exist_ok=True)
    generated_name = f"{uuid4().hex}{extension}"
    target_path = target_dir / generated_name

    max_file_size = MAX_FILE_SIZE_BY_KIND.get(kind, 5 * 1024 * 1024)
    file_size = 0
    try:
        with target_path.open("wb") as output:
            while True:
                chunk = await file.read(1024 * 1024)
                if not chunk:
                    break
                file_size += len(chunk)
                if file_size > max_file_size:
                    raise HTTPException(
                        status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                        detail=f"File exceeds {max_file_size // (1024 * 1024)}MB limit for {kind}",
                    )
                output.write(chunk)
    except HTTPException:
        if target_path.exists():
            target_path.unlink(missing_ok=True)
        raise
    finally:
        await file.close()

    relative_url = f"{settings.media_url_path.rstrip('/')}/{kind}/{generated_name}"
    absolute_url = str(request.base_url).rstrip("/") + relative_url

    updated_field = HERO_KIND_TO_FIELD.get(kind)
    if updated_field:
        _, previous_path = hero_service.set_hero_media_path(
            db,
            section_key=HOMEPAGE_HERO_KEY,
            media_field=updated_field,
            media_path=relative_url,
        )
        if previous_path and previous_path != relative_url:
            delete_media_file(previous_path)

    return {
        "kind": kind,
        "filename": generated_name,
        "relative_url": relative_url,
        "url": absolute_url,
        "size": file_size,
    }
