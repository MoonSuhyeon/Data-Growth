"""Create initial schema with 15 tables

Revision ID: 7446b7caf142
Revises:
Create Date: 2026-05-02 21:24:37.251464

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql


# revision identifiers, used by Alembic.
revision: str = '7446b7caf142'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create ENUMs — each op.execute() call must be a single statement for asyncpg
    op.execute("DO $$ BEGIN CREATE TYPE roleenum AS ENUM ('USER', 'ADMIN'); EXCEPTION WHEN duplicate_object THEN NULL; END $$")
    op.execute("DO $$ BEGIN CREATE TYPE termtypeenum AS ENUM ('SERVICE', 'PRIVACY', 'MARKETING'); EXCEPTION WHEN duplicate_object THEN NULL; END $$")
    op.execute("DO $$ BEGIN CREATE TYPE movieratingenum AS ENUM ('ALL', 'AGE_12', 'AGE_15', 'AGE_19'); EXCEPTION WHEN duplicate_object THEN NULL; END $$")
    op.execute("DO $$ BEGIN CREATE TYPE moviestatusenum AS ENUM ('NOW_SHOWING', 'COMING_SOON', 'ENDED'); EXCEPTION WHEN duplicate_object THEN NULL; END $$")
    op.execute("DO $$ BEGIN CREATE TYPE seatgradeenum AS ENUM ('STANDARD', 'PREMIUM'); EXCEPTION WHEN duplicate_object THEN NULL; END $$")
    op.execute("DO $$ BEGIN CREATE TYPE bookingstatusenum AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED'); EXCEPTION WHEN duplicate_object THEN NULL; END $$")
    op.execute("DO $$ BEGIN CREATE TYPE ticketstatusenum AS ENUM ('ISSUED', 'USED', 'CANCELLED'); EXCEPTION WHEN duplicate_object THEN NULL; END $$")
    op.execute("DO $$ BEGIN CREATE TYPE paymentstatusenum AS ENUM ('PENDING', 'SUCCESS', 'FAILED'); EXCEPTION WHEN duplicate_object THEN NULL; END $$")
    op.execute("DO $$ BEGIN CREATE TYPE paymentmethodenum AS ENUM ('CARD', 'KAKAOPAY', 'NAVERPAY'); EXCEPTION WHEN duplicate_object THEN NULL; END $$")
    op.execute("DO $$ BEGIN CREATE TYPE daytypeenum AS ENUM ('WEEKDAY', 'WEEKEND'); EXCEPTION WHEN duplicate_object THEN NULL; END $$")
    op.execute("DO $$ BEGIN CREATE TYPE timeslotenum AS ENUM ('MORNING', 'AFTERNOON', 'EVENING', 'NIGHT'); EXCEPTION WHEN duplicate_object THEN NULL; END $$")

    # Create tables
    op.create_table('users',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('email', sa.String(255), nullable=False),
        sa.Column('hashed_password', sa.String(255), nullable=False),
        sa.Column('name', sa.String(100), nullable=False),
        sa.Column('phone', sa.String(20), nullable=True),
        sa.Column('role', postgresql.ENUM('USER', 'ADMIN', name='roleenum', create_type=False), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email'),
    )
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)

    op.create_table('theaters',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('name', sa.String(100), nullable=False),
        sa.Column('region', sa.String(50), nullable=False),
        sa.Column('address', sa.String(255), nullable=False),
        sa.Column('phone', sa.String(20), nullable=False),
        sa.PrimaryKeyConstraint('id'),
    )

    op.create_table('terms',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('type', postgresql.ENUM('SERVICE', 'PRIVACY', 'MARKETING', name='termtypeenum', create_type=False), nullable=False),
        sa.Column('version', sa.Integer(), nullable=False),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('required', sa.Boolean(), nullable=False),
        sa.Column('effective_from', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.PrimaryKeyConstraint('id'),
    )

    op.create_table('movies',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('title', sa.String(255), nullable=False),
        sa.Column('title_en', sa.String(255), nullable=True),
        sa.Column('synopsis', sa.Text(), nullable=False),
        sa.Column('director', sa.String(100), nullable=False),
        sa.Column('cast', sa.Text(), nullable=False),
        sa.Column('runtime', sa.Integer(), nullable=False),
        sa.Column('rating', postgresql.ENUM('ALL', 'AGE_12', 'AGE_15', 'AGE_19', name='movieratingenum', create_type=False), nullable=False),
        sa.Column('poster_url', sa.String(512), nullable=True),
        sa.Column('release_date', sa.DateTime(), nullable=True),
        sa.Column('status', postgresql.ENUM('NOW_SHOWING', 'COMING_SOON', 'ENDED', name='moviestatusenum', create_type=False), nullable=False),
        sa.PrimaryKeyConstraint('id'),
    )

    op.create_table('price_policies',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('day_type', postgresql.ENUM('WEEKDAY', 'WEEKEND', name='daytypeenum', create_type=False), nullable=False),
        sa.Column('time_slot', postgresql.ENUM('MORNING', 'AFTERNOON', 'EVENING', 'NIGHT', name='timeslotenum', create_type=False), nullable=False),
        sa.Column('seat_grade', postgresql.ENUM('STANDARD', 'PREMIUM', name='seatgradeenum', create_type=False), nullable=False),
        sa.Column('price', sa.Integer(), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('day_type', 'time_slot', 'seat_grade', name='uq_price_policy'),
    )

    op.create_table('halls',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('theater_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('name', sa.String(50), nullable=False),
        sa.Column('total_seats', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['theater_id'], ['theaters.id'], ),
        sa.PrimaryKeyConstraint('id'),
    )

    op.create_table('identity_verifications',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('verified_at', sa.DateTime(), nullable=True),
        sa.Column('expires_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id'),
    )

    op.create_table('term_agreements',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('term_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('agreed_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.ForeignKeyConstraint(['term_id'], ['terms.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('user_id', 'term_id', name='uq_user_term'),
    )

    op.create_table('seats',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('hall_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('row', sa.String(1), nullable=False),
        sa.Column('number', sa.Integer(), nullable=False),
        sa.Column('seat_grade', postgresql.ENUM('STANDARD', 'PREMIUM', name='seatgradeenum', create_type=False), nullable=False),
        sa.ForeignKeyConstraint(['hall_id'], ['halls.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('hall_id', 'row', 'number', name='uq_hall_seat'),
    )

    op.create_table('screenings',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('movie_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('hall_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('start_time', sa.DateTime(), nullable=False),
        sa.Column('end_time', sa.DateTime(), nullable=False),
        sa.Column('screening_date', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['hall_id'], ['halls.id'], ),
        sa.ForeignKeyConstraint(['movie_id'], ['movies.id'], ),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index('idx_hall_time', 'screenings', ['hall_id', 'start_time'])
    op.create_index('idx_movie_date', 'screenings', ['movie_id', 'screening_date'])
    op.create_index(op.f('ix_screenings_screening_date'), 'screenings', ['screening_date'])

    op.create_table('bookings',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('booking_number', sa.String(36), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('screening_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('total_price', sa.Integer(), nullable=False),
        sa.Column('status', postgresql.ENUM('PENDING', 'CONFIRMED', 'CANCELLED', name='bookingstatusenum', create_type=False), nullable=False),
        sa.Column('booked_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.ForeignKeyConstraint(['screening_id'], ['screenings.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('booking_number'),
    )
    op.create_index(op.f('ix_bookings_booking_number'), 'bookings', ['booking_number'], unique=True)

    op.create_table('seat_holds',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('screening_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('seat_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), nullable=True),
        sa.Column('session_id', sa.String(255), nullable=True),
        sa.Column('held_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column('expires_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['screening_id'], ['screenings.id'], ),
        sa.ForeignKeyConstraint(['seat_id'], ['seats.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('screening_id', 'seat_id', name='uq_screening_seat'),
    )
    op.create_index(op.f('ix_seat_holds_expires_at'), 'seat_holds', ['expires_at'])

    op.create_table('booking_seats',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('booking_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('seat_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('price', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['booking_id'], ['bookings.id'], ),
        sa.ForeignKeyConstraint(['seat_id'], ['seats.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('booking_id', 'seat_id', name='uq_booking_seat'),
    )

    op.create_table('tickets',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('booking_seat_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('qr_code', sa.String(36), nullable=False),
        sa.Column('status', postgresql.ENUM('ISSUED', 'USED', 'CANCELLED', name='ticketstatusenum', create_type=False), nullable=False),
        sa.Column('issued_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column('used_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['booking_seat_id'], ['booking_seats.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('booking_seat_id'),
        sa.UniqueConstraint('qr_code'),
    )

    op.create_table('payments',
        sa.Column('id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('booking_id', postgresql.UUID(as_uuid=True), nullable=False),
        sa.Column('payment_method', postgresql.ENUM('CARD', 'KAKAOPAY', 'NAVERPAY', name='paymentmethodenum', create_type=False), nullable=False),
        sa.Column('amount', sa.Integer(), nullable=False),
        sa.Column('status', postgresql.ENUM('PENDING', 'SUCCESS', 'FAILED', name='paymentstatusenum', create_type=False), nullable=False),
        sa.Column('approval_number', sa.String(100), nullable=True),
        sa.Column('approved_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['booking_id'], ['bookings.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('booking_id'),
    )


def downgrade() -> None:
    # Drop tables in reverse order
    op.drop_table('payments')
    op.drop_table('tickets')
    op.drop_table('booking_seats')
    op.drop_table('seat_holds')
    op.drop_table('bookings')
    op.drop_table('screenings')
    op.drop_table('seats')
    op.drop_table('term_agreements')
    op.drop_table('identity_verifications')
    op.drop_table('halls')
    op.drop_table('price_policies')
    op.drop_table('movies')
    op.drop_table('terms')
    op.drop_table('theaters')
    op.drop_table('users')

    # Drop ENUMs
    postgresql.ENUM('paymentmethodenum').drop(op.get_bind(), checkfirst=True)
    postgresql.ENUM('paymentstatusenum').drop(op.get_bind(), checkfirst=True)
    postgresql.ENUM('ticketstatusenum').drop(op.get_bind(), checkfirst=True)
    postgresql.ENUM('bookingstatusenum').drop(op.get_bind(), checkfirst=True)
    postgresql.ENUM('seatgradeenum').drop(op.get_bind(), checkfirst=True)
    postgresql.ENUM('moviestatusenum').drop(op.get_bind(), checkfirst=True)
    postgresql.ENUM('movieratingenum').drop(op.get_bind(), checkfirst=True)
    postgresql.ENUM('termtypeenum').drop(op.get_bind(), checkfirst=True)
    postgresql.ENUM('roleenum').drop(op.get_bind(), checkfirst=True)
    postgresql.ENUM('daytypeenum').drop(op.get_bind(), checkfirst=True)
    postgresql.ENUM('timeslotenum').drop(op.get_bind(), checkfirst=True)
