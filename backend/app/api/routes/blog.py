from __future__ import annotations

from fastapi import APIRouter, HTTPException, status

from app.api.deps import AdminDep, SessionDep
from app.schemas.blog import BlogPost, BlogPostCreate, BlogPostUpdate
from app.services import blog_service


router = APIRouter(prefix="/blog", tags=["Blog"], dependencies=[AdminDep])


@router.post("/", response_model=BlogPost, status_code=status.HTTP_201_CREATED)
def create_blog_post(db: SessionDep, post_in: BlogPostCreate):
    return blog_service.create_blog_post(db, post_in)


@router.get("/", response_model=list[BlogPost])
def read_blog_posts(db: SessionDep, skip: int = 0, limit: int = 200):
    return blog_service.get_blog_posts(db, skip=skip, limit=limit)


@router.get("/{post_id}", response_model=BlogPost)
def read_blog_post(db: SessionDep, post_id: int):
    post = blog_service.get_blog_post(db, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return post


@router.put("/{post_id}", response_model=BlogPost)
def update_blog_post(db: SessionDep, post_id: int, post_in: BlogPostUpdate):
    post = blog_service.update_blog_post(db, post_id, post_in)
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return post


@router.delete("/{post_id}", response_model=BlogPost)
def delete_blog_post(db: SessionDep, post_id: int):
    post = blog_service.delete_blog_post(db, post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return post
