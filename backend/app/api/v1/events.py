"""이벤트 수집 — SDK 가 배치를 밀어 넣는 곳.

    POST /api/v1/events

``analytics.collector.EventCollector`` 를 감싸기만 한다. 판단은 전부 그 클래스에
있고, 여기는 HTTP 경계에서 생기는 결정만 다룬다. 그 결정이 두 개다.

**1. 잘못된 이벤트가 섞여 있어도 4xx 를 주지 않는다.**
배치는 여러 이벤트를 담는다. 하나가 스키마를 어겼다고 배치 전체를 거절하면
클라이언트는 그 배치를 다시 보낸다 — 그리고 또 거절당한다. 영원히 못 비우는
큐가 되고, 뒤에 쌓인 멀쩡한 이벤트까지 같이 갇힌다. 그래서 **받아서 격리하고,
격리했다고 응답에 적는다.** 실패율은 버그 신호이지 클라이언트가 재시도로 풀
문제가 아니다.

**2. 중복도 성공으로 답한다.**
오프라인 버퍼가 있는 클라이언트에서 재전송은 정상 동작이다. 서버가 이미 받은
``event_id`` 를 거절하면 클라이언트는 그걸 실패로 보고 또 보낸다. ``accepted``
와 ``duplicates`` 를 나눠서 세되, 둘 다 "잘 도착했다" 로 답한다 — 그래야
클라이언트가 큐에서 지운다.
"""
from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

from fastapi import APIRouter, Body
from pydantic import BaseModel, Field

from analytics.collector import EventCollector
from analytics.store import EventStore

router = APIRouter()

# 검증기. 판단(스키마·중복·격리)은 여전히 이 클래스가 한다.
_collector = EventCollector()

# 저장소. **수집과 보관을 나눈 이유가 있다.**
#
# 예전에는 받은 이벤트가 `_collector.store` — 프로세스 메모리 리스트 — 에만
# 남았다. 재시작하면 사라졌고, 그래서 "스키마를 고친 뒤 격리본을 재처리한다" 는
# 약속이 프로세스가 사는 동안만 유효했다. 기간으로 물을 수도 없었다.
#
# 실제 규모에서는 여기서 큐(Kafka·Kinesis)로 넘기고 적재를 비동기로 뗀다. 지금은
# 동기로 쓰되, **경계는 같은 자리에 둔다.**
_store = EventStore()

# 한 번에 받는 최대 건수. 상한이 없으면 오프라인에 오래 있던 클라이언트가
# 복귀하면서 수천 건을 한 요청에 밀어 넣는다.
MAX_BATCH = 500


class IngestResponse(BaseModel):
    """무엇이 어떻게 처리됐는지 클라이언트가 알 수 있어야 한다.

    ``accepted + duplicates`` 만큼은 큐에서 지워도 된다. ``quarantined`` 도
    지워야 한다 — 재시도해도 같은 이유로 또 격리되기 때문이다.
    """

    accepted: int
    duplicates: int
    quarantined: int
    failure_rate: float
    # 왜 격리됐는지 돌려준다. 이걸 안 주면 클라이언트 쪽 계측 버그를 배포 후에
    # 알아낼 방법이 로그밖에 없다.
    reasons: list[str] = Field(default_factory=list)


@router.post("/events", response_model=IngestResponse)
def ingest(payload: list[dict[str, Any]] = Body(...)) -> IngestResponse:
    """배치를 받는다. **부분 실패를 부분 실패로 답한다.**

    ``received_at`` 은 서버가 찍는다. 클라이언트가 보내도 무시한다 — 기기 시계를
    검증할 기준이 클라이언트가 보낸 값이면 검증이 아니다.
    """
    batch = payload[:MAX_BATCH]
    now = datetime.now(timezone.utc).replace(tzinfo=None)
    result = _collector.collect(
        [{k: v for k, v in raw.items() if k != "received_at"} for raw in batch],
        received_at=now,
    )

    # 검증을 통과한 것만 저장한다. 저장소도 `event_id` 로 한 번 더 접는다 —
    # 메모리 집합은 재시작하면 비어서, 며칠 뒤 재전송된 이벤트를 새 것으로 받는다.
    _store.put([
        {**e.model_dump(mode="json"), "sent_at": e.sent_at, "received_at": e.received_at}
        for e in result.accepted
    ])
    # 격리본도 남긴다. 이게 있어야 재처리가 실제로 할 일이 생긴다.
    _store.quarantine([(q.raw, q.reason) for q in result.quarantined])

    return IngestResponse(
        accepted=len(result.accepted),
        duplicates=len(result.duplicates),
        quarantined=len(result.quarantined),
        failure_rate=result.failure_rate,
        reasons=[q.reason for q in result.quarantined[:10]],
    )


class HealthResponse(BaseModel):
    stored: int
    quarantined: int
    failure_rate: float


@router.get("/events/health", response_model=HealthResponse)
def health() -> HealthResponse:
    """수집 품질. 실패율이 지표라는 주장을 볼 수 있게 노출한다.

    **저장소를 센다.** 프로세스 메모리를 세면 재시작 직후 0 이 나오고, 그 0 이
    "아직 안 왔다" 인지 "잊어버렸다" 인지 구분되지 않는다.
    """
    stored = _store.count()
    quarantined = _store.quarantined_count()
    total = stored + quarantined
    return HealthResponse(
        stored=stored,
        quarantined=quarantined,
        failure_rate=round(quarantined / total, 6) if total else 0.0,
    )
