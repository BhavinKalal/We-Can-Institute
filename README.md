# WE CAN Institute - Project Status and Run Guide

Last updated: April 4, 2026

## 1) Current State (Clear Summary)

This project now has 3 parts:
- `frontend/` - public website
- `admin-frontend/` - admin panel
- `backend/` - FastAPI + SQLite + Alembic

Core content is backend-driven and verified working:
- Site settings
- Hero section + hero stats
- Batches
- Faculty (one profile photo per faculty)
- Gallery (image/video upload, visibility toggle, optional external video URL)
- Blog (single cover image per post)

Media upload behavior is working as expected:
- Admin uploads file
- Backend stores file under `backend/media/...`
- Relative path is saved in DB
- Frontend reads path from DB and renders latest content after refresh

## 2) Phase Progress Snapshot

Based on implementation and verification done so far:
- [x] Phase 0: Project alignment
- [x] Phase 1: Backend foundation
- [x] Phase 2: Database setup
- [x] Phase 3: Core content schema
- [x] Phase 4: Public homepage API
- [x] Phase 5: Admin API for core sections
- [x] Phase 6: Admin Hero connected
- [x] Phase 7: Admin Settings connected
- [x] Phase 8: Admin Batches connected
- [x] Phase 9: Frontend dynamic core content
- [x] Phase 10: Faculty module connected
- [x] Phase 11: Testimonials module connected
- [x] Phase 12: Gallery module connected
- [x] Phase 13: Blog module connected
- [ ] Phase 14+: remaining roadmap items pending

Notes:
- Final hardening/auth/deployment phases are still pending.

## 3) What Was Verified in This Stabilization Pass

- Backend API smoke checks passed (health + admin/public paths).
- Admin pages opened and basic actions verified:
  - Hero
  - Settings
  - Batches
  - Faculty
  - Gallery
  - Blog
- Public homepage dynamic content load verified.
- Critical bugs fixed:
  - Settings URL save crash (`HttpUrl` DB binding)
  - Gallery modal structure/runtime issue
  - Blog editor visibility toggle issue
  - Missing fallback asset references

## 4) Local Run Instructions

### Backend
From repo root:

```powershell
cd backend
$env:DEBUG='true'
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```

API base:
- `http://localhost:8000/api/v1`

### Admin Frontend
Serve `admin-frontend/` via any static server (example):

```powershell
cd admin-frontend
python -m http.server 5501
```

Open:
- `http://localhost:5501`

### Public Frontend
Serve `frontend/` similarly (example):

```powershell
cd frontend
python -m http.server 5500
```

Open:
- `http://localhost:5500`

## 5) Auth (Current)

Admin now uses login + signed token auth.

### Login endpoint
- `POST /api/v1/auth/login`
- Admin token is returned and stored in browser localStorage by admin UI.

### Admin UI
- Login page: `admin-frontend/login.html`
- Unauthenticated users are redirected to login.
- Public website does not require login.

### Default bootstrap credentials (change in `.env` for production)
- `SUPER_ADMIN_EMAIL=admin@wecan.local`
- `SUPER_ADMIN_PASSWORD=admin123`
- `SUPER_ADMIN_FULL_NAME=Super Admin`

### Role-based access
- `super_admin`:
  - Can create/update/delete admin users from `admin-frontend/pages/admin-users.html`
  - Can change own password
  - Protected bootstrap super admin cannot be deleted/deactivated or downgraded
- `admin`:
  - Can manage content modules
  - Cannot access admin user management page

### Protected APIs
- Admin endpoints require token in header:
  - `X-Admin-Token: <token>`
  - `Authorization: Bearer <token>` (also accepted)

## 6) Media and Storage

- Uploaded media is stored under `backend/media/`.
- Paths are persisted in DB and reused by frontend/admin.
- `backend/media/` is intentionally git-ignored for local/dev uploads.

## 7) Known Remaining Work

Still pending from roadmap:
- Testimonials completion/verification
- Enquiry submission + admin workflow
- Production auth/authorization
- Content cleanup pass
- QA hardening and tests
- Deployment + backups/logging docs

## 8) Recommended Next Step

Proceed with next roadmap phase from this stable baseline, starting with whichever is highest priority:
1. Testimonials completion
2. Enquiry workflow
3. Admin authentication
