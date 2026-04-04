"""Add linkedin to site_settings

Revision ID: 20260404_0006
Revises: 20260404_0005
Create Date: 2026-04-04 22:00:00
"""
from __future__ import annotations

from alembic import op
import sqlalchemy as sa


revision = "20260404_0006"
down_revision = "20260404_0005"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("site_settings", sa.Column("linkedin", sa.String(length=500), nullable=True))


def downgrade() -> None:
    op.drop_column("site_settings", "linkedin")

