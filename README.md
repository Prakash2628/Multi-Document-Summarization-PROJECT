# 🚀 Multi-Document-Summarization-PROJECT
AI-powered summarization engine that processes **multiple types of documents** — PDF, Word, TXT, and more — using a modern **React + FastAPI** full-stack architecture.

This project delivers fast, clean, and actionable summaries with a developer-focused workflow and production-ready code structure.

---

## 📖 Overview
**Multi-Document-Summarization-PROJECT** allows users to upload multiple documents or paste text and receive concise, AI-generated summaries with key points and actionable highlights. Built for researchers, students, analysts, and teams that need fast, readable insights.

---

## ✨ Features
- Upload and summarize PDFs, DOCX, TXT and other text formats.
- Combine multiple documents into one summary.
- AI-powered backend for accurate, concise summaries.
- Clean, responsive React UI with TailwindCSS and Framer Motion.
- FastAPI backend with easily extensible endpoints.

---

## 🧰 Tech Stack
**Frontend**
- React
- TailwindCSS
- Framer Motion
- Axios

**Backend**
- FastAPI
- Python
- Uvicorn
- (Optional) OCR / Document parsing libraries

---

## 🖥️ Developer Preview (Dark Theme)

**Backend Terminal (example)**
```
$ uvicorn app.main:app --reload --port 8000
INFO:     Uvicorn running on http://localhost:8000
INFO:     Application startup complete.
```

**Sample API request**
```
POST http://localhost:8000/summarize
Content-Type: multipart/form-data
Form fields:
 - files[]: document.pdf
 - text: optional additional text
```

**Sample response**
```json
{
  "summary": "This document provides an overview of ...",
  "highlights": [
    "Key point 1",
    "Key point 2",
    "Recommended action"
  ]
}
```

---

## 📂 Full Project Structure

```
project-root/
│
├── backend/                                # FastAPI backend
│   ├── app/                        
│   │   ├── main.py               
│   │   ├── file_processor.py
│   │   ├── schemas.py
│   │   └── summarizer.py
│   │            
│   ├── model/
│   │   └── response_models.py
│   │
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/                                # React frontend
│   ├── public/
│   │   ├── MSD.ico
│   │   ├── index.html
│   │   ├── manifest.json
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── DocumentSummarizer.jsx
│   │   │   ├── FileUpload.jsx
│   │   │   ├── SummaryResults.jsx
│   │   │   └── TextInput.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── types/
│   │   │   └── index.js
│   │   │
│   │   ├── App.js
│   │   └── index.css
│   │
│   ├── package.json
│   └── postcss.config.js
│
├── .gitignore
└── README.md
```

## 🛠️ Installation

### 1. Frontend setup
```bash
cd frontend
npm install
```

### 2. Backend setup
```bash
cd ../backend
python -m venv venv
# Activate venv (macOS / Linux)
source venv/bin/activate
# or Windows:
# .\venv\Scripts\activate
pip install -r requirements.txt
```

---

## ▶️ Running the App (Development)

**Start the backend**
```bash
cd backend
.venv/Scripts/Activate
uvicorn app.main:app --reload --port 8000
```

**Start the frontend (in a separate terminal)**
```bash
cd frontend
npm start
```

Open:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8000`

---

## 📘 API Documentation

FastAPI provides automatic docs:

- Swagger UI: `http://localhost:8000/docs`
- Redoc: `http://localhost:8000/redoc`

### Example endpoints
- `GET /health` — health check
- `POST /summarize` — accept files + optional text, return summary

---

## 🧪 Testing

**Backend tests**
```bash
cd backend
pytest
```

**Frontend tests**
```bash
cd frontend
npm test
```

---

## 🤝 Finally

Project is ready...
