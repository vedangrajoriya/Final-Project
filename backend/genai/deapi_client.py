from __future__ import annotations

import asyncio

import httpx
from core.config import get_settings
from core.logger import get_logger

logger = get_logger(__name__)


async def _submit_image_job(client: httpx.AsyncClient, prompt: str) -> str | None:
    """Submit a single image generation job and return the request_id."""
    import random

    settings = get_settings()

    headers = {
        "Authorization": f"Bearer {settings.DEAPI_API_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
        "prompt": prompt,
        "model": settings.DEAPI_IMAGE_MODEL,
        "width": 1024,
        "height": 1024,
        "steps": 4,
        "seed": random.randint(1, 999999),
    }

    url = f"{settings.DEAPI_BASE_URL}/api/v2/images/generations"
    logger.info("Submitting image generation job to deAPI")

    try:
        resp = await client.post(url, headers=headers, json=payload)
        resp.raise_for_status()
        data = resp.json()
        request_id = data.get("data", {}).get("request_id")
        if request_id:
            logger.info("Image job submitted: request_id=%s", request_id)
        return request_id
    except httpx.HTTPStatusError as exc:
        logger.error("deAPI submission failed: %s – %s", exc.response.status_code, exc.response.text[:200])
        return None
    except Exception as exc:
        logger.error("deAPI submission error: %s", exc)
        return None


async def _poll_job_result(client: httpx.AsyncClient, request_id: str) -> str | None:
    """Poll the deAPI jobs endpoint until the image is ready or timeout."""
    settings = get_settings()

    headers = {
        "Authorization": f"Bearer {settings.DEAPI_API_KEY}",
    }

    url = f"{settings.DEAPI_BASE_URL}/api/v2/jobs/{request_id}"
    elapsed = 0.0

    while elapsed < settings.DEAPI_POLL_TIMEOUT:
        try:
            resp = await client.get(url, headers=headers)
            resp.raise_for_status()
            data = resp.json()

            job_data = data.get("data", data)
            status = job_data.get("status", "")

            if status == "done":
                result_url = job_data.get("result_url") or job_data.get("output", [None])[0]
                if result_url:
                    logger.info("Image ready: %s", request_id)
                    return result_url

                # Try to find URL in nested structures
                outputs = job_data.get("output", job_data.get("outputs", []))
                if isinstance(outputs, list) and outputs:
                    return outputs[0] if isinstance(outputs[0], str) else str(outputs[0])

                logger.warning("Job done but no result URL found for %s", request_id)
                return None

            if status in ("failed", "error"):
                logger.error("Image job %s failed: %s", request_id, job_data.get("error", "unknown"))
                return None

        except httpx.HTTPStatusError:
            pass

        await asyncio.sleep(settings.DEAPI_POLL_INTERVAL)
        elapsed += settings.DEAPI_POLL_INTERVAL

    logger.warning("Timeout waiting for image job %s", request_id)
    return None


async def generate_images(prompts: list[str]) -> list[str]:
    """Generate images from a list of prompts. Returns a list of image URLs.

    Submits all jobs concurrently, then polls results concurrently.
    """
    if not prompts:
        return []

    async with httpx.AsyncClient(timeout=30.0) as client:
        # Submit all jobs concurrently
        submit_tasks = [_submit_image_job(client, p) for p in prompts]
        request_ids = await asyncio.gather(*submit_tasks)

        # Filter out failed submissions
        valid_ids = [rid for rid in request_ids if rid is not None]
        if not valid_ids:
            logger.error("All image generation submissions failed")
            return []

        # Poll all jobs concurrently
        poll_tasks = [_poll_job_result(client, rid) for rid in valid_ids]
        results = await asyncio.gather(*poll_tasks)

    image_urls = [url for url in results if url is not None]
    logger.info("Generated %d / %d images successfully", len(image_urls), len(prompts))
    return image_urls
