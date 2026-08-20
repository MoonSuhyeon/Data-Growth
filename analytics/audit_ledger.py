"""플래그 채택률 — **감사관 자신을 계측한다.**

*"AI 가 AI 를 평가하냐"* 는 이 구조가 반드시 받는 질문이다. 답은 구조로 있어야 한다.

  1. 감사관은 **판정에 손대지 않는다** (`audit.py` 의 `Flag` 에 판정 필드가 없다)
  2. 올린 플래그를 사람이 **얼마나 받아들이는지** 센다 — 이 파일
  3. 채택률이 낮은 종류는 **끈다**

3번이 이 파일이 존재하는 이유다. 이 저장소는 SRM 에서 이미 같은 교훈을 적었다 —
항상 울리는 경보는 무시되고, 무시되면 진짜 실패도 못 잡는다. 감사관에도 그대로
적용된다. 다른 점은, 여기서는 **끌 근거를 숫자로 남긴다**는 것뿐이다.

원장은 JSON 한 줄씩 쌓는다(JSONL). 사람이 눈으로 읽고 손으로 고칠 수 있어야 하고,
스키마가 자랄 때 마이그레이션이 필요 없어야 한다.
"""
from __future__ import annotations

import json
import os
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path

from analytics.audit import Flag, FlagClass

LEDGER_PATH = Path(os.getenv("AUDIT_LEDGER", "reports/audit_ledger.jsonl"))

#: 채택률이 이 아래로 내려가면 그 종류를 끄자고 제안한다.
OFF_THRESHOLD = 0.30
#: 이 건수 미만이면 판정하지 않는다. 3건 중 1건으로 종류를 끄면 소음에 휘둘린다.
MIN_JUDGED = 10


@dataclass
class Entry:
    experiment_id: str
    flag_class: str
    quoted_span: str
    why: str
    backend: str
    #: 사람이 받아들였는가. ``None`` 이면 **아직 판단 안 함** — 기각과 다르다.
    accepted: bool | None = None
    at: str = ""

    def to_json(self) -> str:
        d = {**self.__dict__}
        d["at"] = d["at"] or datetime.utcnow().isoformat(timespec="seconds")
        return json.dumps(d, ensure_ascii=False)


def record(experiment_id: str, flags: list[Flag], backend: str,
           path: Path | None = None) -> int:
    """올라온 플래그를 원장에 남긴다. **판단은 아직 안 붙는다.**"""
    p = path or LEDGER_PATH
    p.parent.mkdir(parents=True, exist_ok=True)
    with p.open("a", encoding="utf-8") as f:
        for fl in flags:
            f.write(Entry(experiment_id, fl.flag_class.value, fl.quoted_span,
                          fl.why, backend).to_json() + "\n")
    return len(flags)


def judge(experiment_id: str, flag_class: str, accepted: bool,
          path: Path | None = None) -> int:
    """사람의 판단을 붙인다.

    **덧붙이기만 한다.** 앞 줄을 고치지 않고 새 줄을 쌓는다 — 누가 언제 뭐라고
    판단했는지가 지워지면 채택률이 나중에 조작될 수 있다.
    """
    p = path or LEDGER_PATH
    p.parent.mkdir(parents=True, exist_ok=True)
    e = Entry(experiment_id, flag_class, "", "판단", "human", accepted=accepted)
    with p.open("a", encoding="utf-8") as f:
        f.write(e.to_json() + "\n")
    return 1


def _load(path: Path | None = None) -> list[dict]:
    p = path or LEDGER_PATH
    if not p.exists():
        return []
    return [json.loads(ln) for ln in p.read_text(encoding="utf-8").splitlines() if ln.strip()]


def acceptance(path: Path | None = None) -> dict[str, dict]:
    """플래그 종류별 채택률.

    ``judged`` 가 분모다 — **아직 판단 안 한 것은 기각이 아니다.** 그 둘을 섞으면
    새로 켠 종류가 자동으로 낮은 채택률을 받고, 켜자마자 끄자는 결론이 나온다.
    """
    rows = _load(path)
    out: dict[str, dict] = {}
    for r in rows:
        k = r["flag_class"]
        s = out.setdefault(k, {"raised": 0, "judged": 0, "accepted": 0})
        if r.get("backend") == "human":
            s["judged"] += 1
            s["accepted"] += 1 if r.get("accepted") else 0
        else:
            s["raised"] += 1

    for k, s in out.items():
        s["acceptance_rate"] = (
            round(s["accepted"] / s["judged"], 4) if s["judged"] else None
        )
        s["verdict"] = _verdict(s)
    return out


def _verdict(s: dict) -> str:
    if s["judged"] < MIN_JUDGED:
        # 판정하지 않는다. "쓸 만함" 과 다르다.
        return f"판단 보류 (판단 {s['judged']}건 < {MIN_JUDGED})"
    if s["acceptance_rate"] is not None and s["acceptance_rate"] < OFF_THRESHOLD:
        return f"끄자 (채택률 {s['acceptance_rate']:.0%} < {OFF_THRESHOLD:.0%})"
    return f"유지 (채택률 {s['acceptance_rate']:.0%})"


def enabled_classes(path: Path | None = None) -> set[str]:
    """지금 켜 둘 만한 종류. 근거가 모자라면 **켜 둔다** — 끄는 쪽이 더 위험하다."""
    stats = acceptance(path)
    off = {k for k, s in stats.items() if s["verdict"].startswith("끄자")}
    return {c.value for c in FlagClass} - off


__all__ = [
    "Entry", "LEDGER_PATH", "MIN_JUDGED", "OFF_THRESHOLD", "acceptance",
    "enabled_classes", "judge", "record",
]
