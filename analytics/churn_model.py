"""이탈 예측 — **틀리기 쉬운 세 자리를 먼저 막는다.**

E4. 모델 자체는 로지스틱 회귀 한 줄이고, 어려운 것은 전부 데이터를 자르는 쪽에 있다.

## 1. 특징은 기준일 **이전**에서만 온다

가장 흔한 사고다. "예약한 사람은 잘 돌아온다" 는 참인데, **관측 창 전체에서**
예약 여부를 세면 그건 예측이 아니라 결과다 — 돌아온 사람은 예약할 기회를 한 번 더
가졌으니까. 역인과가 특징에 섞이면 AUC 가 훌륭하게 나오고 실전에서 무너진다.

그래서 기준일(`cutoff`)을 잡고 **그 앞의 행동만** 특징으로 쓴다.

## 2. 나눔은 시간으로 한다

무작위로 나누면 같은 사람의 미래가 학습에 들어간다. 그것보다 나쁜 것은, 학습 표본과
평가 표본이 **같은 시기**라서 계절성·캠페인 같은 시점 효과를 모델이 외울 수 있다는
점이다. 실전은 늘 "과거로 배워 미래를 맞히는" 문제라 나눔도 그래야 한다.

## 3. 라벨에는 완전한 창이 필요하다

기준일 + 관측 기간이 데이터 끝을 넘으면 그 사람은 "안 돌아온" 게 아니라 **"돌아올
시간이 없었던"** 것이다. 우측 절단이고, 그대로 0 으로 라벨하면 이탈률이 부풀고
모델은 늦은 코호트를 전부 이탈로 배운다. 그런 표본은 뺀다.

## 4. 배울 것이 없는 데이터에서 점수가 어떻게 나오는지 먼저 본다

**만들면서 가장 놀란 부분이다.**

이 모델은 AUC 0.878 을 낸다. 훌륭해 보인다. 그런데 시뮬레이터의 이탈 구조를 **끄고**
— 즉 누가 돌아올지가 행동과 아무 상관이 없게 만들고 — 같은 모델을 돌리면 **0.876**
이 나온다.

배울 것이 하나도 없는 데이터에서 거의 같은 점수가 나온 것이다. 모델이 읽은 것은
행동이 아니라 `days_since_last` 였고, 그건 **표집 방식의 부산물**이다: 재방문 간격이
1~14일이므로 30일 전에 마지막으로 온 사람은 앞으로 14일 안에 올 리가 없다. 구조가
있든 없든 참이다.

최근성을 빼면 그제서야 갈린다 — **0.590 대 0.520.** 7포인트, 그게 실제 신호다.

이건 `intervention.py` 의 홀드아웃과 같은 모양이다. 효과를 0 으로 두고 돌려도 순진한
추정이 성공을 보고했듯, **배울 것이 없어도 AUC 는 훌륭하게 나온다.** 위약 대조 없이
읽은 점수는 그 자체로는 아무 말도 하지 않는다.

## 그리고 AUC 하나만 보지 않는다

이탈은 불균형 문제다. 기저 이탈률이 80% 면 "전부 이탈" 이라 답해도 정확도 80% 다.
그래서 **기저율과 나란히** 놓고, 확률의 보정(calibration)까지 본다 — 확률을 그대로
쓰는 쪽(누구에게 쿠폰을 줄까)에서는 순위보다 보정이 중요하다.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timedelta

import numpy as np
import pandas as pd

#: 방문의 시작을 알리는 이벤트. 취소처럼 며칠 뒤에 따라오는 이벤트는 방문이 아니다 —
#: 그걸 방문으로 세면 취소한 사람이 전부 "돌아온" 것으로 잡힌다.
VISIT_START = "search_performed"

FEATURES = ("visits", "views", "booked", "cancelled", "is_mobile",
            "days_since_last", "tenure_days")


@dataclass
class Dataset:
    """학습·평가에 쓸 한 덩어리."""

    X: pd.DataFrame
    y: pd.Series
    cutoff: datetime
    #: 라벨을 확정하는 데 쓴 기간.
    horizon_days: int
    #: 창이 모자라 뺀 사람 수. **0 이 아니면 말해야 한다.**
    censored: int = 0

    @property
    def churn_rate(self) -> float:
        return float(self.y.mean()) if len(self.y) else 0.0

    def __str__(self) -> str:
        return (f"{self.cutoff.date()} 기준 {len(self.y):,}명 · "
                f"이탈률 {self.churn_rate:.1%} · 절단 제외 {self.censored:,}명")


def _visit_days(events: pd.DataFrame) -> pd.DataFrame:
    starts = events[events["event_name"] == VISIT_START]
    return starts


def build(events: pd.DataFrame, cutoff: datetime, horizon_days: int = 14,
          observed_until: datetime | None = None) -> Dataset:
    """기준일 앞의 행동으로 특징을, 뒤의 행동으로 라벨을 만든다.

    Args:
        events: `sent_at` 이 datetime 인 이벤트 표
        cutoff: 이 시각 **이전**만 특징에 쓴다
        horizon_days: 기준일 뒤 이만큼 안에 안 오면 이탈
        observed_until: 데이터가 실제로 관측된 끝. 기본은 이벤트의 최댓값

    Raises:
        ValueError: 관측 창이 라벨을 확정할 만큼 남아 있지 않을 때. **조용히
            줄이지 않는다** — 줄이면 이탈률이 부풀고 아무도 눈치채지 못한다.
    """
    end = observed_until or events["sent_at"].max()
    label_end = cutoff + timedelta(days=horizon_days)
    if label_end > end:
        raise ValueError(
            f"라벨 창이 관측 밖으로 나간다 ({label_end.date()} > {end.date()}) — "
            f"이 기준일로는 '안 돌아왔다' 와 '돌아올 시간이 없었다' 를 구분할 수 없다")

    past = events[events["sent_at"] < cutoff]
    if past.empty:
        return Dataset(pd.DataFrame(columns=list(FEATURES)), pd.Series(dtype=float),
                       cutoff, horizon_days)

    starts = _visit_days(past)
    grouped = past.groupby("anonymous_id")

    X = pd.DataFrame({
        "visits": starts.groupby("anonymous_id").size(),
        "views": grouped["event_name"].apply(lambda s: int((s == "property_viewed").sum())),
        "booked": grouped["event_name"].apply(lambda s: int((s == "booking_completed").any())),
        "cancelled": grouped["event_name"].apply(lambda s: int((s == "booking_cancelled").any())),
        "is_mobile": grouped["device_type"].apply(lambda s: int((s == "mobile").any())),
        "last_seen": grouped["sent_at"].max(),
        "first_seen": grouped["sent_at"].min(),
    })
    X["visits"] = X["visits"].fillna(0).astype(int)
    X["days_since_last"] = (cutoff - X["last_seen"]).dt.total_seconds() / 86400
    X["tenure_days"] = (X["last_seen"] - X["first_seen"]).dt.total_seconds() / 86400
    X = X.drop(columns=["last_seen", "first_seen"])

    # 라벨 — 기준일 뒤 창 안에 **방문을 시작했는가.**
    future = events[(events["sent_at"] >= cutoff) & (events["sent_at"] < label_end)]
    came_back = set(_visit_days(future)["anonymous_id"])
    y = pd.Series([0 if a in came_back else 1 for a in X.index], index=X.index, name="churn")

    return Dataset(X[list(FEATURES)], y, cutoff, horizon_days)


def split_by_time(events: pd.DataFrame, train_cutoff: datetime,
                  test_cutoff: datetime, horizon_days: int = 14,
                  observed_until: datetime | None = None) -> tuple[Dataset, Dataset]:
    """**시간으로 나눈다.**

    무작위로 나누면 같은 시기가 양쪽에 들어가고, 모델은 그 시기의 계절성을 외워서
    좋은 점수를 낸다. 실전은 늘 과거로 배워 미래를 맞히는 문제다.
    """
    if test_cutoff <= train_cutoff:
        raise ValueError("평가 기준일이 학습 기준일보다 뒤여야 한다 — 아니면 미래로 과거를 맞히는 것이다")
    return (build(events, train_cutoff, horizon_days, observed_until),
            build(events, test_cutoff, horizon_days, observed_until))


@dataclass
class Evaluation:
    """평가. **AUC 하나만 두지 않는다.**"""

    n: int
    #: 기저 이탈률. AUC 옆에 이게 없으면 "정확도 80%" 가 훌륭한지 아닌지 모른다.
    base_rate: float
    auc: float
    #: 상위 10% 의 이탈률 ÷ 기저 이탈률. 실제로 쓰는 쪽(누구에게 쿠폰을 줄까)의 숫자다.
    lift_at_10: float
    #: 예측 확률의 평균과 실제 이탈률의 차이. 순위가 맞아도 이게 크면 확률을
    #: 그대로 쓸 수 없다.
    calibration_gap: float
    notes: list[str] = field(default_factory=list)

    @property
    def useful(self) -> bool:
        """동전 던지기보다 나은가. **AUC 0.5 는 실패가 아니라 사실일 수 있다.**"""
        return self.auc > 0.55

    def __str__(self) -> str:
        verdict = "쓸 만하다" if self.useful else "동전 던지기와 다르지 않다"
        return (f"AUC {self.auc:.3f} (기저 이탈률 {self.base_rate:.1%}) · "
                f"상위 10% 리프트 {self.lift_at_10:.2f}배 · "
                f"보정 오차 {self.calibration_gap:+.3f} — {verdict}")


def _auc(y: np.ndarray, p: np.ndarray) -> float:
    """순위 기반 AUC. 동점은 평균 순위로 다룬다."""
    pos, neg = y == 1, y == 0
    if not pos.any() or not neg.any():
        return 0.5
    order = pd.Series(p).rank(method="average").to_numpy()
    return float((order[pos].sum() - pos.sum() * (pos.sum() + 1) / 2)
                 / (pos.sum() * neg.sum()))


class ChurnModel:
    """로지스틱 회귀. **모델은 이 파일에서 가장 안 중요한 부분이다.**

    scikit-learn 을 쓰지 않는다. 이 저장소는 `experiments/stats.py` 에서 이미 같은
    선택을 했다 — 수식이 코드에 드러나는 편이 낫고, 여기서 배울 것도 모델이 아니라
    데이터를 자르는 방법이다. 의존성을 하나 더 지는 값어치가 없다.
    """

    def __init__(self, l2: float = 1.0, iters: int = 200):
        self.l2 = l2
        self.iters = iters
        self.coef_: np.ndarray | None = None
        self.intercept_: float = 0.0
        self.columns_: list[str] = []
        self._mean: np.ndarray | None = None
        self._std: np.ndarray | None = None

    def fit(self, X: pd.DataFrame, y: pd.Series) -> ChurnModel:
        self.columns_ = list(X.columns)
        A = X.to_numpy(dtype=float)
        # 표준화. 안 하면 `tenure_days`(0~60) 가 `booked`(0/1) 를 압도한다.
        self._mean, self._std = A.mean(axis=0), A.std(axis=0)
        self._std[self._std == 0] = 1.0
        A = (A - self._mean) / self._std

        t = y.to_numpy(dtype=float)
        w = np.zeros(A.shape[1])
        b = 0.0
        for _ in range(self.iters):
            z = A @ w + b
            p = 1 / (1 + np.exp(-np.clip(z, -30, 30)))
            g = A.T @ (p - t) / len(t) + self.l2 * w / len(t)
            gb = float((p - t).mean())
            # IRLS 대신 고정 스텝. 표준화한 뒤라 잘 수렴한다.
            w -= 0.5 * g
            b -= 0.5 * gb
        self.coef_, self.intercept_ = w, b
        return self

    def predict_proba(self, X: pd.DataFrame) -> np.ndarray:
        if self.coef_ is None:
            raise RuntimeError("학습되지 않았다")
        A = (X[self.columns_].to_numpy(dtype=float) - self._mean) / self._std
        z = A @ self.coef_ + self.intercept_
        return 1 / (1 + np.exp(-np.clip(z, -30, 30)))

    def weights(self) -> dict[str, float]:
        """표준화된 계수. 부호와 상대 크기만 읽는다."""
        return dict(zip(self.columns_, map(float, self.coef_)))


def evaluate(model: ChurnModel, data: Dataset, top_k: float = 0.10) -> Evaluation:
    """**기저율과 나란히 놓는다.**"""
    notes: list[str] = []
    if len(data.y) == 0:
        return Evaluation(0, 0.0, 0.5, 0.0, 0.0, ["표본이 없다"])

    p = model.predict_proba(data.X)
    y = data.y.to_numpy()
    base = float(y.mean())

    k = max(1, int(len(y) * top_k))
    top = np.argsort(-p)[:k]
    lift = float(y[top].mean() / base) if base else 0.0

    if base > 0.9 or base < 0.1:
        notes.append(f"기저 이탈률이 {base:.0%} 다 — 한쪽으로 심하게 쏠려 AUC 가 요동친다")
    if data.censored:
        notes.append(f"관측 창이 모자라 {data.censored:,}명을 뺐다")

    return Evaluation(
        n=len(y), base_rate=base, auc=_auc(y, p), lift_at_10=lift,
        calibration_gap=float(p.mean() - base), notes=notes,
    )


__all__ = ["ChurnModel", "Dataset", "Evaluation", "FEATURES", "VISIT_START",
           "build", "evaluate", "split_by_time"]
