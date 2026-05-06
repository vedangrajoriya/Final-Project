from __future__ import annotations

import logging
import sys
import re
from core.config import get_settings


_SENSITIVE_PATTERN = re.compile(
    r"((?:api[_-]?key|token|secret|password|authorization)[\"']?\s*[:=]\s*[\"']?)"
    r"([^\s\"',}{]+)",
    re.IGNORECASE,
)


class _SanitizingFormatter(logging.Formatter):
    """Redacts any leaked API keys / tokens from log output."""

    def format(self, record: logging.LogRecord) -> str:
        message = super().format(record)
        return _SENSITIVE_PATTERN.sub(r"\1[REDACTED]", message)


def setup_logging() -> None:
    """Configure root logger with sanitized console output."""
    settings = get_settings()

    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(
        _SanitizingFormatter(
            fmt="%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
            datefmt="%Y-%m-%d %H:%M:%S",
        )
    )

    root = logging.getLogger()
    root.setLevel(settings.LOG_LEVEL.upper())
    root.handlers.clear()
    root.addHandler(handler)

    # Quiet noisy third-party loggers
    for lib in ("httpx", "httpcore", "crewai", "langchain", "litellm"):
        logging.getLogger(lib).setLevel(logging.WARNING)


def get_logger(name: str) -> logging.Logger:
    """Return a child logger with the given name."""
    return logging.getLogger(name)
