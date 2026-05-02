import asyncio
import json
import uuid
from datetime import datetime, timedelta
from sqlalchemy import text
from app.core.database import AsyncSessionLocal
from app.models import (
    User, Term, TermAgreement, Movie, Theater, Hall, Seat,
    Screening, PricePolicy, AudienceType,
    Genre, MovieGenre, ScreeningFormat, MovieFormat, SpecialPricingDay,
)
from app.core.security import hash_password


# ── 상영관 데이터 (region, short_name) ─────────────────────────────────────
# "CGV " prefix 자동 추가; "씨네드쉐프" / "Drive In" 은 이미 포함된 형태로 입력
THEATER_DATA = [
    # 서울 (28)
    ("서울", "강남"), ("서울", "강변"), ("서울", "건대입구"), ("서울", "고덕강일"),
    ("서울", "구로"), ("서울", "대학로"), ("서울", "동대문"), ("서울", "등촌"),
    ("서울", "명동"), ("서울", "미아"), ("서울", "방학"), ("서울", "불광"),
    ("서울", "상봉"), ("서울", "성신여대입구"), ("서울", "수유"), ("서울", "신촌아트레온"),
    ("서울", "씨네드쉐프 압구정"), ("서울", "씨네드쉐프 용산"), ("서울", "압구정"),
    ("서울", "연남"), ("서울", "영등포타임스퀘어"), ("서울", "왕십리"),
    ("서울", "용산아이파크몰"), ("서울", "중계"), ("서울", "천호"),
    ("서울", "청담씨네시티"), ("서울", "피카디리1958"), ("서울", "홍대"),
    # 경기 (53)
    ("경기", "경기광주"), ("경기", "고양백석"), ("경기", "고양행신"),
    ("경기", "광교"), ("경기", "광교상현"), ("경기", "광명역"),
    ("경기", "구리"), ("경기", "구리갈매"), ("경기", "기흥"),
    ("경기", "김포"), ("경기", "김포운양"), ("경기", "김포한강"),
    ("경기", "남양주화도"), ("경기", "다산"), ("경기", "동두천"),
    ("경기", "동백"), ("경기", "동수원"), ("경기", "동탄"),
    ("경기", "동탄그랑파사쥬"), ("경기", "동탄역"), ("경기", "동탄호수공원"),
    ("경기", "배곧"), ("경기", "범계"), ("경기", "부천"),
    ("경기", "부천역"), ("경기", "산본"), ("경기", "서현"),
    ("경기", "소풍"), ("경기", "스타필드시티위례"), ("경기", "신세계경기"),
    ("경기", "안산"), ("경기", "안성"), ("경기", "야탑"),
    ("경기", "양주옥정"), ("경기", "역곡"), ("경기", "오리"),
    ("경기", "오산중앙"), ("경기", "용인"), ("경기", "의정부"),
    ("경기", "이천"), ("경기", "일산"), ("경기", "파주문산"),
    ("경기", "파주운정"), ("경기", "판교"), ("경기", "평촌"),
    ("경기", "평택"), ("경기", "평택고덕"), ("경기", "평택소사"),
    ("경기", "포천"), ("경기", "화성봉담"), ("경기", "화정"),
    ("경기", "Drive In 용인 크랙사이드"),
    # 인천 (11)
    ("인천", "계양"), ("인천", "부평"), ("인천", "송도타임스페이스"),
    ("인천", "인천"), ("인천", "인천가정"), ("인천", "인천도화"),
    ("인천", "인천시민공원"), ("인천", "인천연수"), ("인천", "인천학익"),
    ("인천", "주안역"), ("인천", "청라"),
    # 강원 (5)
    ("강원", "강릉"), ("강원", "기린"), ("강원", "원통"),
    ("강원", "인제"), ("강원", "춘천"),
    # 대전/충청 (20)
    ("대전/충청", "논산"), ("대전/충청", "당진"), ("대전/충청", "대전"),
    ("대전/충청", "대전가수원"), ("대전/충청", "대전가오"), ("대전/충청", "대전탄방"),
    ("대전/충청", "대전터미널"), ("대전/충청", "서산"), ("대전/충청", "세종"),
    ("대전/충청", "아산"), ("대전/충청", "유성노은"), ("대전/충청", "천안"),
    ("대전/충청", "천안터미널"), ("대전/충청", "천안펜타포트"), ("대전/충청", "청주(서문)"),
    ("대전/충청", "청주지웰시티"), ("대전/충청", "청주터미널"),
    ("대전/충청", "충북혁신"), ("대전/충청", "충주교현"), ("대전/충청", "홍성"),
    # 대구 (7)
    ("대구", "대구"), ("대구", "대구스타디움"), ("대구", "대구연경"),
    ("대구", "대구월성"), ("대구", "대구죽전"), ("대구", "대구한일"), ("대구", "대구현대"),
    # 부산/울산 (18)
    ("부산/울산", "대연"), ("부산/울산", "동래"), ("부산/울산", "부산명지"),
    ("부산/울산", "서면"), ("부산/울산", "서면삼정타워"), ("부산/울산", "서면상상마당"),
    ("부산/울산", "센텀시티"), ("부산/울산", "씨네드쉐프 센텀"), ("부산/울산", "아시아드"),
    ("부산/울산", "울산동구"), ("부산/울산", "울산삼산"), ("부산/울산", "울산성남"),
    ("부산/울산", "울산신천"), ("부산/울산", "울산진장"), ("부산/울산", "정관"),
    ("부산/울산", "하단아트몰링"), ("부산/울산", "해운대"), ("부산/울산", "Drive In 영도"),
    # 경상 (15)
    ("경상", "거제"), ("경상", "경산"), ("경상", "고성"),
    ("경상", "구미"), ("경상", "김천율곡"), ("경상", "김해"),
    ("경상", "김해율하"), ("경상", "김해장유"), ("경상", "마산"),
    ("경상", "북포항"), ("경상", "안동"), ("경상", "양산삼호"),
    ("경상", "진주혁신"), ("경상", "창원더시티"), ("경상", "창원상남"),
    # 광주/전라/제주 (20)
    ("광주/전라/제주", "광양"), ("광주/전라/제주", "광양 엘에프스퀘어"),
    ("광주/전라/제주", "광주금남로"), ("광주/전라/제주", "광주상무"),
    ("광주/전라/제주", "광주용봉"), ("광주/전라/제주", "광주첨단"),
    ("광주/전라/제주", "광주충장로"), ("광주/전라/제주", "광주하남"),
    ("광주/전라/제주", "나주"), ("광주/전라/제주", "목포평화광장"),
    ("광주/전라/제주", "서전주"), ("광주/전라/제주", "순천신대"),
    ("광주/전라/제주", "여수웅천"), ("광주/전라/제주", "익산"),
    ("광주/전라/제주", "전주고사"), ("광주/전라/제주", "전주에코시티"),
    ("광주/전라/제주", "전주효자"), ("광주/전라/제주", "정읍"),
    ("광주/전라/제주", "제주"), ("광주/전라/제주", "제주노형"),
]

