"""실험 정의와 배정 — **서버가 정한다.**

배정을 클라이언트 코드에 두면, 배포할 수 있는 속도가 곧 실험을 바꿀 수 있는
속도가 된다. 웹에서는 그게 몇 분이라 티가 안 나지만 앱에서는 며칠이고,
사용자가 업데이트를 안 하면 영영이다.

그러면 무슨 일이 생기는가
------------------------
변형이 버전에 묶이면 **treatment 그룹 = "업데이트한 사람"** 이 된다. 배정 비율이
난수가 아니라 업데이트 채택률로 정해지고, 두 가지가 동시에 망가진다.

    교락      자동 업데이트를 켜둔 사람, 앱을 자주 여는 사람이 먼저 넘어간다.
              처치 효과가 아니라 사용자 차이를 재게 된다.
    경보 마비  SRM 은 "배정이 망가졌다"를 잡는 장치인데 항상 울리게 된다.
              항상 울리는 경보는 무시되고, 그러면 진짜 버그도 못 잡는다.

그래서 배정을 서버로 뺀다. 클라이언트는 **묻고 따를 뿐** 스스로 정하지 않는다.

참여하지 못하는 것과 control 은 다르다
-------------------------------------
구버전이라 실험에 못 들어가는 사용자를 조용히 control 로 넣으면, 지금 피하려는
그 교락을 그대로 만든다. 그래서 ``NOT_ELIGIBLE`` 을 별도 상태로 돌려준다.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from enum import Enum

from analytics.experiments.stats import assign


class Status(str, Enum):
    ASSIGNED = "assigned"
    # 실험이 꺼져 있다. 배포 없이 끌 수 있다는 것이 이 설계의 목적이다.
    DISABLED = "disabled"
    # 참여 조건을 못 맞춘다. **control 이 아니다.**
    NOT_ELIGIBLE = "not_eligible"


def parse_version(v: str | None) -> tuple[int, ...]:
    """``"1.2.0"`` → ``(1, 2, 0)``. 비교만 할 수 있으면 된다."""
    if not v:
        return ()
    out = []
    for part in v.split("."):
        digits = "".join(c for c in part if c.isdigit())
        out.append(int(digits) if digits else 0)
    return tuple(out)


@dataclass(frozen=True)
class Experiment:
    experiment_id: str
    variants: tuple[str, ...] = ("control", "treatment")
    weights: tuple[float, ...] = (0.5, 0.5)
    enabled: bool = True
    # 참여 조건
    platforms: tuple[str, ...] = ()          # 비어 있으면 전체
    min_app_version: str | None = None       # 앱에만 적용된다

    def eligible(self, platform: str, app_version: str | None) -> bool:
        if self.platforms and platform not in self.platforms:
            return False
        if self.min_app_version and platform != "WEB":
            return parse_version(app_version) >= parse_version(self.min_app_version)
        return True


@dataclass(frozen=True)
class Assignment:
    experiment_id: str
    status: Status
    variant: str | None = None
    reason: str | None = None


@dataclass
class Registry:
    """실험 목록. 배포가 아니라 이 목록을 바꾸면 실험이 바뀐다."""

    experiments: dict[str, Experiment] = field(default_factory=dict)

    def add(self, exp: Experiment) -> "Registry":
        self.experiments[exp.experiment_id] = exp
        return self

    def assign_one(self, exp: Experiment, unit_id: str, platform: str,
                   app_version: str | None) -> Assignment:
        if not exp.enabled:
            return Assignment(exp.experiment_id, Status.DISABLED,
                              reason="실험이 꺼져 있다")
        if not exp.eligible(platform, app_version):
            # 여기서 control 을 주면 안 된다. 그 순간 구버전 사용자가 control 에
            # 몰려서, 이 엔드포인트가 없애려던 교락이 그대로 생긴다.
            return Assignment(
                exp.experiment_id, Status.NOT_ELIGIBLE,
                reason=f"참여 조건 미충족 (platform={platform}, app_version={app_version})",
            )
        variant = assign(unit_id, exp.experiment_id, exp.variants, exp.weights)
        return Assignment(exp.experiment_id, Status.ASSIGNED, variant=variant)

    def assignments(self, unit_id: str, platform: str = "WEB",
                    app_version: str | None = None) -> list[Assignment]:
        return [
            self.assign_one(e, unit_id, platform, app_version)
            for e in self.experiments.values()
        ]


def default_registry() -> Registry:
    """지금 돌고 있는 실험.

    ``min_app_version`` 이 걸려 있어도 **배정 자체는 서버가 한다.** 조건은
    "참여할 수 있는가"만 정하고, 참여 가능한 사람 안에서는 버전과 무관하게
    50:50 이 유지된다. 그게 SRM 을 다시 쓸 수 있게 만드는 부분이다.
    """
    return Registry().add(
        Experiment(
            experiment_id="exp_mobile_sticky_cta",
            platforms=("WEB", "IOS", "ANDROID"),
            min_app_version="1.1.0",
        )
    )


__all__ = [
    "Assignment", "Experiment", "Registry", "Status",
    "default_registry", "parse_version",
]
