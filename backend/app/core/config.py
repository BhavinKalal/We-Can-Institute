from __future__ import annotations

from functools import lru_cache
from pathlib import Path

from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


BASE_DIR = Path(__file__).resolve().parents[2]
DEFAULT_SQLITE_PATH = (BASE_DIR / "data" / "wecan.db").resolve()
DEFAULT_CORS_ORIGINS = [
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    "http://localhost:5501",
    "http://127.0.0.1:5501",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "null",
]


class Settings(BaseSettings):
    app_name: str = "WE CAN Institute API"
    api_v1_prefix: str = "/api/v1"
    environment: str = "development"
    debug: bool = True
    secret_key: str = "change-me"
    super_admin_email: str = "admin@wecan.local"
    super_admin_password: str = "admin123"
    super_admin_full_name: str = "Super Admin"
    admin_token_exp_minutes: int = 720
    database_url: str = f"sqlite:///{DEFAULT_SQLITE_PATH.as_posix()}"
    db_echo: bool = False
    media_root: str = str((BASE_DIR / "media").resolve())
    media_url_path: str = "/media"
    backend_cors_origins: list[str] = Field(default_factory=lambda: DEFAULT_CORS_ORIGINS.copy())

    @field_validator("debug", mode="before")
    @classmethod
    def normalize_debug(cls, value):
        if isinstance(value, bool):
            return value
        if value is None:
            return True
        text = str(value).strip().lower()
        if text in {"1", "true", "yes", "on", "debug", "dev", "development"}:
            return True
        if text in {"0", "false", "no", "off", "release", "prod", "production"}:
            return False
        return False

    @field_validator("backend_cors_origins", mode="before")
    @classmethod
    def normalize_cors_origins(cls, value):
        if value is None or value == "":
            return DEFAULT_CORS_ORIGINS.copy()
        if isinstance(value, str):
            text = value.strip()
            if not text:
                return []
            if text.startswith("["):
                import json
                return json.loads(text)
            return [item.strip() for item in text.split(",") if item.strip()]
        return value

    model_config = SettingsConfigDict(
        env_file=str(BASE_DIR / ".env"),
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
