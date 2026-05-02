"""Add membership tables

Revision ID: e4f5a6b7c8d9
Revises: d3e4f5a6b7c8
Create Date: 2026-05-03

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = 'e4f5a6b7c8d9'
down_revision: Union[str, None] = 'd3e4f5a6b7c8'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Partners (e.g. credit card companies)
    op.create_table(
        'partners',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('name', sa.String(100), nullable=False),
        sa.Column('code', sa.String(30), unique=True, nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('logo_url', sa.String(512), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.text('now()')),
    )

    # Membership products
    op.create_table(
        'membership_products',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('partner_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('partners.id'), nullable=False),
        sa.Column('name', sa.String(100), nullable=False),
        sa.Column('discount_type', sa.String(20), nullable=False),  # FIXED_AMOUNT or PERCENT
        sa.Column('discount_value', sa.Integer(), nullable=False),
        sa.Column('monthly_price', sa.Integer(), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.text('now()')),
    )

    # User memberships
    op.create_table(
        'memberships',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('product_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('membership_products.id'), nullable=False),
        sa.Column('status', sa.String(20), nullable=False, server_default='ACTIVE'),  # ACTIVE, CANCELLED, EXPIRED
        sa.Column('started_at', sa.DateTime(), nullable=False, server_default=sa.text('now()')),
        sa.Column('expires_at', sa.DateTime(), nullable=True),
        sa.Column('cancelled_at', sa.DateTime(), nullable=True),
        sa.UniqueConstraint('user_id', 'product_id', name='uq_user_membership'),
    )
    op.create_index('ix_memberships_user_id', 'memberships', ['user_id'])

    # Discount combination rules
    op.create_table(
        'discount_combination_rules',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('discount_a', sa.String(30), nullable=False),  # AUDIENCE_TYPE, COUPON, POINTS, MEMBERSHIP
        sa.Column('discount_b', sa.String(30), nullable=False),
        sa.Column('is_stackable', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('description', sa.Text(), nullable=True),
    )


def downgrade() -> None:
    op.drop_table('discount_combination_rules')
    op.drop_index('ix_memberships_user_id', table_name='memberships')
    op.drop_table('memberships')
    op.drop_table('membership_products')
    op.drop_table('partners')
