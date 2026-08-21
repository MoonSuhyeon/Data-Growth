"""평행추세 검정 — **효과를 재기 전에 지나야 하는 문턱.**

D3 의 앞 절반. `check_srm()` 과 같은 자리에 있다.

## 왜 문턱인가

무작위 배정이 없으면 인과 주장은 **누군가 고른 비교 대상** 위에 선다. 그 비교가
성립하려면 두 계열이 개입 **전에** 나란히 움직였어야 한다.

안 그랬다면 개입 후의 차이는 캠페인일 수도, 원래 벌어지고 있던 추세일 수도 있다.
**DiD 는 그 둘을 가르지 못한다.** 개입 후 차이가 아무리 커도 구제되지 않는다.

그래서 이 검정은 주석이 아니라 게이트다. 실패하면 효과 추정을 **못 하게 막는다** —
전환율을 읽기 전에 SRM 을 보는 것과 같은 순서다.

## 실패는 발견이지 실패가 아니다

평행추세가 깨졌다는 결론은 "분석을 못 했다" 가 아니라 **"이 설계로는 캠페인과
추세를 가를 수 없다"** 는 사실이다. 그 문장이 곧 `docs/readout-review.md` 의 감사관이
지키게 하려는 문장이다.

## 그리고 "유의하지 않으니 평행하다" 도 틀렸다

관측이 6개면 어떤 기울기 차이든 유의하지 않게 나온다. 그건 평행하다는 증거가
아니라 **모른다는 뜻**이다. 그래서 p 값과 함께 관측 수와 추정된 기울기 차이를
같이 낸다 — 검정력이 없어서 통과한 것인지 실제로 평행한 것인지 구분되도록.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from datetime import date

from scipy import stats

#: 이보다 적은 사전 관측으로는 판정하지 않는다.
#:
#: 두 점으로는 어떤 두 직선도 "평행" 이다. 세 점이면 기울기 차이의 표준오차가
#: 사실상 무한대라 무엇이든 통과한다. 통과시키면 안 되는 것을 통과시키는
#: 문턱은 없느니만 못하다.
MIN_PRE_PERIODS = 4

#: 기울기 차이가 이보다 작으면 "평행에 가깝다" 고 본다. 처치군 기울기에 대한
#: 상대값이다 — 절대값으로 잡으면 단위가 바뀔 때마다 문턱이 달라진다.
PARALLEL_TOLERANCE = 0.15


@dataclass
class PreTrend:
    """평행추세 판정."""

    n_pre: int
    treated_slope: float
    control_slope: float
    slope_gap: float
    #: 기울기 차이가 0 인지 검정한 p 값.
    p_value: float
    #: 처치군 기울기 대비 차이 비율. 크기를 볼 때 이걸 본다.
    relative_gap: float
    reasons: list[str] = field(default_factory=list)
    #: 검정력이 없어 통과한 것인지 실제로 평행한 것인지.
    underpowered: bool = False

    @property
    def parallel(self) -> bool:
        """문턱을 지났는가.

        **p 값 하나로 정하지 않는다.** 관측이 적으면 무엇이든 유의하지 않게 나오고,
        그 통과는 평행의 증거가 아니다.
        """
        if self.n_pre < MIN_PRE_PERIODS:
            return False
        if self.underpowered:
            return False
        return self.p_value >= 0.05 and abs(self.relative_gap) <= PARALLEL_TOLERANCE

    @property
    def verdict(self) -> str:
        if self.n_pre < MIN_PRE_PERIODS:
            return (f"판정 불가 — 사전 관측이 {self.n_pre}개다 "
                    f"(최소 {MIN_PRE_PERIODS}개). 두 점으로는 어떤 두 직선도 평행이다")
        if self.underpowered:
            return ("판정 불가 — 기울기 차이가 크지만 관측이 적어 유의하지 않다. "
                    "평행하다는 증거가 아니라 모른다는 뜻이다")
        if not self.parallel:
            return ("평행하지 않다 — 이 설계로는 캠페인과 원래 추세를 가를 수 없다. "
                    "**실패가 아니라 발견이다**")
        return "평행하다 — 효과 추정으로 넘어가도 된다"

    def __str__(self) -> str:
        return (f"사전 {self.n_pre}기 · 기울기 처치 {self.treated_slope:+.3f} / "
                f"대조 {self.control_slope:+.3f} (차이 {self.slope_gap:+.3f}, "
                f"상대 {self.relative_gap:+.1%}) p={self.p_value:.4f} — {self.verdict}")


def _slope(xs: list[float], ys: list[float]) -> tuple[float, float]:
    """최소제곱 기울기와 그 표준오차."""
    n = len(xs)
    mx = sum(xs) / n
    my = sum(ys) / n
    sxx = sum((x - mx) ** 2 for x in xs)
    if sxx == 0:
        return 0.0, float("inf")
    b = sum((x - mx) * (y - my) for x, y in zip(xs, ys)) / sxx
    a = my - b * mx
    resid = [y - (a + b * x) for x, y in zip(xs, ys)]
    if n <= 2:
        return b, float("inf")
    s2 = sum(r ** 2 for r in resid) / (n - 2)
    return b, (s2 / sxx) ** 0.5


def check(aligned: list[tuple[date, float, float]], intervention: date) -> PreTrend:
    """개입 **전** 구간에서 두 계열의 기울기를 견준다.

    Args:
        aligned: `analytics.external.series.align()` 의 결과 — (시점, 처치, 대조)
        intervention: 캠페인이 시작된 날. 이 날 **이전**만 쓴다
    """
    pre = [(d, t, c) for d, t, c in aligned if d < intervention]
    if not pre:
        return PreTrend(0, 0.0, 0.0, 0.0, 1.0, 0.0,
                        reasons=["개입 이전 관측이 없다"])

    origin = pre[0][0]
    xs = [float((d - origin).days) for d, _, _ in pre]
    t_slope, t_se = _slope(xs, [t for _, t, _ in pre])
    c_slope, c_se = _slope(xs, [c for _, _, c in pre])

    gap = t_slope - c_slope
    se = (t_se ** 2 + c_se ** 2) ** 0.5
    if se == 0:
        # 잔차가 0 이다 — 두 계열이 정확히 직선이라 기울기가 확정된다. 이때 p 를
        # 1.0 으로 두면 **명백한 발산을 "관측이 적어 못 가른 것" 으로 부르게 된다.**
        # 극한을 그대로 쓴다: 차이가 있으면 확실하고, 없으면 확실히 없다.
        p = 1.0 if gap == 0 else 0.0
    elif se == float("inf"):
        # 관측이 2개 이하거나 x 가 한 점에 몰렸다. 아무것도 못 잰다.
        p = 1.0
    else:
        # 자유도는 두 회귀에서 각각 n-2. 보수적으로 작은 쪽을 쓴다.
        p = float(2 * (1 - stats.t.cdf(abs(gap / se), df=max(1, len(pre) - 2))))

    rel = gap / abs(t_slope) if t_slope else (0.0 if gap == 0 else float("inf"))

    reasons: list[str] = []
    if len(pre) < MIN_PRE_PERIODS:
        reasons.append(f"사전 관측 {len(pre)}개 — 최소 {MIN_PRE_PERIODS}개가 필요하다")

    # **검정력 없는 통과를 잡는다.** 차이는 큰데 p 는 크다면 그건 평행의 증거가 아니다.
    underpowered = (p >= 0.05 and abs(rel) > PARALLEL_TOLERANCE)
    if underpowered:
        reasons.append(
            f"기울기 차이가 {rel:+.0%} 인데 p={p:.3f} 다 — 관측이 적어 못 가른 것이지 "
            f"평행한 게 아니다")

    return PreTrend(n_pre=len(pre), treated_slope=t_slope, control_slope=c_slope,
                    slope_gap=gap, p_value=p, relative_gap=rel,
                    reasons=reasons, underpowered=underpowered)


__all__ = ["MIN_PRE_PERIODS", "PARALLEL_TOLERANCE", "PreTrend", "check"]
