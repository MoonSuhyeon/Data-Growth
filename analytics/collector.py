"""이벤트 수집.

배치로 받고, 스키마로 검증하고, 실패는 격리한다.
**드롭하지 않는 것**이 원칙이다 — 실패율은 수집 품질 지표이고, 스키마를 고치면
재처리해야 하기 때문이다.

**중복은 예외가 아니라 정상이다.** 오프라인 버퍼와 재시도가 있는 클라이언트에서는
같은 이벤트가 두 번 도착하는 게 정상 동작이다. 그대로 세면 퍼널이 부풀고,
부푼 줄도 모른다. 그래서 ``event_id`` 로 한 번만 받는다.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
from typing import Any

from pydantic import ValidationError

from tracking.taxonomy import Event, QuarantinedEvent


@dataclass
class CollectResult:
    accepted: list[Event] = field(default_factory=list)
    quarantined: list[QuarantinedEvent] = field(default_factory=list)
    duplicates: list[str] = field(default_factory=list)

    @property
    def total(self) -> int:
        """수신 건수. 중복도 받은 것이므로 분모에 든다."""
        return len(self.accepted) + len(self.quarantined) + len(self.duplicates)

    @property
    def failure_rate(self) -> float:
        return round(len(self.quarantined) / self.total, 6) if self.total else 0.0

    @property
    def duplicate_rate(self) -> float:
        """재전송 비율. 클라이언트 전송 계층의 건강 지표다."""
        return round(len(self.duplicates) / self.total, 6) if self.total else 0.0

    def __str__(self) -> str:
        return (
            f"accepted={len(self.accepted)} quarantined={len(self.quarantined)} "
            f"duplicates={len(self.duplicates)} failure_rate={self.failure_rate:.4%}"
        )


class EventCollector:
    """수집 엔드포인트의 핵심 로직.

    FastAPI 라우터는 이 클래스를 감싸기만 한다 (``POST /events``).
    """

    def __init__(self):
        self.store: list[Event] = []
        self.quarantine: list[QuarantinedEvent] = []
        # 이미 받은 event_id. 재전송을 걸러내는 유일한 근거다.
        self._seen: set[str] = set()

    def collect(self, payload: list[dict[str, Any]],
                received_at: datetime | None = None) -> CollectResult:
        """배치를 받는다.

        ``received_at`` 은 서버가 받은 시각이다. 클라이언트가 보내는 값이 아니라
        수집기가 찍는다 — 기기 시계를 검증할 기준이 필요하기 때문이다.
        """
        now = received_at or datetime.utcnow()
        result = CollectResult()

        for raw in payload:
            # 중복은 파싱 전에 거른다. 같은 event_id 를 두 번 세지 않는 게 목적이지
            # 두 번째 것을 다시 검증하는 게 목적이 아니다.
            eid = raw.get("event_id")
            if eid and eid in self._seen:
                result.duplicates.append(eid)
                continue

            try:
                ev = Event(**{"received_at": now.isoformat(), **raw})
            except ValidationError as e:
                msg = "; ".join(f"{x['loc'][0] if x['loc'] else '?'}: {x['msg']}"
                                for x in e.errors()[:3])
                result.quarantined.append(QuarantinedEvent(raw=raw, reason=msg))
                continue

            missing = ev.missing_required()
            if missing:
                result.quarantined.append(
                    QuarantinedEvent(
                        raw=raw,
                        reason=f"{ev.event_name.value}: 필수 속성 누락 {missing}",
                    )
                )
                continue

            self._seen.add(ev.event_id)
            result.accepted.append(ev)

        self.store.extend(result.accepted)
        self.quarantine.extend(result.quarantined)
        return result

    @property
    def failure_rate(self) -> float:
        total = len(self.store) + len(self.quarantine)
        return round(len(self.quarantine) / total, 6) if total else 0.0

    def reprocess(self, fix) -> CollectResult:
        """격리된 이벤트를 스키마 수정 후 다시 태운다."""
        pending = [q.raw for q in self.quarantine]
        self.quarantine = []
        return self.collect([fix(r) for r in pending])


__all__ = ["CollectResult", "EventCollector"]
