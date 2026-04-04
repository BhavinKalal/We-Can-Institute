from fastapi import APIRouter

from app.api.routes.health import router as health_router
from app.api.routes.auth import router as auth_router
from app.api.routes.public import router as public_router
from app.api.routes.settings import router as settings_router
from app.api.routes.hero import router as hero_router
from app.api.routes.batches import router as batches_router
from app.api.routes.media import router as media_router
from app.api.routes.admin_users import router as admin_users_router
from app.api.routes.faculty import router as faculty_router
from app.api.routes.gallery import router as gallery_router
from app.api.routes.blog import router as blog_router
from app.api.routes.testimonials import router as testimonials_router
from app.api.routes.enquiries import router as enquiries_router


api_router = APIRouter()
api_router.include_router(health_router)
api_router.include_router(auth_router)
api_router.include_router(public_router)
api_router.include_router(settings_router, prefix="/admin", tags=["admin"])
api_router.include_router(hero_router, prefix="/admin", tags=["admin"])
api_router.include_router(batches_router, prefix="/admin", tags=["admin"])
api_router.include_router(media_router, prefix="/admin", tags=["admin"])
api_router.include_router(admin_users_router, prefix="/admin", tags=["admin"])
api_router.include_router(faculty_router, prefix="/admin", tags=["admin"])
api_router.include_router(gallery_router, prefix="/admin", tags=["admin"])
api_router.include_router(blog_router, prefix="/admin", tags=["admin"])
api_router.include_router(testimonials_router, prefix="/admin", tags=["admin"])
api_router.include_router(enquiries_router, prefix="/admin", tags=["admin"])
