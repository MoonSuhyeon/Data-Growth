"""부분군 효과(HTE) — **미리 적어 둔 축으로만 쪼갠다.**

E7. `preregistration.py` 가 만든 문턱 위에 올라간다.

## 왜 게이트가 필요한가

"모바일에서 특히 효과가 컸다" 는 문장은 두 가지 중 하나다.

- 미리 볼 축으로 정해 뒀고, 봤더니 그랬다 → **발견**
- 전체가 유의하지 않아서 이것저것 쪼개 보다 찾았다 → **HARKing**

결과만 보면 두 문장은 똑같이 생겼다. 구분은 **언제 정했는가**에만 있고, 그래서
사전등록 파일이 먼저 있어야 한다. 여기서는 등록되지 않은 축으로 쪼개는 것을
**막는다** — 경고가 아니라 거절이다. 경고는 무시되고, 무시된 경고는 없는 것과 같다.

## 그리고 쪼개면 세 가지가 한꺼번에 나빠진다

### 1. 다중성

축이 두 개면 그중 하나가 우연히 유의할 확률이 올라간다. 사전등록의
`[multiplicity]` 가 정한 보정을 그대로 쓴다 — 여기서 새로 정하지 않는다.

### 2. 검정력

사전등록의 `required_per_group` 은 **전체** 검정을 위해 계산된 수다. 4개 부분군으로
쪼개면 각 군은 그 1/4 이고, 그러면 정해 둔 MDE 를 잡을 수 없다.

이때 "그 부분군에서는 효과가 없었다" 고 쓰면 **틀린 문장이다.** 맞는 문장은
**"그 부분군에서는 알 수 없었다"** 다. 둘을 구분하지 않는 것이 부분군 분석이
욕먹는 가장 큰 이유다.

### 3. 승자의 저주

부분군 중 **가장 큰 효과**를 골라 보고하면 그 값은 위로 편향돼 있다. 효과가 전부
같아도 표본 오차 때문에 어딘가는 크게 나오고, 그 어딘가를 고르는 행위가 곧 선택
편향이다. `intervention.py` 의 평균 회귀와 같은 뿌리다.

그래서 최댓값을 **그대로 내놓지 않고** 그렇게 골랐다는 사실을 달아 보낸다.
"""
from __future__ import annotations

from dataclasses import dataclass, field

from analytics.experiments.stats import check_srm, two_proportion_test
from analytics.preregistration import Prereg, adjusted_alpha


@dataclass
class SegmentEffect:
    """한 부분군의 효과."""

    key: str
    control_n: int
    control_x: int
    treatment_n: int
    treatment_x: int
    relative_lift: float
    p_value: float
    ci_low: float
    ci_high: float
    srm_healthy: bool
    srm_detail: str
    #: 이 부분군이 사전등록의 MDE 를 잡을 만큼 큰가.
    powered: bool
    required_per_group: int
    alpha: float

    @property
    def significant(self) -> bool:
        """배정이 성한 상태에서 보정된 α 를 넘었는가.

        검정력은 여기 안 들어간다 — 작은 표본에서도 유의할 수 있다. 검정력이
        막는 것은 **유의하지 않을 때의 결론**이다.
        """
        return self.srm_healthy and self.p_value < self.alpha

    @property
    def verdict(self) -> str:
        """**"효과 없음" 과 "모름" 을 구분한다.** 이 구분이 이 모듈의 요점이다."""
        if not self.srm_healthy:
            return "읽을 수 없음 — 이 부분군의 배정이 틀어졌다"
        if self.significant:
            return "효과 있음"
        if not self.powered:
            return (f"모름 — 표본이 {min(self.control_n, self.treatment_n):,}명으로 "
                    f"계획({self.required_per_group:,}명)에 못 미친다")
        return "효과 없음"

    def __str__(self) -> str:
        return (f"{self.key:12} {self.relative_lift:+7.1%} "
                f"[{self.ci_low:+.2%}, {self.ci_high:+.2%}] p={self.p_value:.4f} "
                f"n={self.control_n}/{self.treatment_n} — {self.verdict}")


