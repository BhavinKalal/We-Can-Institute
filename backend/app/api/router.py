from fastapi import APIRouter

from app.api.routes.health import router as health_router
from app.api.routes.public import router as public_router
from app.api.routes.settings import router as settings_router
from app.api.routes.hero import router as hero_router
from app.api.routes.batches import router as batches_router
from app.api.routes.media import router as media_router
from app.api.routes.faculty import router as faculty_router
from app.api.routes.gallery import router as gallery_router
from app.api.routes.blog import router as blog_router


api_router = APIRouter()
api_router.include_router(health_router)
api_router.include_router(public_router)
api_router.include_router(settings_router, prefix="/admin", tags=["admin"])
api_router.include_router(hero_router, prefix="/admin", tags=["admin"])
api_router.include_router(batches_router, prefix="/admin", tags=["admin"])
api_router.include_router(media_router, prefix="/admin", tags=["admin"])
api_router.include_router(faculty_router, prefix="/admin", tags=["admin"])
api_router.include_router(gallery_router, prefix="/admin", tags=["admin"])
api_router.include_router(blog_router, prefix="/admin", tags=["admin"])
