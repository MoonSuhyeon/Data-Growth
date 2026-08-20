"""홀드아웃 데모 — 같은 데이터에서 두 개의 답이 나온다.

    python scripts/run_holdout_demo.py

개입 효과를 **0 으로 못 박고** 돌린다. 그런데도 "예측 대비 실적" 은 성공을
보고한다. 홀드아웃과 견줄 때만 0 이 나온다.

이게 `bank-transfer-demo/docs/multi-agent-orchestration.md` 가 A4·A5 를 최소
완성선에 넣은 이유다 — 그 앞까지는 "겹치지 않게 배분했다" 이고, 여기서부터가
"그래서 효과가 있었나" 다.
"""
from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

# 윈도우 콘솔 기본 인코딩(cp949)에는 없는 글자가 본문에 있다.
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

from analytics.intervention import measure  # noqa: E402
from tests.test_intervention import make_outcomes  # noqa: E402


def show(title: str, effect: float, noise: float = 0.08) -> None:
    eff = measure(make_outcomes(effect=effect, noise=noise))
    print(f"\n── {title}  (심은 효과 {effect:+.3f}, 예측 오차 σ={noise})")
    print(f"   개입군 {eff.treated_n}건 / 홀드아웃 {eff.holdout_n}건 · {eff.srm_detail}")
    print(f"   {'예측 대비 실적 (홀드아웃 없을 때 낼 수 있는 유일한 숫자)':<46} {eff.naive_lift:+.4f}")
    print(f"   {'홀드아웃도 겪는 상승 (= 평균 회귀분)':<46} {eff.holdout_lift:+.4f}")
    print(f"   {'홀드아웃 대비 효과':<46} {eff.true_lift:+.4f}  "
          f"[95% CI {eff.ci_low:+.4f}, {eff.ci_high:+.4f}] p={eff.p_value:.4f}")
    print(f"   → {eff}")


def main() -> None:
    print("=" * 78)
    print("저수요 단위에 개입했다. 효과가 있었나?")
    print("=" * 78)

    show("아무 효과도 없다", effect=0.0)
    show("6%p 효과를 심었다", effect=0.06)
    show("모델이 정확해지면 편향이 줄어든다", effect=0.0, noise=0.03)

    print("\n" + "=" * 78)
    print("첫 블록에서 개입 효과는 정확히 0 이다. 그런데 예측 대비 실적은 성공을")
    print("보고한다 — 후보를 '예측이 낮은 것' 으로 골랐기 때문이다.")
    print("홀드아웃이 없는 측정은 언제나 이 숫자를 낸다.")
    print("=" * 78)


if __name__ == "__main__":
    main()
