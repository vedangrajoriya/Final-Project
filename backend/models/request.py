from __future__ import annotations

from pydantic import BaseModel, Field


class TravelRequest(BaseModel):
    """Incoming request payload for the /generate-experience endpoint."""

    destination: str = Field(
        ...,
        min_length=1,
        max_length=200,
        examples=["Bali, Indonesia"],
        description="Target travel destination.",
    )
    days: int = Field(
        ...,
        ge=1,
        le=30,
        examples=[5],
        description="Number of travel days.",
    )
    budget: str = Field(
        ...,
        min_length=1,
        max_length=50,
        examples=["$3000"],
        description="Total trip budget (e.g. '$3000', '2000 EUR').",
    )
    preferences: list[str] = Field(
        default_factory=list,
        max_length=20,
        examples=[["beaches", "culture", "fine dining"]],
        description="List of traveler preferences / interests.",
    )
