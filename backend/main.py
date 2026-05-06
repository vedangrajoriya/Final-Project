"""
AI Hospitality Platform – FastAPI Application Entry Point
==========================================================
Multi-Agent + Multimodal backend for generating structured
travel experiences using CrewAI, Groq LLM, and deAPI image generation.
"""

from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core.logger import setup_logging, get_logger
from api.routes import router


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application startup / shutdown lifecycle."""
    setup_logging()
    logger = get_logger("main")
    logger.info("AI Hospitality Platform starting up")
    yield
    logger.info("AI Hospitality Platform shutting down")


app = FastAPI(
    title="AI Hospitality Platform",
    description=(
        "Production-grade Multimodal + Multi-Agent AI backend for generating "
        "luxury travel experiences. Combines CrewAI agents, Groq LLM narratives, "
        "and deAPI Flux image generation."
    ),
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# --- CORS Middleware ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Mount Routes ---
app.include_router(router, tags=["Travel Experience"])


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
    )
