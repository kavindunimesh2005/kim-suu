# Suchetha Kapuarachchi Portfolio — Unified Hosting Guide

Frontend සහ Backend දෙකම එකම folder එකක් / single deployable project එකක් ලෙස සකසා ඇත.

---

## 🔑 Login Credentials (පිවිසුම් තොරතුරු)

### 1. 🛡️ Admin Portal Access ([http://localhost:5000/admin/login](http://localhost:5000/admin/login)):
- **Username:** `admin`
- **Password:** `admin123`

### 2. 💌 Visitor Welcome Invitation Access:
- **Username:** `Kim Suu Ah`
- **Password:** `20-09-2026`

---

## 📁 ව්‍යාපෘතියේ ව්‍යුහය (Project Structure)

```text
kim-suu-/
├── server.py                  # ප්‍රධාන Entrypoint එක (Flask API + React Frontend දෙකම serve කරයි)
├── requirements.txt           # Python backend & production dependencies (Gunicorn ඇතුළුව)
├── Procfile                   # Cloud hosting (Render, Railway, Heroku) සඳහා
├── dist/                      # Production-ready React Frontend build එක
├── backend/                   # Flask Backend logic, APIs සහ data/uploads
│   ├── app/                   # Routes, services, auth
│   ├── data/                  # All JSON data stores (admin.json ඇතුළුව)
│   └── uploads/               # Uploaded files
├── frontend/                  # Original React source code
└── suchetha-portfolio-unified.zip # Hosting server එකට upload කිරීමට සූදානම් කළ Single ZIP file එක
```

---

## 🚀 Local එකේ Run කරන්නේ කෙසේද? (How to Run Locally)

1. Root folder එකේ terminal එක විවෘත කරන්න:
   ```bash
   pip install -r requirements.txt
   python server.py
   ```
2. Browser එකෙන් පිවිසෙන්න:
   - 🌐 **Website:** `http://localhost:5000`
   - 🛡️ **Admin Portal:** `http://localhost:5000/admin/login`

---

## 🌐 Cloud Host කරන්නේ කෙසේද? (Deployment)

### Render.com / Railway:
- **Build Command:** `pip install -r requirements.txt`
- **Start Command:** `gunicorn server:app` (හෝ `python server.py`)
- **Root Directory:** `.`
