# ClarifyHealth AI Medical Report Simplifier

[![FastAPI](https://img.shields.io/badge/Backend-FastAPI_0.110+-009688?logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/Frontend-React_18_TypeScript-61DAFB?logo=react&logoColor=black)](https://reactjs.org)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind_CSS_3.4-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**ClarifyHealth** is a modern, production-quality, patient-empowering web application that translates technical healthcare jargon and complex medical laboratory reports into clear, empathetic, easy-to-understand explanations.

---

## 🌟 Key Features

1. **Multi-Format Report Ingestion**:
   - Upload **PDF**, **DOCX**, **PNG**, **JPG**, or **JPEG** reports with automatic OCR and text extraction.
   - Built-in **1-Click Synthetic Sample Reports** (CBC Blood Count, Lipid Panel, Metabolic Panel, Lumbar MRI, Thyroid Panel) for instant demonstration.

2. **AI Medical Explanation Engine**:
   - Multi provider architecture with **Google Gemini**, **OpenAI**, and a built in deterministic **Clinical Rule Engine & Knowledge Base** fallback.
   - Structured term breakdown: **Simple Meaning**, **Reported Value**, **Reference Range**, **What It May Mean**, and **Why It Matters**.
   - Accessible, non alarmist color coding: *Within Range*, *High*, *Low*, *Outside Range Review with Doctor*, *Info Unavailable*.

3. **"Explain Like I'm New to Medicine" Mode**:
   - 1-click toggle that translates findings to a 5th grade reading level.

4. **Interactive "Ask About This Report" Grounded Chat**:
   - Conversational AI assistant answering patient questions grounded strictly in the uploaded document.
   - Context citations and safety guardrails that refuse to hallucinate missing data or give prescriptions.

5. **Audio Text to Speech (TTS) Narrator**:
   - Web Speech API integration for natural voice readout of summaries and biomarker cards.

6. **Doctor Question Generator & Export**:
   - Auto curates personalized discussion points for upcoming clinical visits.
   - 1-click copy to clipboard and print optimized handouts.

7. **Side by Side Dual Document Viewer**:
   - Compare raw extracted technical document text with plain language translations side by side.

8. **Medical Abbreviations Glossary**:
   - Built in searchable dictionary of 80+ clinical biomarkers and acronyms (e.g. Hgb, eGFR, MCV, TSH, BUN).

9. **Responsible AI & Security First**:
   - Prominent educational medical disclaimers.
   - JWT authentication, user isolated report storage, zero public URLs, and permanent 1-click deletion.

---

## 🏗️ Project Structure

```
ai-medical-report-simplifier/
│
├── frontend/                     # React 18 + TypeScript + Tailwind CSS
│   ├── src/
│   │   ├── components/           # TermCard, ChatInterface, FileUploader, etc.
│   │   ├── pages/                # LandingPage, DashboardPage, ReportDetailsPage, etc.
│   │   ├── services/             # API client & Text-to-Speech service
│   │   ├── context/              # AuthContext & ThemeContext
│   │   ├── types/                # TypeScript data interfaces
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── backend/                      # Python 3.11 + FastAPI + SQLAlchemy
│   ├── app/
│   │   ├── api/                  # /auth, /reports, /health endpoints
│   │   ├── models/               # User, MedicalReport, ChatMessage models
│   │   ├── schemas/              # Pydantic validation schemas
│   │   ├── services/             # AIService, FileExtractor, SampleData
│   │   ├── config.py
│   │   ├── database.py
│   │   └── main.py
│   ├── tests/                    # Pytest backend test suite
│   ├── requirements.txt
│   └── Dockerfile
│
├── database/                     # PostgreSQL schemas and seeds
│   ├── schema.sql
│   └── init.sql
│
├── docs/                         # Architecture, API spec, Safety & Privacy docs
│   ├── architecture.md
│   ├── api_spec.md
│   ├── security_and_privacy.md
│   └── safety_guidelines.md
│
├── .env.example
├── docker-compose.yml
└── README.md
```

---

## 🚀 Quick Start Instructions

### Prerequisites
- **Node.js**: v18+ (tested on Node v20)
- **Python**: 3.10+ (tested on Python 3.11)

---

### Option 1: Running Locally (Fastest Zero Config Setup)

#### 1. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# On Windows (PowerShell):
.venv\Scripts\activate
# On macOS/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt email-validator

# Run the FastAPI server
uvicorn app.main:app --reload --port 8000
```

The backend will start at `http://127.0.0.1:8000`.  
Interactive API docs are available at `http://127.0.0.1:8000/docs`.

#### 2. Frontend Setup

In a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Start the Vite development server
npm run dev
```

Open your browser and navigate to `http://localhost:5173`.

---

### Option 2: Running with Docker Compose

To start the full stack (PostgreSQL + FastAPI + Nginx Frontend):

```bash
docker-compose up --build
```

- Frontend: `http://localhost`
- Backend API & Docs: `http://localhost:8000/docs`
- PostgreSQL: `localhost:5432`

---

## 🧪 Running Automated Tests

### Backend Unit Tests

```bash
cd backend
.venv\Scripts\activate
python -m pytest tests/ -v
```

### Frontend Build Validation

```bash
cd frontend
npm run build
```

---

## ⚙️ Environment Configuration

Copy `.env.example` to `backend/.env`:

```ini
PROJECT_NAME="ClarifyHealth AI Medical Report Simplifier"
SECRET_KEY="your-secret-jwt-key"
DATABASE_URL="sqlite:///./medical_reports.db"

# Optional: Add LLM API keys for live Gemini or OpenAI generation
# If left blank, the application automatically uses its high-fidelity Clinical Rule Engine
AI_PROVIDER="auto"
GEMINI_API_KEY=""
OPENAI_API_KEY=""
```

---

## 🛡️ Medical Safety & Responsible AI Disclaimer

> **Important:** ClarifyHealth provides general educational explanations of medical terminology and laboratory parameters. It does **not** provide a medical diagnosis, treatment plan, or prescription advice. Always discuss your health reports and any symptoms with a qualified healthcare professional.
