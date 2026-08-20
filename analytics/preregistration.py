"""사전등록과 규칙 검사기.

**이 파일에는 LLM 이 없다.** 그게 요점이다.

`docs/readout-review.md` 가 정리한 대로, 결과 검토에서 규칙으로 잡을 수 있는 것은
규칙이 잡아야 한다 — 표본이 계획치에 닿았는가, SRM 을 먼저 봤는가, 사전등록에 없던
부분군을 보고했는가, 지표를 여럿 보면서 보정을 안 했는가. 전부 산술이고 비교다.
언어 모델은 여기서 할 일이 없고, 넣으면 결정적이던 검사가 비결정적이 된다.

모델이 값을 하는 자리는 **그 다음 층**이다 — 사람이 쓴 판독문이 계산보다 센 주장을
하는지 보는 것. 그건 이 파일이 통과시킨 뒤에 온다.

검사기는 보고서가 아니라 **게이트**다. `readable` 이 거짓이면 전환율을 읽지 않는다.
"""
from __future__ import annotations

import tomllib
from dataclasses import dataclass, field
from datetime import date, datetime
from enum import Enum
from pathlib import Path

PREREG_DIR = Path(__file__).resolve().parents[1] / "preregistrations"


class Level(str, Enum):
    #: 결론을 읽으면 안 된다.
    BLOCK = "BLOCK"
    #: 읽되 결론의 강도를 낮춰야 한다.
    WEAKEN = "WEAKEN"
    #: 알아두면 되는 것.
    NOTE = "NOTE"


@dataclass
class Violation:
    rule: str
    level: Level
    detail: str

    def __str__(self) -> str:
        return f"[{self.level.value}] {self.rule} — {self.detail}"


@dataclass
class Prereg:
    """사전등록된 주장. **읽기만 한다** — 여기에 쓰기 메서드를 두지 않는다."""

    id: str
    kind: str
    registered_at: date
    hypothesis: str
    primary: dict
    design: dict
    gates: dict
    segments: list[dict] = field(default_factory=list)
    multiplicity: dict = field(default_factory=dict)

    @property
    def is_prospective(self) -> bool:
        return self.kind == "prospective"

    @property
    def segment_names(self) -> set[str]:
        return {s["name"] for s in self.segments}


def load(name: str, root: Path | None = None) -> Prereg:
    path = (root or PREREG_DIR) / f"{name}.toml"
    if not path.exists():
        raise FileNotFoundError(f"사전등록이 없다: {path}")
    d = tomllib.loads(path.read_text(encoding="utf-8"))

    registered = d["registered_at"]
    if isinstance(registered, str):
        registered = datetime.fromisoformat(registered).date()
    elif isinstance(registered, datetime):
        registered = registered.date()

    return Prereg(
        id=d["id"], kind=d.get("kind", "prospective"), registered_at=registered,
        hypothesis=d.get("hypothesis", "").strip(),
        primary=d.get("primary", {}), design=d.get("design", {}),
        gates=d.get("gates", {}), segments=d.get("segments", []),
        multiplicity=d.get("multiplicity", {}),
    )


@dataclass
class Result:
    """이번에 잰 것. 검사기가 사전등록과 대조할 재료다."""

    exposed: dict[str, int]
    srm_healthy: bool
    srm_checked: bool = True
    #: 판독문이 실제로 보고한 부분군. 사전등록에 없으면 사후 해석이다.
    reported_segments: set[str] = field(default_factory=set)
    #: 유의성을 주장한 지표 수. 하나를 넘으면 보정이 필요하다.
    tested_metrics: int = 1
    #: 데이터가 시작된 날. 사전등록이 이보다 뒤면 사전등록이 아니다.
    data_starts: date | None = None
    #: 전환율을 이미 읽었는가. 순서 위반을 잡기 위한 값이다.
    conversion_read: bool = False


@dataclass
class Verdict:
    violations: list[Violation] = field(default_factory=list)

    @property
    def readable(self) -> bool:
        """결론을 읽어도 되는가. **BLOCK 이 하나라도 있으면 안 된다.**"""
        return not any(v.level is Level.BLOCK for v in self.violations)

    @property
    def strength(self) -> str:
        if not self.readable:
            return "읽을 수 없음"
        if any(v.level is Level.WEAKEN for v in self.violations):
            return "약함"
        return "보통"

    def __str__(self) -> str:
        if not self.violations:
            return "위반 없음 — 계획대로다"
        return f"{self.strength} · 위반 {len(self.violations)}건: " + \
            " / ".join(v.rule for v in self.violations)


