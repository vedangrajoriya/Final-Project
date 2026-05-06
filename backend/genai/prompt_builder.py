from __future__ import annotations


def build_experience_prompt(destination: str, days: int, preferences: list[str], itinerary_summary: str) -> str:
    """Build a luxury-toned narrative prompt for the Groq LLM."""
    prefs = ", ".join(preferences) if preferences else "general sightseeing"
    return (
        f"You are an award-winning luxury travel storyteller.\n\n"
        f"Write a vivid, immersive narrative description of a {days}-day trip "
        f"to {destination}. The traveler's interests include: {prefs}.\n\n"
        f"Here is the planned itinerary for context:\n{itinerary_summary}\n\n"
        f"RULES:\n"
        f"- Write in a luxurious, evocative tone with rich sensory details.\n"
        f"- Include sights, sounds, aromas, textures, and flavors.\n"
        f"- Use human-like storytelling — make the reader feel they are there.\n"
        f"- Keep the description between 250-400 words.\n"
        f"- Do NOT use markdown formatting.\n"
        f"- Do NOT include lists or bullet points.\n"
        f"- Return ONLY the narrative paragraph(s)."
    )


def build_image_prompts(destination: str, preferences: list[str], count: int = 3) -> list[str]:
    """Build structured prompts for the deAPI Flux image model."""
    themes = [
        f"iconic landmark and skyline of {destination}",
        f"luxurious hotel suite with panoramic view in {destination}",
        f"vibrant local street market and cuisine in {destination}",
        f"serene natural landscape near {destination} at golden hour",
        f"cultural heritage site and traditional architecture in {destination}",
    ]

    prefs_str = ", ".join(preferences[:3]) if preferences else "travel"

    prompts: list[str] = []
    for i in range(min(count, len(themes))):
        prompt = (
            f"{themes[i]}, "
            f"inspired by {prefs_str}, "
            f"ultra realistic photograph, "
            f"8k render, cinematic lighting, "
            f"golden hour atmosphere, "
            f"professional travel photography, "
            f"sharp focus, vivid colors, "
            f"architectural details, "
            f"National Geographic quality"
        )
        prompts.append(prompt)

    return prompts
