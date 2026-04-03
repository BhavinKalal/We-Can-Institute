from __future__ import annotations

from pathlib import Path
from urllib.parse import urlparse
from uuid import uuid4

from fastapi import APIRouter, File, HTTPException, Request, UploadFile, status

from app.api.deps import AdminDep, SessionDep
from app.core.config import settings
from app.services import hero_service


router = APIRouter(prefix="/media", tags=["Media"], dependencies=[AdminDep])

ALLOWED_MEDIA_KINDS: dict[str, set[str]] = {
    "hero_video": {".mp4", ".webm", ".ogg", ".mov"},
    "hero_poster": {".jpg", ".jpeg", ".png", ".webp"},
    "faculty_profile": {".jpg", ".jpeg", ".png", ".webp"},
    "gallery_image": {".jpg", ".jpeg", ".png", ".webp"},
    "gallery_video": {".mp4", ".webm", ".ogg", ".mov"},
    "blog_cover": {".jpg", ".jpeg", ".png", ".webp"},
}
MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024  # 50 MB
HOMEPAGE_HERO_KEY = "homepage"
HERO_KIND_TO_FIELD = {
    "hero_video": "video_url",
    "hero_poster": "poster_url",
}


def _extract_media_relative_path(stored_value: str | None) -> Path | None:
    if not stored_value:
        return None

    parsed = urlparse(stored_value)
    path = parsed.path if parsed.scheme else stored_value
    media_prefix = settings.media_url_path.rstrip("/") + "/"
    if not path.startswith(media_prefix):
        return None

    relative = path[len(media_prefix) :].lstrip("/")
    if not relative:
        return None
    return Path(relative)


def _delete_old_media_file(stored_value: str | None) -> None:
    relative_path = _extract_media_relative_path(stored_value)
    if not relative_path:
        return

    media_root = Path(settings.media_root).resolve()
    candidate = (media_root / relative_path).resolve()
    if media_root not in candidate.parents:
        return

    candidate.unlink(missing_ok=True)


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

    file_size = 0
    try:
        with target_path.open("wb") as output:
            while True:
                chunk = await file.read(1024 * 1024)
                if not chunk:
                    break
                file_size += len(chunk)
                if file_size > MAX_FILE_SIZE_BYTES:
                    raise HTTPException(
                        status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
                        detail="File exceeds 50MB limit",
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
            _delete_old_media_file(previous_path)

    return {
        "kind": kind,
        "filename": generated_name,
        "relative_url": relative_url,
        "url": absolute_url,
        "size": file_size,
    }
