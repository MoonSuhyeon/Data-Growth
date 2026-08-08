• 검색·숙소 조회·예약·결제 단계의 행동 데이터 설계 및 수집 구조 구축
• 예약 퍼널별 전환율·이탈률 분석을 위한 데이터 아키텍처 및 KPI 설계
• 고객 행동·예약 데이터를 기반으로 전환 저해 요인을 분석하고 CRO 인사이트 도출
• 지역·숙소·고객 세그먼트별 예약 성과를 분석하는 Growth Dashboard 구축
• 데이터 기반 전환 개선 가설 수립 및 A/B 테스트 설계·검증


# CineSite - 영화 예매 사이트

> CGV를 벤치마킹한 영화 예매 시스템  
> **DB 모델링 심화 학습 프로젝트** — 41개 테이블, 4단계 점진 구현, 비회원 예매 지원

---

## 프로젝트 소개

CineSite는 영화 예매 도메인의 **DB 모델링 + 백엔드 API + 프론트엔드 UI**를 단계별로 구현한 학습용 풀스택 프로젝트입니다.

CGV의 핵심 사용자 플로우를 분석하여 엔티티를 도출하고, MVP → 운영 → 마케팅 → 편의 기능으로 점진 확장하면서 **이론적인 DB 설계가 실무에서 어떻게 변하는지** 직접 경험했습니다.

---

## Tech Stack

### Backend
| 기술 | 버전 | 용도 |
|------|------|------|
| Python | 3.11 | 언어 |
| FastAPI | 0.104 | 웹 프레임워크 (async) |
| SQLAlchemy | 2.0 | ORM (async) |
| asyncpg | 0.29 | PostgreSQL 비동기 드라이버 |
| Alembic | 1.12 | DB 마이그레이션 |
| Pydantic | v2 | 요청/응답 검증 |
| python-jose | 3.3 | JWT 인증 |
| passlib + bcrypt | 1.7 | 비밀번호 해시 |
| PostgreSQL | - | DB (Supabase 호스팅) |

### Frontend
| 기술 | 버전 | 용도 |
|------|------|------|
| React | 18 | UI 프레임워크 |
| TypeScript | 5 | 타입 안전성 |
| Vite | 5 | 빌드 도구 |
| Tailwind CSS | v4 | 스타일링 |
| Zustand | - | 전역 상태 관리 |
| React Router | v6 | 클라이언트 라우팅 |
| Axios | - | HTTP 클라이언트 |
| qrcode.react | - | QR 코드 생성 |

---

## 데이터베이스 설계

### ERD

