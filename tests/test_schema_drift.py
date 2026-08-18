"""모델과 마이그레이션이 갈리지 않게 한다.

컬럼 하나를 지우려면 네 군데를 같이 고쳐야 한다 — 모델·마이그레이션·응답 스키마·
화면. 하나라도 빠지면 **오류가 아니라 침묵으로** 나타난다. 응답에서 필드가 빠지면
화면은 `undefined` 를 그리고, 모델에만 남으면 쿼리가 없는 컬럼을 찾는다.

`is_spoiler` 가 그런 잔재였다. 영화 예매에서 숙박으로 도메인을 옮길 때 남았고,
숙소 리뷰 화면이 "스포일러" 배지를 실제로 그리고 있었다.
"""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
BASELINE = "0001_lodging_baseline"


def _text(rel: str) -> str:
    return (ROOT / rel).read_text(encoding="utf-8")


def test_spoiler_is_gone_from_the_model_and_the_api():
    """도메인이 바뀌었으면 그 도메인에 없는 개념도 같이 나가야 한다."""
    for rel in (
        "backend/app/models/base.py",
        "backend/app/schemas/__init__.py",
        "backend/app/api/v1/reviews.py",
        "backend/app/api/v1/admin.py",
        "docs/erd.dbml",
    ):
        assert "is_spoiler" not in _text(rel), f"{rel} 에 잔재가 남아 있다"


def test_the_baseline_keeps_it_because_history_is_not_edited():
    """지운 사실도 이력이다.

    베이스라인을 고쳐서 없애면 이미 마이그레이션한 쪽과 안 한 쪽의 스키마가 갈리고,
    "왜 없어졌는가"를 물을 자리도 사라진다.
    """
    assert "is_spoiler" in _text(f"backend/alembic/versions/{BASELINE}.py")


def test_a_migration_actually_drops_it():
    src = _text("backend/alembic/versions/0002_drop_review_spoiler.py")
    assert 'op.drop_column("reviews", "is_spoiler")' in src
    assert f'down_revision = "{BASELINE}"' in src


def test_the_migration_chain_is_linear():
    """리비전이 갈라지면 `head` 가 둘이 되고 업그레이드가 멈춘다."""
    versions = sorted((ROOT / "backend/alembic/versions").glob("*.py"))
    revs, parents, roots = [], [], 0
    for f in versions:
        src = f.read_text(encoding="utf-8")
        revs += re.findall(r'^revision = "([^"]+)"', src, re.M)
        parent = re.search(r'^down_revision = "([^"]+)"', src, re.M)
        if parent:
            parents.append(parent.group(1))
        elif re.search(r"^down_revision = None", src, re.M):
            roots += 1

    assert len(revs) == len(set(revs)), "리비전 ID 가 겹친다"
    assert len(parents) == len(set(parents)), "같은 부모를 가리키는 마이그레이션이 둘 이상이다"
    assert roots == 1, f"뿌리 마이그레이션이 {roots}개 — head 가 갈라진다"
    assert set(parents) <= set(revs), f"없는 리비전을 가리킨다: {set(parents) - set(revs)}"


def test_review_model_and_response_agree_on_fields():
    """모델에 있는데 응답에 없는 필드는 화면이 영영 못 본다."""
    model = _text("backend/app/models/base.py")
    schema = _text("backend/app/schemas/__init__.py")

    body = model.split("class Review(", 1)[1].split("\nclass ", 1)[0]
    cols = set(re.findall(r"^\s{4}(\w+) = Column\(", body, re.M))

    resp = schema.split("class ReviewResponse(", 1)[1].split("\nclass ", 1)[0]
    fields = set(re.findall(r"^\s{4}(\w+):", resp, re.M))

    # 응답이 모델에 없는 컬럼을 약속하면 안 된다(파생 필드는 예외로 허용)
    derived = {"user_name"}
    assert fields - derived <= cols, f"모델에 없는 필드를 응답이 약속한다: {fields - derived - cols}"