def check(prereg: Prereg, result: Result) -> Verdict:
    """사전등록과 결과를 대조한다. 전부 산술이고 비교다 — 판단이 아니다."""
    v: list[Violation] = []

    # ── 사전성. 데이터를 본 뒤에 쓴 등록은 사전등록이 아니다.
    if result.data_starts and prereg.registered_at > result.data_starts:
        if prereg.is_prospective:
            v.append(Violation(
                "사전성", Level.BLOCK,
                f"등록일({prereg.registered_at})이 데이터 시작({result.data_starts})보다 "
                f"뒤인데 prospective 로 선언돼 있다. 그건 사전등록이 아니다.",
            ))
        else:
            v.append(Violation(
                "사전성", Level.WEAKEN,
                "소급 분석이다. 결론은 '이 설계로 볼 수 있는 것' 까지만 말해야 한다.",
            ))

    # ── SRM. 배정이 틀어졌으면 전환율은 처치 효과가 아니다.
    if prereg.gates.get("read_conversion_only_if_srm_healthy", True):
        if not result.srm_checked:
            v.append(Violation("SRM 미확인", Level.BLOCK,
                               "배정 검사를 안 한 채로는 전환율을 해석할 수 없다."))
        elif not result.srm_healthy:
            v.append(Violation("SRM 위반", Level.BLOCK,
                               "배정이 틀어졌다. 전환율 차이가 처치 때문인지 알 수 없다."))
        elif result.conversion_read and not result.srm_checked:
            v.append(Violation("순서 위반", Level.BLOCK,
                               "SRM 을 보기 전에 전환율을 읽었다."))

    # ── 표본. 계획치에 못 미치면 결론이 아니라 중간 확인이다.
    need = int(prereg.design.get("required_per_group", 0))
    if need:
        short = {g: n for g, n in result.exposed.items() if n < need}
        if short:
            worst = min(short.values())
            v.append(Violation(
                "표본 부족", Level.WEAKEN,
                f"계획 {need:,}명/군인데 최소 {worst:,}명이다. "
                f"멈추는 규칙대로라면 아직 결론을 내지 않는다.",
            ))

    # ── 사후 해석. 등록에 없던 축으로 쪼갠 결과를 보고했는가.
    extra = result.reported_segments - prereg.segment_names
    if extra:
        v.append(Violation(
            "사후 부분군", Level.WEAKEN,
            f"사전등록에 없는 축을 보고했다: {', '.join(sorted(extra))}. "
            f"등록된 축은 {', '.join(sorted(prereg.segment_names)) or '없음'}.",
        ))

    # ── 다중비교. 여럿을 보면 그중 하나가 유의할 확률이 올라간다.
    if result.tested_metrics > 1 and not prereg.multiplicity.get("correction"):
        alpha = float(prereg.primary.get("alpha", 0.05))
        inflated = 1 - (1 - alpha) ** result.tested_metrics
        v.append(Violation(
            "다중비교 미보정", Level.WEAKEN,
            f"지표 {result.tested_metrics}개를 α={alpha} 로 검정했다. "
            f"적어도 하나가 우연히 유의할 확률이 {inflated:.1%} 다.",
        ))

    return Verdict(violations=v)


def adjusted_alpha(prereg: Prereg) -> float:
    """보정 후 α. 부분군을 볼 때 쓴다.

    본페로니는 보수적이지만 **설명할 수 있다** — 그게 대시보드에서 중요하다.
    """
    alpha = float(prereg.primary.get("alpha", 0.05))
    if prereg.multiplicity.get("correction") != "bonferroni":
        return alpha
    k = max(1, int(prereg.multiplicity.get("family_size", 1)))
    return round(alpha / k, 6)


__all__ = [
    "Level", "PREREG_DIR", "Prereg", "Result", "Verdict", "Violation",
    "adjusted_alpha", "check", "load",
]
