"""이상 징후 감지.

목표선(``targets.py``)은 **절대적인 선**을 본다 — 전환율이 10% 를 넘었는가. 이 파일은
**변화**를 본다. 어제까지 9.5% 였다가 오늘 6% 가 되면, 목표선은 원래도 미달이었으니
아무 말도 안 한다. 그런데 그건 사고다.

**여기서 가장 중요한 규칙은 "울리지 않는 것"이다.**

이 저장소는 SRM 에서 이미 그 교훈을 적었다 — 항상 울리는 경보는 무시되고, 무시되면
진짜 실패도 못 잡는다. 그래서 이 감지기는 세 가지를 지킨다.

  1. **표본이 적으면 아예 판정하지 않는다.** 100명짜리 세그먼트의 전환율은 하루에도
     크게 흔들린다. 그 흔들림을 경보로 바꾸면 매일 울린다.
  2. **상대 변화와 절대 변화를 같이 본다.** 0.2% → 0.4% 는 100% 증가지만 실제로는
     아무 일도 아니다.
  3. **방향을 안다.** 전환율이 오른 것과 격리율이 오른 것은 다르다.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from enum import Enum

import pandas as pd

from analytics.funnel import by_segment, compute, conversion_rate
from analytics.revenue import summarize


class Severity(str, Enum):
    INFO = "INFO"
    WARN = "WARN"
    ALERT = "ALERT"


@dataclass
class Finding:
    """이상 하나. **무엇이·얼마나·왜 그렇게 판단했는지**를 같이 들고 다닌다.

    이유 없는 경보는 받는 사람이 확인할 방법이 없어서 결국 무시된다.
    """

    metric: str
    label: str
    baseline: float
    current: float
    severity: Severity
    reason: str
    sample: int = 0

    @property
    def change(self) -> float:
        """상대 변화. 기준이 0 이면 비율을 낼 수 없으므로 0 으로 둔다."""
        return round((self.current - self.baseline) / self.baseline, 4) if self.baseline else 0.0

    def __str__(self) -> str:
        return (f"[{self.severity.value}] {self.label} "
                f"{self.baseline:.4g} → {self.current:.4g} ({self.change:+.1%}) — {self.reason}")


@dataclass
class Rule:
    """지표 하나를 어떻게 볼 것인가."""

    metric: str
    label: str
    #: 나빠지는 방향. ``down`` 이면 값이 떨어질 때, ``up`` 이면 오를 때 문제다.
    worse: str
    #: 상대 변화가 이만큼을 넘어야 본다.
    rel: float = 0.20
    #: 절대 변화도 이만큼은 돼야 본다. 작은 수의 큰 비율을 거르는 장치다.
    abs_: float = 0.01
    #: 이 표본 미만이면 판정하지 않는다.
    min_sample: int = 300


RULES: tuple[Rule, ...] = (
    Rule("funnel.cvr", "최종 전환율", worse="down", rel=0.15, abs_=0.01),
    Rule("funnel.booking_started", "예약 시작률", worse="down", rel=0.15, abs_=0.02),
    Rule("revenue.arpu", "방문자당 매출", worse="down", rel=0.20, abs_=1_000),
    Rule("revenue.cancellation_rate", "취소율", worse="up", rel=0.30, abs_=0.02),
)

#: 세그먼트별로도 본다. 전체는 멀쩡한데 한 세그먼트만 무너지는 경우를 잡는다 —
#: 층별 SRM 과 같은 발상이다.
SEGMENT_AXIS = "device_type"


def _metrics(df: pd.DataFrame) -> dict[str, float]:
    if df.empty:
        return {}
    steps = compute(df)
    started = next((s for s in steps if s.event == "booking_started"), None)
    rev = summarize(df)
    return {
        "funnel.cvr": float(conversion_rate(df)),
        "funnel.booking_started": float(started.step_rate) if started and started.step_rate else 0.0,
        "revenue.arpu": float(rev.arpu),
        "revenue.cancellation_rate": float(rev.cancellation_rate),
    }


def _judge(rule: Rule, base: float, cur: float, sample: int) -> Finding | None:
    if sample < rule.min_sample:
        # 판정하지 않는다. **"이상 없음" 과 다르다** — 그래서 Finding 을 안 만든다.
        return None

    delta = cur - base
    moved_wrong_way = delta < 0 if rule.worse == "down" else delta > 0
    if not moved_wrong_way:
        return None

    rel = abs(delta) / base if base else 0.0
    if rel < rule.rel or abs(delta) < rule.abs_:
        # 상대와 절대를 **둘 다** 넘어야 한다. 0.2% → 0.4% 는 100% 증가지만
        # 실제로는 아무 일도 아니다.
        return None

    sev = Severity.ALERT if rel >= rule.rel * 2 else Severity.WARN
    return Finding(
        metric=rule.metric, label=rule.label, baseline=round(base, 6),
        current=round(cur, 6), severity=sev, sample=sample,
        reason=f"상대 {rel:.0%} · 절대 {abs(delta):.4g} 변화 (표본 {sample:,})",
    )


@dataclass
class Report:
    findings: list[Finding] = field(default_factory=list)
    skipped: list[str] = field(default_factory=list)
    baseline_events: int = 0
    current_events: int = 0

    @property
    def healthy(self) -> bool:
        return not self.findings

    def __str__(self) -> str:
        if not self.findings:
            return f"이상 없음 (기준 {self.baseline_events:,} → 현재 {self.current_events:,})"
        return f"이상 {len(self.findings)}건 — " + " / ".join(f.label for f in self.findings)


def detect(baseline: pd.DataFrame, current: pd.DataFrame,
           rules: tuple[Rule, ...] = RULES) -> Report:
    """두 기간을 견줘 나빠진 것을 찾는다.

    **비교 대상을 부르는 쪽이 정한다.** 여기서 "지난주" 를 자동으로 고르지 않는
    이유는, 무엇과 견주느냐가 곧 판단이기 때문이다 — 성수기를 비수기와 견주면
    매번 울린다.
    """
    rep = Report(baseline_events=int(len(baseline)), current_events=int(len(current)))

    if baseline.empty or current.empty:
        rep.skipped.append("한쪽 기간이 비어 있어 견줄 수 없다")
        return rep

    base_m, cur_m = _metrics(baseline), _metrics(current)
    sample = int(len(current))

    for r in rules:
        if r.metric not in base_m or r.metric not in cur_m:
            rep.skipped.append(f"{r.label}: 재지 못했다")
            continue
        if sample < r.min_sample:
            rep.skipped.append(f"{r.label}: 표본 부족({sample:,} < {r.min_sample:,})")
            continue
        f = _judge(r, base_m[r.metric], cur_m[r.metric], sample)
        if f:
            rep.findings.append(f)

    # 세그먼트별 — 전체 평균이 가리는 붕괴를 잡는다
    if SEGMENT_AXIS in current.columns:
        rep.findings.extend(_by_segment(baseline, current))

    return rep


def _by_segment(baseline: pd.DataFrame, current: pd.DataFrame) -> list[Finding]:
    out: list[Finding] = []
    try:
        b = by_segment(baseline, SEGMENT_AXIS).set_index(SEGMENT_AXIS)
        c = by_segment(current, SEGMENT_AXIS).set_index(SEGMENT_AXIS)
    except (KeyError, IndexError):
        return out

    for key in c.index.intersection(b.index):
        sample = int(c.loc[key, "top_users"])
        f = _judge(
            Rule(f"segment.{key}.cvr", f"{key} 전환율", worse="down", rel=0.20, abs_=0.01),
            float(b.loc[key, "cvr"]), float(c.loc[key, "cvr"]), sample,
        )
        if f:
            out.append(f)
    return out


__all__ = ["Finding", "Report", "RULES", "Rule", "SEGMENT_AXIS", "Severity", "detect"]
