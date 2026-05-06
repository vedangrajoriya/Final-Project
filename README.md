# 🌌 Celestial Concierge: AI-Powered Travel Planner

![Celestial Concierge](frontend/src/assets/hero.png) <!-- Update with an actual screenshot of the app -->

**Celestial Concierge** is a state-of-the-art, multi-agent artificial intelligence platform designed to revolutionize travel planning. By leveraging a network of specialized AI agents, it crafts highly personalized, end-to-end travel itineraries, complete with budget analysis, hotel recommendations, cultural insights, and interactive 3D visualizations.

---

## ✨ Key Features

- **🤖 Multi-Agent AI Orchestration:** Powered by `CrewAI` and `Groq`, the backend utilizes a team of specialized agents (Researcher, Writer, Budget Planner, Hotel Expert) that collaborate to build your perfect trip.
- **⚡ Real-Time Streaming:** Built on an asynchronous `FastAPI` architecture to provide fast, responsive AI processing.
- **🎨 Premium "Glassmorphic" UI:** A stunning, highly interactive frontend built with `React`, `Framer Motion`, and `Tailwind CSS`.
- **🌐 3D Interactive Environments:** Immersive visual experiences powered by `Three.js` and `@react-three/fiber` (Particle Spheres and Scene Backgrounds).
- **🖼️ Generative AI Imagery:** Integration with the `deAPI Flux` model to dynamically generate breathtaking visuals of your destination.
- **📊 Smart Budget & Itinerary Dashboards:** Beautifully animated widgets for budget breakdowns, hotel cards, and timeline-based itineraries.

---

## 🛠️ Technology Stack

### **Frontend**
- **Framework:** React 18 + Vite + TypeScript
- **Styling:** Tailwind CSS + Radix UI Primitives
- **Animations:** Framer Motion
- **3D Graphics:** Three.js (`@react-three/fiber`, `@react-three/drei`)
- **Icons & UI:** Lucide React, class-variance-authority

### **Backend**
- **Framework:** FastAPI (Python 3.10+)
- **AI/LLM Integration:** CrewAI, Langchain-Groq, Groq LLM API
- **Image Generation:** deAPI Flux model
- **Data Validation:** Pydantic
- **Concurrency:** Uvicorn, Asyncio

---

## 🚀 Getting Started

Follow these steps to set up the project locally.

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **Python** (v3.10 or higher)
- API Keys:
  - `GROQ_API_KEY` (for LLM generation)
  - `DEAPI_KEY` (if using image generation via Flux)

### 2. Backend Setup

1. Open a terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv .venv
   
   # Windows:
   .\.venv\Scripts\activate
   # Mac/Linux:
   source .venv/bin/activate
   ```
3. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure your Environment Variables:
   Create a `.env` file in the `backend` directory and add your keys:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   DEAPI_KEY=your_deapi_key_here
   ```
5. Start the FastAPI backend:
   ```bash
   uvicorn main:app --reload --port 8000
   ```
   *The backend will be running at `http://localhost:8000`*

### 3. Frontend Setup

1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install Node dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend will be running at `http://localhost:5173`*

---

## 📂 Project Architecture

```text
Final-Project/
├── backend/                  # Python FastAPI Server
│   ├── agents/               # CrewAI Specialized Agents (Budget, Hotel, Researcher, Writer)
│   ├── api/                  # FastAPI Routes and Endpoints
│   ├── core/                 # Configuration and Logging
│   ├── genai/                # LLM Clients (Groq, deAPI Flux)
│   ├── models/               # Pydantic Schemas (Requests/Responses)
│   ├── orchestrator/         # Multi-Agent Workflow Logic
│   ├── services/             # Core Business Logic (Experience Service)
│   ├── main.py               # Backend Application Entrypoint
│   └── requirements.txt      # Python Dependencies
│
├── frontend/                 # React Frontend
│   ├── public/               # Static Assets
│   ├── src/
│   │   ├── assets/           # Images and SVGs
│   │   ├── features/         # Domain-Specific UI Components (Budget, Dashboard, Hotels, Itinerary)
│   │   ├── pages/            # Main Application Views
│   │   ├── services/         # API Integration Layer
│   │   ├── store/            # Global State Management (Zustand/Context)
│   │   └── three/            # 3D Visualizations (ParticleSphere, SceneBackground)
│   ├── index.html            # HTML Entrypoint
│   ├── tailwind.config.js    # Tailwind Design System Configuration
│   └── vite.config.ts        # Vite Bundler Configuration
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! 
Feel free to check out the [issues page](../../issues).

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.
