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
    Amenity, BoardType, Booking, CouponMaster, CouponStatusCode, CouponTypeCode,
    GuestType, PeakDate, Property, PropertyAmenity, PropertyBoardType, Prospect,
    RatePlan, Refund, Review, ReviewStatusCode, Room, RoomType, StayDate, Term,
    TermAgreement, User, UserCoupon,
)
from app.models.base import BookingStatusEnum, RefundStatusEnum

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


#: 방 사진. **저장소에 담은 파일을 가리킨다.**
#:
#: 예전에는 `https://picsum.photos/seed/...` 를 넣었다. 그 서비스가 503 을 내는
#: 순간 41개 숙소의 사진이 한꺼번에 사라졌고, 그건 코드가 아니라 **의존 구조**의
#: 문제였다. 데모가 남의 서버 가동 여부에 걸려 있어서는 안 된다.
#:
#: 파일은 `frontend/public/images/rooms/` 에 있고 출처는 같은 폴더의
#: `CREDITS.json` 에 적어 두었다(Unsplash License, 유료분 제외).
ROOM_PHOTO_COUNT = 24
ROOM_PHOTOS = tuple(
    f"/images/rooms/room-{n:02d}.jpg" for n in range(1, ROOM_PHOTO_COUNT + 1)
)


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
                area=area,
                photo_url=ROOM_PHOTOS[len(out) % len(ROOM_PHOTOS)],
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


#: 미입점 숙소 — 획득 영업의 리드 소스.
#:
#: **분포를 일부러 `REGIONS` 와 다르게 깔았다.** 우리 공급과 같은 모양으로 만들면
#: 모든 시장의 갭이 비슷해져 점수가 흩어지지 않고, 정렬이 무의미해진다.
#: 여기서는 공급이 얇은 지역·유형(경주·강릉, 펜션·단독주택)에 후보를 몰아 둔다.
#:
#: **동네도 우리가 없는 곳을 고른다.** `REGIONS` 에 있는 동네를 그대로 쓰면
#: 모든 후보가 "이미 공급이 있는 동네" 가 되어 위치 적합도가 전부 0 이 되고,
#: 점수가 낮은 쪽에 뭉쳐 정렬이 무의미해진다.
#:
#: 마지막 둘은 **걸러져야 하는 후보**다 — 평점 미달과 연락처 없음. 목록에 통과분만
#: 있으면 필터가 동작하는지 화면에서 확인할 수 없다.
PROSPECTS = (
    # (이름, 지역, 동네, 유형, 수용인원, 평점, 이메일, 전화)
    # ↓ 우리 숙소가 **없는** 동네. 위치 적합도가 살아나 점수가 흩어진다.
    ("조천 돌담 독채", "제주", "조천", "PENSION", 4, 4.7, "jocheon@example.com", "064-100-0001"),
    ("안덕 바다뷰 펜션", "제주", "안덕", "PENSION", 6, 4.4, "andeok@example.com", None),
    ("강문 오션 펜션", "강릉", "강문", "PENSION", 4, 4.6, "gangmun@example.com", None),
    # ↓ 우리 숙소가 이미 있는 동네. 대비가 있어야 위치 축이 실제로 도는지 보인다.
    ("표선 정원 단독주택", "제주", "표선", "HOUSE", 8, 4.2, "pyoseon@example.com", None),
    ("사천 솔밭 단독주택", "강릉", "사천", "HOUSE", 6, 4.1, "sacheon@example.com", None),
    ("보문 한옥채", "경주", "보문", "HOUSE", 4, 4.8, "bomun@example.com", "054-100-0002"),
    ("불국사 앞 게스트하우스", "경주", "불국사", "GUESTHOUSE", 12, 4.0, "bulguk@example.com", None),
    ("망원 골목 아파트", "서울", "망원", "APARTMENT", 2, 4.5, "mangwon@example.com", None),
    # ↓ 걸러져야 하는 것들
    ("광안리 저평점 펜션", "부산", "광안리", "PENSION", 4, 2.6, "gwangan@example.com", None),
    ("한림 연락처없는 펜션", "제주", "한림", "PENSION", 4, 4.3, None, None),
)


def build_prospects(now: datetime) -> list[Prospect]:
    """미입점 숙소를 만든다. 우리 원장의 지역 어휘(한글)를 쓴다."""
    return [
        Prospect(
            id=uuid.uuid4(),
            name=name,
            region=region,
            area=area,
            property_type=ptype,
            capacity=capacity,
            rating=rating,
            contact_email=email,
            contact_phone=phone,
            source="seed",
            created_at=now,
        )
        for name, region, area, ptype, capacity, rating, email, phone in PROSPECTS
    ]


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


