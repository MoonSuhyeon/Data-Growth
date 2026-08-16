"""M3 — 배정을 릴리스에서 떼어낸다.

이 저장소의 주장은 "실험 결과는 설계를 먼저 고정했을 때만 믿을 수 있다" 이다.
모바일은 그 주장을 반박하지 않는다. **"설계"에 전달 수단도 포함된다는 것을
드러낼 뿐이다.** 통계는 고정했는데 배포 경로를 안 고정하면 반쪽이다.

변형이 앱 버전에 묶이면 treatment 그룹이 "업데이트한 사람"이 된다. 배정 비율이
난수가 아니라 업데이트 채택률로 정해지고, SRM 이 **항상** 울리게 된다.
항상 울리는 경보는 무시되고, 그러면 진짜 배정 버그도 못 잡는다.
"""
from __future__ import annotations

import random

from analytics.experiments.registry import (
    Experiment, Registry, Status, default_registry, parse_version,
)
from analytics.experiments.stats import assign, check_srm, check_srm_by

SEED = 42
N = 20_000
UNITS = [f"u{i}" for i in range(N)]
EXP = "exp_sticky_cta"


# ─────────────────────────────── 문제를 먼저 고정한다
def test_version_gated_variant_makes_srm_fire_forever():
    """변형이 버전에 묶이면 배정 비율이 업데이트 채택률을 따라간다.

    채택률은 시간에 따라 변하므로 비율이 한 번도 50:50 이 되지 않는다.
    즉 SRM 이 **어느 시점에도** 정상이 아니다.
    """
    rng = random.Random(SEED)
    for adoption in (0.05, 0.30, 0.62, 0.85):
        counts = {"control": 0, "treatment": 0}
        for _ in UNITS:
            updated = rng.random() < adoption
            counts["treatment" if updated else "control"] += 1
        srm = check_srm(counts)
        assert not srm.healthy, f"채택률 {adoption:.0%} 에서 SRM 이 걸려야 한다"


def test_remote_assignment_keeps_the_ratio_regardless_of_adoption():
    """서버가 정하면 참여 가능한 사람 안에서 비율이 지켜진다.

    표본 크기는 채택률을 따라 늘지만, **비율은 버전과 무관해진다.**
    그래야 "표본이 모자라다" 와 "배정이 틀어졌다" 를 구분할 수 있다.
    """
    rng = random.Random(SEED)
    for adoption in (0.05, 0.30, 0.62, 0.85):
        counts = {"control": 0, "treatment": 0}
        for u in UNITS:
            if rng.random() < adoption:      # 참여 가능한 버전인가
                counts[assign(u, EXP)] += 1
        srm = check_srm(counts)
        assert srm.healthy, f"채택률 {adoption:.0%} 에서 SRM 이 정상이어야 한다"


# ─────────────────────────────── 참여 불가는 control 이 아니다
def test_ineligible_client_is_not_silently_put_in_control():
    """구버전 사용자를 control 로 채우면 없애려던 교락이 그대로 생긴다."""
    reg = default_registry()
    old = reg.assignments("u1", platform="IOS", app_version="1.0.0")[0]
    assert old.status is Status.NOT_ELIGIBLE
    assert old.variant is None, "control 이라고 답하면 안 된다"
    assert "1.0.0" in (old.reason or "")


def test_eligible_client_gets_a_variant():
    reg = default_registry()
    new = reg.assignments("u1", platform="IOS", app_version="1.2.0")[0]
    assert new.status is Status.ASSIGNED
    assert new.variant in ("control", "treatment")


def test_web_is_not_gated_by_app_version():
    """웹에는 앱 버전이 없다. 조건이 웹을 막으면 안 된다."""
    reg = default_registry()
    web = reg.assignments("u1", platform="WEB")[0]
    assert web.status is Status.ASSIGNED


