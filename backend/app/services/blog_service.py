from __future__ import annotations

from datetime import date

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.blog_post import BlogPost
from app.schemas.blog import BlogPostCreate, BlogPostUpdate


def get_blog_post(db: Session, post_id: int) -> BlogPost | None:
    return db.get(BlogPost, post_id)


def get_blog_posts(db: Session, skip: int = 0, limit: int = 200) -> list[BlogPost]:
    statement = (
        select(BlogPost)
        .offset(skip)
        .limit(limit)
        .order_by(BlogPost.sort_order.asc(), BlogPost.published_date.desc().nullslast(), BlogPost.id.desc())
    )
    return list(db.scalars(statement))


def _normalize_post_data(data: dict) -> dict:
    if data.get("status") == "published" and data.get("published_date") is None:
        data["published_date"] = date.today()
    return data


def create_blog_post(db: Session, post_in: BlogPostCreate) -> BlogPost:
    data = _normalize_post_data(post_in.model_dump())
    post = BlogPost(**data)
    db.add(post)
    db.commit()
    db.refresh(post)
    return post


def update_blog_post(db: Session, post_id: int, post_in: BlogPostUpdate) -> BlogPost | None:
    post = get_blog_post(db, post_id)
    if not post:
        return None

    update_data = _normalize_post_data(post_in.model_dump(exclude_unset=True))
    for field, value in update_data.items():
        setattr(post, field, value)

    db.add(post)
    db.commit()
    db.refresh(post)
    return post


def delete_blog_post(db: Session, post_id: int) -> BlogPost | None:
    post = get_blog_post(db, post_id)
    if not post:
        return None
    db.delete(post)
    db.commit()
    return post