# 특별관 보유 극장: short_name → (hall_name, rows, cols)
SPECIAL_HALL = {
    "강남":           ("4DX관",    8, 12),
    "용산아이파크몰":  ("IMAX관",   10, 16),
    "영등포타임스퀘어":("ScreenX관", 9, 14),
    "왕십리":         ("4DX관",    8, 12),
    "홍대":           ("ScreenX관", 9, 13),
    "센텀시티":       ("IMAX관",   10, 16),
    "해운대":         ("4DX관",    8, 12),
    "동래":           ("ScreenX관", 9, 13),
    "판교":           ("4DX관",    8, 12),
    "광교":           ("ScreenX관", 9, 13),
    "대구":           ("IMAX관",   10, 16),
    "대전":           ("ScreenX관", 9, 13),
    "광주상무":       ("4DX관",    8, 12),
    "인천":           ("4DX관",    8, 12),
    "춘천":           ("ScreenX관", 9, 13),
}

REGION_CITY = {
    "서울": "서울특별시",
    "경기": "경기도",
    "인천": "인천광역시",
    "강원": "강원특별자치도",
    "대전/충청": "충청도",
    "대구": "대구광역시",
    "부산/울산": "부산광역시",
    "경상": "경상도",
    "광주/전라/제주": "전라도",
}

# 이름 앞부분으로 도시 오버라이드
CITY_PREFIX_OVERRIDE = {
    "대전": "대전광역시", "유성": "대전광역시 유성구",
    "울산": "울산광역시",
    "광주": "광주광역시",
    "제주": "제주특별자치도",
    "인천": "인천광역시",
    "부산": "부산광역시",
    "대구": "대구광역시",
}


def full_name(short: str) -> str:
    if short.startswith("Drive In") or short.startswith("씨네드쉐프"):
        return f"CGV {short}"
    return f"CGV {short}"


