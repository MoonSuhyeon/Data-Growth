"""데모 시드 — 숙박 예약 도메인.

지역 구성은 수요예측 파이프라인(ML-Product)의 지역 분포와 맞춰 두었다.
같은 도메인을 다루는 저장소끼리 지역이 어긋나면 비교가 성립하지 않는다.

난수는 고정 시드를 쓴다. 데모는 매번 같은 화면이어야 한다.
"""
import asyncio
import json
import random
import uuid
from datetime import datetime, timedelta

from app.core.database import AsyncSessionLocal
from app.core.security import hash_password
from app.models import (
    Amenity, BoardType, Booking, GuestType, PeakDate, Property, PropertyAmenity,
    PropertyBoardType, RatePlan, Room, RoomType, StayDate, Term, TermAgreement, User,
)
from app.models.base import BookingStatusEnum

RNG = random.Random(20250814)

# 지역: (숙소 수, 동네 후보)
REGIONS: dict[str, tuple[int, tuple[str, ...]]] = {
    "서울": (12, ("연남", "성수", "익선동", "서촌", "한남", "망원")),
    "부산": (8, ("해운대", "광안리", "송정", "영도")),
    "제주": (10, ("애월", "성산", "한림", "표선", "구좌")),
    "강릉": (6, ("경포", "안목", "주문진", "사천")),
    "경주": (5, ("황리단길", "보문", "불국사")),
}

CITY = {
    "서울": "서울특별시", "부산": "부산광역시", "제주": "제주특별자치도",
    "강릉": "강원특별자치도 강릉시", "경주": "경상북도 경주시",
}

# (코드, 표시명, 컨셉 수식어)
PROPERTY_TYPES = (
    ("APARTMENT", "아파트", ("시티뷰", "루프탑", "복층")),
    ("HOTEL", "호텔", ("오션뷰", "스위트", "시티")),
    ("GUESTHOUSE", "게스트하우스", ("아지트", "라운지", "북카페")),
    ("PENSION", "펜션", ("독채", "스파", "바비큐")),
    ("HOUSE", "단독주택", ("한옥", "정원", "마당")),
)

AMENITIES = (
    "무선 인터넷", "무료 주차", "수영장", "조식 제공", "바비큐 시설",
    "반려동물 동반", "온수 욕조", "세탁기", "에어컨", "취사 가능",
)

BOARD_TYPES = (
    ("ROOM_ONLY", "객실만", 0, "식사가 포함되지 않는다"),
    ("BREAKFAST", "조식 포함", 18000, "1박당 조식 1회가 포함된다"),
    ("HALF_BOARD", "조식·석식 포함", 42000, "1박당 조식과 석식이 포함된다"),
)

GUEST_TYPES = (
    ("ADULT", "성인", 0, "만 19세 이상"),
    ("CHILD", "아동", 20000, "만 4~18세. 정원에 포함된다"),
    ("INFANT", "유아", 40000, "만 3세 이하. 침구가 제공되지 않는다"),
)

ROOM_GRADES = ("STANDARD", "DELUXE", "ACCESSIBLE")

# 1박 기본 요금 — 요일 × 시즌 × 객실등급
BASE_RATE = {"STANDARD": 90_000, "DELUXE": 150_000, "ACCESSIBLE": 90_000}
SEASON_MULT = {"OFF": 1.0, "SHOULDER": 1.25, "PEAK": 1.7, "HOLIDAY": 2.0}
DAY_MULT = {"WEEKDAY": 1.0, "WEEKEND": 1.3}

STAY_HORIZON_DAYS = 30
# 오늘 **이전** 숙박일. 이게 없으면 완료된 투숙이 하나도 없고, 그러면 리뷰를 쓸 수
# 있는 사람도 없다. 예약 사이트인데 예약 이력이 아예 없는 것도 이상하다.
STAY_HISTORY_DAYS = 21
CHECK_IN_HOUR = 15
CHECK_OUT_HOUR = 11

