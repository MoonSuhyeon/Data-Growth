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

router = APIRouter()

# 프로세스 하나가 들고 있는 수집기. 데모 범위에서는 이걸로 충분하고, 실제로는
# 여기서 큐(Kafka·Kinesis)로 넘긴 뒤 적재는 비동기로 뗀다.
_collector = EventCollector()

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
    """수집 품질. 실패율이 지표라는 주장을 볼 수 있게 노출한다."""
    return HealthResponse(
        stored=len(_collector.store),
        quarantined=len(_collector.quarantine),
        failure_rate=_collector.failure_rate,
    )
