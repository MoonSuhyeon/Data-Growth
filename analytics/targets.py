"""지표마다 목표선을 **먼저** 긋는다.

이 저장소의 규칙은 실험에서 이미 한 번 나왔다 — MDE 와 표본 수를 실행 전에
정하고, 그 다음에 결과를 읽는다. 그러지 않으면 나온 값을 보고 "이 정도면 괜찮다"
를 사후에 정하게 된다.

**대시보드도 같다.** 목표 없이 숫자만 있으면 전환율 9.4% 가 좋은 건지 나쁜 건지
아무도 모르고, 다음 분기에 8.9% 가 되면 "조금 떨어졌네" 로 넘어간다. 선을 먼저
그어두면 그 값이 선을 넘었는지 아닌지가 곧 답이 된다.

목표는 **코드가 아니라 이 파일**에 있다. 바꾸려면 커밋이 남고, 언제 왜 바꿨는지가
이력에 남는다 — 결과를 보고 목표를 슬쩍 내리는 일을 막는 유일한 장치다.
"""
from __future__ import annotations

from dataclasses import dataclass
from enum import Enum


class Direction(str, Enum):
    """목표를 향하는 방향. 이걸 안 정하면 "달성" 의 뜻이 지표마다 달라진다."""

    UP = "UP"        # 높을수록 좋다 (전환율)
    DOWN = "DOWN"    # 낮을수록 좋다 (이탈률, 격리율)


@dataclass(frozen=True)
class Target:
    """지표 하나의 목표선.

    ``floor`` 는 **최소 허용선**이다. 목표에 못 미치는 것과 **선을 넘어 나쁜 것**은
    다르게 다뤄야 한다 — 전자는 개선 과제고 후자는 사고다. 둘을 한 숫자로 두면
    대시보드가 "빨간불" 하나로 뭉개고, 그러면 진짜 사고가 묻힌다.
    """

    key: str
    label: str
    goal: float
    floor: float
    direction: Direction
    unit: str = "rate"
    #: 왜 이 값인가. 근거 없는 목표는 다음 사람이 마음대로 바꾼다.
    rationale: str = ""

    def status(self, value: float | None) -> str:
        """``met`` · ``below`` · ``breach`` · ``unknown``."""
        if value is None:
            return "unknown"
        if self.direction is Direction.UP:
            if value >= self.goal:
                return "met"
            return "below" if value >= self.floor else "breach"
        if value <= self.goal:
            return "met"
        return "below" if value <= self.floor else "breach"


#: 지금 재고 있는 지표에만 목표를 둔다. 못 재는 지표에 목표를 두면 영원히
#: "unknown" 이 뜨고, 읽는 사람은 대시보드가 고장 났다고 여긴다.
TARGETS: tuple[Target, ...] = (
    Target(
        key="funnel.cvr", label="최종 전환율", goal=0.10, floor=0.08,
        direction=Direction.UP,
        rationale="현재 9.4%. 10% 를 넘기는 것이 이번 분기 목표이고, 8% 아래는 "
                  "퍼널 어딘가가 깨진 것으로 본다.",
    ),
    Target(
        key="funnel.mobile_booking_started", label="모바일 예약 시작률", goal=0.32,
        floor=0.24, direction=Direction.UP,
        rationale="데스크톱이 35.4%. 그 격차를 좁히는 것이 sticky CTA 실험의 목적이라 "
                  "데스크톱 근처를 목표로 둔다.",
    ),
    Target(
        key="retention.return_rate", label="재방문율", goal=0.25, floor=0.15,
        direction=Direction.UP,
        rationale="현재 19.6%. 재방문자가 신규보다 전환이 높으므로(9.46% vs 7.74%) "
                  "여기를 올리는 것이 매출로 직결된다.",
    ),
    Target(
        key="revenue.arpu", label="방문자당 매출", goal=20_000, floor=12_000,
        direction=Direction.UP, unit="won",
        rationale="현재 16,809원. 데스크톱이 19,924원이므로 전 디바이스가 그 수준이면 "
                  "달성이다.",
    ),
    Target(
        key="collection.failure_rate", label="수집 격리율", goal=0.005, floor=0.02,
        direction=Direction.DOWN,
        rationale="현재 0.42%. 이건 제품 지표가 아니라 **계측 품질** 지표다. "
                  "2% 를 넘으면 숫자를 믿을 수 없으므로 분석을 멈춰야 한다.",
    ),
    Target(
        key="revenue.cancellation_rate", label="취소율", goal=0.05, floor=0.12,
        direction=Direction.DOWN,
        rationale="현재 6.2%. 12% 를 넘으면 상품이나 정책에 문제가 있다고 본다.",
    ),
)

BY_KEY: dict[str, Target] = {t.key: t for t in TARGETS}


def evaluate(values: dict[str, float | None]) -> list[dict]:
    """측정값을 목표선과 대조한다.

    목표가 없는 지표는 **넣지 않는다.** 목표 없는 값을 같은 표에 섞으면 "선을
    넘었는지" 를 물을 수 없는 행이 생기고, 그 행들이 표의 의미를 흐린다.
    """
    rows = []
    for t in TARGETS:
        v = values.get(t.key)
        rows.append({
            "key": t.key,
            "label": t.label,
            "value": v,
            "goal": t.goal,
            "floor": t.floor,
            "direction": t.direction.value,
            "unit": t.unit,
            "status": t.status(v),
            "rationale": t.rationale,
        })
    return rows


def summary(rows: list[dict]) -> dict[str, int]:
    out = {"met": 0, "below": 0, "breach": 0, "unknown": 0}
    for r in rows:
        out[r["status"]] += 1
    return out


__all__ = ["BY_KEY", "Direction", "TARGETS", "Target", "evaluate", "summary"]
