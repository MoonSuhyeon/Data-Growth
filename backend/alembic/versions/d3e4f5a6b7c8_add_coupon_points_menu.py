"""Add coupon, points, menu tables

Revision ID: d3e4f5a6b7c8
Revises: c2d3e4f5a6b7
Create Date: 2026-05-03

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = 'd3e4f5a6b7c8'
down_revision: Union[str, None] = 'c2d3e4f5a6b7'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Coupon master
    op.create_table(
        'coupon_masters',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('code', sa.String(50), unique=True, nullable=False),
        sa.Column('name', sa.String(100), nullable=False),
        sa.Column('type_code', sa.String(30), sa.ForeignKey('coupon_type_codes.code'), nullable=False),
        sa.Column('discount_value', sa.Integer(), nullable=False),
        sa.Column('min_booking_amount', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('max_discount_amount', sa.Integer(), nullable=True),
        sa.Column('valid_from', sa.DateTime(), nullable=False),
        sa.Column('valid_to', sa.DateTime(), nullable=False),
        sa.Column('max_issues', sa.Integer(), nullable=True),
        sa.Column('issued_count', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.text('now()')),
    )
    op.create_index('ix_coupon_masters_code', 'coupon_masters', ['code'])

    # User coupons
    op.create_table(
        'user_coupons',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('coupon_master_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('coupon_masters.id'), nullable=False),
        sa.Column('status_code', sa.String(30), sa.ForeignKey('coupon_status_codes.code'), nullable=False, server_default='ACTIVE'),
        sa.Column('issued_at', sa.DateTime(), nullable=False, server_default=sa.text('now()')),
        sa.Column('used_at', sa.DateTime(), nullable=True),
        sa.Column('expires_at', sa.DateTime(), nullable=True),
    )
    op.create_index('ix_user_coupons_user_id', 'user_coupons', ['user_id'])

    # Coupon usages
    op.create_table(
        'coupon_usages',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('user_coupon_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('user_coupons.id'), nullable=False),
        sa.Column('booking_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('bookings.id'), nullable=False),
        sa.Column('discount_amount', sa.Integer(), nullable=False),
        sa.Column('used_at', sa.DateTime(), nullable=False, server_default=sa.text('now()')),
    )

    # Point histories
    op.create_table(
        'point_histories',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id'), nullable=False),
        sa.Column('type', sa.String(20), nullable=False),  # EARN, USE, REFUND, EXPIRE
        sa.Column('amount', sa.Integer(), nullable=False),
        sa.Column('balance_after', sa.Integer(), nullable=False),
        sa.Column('booking_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('bookings.id'), nullable=True),
        sa.Column('description', sa.String(200), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.text('now()')),
    )
    op.create_index('ix_point_histories_user_id', 'point_histories', ['user_id'])

    # Add coupon_discount + points_used columns to bookings
    op.add_column('bookings', sa.Column('coupon_discount', sa.Integer(), nullable=True, server_default='0'))
    op.add_column('bookings', sa.Column('points_used', sa.Integer(), nullable=True, server_default='0'))

    # Menu categories
    op.create_table(
        'menu_categories',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('name', sa.String(50), nullable=False),
        sa.Column('display_order', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='true'),
    )

    # Menu items
    op.create_table(
        'menu_items',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('category_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('menu_categories.id'), nullable=False),
        sa.Column('name', sa.String(100), nullable=False),
        sa.Column('price', sa.Integer(), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('image_url', sa.String(512), nullable=True),
        sa.Column('is_available', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('display_order', sa.Integer(), nullable=False, server_default='0'),
    )

    # Menu options
    op.create_table(
        'menu_options',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('item_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('menu_items.id'), nullable=False),
        sa.Column('name', sa.String(100), nullable=False),
        sa.Column('price', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('is_available', sa.Boolean(), nullable=False, server_default='true'),
    )

    # Booking menus
    op.create_table(
        'booking_menus',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('booking_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('bookings.id'), nullable=False),
        sa.Column('item_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('menu_items.id'), nullable=False),
        sa.Column('option_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('menu_options.id'), nullable=True),
        sa.Column('quantity', sa.Integer(), nullable=False, server_default='1'),
        sa.Column('unit_price', sa.Integer(), nullable=False),
    )
    op.create_index('ix_booking_menus_booking_id', 'booking_menus', ['booking_id'])


def downgrade() -> None:
    op.drop_index('ix_booking_menus_booking_id', table_name='booking_menus')
    op.drop_table('booking_menus')
    op.drop_table('menu_options')
    op.drop_table('menu_items')
    op.drop_table('menu_categories')
    op.drop_column('bookings', 'points_used')
    op.drop_column('bookings', 'coupon_discount')
    op.drop_index('ix_point_histories_user_id', table_name='point_histories')
    op.drop_table('point_histories')
    op.drop_table('coupon_usages')
    op.drop_index('ix_user_coupons_user_id', table_name='user_coupons')
    op.drop_table('user_coupons')
    op.drop_index('ix_coupon_masters_code', table_name='coupon_masters')
    op.drop_table('coupon_masters')
