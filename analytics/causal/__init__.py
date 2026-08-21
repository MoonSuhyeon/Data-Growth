"""관측 자료의 인과 추정 — **무작위 배정이 없을 때.**

`docs/external-market-report.md` 의 D3. `analytics/experiments/` 옆에 두는 것이
그 자체로 주장이다: 같은 질문에 답하는 두 방식이고, **결론의 강도가 다르다.**

| | `experiments/` | 여기 |
|---|---|---|
| 반사실 | 일부러 남긴 홀드아웃 | 골라서 **논증해야 하는** 비교 대상 |
| 먼저 보는 문턱 | `check_srm()` | `pretrend.check()` |
| 가장 센 문장 | "처치가 +18% 를 일으켰다" | "이와 일관되며, …를 배제할 수 없다" |

문턱이 하는 일은 같다. **읽어도 되는지를 먼저 판정하고, 아니면 못 읽게 막는다.**
"""
from analytics.causal.pretrend import PreTrend, check
from analytics.causal.did import DiD, estimate

__all__ = ["DiD", "PreTrend", "check", "estimate"]
