from __future__ import annotations

import httpx
from core.config import get_settings
from core.logger import get_logger

logger = get_logger(__name__)

_GROQ_CHAT_URL = "https://api.groq.com/openai/v1/chat/completions"


async def generate_experience_text(prompt: str) -> str:
    """Call the Groq chat completions API and return the generated text.

    Uses async httpx for non-blocking I/O.
    """
    settings = get_settings()

    headers = {
        "Authorization": f"Bearer {settings.GROQ_API_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": settings.GROQ_MODEL,
        "messages": [
            {
                "role": "system",
                "content": (
                    "You are a world-class luxury travel narrator. "
                    "Respond with rich, immersive prose only. "
                    "No markdown, no bullet points, no headers."
                ),
            },
            {"role": "user", "content": prompt},
        ],
        "temperature": 0.8,
        "max_tokens": 1024,
        "top_p": 0.9,
    }

    logger.info("Sending request to Groq API (model=%s)", settings.GROQ_MODEL)

    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.post(_GROQ_CHAT_URL, headers=headers, json=payload)
        response.raise_for_status()

    data = response.json()
    text = data["choices"][0]["message"]["content"].strip()
    logger.info("Groq response received (%d chars)", len(text))
    return text