> `docs/erd.dbml` 파일을 [dbdiagram.io](https://dbdiagram.io)에 붙여넣으면 ERD 시각화 + PNG 다운로드 가능

### 단계별 테이블 분리

| 단계 | 테이블 수 | 영역 | 핵심 |
|------|-----------|------|------|
| 1단계 | 15개 | 핵심 예매 | 회원/영화/극장/좌석/예매/결제 |
| 2단계 | +10 = 25개 | 운영 보강 | 환불/영수증/상영포맷/장르/알림 |
| 3단계 | +11 = 36개 | 마케팅 | 매점/쿠폰/포인트/멤버십/찜 |
| 4단계 | +5 = 41개 | 사용자 편의 | 리뷰/알림설정/감사로그 |
| 코드 테이블 | 14개 (별도) | Lookup | enum 대신 DB 관리 |

---

## DB 모델링 의사결정

### 1. 비회원 예매 처리 — User 설계 (★ 핵심)

**문제**: 비회원도 영화 예매 가능해야 함 (CGV 실제 정책)

**고려한 옵션**:

| 옵션 | 방식 | 판단 |
|------|------|------|
| **옵션 1** | `users.is_guest` 플래그 추가 | ✅ **채택** |
| 옵션 2 | `bookings`에 `guest_name`, `guest_phone` 컬럼 추가 | Booking 테이블 오염 |
| 옵션 3 | Customer 추상화 + Joined Table Inheritance | SQLAlchemy 구현 복잡도 ↑↑ |

**옵션 1 채택 이유**:
- Booking이 항상 `user_id`를 참조 → FK 구조 일관성 유지
- 비회원 → 회원 전환 시 데이터 통합 용이 (user_id 그대로 유지)
- `email`, `hashed_password`를 nullable로만 바꾸는 마이그레이션으로 충분
- `guest_expires_at`으로 상영 후 90일 만료 → 배치로 정리 가능

### 2. 좌석 동시성 — 이중 결제 방지

**문제**: 동시 결제 요청 시 같은 좌석에 이중 예매 발생 가능

**선택**: `SeatHold` 테이블 + `UNIQUE(screening_id, seat_id)` + 10분 TTL + lazy cleanup

```
좌석 선택 → SeatHold 생성 (UNIQUE 충돌 시 즉시 실패)
       ↓
결제 완료 → SeatHold 삭제 + Booking 생성
       ↓
만료(10분) → 다음 사용자 요청 시 만료 Hold 정리 후 재시도
```

**비교 검토**:
- 비관적 락 (`SELECT FOR UPDATE`): 성능 저하, 락 대기 발생
- 낙관적 락 (version 컬럼): 충돌 시 재시도 로직 복잡
- Redis 기반 큐: 추가 인프라 필요

UNIQUE 제약으로 DB 레벨에서 충돌을 빠르게 감지하는 방식 채택.

### 3. 코드 테이블 (Lookup Table) 패턴

**문제**: enum은 운영 중 값 추가/수정이 어렵고, 한국어 표시명·다국어 지원 불가

**해결**: 14개 코드 테이블로 전환

```
BookingStatusCode: PENDING, CONFIRMED, CANCELLED, REFUNDED
PaymentStatusCode: PENDING, SUCCESS, FAILED
SeatGradeCode:     STANDARD, SWEETBOX, WHEELCHAIR
...
```

**효과**:
- 운영 중 관리자 페이지에서 코드 추가 가능
- 한국어 `name`, 설명, 정렬순서, 활성화 여부 관리
- 다국어 지원 확장 용이

### 4. 이력 관리 (Audit Pattern)

이력 레코드는 **추가만 가능, 수정/삭제 없음** 원칙 적용:

| 이력 테이블 | 추적 대상 |
|------------|---------|
| `point_histories` | 포인트 적립/사용/환불/만료 |
| `coupon_usages` | 쿠폰 사용 |
| `seat_change_histories` | 좌석 변경 |
| `user_activities` | 사용자 행동 로그 |
| `admin_audit_logs` | 관리자 변경 감사 |

### 5. 정규화 vs 비정규화

**비정규화 (캐시 컬럼)**:

| 컬럼 | 위치 | 이유 |
|------|------|------|
| `avg_rating`, `review_count` | `movies` | 매번 리뷰 집계 쿼리 방지 |
| `booking_rank` | `movies` | 실시간 순위 정렬 성능 |
| `booking_rate` | `screenings` | 좌석 잔여 현황 빠른 조회 |
| `point_balance` | `users` | 매번 SUM 쿼리 방지 |
| `total_seats` 등 | `halls` | 좌석 통계 빠른 조회 |

일관성 vs 성능 트레이드오프: 쓰기 시 양쪽 업데이트, 읽기 성능 우선.

### 6. 가격 정책 데이터화

**기존**: 코드에 가격 하드코딩  
**변경**: `PricePolicy` 테이블 (요일 유형 × 시간대 × 좌석 등급)

→ 코드 변경 없이 가격 정책 수정 가능, 가격 변경 이력 추적 가능

### 7. 다대다 관계 매핑 테이블

| 관계 | 매핑 테이블 | 추가 정보 |
|------|------------|---------|
| Movie ↔ Genre | `movie_genres` | 단순 매핑 |
| Movie ↔ ScreeningFormat | `movie_formats` | 단순 매핑 |
| Booking ↔ Seat | `booking_seats` | 좌석별 가격 포함 |
| Booking ↔ MenuItem | `booking_menus` | 옵션, 수량 포함 |
| User ↔ Movie (찜) | `favorites` | 생성일시 포함 |
| Review ↔ User (도움) | `review_helpfuls` | 복합 PK |

### 8. 1:1 관계

| 관계 | 방식 | 이유 |
|------|------|------|
| Booking ↔ Payment | UNIQUE FK | 예매당 결제 1건 |
| Booking ↔ Refund | UNIQUE FK | 예매당 환불 1건 |
| Booking ↔ Receipt | UNIQUE FK | 예매당 영수증 1건 |
| BookingSeat ↔ Ticket | UNIQUE FK | 좌석당 티켓 1장 |
| User ↔ NotificationSetting | UNIQUE FK | 사용자당 설정 1개 |

---

## 주요 기능

### 사용자 기능
- 회원가입 / 로그인 (JWT)
- **비회원 예매** ⭐ — 이름+연락처 입력 → 예매번호로 조회
- 영화 목록 / 상세 (장르, 포맷, 평점)
- 영화 예매 5단계 플로우:
  1. 영화 선택
  2. 극장/날짜/시간 선택 (다중 극장 비교)
  3. 좌석 선택 (관람석 인식 + SeatHold 10분 타이머)
  4. 결제 (쿠폰/포인트/멤버십 + 약관 동의 + 확인 모달)
  5. 완료 (예매번호 + QR 코드)
- 마이페이지: 예매 내역, 환불 신청, 영수증
- 찜 목록 / 리뷰 작성
- 알림 설정 / 쿠폰함 / 포인트 내역
- 멤버십 가입

### 관리자 기능
- 대시보드 (통계, 최근 예매)
- 영화 CRUD / 상영 스케줄 관리
- 회원 관리 (권한 변경)
- 환불 처리 / 쿠폰 발급
- 매점 메뉴 관리
- 멤버십 상품 관리
- 감사 로그

---

## 트러블슈팅

### 1. 타임존 버그 — naive vs aware datetime

**문제**: `datetime.utcnow()`가 naive datetime 반환 → 브라우저에서 로컬 타임존으로 잘못 파싱

**해결**:
```python
# DB 저장: naive UTC 유지 (PostgreSQL 비교 호환성)
# API 응답: .replace(tzinfo=timezone.utc) 적용
# 프론트엔드: ISO 8601 + Z 포맷으로 수신
```

**학습**: naive vs aware datetime 차이, DB는 일관된 타임존, API 경계에서만 변환.

### 2. SQLAlchemy 이중 트랜잭션 충돌

**문제**: 회원가입 500 에러 — `async with db.begin()` 사용 시 autobegin과 충돌

**해결**: 명시적 트랜잭션 관리 제거, SQLAlchemy 2.0 autobegin에 의존. 필요한 곳만 nested transaction (savepoint) 사용.

**학습**: 비동기 ORM의 트랜잭션 라이프사이클, 명시적 vs 암묵적 트랜잭션 관리.

### 3. 좌석 동시성 — 데드락 회피

**문제**: 동시 결제 시 데드락 가능성

**해결**: SeatHold UNIQUE 제약으로 DB 레벨 빠른 충돌 감지. 트랜잭션 내 짧은 작업만 수행 (SeatHold 생성 → 검증). 결제 트랜잭션은 외부에서.

**학습**: 트랜잭션 범위 최소화, UNIQUE 제약의 동시성 제어 활용.

### 4. Pydantic v2 마이그레이션

**문제**: `@validator` (v1) → `@field_validator` (v2) 전환 시 저장 실패

**해결**:
```python
# Before (v1)
@validator('field')
def validate_field(cls, v): ...

# After (v2)
@field_validator('field', mode='before')
@classmethod
def validate_field(cls, v): ...
```

**학습**: 메이저 버전 마이그레이션 패턴, Breaking changes 대응.

### 5. Alembic 마이그레이션 — PostgreSQL enum 충돌

**문제**: `alembic upgrade head` 실패 — `refundstatusenum already exists`

**원인**: SQLAlchemy 내부에서 `CREATE TYPE`을 자동 실행하는데, 이미 존재하는 enum과 충돌.

**해결**: raw SQL로 DROP/CREATE/ALTER 패턴 적용:
```python
op.execute("DROP TYPE IF EXISTS refundstatusenum")
op.execute("CREATE TYPE refundstatusenum AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED')")
op.execute("ALTER TABLE refunds ALTER COLUMN status DROP DEFAULT")
op.execute("ALTER TABLE refunds ALTER COLUMN status TYPE refundstatusenum USING status::refundstatusenum")
op.execute("ALTER TABLE refunds ALTER COLUMN status SET DEFAULT 'PENDING'::refundstatusenum")
```

**학습**: Alembic의 내부 동작, PostgreSQL enum 타입 관리, `USING` 캐스팅.

---

## 데이터 플로우 — 예매 트랜잭션

```
1. 좌석 선택
   └─ SeatHold 생성 (UNIQUE 충돌 시 즉시 실패 → 이미 선택된 좌석)

2. 결제 실행
   a. SeatHold 유효성 검증 (만료/소유자 확인)
   b. 가격 계산 (PricePolicy + AudienceType + Format + Coupon + Membership + Point)
   c. 트랜잭션 시작
   d. Booking 생성 (status: PENDING)
   e. BookingSeat 생성 (좌석마다)
   f. Ticket 생성 (QR + ticket_number)
   g. Payment 생성 (status: PENDING)
   h. SeatHold 삭제
   i. Mock 결제 → Payment.status: SUCCESS
   j. Booking.status: CONFIRMED
   k. PointHistory 적립 (결제금액 1%)
   l. CouponUsage 기록
   m. Notification 생성
   n. UserActivity 로그

3. 환불 시
   a. Refund 생성 (PENDING)
   b. 정책 검증 (상영 20분 전까지)
   c. Booking.status: REFUNDED
   d. Mock 환불 → Refund.status: COMPLETED
   e. CouponUsage 복구
   f. PointHistory 복구
```

---

## 설치 및 실행

### 환경 변수

```
# backend/.env
DATABASE_URL=postgresql+asyncpg://user:password@host/dbname
JWT_SECRET=your-secret-key
JWT_EXPIRE_MINUTES=1440
```

```
# frontend/.env
VITE_API_URL=http://localhost:8000/api/v1
```

### 백엔드

```bash
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1   # Windows PowerShell
pip install -r requirements.txt
alembic upgrade head
python -m app.seed
uvicorn app.main:app --reload
# http://localhost:8000/docs
```

### 프론트엔드

```bash
cd frontend
npm install
npm run dev
# http://localhost:5173
```

### 시드 계정

| 이메일 | 비밀번호 | 권한 |
|--------|---------|------|
| user1@cgv.com | password | USER |
| user2@cgv.com | password | USER |
| admin@cgv.com | password | ADMIN |

---

## 디렉터리 구조

```
movie-booking-site/
├── backend/
│   ├── app/
│   │   ├── api/v1/          # REST 엔드포인트 (24개 라우터)
│   │   ├── models/          # SQLAlchemy 모델 (41+ 테이블)
│   │   ├── schemas/         # Pydantic 스키마
│   │   ├── services/        # 비즈니스 로직 (pricing, seat_hold, booking)
│   │   ├── core/            # 설정, 보안, DB 연결
│   │   ├── main.py
│   │   └── seed.py
│   ├── alembic/             # 마이그레이션 (19개 버전)
│   └── requirements.txt
├── frontend/
│   └── src/
│       ├── pages/           # 라우트 페이지
│       ├── components/      # 공통 컴포넌트
│       ├── store/           # Zustand 스토어
│       ├── api/             # API 호출 함수
│       └── types/           # TypeScript 타입 정의
└── docs/
    └── erd.dbml             # dbdiagram.io ERD 소스
```

---

## 시스템 아키텍처

```
Browser
  │
  ├── React 18 (Vite) ──── Zustand (전역 상태)
  │       │
  │    Axios (JWT 헤더 자동 주입)
  │
  ▼
FastAPI (async)
  │
  ├── JWT 미들웨어 (인증/권한)
  ├── Pydantic v2 (요청 검증)
  │
  ├── Services Layer
  │   ├── PricingService    ← PricePolicy + Coupon + Point + Membership
  │   ├── SeatHoldService   ← Hold 생성/만료/정리
  │   └── BookingService    ← 예매 트랜잭션 오케스트레이션
  │
  └── SQLAlchemy 2.0 (async)
          │
       asyncpg
          │
       PostgreSQL (Supabase)
```

---

## 향후 개선

### 단기
- 실제 PG사 연동 (토스페이먼츠, 아임포트)
- Redis 기반 좌석 점유 (성능)
- 이미지 업로드 (S3)

### 중기
- WebSocket 실시간 좌석 현황
- 영화 추천 시스템 (사용자 행동 기반)
- 검색 (Elasticsearch)

### 장기
- 마이크로서비스 분리
- CDN + 캐싱 전략

---

## 학습 포인트

### DB 모델링
- 업무 분석 → 엔티티 도출 과정
- 정규화/비정규화 트레이드오프 사고
- 코드 테이블의 실무적 가치
- 이력 관리 (Audit Pattern) 적용
- 단계별 점진 확장 설계

### 백엔드
- FastAPI async 패턴
- SQLAlchemy 2.0 ORM
- Alembic 마이그레이션 전략
- JWT 인증 + 권한 분리
- 트랜잭션 처리 / 동시성 제어

### 프론트엔드
- React 18 + TypeScript
- Zustand 상태 관리
- 멀티 스텝 예매 위저드
- JWT 인증 복원

### 트러블슈팅
- 타임존 처리 (naive vs aware)
- 비동기 트랜잭션 라이프사이클
- 좌석 동시성 데드락 회피
- 메이저 버전 마이그레이션 (Pydantic v2)
- PostgreSQL enum 충돌 해결

---

## 피드백 반영 이력

| 항목 | 내용 |
|------|------|
| 코드 테이블 도입 | enum → Lookup Table 14개 전환 |
| 상태 관리 강화 | 모든 핵심 엔티티에 status 컬럼 추가 |
| 이력 관리 | 가격/쿠폰/영수증/티켓/좌석 변경 이력 테이블 |
| 누락 정보 보완 | Theater(주차), Hall(위치/좌석 통계), Screening(종료 시간, 추가요금) |
| 캐시 컬럼 | 집계 쿼리 성능 개선용 비정규화 컬럼 |
| 누락 도메인 | 찜, 리뷰 기능 추가 |
