# Suchetha Kapuarachchi Portfolio — REST API Documentation

Comprehensive REST API reference for Suchetha Kapuarachchi's Interactive Author Sanctuary backend.

- **Base URL**: `http://localhost:5000/api`
- **Content Type**: `application/json` (except `/api/admin/upload` which uses `multipart/form-data`)
- **Authentication**: JWT Bearer Token (`Authorization: Bearer <token>`)

---

## 1. Authentication & Security

### Admin Credentials (Development)
- **Username**: `Kavii`
- **Password**: `Kavii@2005`
- **Password Hash**: Stored in `backend/data/admin.json` as Werkzeug `scrypt` hash. Plaintext passwords are never stored or logged.

### JWT Format
Protected admin endpoints require the following HTTP header:
```http
Authorization: Bearer <jwt_token>
```
If the header is missing, malformed, or the token is expired/invalid, the API returns HTTP `401 Unauthorized`.

---

## 2. Endpoints Overview

| Area | Method | Endpoint | Access | Description |
|------|--------|----------|--------|-------------|
| **System** | `GET` | `/api/health` | Public | Health check & system status |
| **Auth** | `POST` | `/api/admin/login` | Public | Admin login, returns JWT token |
| **Auth** | `POST` | `/api/admin/logout` | Admin | Invalidate session |
| **Auth** | `GET` | `/api/admin/verify` | Admin | Verify current token and payload |
| **Auth** | `PUT` | `/api/admin/profile` | Admin | Update username or password |
| **Dashboard**| `GET` | `/api/admin/dashboard` | Admin | Aggregate counts & recent inquiries |
| **Books** | `GET` | `/api/books` | Public | List all published books |
| **Books** | `GET` | `/api/books/<id_or_slug>` | Public | Single published book |
| **Books** | `GET` | `/api/books/slug/<slug>` | Public | Single published book by slug |
| **Books** | `GET` | `/api/admin/books` | Admin | List all books (including drafts) |
| **Books** | `POST` | `/api/admin/books` | Admin | Create book entry |
| **Books** | `PUT` | `/api/admin/books/<id>` | Admin | Update book entry |
| **Books** | `DELETE` | `/api/admin/books/<id>` | Admin | Delete book entry |
| **Books** | `PATCH` | `/api/admin/books/<id>/publish` | Admin | Toggle or set publish status |
| **Blogs** | `GET` | `/api/blogs` | Public | List published blogs (search/filter/page) |
| **Blogs** | `GET` | `/api/blogs/<id_or_slug>` | Public | Single published blog post |
| **Blogs** | `GET` | `/api/blogs/slug/<slug>` | Public | Single published blog by slug |
| **Blogs** | `GET` | `/api/admin/blogs` | Admin | List all blogs (including drafts) |
| **Blogs** | `POST` | `/api/admin/blogs` | Admin | Create blog post |
| **Blogs** | `PUT` | `/api/admin/blogs/<id>` | Admin | Update blog post |
| **Blogs** | `DELETE` | `/api/admin/blogs/<id>` | Admin | Delete blog post |
| **Blogs** | `PATCH` | `/api/admin/blogs/<id>/publish` | Admin | Toggle or set publish status |
| **Stories** | `GET` | `/api/stories` | Public | List published stories & poems |
| **Stories** | `GET` | `/api/stories/<id>` | Public | Single published story |
| **Stories** | `GET` | `/api/admin/stories` | Admin | List all stories (including drafts) |
| **Stories** | `POST` | `/api/admin/stories` | Admin | Create story entry |
| **Stories** | `PUT` | `/api/admin/stories/<id>` | Admin | Update story entry |
| **Stories** | `DELETE` | `/api/admin/stories/<id>` | Admin | Delete story entry |
| **Stories** | `PATCH` | `/api/admin/stories/<id>/publish` | Admin | Toggle or set publish status |
| **Gallery** | `GET` | `/api/gallery` | Public | List published gallery items |
| **Gallery** | `GET` | `/api/gallery/<id>` | Public | Single published gallery item |
| **Gallery** | `GET` | `/api/admin/gallery` | Admin | List all gallery items |
| **Gallery** | `POST` | `/api/admin/gallery` | Admin | Create gallery item |
| **Gallery** | `PUT` | `/api/admin/gallery/<id>` | Admin | Update gallery item |
| **Gallery** | `DELETE` | `/api/admin/gallery/<id>` | Admin | Delete gallery item |
| **Gallery** | `PATCH` | `/api/admin/gallery/<id>/publish` | Admin | Toggle or set publish status |
| **Author** | `GET` | `/api/author` | Public | Author profile, bio, philosophy |
| **Author** | `PUT` | `/api/admin/author` | Admin | Update author profile |
| **Contact** | `POST` | `/api/contact` | Public | Reader message submission |
| **Contact** | `GET` | `/api/admin/messages` | Admin | List reader inquiries |
| **Contact** | `PUT` | `/api/admin/messages/<id>/read` | Admin | Mark message read/unread |
| **Contact** | `DELETE` | `/api/admin/messages/<id>` | Admin | Delete message |
| **Settings**| `GET` | `/api/settings` | Public | Website settings & theme |
| **Settings**| `PUT` | `/api/admin/settings` | Admin | Update site settings |
| **Media** | `POST` | `/api/admin/upload` | Admin | Pillow-verified image upload |
| **Media** | `GET` | `/uploads/<category>/<file>` | Public | Static file serving |

