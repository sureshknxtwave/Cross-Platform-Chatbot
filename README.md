# HealthCare AI - Cross-Platform Healthcare Chatbot

HealthCare AI is a full-stack healthcare assistant application with:
- web app (React + Vite),
- backend API (Node.js + Express + MongoDB),
- Android mobile support (Capacitor),
- healthcare chatbot with voice input/output,
- appointment booking, medication reminders, symptom analysis, and admin insights dashboards.

---

## Table of Contents
- Overview
- Features Implemented
- Architecture
- Tech Stack
- Project Structure
- API Endpoints
- Environment Variables
- Installation and Local Setup
- Android Build and Run
- Deployment
- Testing Checklist
- Security Notes
- Future Improvements

---

## Overview

This project was transformed from an education chatbot into a healthcare-focused platform.

Core goals:
- provide safe, practical healthcare guidance (non-diagnostic),
- support conversational workflows (appointments, reminders, symptom triage),
- enable admin visibility with analytics and charts,
- run on both web and Android from a shared frontend codebase.

---

## Features Implemented

### 1) Authentication
- User signup/login with JWT
- Protected routes/pages for authenticated users

### 2) Healthcare Chatbot
- Text chat with LLM-backed healthcare responses
- Safety guardrails and emergency red-flag handling
- Fallback symptom responses when LLM is delayed/unavailable
- Improved response formatting for readability
- Slow-response placeholder message: `Please wait...`

### 3) Voice Features
- Voice input (Web Speech API for web)
- Native speech recognition support on Android via Capacitor plugin
- Voice output (text-to-speech with selectable voice/rate)

### 4) Appointment Workflow
- Guided conversational form:
  - patient name
  - preferred date/time
  - symptoms
  - contact number
- Appointment persistence in MongoDB
- Appointment listing page

### 5) Medication Reminder Workflow
- Guided conversational form:
  - patient name
  - medicine name
  - dosage
  - frequency
  - start/end date
  - contact
- Reminder persistence in MongoDB
- Separate Medications page

### 6) Symptom Analysis Flow
- Dedicated symptom triage questionnaire in chat
- Risk scoring output (low/medium/medium-high/high)
- Structured recommendation + escalation guidance
- Explicit disclaimer: general guidance, not diagnosis

### 7) Admin/Operational Insights
- Appointments page with metrics + charts
- Medications page with records + trend chart
- Dedicated Insights page with:
  - KPI cards,
  - appointments trend chart,
  - top symptoms chart,
  - actionable operational insights

### 8) UI/UX Improvements
- Larger, more readable chat drawer
- Better mobile responsiveness
- Fixed overlapping chat launcher/input controls
- Navigation improvements: Home, Appointments, Medications, Insights

---

## Architecture

### High-level flow
1. React client sends API requests via Axios.
2. Express backend validates/authenticates requests.
3. Mongoose stores/retrieves data from MongoDB.
4. Chat endpoint calls Gemini model with healthcare-safe prompting.
5. Frontend renders records, trends, and charts from API data.

### Components
- **Frontend (`client/edureach-platform`)**
  - UI pages/components, routing, chat drawer, speech features
- **Backend (`server`)**
  - REST APIs, auth, chatbot controller, business logic, DB models
- **Database**
  - MongoDB collections for users, appointments, medication reminders
- **Mobile**
  - Capacitor Android wrapper around frontend build output

---

## Tech Stack

### Frontend
- React 19 + TypeScript
- Vite
- Tailwind CSS
- Axios
- React Router
- Lucide Icons
- Recharts (analytics charts)
- Capacitor + Android
- `@capacitor-community/speech-recognition`

### Backend
- Node.js + TypeScript
- Express 5
- Mongoose
- JWT (`jsonwebtoken`)
- bcryptjs
- CORS + dotenv
- LangChain + Google GenAI (`@langchain/google-genai`)

### Deployment
- Vercel (frontend)
- Render (backend)

---

## Project Structure

```text
edureach-agentic-colleage-chatbot/
  client/
    edureach-platform/
      src/
        components/
        pages/
        services/
      android/
      capacitor.config.ts
  server/
    src/
      controllers/
      routes/
      models/
      services/
      middleware/
      config/
  render.yaml
```

---

## API Endpoints

### Auth (`/api/auth`)
- `POST /register`
- `POST /login`
- `GET /me` (protected)

### Chat + Healthcare (`/api/chat`)
- `POST /message`
- `POST /appointment`
- `GET /appointments`
- `GET /appointments/insights`
- `POST /medication-reminder`
- `GET /medication-reminders`

---

## Environment Variables

Create `.env` files with your own values.

### Backend (`server/.env`)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=<your_mongodb_connection_string>
JWT_SECRET=<your_secure_jwt_secret>
JWT_EXPIRES_IN=3d
GOOGLE_API_KEY=<your_google_genai_api_key>
CLIENT_URL=http://localhost:5173
```

### Frontend (`client/edureach-platform/.env`)
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

For production frontend builds (example):
```env
VITE_API_BASE_URL=https://your-backend-domain/api
```

---

## Installation and Local Setup

### Prerequisites
- Node.js 22+ recommended
- npm 10+
- MongoDB Atlas (or local MongoDB)
- Google GenAI API key

### 1) Clone and install dependencies

Backend:
```bash
cd server
npm install
```

Frontend:
```bash
cd client/edureach-platform
npm install
```

### 2) Configure environment
- Add backend `.env`
- Add frontend `.env`

### 3) Run development servers

Backend:
```bash
cd server
npm run dev
```

Frontend:
```bash
cd client/edureach-platform
npm run dev
```

Frontend default URL: `http://localhost:5173`  
Backend default URL: `http://localhost:5000`

---

## Android Build and Run (Capacitor)

From `client/edureach-platform`:

```bash
npm run android:sync
npm run android:open
```

Notes:
- Android Studio + Android SDK are required.
- Web assets are built and synced into Android project.

---

## Deployment

### Backend (Render)
- `render.yaml` is included.
- Service uses:
  - `rootDir: server`
  - build: `npm install --include=dev && npm run build`
  - start: `npm run start`

Set environment variables in Render dashboard:
- `MONGODB_URI`
- `JWT_SECRET`
- `GOOGLE_API_KEY`
- `NODE_ENV=production`
- `PORT` (Render can inject automatically)

### Frontend (Vercel)
- Deploy `client/edureach-platform`.
- Set `VITE_API_BASE_URL` to deployed backend `/api` URL.
- Ensure SPA routing rewrite config exists in `vercel.json`.

---

## Testing Checklist

- Auth:
  - register/login/logout
  - protected page redirect behavior
- Chat:
  - normal question/answer
  - fallback behavior
  - message formatting
- Voice:
  - mic input on web
  - voice output toggle/settings
  - Android native speech recognition
- Appointment flow:
  - step validation
  - record creation + listing
- Medication flow:
  - step validation
  - record creation + Medications page
- Symptom analysis:
  - all prompts
  - risk level output
  - emergency escalation text
- Insights:
  - KPI values
  - charts render with/without data

---

## Security Notes

- Do not commit real secrets/API keys in `.env`.
- Use strong `JWT_SECRET` in production.
- Restrict CORS origins in production where possible.
- Add role-based access control for sensitive admin endpoints (recommended next).

---

## Future Improvements

- Role-based admin authorization for insights/records endpoints
- Notification channels for reminders (SMS/WhatsApp/email)
- CSV/PDF export from Insights
- Time-range filters (7/30/90 days)
- Medication adherence tracking status
- Clinical escalation workflows and audit logging

---

## License

MIT (as declared in backend package configuration).
