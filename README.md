# 🔍 CRM Data Extraction Agent — AI-Powered CSV Importer

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?style=for-the-badge&logo=express&logoColor=white)
![React](https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js&logoColor=white)
![Gemini](https://img.shields.io/badge/Gemini_2.5_Pro-AI-4285F4?style=for-the-badge&logo=google&logoColor=white)

**Upload unstructured CSV → AI extracts & maps fields → Live streaming progress → Instant CRM JSON**

[Live Demo](#) · [Backend API](#) · [API Docs](#-api-endpoints)

*(Insert Vercel and Render links here)*

</div>

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Live Deployment Links](#-live-deployment-links)
- [Features](#-features)
- [System Architecture](#-system-architecture)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [API Endpoints](#-api-endpoints)
- [How It Works](#-how-it-works)
- [Results & Demo](#-results--demo)
- [Assignment Context](#-assignment-context)

---

## 🧠 Overview

**CRM Data Extraction Agent** is an intelligent batch-processing AI system. It automatically:

1. **Parses** massive, messy, and unstructured CSV files directly in the browser via multithreaded web workers.
2. **Maps** completely unstructured rows into a strict, validated CRM JSON format using Gemini 2.5 Pro.
3. **Reports** successful imports and safely routes invalid or empty records to a skipped queue—rendering 100,000+ rows instantly without crashing the DOM.

---

## 🚀 Live Deployment Links

| | Link |
|---|---|
| **🌐 Frontend (Vercel)** | [Insert Vercel Link Here] |
| **⚙️ Backend (Render)** | [Insert Render Link Here] |
| **📂 GitHub Repository** | [https://github.com/bhumika564/CRM-CSV-IMPORTER](https://github.com/bhumika564/CRM-CSV-IMPORTER) |

---

## ✨ Features

| Feature | Description |
|---|---|
| 📄 **Multithreaded Parsing** | Extracts raw CSVs flawlessly using PapaParse Web Workers |
| 🤖 **AI Field Mapping** | Gemini 2.5 Pro intelligently matches ambiguous columns to CRM keys |
| ⚡ **Batch Streaming** | Chunk-based processing prevents memory bloat and API timeouts |
| 📊 **Virtualized Data Table** | Custom native DOM virtualization renders 50,000+ rows instantly |
| 🎨 **Premium UI** | Next.js Glassmorphism design with a fully integrated Dark Mode |
| 🛡️ **Edge-Case Handling** | Graceful fallback parsers and automated API rate-limit retries |
| 🔄 **Animated Loading** | Zeno's paradox "Flowing" progress bar for beautiful UX |

---

## 🏗 System Architecture

```
┌─────────────────┐         ┌──────────────────────────────────────┐
│  Next.js UI     │──POST──▶│        Express Backend (server.js)   │
│ (Glassmorphism) │         │                                      │
└─────────────────┘         │  1. Receive 10-row JSON chunks       │
                             │  2. Gemini 2.5 Pro → Strict Mapping  │
         ┌───────────────────│  3. Execute assignment logic rules   │
         │                   │  4. Catch & Filter Invalid Records   │
         ▼                   │  5. Return Successfully Parsed array │
  ┌─────────────┐            │     & Skipped Records array          │
  │  JSON Batch  │◀──────────│                                      │
  └─────────────┘            └──────────────────────────────────────┘
```

---

## 🛠 Tech Stack

**Backend**
- `Node.js 18+` — core runtime
- `Express` — REST API server
- `Cors` — cross-origin requests
- `@google/genai` — Gemini 2.5 Pro for NLP & JSON Extraction
- `Jest & Supertest` — API unit testing

**Frontend**
- `Next.js 16 (App Router)` — core framework
- `React 19` — UI rendering
- `PapaParse` — Web-worker CSV extraction
- `Lucide React` — for sleek iconography
- Custom Virtualized Table & CSS-variable theming

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Gemini API Key → [Get here](https://aistudio.google.com/app/apikey)

### 1. Clone the Repository

```bash
git clone https://github.com/bhumika564/CRM-CSV-IMPORTER.git
cd CRM-CSV-IMPORTER
```

### 2. Backend Setup

```bash
cd backend
npm install
```

### 3. Environment Variables

Create a `.env` file inside the `backend/` folder:

```env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Run the Backend

```bash
npm run dev
# Server starts at http://localhost:5000
```

### 5. Frontend Setup & Run

```bash
cd ../frontend
npm install

# (Optional) Create .env.local with NEXT_PUBLIC_API_URL=http://localhost:5000
npm run dev
# Opens at http://localhost:3000
```

---

## 📁 Project Structure

```
CRM-CSV-IMPORTER/
│
├── backend/
│   ├── routes/
│   │   └── import.js           # Core Gemini AI batch logic
│   ├── tests/
│   │   └── import.test.js      # Jest unit tests
│   ├── server.js               # Main Express application
│   └── package.json            # Backend dependencies
│
├── frontend/
│   ├── app/
│   │   ├── page.js             # Main Dashboard UI & Logic
│   │   └── globals.css         # Theming & CSS Variables
│   ├── components/
│   │   ├── CsvUploader.js      # Drag & Drop + PapaParse logic
│   │   └── VirtualizedDataTable.js # High-performance DOM renderer
│   ├── package.json
│   └── vercel.json             # Vercel Deployment config
│
├── docker-compose.yml          # Full-stack containerization
├── render.yaml                 # Render Deployment config
└── README.md
```

---

## 📡 API Endpoints

### `GET /health`
Check if the backend is running.

```json
{ "status": "ok" }
```

### `POST /api/import`
Upload a batch of JSON records and receive structured CRM data.

**Request:** `application/json`
```json
{
  "records": [
    { "First Name": "John", "Phone Number": "9876543210" }
  ]
}
```

**Response:**
```json
{
  "total_imported": 1,
  "total_skipped": 0,
  "successfullyParsed": [
    {
      "created_at": "2026-07-09T12:00:00.000Z",
      "name": "John",
      "email": null,
      "country_code": "+91",
      "mobile_without_country_code": "9876543210",
      "crm_status": "GOOD_LEAD_FOLLOW_UP"
    }
  ],
  "skipped": []
}
```

---

## ⚙️ How It Works

### Phase 1 — Web Worker Extraction
```
CSV Drag & Drop → PapaParse Web Worker parses data natively →
Prevents UI freezing → Streams chunks to Next.js
```

### Phase 2 — Fast Batch API Processing
```
Instead of pushing 50,000 rows and timing out the browser, the system uses an optimized Batch Processing architecture:
  → Frontend sends chunks of 10 rows to Express.
  → Gemini 2.5 Pro maps all 10 rows in a single batch prompt.
  → Strict JS filtering strips `_skip_record` flags.
Progress bar updates dynamically → Virtualized Table instantly renders results
```

**Why Batching?** It prevents memory bloat, bypasses network timeouts, and intelligently protects the API from Rate Limits using a localized 3-try retry loop with a 10s cooldown.

---

## 📊 Results & Demo

Sample output mapping logic:

| Raw CSV Field | Mapped CRM Output | Action |
|---|---|---|
| `"Location": "Bangalore, Karnataka"` | `"city": "Bangalore", "state": "Karnataka"` | ✅ Parsed |
| `"Alt Phone": "555-1234"` | Appended to `"crm_note"` | ✅ Parsed |
| (No Email, No Phone) | Flagged with `_skip_record` | ❌ Skipped |

---

## 📋 Assignment Context

This project was built to completely satisfy the **AI Prompt Engineering, Backend Quality, Frontend Quality, and Code Quality** evaluation criteria.

**Bonus Points achieved:**
- [x] Drag & Drop upload
- [x] Progress indicators during AI processing (Zeno's paradox animation)
- [x] Streaming / incremental parsing (Batch chunking)
- [x] Retry mechanism for failed AI batches (3-attempt cooldown)
- [x] Virtualized table for large CSVs (Custom zero-dependency DOM implementation)
- [x] Dark mode (Native CSS Variables)
- [x] Unit tests (Jest & Supertest)
- [x] Docker setup (`docker-compose.yml` included)
- [x] Deployment configurations (`vercel.json` & `render.yaml`)
- [x] Well-written README with setup instructions

---

<div align="center">

Built with ❤️ by Bhumika Sharma

</div>
