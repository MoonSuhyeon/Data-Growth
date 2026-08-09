"""A/B 테스트 통계 — 표본 수 산정, 배정, SRM, 유의성 검정.

**설계가 먼저다.** 표본 수를 정하지 않고 매일 결과를 들여다보면
유의하다는 결론이 우연히 나온다(peeking). 그래서 실험 시작 전에
MDE 와 필요 표본을 계산해 고정한다.

statsmodels 없이 scipy 만으로 구현한다. 수식이 코드에 드러나는 편이 낫다.
"""
from __future__ import annotations

import hashlib
from dataclasses import dataclass

from scipy import stats


# --------------------------------------------------------------- 표본 수 산정
def required_sample_size(
    baseline_rate: float,
    mde: float,
    alpha: float = 0.05,
    power: float = 0.80,
    two_sided: bool = True,
) -> int:
    """그룹당 필요한 표본 수.

    두 비율 비교의 표준 공식:

        n = (z_{α/2} · √(2·p̄·(1-p̄)) + z_β · √(p1(1-p1) + p2(1-p2)))² / (p2 - p1)²

    Args:
        baseline_rate: 대조군의 현재 전환율
        mde: 최소 검출 효과. **상대값**(0.10 = 10% 상대 개선)
    """
    if not 0 < baseline_rate < 1:
        raise ValueError("baseline_rate 는 0과 1 사이여야 한다")
    if mde <= 0:
        raise ValueError("mde 는 양수여야 한다")

    p1 = baseline_rate
    p2 = baseline_rate * (1 + mde)
    if p2 >= 1:
        raise ValueError("mde 가 너무 커서 전환율이 1을 넘는다")

    z_a = stats.norm.ppf(1 - alpha / 2) if two_sided else stats.norm.ppf(1 - alpha)
    z_b = stats.norm.ppf(power)
    pbar = (p1 + p2) / 2

    num = (z_a * (2 * pbar * (1 - pbar)) ** 0.5
           + z_b * (p1 * (1 - p1) + p2 * (1 - p2)) ** 0.5) ** 2
    return int((num / (p2 - p1) ** 2) + 0.999)


# ------------------------------------------------------------------ 배정
def assign(unit_id: str, experiment_id: str, variants: tuple[str, ...] = ("control", "treatment"),
           weights: tuple[float, ...] | None = None) -> str:
    """결정적 배정.

    같은 사용자는 **항상 같은 그룹**에 들어간다. 난수를 쓰면 재방문 시 그룹이
    바뀌어 실험이 오염된다. 해시를 쓰는 이유다.
    """
    if weights is None:
        weights = tuple(1 / len(variants) for _ in variants)
    if len(weights) != len(variants):
        raise ValueError("variants 와 weights 길이가 다르다")

    h = hashlib.md5(f"{experiment_id}:{unit_id}".encode("utf-8")).hexdigest()
    bucket = int(h[:8], 16) / 0xFFFFFFFF

    acc = 0.0
    total = sum(weights)
    for v, w in zip(variants, weights):
        acc += w / total
        if bucket < acc:
            return v
    return variants[-1]


# ------------------------------------------------------------------- SRM
@dataclass
class SRMResult:
    """Sample Ratio Mismatch — 배정 비율이 기대와 다른지."""

    observed: dict[str, int]
    expected: dict[str, float]
    chi_square: float
    p_value: float
    healthy: bool

    def __str__(self) -> str:
        state = "정상" if self.healthy else "이상 — 실험 결과를 신뢰할 수 없다"
        return f"SRM {state} (χ²={self.chi_square:.3f}, p={self.p_value:.4f})"


def check_srm(counts: dict[str, int], weights: dict[str, float] | None = None,
              alpha: float = 0.001) -> SRMResult:
    """카이제곱 적합도 검정.

    임계값을 0.001 로 잡는다. SRM 은 자주 일어나지 않아야 하고,
    걸리면 **결과 해석을 멈춰야** 하기 때문에 보수적으로 본다.
    """
    total = sum(counts.values())
    if weights is None:
        weights = {k: 1 / len(counts) for k in counts}
    exp = {k: total * weights[k] for k in counts}

    chi = sum((counts[k] - exp[k]) ** 2 / exp[k] for k in counts if exp[k] > 0)
    dof = len(counts) - 1
    p = float(1 - stats.chi2.cdf(chi, dof)) if dof > 0 else 1.0
    return SRMResult(counts, exp, float(chi), p, healthy=p >= alpha)


# -------------------------------------------------------------- 유의성 검정
@dataclass
class TestResult:
    control_n: int
    control_x: int
    treatment_n: int
    treatment_x: int
    control_rate: float
    treatment_rate: float
    absolute_lift: float
    relative_lift: float
    z: float
    p_value: float
    ci_low: float
    ci_high: float
    significant: bool

    def __str__(self) -> str:
        verdict = "유의함" if self.significant else "유의하지 않음"
        return (
            f"control {self.control_rate:.2%} → treatment {self.treatment_rate:.2%} "
            f"({self.relative_lift:+.1%}), p={self.p_value:.4f} {verdict} "
            f"[95% CI {self.ci_low:+.2%}, {self.ci_high:+.2%}]"
        )


def two_proportion_test(control_x: int, control_n: int,
                        treatment_x: int, treatment_n: int,
                        alpha: float = 0.05) -> TestResult:
    """이표본 비율 z 검정 + 절대 차이의 신뢰구간."""
    if control_n == 0 or treatment_n == 0:
        raise ValueError("표본 수가 0이다")

    p1, p2 = control_x / control_n, treatment_x / treatment_n
    pooled = (control_x + treatment_x) / (control_n + treatment_n)
    se_pool = (pooled * (1 - pooled) * (1 / control_n + 1 / treatment_n)) ** 0.5
    z = (p2 - p1) / se_pool if se_pool else 0.0
    p_value = float(2 * (1 - stats.norm.cdf(abs(z))))

    # 신뢰구간은 pooled 가 아니라 각 그룹 분산으로
    se_unpool = (p1 * (1 - p1) / control_n + p2 * (1 - p2) / treatment_n) ** 0.5
    zc = stats.norm.ppf(1 - alpha / 2)
    diff = p2 - p1

    return TestResult(
        control_n=control_n, control_x=control_x,
        treatment_n=treatment_n, treatment_x=treatment_x,
        control_rate=round(p1, 6), treatment_rate=round(p2, 6),
        absolute_lift=round(diff, 6),
        relative_lift=round(diff / p1, 6) if p1 else 0.0,
        z=round(float(z), 4), p_value=round(p_value, 6),
        ci_low=round(diff - zc * se_unpool, 6),
        ci_high=round(diff + zc * se_unpool, 6),
        significant=p_value < alpha,
    )


__all__ = [
    "SRMResult", "TestResult", "assign", "check_srm",
    "required_sample_size", "two_proportion_test",
]
