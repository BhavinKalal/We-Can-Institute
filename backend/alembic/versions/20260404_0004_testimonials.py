"""Add testimonials table

Revision ID: 20260404_0004
Revises: 20260403_0003
Create Date: 2026-04-04 02:00:00
"""
from __future__ import annotations

from alembic import op
import sqlalchemy as sa


revision = "20260404_0004"
down_revision = "20260403_0003"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "testimonials",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=150), nullable=False),
        sa.Column("role", sa.String(length=180), nullable=True),
        sa.Column("quote", sa.Text(), nullable=False),
        sa.Column("initials", sa.String(length=8), nullable=True),
        sa.Column("stars", sa.Integer(), nullable=False, server_default="5"),
        sa.Column("sort_order", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP")),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP")),
        sa.Column("is_active", sa.Boolean(), nullable=False, server_default=sa.text("1")),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_testimonials_id"), "testimonials", ["id"], unique=False)
    op.create_index(op.f("ix_testimonials_name"), "testimonials", ["name"], unique=False)
    op.create_index(op.f("ix_testimonials_sort_order"), "testimonials", ["sort_order"], unique=False)
    op.create_index(op.f("ix_testimonials_is_active"), "testimonials", ["is_active"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_testimonials_is_active"), table_name="testimonials")
    op.drop_index(op.f("ix_testimonials_sort_order"), table_name="testimonials")
    op.drop_index(op.f("ix_testimonials_name"), table_name="testimonials")
    op.drop_index(op.f("ix_testimonials_id"), table_name="testimonials")
    op.drop_table("testimonials")
