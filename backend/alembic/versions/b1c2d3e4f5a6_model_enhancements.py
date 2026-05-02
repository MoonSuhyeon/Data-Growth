"""Model enhancements - additive columns

Revision ID: b1c2d3e4f5a6
Revises: a0b1c2d3e4f5
Create Date: 2026-05-03

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = 'b1c2d3e4f5a6'
down_revision: Union[str, None] = 'a0b1c2d3e4f5'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # theaters
    op.add_column('theaters', sa.Column('latitude', sa.Numeric(10, 7), nullable=True))
    op.add_column('theaters', sa.Column('longitude', sa.Numeric(10, 7), nullable=True))
    op.add_column('theaters', sa.Column('parking_available', sa.Boolean(), nullable=True, server_default='false'))
    op.add_column('theaters', sa.Column('parking_count', sa.Integer(), nullable=True))

    # halls
    op.add_column('halls', sa.Column('hall_type_code', sa.String(30), sa.ForeignKey('hall_type_codes.code'), nullable=True))
    op.add_column('halls', sa.Column('location_detail', sa.String(100), nullable=True))
    op.add_column('halls', sa.Column('standard_seat_count', sa.Integer(), nullable=True))
    op.add_column('halls', sa.Column('sweetbox_seat_count', sa.Integer(), nullable=True))
    op.add_column('halls', sa.Column('wheelchair_seat_count', sa.Integer(), nullable=True))

    # seats
    op.add_column('seats', sa.Column('status_code', sa.String(30), sa.ForeignKey('seat_status_codes.code'), nullable=True))

    # screenings
    op.add_column('screenings', sa.Column('sequence_number', sa.Integer(), nullable=True))
    op.add_column('screenings', sa.Column('booked_seats', sa.Integer(), nullable=True, server_default='0'))
    op.add_column('screenings', sa.Column('booking_rate', sa.Numeric(5, 2), nullable=True, server_default='0'))

    # payments
    op.add_column('payments', sa.Column('pg_transaction_id', sa.String(100), nullable=True))
    op.add_column('payments', sa.Column('method_code', sa.String(30), sa.ForeignKey('payment_method_codes.code'), nullable=True))
    op.add_column('payments', sa.Column('status_code', sa.String(30), sa.ForeignKey('payment_status_codes.code'), nullable=True))

    # movies
    op.add_column('movies', sa.Column('end_date', sa.DateTime(), nullable=True))
    op.add_column('movies', sa.Column('distributor', sa.String(100), nullable=True))
    op.add_column('movies', sa.Column('total_bookings', sa.Integer(), nullable=True, server_default='0'))
    op.add_column('movies', sa.Column('booking_rank', sa.Integer(), nullable=True))

    # users
    op.add_column('users', sa.Column('status_code', sa.String(30), sa.ForeignKey('user_status_codes.code'), nullable=True))
    op.add_column('users', sa.Column('point_balance', sa.Integer(), nullable=True, server_default='0'))


def downgrade() -> None:
    op.drop_column('users', 'point_balance')
    op.drop_column('users', 'status_code')
    op.drop_column('movies', 'booking_rank')
    op.drop_column('movies', 'total_bookings')
    op.drop_column('movies', 'distributor')
    op.drop_column('movies', 'end_date')
    op.drop_column('payments', 'status_code')
    op.drop_column('payments', 'method_code')
    op.drop_column('payments', 'pg_transaction_id')
    op.drop_column('screenings', 'booking_rate')
    op.drop_column('screenings', 'booked_seats')
    op.drop_column('screenings', 'sequence_number')
    op.drop_column('seats', 'status_code')
    op.drop_column('halls', 'wheelchair_seat_count')
    op.drop_column('halls', 'sweetbox_seat_count')
    op.drop_column('halls', 'standard_seat_count')
    op.drop_column('halls', 'location_detail')
    op.drop_column('halls', 'hall_type_code')
    op.drop_column('theaters', 'parking_count')
    op.drop_column('theaters', 'parking_available')
    op.drop_column('theaters', 'longitude')
    op.drop_column('theaters', 'latitude')
