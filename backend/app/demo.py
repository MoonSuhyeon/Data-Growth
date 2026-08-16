"""데모 기동 — SQLite 로 띄웠을 때 스키마와 데이터를 만들어 준다.

**마이그레이션은 운영 DB(PostgreSQL) 용이다.** 여기서는 모델에서 직접 스키마를
만든다. 둘의 목적이 다르다 — 마이그레이션은 기존 데이터를 옮기는 것이고,
데모는 매번 새로 만드는 것이다. 그 차이를 숨기지 않고 이렇게 나눠 둔다.

PostgreSQL 로 띄우면 아무것도 하지 않는다. 그쪽은 alembic 이 맡는다.
"""
from __future__ import annotations

import logging

from sqlalchemy import select

from app.core.database import IS_SQLITE, AsyncSessionLocal, engine
from app.models import Base, Property

logger = logging.getLogger("demo")


async def ensure_demo_data() -> None:
    """SQLite 이고 비어 있으면 스키마를 만들고 시드를 넣는다."""
    if not IS_SQLITE:
        return

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as session:
        exists = (await session.execute(select(Property.id).limit(1))).first()
    if exists:
        logger.info("데모 데이터가 이미 있습니다")
        return

    from app.seed import seed

    await seed()
    logger.info("SQLite 데모 데이터를 생성했습니다")
