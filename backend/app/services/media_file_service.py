from __future__ import annotations

from pathlib import Path
from urllib.parse import urlparse

from app.core.config import settings


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


def delete_media_file(stored_value: str | None) -> bool:
    relative_path = _extract_media_relative_path(stored_value)
    if not relative_path:
        return False

    media_root = Path(settings.media_root).resolve()
    candidate = (media_root / relative_path).resolve()
    if media_root not in candidate.parents:
        return False

    existed = candidate.exists()
    candidate.unlink(missing_ok=True)
    return existed
