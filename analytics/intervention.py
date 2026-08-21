"""개입 효과 측정 — **평균 회귀와 진짜 효과를 가른다.**

`bank-transfer-demo/docs/multi-agent-orchestration.md` 의 A4·A5. 그 문서가 "이 연결의
진짜 값" 이라고 적은 부분이다.

## 왜 홀드아웃이 필요한가

수요가 **낮게 예측된** 숙소·날짜를 골라 개입하면, 그 단위들은 다음에 채워진다.
개입 때문이 아니라 **평균 회귀** 때문에.

예측에 오차가 있는 상태에서 "예측이 가장 낮은 것" 을 고르면 그 표본은 **음의 예측
오차 쪽으로 편향된 집합**이다. 아무것도 안 해도 실적이 예측보다 높게 나온다. 그걸
개입 효과로 읽으면 에이전트는 **항상 성공한 것처럼 보인다.**

항상 성공하는 지표는 항상 울리는 SRM 경보와 같은 운명이다 — 무시되고, 그러면 진짜
실패도 안 보인다.

그래서 자격이 있는 후보 중 **일부를 일부러 손대지 않는다.** 그 홀드아웃과 견줘야
"개입 때문" 과 "원래 올라갔을 것" 이 갈린다.

## 배정 단위와 간섭

단위는 ``property × stay_date`` 다. 여기에는 알려진 함정이 있다 — A 숙소를 할인하면
옆 B 숙소의 예약을 뺏어올 수 있고, 그러면 홀드아웃이 오염된다(SUTVA 위반). 지역
단위로 배정하면 간섭은 줄지만 표본이 확 줄어 검정력이 떨어진다.

**정답이 없는 트레이드오프다.** 여기서는 단위를 잘게 잡고, 그 선택을 숨기지 않는다.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from pathlib import Path
from statistics import fmean

from scipy import stats

from analytics.experiments.stats import assign, check_srm

#: 홀드아웃 배정에 쓰는 실험 ID. `assign()` 이 결정적이므로 같은 단위는 늘 같은 군이다.
HOLDOUT_EXPERIMENT = "intervention_holdout"

#: 배정 규칙의 골든 벡터. **같은 파일이 bank-transfer-demo 에도 있다.**
#:
#: 배정은 조정자가 하고(`app/orchestration/coordinator.py`) 효과는 여기서 잰다.
#: 두 쪽이 어긋나면 한 단위가 저기선 개입군, 여기선 대조군이 되고 그러면 두 숫자
#: 모두 뜻을 잃는다. 커밋된 `openapi.json` 을 CI 가 대조하는 것과 같은 방식으로,
#: 양쪽 테스트가 각자 이 파일을 검사한다.
HOLDOUT_VECTORS = Path(__file__).with_name("holdout_vectors.json")

#: 기본 홀드아웃 비율. 손대지 않는 쪽이 비쌀수록 낮추고 싶어지지만, 너무 낮추면
#: 견줄 표본이 모자라 결론이 안 난다.
DEFAULT_HOLDOUT_RATE = 0.3


@dataclass
class UnitOutcome:
    """개입 후보 한 단위의 결과."""

    unit_id: str
    #: 모델이 본 값. **이걸 기준으로 후보를 골랐다** — 그래서 편향돼 있다.
    predicted: float
    #: 실제로 일어난 값.
    actual: float
    treated: bool
    #: 다른 도메인이 이 단위를 흔들었나 — 상담 취소로 재고가 바뀐 경우 등.
    #:
    #: bank-transfer-demo 의 `Interference` 가 남기는 사실이다. 흔들린 단위는
    #: 점유율이 움직여도 그중 얼마가 개입 때문인지 갈 수 없다.
    disturbed: bool = False

    @property
    def lift_vs_prediction(self) -> float:
        """예측 대비 실적. **이걸 효과라고 부르면 안 된다.**"""
        return self.actual - self.predicted


def split(unit_ids: list[str], holdout_rate: float = DEFAULT_HOLDOUT_RATE,
          experiment_id: str = HOLDOUT_EXPERIMENT) -> dict[str, bool]:
    """단위를 개입군과 홀드아웃으로 가른다.

    Returns:
        ``unit_id`` → 개입 대상인가

    난수가 아니라 **결정적 해시**다. 난수를 쓰면 같은 단위가 회차마다 다른 군에
    들어가고, 그러면 한 단위의 결과가 두 군에 흩어진다.
    """
    if not 0.0 < holdout_rate < 1.0:
        raise ValueError("holdout_rate 는 0 과 1 사이여야 한다 — 전부 개입하면 견줄 게 없다")
    weights = (holdout_rate, 1 - holdout_rate)
    return {
        u: assign(u, experiment_id, variants=("holdout", "treated"), weights=weights) == "treated"
        for u in unit_ids
    }


@dataclass
class Effect:
    """개입 효과. **두 가지 추정을 나란히 둔다** — 그 차이가 이 파일의 요점이다."""

    treated_n: int
    holdout_n: int
    treated_actual: float
    holdout_actual: float
    treated_predicted: float
    holdout_predicted: float
    srm_healthy: bool
    #: 흔들려서 뺀 단위 수. 0 이 아니면 이 숫자가 어디서 나왔는지 밝혀야 한다.
    disturbed_n: int = 0
    #: 홀드아웃 대비 차이의 p 값과 95% 신뢰구간. **차이만 내놓으면 안 된다** —
    #: +0.004 가 0 인지 작은 실효과인지 구분이 안 되고, 그 구분 없이 쓴 문장은
    #: 계산보다 세진다.
    p_value: float = 1.0
    ci_low: float = 0.0
    ci_high: float = 0.0
    alpha: float = 0.05
    srm_detail: str = ""
    notes: list[str] = field(default_factory=list)

    @property
    def naive_lift(self) -> float:
        """**틀린 추정.** 개입군의 실적을 그 예측과 견준 값.

        후보를 "예측이 낮은 것" 으로 골랐으므로 이 값은 개입이 없어도 양수가 된다.
        홀드아웃이 없으면 이게 유일하게 낼 수 있는 숫자이고, 그래서 홀드아웃이 없는
        측정은 언제나 성공을 보고한다.
        """
        return self.treated_actual - self.treated_predicted

    @property
    def holdout_lift(self) -> float:
        """홀드아웃도 같은 편향을 겪는다. 그 크기가 **평균 회귀분**이다."""
        return self.holdout_actual - self.holdout_predicted

    @property
    def true_lift(self) -> float:
        """개입군과 홀드아웃의 차이. 편향이 양쪽에 같이 걸리므로 상쇄된다."""
        return self.treated_actual - self.holdout_actual

    @property
    def overstated_by(self) -> float:
        """순진한 추정이 진짜보다 얼마나 부풀었나."""
        return self.naive_lift - self.true_lift

    @property
    def significant(self) -> bool:
        """0 을 구간 밖으로 밀어냈는가.

        `readable` 과 다른 질문이다. 읽을 수 없으면 유의성을 따질 자격이 없고,
        읽을 수 있는데 유의하지 않으면 **"효과 없음"이 아니라 "모르겠음"** 이다.
        """
        return self.readable and self.p_value < self.alpha

    @property
    def readable(self) -> bool:
        """배정이 틀어졌으면 두 군의 차이를 개입 때문이라 할 수 없다."""
        return self.srm_healthy

    def __str__(self) -> str:
        if not self.readable:
            return f"읽을 수 없음 — {self.srm_detail}"
        verdict = "유의함" if self.significant else "유의하지 않음 — 효과를 주장할 수 없다"
        return (f"홀드아웃 대비 {self.true_lift:+.4f} "
                f"[95% CI {self.ci_low:+.4f}, {self.ci_high:+.4f}] p={self.p_value:.4f} {verdict} · "
                f"순진한 추정 {self.naive_lift:+.4f} ({self.overstated_by:+.4f} 만큼 부풀었다)")


def measure(outcomes: list[UnitOutcome],
            holdout_rate: float = DEFAULT_HOLDOUT_RATE,
            alpha: float = 0.05,
            srm_alpha: float = 0.001,
            drop_disturbed: bool = True) -> Effect:
    """홀드아웃과 견줘 효과를 낸다.

    **SRM 을 먼저 본다.** 배정이 틀어졌으면 두 군의 차이가 개입 때문인지 알 수 없다 —
    실험에서 쓰는 순서를 그대로 가져온다.

    ``holdout_rate`` 는 `split()` 에 준 것과 같아야 한다. 다르면 멀쩡한 배정을
    SRM 이 이상하다고 부른다 — 기대 비율이 틀린 것이지 배정이 틀린 게 아니다.

    ``drop_disturbed`` 는 **공짜가 아니다.** 흔들린 단위를 버리면 표본이 깨끗해지는
    대신 무작위 배정이 깨진다 — 버리는 기준(흔들렸나)이 개입과 상관있으면 남은
    두 군은 더 이상 비교 가능하지 않다. 그래서 버리기 전에 **군별 흔들림 비율을
    먼저 본다.**
    """
    notes: list[str] = []

    disturbed = [o for o in outcomes if o.disturbed]
    if disturbed:
        d_treated = sum(1 for o in disturbed if o.treated)
        n_treated = sum(1 for o in outcomes if o.treated)
        n_holdout = len(outcomes) - n_treated
        rate_t = d_treated / n_treated if n_treated else 0.0
        rate_h = (len(disturbed) - d_treated) / n_holdout if n_holdout else 0.0
        notes.append(
            f"흔들린 단위 {len(disturbed)}개 — 개입군 {rate_t:.1%}, 홀드아웃 {rate_h:.1%}")
        # 한쪽에 몰렸으면 버리는 것 자체가 편향이다. 개입이 취소를 유발했다면
        # 그건 효과가 아니라 부작용이고, 그 단위를 빼면 부작용이 사라진 것처럼 보인다.
        if abs(rate_t - rate_h) > 0.05:
            notes.append(
                "흔들림이 한쪽에 몰렸다 — 버리면 무작위 배정이 깨진다. "
                "개입이 흔들림을 유발했을 수 있고, 그렇다면 그건 효과가 아니라 부작용이다")
        if drop_disturbed:
            outcomes = [o for o in outcomes if not o.disturbed]

    treated = [o for o in outcomes if o.treated]
    holdout = [o for o in outcomes if not o.treated]

    if not treated or not holdout:
        return Effect(
            treated_n=len(treated), holdout_n=len(holdout),
            disturbed_n=len(disturbed),
            treated_actual=0.0, holdout_actual=0.0,
            treated_predicted=0.0, holdout_predicted=0.0,
            srm_healthy=False, notes=notes,
            srm_detail="한쪽 군이 비어 있다 — 견줄 대상이 없다",
        )

    srm = check_srm({"holdout": len(holdout), "treated": len(treated)},
                    weights={"holdout": holdout_rate, "treated": 1 - holdout_rate},
                    alpha=srm_alpha)

    if len(holdout) < 30:
        # 판정하지 않는다는 뜻이 아니라, 결론의 강도를 낮춰야 한다는 뜻이다.
        notes.append(f"홀드아웃이 {len(holdout)}개뿐이다 — 차이가 우연일 수 있다")

    # Welch 의 t 검정. 두 군의 분산이 같다고 가정하지 않는다 — 개입이 결과를
    # 올리기만 하는 게 아니라 **퍼뜨리는** 경우가 흔하고(어떤 숙소엔 듣고 어떤
    # 숙소엔 안 듣는다), 그때 등분산 가정은 구간을 실제보다 좁게 만든다.
    t_stat, p_value = stats.ttest_ind([o.actual for o in treated],
                                      [o.actual for o in holdout],
                                      equal_var=False)
    diff = fmean(o.actual for o in treated) - fmean(o.actual for o in holdout)
    se = abs(diff / t_stat) if t_stat else float("inf")
    crit = stats.norm.ppf(1 - alpha / 2)

    return Effect(
        treated_n=len(treated), holdout_n=len(holdout),
        disturbed_n=len(disturbed),
        treated_actual=fmean(o.actual for o in treated),
        holdout_actual=fmean(o.actual for o in holdout),
        treated_predicted=fmean(o.predicted for o in treated),
        holdout_predicted=fmean(o.predicted for o in holdout),
        p_value=float(p_value), ci_low=diff - crit * se, ci_high=diff + crit * se,
        alpha=alpha,
        srm_healthy=srm.healthy, srm_detail=str(srm), notes=notes,
    )


__all__ = ["DEFAULT_HOLDOUT_RATE", "Effect", "HOLDOUT_EXPERIMENT", "HOLDOUT_VECTORS",
           "UnitOutcome", "measure", "split"]
