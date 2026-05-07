# Docker Deployment Guide

This directory contains the necessary files to run the Multimodal AI Hospitality Experience Platform in a production Docker environment.

## 🚀 Quick Start

Ensure you have Docker and Docker Compose installed.

### 1. Set up Environment Variables
Create a `.env` file in the **project root** directory (`v:/Final Project/.env`) with the following variables:

```env
# Backend AI Keys
GROQ_API_KEY=your_groq_api_key_here
DEAPI_API_KEY=your_deapi_api_key_here

# Optional Backend Overrides
GROQ_MODEL=llama-3.3-70b-versatile
DEAPI_IMAGE_MODEL=flux-1.1-schnell

# Frontend API Connection (Change this if deploying to a remote server, e.g., http://api.mydomain.com)
VITE_API_URL=http://localhost:8000
```

### 2. Build the Images
Run this command from the project root directory:
```bash
docker compose build
```
*Note: This will execute the multi-stage builds. The frontend container will inject the `VITE_API_URL` during the Vite build process.*

### 3. Run the Containers (Detached Mode)
```bash
docker compose up -d
```

### 4. Verify Services
- **Frontend:** Open `http://localhost:3000` in your browser.
- **Backend API Docs:** Open `http://localhost:8000/docs` in your browser.

---

## 🧪 Testing & Operation Commands

**Check Logs:**
```bash
# View all logs
docker compose logs -f

# View backend logs only
docker compose logs -f backend

# View frontend logs only
docker compose logs -f frontend
```

**Stop Containers:**
```bash
docker compose down
```

**Rebuild a Specific Service (e.g., after modifying frontend code):**
```bash
docker compose up -d --build frontend
```

---

## 🛡️ Production Optimization & Security Notes

1. **Non-Root Execution:** The FastAPI backend runs as a secure, non-root user (`appuser`).
2. **Multi-Stage Builds:** Both Dockerfiles compile dependencies in a `builder` stage, ensuring the final runtime images do not contain unnecessary build tools or source files.
3. **Layer Caching:** `package.json` and `requirements.txt` are copied *before* the application code to utilize Docker's layer caching, significantly speeding up rebuilds.
4. **Nginx SPA Routing:** The frontend utilizes a custom `nginx.conf` designed for Single Page Applications (React Router) with security headers pre-configured.
