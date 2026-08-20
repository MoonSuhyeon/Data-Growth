"""이벤트 저장소.

지금까지 수집한 이벤트는 ``EventCollector.store`` — **프로세스 메모리의 리스트**에만
있었다. 그래서 세 가지가 안 됐다.

  1. 재시작하면 사라진다. ``collector.py`` 는 "스키마를 고친 뒤 재처리할 수 있어야
     하니 격리한다" 고 적어 놨는데, **재처리할 대상이 프로세스와 함께 죽었다.**
  2. 기간으로 물을 수 없다. 대시보드에 날짜 선택을 붙이려 해도 질의를 받을 곳이
     없어서, 파이프라인이 미리 계산해 둔 JSON 한 장만 보여줄 수 있었다.
  3. 수집과 분석이 같은 프로세스에 묶인다.

**예약 도메인과 분리한다.** 이벤트는 예약 도메인의 개념이 아니고, 같은 DB 에 넣으면
스키마 마이그레이션이 서로 묶인다 — 이벤트 컬럼 하나 바꾸려고 예약 테이블
마이그레이션 체인을 건드리게 된다. 별도 엔진·별도 Base 를 쓴다.
"""
from __future__ import annotations

import json
import os
from collections.abc import Iterable
from datetime import datetime

import pandas as pd
from sqlalchemy import (
    JSON, Column, DateTime, Integer, String, Text, create_engine, func, select,
)
from sqlalchemy.orm import Session, declarative_base

#: 분석 저장소의 주소. 예약 백엔드의 ``DATABASE_URL`` 과 **다른 변수**다 —
#: 같은 변수를 쓰면 분리해 둔 의미가 없다.
STORE_URL = os.getenv("ANALYTICS_DB_URL", "sqlite:///./analytics.db")

Base = declarative_base()

#: 한 번에 물어볼 최대 개수. SQLite 의 기본 변수 상한(999)보다 넉넉히 아래로 둔다.
_CHUNK = 500


class StoredEvent(Base):
    """수집된 이벤트 한 건.

    ``event_id`` 가 기본키다. **중복 제거를 저장소가 보장한다** — 메모리 집합으로
    거르면 재시작할 때마다 그 기억이 사라져서, 오프라인 버퍼가 며칠 뒤 재전송한
    이벤트를 새 이벤트로 받는다.
    """

    __tablename__ = "events"

    event_id = Column(String(64), primary_key=True)
    event_name = Column(String(40), nullable=False, index=True)
    anonymous_id = Column(String(64), nullable=False, index=True)
    user_id = Column(String(64), nullable=True, index=True)
    session_id = Column(String(96), nullable=True)

    sent_at = Column(DateTime, nullable=False, index=True)
    received_at = Column(DateTime, nullable=True)

    platform = Column(String(16), nullable=False, default="WEB")
    device_type = Column(String(16), nullable=False, default="DESKTOP")
    install_id = Column(String(64), nullable=True)
    app_version = Column(String(16), nullable=True)

    property_id = Column(String(64), nullable=True, index=True)
    room_id = Column(String(64), nullable=True)
    search_id = Column(String(64), nullable=True)
    booking_id = Column(String(64), nullable=True)
    region = Column(String(40), nullable=True)
    amount = Column(Integer, nullable=True)

    properties = Column(JSON, nullable=True)


class QuarantinedEvent(Base):
    """검증에 실패한 이벤트. **버리지 않는다.**

    이게 남아야 ``reprocess()`` 가 실제로 할 일이 생긴다. 메모리에만 두면 그 기능은
    프로세스가 사는 동안만 존재하는 약속이었다.
    """

    __tablename__ = "quarantined_events"

    id = Column(Integer, primary_key=True, autoincrement=True)
    raw = Column(Text, nullable=False)
    reason = Column(Text, nullable=False)
    received_at = Column(DateTime, nullable=False, default=datetime.utcnow, index=True)


