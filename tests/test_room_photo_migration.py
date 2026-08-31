"""picsum → 저장소 사진 마이그레이션.

방언을 안 타게 파이썬으로 도는 마이그레이션이라 SQLite 로 그대로 시험할 수 있다.
여기서 지키는 것은 **사람이 넣은 주소를 말없이 지우지 않는가**이다.
운영자가 콘솔에서 직접 넣은 사진이 있을 수 있고, 그걸 덮으면 되돌릴 수 없다.
"""
from __future__ import annotations

import importlib.util
import sys
import types
from pathlib import Path

import pytest
import sqlalchemy as sa

MIGRATION = (Path(__file__).resolve().parents[1]
             / "backend" / "alembic" / "versions" / "0005_local_room_photos.py")


def load():
    """마이그레이션 모듈을 그대로 불러온다.

    `pytest.ini` 가 `backend` 를 경로에 넣는 바람에 **저장소의
    `backend/alembic/` 디렉터리가 진짜 alembic 패키지를 가린다.** 그래서
    `from alembic import op` 가 깨진다. 여기서 필요한 것은 `op` 두 개뿐이고
    테스트가 어차피 갈아 끼우므로, 빈 껍데기를 넣어 두고 불러온다.
    """
    if "alembic" not in sys.modules or not hasattr(sys.modules["alembic"], "op"):
        stub = types.ModuleType("alembic")
        stub.op = types.SimpleNamespace(get_bind=lambda: None,
                                        execute=lambda *a, **k: None)
        sys.modules["alembic"] = stub

    spec = importlib.util.spec_from_file_location("m0005", MIGRATION)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod


@pytest.fixture
def db(monkeypatch):
    """숙소 표만 있는 작은 DB. 마이그레이션이 보는 컬럼은 셋뿐이다."""
    engine = sa.create_engine("sqlite://")
    conn = engine.connect()
    conn.execute(sa.text(
        "CREATE TABLE properties (id TEXT PRIMARY KEY, name TEXT, photo_url TEXT)"))

    rows = [(f"p{i:02d}", f"숙소 {i:02d}",
             f"https://picsum.photos/seed/서울{i}/600/400") for i in range(30)]
    rows.append(("own", "운영자가 직접 넣은 숙소", "https://cdn.example.com/mine.jpg"))
    rows.append(("none", "사진 없는 숙소", None))
    for r in rows:
        conn.execute(sa.text(
            "INSERT INTO properties VALUES (:i, :n, :u)"),
            {"i": r[0], "n": r[1], "u": r[2]})

    mod = load()
    monkeypatch.setattr(mod.op, "get_bind", lambda: conn)
    monkeypatch.setattr(mod.op, "execute", lambda s: conn.execute(sa.text(s)))
    yield conn, mod
    conn.close()


def urls(conn):
    return dict(conn.execute(sa.text("SELECT id, photo_url FROM properties")).all())


def test_picsum_주소가_저장소_경로로_바뀐다(db):
    conn, mod = db
    mod.upgrade()
    after = urls(conn)

    changed = [u for k, u in after.items() if k.startswith("p")]
    assert len(changed) == 30
    assert all(u.startswith("/images/rooms/room-") for u in changed)
    assert not any("picsum" in (u or "") for u in after.values())


def test_사람이_넣은_주소는_건드리지_않는다(db):
    """전부 덮으면 운영자가 넣은 값을 말없이 지운다."""
    conn, mod = db
    mod.upgrade()
    after = urls(conn)

    assert after["own"] == "https://cdn.example.com/mine.jpg"
    assert after["none"] is None


def test_사진이_스물넷을_돌아가며_배정된다(db):
    """파일은 스물넷뿐이고 숙소는 그보다 많다."""
    conn, mod = db
    mod.upgrade()
    changed = [u for k, u in urls(conn).items() if k.startswith("p")]

    assert len(set(changed)) == mod.PHOTO_COUNT
    assert "/images/rooms/room-01.jpg" in changed
    assert f"/images/rooms/room-{mod.PHOTO_COUNT:02d}.jpg" in changed


def test_두_번_돌려도_같은_결과다(db):
    """두 번째에는 picsum 이 남아 있지 않아 아무것도 바뀌지 않아야 한다."""
    conn, mod = db
    mod.upgrade()
    once = urls(conn)
    mod.upgrade()
    assert urls(conn) == once


def test_되돌리면_주소를_비운다(db):
    """picsum 으로 되돌리지 않는다 — 살아 있지 않은 주소로 되돌리는 셈이다."""
    conn, mod = db
    mod.upgrade()
    mod.downgrade()
    after = urls(conn)

    assert all(after[f"p{i:02d}"] is None for i in range(30))
    assert after["own"] == "https://cdn.example.com/mine.jpg"   # 여전히 그대로


def test_파일_번호는_한_자리도_두_자리로_적는다(db):
    """`room-1.jpg` 는 없는 파일이다."""
    _, mod = db
    assert mod.photo_at(0) == "/images/rooms/room-01.jpg"
    assert mod.photo_at(23) == "/images/rooms/room-24.jpg"
    assert mod.photo_at(24) == "/images/rooms/room-01.jpg"      # 다시 돈다
