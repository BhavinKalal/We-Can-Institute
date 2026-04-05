# Backend Setup

This backend now includes:

- FastAPI application scaffold
- versioned API prefix at `/api/v1`
- CORS configuration for local frontend/admin development
- SQLAlchemy database session setup
- Alembic migration scaffold
- admin authentication and protected admin APIs
- content modules for hero, settings, batches, faculty, testimonials, gallery, blog, and enquiries
- media upload handling for hero, faculty, gallery, and blog assets
- health endpoints

## Install

Create a virtual environment, then install:

```powershell
pip install -r requirements.txt
```

## Environment

Copy the example environment file and adjust values if needed:

```powershell
Copy-Item .env.example .env
```

The default database is SQLite at `backend/data/wecan.db`.

## Run The API

From the `backend` directory:

```powershell
uvicorn app.main:app --reload
```

Or from the repo root with Docker Compose:

```powershell
docker compose up --build
```

App URLs:

- API root: `http://127.0.0.1:8000/`
- OpenAPI docs: `http://127.0.0.1:8000/docs`
- Health: `http://127.0.0.1:8000/api/v1/health`
- Readiness: `http://127.0.0.1:8000/api/v1/health/ready`
- Public homepage payload: `http://127.0.0.1:8000/api/v1/public/homepage`

## Run Migrations

Apply the initial migration:

```powershell
alembic upgrade head
```

Create future migrations:

```powershell
alembic revision --autogenerate -m "describe change"
```

## Run Tests

From the `backend` directory:

```powershell
python -m pytest -q
```

Current backend test status in this repo: `13 passed`.

## Seed Mock Admin Data

To preload the database with the mock content that originally lived in [api.js](../admin-frontend/assets/js/api.js), run this from the `backend` directory:

```powershell
python scripts/seed_admin_api_mock_data.py
```

This loads the checked-in fixture at `app/fixtures/admin_api_mock.json`, upserts hero/settings/content rows, and copies referenced local media into `backend/media/fixtures/` so the backend can serve them via `/media/...`.
