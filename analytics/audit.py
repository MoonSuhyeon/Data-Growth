"""판독문 감사 — **모델은 의심만 올리고, 해소는 못 한다.**

`preregistration.py` 가 규칙으로 잡을 수 있는 것을 이미 잡았다. 여기서 보는 건
규칙이 못 읽는 것 하나다 — **사람이 쓴 문장이 계산이 지지하는 것보다 센가.**

## 왜 모델이 판정을 못 하게 구조로 막는가

모델에게 사전등록과 p값을 둘 다 주면, 시키지 않아도 p값에 의견을 낸다. 자유 산문을
받아 놓고 "판정하지 마" 라고 프롬프트로 막는 건 약하다. 출력을 ``Flag`` 로 제약하면
**원해도 유의성 판정을 낼 수 없다** — 낼 자리가 없기 때문이다.

## 단방향 게이트

    "못 믿겠다"      → 막는다. 사람이 답해야 한다.
    "괜찮아 보인다"   → 아무 효력이 없다. 아무것도 열리지 않는다.

비대칭이 요점이다. 거짓 플래그의 비용은 사람이 한 번 더 보는 것이고, 거짓 통과의
비용은 틀린 결론으로 결정하는 것이다. 환각의 손해가 싼 쪽으로만 흐르게 한다.

## 키가 없으면

``HeuristicAuditor`` 가 돈다. 규칙으로 잡히는 **부분집합**만 잡는다 — 등록에 없는
축 이름이 문장에 나오는가, 인과를 단정하는 어휘를 썼는가. 모델이 하는 일을 다
대신하지 못하고, **그 사실을 숨기지 않는다**(``backend`` 필드가 무엇이 돌았는지 밝힌다).
"""
from __future__ import annotations

import os
import re
from dataclasses import dataclass, field
from enum import Enum
from typing import Protocol

from analytics.preregistration import Prereg
from analytics.readout import Readout


class FlagClass(str, Enum):
    """감사관이 낼 수 있는 것의 **전부**. 여기 없는 말은 못 한다."""

    HYPOTHESIS_MISMATCH = "HYPOTHESIS_MISMATCH"   # 가설과 다른 지표를 결론으로
    POST_HOC_SEGMENT = "POST_HOC_SEGMENT"         # 등록에 없던 부분군을 강조
    CAUSAL_OVERREACH = "CAUSAL_OVERREACH"         # 설계가 지지하지 않는 인과 단정
    EXTERNAL_CONFOUND = "EXTERNAL_CONFOUND"       # 기간에 겹친 외부 사건


@dataclass(frozen=True)
class Flag:
    """의심 하나.

    **구조가 곧 제약이다.** 판정을 담을 필드가 없으므로 감사관은 "유의하다/아니다"
    를 말할 수 없다. 어느 문장이 왜 걸리는지만 말한다.
    """

    flag_class: FlagClass
    quoted_span: str      # 문제가 된 **원문 그대로**. 요약하면 확인할 수 없다
    why: str

    def __str__(self) -> str:
        return f"[{self.flag_class.value}] “{self.quoted_span}” — {self.why}"


class Auditor(Protocol):
    backend: str

    def audit(self, prereg: Prereg, readout: Readout) -> list[Flag]:
        ...


#: 설계가 관측뿐인데 원인을 단정하는 어휘. 완전한 목록이 아니다 — 그래서 모델이 있다.
CAUSAL_WORDS = ("때문에", "덕분에", "로 인해", "때문이다", "가 올렸다", "가 높였다",
                "효과로", "야기", "초래")


