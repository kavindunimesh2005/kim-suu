# Suchetha Kapuarachchi — Portfolio & Admin Dashboard (Unified Application)

A unified, full-stack author portfolio and content management system combining a **React (Vite)** frontend with a **Python (Flask)** backend into **ONE deployable application**.

---

## Architecture Overview

```text
Browser / Client
       │
       ▼
Flask Application (Port 5000 / Production Domain)
  ├── /api/*          ──► Flask API Blueprints (Books, Blogs, Stories, Gallery, Admin, Contact)
  ├── /uploads/*      ──► Static Media Storage (Cover images, blog graphics, gallery items)
  ├── /assets/*       ──► Compiled React Assets (Vite CSS, JS, fonts, images)
  └── /* (Fallback)   ──► React index.html (Client-side routing via React Router)
```

In production, Flask serves the compiled React distribution (`frontend/dist/`) and all API endpoints from the **same domain**. No separate frontend hosting or CORS setup is required for normal operation.

---

## Project Structure

```text
kim-suu/
│
├── frontend/                     # React / Vite Client Application
│   ├── src/                      # Components, pages, context, styles
│   │   ├── services/api.js       # Centralized API client (relative /api URLs)
│   │   └── ...
│   ├── public/                   # Static assets
│   ├── package.json              # Frontend package configuration
│   ├── vite.config.js            # Vite build & development proxy
│   └── dist/                     # Production build output (generated)
│
├── backend/                      # Python / Flask API & Server
│   ├── app/                      # Flask application factory, blueprints & services
│   │   ├── __init__.py           # Application factory with SPA serving & safeguards
│   │   ├── config.py             # Unified environment & path configuration
│   │   ├── routes/               # API routes (books, blogs, stories, gallery, admin)
│   │   ├── services/             # Data persistence (data_service) & upload service
│   │   └── auth/                 # JWT authentication & admin decorators
│   ├── app.py                    # Backend application entry point
│   ├── data/                     # Local JSON content files (books, blogs, admin, etc.)
│   ├── uploads/                  # Uploaded image files (categorized)
│   ├── requirements.txt          # Python dependencies
│   └── tests/                    # Automated test suites (API + SPA serving)
│
├── api/
│   └── index.py                  # Serverless function bridge for Vercel deployment
│
├── app.py                        # Root production entry point
├── package.json                  # Root npm scripts (delegates build to frontend)
├── requirements.txt              # Root Python dependencies
├── vercel.json                   # Unified Vercel deployment configuration
├── Procfile                      # Process configuration for Render / Railway / Heroku
├── .env.example                  # Environment variable reference
└── README.md                     # Project documentation
```

---

## Quick Start (Development)

To run the application locally in development mode:

### 1. Install Dependencies

```bash
# Python backend dependencies
pip install -r requirements.txt

# React frontend dependencies
cd frontend && npm install && cd ..
```

### 2. Start Servers

Open two terminals:

**Terminal 1 — Backend:**
```bash
python backend/app.py
```
*Backend runs on `http://localhost:5000`.*

**Terminal 2 — Frontend (with Hot Reload):**
```bash
npm run dev
# or: cd frontend && npm run dev
```
*Frontend runs on `http://localhost:5173`. Requests to `/api/*` and `/uploads/*` are automatically proxied to Flask.*

---

## Production Build & Run (Single Application)

In production, the frontend is compiled into static files and served directly by Flask as a single unified service:

```bash
# 1. Build the React frontend
npm run build

# 2. Start the unified Flask server
python app.py
# or: python backend/app.py
```

Open:
- **Website**: `http://localhost:5000/`
- **Any Direct Page**: `http://localhost:5000/about`, `http://localhost:5000/books/hulu-aththa`, `http://localhost:5000/blog`
- **Admin Dashboard**: `http://localhost:5000/admin`
- **APIs**: `http://localhost:5000/api/books`, `http://localhost:5000/api/blogs`

---

## Deployment Guides

### Option A: Persistent Host / PaaS (Recommended for Current Architecture)

Platforms such as **Render**, **Railway**, **Fly.io**, **DigitalOcean App Platform**, or a standard **VPS**:
- Support full persistence for local `backend/data/*.json` content and `backend/uploads/` images.
- Mount a persistent volume on `backend/data` and `backend/uploads` for zero data loss across container redeployments.

**Build Command**:
```bash
npm run build && pip install -r requirements.txt
```

**Start Command**:
```bash
python app.py
# or with gunicorn:
gunicorn app:app --bind 0.0.0.0:$PORT
```

---

### Option B: Vercel Deployment

The repository includes a ready-to-use [`vercel.json`](vercel.json) and [`api/index.py`](api/index.py):

```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "frontend/dist",
  "builds": [
    {
      "src": "api/index.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "api/index.py" },
    { "src": "/uploads/(.*)", "dest": "api/index.py" },
    { "handle": "filesystem" },
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
```

#### Important Persistence Notice for Serverless (Vercel):
- **Serverless functions run in read-only containers**: Pre-committed data in `backend/data/*.json` and static files in `backend/uploads` can be read and served.
- However, **writes made through the Admin Panel will not persist permanently on Vercel** because the local filesystem in AWS Lambda / Vercel Serverless is ephemeral.
- To enable persistent Admin writes on Vercel, connect an external cloud database (e.g. Supabase, PostgreSQL, MongoDB) in `backend/app/services/data_service.py` and cloud storage (e.g. Cloudinary, AWS S3) in `backend/app/services/upload_service.py`. The data service layer is already abstracted with clean CRUD helper functions for easy database swapping.

---

## Environment Variables

| Variable | Default | Purpose |
|---|---|---|
| `FLASK_ENV` | `production` | Set to `development` for local debug reload |
| `FLASK_DEBUG` | `False` | Enable Flask debug traceback |
| `PORT` | `5000` | Port for the Flask server |
| `HOST` | `0.0.0.0` | Binding host address |
| `SECRET_KEY` | `(default)` | Flask session security key (change in prod) |
| `JWT_SECRET_KEY` | `(default)` | Secret key for signing admin JWT tokens |
| `JWT_EXPIRATION_HOURS` | `24` | Token validity duration |
| `FRONTEND_DIST_FOLDER` | `frontend/dist` | Path to compiled React build directory |
| `DATA_FOLDER` | `backend/data` | Path to JSON data store directory |
| `UPLOAD_FOLDER` | `backend/uploads`| Path to media upload directory |

---

## Running Automated Tests

Run the complete test suite (20 tests covering API, Admin auth/CRUD, uploads, and SPA fallback routing):

```bash
python -m unittest discover backend/tests
```
