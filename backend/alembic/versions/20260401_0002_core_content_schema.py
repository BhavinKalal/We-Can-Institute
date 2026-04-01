"""Add core content schema

Revision ID: 20260401_0002
Revises: 20260401_0001
Create Date: 2026-04-01 00:30:00
"""
from __future__ import annotations

from alembic import op
import sqlalchemy as sa


revision = "20260401_0002"
down_revision = "20260401_0001"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "batches",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=150), nullable=False),
        sa.Column("level", sa.String(length=50), nullable=False),
        sa.Column("icon", sa.String(length=16), nullable=True),
        sa.Column("duration", sa.String(length=100), nullable=False),
        sa.Column("timing", sa.String(length=150), nullable=False),
        sa.Column("seats", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("filled", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("badge", sa.String(length=100), nullable=True),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP")),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP")),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.text("1")),
        sa.CheckConstraint("filled <= seats", name="ck_batches_filled_lte_seats"),
        sa.CheckConstraint("filled >= 0", name="ck_batches_filled_non_negative"),
        sa.CheckConstraint("seats >= 0", name="ck_batches_seats_non_negative"),
        sa.CheckConstraint("sort_order >= 0", name="ck_batches_sort_order_non_negative"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_batches_id"), "batches", ["id"], unique=False)
    op.create_index(op.f("ix_batches_is_active"), "batches", ["is_active"], unique=False)
    op.create_index(op.f("ix_batches_level"), "batches", ["level"], unique=False)
    op.create_index(op.f("ix_batches_name"), "batches", ["name"], unique=False)
    op.create_index(op.f("ix_batches_sort_order"), "batches", ["sort_order"], unique=False)

    op.create_table(
        "hero_sections",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("section_key", sa.String(length=50), nullable=False, server_default="homepage"),
        sa.Column("video_url", sa.String(length=500), nullable=True),
        sa.Column("poster_url", sa.String(length=500), nullable=True),
        sa.Column("video_mode", sa.Boolean(), nullable=False, server_default=sa.text("1")),
        sa.Column("eyebrow", sa.String(length=150), nullable=True),
        sa.Column("title_line1", sa.String(length=150), nullable=True),
        sa.Column("title_line2", sa.String(length=150), nullable=True),
        sa.Column("title_line3", sa.String(length=150), nullable=True),
        sa.Column("subtitle", sa.Text(), nullable=True),
        sa.Column("cta_text", sa.String(length=100), nullable=True),
        sa.Column("cta_subtext", sa.String(length=255), nullable=True),
        sa.Column("badge_text", sa.String(length=150), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP")),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP")),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.text("1")),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("section_key"),
    )
    op.create_index(op.f("ix_hero_sections_id"), "hero_sections", ["id"], unique=False)
    op.create_index(op.f("ix_hero_sections_is_active"), "hero_sections", ["is_active"], unique=False)

    op.create_table(
        "site_settings",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("site_key", sa.String(length=50), nullable=False, server_default="default"),
        sa.Column("site_name", sa.String(length=255), nullable=False),
        sa.Column("tagline", sa.String(length=255), nullable=True),
        sa.Column("phone", sa.String(length=30), nullable=True),
        sa.Column("email", sa.String(length=255), nullable=True),
        sa.Column("address", sa.Text(), nullable=True),
        sa.Column("timings", sa.String(length=150), nullable=True),
        sa.Column("instagram", sa.String(length=500), nullable=True),
        sa.Column("facebook", sa.String(length=500), nullable=True),
        sa.Column("youtube", sa.String(length=500), nullable=True),
        sa.Column("whatsapp", sa.String(length=30), nullable=True),
        sa.Column("map_embed", sa.Text(), nullable=True),
        sa.Column("meta_title", sa.String(length=255), nullable=True),
        sa.Column("meta_description", sa.Text(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP")),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP")),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("site_key"),
    )
    op.create_index(op.f("ix_site_settings_id"), "site_settings", ["id"], unique=False)

    op.create_table(
        "hero_stats",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("hero_section_id", sa.Integer(), nullable=False),
        sa.Column("value", sa.Float(), nullable=False, server_default="0"),
        sa.Column("suffix", sa.String(length=20), nullable=True),
        sa.Column("label", sa.String(length=100), nullable=False),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP")),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP")),
        sa.CheckConstraint("sort_order >= 0", name="ck_hero_stats_sort_order_non_negative"),
        sa.ForeignKeyConstraint(["hero_section_id"], ["hero_sections.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_hero_stats_hero_section_id"), "hero_stats", ["hero_section_id"], unique=False)
    op.create_index(op.f("ix_hero_stats_id"), "hero_stats", ["id"], unique=False)
    op.create_index(op.f("ix_hero_stats_sort_order"), "hero_stats", ["sort_order"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_hero_stats_sort_order"), table_name="hero_stats")
    op.drop_index(op.f("ix_hero_stats_id"), table_name="hero_stats")
    op.drop_index(op.f("ix_hero_stats_hero_section_id"), table_name="hero_stats")
    op.drop_table("hero_stats")

    op.drop_index(op.f("ix_site_settings_id"), table_name="site_settings")
    op.drop_table("site_settings")

    op.drop_index(op.f("ix_hero_sections_is_active"), table_name="hero_sections")
    op.drop_index(op.f("ix_hero_sections_id"), table_name="hero_sections")
    op.drop_table("hero_sections")

    op.drop_index(op.f("ix_batches_sort_order"), table_name="batches")
    op.drop_index(op.f("ix_batches_name"), table_name="batches")
    op.drop_index(op.f("ix_batches_level"), table_name="batches")
    op.drop_index(op.f("ix_batches_is_active"), table_name="batches")
    op.drop_index(op.f("ix_batches_id"), table_name="batches")
    op.drop_table("batches")