def say(line: str) -> None:
    """시드 진행 상황을 찍는다. **콘솔이 못 그리는 글자가 있어도 죽지 않는다.**

    Windows 기본 콘솔은 cp949 라 `—` 같은 글자에서 `UnicodeEncodeError` 가 난다.
    그 예외가 시드 안에서 나면 `lifespan` 이 실패하고 **서버가 아예 안 뜬다** —
    로그 한 줄 때문에 데모 전체가 막히는 셈이다. 그리기 실패는 그리기 실패로만
    끝나야 한다.
    """
    try:
        print(line)
    except UnicodeEncodeError:
        print(line.encode("ascii", "replace").decode("ascii"))


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

            # ── 3-1. 미입점 숙소 (획득 영업 대상) ────────────────────
            session.add_all(build_prospects(now))
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

            # ── 8c. 오늘 예약 ────────────────────────────────────────
            # **대시보드가 "오늘"을 본다.** 지난 예약만 있으면 지표가 전부 0 이라
            # 화면이 고장난 것처럼 보인다. 오늘 들어온 예약을 몇 건 만든다.
            # `booked_at` 은 **로컬 날짜**로 찍는다. 대시보드가 `date.today()` 로
            # 비교하는데 시드가 `utcnow()` 를 쓰면 아홉 시간 차이로 어제가 되고,
            # "오늘 예약 0건" 이 나온다 — 데이터는 있는데 지표만 비는 상태다.
            local_now = datetime.now()
            today_stays = [sd for sd in stay_dates if sd.check_in >= now][:6]
            for i, sd in enumerate(today_stays):
                bookings.append(Booking(
                    id=uuid.uuid4(),
                    booking_number=f"BK{now:%y%m%d}T{i:03d}",
                    user_id=guests[i % len(guests)].id,
                    stay_date_id=sd.id,
                    total_price=BASE_RATE[ROOM_GRADES[0]] + i * 12000,
                    status=BookingStatusEnum.CONFIRMED,
                    booked_at=local_now - timedelta(hours=i + 1),
                    guest_breakdown={"ADULT": 2},
                ))
            session.add_all(bookings[-len(today_stays):])
            await session.flush()

            # ── 8d. 코드 테이블 ──────────────────────────────────────
            # 리뷰·쿠폰이 이 코드를 외래키로 가리킨다. 없으면 넣을 수가 없다.
            session.add_all([
                ReviewStatusCode(code="ACTIVE", name="정상", display_order=1),
                ReviewStatusCode(code="REPORTED", name="신고됨", display_order=2),
                ReviewStatusCode(code="HIDDEN", name="숨김", display_order=3),
                ReviewStatusCode(code="DELETED", name="삭제", display_order=4),
                CouponTypeCode(code="PERCENT", name="비율 할인", display_order=1),
                CouponTypeCode(code="FIXED_AMOUNT", name="정액 할인", display_order=2),
                CouponStatusCode(code="ACTIVE", name="사용 가능", display_order=1),
                CouponStatusCode(code="USED", name="사용 완료", display_order=2),
                CouponStatusCode(code="EXPIRED", name="기간 만료", display_order=3),
            ])
            await session.flush()

            # ── 8e. 리뷰 ─────────────────────────────────────────────
            # **투숙한 사람만 쓴다.** 취소한 예약에는 붙이지 않는다 — 그 경계가
            # 데이터에서부터 지켜져야 화면의 검사도 의미가 있다.
            stayed = [b for b in bookings
                      if b.status == BookingStatusEnum.CONFIRMED and b.booked_at < now]
            stay_by_id = {sd.id: sd for sd in stay_dates}
            review_text = (
                "청소 상태가 아주 좋았습니다. 체크인 안내도 친절했어요.",
                "위치가 조용해서 푹 쉬었습니다. 주차도 편했어요.",
                "사진과 거의 같았습니다. 다음에 또 오고 싶네요.",
                "가격 대비 만족스러웠습니다. 수건이 조금 부족했어요.",
                "뷰가 정말 좋습니다. 재방문 의사 있습니다.",
            )
            # 신고·숨김도 섞는다. 정상만 있으면 관리 화면의 탭이 전부 비어 보인다.
            statuses = ["ACTIVE"] * 8 + ["REPORTED", "HIDDEN"]
            # **한 사람이 같은 숙소에 리뷰는 하나뿐이다**(uq_review_user_property).
            # 같은 손님이 같은 숙소에 여러 번 묵은 이력이 있어서, 거르지 않으면
            # 제약에 걸려 시드 전체가 죽는다.
            reviews = []
            seen_pairs = set()
            for i, b in enumerate(RNG.sample(stayed, min(40, len(stayed)))):
                sd = stay_by_id.get(b.stay_date_id)
                if sd is None:
                    continue
                pair = (b.user_id, sd.property_id)
                if pair in seen_pairs:
                    continue
                seen_pairs.add(pair)
                reviews.append(Review(
                    id=uuid.uuid4(),
                    user_id=b.user_id,
                    property_id=sd.property_id,
                    booking_id=b.id,
                    rating=RNG.choice((5, 5, 4, 4, 3)),
                    content=review_text[i % len(review_text)],
                    status_code=statuses[i % len(statuses)],
                    helpful_count=RNG.randint(0, 12),
                    created_at=sd.check_out + timedelta(days=RNG.randint(1, 5)),
                ))
            session.add_all(reviews)
            await session.flush()

            # ── 8f. 쿠폰 ─────────────────────────────────────────────
            coupons = [
                CouponMaster(
                    id=uuid.uuid4(), code="WELCOME10", name="첫 예약 10% 할인",
                    type_code="PERCENT", discount_value=10, min_booking_amount=50000,
                    max_discount_amount=30000, valid_from=now - timedelta(days=30),
                    valid_to=now + timedelta(days=60), max_issues=1000,
                ),
                CouponMaster(
                    id=uuid.uuid4(), code="AUTUMN20000", name="가을 여행 2만원",
                    type_code="FIXED_AMOUNT", discount_value=20000, min_booking_amount=150000,
                    max_discount_amount=None, valid_from=now - timedelta(days=7),
                    valid_to=now + timedelta(days=45), max_issues=500,
                ),
                CouponMaster(
                    id=uuid.uuid4(), code="LONGSTAY15", name="장기 숙박 15%",
                    type_code="PERCENT", discount_value=15, min_booking_amount=300000,
                    max_discount_amount=80000, valid_from=now - timedelta(days=90),
                    # 이미 지난 쿠폰도 하나 둔다 — 만료 표시가 도는지 화면에서 보려면
                    # 만료된 것이 하나는 있어야 한다.
                    valid_to=now - timedelta(days=1), max_issues=200,
                ),
            ]
            session.add_all(coupons)
            await session.flush()

            for i, guest in enumerate(guests):
                for c in coupons[:2]:
                    session.add(UserCoupon(
                        id=uuid.uuid4(), user_id=guest.id, coupon_master_id=c.id,
                        status_code="USED" if i == 0 and c is coupons[0] else "ACTIVE",
                        issued_at=now - timedelta(days=RNG.randint(1, 20)),
                        used_at=now - timedelta(days=2) if i == 0 and c is coupons[0] else None,
                        expires_at=c.valid_to,
                    ))
            await session.flush()

            # ── 8g. 환불 ─────────────────────────────────────────────
            # 취소된 예약에만 붙인다. 상태를 섞어 둬야 관리 화면의 필터가
            # 무엇을 거르는지 눈으로 확인된다.
            cancelled = [b for b in bookings if b.status == BookingStatusEnum.CANCELLED]
            refund_states = [RefundStatusEnum.COMPLETED, RefundStatusEnum.PENDING,
                             RefundStatusEnum.REJECTED]
            for i, b in enumerate(cancelled[:9]):
                state = refund_states[i % len(refund_states)]
                session.add(Refund(
                    id=uuid.uuid4(),
                    booking_id=b.id,
                    refund_amount=int(b.total_price * (1.0 if i % 3 == 0 else 0.8)),
                    reason=("일정이 변경되었습니다", "다른 숙소를 예약했습니다",
                            "개인 사정")[i % 3],
                    status=state,
                    requested_at=b.booked_at + timedelta(days=1),
                    processed_at=(b.booked_at + timedelta(days=2)
                                  if state != RefundStatusEnum.PENDING else None),
                ))
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
    say("시드 적재 완료")
    say("  계정: user1@stay.example / pass1234, admin@stay.example / admin1234")
    say(f"  숙소 {len(properties)}개 · 객실타입 {len(room_types)}개 · 객실 {len(all_rooms)}실")
    say(f"    등급별: 스탠다드 {by_grade['STANDARD']} / 디럭스 {by_grade['DELUXE']} / "
          f"장애인 {by_grade['ACCESSIBLE']}")
    say(f"  숙박 가능일 {len(stay_dates)}행 "
          f"(지난 {STAY_HISTORY_DAYS}일 ~ 향후 {STAY_HORIZON_DAYS}일)")
    say(f"  지난 예약 {len(bookings)}건 — 투숙한 사람만 리뷰를 쓸 수 있다")


if __name__ == "__main__":
    asyncio.run(seed())
