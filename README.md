# WE CAN Institute - Project Status and Run Guide

Last updated: April 5, 2026

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
- Testimonials
- Gallery (image/video upload, visibility toggle, optional external video URL)
- Blog (single cover image per post)
- Public enquiry submission and admin enquiry workflow

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
- [x] Phase 14: Public enquiry submission
- [x] Phase 15: Admin enquiry workflow
- [x] Phase 16: Media strategy
- [x] Phase 17: Admin authentication
- [ ] Phase 18: Content cleanup
- [~] Phase 19: QA and hardening
- [~] Phase 20: Deployment and documentation

Notes:
- Final cleanup, broader QA coverage, and deployment polish are still in progress.

## 3) What Was Verified in This Stabilization Pass

- Backend API smoke checks passed (health + admin/public paths).
- Admin pages opened and basic actions verified:
  - Hero
  - Settings
  - Batches
  - Faculty
  - Testimonials
  - Gallery
  - Blog
  - Enquiries
- Public homepage dynamic content load verified.
- Public enquiry submission verified.
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

Docker alternative from repo root:

```powershell
docker compose up --build
```

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
- Content cleanup pass
- QA hardening beyond current backend coverage
- Deployment polish, backups/logging basics, and production env review

## 8) Recommended Next Step

Proceed from the current stable baseline with:
1. Phase 18 content cleanup
2. Phase 19 UX and API hardening
3. Phase 20 deployment polish