async def reset(session) -> None:
    """기존 데모 데이터를 지운다.

    ``TRUNCATE ... CASCADE`` 는 PostgreSQL 전용이라 SQLite 에서 못 쓴다.
    모든 테이블을 외래키 역순으로 DELETE 하면 방언에 상관없이 동작한다.
    데모 시드라 성능은 문제가 되지 않는다.
    """
    from app.models import Base
    for table in reversed(Base.metadata.sorted_tables):
        await session.execute(table.delete())


def build_properties(now: datetime) -> list[Property]:
    """지역·유형을 섞어 숙소를 만든다."""
    out: list[Property] = []
    for region, (count, areas) in REGIONS.items():
        for i in range(count):
            area = areas[i % len(areas)]
            code, label, concepts = PROPERTY_TYPES[i % len(PROPERTY_TYPES)]
            concept = concepts[i % len(concepts)]
            name = f"{area} {concept} {label}"
            max_guests = RNG.choice((2, 2, 3, 4, 4, 6, 8))
            out.append(Property(
                id=uuid.uuid4(),
                name=name,
                name_en=None,
                description=(
                    f"{CITY[region]} {area}에 있는 {label}입니다. "
                    f"최대 {max_guests}인까지 묵을 수 있고, 체크인은 {CHECK_IN_HOUR}시, "
                    f"체크아웃은 {CHECK_OUT_HOUR}시입니다."
                ),
                host_name=RNG.choice(("김민준", "이서연", "박도윤", "최지우", "정하준")),
                highlights=json.dumps(
                    RNG.sample(
                        ["도보 5분 거리 지하철", "전 객실 오션뷰", "셀프 체크인",
                         "장기 숙박 할인", "조용한 주택가", "주차 무료"],
                        3,
                    ),
                    ensure_ascii=False,
                ),
                max_guests=max_guests,
                property_type=code,
                photo_url=f"https://picsum.photos/seed/{region}{i}/600/400",
                listed_at=now - timedelta(days=RNG.randint(30, 400)),
                status="LISTED",
                region=region,
                address=f"{CITY[region]} {area}로 {RNG.randint(1, 120)}",
                phone=f"0{RNG.randint(31, 64)}-{RNG.randint(200, 999)}-{RNG.randint(1000, 9999)}",
                brand=None,
                total_bookings=0,
                review_count=0,
            ))
    return out


def build_room_types(prop: Property) -> list[RoomType]:
    """숙소마다 객실 타입 2종 — 스탠다드와 디럭스."""
    return [
        RoomType(id=uuid.uuid4(), property_id=prop.id, name="스탠다드",
                 total_rooms=0, bed_type_code=None, location_detail="본관"),
        RoomType(id=uuid.uuid4(), property_id=prop.id, name="디럭스",
                 total_rooms=0, bed_type_code=None, location_detail="별관"),
    ]


def build_rooms(room_type: RoomType, is_deluxe: bool) -> list[Room]:
    """객실 — 층·호수로 식별한다. 각 타입에 장애인 객실 1실을 둔다."""
    floors = (2, 3) if is_deluxe else (2, 3, 4)
    per_floor = RNG.randint(2, 4)
    rooms: list[Room] = []
    for floor in floors:
        for n in range(1, per_floor + 1):
            grade = "DELUXE" if is_deluxe else "STANDARD"
            if not is_deluxe and floor == floors[0] and n == 1:
                grade = "ACCESSIBLE"
            rooms.append(Room(
                id=uuid.uuid4(),
                room_type_id=room_type.id,
                floor=str(floor),
                number=floor * 100 + n,
                room_grade=grade,
            ))
    return rooms