class EventStore:
    """이벤트를 넣고 기간으로 꺼내는 곳."""

    def __init__(self, url: str | None = None):
        self.url = url or STORE_URL
        # SQLite 는 기본이 스레드 귀속이라 API 프로세스에서 막힌다.
        connect_args = {"check_same_thread": False} if self.url.startswith("sqlite") else {}
        self.engine = create_engine(self.url, connect_args=connect_args, future=True)
        Base.metadata.create_all(self.engine)

    # ------------------------------------------------------------ 쓰기
    def put(self, events: Iterable[dict]) -> int:
        """이벤트를 넣는다. 이미 있는 ``event_id`` 는 **조용히 건너뛴다.**

        Returns:
            새로 저장된 건수. 중복은 세지 않는다.
        """
        rows = list(events)
        if not rows:
            return 0

        cols = {c.name for c in StoredEvent.__table__.columns}
        added = 0
        seen: set[str] = set()
        with Session(self.engine) as s:
            # **나눠서 묻는다.** `IN (...)` 에 수만 개를 한 번에 넣으면 SQLite 가
            # "too many SQL variables" 로 죽는다. 오프라인 버퍼가 며칠치를 한 번에
            # 밀어 올리는 것이 정상 동작이므로, 큰 배치는 예외가 아니라 기본이다.
            for i in range(0, len(rows), _CHUNK):
                part = rows[i:i + _CHUNK]
                seen |= {
                    e for (e,) in s.execute(
                        select(StoredEvent.event_id).where(
                            StoredEvent.event_id.in_([r["event_id"] for r in part])
                        )
                    )
                }
            for r in rows:
                if r["event_id"] in seen:
                    continue
                seen.add(r["event_id"])
                s.add(StoredEvent(**{k: v for k, v in r.items() if k in cols}))
                added += 1
            s.commit()
        return added

    def quarantine(self, items: Iterable[tuple[dict, str]]) -> int:
        rows = list(items)
        if not rows:
            return 0
        with Session(self.engine) as s:
            for raw, reason in rows:
                s.add(QuarantinedEvent(raw=json.dumps(raw, ensure_ascii=False, default=str),
                                       reason=reason))
            s.commit()
        return len(rows)

    # ------------------------------------------------------------ 읽기
    def frame(self, since: datetime | None = None,
              until: datetime | None = None) -> pd.DataFrame:
        """기간으로 잘라 DataFrame 으로 준다.

        **분석 함수들이 이미 DataFrame 을 받는다.** 그래서 저장소는 모양을 바꾸지
        않고 그대로 넘긴다 — 여기서 새 표현을 만들면 파이프라인이 둘로 갈린다.

        기간은 ``sent_at`` 기준이다. 발생 시각으로 잘라야 "6월 1주차" 가 그 주에
        일어난 일을 뜻한다. 서버 수신 시각으로 자르면 오프라인 버퍼에 갇혔던
        이벤트가 도착한 주에 끼어든다.
        """
        stmt = select(StoredEvent)
        if since is not None:
            stmt = stmt.where(StoredEvent.sent_at >= since)
        if until is not None:
            stmt = stmt.where(StoredEvent.sent_at <= until)

        with Session(self.engine) as s:
            rows = s.execute(stmt).scalars().all()

        if not rows:
            # 빈 프레임이어도 **컬럼은 있어야 한다.** 없으면 분석 함수가
            # KeyError 로 죽고, "데이터가 없다" 와 "코드가 깨졌다" 가 섞인다.
            return pd.DataFrame(columns=[c.name for c in StoredEvent.__table__.columns])

        df = pd.DataFrame([
            {c.name: getattr(r, c.name) for c in StoredEvent.__table__.columns}
            for r in rows
        ])
        for col in ("sent_at", "received_at"):
            df[col] = pd.to_datetime(df[col])
        return df

    def span(self) -> tuple[datetime | None, datetime | None]:
        """저장된 이벤트의 시각 범위. 화면이 기본 기간을 정할 때 쓴다."""
        with Session(self.engine) as s:
            lo, hi = s.execute(
                select(func.min(StoredEvent.sent_at), func.max(StoredEvent.sent_at))
            ).one()
        return lo, hi

    def count(self) -> int:
        with Session(self.engine) as s:
            return int(s.execute(select(func.count(StoredEvent.event_id))).scalar() or 0)

    def quarantined_count(self) -> int:
        with Session(self.engine) as s:
            return int(s.execute(select(func.count(QuarantinedEvent.id))).scalar() or 0)

    def clear(self) -> None:
        """테스트·재적재용. 운영에서 부를 일은 없다."""
        with Session(self.engine) as s:
            s.query(StoredEvent).delete()
            s.query(QuarantinedEvent).delete()
            s.commit()


__all__ = ["Base", "EventStore", "QuarantinedEvent", "STORE_URL", "StoredEvent"]