class HeuristicAuditor:
    """키가 없을 때 도는 대체. **부분집합만 잡는다.**"""

    backend = "heuristic"

    def audit(self, prereg: Prereg, readout: Readout) -> list[Flag]:
        text = readout.interpretation or ""
        flags: list[Flag] = []
        if not text.strip():
            return flags

        # 등록에 없는 축 이름이 해석에 나오는가
        known = prereg.segment_names
        for word in re.findall(r"[a-z_]{4,}", text):
            if word.endswith("_type") or word.endswith("_id"):
                if word not in known:
                    flags.append(Flag(
                        FlagClass.POST_HOC_SEGMENT, word,
                        f"사전등록에 없는 축이다. 등록된 축: "
                        f"{', '.join(sorted(known)) or '없음'}",
                    ))

        # 인과를 단정하는가. 소급 분석이면 특히 못 한다.
        for w in CAUSAL_WORDS:
            if w in text:
                span = _around(text, w)
                flags.append(Flag(
                    FlagClass.CAUSAL_OVERREACH, span,
                    "관측된 것은 두 군의 차이다. "
                    + ("소급 분석이라 인과를 단정할 수 없다."
                       if prereg.kind == "retrospective"
                       else "인과를 단정하려면 그 강도를 설계가 뒷받침해야 한다."),
                ))
                break

        # 가설의 지표와 다른 것을 결론으로 말하는가
        metric = str(prereg.primary.get("metric", ""))
        tail = metric.rsplit(".", 1)[-1]
        for other in ("매출", "revenue", "재방문", "retention"):
            if other in text and tail not in text:
                flags.append(Flag(
                    FlagClass.HYPOTHESIS_MISMATCH, _around(text, other),
                    f"주 지표는 {metric} 인데 다른 것을 결론으로 말한다.",
                ))
                break

        return _dedupe(flags)


class LLMAuditor:
    """키가 있을 때. **출력이 ``Flag`` 목록으로 제약된다.**"""

    backend = "llm"

    def __init__(self, model: str = "gpt-4o-mini"):
        from openai import OpenAI          # 지연 import — 키 없는 환경을 막지 않는다

        self._client = OpenAI()
        self._model = model

    def audit(self, prereg: Prereg, readout: Readout) -> list[Flag]:
        raise NotImplementedError(
            "실제 호출은 이 저장소 범위 밖이다. 계약(Flag)과 게이트가 먼저다."
        )


def get_auditor() -> Auditor:
    """키가 있으면 모델, 없으면 규칙 기반. RAG-Marketing 의 생성기와 같은 방식이다."""
    if os.getenv("OPENAI_API_KEY"):
        try:
            return LLMAuditor()
        except Exception:
            pass
    return HeuristicAuditor()


# ─────────────────────────────── 단방향 게이트
@dataclass
class AuditResult:
    backend: str
    flags: list[Flag] = field(default_factory=list)

    @property
    def blocked(self) -> bool:
        """플래그가 하나라도 있으면 막힌다.

        **반대 방향은 없다.** 감사관이 "괜찮다" 고 해도 아무것도 열리지 않는다 —
        열 수 있는 메서드를 두지 않는 것이 그 보장이다.
        """
        return bool(self.flags)

    def __str__(self) -> str:
        if not self.flags:
            return f"플래그 없음 ({self.backend}) — 통과권을 주는 것은 아니다"
        return f"플래그 {len(self.flags)}건 ({self.backend})"


def run(prereg: Prereg, readout: Readout, auditor: Auditor | None = None) -> AuditResult:
    a = auditor or get_auditor()
    return AuditResult(backend=a.backend, flags=a.audit(prereg, readout))


def _around(text: str, needle: str, width: int = 30) -> str:
    i = text.find(needle)
    if i < 0:
        return needle
    return text[max(0, i - width): i + len(needle) + width].strip()


def _dedupe(flags: list[Flag]) -> list[Flag]:
    seen, out = set(), []
    for f in flags:
        key = (f.flag_class, f.quoted_span)
        if key not in seen:
            seen.add(key)
            out.append(f)
    return out


__all__ = [
    "Auditor", "AuditResult", "CAUSAL_WORDS", "Flag", "FlagClass",
    "HeuristicAuditor", "LLMAuditor", "get_auditor", "run",
]
