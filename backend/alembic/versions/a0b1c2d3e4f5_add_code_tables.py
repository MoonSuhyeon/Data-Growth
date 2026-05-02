"""Add code tables (lookup tables)

Revision ID: a0b1c2d3e4f5
Revises: f9a0b1c2d3e4
Create Date: 2026-05-03

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = 'a0b1c2d3e4f5'
down_revision: Union[str, None] = 'f9a0b1c2d3e4'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

CODE_TABLE_COLS = [
    sa.Column('code', sa.String(30), primary_key=True),
    sa.Column('name', sa.String(100), nullable=False),
    sa.Column('description', sa.Text(), nullable=True),
    sa.Column('display_order', sa.Integer(), nullable=False, server_default='0'),
    sa.Column('is_active', sa.Boolean(), nullable=False, server_default='true'),
]


def _create(table_name: str):
    op.create_table(table_name, *CODE_TABLE_COLS)


def upgrade() -> None:
    tables = [
        'user_status_codes',
        'user_role_codes',
        'booking_status_codes',
        'payment_status_codes',
        'payment_method_codes',
        'seat_status_codes',
        'seat_grade_codes',
        'hall_type_codes',
        'coupon_status_codes',
        'coupon_type_codes',
        'movie_status_codes',
        'rating_codes',
        'ticket_status_codes',
        'review_status_codes',
    ]
    for t in tables:
        _create(t)

    seed = {
        'user_status_codes': [
            ('ACTIVE', '활성', None, 0),
            ('SUSPENDED', '정지', None, 1),
            ('WITHDRAWN', '탈퇴', None, 2),
        ],
        'user_role_codes': [
            ('USER', '일반 회원', None, 0),
            ('ADMIN', '관리자', None, 1),
        ],
        'booking_status_codes': [
            ('PENDING', '결제 대기', None, 0),
            ('CONFIRMED', '예매 확정', None, 1),
            ('CANCELLED', '취소', None, 2),
            ('REFUNDED', '환불 완료', None, 3),
        ],
        'payment_status_codes': [
            ('PENDING', '결제 대기', None, 0),
            ('SUCCESS', '결제 성공', None, 1),
            ('FAILED', '결제 실패', None, 2),
            ('REFUNDED', '환불', None, 3),
        ],
        'payment_method_codes': [
            ('CARD', '신용/체크카드', None, 0),
            ('KAKAOPAY', '카카오페이', None, 1),
            ('NAVERPAY', '네이버페이', None, 2),
        ],
        'seat_status_codes': [
            ('AVAILABLE', '예매 가능', None, 0),
            ('RESERVED', '예매 완료', None, 1),
            ('MAINTENANCE', '점검 중', None, 2),
        ],
        'seat_grade_codes': [
            ('STANDARD', '일반석', None, 0),
            ('SWEETBOX', '스위트박스', None, 1),
            ('WHEELCHAIR', '장애인석', None, 2),
        ],
        'hall_type_codes': [
            ('STANDARD', '일반관', None, 0),
            ('IMAX', 'IMAX관', None, 1),
            ('SCREEN_X', 'ScreenX관', None, 2),
            ('DOLBY', 'Dolby관', None, 3),
            ('SPECIAL', '특별관', None, 4),
        ],
        'coupon_status_codes': [
            ('ACTIVE', '사용 가능', None, 0),
            ('USED', '사용 완료', None, 1),
            ('EXPIRED', '만료', None, 2),
            ('CANCELLED', '취소', None, 3),
        ],
        'coupon_type_codes': [
            ('FIXED_AMOUNT', '정액 할인', None, 0),
            ('PERCENT', '정률 할인', None, 1),
        ],
        'movie_status_codes': [
            ('NOW_SHOWING', '상영 중', None, 0),
            ('COMING_SOON', '상영 예정', None, 1),
            ('ENDED', '상영 종료', None, 2),
        ],
        'rating_codes': [
            ('ALL', '전체 관람가', None, 0),
            ('AGE_12', '12세 이상', None, 1),
            ('AGE_15', '15세 이상', None, 2),
            ('AGE_19', '청소년 관람불가', None, 3),
        ],
        'ticket_status_codes': [
            ('ISSUED', '발권 완료', None, 0),
            ('USED', '사용 완료', None, 1),
            ('CANCELLED', '취소', None, 2),
        ],
        'review_status_codes': [
            ('ACTIVE', '정상', None, 0),
            ('HIDDEN', '숨김', None, 1),
            ('REPORTED', '신고됨', None, 2),
            ('DELETED', '삭제', None, 3),
        ],
    }

    conn = op.get_bind()
    for table_name, rows in seed.items():
        for code, name, desc, order in rows:
            conn.execute(
                sa.text(f"INSERT INTO {table_name} (code, name, description, display_order, is_active) VALUES (:c, :n, :d, :o, true)"),
                {"c": code, "n": name, "d": desc, "o": order}
            )


def downgrade() -> None:
    tables = [
        'review_status_codes',
        'ticket_status_codes',
        'rating_codes',
        'movie_status_codes',
        'coupon_type_codes',
        'coupon_status_codes',
        'hall_type_codes',
        'seat_grade_codes',
        'seat_status_codes',
        'payment_method_codes',
        'payment_status_codes',
        'booking_status_codes',
        'user_role_codes',
        'user_status_codes',
    ]
    for t in tables:
        op.drop_table(t)
