from __future__ import annotations

from fastapi import APIRouter, HTTPException
from core.logger import get_logger
from models.request import TravelRequest
from models.response import TravelResponse
from services.experience_service import generate_travel_experience

logger = get_logger(__name__)

router = APIRouter()


@router.post(
    "/generate-experience",
    response_model=TravelResponse,
    summary="Generate a complete AI-powered travel experience",
    description=(
        "Accepts a travel request and orchestrates a multi-agent AI system "
        "(CrewAI) combined with generative AI (Groq LLM + deAPI image generation) "
        "to produce a structured travel plan with itinerary, hotels, budget, "
        "narrative description, and destination images."
    ),
    response_model_exclude_none=True,
)
async def generate_experience(request: TravelRequest) -> TravelResponse:
    """Primary endpoint – generates a full travel experience."""
    try:
        logger.info(
            "Received request: destination=%s, days=%d",
            request.destination,
            request.days,
        )
        result = await generate_travel_experience(request)
        return result

    except Exception as exc:
        logger.exception("Pipeline failed for destination=%s", request.destination)
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate travel experience: {str(exc)}",
        ) from exc


@router.get(
    "/health",
    summary="Health check",
    response_model=dict,
)
async def health_check() -> dict:
    """Simple liveness probe."""
    return {"status": "healthy", "service": "ai-hospitality-platform"}
