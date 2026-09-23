# Suchetha Kapuarachchi Author Portfolio — Backend API

Production-ready, modular REST API for the **Suchetha Kapuarachchi (Kim Suu Ah)** Interactive Author Sanctuary website.

Built with **Python 3**, **Flask 3**, **Werkzeug**, **PyJWT**, **Pillow**, and **Flask-CORS**.

---

## 1. Architectural Highlights

- **Modular Blueprint Architecture**: No monolithic `app.py`. Routes are cleanly divided into modular blueprints under `app/routes/`.
- **Application Factory Pattern**: `create_app()` initializes configurations, blueprints, CORS, and custom error handlers.
- **Secure Authentication**:
  - Werkzeug `scrypt` password hashing (passwords never stored in plaintext).
  - PyJWT Bearer token generation with configurable expiration.
  - `@admin_required` decorator enforcing role checks on all administrative endpoints.
- **Atomic JSON Storage**:
  - Complete JSON-based data persistence in `backend/data/*.json`.
  - Atomic write transactions (temp file $\rightarrow$ JSON validation $\rightarrow$ `os.replace` + thread locking) ensure zero data corruption.
  - Decoupled `data_service.py` layer makes future database migrations (e.g., PostgreSQL / SQLite) seamless.
- **Image Upload & Verification**:
  - Pillow (`PIL.Image`) inspection verifies file headers, structure, and dimensions to prevent arbitrary file upload vulnerabilities.
  - Secure UUID-based naming and categorized storage in `backend/uploads/{books,blogs,stories,gallery,author}`.
- **CORS Configured**: Fully configured for the Vite frontend (`http://localhost:5173`) with credentials support.

---

## 2. Directory Structure

```text
backend/
│
├── app.py                     # Server entry point (starts server on port 5000)
├── requirements.txt           # Python dependencies
├── .env                       # Environment configuration (ignored in git)
├── .env.example               # Example environment variables template
├── API_DOCUMENTATION.md       # Comprehensive REST API specifications & curl examples
├── README.md                  # This documentation
│
├── app/                       # Application package
│   ├── __init__.py            # Flask application factory & error handlers
│   ├── config.py              # Configuration classes (Dev, Prod, Test)
│   │
│   ├── auth/                  # Authentication module
│   │   ├── __init__.py
│   │   ├── auth_service.py    # Login verification & password hashing
│   │   ├── decorators.py      # @admin_required decorator
│   │   └── tokens.py          # PyJWT token encode/decode
│   │
│   ├── routes/                # Modular Flask blueprints
│   │   ├── __init__.py
│   │   ├── admin_routes.py    # Dynamic dashboard statistics
│   │   ├── author_routes.py   # Author profile management
│   │   ├── auth_routes.py     # Admin login, logout, verification
│   │   ├── blogs_routes.py    # Blog posts CRUD, search, pagination
│   │   ├── books_routes.py    # Books CRUD & theme definitions
│   │   ├── contact_routes.py  # Reader message submission & inbox
│   │   ├── gallery_routes.py  # Gallery image items & categories
│   │   ├── health_routes.py   # /api/health endpoint
│   │   ├── settings_routes.py # Website configuration & themes
│   │   ├── stories_routes.py  # Stories, poems & literary notes
│   │   └── upload_routes.py   # Pillow image upload endpoint
│   │
│   └── services/              # Business logic & data access
│       ├── __init__.py
│       ├── data_service.py    # Thread-safe atomic JSON file operations
│       ├── upload_service.py  # Pillow verification & UUID file saving
│       └── validation_service.py # Input validation (email, strings, payloads)
│
├── data/                      # JSON data stores
│   ├── admin.json             # Admin credentials (scrypt hashed)
│   ├── author.json            # Suchetha Kapuarachchi bio & achievements
│   ├── blogs.json             # Blog posts & literary reflections
│   ├── books.json             # Hulu Aththa & Arungal with theme palettes
│   ├── gallery.json           # 9 curated gallery visual items
│   ├── messages.json          # Reader inquiries & contact messages
│   ├── settings.json          # Website settings & themes
│   └── stories.json           # Poems, excerpts & short stories
│
├── uploads/                   # Media asset storage
│   ├── author/
│   ├── blogs/
│   ├── books/
│   ├── gallery/
│   └── stories/
│
└── tests/                     # Automated test suite
    └── test_api.py            # Comprehensive unittest test suite
```

---

## 3. Quick Start Guide

### Prerequisites
- Python 3.11 or higher
- pip package manager

### 1. Install Dependencies
```bash
python -m pip install -r requirements.txt
```

### 2. Environment Configuration
Copy `.env.example` to `.env` and configure keys as needed:
```bash
cp .env.example .env
```

Default variables:
```env
FLASK_ENV=development
FLASK_DEBUG=True
PORT=5000
HOST=0.0.0.0
SECRET_KEY=change-this-to-a-secure-random-key-in-production
JWT_SECRET_KEY=change-this-to-a-secure-jwt-key-in-production
JWT_EXPIRATION_HOURS=24
FRONTEND_URL=http://localhost:5173
```

### 3. Start the Development Server
```bash
python backend/app.py
```
Server starts on `http://localhost:5000`. Test via browser or curl:
```bash
curl http://localhost:5000/api/health
```

---

## 4. Admin Credentials & Authentication

- **Username**: `Kavii`
- **Password**: `Kavii@2005`

Authenticate via `POST /api/admin/login`:
```bash
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username": "Kavii", "password": "Kavii@2005"}'
```

*Note: The visitor credentials (`Kim Suu Ah` / `20-09-2026`) remain strictly a frontend entrance invitation experience.*

---

## 5. Running Automated Tests

Run the complete test suite:
```bash
python -m unittest backend/tests/test_api.py
```
The test suite validates:
- System health checks
- Admin login failure on wrong credentials
- Admin login success & JWT verification
- Route protection rejecting unauthenticated calls
- Book listing, slug lookup, draft hiding, and publish lifecycle
- Blog search, category filtering, and pagination
- Stories, Poems, and Gallery retrieval
- Author profile retrieval & updates
- Contact form input validation (email regex) and admin message management
- Admin aggregate dashboard calculations
- Pillow image upload and static media serving

---

## 6. Production Deployment Guidelines

For production environments:
1. **WSGI Server**: Use **Gunicorn** or **Waitress** (for Windows):
   ```bash
   gunicorn -w 4 -b 0.0.0.0:5000 backend.app:create_app()
   ```
2. **Reverse Proxy**: Place behind **Nginx** or **Caddy** with SSL/TLS (Let's Encrypt).
3. **Environment Secrets**: Generate cryptographically random `SECRET_KEY` and `JWT_SECRET_KEY` using:
   ```bash
   python -c "import secrets; print(secrets.token_hex(32))"
   ```
4. **Media Storage**: For high-scale deployments, replace `upload_service.py` to upload directly to Amazon S3 or Cloudflare R2 while preserving the same API contracts.
