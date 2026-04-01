# Backend Setup

This backend now includes:

- FastAPI application scaffold
- versioned API prefix at `/api/v1`
- CORS configuration for local frontend/admin development
- SQLAlchemy database session setup
- Alembic migration scaffold
- initial `admin_users` table migration
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

App URLs:

- API root: `http://127.0.0.1:8000/`
- OpenAPI docs: `http://127.0.0.1:8000/docs`
- Health: `http://127.0.0.1:8000/api/v1/health`
- Readiness: `http://127.0.0.1:8000/api/v1/health/ready`

## Run Migrations

Apply the initial migration:

```powershell
alembic upgrade head
```

Create future migrations:

```powershell
alembic revision --autogenerate -m "describe change"
```