---

## 3. Detailed Endpoint Specifications

### 3.1 System Health
#### `GET /api/health`
Returns service health and operational status.
- **Status**: `200 OK`
- **Response**:
```json
{
  "success": true,
  "message": "Suchetha Kapuarachchi Author Portfolio API is operational",
  "status": "healthy",
  "version": "1.0.0"
}
```

---

### 3.2 Authentication

#### `POST /api/admin/login`
- **Request Body**:
```json
{
  "username": "Kavii",
  "password": "Kavii@2005"
}
```
- **Response (200 OK)**:
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "admin-1",
    "name": "Kavii (Admin)",
    "role": "admin",
    "username": "Kavii"
  }
}
```
- **Response (401 Unauthorized)**:
```json
{
  "success": false,
  "error": "Invalid username or password"
}
```

#### `GET /api/admin/verify`
- **Headers**: `Authorization: Bearer <token>`
- **Response (200 OK)**:
```json
{
  "success": true,
  "valid": true,
  "user": {
    "exp": 1790250000,
    "iat": 1790163600,
    "role": "admin",
    "sub": "admin-1",
    "username": "Kavii"
  }
}
```

---

### 3.3 Admin Dashboard

#### `GET /api/admin/dashboard`
Aggregates published and draft statistics across all entities.
- **Headers**: `Authorization: Bearer <token>`
- **Response (200 OK)**:
```json
{
  "success": true,
  "counts": {
    "blogs": { "drafts": 0, "published": 3, "total": 3 },
    "books": { "drafts": 0, "published": 2, "total": 2 },
    "gallery": { "drafts": 0, "published": 9, "total": 9 },
    "messages": { "read": 0, "total": 1, "unread": 1 },
    "stories": { "drafts": 0, "published": 5, "total": 5 }
  },
  "recent_messages": [
    {
      "created_at": "2026-09-23T09:42:23.300922+00:00",
      "email": "nimali@example.com",
      "id": "message-9c2bbcce",
      "message": "I would love to purchase a signed copy of Hulu Aththa.",
      "name": "Nimali Senanayake",
      "read": false,
      "subject": "Inquiry regarding Hulu Aththa"
    }
  ]
}
```

---

### 3.4 Books

#### `GET /api/books`
Returns all published books.
- **Response (200 OK)**:
```json
{
  "count": 2,
  "data": [
    {
      "id": "book-1",
      "slug": "hulu-aththa",
      "title_si": "හුළු අත්ත",
      "title_en": "Hulu Aththa",
      "author": "සුචේතා කපුආරච්චි (Suchetha Kapuarachchi)",
      "theme_id": "huluAththa",
      "theme": {
        "primary": "#718A68",
        "secondary": "#A8B89C",
        "background": "#F4F6ED",
        "text": "#263126",
        "accent": "#D9C7A3",
        "name": "Light Green / Forest Literary Theme"
      },
      "published": true
    }
  ],
  "success": true
}
```

#### `POST /api/admin/books`
Create a new book entry.
- **Headers**: `Authorization: Bearer <token>`, `Content-Type: application/json`
- **Request Body**:
```json
{
  "title_si": "නවකතා නාමය",
  "title_en": "Novel Title",
  "author": "Suchetha Kapuarachchi",
  "genre": "Literary Fiction",
  "published_year": "2026",
  "pages": 280,
  "published": false,
  "theme": {
    "primary": "#4A6B82",
    "secondary": "#7D9DAB",
    "background": "#F0F4F8",
    "text": "#1E2A38",
    "accent": "#C29B38"
  }
}
```
- **Response (201 Created)**: Returns created book object with generated `id`, `slug`, `created_at`, `updated_at`.

#### `PATCH /api/admin/books/<id>/publish`
- **Request Body**: `{"published": true}` (or omit to toggle)
- **Response (200 OK)**: Updated book.

---

### 3.5 Blogs & Reflections

#### `GET /api/blogs`
Query parameters:
- `search`: string to search in titles, contents, excerpts, and tags
- `category`: category name (case-insensitive)
- `tag`: tag string
- `page`: integer (default: 1)
- `limit`: integer (default: 10, pass 0 for all)

- **Response (200 OK)**:
```json
{
  "count": 3,
  "data": [ ... ],
  "page": 1,
  "success": true,
  "total": 3,
  "total_pages": 1
}
```

---

### 3.6 Contact Messages

#### `POST /api/contact`
Public reader message submission.
- **Request Body**:
```json
{
  "name": "Anura Dissanayake",
  "email": "anura@example.com",
  "subject": "Literary Review",
  "message": "Your portrayal of nature in Hulu Aththa is deeply moving."
}
```
- **Response (201 Created)**:
```json
{
  "data": {
    "created_at": "2026-09-23T10:00:00+00:00",
    "id": "message-8f12a3bc"
  },
  "message": "Thank you for reaching out. Your message has been received.",
  "success": true
}
```

#### `GET /api/admin/messages`
- **Query Parameters**: `?read=false` or `?read=true`
- **Headers**: `Authorization: Bearer <token>`
- **Response (200 OK)**: List of messages sorted descending by date.

#### `PUT /api/admin/messages/<id>/read`
- **Headers**: `Authorization: Bearer <token>`
- **Request Body**: `{"read": true}`
- **Response (200 OK)**: Updated message.

---

### 3.7 Media & Image Uploads

#### `POST /api/admin/upload`
Uploads and validates an image using Pillow (structure, format, headers verified).
- **Headers**: `Authorization: Bearer <token>`, `Content-Type: multipart/form-data`
- **Form Data**:
  - `file`: binary image (`.png`, `.jpg`, `.jpeg`, `.webp`, max 5MB)
  - `category`: `books` | `blogs` | `stories` | `gallery` | `author`
- **Response (201 Created)**:
```json
{
  "data": {
    "category": "books",
    "filename": "d3b07384d113edec49eaa6238ad5ff00.png",
    "format": "png",
    "height": 800,
    "size_bytes": 352410,
    "success": true,
    "url": "/uploads/books/d3b07384d113edec49eaa6238ad5ff00.png",
    "width": 600
  },
  "message": "Image uploaded successfully",
  "success": true
}
```

---

## 4. Example `curl` Commands

### Admin Login
```bash
curl -X POST http://localhost:5000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"username": "Kavii", "password": "Kavii@2005"}'
```

### Get Dashboard Stats
```bash
curl -X GET http://localhost:5000/api/admin/dashboard \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Publish a Book
```bash
curl -X PATCH http://localhost:5000/api/admin/books/book-1/publish \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"published": true}'
```

### Submit Contact Message
```bash
curl -X POST http://localhost:5000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sunil Perera",
    "email": "sunil@example.com",
    "subject": "Book Order",
    "message": "Where can I buy Arungal in Kandy?"
  }'
```

### Upload Book Cover Image
```bash
curl -X POST http://localhost:5000/api/admin/upload \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "category=books" \
  -F "file=@/path/to/cover.png"
```
