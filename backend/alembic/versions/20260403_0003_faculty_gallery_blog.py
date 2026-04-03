"""Add faculty, gallery, and blog tables

Revision ID: 20260403_0003
Revises: 20260401_0002
Create Date: 2026-04-03 10:00:00
"""
from __future__ import annotations

from alembic import op
import sqlalchemy as sa


revision = "20260403_0003"
down_revision = "20260401_0002"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "faculty_members",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=150), nullable=False),
        sa.Column("initials", sa.String(length=8), nullable=True),
        sa.Column("role", sa.String(length=120), nullable=False),
        sa.Column("speciality", sa.String(length=255), nullable=True),
        sa.Column("experience", sa.String(length=100), nullable=True),
        sa.Column("profile_photo_url", sa.String(length=500), nullable=True),
        sa.Column("tags", sa.JSON(), nullable=False, server_default="[]"),
        sa.Column("bio", sa.Text(), nullable=True),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP")),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP")),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.text("1")),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_faculty_members_id"), "faculty_members", ["id"], unique=False)
    op.create_index(op.f("ix_faculty_members_name"), "faculty_members", ["name"], unique=False)
    op.create_index(op.f("ix_faculty_members_sort_order"), "faculty_members", ["sort_order"], unique=False)
    op.create_index(op.f("ix_faculty_members_is_active"), "faculty_members", ["is_active"], unique=False)

    op.create_table(
        "gallery_items",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("category", sa.String(length=50), nullable=False),
        sa.Column("media_type", sa.String(length=20), nullable=False),
        sa.Column("caption", sa.String(length=255), nullable=True),
        sa.Column("media_url", sa.String(length=500), nullable=True),
        sa.Column("external_video_url", sa.Text(), nullable=True),
        sa.Column("is_visible", sa.Boolean(), nullable=False, server_default=sa.text("1")),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("item_date", sa.Date(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP")),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP")),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_gallery_items_id"), "gallery_items", ["id"], unique=False)
    op.create_index(op.f("ix_gallery_items_category"), "gallery_items", ["category"], unique=False)
    op.create_index(op.f("ix_gallery_items_media_type"), "gallery_items", ["media_type"], unique=False)
    op.create_index(op.f("ix_gallery_items_is_visible"), "gallery_items", ["is_visible"], unique=False)
    op.create_index(op.f("ix_gallery_items_sort_order"), "gallery_items", ["sort_order"], unique=False)

    op.create_table(
        "blog_posts",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("excerpt", sa.Text(), nullable=True),
        sa.Column("content", sa.Text(), nullable=True),
        sa.Column("category", sa.String(length=100), nullable=True),
        sa.Column("author", sa.String(length=120), nullable=True),
        sa.Column("read_time", sa.String(length=30), nullable=True),
        sa.Column("status", sa.String(length=20), nullable=False, server_default="draft"),
        sa.Column("featured", sa.Boolean(), nullable=False, server_default=sa.text("0")),
        sa.Column("cover_image_url", sa.String(length=500), nullable=True),
        sa.Column("published_date", sa.Date(), nullable=True),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP")),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP")),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.text("1")),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_blog_posts_id"), "blog_posts", ["id"], unique=False)
    op.create_index(op.f("ix_blog_posts_title"), "blog_posts", ["title"], unique=False)
    op.create_index(op.f("ix_blog_posts_category"), "blog_posts", ["category"], unique=False)
    op.create_index(op.f("ix_blog_posts_status"), "blog_posts", ["status"], unique=False)
    op.create_index(op.f("ix_blog_posts_featured"), "blog_posts", ["featured"], unique=False)
    op.create_index(op.f("ix_blog_posts_published_date"), "blog_posts", ["published_date"], unique=False)
    op.create_index(op.f("ix_blog_posts_sort_order"), "blog_posts", ["sort_order"], unique=False)
    op.create_index(op.f("ix_blog_posts_is_active"), "blog_posts", ["is_active"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_blog_posts_is_active"), table_name="blog_posts")
    op.drop_index(op.f("ix_blog_posts_sort_order"), table_name="blog_posts")
    op.drop_index(op.f("ix_blog_posts_published_date"), table_name="blog_posts")
    op.drop_index(op.f("ix_blog_posts_featured"), table_name="blog_posts")
    op.drop_index(op.f("ix_blog_posts_status"), table_name="blog_posts")
    op.drop_index(op.f("ix_blog_posts_category"), table_name="blog_posts")
    op.drop_index(op.f("ix_blog_posts_title"), table_name="blog_posts")
    op.drop_index(op.f("ix_blog_posts_id"), table_name="blog_posts")
    op.drop_table("blog_posts")

    op.drop_index(op.f("ix_gallery_items_sort_order"), table_name="gallery_items")
    op.drop_index(op.f("ix_gallery_items_is_visible"), table_name="gallery_items")
    op.drop_index(op.f("ix_gallery_items_media_type"), table_name="gallery_items")
    op.drop_index(op.f("ix_gallery_items_category"), table_name="gallery_items")
    op.drop_index(op.f("ix_gallery_items_id"), table_name="gallery_items")
    op.drop_table("gallery_items")

    op.drop_index(op.f("ix_faculty_members_is_active"), table_name="faculty_members")
    op.drop_index(op.f("ix_faculty_members_sort_order"), table_name="faculty_members")
    op.drop_index(op.f("ix_faculty_members_name"), table_name="faculty_members")
    op.drop_index(op.f("ix_faculty_members_id"), table_name="faculty_members")
    op.drop_table("faculty_members")
