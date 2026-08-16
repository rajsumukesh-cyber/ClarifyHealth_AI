# ClarifyHealth AI — System Architecture Document

## Overview

**ClarifyHealth** is an AI-powered medical report simplification platform built to bridge the communication gap between complex clinical records and patients.

```
                    ┌─────────────────────────┐
                    │     Patient / User      │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │     React 18 + Vite     │
                    │  TypeScript + Tailwind  │
                    │   Lucide Icons + TTS    │
                    └────────────┬────────────┘
                                 │ HTTPS / REST (JSON + Multipart)
                                 ▼
                    ┌─────────────────────────┐
                    │     FastAPI Backend     │
                    │ JWT Auth & User Control │
                    └────────────┬────────────┘
                                 │
            ┌────────────────────┼────────────────────┐
            ▼                    ▼                    ▼
   ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
   │ Document Parser │  │ PostgreSQL /    │  │ AIService       │
   │  - PyPDF        │  │ SQLite Database │  │  - Gemini LLM   │
   │  - Python-Docx  │  │ (SQLAlchemy ORM)│  │  - OpenAI LLM   │
   │  - Image OCR    │  │                 │  │  - Rule Engine  │
   └────────┬────────┘  └─────────────────┘  └────────┬────────┘
            │                                         │
            └────────────────────┬────────────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │ Interactive Dashboard   │
                    │ - Plain Summary + Audio │
                    │ - Color-coded Terms     │
                    │ - Grounded AI Chat      │
                    │ - Doctor Q&A Checklist  │
                    └─────────────────────────┘
```

---

## 1. Frontend Architecture

- **Framework**: React 18 with TypeScript and Vite bundler.
- **Styling**: Tailwind CSS with custom healthcare palette (Sky, Teal, Coral, Emerald, Slate) and dark/light mode toggle.
- **State Management**: React Context API (`AuthContext` for JWT sessions, `ThemeContext` for light/dark theme).
- **Text-to-Speech (TTS)**: Web Speech API wrapper (`ttsService`) enabling natural voice narration of summaries and individual terms.
- **Routing**: Client-side declarative routing with protected dashboard routes and fallback redirects.
- **Print Optimizer**: Dedicated CSS `@media print` rules generating clean, distraction-free doctor visit discussion printouts.

---

## 2. Backend Architecture

- **Framework**: FastAPI (Python 3.11) with ASGI async concurrency.
- **Authentication**: JWT token authentication with bcrypt password hashing and 7-day session expiration.
- **Document Ingestion Pipeline**:
  - **PDF**: Multi-page text and table extraction using `pypdf`.
  - **DOCX**: Structured paragraph and cell-matrix extraction using `python-docx`.
  - **Images**: OCR extraction using `pytesseract` and `Pillow` with image cleanup heuristics.
  - **Text Cleaning**: Normalization of whitespace, preservation of tabular structure, and low-contrast/unclear section tracking.
- **Database Engine**: SQLAlchemy 2.0 ORM with automated support for:
  - SQLite (default for zero-dependency local development)
  - PostgreSQL (production & Docker deployment)

---

## 3. Multi-Provider AI Explanation Engine

The `AIService` implements a resilient multi-provider strategy:
1. **Google Gemini API Provider** (via `gemini-1.5-flash` with structured JSON schema)
2. **OpenAI Provider** (via `gpt-4o-mini` with JSON mode)
3. **Clinical Deterministic Rule & Knowledge Base Fallback**:
   - Comprehensive dictionary of 80+ clinical biomarkers (Hemoglobin, Hematocrit, WBC, Platelets, MCV, RDW, Glucose, BUN, Creatinine, eGFR, ALT, AST, TSH, Total Cholesterol, HDL, LDL, Triglycerides, Spine MRI terminology).
   - Regex-based laboratory range and status parser (Within Range, High, Low, Needs Attention).
   - Guarantees 100% testability, zero API key dependencies for local demo evaluation, and instantaneous sub-50ms responses.

---

## 4. Responsible AI & Safety Architecture

- **No Medical Diagnosis**: Outputs are strictly framed as educational context.
- **No Prescriptions**: Explicit regex and LLM system prompts reject medication recommendations or dosage modification queries.
- **Non-Alarmist Phrasing**: Flags are worded cautiously (e.g. *"Outside standard reference range — consider discussing this with your healthcare provider"*).
- **Document Grounding**: Chat responses explicitly verify whether requested values exist in the uploaded record before answering.
