"""이벤트 수집.

배치로 받고, 스키마로 검증하고, 실패는 격리한다.
**드롭하지 않는 것**이 원칙이다 — 실패율은 수집 품질 지표이고, 스키마를 고치면
재처리해야 하기 때문이다.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any

from pydantic import ValidationError

from tracking.taxonomy import Event, QuarantinedEvent


@dataclass
class CollectResult:
    accepted: list[Event] = field(default_factory=list)
    quarantined: list[QuarantinedEvent] = field(default_factory=list)

    @property
    def total(self) -> int:
        return len(self.accepted) + len(self.quarantined)

    @property
    def failure_rate(self) -> float:
        return round(len(self.quarantined) / self.total, 6) if self.total else 0.0

    def __str__(self) -> str:
        return (
            f"accepted={len(self.accepted)} quarantined={len(self.quarantined)} "
            f"failure_rate={self.failure_rate:.4%}"
        )


class EventCollector:
    """수집 엔드포인트의 핵심 로직.

    FastAPI 라우터는 이 클래스를 감싸기만 한다 (``POST /events``).
    """

    def __init__(self):
        self.store: list[Event] = []
        self.quarantine: list[QuarantinedEvent] = []

    def collect(self, payload: list[dict[str, Any]]) -> CollectResult:
        result = CollectResult()
        for raw in payload:
            try:
                ev = Event(**raw)
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
