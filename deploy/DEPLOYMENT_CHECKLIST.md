# Deployment Checklist

## Before First Deploy

- Copy `backend/.env.production.example` to `backend/.env.production`
- Set a strong `SECRET_KEY`
- Change default super admin email/password
- Set `BACKEND_CORS_ORIGINS` for your real domain
- Confirm `backend/data/` and `backend/media/` should persist on the host

## Deploy

```powershell
docker compose -f docker-compose.prod.yml up --build -d
```

## Verify

- Open `/`
- Open `/admin/`
- Check `/api/v1/health`
- Log in to admin successfully
- Confirm homepage data loads
- Upload one media file from admin and confirm it appears publicly
- Submit one public enquiry and confirm it appears in admin

## Backups

Create a backup archive of database and media:

```powershell
powershell -ExecutionPolicy Bypass -File deploy/scripts/backup_data.ps1
```

## Operational Checks

- Review `docker compose -f docker-compose.prod.yml ps`
- Review `docker compose -f docker-compose.prod.yml logs --tail=200`
- Confirm disk space for `backend/data/`, `backend/media/`, and backup archives
- If using a real domain, configure HTTPS at the host/reverse-proxy level

## After Deploy

- Store `.env.production` securely
- Schedule periodic backups
- Monitor container restarts and health status