def make_address(region: str, short: str) -> str:
    for prefix, city in CITY_PREFIX_OVERRIDE.items():
        if short.startswith(prefix):
            return f"{city} {short}"
    return f"{REGION_CITY[region]} {short}"


def make_seats(hall_id: uuid.UUID, rows: int, cols: int,
               sweetbox_rows: int = 2, sweetbox_cols: int = 7,
               wheelchair: bool = True) -> list[Seat]:
    seats = []
    sweetbox_start = rows - sweetbox_rows
    for r in range(rows):
        row_char = chr(ord('A') + r)
        is_sb_row = r >= sweetbox_start
        if is_sb_row:
            offset = (cols - sweetbox_cols) // 2 + 1
            for num in range(offset, offset + sweetbox_cols):
                seats.append(Seat(id=uuid.uuid4(), hall_id=hall_id,
                                  row=row_char, number=num, seat_grade="SWEETBOX"))
        else:
            for num in range(1, cols + 1):
                grade = "WHEELCHAIR" if (r == 0 and num <= 2 and wheelchair) else "STANDARD"
                seats.append(Seat(id=uuid.uuid4(), hall_id=hall_id,
                                  row=row_char, number=num, seat_grade=grade))
    return seats


def make_sweetbox_hall(hall_id: uuid.UUID, rows: int, cols: int) -> list[Seat]:
    return [
        Seat(id=uuid.uuid4(), hall_id=hall_id,
             row=chr(ord('A') + r), number=num, seat_grade="SWEETBOX")
        for r in range(rows)
        for num in range(1, cols + 1)
    ]