# ─────────────────────────────── 배포 없이 끄고 켜기
def test_experiment_can_be_turned_off_without_a_release():
    """이 목록을 바꾸는 것이 곧 실험을 바꾸는 것 — 배포가 아니라."""
    reg = Registry().add(Experiment(EXP, enabled=False))
    a = reg.assignments("u1")[0]
    assert a.status is Status.DISABLED
    assert a.variant is None


def test_assignment_is_stable_across_calls():
    """같은 사용자는 항상 같은 답을 받는다. 상태를 저장하지 않고도 그렇다."""
    reg = default_registry()
    first = reg.assignments("u-stable", platform="WEB")[0].variant
    for _ in range(5):
        assert reg.assignments("u-stable", platform="WEB")[0].variant == first


def test_assignment_does_not_depend_on_app_version():
    """참여만 가능하면 어느 버전이든 같은 그룹이어야 한다.

    버전이 배정에 영향을 주는 순간 교락이 다시 들어온다.
    """
    reg = default_registry()
    a = reg.assignments("u-x", platform="IOS", app_version="1.1.0")[0]
    b = reg.assignments("u-x", platform="IOS", app_version="9.9.9")[0]
    assert a.variant == b.variant


# ─────────────────────────────── 층별 SRM
def test_stratified_srm_catches_a_version_that_overall_ratio_hides():
    """**전체는 정상인데 한 버전만 틀어진 경우.** 층별 검사가 값을 하는 자리다.

    큰 버전 둘이 균형을 맞추고 있어서 전체 비율은 검정을 통과한다. 작은 버전
    하나가 55:45 로 틀어져 있는데, 전체에 섞이면 그 왜곡이 묻힌다.
    """
    counts = {
        "1.1.0": {"control": 5_000, "treatment": 5_000},
        "1.2.0": {"control": 5_000, "treatment": 5_000},
        # 이 버전만 배정 로직이 깨진 채 나갔다 — 전체를 흔들 만큼 크지는 않다
        "1.3.0": {"control": 1_100, "treatment": 900},
    }
    result = check_srm_by(counts)

    assert result.overall.healthy, "전체 비율만 보면 통과한다 — 그래서 못 잡는다"
    assert not result.healthy
    assert result.bad_strata == ["1.3.0"]
    assert "층에서 걸렸다" in str(result)


def test_stratified_srm_still_reports_a_broken_overall_ratio():
    """왜곡이 전체까지 흔들면 전체가 걸렸다고 말한다."""
    counts = {
        "1.1.0": {"control": 5_000, "treatment": 5_000},
        "1.3.0": {"control": 1_800, "treatment": 200},
    }
    result = check_srm_by(counts)
    assert not result.overall.healthy
    assert "전체" in str(result)


def test_stratified_srm_is_healthy_when_every_version_is_balanced():
    counts = {
        "1.1.0": {"control": 4_000, "treatment": 4_050},
        "1.2.0": {"control": 6_000, "treatment": 5_950},
    }
    result = check_srm_by(counts)
    assert result.healthy
    assert result.bad_strata == []


def test_tiny_strata_are_skipped_so_the_alarm_stays_useful():
    """표본이 적은 층은 χ² 가 요동친다. 그걸로 경보를 울리면 경보가 죽는다."""
    counts = {
        "1.1.0": {"control": 5_000, "treatment": 5_000},
        "2.0.0-beta": {"control": 9, "treatment": 1},   # 소수 베타 사용자
    }
    result = check_srm_by(counts, min_stratum_size=100)
    assert result.healthy
    assert "2.0.0-beta" not in result.by_stratum


# ─────────────────────────────── 버전 비교
def test_version_parsing_orders_correctly():
    assert parse_version("1.10.0") > parse_version("1.9.0")
    assert parse_version("2.0.0") > parse_version("1.99.99")
    assert parse_version(None) == ()
    assert parse_version("1.2.0-beta") == (1, 2, 0)
