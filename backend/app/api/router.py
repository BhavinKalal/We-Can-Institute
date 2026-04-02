from fastapi import APIRouter

from app.api.routes.health import router as health_router
from app.api.routes.public import router as public_router
from app.api.routes.settings import router as settings_router
from app.api.routes.hero import router as hero_router
from app.api.routes.batches import router as batches_router


api_router = APIRouter()
api_router.include_router(health_router)
api_router.include_router(public_router)
api_router.include_router(settings_router, prefix="/admin", tags=["admin"])
api_router.include_router(hero_router, prefix="/admin", tags=["admin"])
api_router.include_router(batches_router, prefix="/admin", tags=["admin"])