async def seed():
    async with AsyncSessionLocal() as session:
        await session.execute(text(
            "TRUNCATE TABLE "
            "notifications, seat_change_history, receipts, refunds, "
            "payments, tickets, booking_seats, seat_holds, bookings, "
            "movie_genres, movie_formats, screenings, seats, term_agreements, halls, "
            "audience_types, price_policies, special_pricing_days, "
            "screening_formats, genres, movies, terms, theaters, users CASCADE"
        ))
        await session.commit()

        async with session.begin():

            # ── 1. Users ──────────────────────────────────────────────
            users = [
                User(id=uuid.uuid4(), email="user1@cgv.com",
                     hashed_password=hash_password("pass1234"),
                     name="김민준", phone="010-1234-5678", role="USER"),
                User(id=uuid.uuid4(), email="user2@cgv.com",
                     hashed_password=hash_password("pass1234"),
                     name="이서연", phone="010-2345-6789", role="USER"),
                User(id=uuid.uuid4(), email="admin@cgv.com",
                     hashed_password=hash_password("admin1234"),
                     name="관리자", phone="010-9999-0000", role="ADMIN"),
            ]
            session.add_all(users)
            await session.flush()

            # ── 2. Terms ──────────────────────────────────────────────
            terms = [
                Term(id=uuid.uuid4(), type="SERVICE", version=1,
                     content="서비스 이용약관 내용입니다.",
                     required=True, effective_from=datetime.utcnow()),
                Term(id=uuid.uuid4(), type="PRIVACY", version=1,
                     content="개인정보 처리방침 내용입니다.",
                     required=True, effective_from=datetime.utcnow()),
                Term(id=uuid.uuid4(), type="MARKETING", version=1,
                     content="마케팅 정보 수신 동의 내용입니다.",
                     required=False, effective_from=datetime.utcnow()),
            ]
            session.add_all(terms)
            await session.flush()
            for i in range(2):
                for term in terms:
                    session.add(TermAgreement(
                        id=uuid.uuid4(), user_id=users[i].id,
                        term_id=term.id, agreed_at=datetime.utcnow()))
            await session.flush()

            # ── 3. Movies ──────────────────────────────────────────────
            now = datetime.utcnow()
            movies = [
                Movie(id=uuid.uuid4(), title="파묘", title_en="Exhuma",
                      synopsis="거액의 의뢰를 받은 무속인들이 기이한 병이 대물림되는 집안의 묫자리를 파헤치기 시작한다.",
                      director="장재현", cast=json.dumps(["최민식", "김고은", "유해진", "이도현"]),
                      runtime=134, rating="AGE_15",
                      poster_url="https://picsum.photos/seed/exhuma/300/450",
                      release_date=now - timedelta(days=60), status="NOW_SHOWING"),
                Movie(id=uuid.uuid4(), title="베테랑 2", title_en="Veteran 2",
                      synopsis="대한민국 최고의 광역수사대 형사 서도철이 더 강력한 악당과 맞붙는다.",
                      director="류승완", cast=json.dumps(["황정민", "정해인", "이솜", "박명훈"]),
                      runtime=119, rating="AGE_15",
                      poster_url="https://picsum.photos/seed/veteran2/300/450",
                      release_date=now - timedelta(days=30), status="NOW_SHOWING"),
                Movie(id=uuid.uuid4(), title="위키드", title_en="Wicked",
                      synopsis="오즈의 마법사 세계를 새롭게 해석한 뮤지컬 영화.",
                      director="존 M. 추", cast=json.dumps(["신시아 에리보", "아리아나 그란데", "조나단 베일리"]),
                      runtime=160, rating="ALL",
                      poster_url="https://picsum.photos/seed/wicked/300/450",
                      release_date=now - timedelta(days=45), status="NOW_SHOWING"),
                Movie(id=uuid.uuid4(), title="데드풀과 울버린", title_en="Deadpool & Wolverine",
                      synopsis="마블 역대 최초 R등급 슈퍼히어로 팀업. 데드풀이 MCU에 합류한다.",
                      director="숀 레비", cast=json.dumps(["라이언 레이놀즈", "휴 잭맨", "엠마 코린"]),
                      runtime=128, rating="AGE_15",
                      poster_url="https://picsum.photos/seed/deadpool/300/450",
                      release_date=now - timedelta(days=90), status="NOW_SHOWING"),
                Movie(id=uuid.uuid4(), title="인사이드 아웃 2", title_en="Inside Out 2",
                      synopsis="라일리의 새로운 감정들이 등장한다.",
                      director="켈시 만", cast=json.dumps(["에이미 포엘러", "마야 호크", "켄싱턴 탤먼"]),
                      runtime=100, rating="ALL",
                      poster_url="https://picsum.photos/seed/insideout2/300/450",
                      release_date=now - timedelta(days=120), status="NOW_SHOWING"),
                Movie(id=uuid.uuid4(), title="미키 17", title_en="Mickey 17",
                      synopsis="우주 탐사 임무에 참여한 소모용 직원 미키의 이야기.",
                      director="봉준호", cast=json.dumps(["로버트 패틴슨", "나오미 아키", "유 여정"]),
                      runtime=137, rating="AGE_12",
                      poster_url="https://picsum.photos/seed/mickey17/300/450",
                      release_date=now + timedelta(days=14), status="COMING_SOON"),
            ]
            session.add_all(movies)
            await session.flush()

            # ── 3b. Genres + MovieGenres ────────────────────────────────
            genre_data = ["액션", "드라마", "코미디", "공포", "SF", "애니메이션", "로맨스", "스릴러", "뮤지컬", "가족"]
            genres = [Genre(id=uuid.uuid4(), name=name) for name in genre_data]
            session.add_all(genres)
            await session.flush()

            genre_map = {g.name: g for g in genres}
            movie_genre_assignments = {
                "파묘": ["공포", "스릴러"],
                "베테랑 2": ["액션", "드라마"],
                "위키드": ["뮤지컬", "로맨스"],
                "데드풀과 울버린": ["액션", "코미디"],
                "인사이드 아웃 2": ["애니메이션", "가족"],
                "미키 17": ["SF", "드라마"],
            }
            for movie in movies:
                for genre_name in movie_genre_assignments.get(movie.title, []):
                    if genre_name in genre_map:
                        session.add(MovieGenre(movie_id=movie.id, genre_id=genre_map[genre_name].id))
            await session.flush()

            # ── 3c. ScreeningFormats + MovieFormats ─────────────────────
            formats_data = [
                ("2D", "2D", 0, "일반 2D 상영"),
                ("3D", "3D", 2000, "3D 입체 상영"),
                ("IMAX", "IMAX", 5000, "IMAX 대형 스크린 상영"),
                ("4DX", "4DX", 7000, "4DX 체험형 상영"),
                ("SCREENX", "ScreenX", 4000, "270도 파노라마 상영"),
            ]
            screening_formats = [
                ScreeningFormat(id=uuid.uuid4(), code=code, name=name, extra_charge=charge, description=desc)
                for code, name, charge, desc in formats_data
            ]
            session.add_all(screening_formats)
            await session.flush()

            fmt_map = {f.code: f for f in screening_formats}
            movie_format_assignments = {
                "파묘": ["2D", "4DX"],
                "베테랑 2": ["2D", "IMAX", "4DX"],
                "위키드": ["2D", "3D", "IMAX"],
                "데드풀과 울버린": ["2D", "4DX", "SCREENX"],
                "인사이드 아웃 2": ["2D", "3D"],
                "미키 17": ["2D", "IMAX"],
            }
            for movie in movies:
                for fmt_code in movie_format_assignments.get(movie.title, ["2D"]):
                    if fmt_code in fmt_map:
                        session.add(MovieFormat(movie_id=movie.id, format_id=fmt_map[fmt_code].id))
            await session.flush()

            # ── 3d. SpecialPricingDays ──────────────────────────────────
            from datetime import date as date_type
            today_date = date_type.today()
            special_days_data = [
                (today_date, "문화의 날", 0, "매월 마지막 수요일 문화의 날 - 기본 요금 적용"),
            ]
            for d, name, charge, desc in special_days_data:
                session.add(SpecialPricingDay(id=uuid.uuid4(), date=d, name=name, extra_charge=charge, description=desc))
            await session.flush()

            # ── 3e. AudienceTypes ───────────────────────────────────────
            audience_types_data = [
                ("ADULT", "성인", 0, "만 18세 이상"),
                ("TEENAGER", "청소년", -2000, "만 13~17세"),
                ("CHILD", "어린이", -4000, "만 4~12세"),
                ("SENIOR", "경로", -2000, "만 65세 이상"),
                ("DISABLED", "장애인", -4000, "장애인 할인"),
            ]
            for code, name, discount, desc in audience_types_data:
                session.add(AudienceType(
                    id=uuid.uuid4(), code=code, name=name,
                    discount_amount=discount, description=desc, is_active=True
                ))
            await session.flush()

            # ── 4. Theaters ────────────────────────────────────────────
            theaters = [
                Theater(
                    id=uuid.uuid4(),
                    name=full_name(short),
                    region=region,
                    address=make_address(region, short),
                    phone="1544-1122",
                )
                for region, short in THEATER_DATA
            ]
            session.add_all(theaters)
            await session.flush()

            # ── 5. Halls + Seats ────────────────────────────────────────
            halls: list[Hall] = []
            all_seats: list[Seat] = []

            for (_, short), theater in zip(THEATER_DATA, theaters):
                is_sweetbox_theater = "씨네드쉐프" in short
                is_drive_in = short.startswith("Drive In")

                if is_drive_in:
                    # Drive In: 드라이브인관 1개
                    hall_id = uuid.uuid4()
                    seats = make_seats(hall_id, 8, 15, 0, 0, False)
                    halls.append(Hall(id=hall_id, theater_id=theater.id,
                                     name="드라이브인관", total_seats=len(seats)))
                    all_seats.extend(seats)

                elif is_sweetbox_theater:
                    # 씨네드쉐프: 전석 스위트박스 2관
                    for hall_name, rows, cols in [("1관", 5, 8), ("2관", 5, 8)]:
                        hall_id = uuid.uuid4()
                        seats = make_sweetbox_hall(hall_id, rows, cols)
                        halls.append(Hall(id=hall_id, theater_id=theater.id,
                                         name=hall_name, total_seats=len(seats)))
                        all_seats.extend(seats)

                else:
                    # 일반 극장: 2D 1관 + 2D 2관
                    for hall_name, rows, cols in [("1관", 9, 13), ("2관", 8, 11)]:
                        hall_id = uuid.uuid4()
                        seats = make_seats(hall_id, rows, cols, 2, 7, True)
                        halls.append(Hall(id=hall_id, theater_id=theater.id,
                                         name=hall_name, total_seats=len(seats)))
                        all_seats.extend(seats)

                    # 특별관 (해당 극장만)
                    if short in SPECIAL_HALL:
                        sp_name, rows, cols = SPECIAL_HALL[short]
                        hall_id = uuid.uuid4()
                        seats = make_seats(hall_id, rows, cols, 2, 8, False)
                        halls.append(Hall(id=hall_id, theater_id=theater.id,
                                         name=sp_name, total_seats=len(seats)))
                        all_seats.extend(seats)

            session.add_all(halls)
            await session.flush()
            session.add_all(all_seats)
            await session.flush()

            # ── 6. Screenings ────────────────────────────────────────────
            showing_movies = [m for m in movies if m.status == "NOW_SHOWING"]
            time_slots = [(9, 30), (13, 30), (19, 0)]
            today = now.replace(hour=0, minute=0, second=0, microsecond=0)

            # 일반 2D관 (특별관 제외)
            def is_special(h: Hall) -> bool:
                return any(k in h.name for k in ["4DX", "IMAX", "ScreenX", "드라이브인"])

            general_halls = [h for h in halls if not is_special(h)]
            special_halls = [h for h in halls if is_special(h)]

            # 극장별 일반관 그룹핑
            hall_by_theater: dict[str, list] = {}
            for h in general_halls:
                key = str(h.theater_id)
                hall_by_theater.setdefault(key, []).append(h)
            theater_hall_groups = list(hall_by_theater.values())

            screenings: list[Screening] = []
            for day_offset in range(7):
                date = today + timedelta(days=day_offset)
                for i, movie in enumerate(showing_movies):
                    # 각 극장에서 관 번호를 영화별로 순환 배정
                    assigned = [group[i % len(group)] for group in theater_hall_groups]
                    # 인기 영화 2편은 특별관에도 편성
                    if i < 2:
                        assigned += special_halls

                    for hall in assigned:
                        for hour, minute in time_slots:
                            start = date.replace(hour=hour, minute=minute)
                            end = start + timedelta(minutes=movie.runtime + 20)
                            screenings.append(Screening(
                                id=uuid.uuid4(),
                                movie_id=movie.id,
                                hall_id=hall.id,
                                start_time=start,
                                end_time=end,
                                screening_date=date,
                            ))

            session.add_all(screenings)
            await session.flush()

            # ── 7. Price Policies ──────────────────────────────────────
            price_data = [
                ("WEEKDAY", "MORNING",   "STANDARD",   10000),
                ("WEEKDAY", "AFTERNOON", "STANDARD",   14000),
                ("WEEKDAY", "EVENING",   "STANDARD",   14000),
                ("WEEKDAY", "NIGHT",     "STANDARD",   14000),
                ("WEEKEND", "MORNING",   "STANDARD",   11000),
                ("WEEKEND", "AFTERNOON", "STANDARD",   15000),
                ("WEEKEND", "EVENING",   "STANDARD",   15000),
                ("WEEKEND", "NIGHT",     "STANDARD",   15000),
                ("WEEKDAY", "MORNING",   "SWEETBOX",   23000),
                ("WEEKDAY", "AFTERNOON", "SWEETBOX",   23000),
                ("WEEKDAY", "EVENING",   "SWEETBOX",   23000),
                ("WEEKDAY", "NIGHT",     "SWEETBOX",   23000),
                ("WEEKEND", "MORNING",   "SWEETBOX",   25000),
                ("WEEKEND", "AFTERNOON", "SWEETBOX",   25000),
                ("WEEKEND", "EVENING",   "SWEETBOX",   25000),
                ("WEEKEND", "NIGHT",     "SWEETBOX",   25000),
                ("WEEKDAY", "MORNING",   "WHEELCHAIR", 10000),
                ("WEEKDAY", "AFTERNOON", "WHEELCHAIR", 14000),
                ("WEEKDAY", "EVENING",   "WHEELCHAIR", 14000),
                ("WEEKDAY", "NIGHT",     "WHEELCHAIR", 14000),
                ("WEEKEND", "MORNING",   "WHEELCHAIR", 11000),
                ("WEEKEND", "AFTERNOON", "WHEELCHAIR", 15000),
                ("WEEKEND", "EVENING",   "WHEELCHAIR", 15000),
                ("WEEKEND", "NIGHT",     "WHEELCHAIR", 15000),
            ]
            for day_type, time_slot, seat_grade, price in price_data:
                session.add(PricePolicy(
                    id=uuid.uuid4(), day_type=day_type,
                    time_slot=time_slot, seat_grade=seat_grade, price=price))

            await session.commit()

    std = sum(1 for s in all_seats if s.seat_grade == "STANDARD")
    swb = sum(1 for s in all_seats if s.seat_grade == "SWEETBOX")
    wc  = sum(1 for s in all_seats if s.seat_grade == "WHEELCHAIR")
    print("Seed data loaded successfully!")
    print(f"  Accounts: user1@cgv.com / pass1234, admin@cgv.com / admin1234")
    print(f"  Movies: {len(movies)}개 ({len(showing_movies)}개 상영 중)")
    print(f"  Theaters: {len(theaters)}개, Halls: {len(halls)}개")
    print(f"  Seats: 총 {len(all_seats)}석 (일반 {std} / 스위트박스 {swb} / 장애인 {wc})")
    print(f"  Screenings: {len(screenings)}개")


if __name__ == "__main__":
    asyncio.run(seed())
