from __future__ import annotations

import os
from pathlib import Path
from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables / .env file."""

    model_config = SettingsConfigDict(
        env_file=os.path.join(Path(__file__).resolve().parent.parent, ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # --- API Keys (never logged) ---
    GROQ_API_KEY: str
    DEAPI_API_KEY: str

    # --- Model configuration ---
    GROQ_MODEL: str = "llama-3.3-70b-versatile"
    DEAPI_IMAGE_MODEL: str = "flux-1.1-schnell"
    DEAPI_BASE_URL: str = "https://api.deapi.ai"

    # --- App ---
    LOG_LEVEL: str = "INFO"
    DEAPI_POLL_INTERVAL: float = 2.0
    DEAPI_POLL_TIMEOUT: float = 120.0
    IMAGE_COUNT: int = 3


@lru_cache
def get_settings() -> Settings:
    """Singleton accessor – cached after the first call."""
    return Settings()
