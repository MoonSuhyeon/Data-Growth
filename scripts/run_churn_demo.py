"""이탈 예측 데모 — **AUC 0.88 이 아무 말도 하지 않을 수 있다.**

    python scripts/run_churn_demo.py

같은 모델을 두 데이터에 돌린다. 하나는 누가 돌아올지가 첫 방문의 행동으로 정해지는
데이터, 다른 하나는 **아무 상관 없이 정해지는** 데이터다. 두 번째에서 배울 것은
하나도 없다.

그런데 점수는 거의 같다.
"""
from __future__ import annotations

import sys
from datetime import datetime
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

import pandas as pd  # noqa: E402

from analytics.churn_model import ChurnModel, evaluate, split_by_time  # noqa: E402
from analytics.simulator import SimConfig, simulate  # noqa: E402

TRAIN_CUT = datetime(2025, 7, 5)
TEST_CUT = datetime(2025, 7, 12)
BEHAVIOUR = ["visits", "views", "booked", "cancelled", "is_mobile", "tenure_days"]
BAR = "=" * 78


def frame(structure: bool) -> pd.DataFrame:
    events, _ = simulate(SimConfig(n_visitors=30000, days=60, seed=11,
                                   churn_structure=structure))
    df = pd.DataFrame(events)
    df["sent_at"] = pd.to_datetime(df["sent_at"])
    return df


def run(df: pd.DataFrame, columns: list[str] | None):
    train, test = split_by_time(df, TRAIN_CUT, TEST_CUT, horizon_days=14)
    if columns is not None:
        train.X, test.X = train.X[columns], test.X[columns]
    model = ChurnModel().fit(train.X, train.y)
    return evaluate(model, test), model.weights()


def main() -> int:
    real, fake = frame(True), frame(False)

    print(BAR)
    print("이탈 예측 — 같은 모델, 두 데이터")
    print("  실제  : 첫 방문의 행동이 재방문을 정한다")
    print("  위약  : 누가 돌아올지가 행동과 아무 상관 없다 — 배울 것이 없다")
    print(BAR)

    for title, columns in (("특징 전부", None), ("최근성(days_since_last) 제외", BEHAVIOUR)):
        print(f"\n── {title}")
        for name, df in (("실제", real), ("위약", fake)):
            ev, w = run(df, columns)
            top = " ".join(f"{k}={v:+.2f}" for k, v in
                           sorted(w.items(), key=lambda x: -abs(x[1]))[:3])
            print(f"   {name}  AUC {ev.auc:.3f} · 리프트@10 {ev.lift_at_10:.2f}배 · "
                  f"기저 이탈률 {ev.base_rate:.1%}")
            print(f"         계수 {top}")

    print("\n" + BAR)
    print("특징을 전부 쓰면 위약에서도 AUC 가 0.87 근처로 나온다. 모델이 읽은 것은")
    print("행동이 아니라 days_since_last 이고, 그건 표집 방식의 부산물이다 —")
    print("재방문 간격이 1~14일이라 30일 전에 마지막으로 온 사람은 앞으로 14일 안에")
    print("올 리가 없다. 구조가 있든 없든 참이다.")
    print()
    print("최근성을 빼면 그제서야 갈린다. 그 차이가 실제 신호다.")
    print()
    print("intervention.py 의 홀드아웃과 같은 모양이다: 효과를 0 으로 두고 돌려도")
    print("순진한 추정이 성공을 보고했듯, 배울 것이 없어도 AUC 는 훌륭하게 나온다.")
    print(BAR)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
