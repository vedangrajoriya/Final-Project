from __future__ import annotations

import asyncio
import json
import os
from concurrent.futures import ThreadPoolExecutor
from functools import partial

from crewai import Crew, Task, Process

from agents.researcher import create_researcher_agent
from agents.writer import create_writer_agent
from agents.budget_agent import create_budget_agent
from agents.hotel_agent import create_hotel_agent
from core.config import get_settings
from core.logger import get_logger
from models.request import TravelRequest

logger = get_logger(__name__)

_executor = ThreadPoolExecutor(max_workers=2)

_CREW_OUTPUT_INSTRUCTIONS = (
    "You MUST respond ONLY with valid JSON. No markdown, no code fences, "
    "no explanations. Just raw JSON."
)


def _build_crew(request: TravelRequest) -> Crew:
    """Assemble the CrewAI crew with all agents and tasks."""
    settings = get_settings()

    # Expose GROQ_API_KEY to os.environ so LiteLLM (used by CrewAI) can find it
    os.environ["GROQ_API_KEY"] = settings.GROQ_API_KEY

    # CrewAI uses LiteLLM internally — model must be prefixed with provider name
    llm = f"groq/{settings.GROQ_MODEL}"

    researcher = create_researcher_agent(llm)
    writer = create_writer_agent(llm)
    budget = create_budget_agent(llm)
    hotel = create_hotel_agent(llm)

    prefs = ", ".join(request.preferences) if request.preferences else "general"

    research_task = Task(
        description=(
            f"Research the top attractions, cultural experiences, local cuisines, "
            f"and hidden gems in {request.destination} for a {request.days}-day trip. "
            f"Traveler preferences: {prefs}. Budget: {request.budget}.\n\n"
            f"{_CREW_OUTPUT_INSTRUCTIONS}\n"
            f"Return JSON with keys: 'places' (list of strings), "
            f"'activities' (list of strings), 'tips' (list of strings)."
        ),
        expected_output="A JSON object with 'places', 'activities', and 'tips' arrays.",
        agent=researcher,
    )

    itinerary_task = Task(
        description=(
            f"Using the research findings, create a detailed {request.days}-day "
            f"itinerary for {request.destination}. Preferences: {prefs}.\n\n"
            f"{_CREW_OUTPUT_INSTRUCTIONS}\n"
            f"Return JSON with key 'itinerary' — an array of objects, each with "
            f"'day' (int), 'title' (string), and 'activities' (list of strings)."
        ),
        expected_output="A JSON object with an 'itinerary' array of day objects.",
        agent=writer,
    )

    budget_task = Task(
        description=(
            f"Estimate a realistic budget breakdown for a {request.days}-day trip "
            f"to {request.destination}. Target budget: {request.budget}. "
            f"Preferences: {prefs}.\n\n"
            f"{_CREW_OUTPUT_INSTRUCTIONS}\n"
            f"Return JSON with key 'budget_estimate' (string summary, e.g. "
            f"'$2,500 - $3,200 total: Accommodation $800-1000, Food $400-600, "
            f"Activities $300-500, Transport $200-300, Misc $100-200')."
        ),
        expected_output="A JSON object with a 'budget_estimate' string.",
        agent=budget,
    )

    hotel_task = Task(
        description=(
            f"Recommend 3-5 hotels in {request.destination} for a {request.days}-day "
            f"stay. Budget: {request.budget}. Preferences: {prefs}.\n\n"
            f"{_CREW_OUTPUT_INSTRUCTIONS}\n"
            f"Return JSON with key 'hotels' — an array of objects, each with "
            f"'name' (string), 'category' (string), 'price_range' (string), "
            f"and 'highlights' (list of strings)."
        ),
        expected_output="A JSON object with a 'hotels' array.",
        agent=hotel,
    )

    crew = Crew(
        agents=[researcher, writer, budget, hotel],
        tasks=[research_task, itinerary_task, budget_task, hotel_task],
        process=Process.sequential,
        verbose=False,
    )

    return crew


def _run_crew_sync(request: TravelRequest) -> dict:
    """Synchronous crew execution (called inside a thread)."""
    crew = _build_crew(request)
    logger.info("Starting CrewAI execution for destination=%s", request.destination)

    result = crew.kickoff(
        inputs={
            "destination": request.destination,
            "days": request.days,
            "budget": request.budget,
            "preferences": ", ".join(request.preferences),
        }
    )

    raw_output = result.raw if hasattr(result, "raw") else str(result)
    logger.info("CrewAI execution complete (%d chars output)", len(raw_output))

    # CrewAI sequential process only returns the last task's output.
    # We merge outputs from every individual task so nothing is lost.
    merged: dict = {}
    for task in crew.tasks:
        if hasattr(task, "output") and task.output:
            task_raw = task.output.raw if hasattr(task.output, "raw") else str(task.output)
            parsed = _parse_crew_output(task_raw)
            merged.update(parsed)

    # If per-task parsing yielded nothing, fall back to the final output
    if not merged:
        merged = _parse_crew_output(raw_output)

    logger.info("Merged crew data keys: %s", list(merged.keys()))
    return merged


def _parse_crew_output(raw: str) -> dict:
    """Best-effort JSON extraction from crew output."""
    # Try direct parse
    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        pass

    # Try to find JSON in code fences or embedded in text
    import re
    patterns = [
        r"```json\s*(.*?)\s*```",
        r"```\s*(.*?)\s*```",
        r"(\{.*\})",
    ]
    for pattern in patterns:
        match = re.search(pattern, raw, re.DOTALL)
        if match:
            try:
                return json.loads(match.group(1))
            except json.JSONDecodeError:
                continue

    # Fallback: return a minimal structure built from the raw text
    logger.warning("Could not parse JSON from crew output; using fallback")
    return {
        "itinerary": [],
        "hotels": [],
        "budget_estimate": raw[:500] if raw else "Budget estimate unavailable",
        "tips": [],
    }


async def run_crew(request: TravelRequest) -> dict:
    """Run the CrewAI crew asynchronously (offloaded to a thread pool).

    CrewAI's kickoff() is synchronous, so we avoid blocking the event loop.
    """
    loop = asyncio.get_running_loop()
    return await loop.run_in_executor(_executor, partial(_run_crew_sync, request))
