"""Replace seatgradeenum: STANDARD/PREMIUM → STANDARD/SWEETBOX/WHEELCHAIR

Revision ID: c9d2e4f1b830
Revises: 7446b7caf142
Create Date: 2026-05-02

"""
from typing import Sequence, Union
from alembic import op

revision: str = 'c9d2e4f1b830'
down_revision: Union[str, None] = '7446b7caf142'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 기존 데이터 삭제 (FK 순서)
    op.execute("TRUNCATE TABLE payments, tickets, booking_seats, seat_holds, bookings, screenings, seats, price_policies RESTART IDENTITY CASCADE")

    # 기존 enum 이름 변경
    op.execute("ALTER TYPE seatgradeenum RENAME TO seatgradeenum_old")

    # 새 enum 생성
    op.execute("CREATE TYPE seatgradeenum AS ENUM ('STANDARD', 'SWEETBOX', 'WHEELCHAIR')")

    # seats 컬럼 타입 변경
    op.execute("""
        ALTER TABLE seats
        ALTER COLUMN seat_grade TYPE seatgradeenum
        USING (
            CASE seat_grade::text
                WHEN 'STANDARD' THEN 'STANDARD'::seatgradeenum
                WHEN 'PREMIUM'  THEN 'SWEETBOX'::seatgradeenum
                ELSE 'STANDARD'::seatgradeenum
            END
        )
    """)

    # price_policies 컬럼 타입 변경
    op.execute("""
        ALTER TABLE price_policies
        ALTER COLUMN seat_grade TYPE seatgradeenum
        USING (
            CASE seat_grade::text
                WHEN 'STANDARD' THEN 'STANDARD'::seatgradeenum
                WHEN 'PREMIUM'  THEN 'SWEETBOX'::seatgradeenum
                ELSE 'STANDARD'::seatgradeenum
            END
        )
    """)

    # 기존 enum 삭제
    op.execute("DROP TYPE seatgradeenum_old")


def downgrade() -> None:
    op.execute("TRUNCATE TABLE payments, tickets, booking_seats, seat_holds, bookings, screenings, seats, price_policies RESTART IDENTITY CASCADE")
    op.execute("ALTER TYPE seatgradeenum RENAME TO seatgradeenum_old")
    op.execute("CREATE TYPE seatgradeenum AS ENUM ('STANDARD', 'PREMIUM')")
    op.execute("""
        ALTER TABLE seats
        ALTER COLUMN seat_grade TYPE seatgradeenum
        USING (
            CASE seat_grade::text
                WHEN 'STANDARD'   THEN 'STANDARD'::seatgradeenum
                WHEN 'SWEETBOX'   THEN 'PREMIUM'::seatgradeenum
                WHEN 'WHEELCHAIR' THEN 'STANDARD'::seatgradeenum
                ELSE 'STANDARD'::seatgradeenum
            END
        )
    """)
    op.execute("""
        ALTER TABLE price_policies
        ALTER COLUMN seat_grade TYPE seatgradeenum
        USING (
            CASE seat_grade::text
                WHEN 'STANDARD'   THEN 'STANDARD'::seatgradeenum
                WHEN 'SWEETBOX'   THEN 'PREMIUM'::seatgradeenum
                WHEN 'WHEELCHAIR' THEN 'STANDARD'::seatgradeenum
                ELSE 'STANDARD'::seatgradeenum
            END
        )
    """)
    op.execute("DROP TYPE seatgradeenum_old")
