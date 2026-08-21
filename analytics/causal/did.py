"""이중차분(DiD) — **문턱을 지난 뒤에만 돈다.**

D3 의 뒤 절반.

    효과 = (처치 후 − 처치 전) − (대조 후 − 대조 전)

산수는 네 개의 평균이 전부다. 이 파일에서 진짜인 부분은 **언제 이 산수를 하면 안
되는지**다.

## 평행추세가 깨졌으면 계산하지 않는다

주석을 달고 숫자를 내놓는 방식이 흔하다 — "평행추세 가정이 다소 약하나…" 로 시작해
표에는 계수가 그대로 실린다. 그러면 읽는 사람은 계수를 읽고 단서는 안 읽는다.

여기서는 **막는다.** `pretrend.check()` 가 통과하지 않으면 `estimate()` 는 수를
내놓지 않는다. `check_srm()` 이 깨졌을 때 전환율을 안 읽는 것과 같은 규칙이다.

## 남은 위협은 이름으로 적는다

문턱을 지나도 인과가 확정되는 게 아니다. 무작위 배정이 없으므로 남는 것들이 있다.

- 대조군이 같은 시기에 자기 캠페인을 돌렸을 수 있다
- 성수기가 창 안에 들어 있을 수 있다
- 플랫폼 알고리즘이 바뀌었을 수 있다

이걸 "한계" 라는 제목 아래 뭉뚱그리지 않고 `threats` 에 하나씩 담는다. 뭉뚱그린
한계는 아무도 안 읽는다.

## 가장 센 문장

실험이라면 **"처치가 +18% 를 일으켰다"** 라고 쓸 수 있다. 여기서는 못 쓴다.
`statement` 가 낼 수 있는 최대는 **"이와 일관되며, …를 배제할 수 없다"** 다.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from datetime import date
from statistics import fmean

from analytics.causal.pretrend import PreTrend

#: 문턱을 지나도 남는 것들. **모든 보고서에 그대로 실린다.**
#:
#: 상수로 두는 이유가 있다 — 보고서마다 다시 쓰게 두면 불리한 항목이 조용히
#: 빠진다. 여기 없는 위협은 더할 수 있지만, 여기 있는 것은 뺄 수 없다.
STANDING_THREATS = (
    "대조군이 같은 시기에 자기 캠페인을 돌렸을 수 있다",
    "성수기·연휴가 관측 창 안에 들어 있을 수 있다",
    "플랫폼 알고리즘이나 노출 규칙이 바뀌었을 수 있다",
    "처치군을 고른 기준이 결과와 상관있을 수 있다(선택 편향)",
)


@dataclass
class DiD:
    """이중차분 결과."""

    treated_pre: float
    treated_post: float
    control_pre: float
    control_post: float
    n_pre: int
    n_post: int
    pretrend: PreTrend
    threats: list[str] = field(default_factory=list)
    blocked: str = ""

    @property
    def readable(self) -> bool:
        return not self.blocked

    @property
    def treated_change(self) -> float:
        return self.treated_post - self.treated_pre

    @property
    def control_change(self) -> float:
        return self.control_post - self.control_pre

    @property
    def effect(self) -> float | None:
        """이중차분. **막혔으면 `None`** — 0 이 아니다."""
        return None if self.blocked else self.treated_change - self.control_change

    @property
    def statement(self) -> str:
        """쓸 수 있는 가장 센 문장.

        **"일으켰다" 가 안 나온다.** 무작위 배정이 없으면 그 단어를 쓸 자격이 없고,
        자격이 없는 단어를 못 쓰게 하는 것이 이 속성의 전부다.
        """
        if self.blocked:
            return f"추정하지 않는다 — {self.blocked}"
        return (f"캠페인 이후 처치군이 대조군보다 {self.effect:+.3f} 더 움직였다. "
                f"이는 캠페인이 효과를 냈다는 가설과 **일관되며**, "
                f"아래 {len(self.threats)}가지를 배제할 수 없다")

    def __str__(self) -> str:
        if self.blocked:
            return f"차단 — {self.blocked}"
        return (f"DiD {self.effect:+.3f} "
                f"(처치 {self.treated_change:+.3f}, 대조 {self.control_change:+.3f}) · "
                f"사전 {self.n_pre}기 / 사후 {self.n_post}기")


def estimate(aligned: list[tuple[date, float, float]], intervention: date,
             pretrend: PreTrend, extra_threats: tuple[str, ...] = ()) -> DiD:
    """이중차분을 낸다. **평행추세를 통과하지 못했으면 내지 않는다.**

    Args:
        aligned: `analytics.external.series.align()` 의 결과 — (시점, 처치, 대조)
        intervention: 캠페인 시작일
        pretrend: `analytics.causal.pretrend.check()` 의 결과. **필수 인자다** —
            기본값을 주면 안 부르고도 돌릴 수 있게 되고, 그러면 문턱이 아니다
    """
    pre = [(t, c) for d, t, c in aligned if d < intervention]
    post = [(t, c) for d, t, c in aligned if d >= intervention]

    blocked = ""
    if not pretrend.parallel:
        # 판정문을 그대로 쓴다. 앞에 "문턱을 못 지났다" 를 덧붙이면 판정문이 이미
        # 그 말을 담고 있어서 같은 문장이 두 번 나온다.
        blocked = pretrend.verdict
    elif not pre or not post:
        blocked = "개입 전후 한쪽에 관측이 없다"

    def mean(rows, i):
        return fmean(r[i] for r in rows) if rows else 0.0

    return DiD(
        treated_pre=mean(pre, 0), treated_post=mean(post, 0),
        control_pre=mean(pre, 1), control_post=mean(post, 1),
        n_pre=len(pre), n_post=len(post), pretrend=pretrend,
        threats=[*STANDING_THREATS, *extra_threats],
        blocked=blocked,
    )


__all__ = ["DiD", "STANDING_THREATS", "estimate"]
