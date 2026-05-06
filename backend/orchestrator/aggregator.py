from __future__ import annotations

from core.logger import get_logger
from models.response import TravelResponse, ItineraryDay, HotelRecommendation

logger = get_logger(__name__)


def aggregate(
    destination: str,
    crew_data: dict,
    experience_text: str,
    image_urls: list[str],
) -> TravelResponse:
    """Merge all outputs into the final TravelResponse.

    Handles missing / malformed fields gracefully.
    """
    # --- Itinerary ---
    raw_itinerary = crew_data.get("itinerary", [])
    itinerary: list[ItineraryDay] = []
    for item in raw_itinerary:
        if isinstance(item, dict):
            try:
                itinerary.append(
                    ItineraryDay(
                        day=item.get("day", len(itinerary) + 1),
                        title=item.get("title", f"Day {len(itinerary) + 1}"),
                        activities=item.get("activities", []),
                    )
                )
            except Exception:
                continue

    # --- Hotels ---
    raw_hotels = crew_data.get("hotels", [])
    hotels: list[HotelRecommendation] = []
    for item in raw_hotels:
        if isinstance(item, dict):
            try:
                hotels.append(
                    HotelRecommendation(
                        name=item.get("name", "Unknown Hotel"),
                        category=item.get("category", ""),
                        price_range=item.get("price_range", ""),
                        highlights=item.get("highlights", []),
                    )
                )
            except Exception:
                continue

    # --- Budget ---
    budget_estimate = crew_data.get("budget_estimate", "Budget estimate unavailable")
    if isinstance(budget_estimate, dict):
        budget_estimate = str(budget_estimate)

    # --- Tips ---
    tips = crew_data.get("tips", [])
    if not isinstance(tips, list):
        tips = [str(tips)] if tips else []

    response = TravelResponse(
        destination=destination,
        itinerary=itinerary,
        hotels=hotels,
        budget_estimate=budget_estimate,
        experience_description=experience_text,
        images=image_urls,
        tips=tips,
    )

    logger.info(
        "Aggregation complete: %d days, %d hotels, %d images, %d tips",
        len(itinerary),
        len(hotels),
        len(image_urls),
        len(tips),
    )
    return response