async def seed() -> None:
    async with AsyncSessionLocal() as session:
        await reset(session)
        await session.commit()

        async with session.begin():
            now = datetime.utcnow()
            today = now.replace(hour=0, minute=0, second=0, microsecond=0)

            # ── 1. 사용자 ────────────────────────────────────────────
            users = [
                User(id=uuid.uuid4(), email="user1@stay.example",
                     hashed_password=hash_password("pass1234"),
                     name="김민준", phone="010-1234-5678", role="USER"),
                User(id=uuid.uuid4(), email="user2@stay.example",
                     hashed_password=hash_password("pass1234"),
                     name="이서연", phone="010-2345-6789", role="USER"),
                User(id=uuid.uuid4(), email="admin@stay.example",
                     hashed_password=hash_password("admin1234"),
                     name="관리자", phone="010-9999-0000", role="ADMIN"),
            ]
            session.add_all(users)
            await session.flush()

            # ── 2. 약관 ──────────────────────────────────────────────
            terms = [
                Term(id=uuid.uuid4(), type="SERVICE", version=1,
                     content="서비스 이용약관 내용입니다.",
                     required=True, effective_from=now),
                Term(id=uuid.uuid4(), type="PRIVACY", version=1,
                     content="개인정보 처리방침 내용입니다.",
                     required=True, effective_from=now),
                Term(id=uuid.uuid4(), type="MARKETING", version=1,
                     content="마케팅 정보 수신 동의 내용입니다.",
                     required=False, effective_from=now),
            ]
            session.add_all(terms)
            await session.flush()
            for user in users[:2]:
                for term in terms:
                    session.add(TermAgreement(id=uuid.uuid4(), user_id=user.id,
                                              term_id=term.id, agreed_at=now))
            await session.flush()

            # ── 3. 숙소 ──────────────────────────────────────────────
            properties = build_properties(now)
            session.add_all(properties)
            await session.flush()

            # ── 4. 편의시설 ──────────────────────────────────────────
            amenities = [Amenity(id=uuid.uuid4(), name=n) for n in AMENITIES]
            session.add_all(amenities)
            await session.flush()
            for prop in properties:
                for amenity in RNG.sample(amenities, RNG.randint(3, 6)):
                    session.add(PropertyAmenity(property_id=prop.id, amenity_id=amenity.id))

            # ── 5. 식사 조건 ─────────────────────────────────────────
            board_types = [
                BoardType(id=uuid.uuid4(), code=c, name=n, extra_charge=x, description=d)
                for c, n, x, d in BOARD_TYPES
            ]
            session.add_all(board_types)
            await session.flush()
            for prop in properties:
                # 객실만은 모든 숙소가 제공하고, 나머지는 절반 정도만 제공한다
                offered = [board_types[0]] + [b for b in board_types[1:] if RNG.random() < 0.5]
                for board in offered:
                    session.add(PropertyBoardType(property_id=prop.id, board_type_id=board.id))
            await session.flush()

            # ── 6. 투숙객 구분 ───────────────────────────────────────
            session.add_all([
                GuestType(id=uuid.uuid4(), code=c, name=n, discount_amount=d, description=desc)
                for c, n, d, desc in GUEST_TYPES
            ])

            # ── 7. 객실 타입 + 객실 ──────────────────────────────────
            room_types: list[RoomType] = []
            all_rooms: list[Room] = []
            for prop in properties:
                for rt in build_room_types(prop):
                    rooms = build_rooms(rt, is_deluxe=(rt.name == "디럭스"))
                    rt.total_rooms = len(rooms)
                    rt.standard_room_count = sum(1 for r in rooms if r.room_grade == "STANDARD")
                    rt.deluxe_room_count = sum(1 for r in rooms if r.room_grade == "DELUXE")
                    rt.accessible_room_count = sum(1 for r in rooms if r.room_grade == "ACCESSIBLE")
                    room_types.append(rt)
                    all_rooms.extend(rooms)
            session.add_all(room_types)
            await session.flush()
            session.add_all(all_rooms)
            await session.flush()

            # ── 8. 숙박 가능일 ───────────────────────────────────────
            # 하루가 재고 한 줄이다. 영화의 '회차'가 좌석을 열었듯 여기서는 이 행이 객실을 연다.
            board_by_property: dict[uuid.UUID, BoardType] = {}
            for prop in properties:
                board_by_property[prop.id] = board_types[0]

            stay_dates: list[StayDate] = []
            # 과거(-STAY_HISTORY_DAYS)부터 미래(+STAY_HORIZON_DAYS)까지 연다.
            for offset in range(-STAY_HISTORY_DAYS, STAY_HORIZON_DAYS):
                date = today + timedelta(days=offset)
                check_in = date.replace(hour=CHECK_IN_HOUR)
                check_out = (date + timedelta(days=1)).replace(hour=CHECK_OUT_HOUR)
                for rt in room_types:
                    stay_dates.append(StayDate(
                        id=uuid.uuid4(),
                        property_id=rt.property_id,
                        room_type_id=rt.id,
                        board_type_id=board_by_property[rt.property_id].id,
                        check_in=check_in,
                        check_out=check_out,
                        stay_date=date,
                        nights=1,
                        booked_rooms=0,
                    ))
            session.add_all(stay_dates)
            await session.flush()

            # ── 8b. 지난 투숙 이력 ───────────────────────────────────
            # **리뷰의 전제다.** 투숙한 사람만 리뷰를 쓸 수 있게 하려면 투숙 이력이
            # 먼저 있어야 한다. 체크아웃이 지난 CONFIRMED 예약만 "투숙 완료"다 —
            # 예약이 있다는 것과 묵었다는 것은 다르다.
            past_stays = [sd for sd in stay_dates if sd.check_out < now]
            guests = [u for u in users if u.role == "USER"]
            bookings: list[Booking] = []
            for i, sd in enumerate(RNG.sample(past_stays, min(60, len(past_stays)))):
                guest = guests[i % len(guests)]
                # 일부는 취소된 예약으로 둔다. 취소한 사람은 묵지 않았으므로
                # 리뷰를 쓸 수 없어야 하고, 그 경계가 실제로 막히는지 볼 수 있다.
                status = BookingStatusEnum.CANCELLED if i % 7 == 0 else BookingStatusEnum.CONFIRMED
                bookings.append(Booking(
                    id=uuid.uuid4(),
                    booking_number=f"BK{sd.stay_date:%y%m%d}{i:04d}",
                    user_id=guest.id,
                    stay_date_id=sd.id,
                    total_price=BASE_RATE[ROOM_GRADES[0]],
                    status=status,
                    booked_at=sd.check_in - timedelta(days=RNG.randint(1, 14)),
                    guest_breakdown={"ADULT": 2},
                ))
            session.add_all(bookings)
            await session.flush()

            # ── 9. 요금 정책 ─────────────────────────────────────────
            for day_type, day_mult in DAY_MULT.items():
                for season, season_mult in SEASON_MULT.items():
                    for grade in ROOM_GRADES:
                        price = int(BASE_RATE[grade] * day_mult * season_mult / 1000) * 1000
                        session.add(RatePlan(
                            id=uuid.uuid4(), day_type=day_type, season=season,
                            room_grade=grade, price=price,
                        ))

            # ── 10. 성수기 ───────────────────────────────────────────
            year = today.year
            for month, day, label in (
                (7, 25, "여름 성수기"), (8, 1, "여름 성수기"), (8, 15, "광복절 연휴"),
                (10, 3, "개천절 연휴"), (12, 25, "크리스마스"), (12, 31, "연말"),
            ):
                session.add(PeakDate(
                    id=uuid.uuid4(), date=datetime(year, month, day).date(),
                    name=label, extra_charge=30_000,
                    description=f"{label} 요금이 적용된다",
                ))

            await session.commit()

    by_grade = {g: sum(1 for r in all_rooms if r.room_grade == g) for g in ROOM_GRADES}
    print("시드 적재 완료")
    print("  계정: user1@stay.example / pass1234, admin@stay.example / admin1234")
    print(f"  숙소 {len(properties)}개 · 객실타입 {len(room_types)}개 · 객실 {len(all_rooms)}실")
    print(f"    등급별: 스탠다드 {by_grade['STANDARD']} / 디럭스 {by_grade['DELUXE']} / "
          f"장애인 {by_grade['ACCESSIBLE']}")
    print(f"  숙박 가능일 {len(stay_dates)}행 "
          f"(지난 {STAY_HISTORY_DAYS}일 ~ 향후 {STAY_HORIZON_DAYS}일)")
    print(f"  지난 예약 {len(bookings)}건 — 투숙한 사람만 리뷰를 쓸 수 있다")


if __name__ == "__main__":
    asyncio.run(seed())