@dataclass
class HTEReport:
    dimension: str
    alpha: float
    #: 보정 전 α. 두 값을 나란히 둬야 왜 문턱이 높아졌는지 읽힌다.
    raw_alpha: float
    segments: list[SegmentEffect] = field(default_factory=list)
    blocked: str = ""
    notes: list[str] = field(default_factory=list)

    @property
    def readable(self) -> bool:
        return not self.blocked

    @property
    def largest(self) -> SegmentEffect | None:
        """효과가 가장 큰 부분군. **그대로 인용하면 안 된다.**

        `winners_curse_note` 를 같이 읽어야 한다.
        """
        usable = [s for s in self.segments if s.srm_healthy]
        return max(usable, key=lambda s: s.relative_lift) if usable else None

    @property
    def winners_curse_note(self) -> str:
        top = self.largest
        if top is None or len(self.segments) < 2:
            return ""
        return (f"{len(self.segments)}개 부분군 중 가장 큰 값을 골랐다 — "
                f"효과가 전부 같아도 어딘가는 크게 나온다. "
                f"{top.key} 의 {top.relative_lift:+.1%} 는 위로 편향된 추정이다")

    def __str__(self) -> str:
        if self.blocked:
            return f"차단 — {self.blocked}"
        head = (f"{self.dimension} 별 효과 ({len(self.segments)}개 부분군, "
                f"α {self.raw_alpha} → {self.alpha})")
        return head + "\n" + "\n".join(f"  {s}" for s in self.segments)


def estimate(counts: dict[str, dict[str, tuple[int, int]]], prereg: Prereg,
             by: str, srm_alpha: float | None = None) -> HTEReport:
    """부분군별 효과를 낸다.

    Args:
        counts: ``{부분군: {"control": (전환, 노출), "treatment": (전환, 노출)}}``
        prereg: 사전등록. **여기 없는 축은 거절한다**
        by: 쪼갤 축

    사전등록이 정한 것을 여기서 다시 정하지 않는다 — α, 보정, 필요 표본 전부
    파일에서 읽는다. 코드에 적으면 결과를 보고 고칠 수 있게 되고, 그러면 사전등록이
    사전등록이 아니다.
    """
    raw = float(prereg.primary.get("alpha", 0.05))

    # ── 게이트. **경고가 아니라 거절이다.**
    if by not in prereg.segment_names:
        registered = ", ".join(sorted(prereg.segment_names)) or "(없음)"
        return HTEReport(
            dimension=by, alpha=raw, raw_alpha=raw,
            blocked=(f"'{by}' 는 사전등록에 없는 축이다 — 등록된 축: {registered}. "
                     f"여기 없는 축으로 쪼갠 결과는 발견이 아니라 사후 해석이다"),
        )

    alpha = adjusted_alpha(prereg)
    required = int(prereg.design.get("required_per_group", 0))
    notes: list[str] = []
    if alpha < raw:
        notes.append(f"부분군 {len(prereg.segment_names)}개를 보므로 "
                     f"α 를 {raw} → {alpha} 로 낮췄다")

    segments: list[SegmentEffect] = []
    for key in sorted(counts):
        c_x, c_n = counts[key]["control"]
        t_x, t_n = counts[key]["treatment"]
        if c_n == 0 or t_n == 0:
            notes.append(f"{key}: 한쪽 군이 비어 있어 건너뛴다")
            continue

        srm = check_srm({"control": c_n, "treatment": t_n},
                        alpha=srm_alpha if srm_alpha is not None else 0.001)
        test = two_proportion_test(c_x, c_n, t_x, t_n, alpha=alpha)

        segments.append(SegmentEffect(
            key=key, control_n=c_n, control_x=c_x, treatment_n=t_n, treatment_x=t_x,
            relative_lift=test.relative_lift, p_value=test.p_value,
            ci_low=test.ci_low, ci_high=test.ci_high,
            srm_healthy=srm.healthy, srm_detail=str(srm),
            powered=min(c_n, t_n) >= required, required_per_group=required,
            alpha=alpha,
        ))

    underpowered = [s.key for s in segments if not s.powered]
    if underpowered:
        notes.append(
            f"표본이 계획에 못 미치는 부분군: {', '.join(underpowered)} — "
            f"여기서 유의하지 않은 것은 '효과 없음' 이 아니라 '모름' 이다")

    return HTEReport(dimension=by, alpha=alpha, raw_alpha=raw,
                     segments=segments, notes=notes)


__all__ = ["HTEReport", "SegmentEffect", "estimate"]
