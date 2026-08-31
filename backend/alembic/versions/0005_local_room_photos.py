"""숙소 사진을 외부 서비스에서 저장소 안의 파일로 옮긴다.

시드가 `https://picsum.photos/seed/...` 를 넣어 두고 있었다. 그 서비스가 503 을
내자 숙소 사진이 한꺼번에 사라졌다 — 코드가 아니라 **의존 구조**의 문제였고,
데모가 남의 서버 가동 여부에 걸려 있었다.

시드는 이미 고쳤지만 **시드는 새로 만들 때만 돈다.** 이미 행이 들어 있는 DB 는
그대로 picsum 을 가리킨 채 남아 있어서, 여기서 옮긴다.

## 왜 picsum 을 가리키는 행만 건드리는가

운영자가 콘솔에서 직접 넣은 주소가 있을 수 있다 — `/admin/properties` 에 사진
주소 입력칸이 있다. 전부 덮으면 사람이 넣은 값을 말없이 지운다.
**우리가 넣은 것만 우리가 치운다.**

## 왜 SQL 한 방이 아니라 파이썬으로 도는가

사진 파일은 스물넷뿐이고 숙소는 그보다 많아서, 줄을 세워 돌려 가며 배정해야
한다. 그걸 SQL 로 쓰면 `ROW_NUMBER()` 와 자리수 맞추기(`LPAD` / `SUBSTR`)가
방언마다 갈려 **PostgreSQL 용과 SQLite 용 두 벌**이 된다. 두 벌이 되면 한쪽은
영영 시험을 못 받고, 시험 못 받은 쪽이 언젠가 조용히 틀린다.

여기서는 행을 읽어 파이썬이 번호를 매기고 갱신한다. 방언을 안 타므로 한 벌이면
되고, 마이그레이션 한 번에 수십 행이라 속도는 문제가 되지 않는다.

## 되돌리기

`downgrade` 는 picsum 으로 되돌리지 않는다. 그 주소는 애초에 살아 있지 않아,
되돌린다면 고장난 상태로 되돌리는 셈이다. 비워 두면 화면이 대체 그림을 그린다
(`PropertyPhoto`).
"""
import sqlalchemy as sa
from alembic import op

revision = "0005_local_room_photos"
down_revision = "0004_sales_pipeline"
branch_labels = None
depends_on = None

PHOTO_COUNT = 24
PREFIX = "/images/rooms/"


def photo_at(slot: int) -> str:
    return f"{PREFIX}room-{slot % PHOTO_COUNT + 1:02d}.jpg"


def upgrade() -> None:
    bind = op.get_bind()
    rows = bind.execute(sa.text(
        "SELECT id FROM properties "
        "WHERE photo_url LIKE '%picsum%' "
        "ORDER BY name, id"          # id 까지 넣어야 이름이 같아도 순서가 고정된다
    )).fetchall()

    for slot, (pid,) in enumerate(rows):
        bind.execute(
            sa.text("UPDATE properties SET photo_url = :url WHERE id = :id"),
            {"url": photo_at(slot), "id": pid},
        )


def downgrade() -> None:
    op.execute(
        f"UPDATE properties SET photo_url = NULL "
        f"WHERE photo_url LIKE '{PREFIX}%'"
    )
