from __future__ import annotations

from crewai import Agent


def create_hotel_agent(llm) -> Agent:
    """Agent that recommends accommodations matching the traveler's profile."""
    return Agent(
        role="Luxury Hospitality Advisor",
        goal=(
            "Recommend 3-5 outstanding hotels or accommodations that match "
            "the traveler's budget and preferences. Include a mix of luxury "
            "resorts, boutique hotels, and unique stays (e.g. eco-lodges, "
            "riads, ryokans). For each, provide the name, category, price "
            "range, and key highlights."
        ),
        backstory=(
            "You are a former concierge at a world-renowned five-star hotel "
            "chain with 15 years of experience in the hospitality industry. "
            "You have insider connections and first-hand knowledge of "
            "accommodations across every continent. You understand that the "
            "right hotel can elevate an entire trip."
        ),
        llm=llm,
        verbose=False,
        allow_delegation=False,
    )
