from __future__ import annotations

import asyncio

from core.config import get_settings
from core.logger import get_logger
from genai.prompt_builder import build_experience_prompt, build_image_prompts
from genai.groq_client import generate_experience_text
from genai.deapi_client import generate_images
from models.request import TravelRequest
from models.response import TravelResponse
from orchestrator.main_orchestrator import run_crew
from orchestrator.aggregator import aggregate

logger = get_logger(__name__)


async def generate_travel_experience(request: TravelRequest) -> TravelResponse:
    """End-to-end orchestration of the travel experience pipeline.

    Flow:
        1. Run CrewAI agents (threaded) to get structured data.
        2. Concurrently:
           a. Call Groq to generate narrative description.
           b. Call deAPI to generate images.
        3. Aggregate all outputs into TravelResponse.
    """
    settings = get_settings()

    logger.info(
        "Starting pipeline: destination=%s, days=%d, budget=%s",
        request.destination,
        request.days,
        request.budget,
    )

    # ── Step 1: Run the agentic system ──────────────────────────────────
    crew_data = await run_crew(request)
    logger.info("Crew data keys: %s", list(crew_data.keys()))

    # ── Step 2: Build prompts from crew output ──────────────────────────
    itinerary_summary = _summarize_itinerary(crew_data)

    experience_prompt = build_experience_prompt(
        destination=request.destination,
        days=request.days,
        preferences=request.preferences,
        itinerary_summary=itinerary_summary,
    )

    image_prompts = build_image_prompts(
        destination=request.destination,
        preferences=request.preferences,
        count=settings.IMAGE_COUNT,
    )

    # ── Step 3: Run GenAI calls concurrently ────────────────────────────
    experience_text, image_urls = await asyncio.gather(
        generate_experience_text(experience_prompt),
        generate_images(image_prompts),
    )

    # ── Step 4: Aggregate ───────────────────────────────────────────────
    response = aggregate(
        destination=request.destination,
        crew_data=crew_data,
        experience_text=experience_text,
        image_urls=image_urls,
    )

    logger.info("Pipeline complete for %s", request.destination)
    return response


def _summarize_itinerary(crew_data: dict) -> str:
    """Create a plain-text summary of the itinerary for the LLM prompt."""
    itinerary = crew_data.get("itinerary", [])
    if not itinerary:
        return "No specific itinerary available yet."

    lines: list[str] = []
    for day_info in itinerary:
        if isinstance(day_info, dict):
            day_num = day_info.get("day", "?")
            title = day_info.get("title", "")
            activities = day_info.get("activities", [])
            acts = ", ".join(activities) if activities else "free exploration"
            lines.append(f"Day {day_num} – {title}: {acts}")

    return "\n".join(lines) if lines else "General exploration plan."
