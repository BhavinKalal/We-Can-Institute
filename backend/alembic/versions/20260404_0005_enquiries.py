"""Add enquiries table

Revision ID: 20260404_0005
Revises: 20260404_0004
Create Date: 2026-04-04 12:30:00
"""
from __future__ import annotations

from alembic import op
import sqlalchemy as sa


revision = "20260404_0005"
down_revision = "20260404_0004"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "enquiries",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=150), nullable=False),
        sa.Column("phone", sa.String(length=30), nullable=False),
        sa.Column("batch_name", sa.String(length=120), nullable=True),
        sa.Column("status", sa.String(length=20), nullable=False, server_default="new"),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column("source", sa.String(length=30), nullable=False, server_default="website"),
        sa.Column("submitted_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP")),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP")),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False, server_default=sa.text("CURRENT_TIMESTAMP")),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_enquiries_id"), "enquiries", ["id"], unique=False)
    op.create_index(op.f("ix_enquiries_name"), "enquiries", ["name"], unique=False)
    op.create_index(op.f("ix_enquiries_phone"), "enquiries", ["phone"], unique=False)
    op.create_index(op.f("ix_enquiries_batch_name"), "enquiries", ["batch_name"], unique=False)
    op.create_index(op.f("ix_enquiries_status"), "enquiries", ["status"], unique=False)
    op.create_index(op.f("ix_enquiries_submitted_at"), "enquiries", ["submitted_at"], unique=False)


def downgrade() -> None:
    op.drop_index(op.f("ix_enquiries_submitted_at"), table_name="enquiries")
    op.drop_index(op.f("ix_enquiries_status"), table_name="enquiries")
    op.drop_index(op.f("ix_enquiries_batch_name"), table_name="enquiries")
    op.drop_index(op.f("ix_enquiries_phone"), table_name="enquiries")
    op.drop_index(op.f("ix_enquiries_name"), table_name="enquiries")
    op.drop_index(op.f("ix_enquiries_id"), table_name="enquiries")
    op.drop_table("enquiries")
