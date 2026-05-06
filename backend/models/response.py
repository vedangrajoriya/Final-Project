from __future__ import annotations

from pydantic import BaseModel, Field


class ItineraryDay(BaseModel):
    """Single day in the travel itinerary."""

    day: int
    title: str
    activities: list[str]


class HotelRecommendation(BaseModel):
    """A recommended hotel / accommodation."""

    name: str
    category: str = ""
    price_range: str = ""
    highlights: list[str] = Field(default_factory=list)


class TravelResponse(BaseModel):
    """Final aggregated response returned to the client."""

    destination: str
    itinerary: list[ItineraryDay]
    hotels: list[HotelRecommendation]
    budget_estimate: str
    experience_description: str
    images: list[str]
    tips: list[str]
