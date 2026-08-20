"""판독문 생성 — 계산된 판정을 문장으로 옮긴다.

**판정을 바꾸지 않는다.** 이 파일이 하는 일은 번역이지 판단이 아니다. p값도,
효과 크기도, 통과 여부도 전부 `stats.py` 와 `preregistration.py` 가 정한 값을
그대로 받아 적는다. 여기서 한 자리라도 다르게 쓰면 화면과 계산이 갈라지고,
그때부터 어느 쪽이 맞는지 물을 방법이 없다.

**왜 사람이 안 쓰고 여기서 만드는가.** 다음 층(감사관)이 대조할 대상이 필요하기
때문이다. 사람이 매번 자유롭게 쓰면 "무엇과 견줄 것인가" 가 매번 달라진다. 여기서
**구조가 정해진 판독문**을 만들어 두면, 사람이 덧붙인 해석과 계산이 보장하는 부분을
갈라 볼 수 있다.
"""
from __future__ import annotations

from dataclasses import dataclass, field

from analytics.preregistration import Level, Prereg, Verdict


@dataclass
class Readout:
    """판독문. 계산이 보장하는 부분과 사람이 덧붙인 부분을 **나눠서** 들고 다닌다."""

    experiment_id: str
    #: 계산이 보장하는 문장들. 감사관이 이 부분은 건드릴 이유가 없다.
    facts: list[str] = field(default_factory=list)
    #: 설계가 허락하는 결론의 강도.
    strength: str = "보통"
    #: 읽어도 되는가. 거짓이면 아래 결론은 비어 있어야 한다.
    readable: bool = True
    #: 사람이 덧붙인 해석. **감사 대상은 여기다.**
    interpretation: str = ""

    def text(self) -> str:
        body = "\n".join(f"- {f}" for f in self.facts)
        out = f"# {self.experiment_id}\n\n{body}\n\n결론의 강도: {self.strength}"
        if self.interpretation:
            out += f"\n\n## 해석\n{self.interpretation}"
        return out


def _pct(x: float) -> str:
    return f"{x:.2%}"


def generate(prereg: Prereg, verdict: Verdict, *,
             control_rate: float | None = None,
             treatment_rate: float | None = None,
             relative_lift: float | None = None,
             p_value: float | None = None,
             significant: bool | None = None,
             exposed: dict[str, int] | None = None,
             interpretation: str = "") -> Readout:
    """계산 결과를 문장으로. **받은 값을 그대로 적는다.**

    반올림도 하지 않는다 — 표시용 반올림이 판정용 값과 달라지면, 화면의 4.9% 와
    계산의 5.01% 중 어느 것이 기준인지 아무도 모르게 된다.
    """
    facts: list[str] = [
        f"가설: {prereg.hypothesis.strip().splitlines()[0]}",
        f"주 지표: {prereg.primary.get('metric')} "
        f"(MDE {prereg.primary.get('mde')} · α {prereg.primary.get('alpha')})",
        f"등록 종류: {prereg.kind}",
    ]

    if exposed:
        need = prereg.design.get("required_per_group")
        got = ", ".join(f"{k} {v:,}" for k, v in exposed.items())
        facts.append(f"노출: {got} (계획 {need:,}/군)" if need else f"노출: {got}")

    if verdict.violations:
        for v in verdict.violations:
            facts.append(f"{v.level.value}: {v.rule} — {v.detail}")
    else:
        facts.append("사전등록 위반 없음")

    if not verdict.readable:
        # **결론을 적지 않는다.** 막힌 결과에 숫자를 같이 실으면 읽는 사람은 결국
        # 그 숫자를 쓴다. 무엇 때문에 막혔는지만 남긴다.
        blocked = ", ".join(v.rule for v in verdict.violations if v.level is Level.BLOCK)
        facts.append(f"결론을 읽지 않는다 ({blocked})")
        return Readout(prereg.id, facts, verdict.strength, readable=False,
                       interpretation=interpretation)

    if control_rate is not None and treatment_rate is not None:
        facts.append(f"대조 {_pct(control_rate)} → 처치 {_pct(treatment_rate)}")
    if relative_lift is not None:
        facts.append(f"상대 변화 {relative_lift:+.1%}")
    if p_value is not None:
        verd = "유의함" if significant else "유의하지 않음"
        facts.append(f"p={p_value:.4f} — {verd}")

    return Readout(prereg.id, facts, verdict.strength, readable=True,
                   interpretation=interpretation)


__all__ = ["Readout", "generate"]
