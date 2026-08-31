/* 이 파일은 `scripts/gen-fixtures.mjs` 가 만든다. **손으로 고치지 않는다.**
 *
 * 실제 서비스 응답을 그대로 받아 적은 것이라 모양과 분량이 실물과 같다.
 * 고칠 것이 있으면 시드나 서비스를 고치고 다시 뽑는다.
 *
 *     node scripts/gen-fixtures.mjs
 *
 * 생성 시각: 2026-08-31T21:52:27.632Z
 */

/** 기회 상세로 바로 들어오는 주소가 있어 id 를 고정한다. */
export const DEMO_OPPORTUNITY_ID = "150e1abf-373d-42f6-9dc9-5502dcb6b3b4"

export const GEN_PROPERTIES = [
  {
    "id": "686fbe51-3036-493a-a40f-725e4186006f",
    "name": "연남 시티뷰 아파트",
    "name_en": null,
    "description": "서울특별시 연남에 있는 아파트입니다. 최대 3인까지 묵을 수 있고, 체크인은 15시, 체크아웃은 11시입니다.",
    "host_name": "박도윤",
    "highlights": [
      "전 객실 오션뷰",
      "장기 숙박 할인",
      "도보 5분 거리 지하철"
    ],
    "max_guests": 3,
    "property_type": "APARTMENT",
    "photo_url": "/images/rooms/room-01.jpg",
    "listed_at": "2026-02-17T21:52:24.583042",
    "status": "LISTED",
    "region": "서울",
    "address": "서울특별시 연남로 55",
    "avg_rating": null,
    "review_count": 0
  },
  {
    "id": "7f786cb1-838c-4239-a806-42d18e286155",
    "name": "성수 스위트 호텔",
    "name_en": null,
    "description": "서울특별시 성수에 있는 호텔입니다. 최대 2인까지 묵을 수 있고, 체크인은 15시, 체크아웃은 11시입니다.",
    "host_name": "정하준",
    "highlights": [
      "주차 무료",
      "전 객실 오션뷰",
      "장기 숙박 할인"
    ],
    "max_guests": 2,
    "property_type": "HOTEL",
    "photo_url": "/images/rooms/room-02.jpg",
    "listed_at": "2026-02-09T21:52:24.583042",
    "status": "LISTED",
    "region": "서울",
    "address": "서울특별시 성수로 32",
    "avg_rating": null,
    "review_count": 0
  },
  {
    "id": "b3b17692-6482-4617-9fbe-d401b0c9e853",
    "name": "익선동 북카페 게스트하우스",
    "name_en": null,
    "description": "서울특별시 익선동에 있는 게스트하우스입니다. 최대 2인까지 묵을 수 있고, 체크인은 15시, 체크아웃은 11시입니다.",
    "host_name": "정하준",
    "highlights": [
      "전 객실 오션뷰",
      "셀프 체크인",
      "조용한 주택가"
    ],
    "max_guests": 2,
    "property_type": "GUESTHOUSE",
    "photo_url": "/images/rooms/room-03.jpg",
    "listed_at": "2025-10-28T21:52:24.583042",
    "status": "LISTED",
    "region": "서울",
    "address": "서울특별시 익선동로 7",
    "avg_rating": null,
    "review_count": 0
  },
  {
    "id": "593a9e16-dbca-42f3-80f7-4be2221b8d3a",
    "name": "서촌 독채 펜션",
    "name_en": null,
    "description": "서울특별시 서촌에 있는 펜션입니다. 최대 4인까지 묵을 수 있고, 체크인은 15시, 체크아웃은 11시입니다.",
    "host_name": "최지우",
    "highlights": [
      "셀프 체크인",
      "도보 5분 거리 지하철",
      "장기 숙박 할인"
    ],
    "max_guests": 4,
    "property_type": "PENSION",
    "photo_url": "/images/rooms/room-04.jpg",
    "listed_at": "2026-02-21T21:52:24.583042",
    "status": "LISTED",
    "region": "서울",
    "address": "서울특별시 서촌로 31",
    "avg_rating": null,
    "review_count": 0
  },
  {
    "id": "ca3480bf-6993-4501-ae00-5031eeec3e2c",
    "name": "한남 정원 단독주택",
    "name_en": null,
    "description": "서울특별시 한남에 있는 단독주택입니다. 최대 4인까지 묵을 수 있고, 체크인은 15시, 체크아웃은 11시입니다.",
    "host_name": "정하준",
    "highlights": [
      "장기 숙박 할인",
      "주차 무료",
      "전 객실 오션뷰"
    ],
    "max_guests": 4,
    "property_type": "HOUSE",
    "photo_url": "/images/rooms/room-05.jpg",
    "listed_at": "2026-01-13T21:52:24.583042",
    "status": "LISTED",
    "region": "서울",
    "address": "서울특별시 한남로 77",
    "avg_rating": null,
    "review_count": 0
  },
  {
    "id": "fbc52bc2-7c7b-4615-98ef-08634a1281c0",
    "name": "망원 복층 아파트",
    "name_en": null,
    "description": "서울특별시 망원에 있는 아파트입니다. 최대 2인까지 묵을 수 있고, 체크인은 15시, 체크아웃은 11시입니다.",
    "host_name": "최지우",
    "highlights": [
      "전 객실 오션뷰",
      "도보 5분 거리 지하철",
      "주차 무료"
    ],
    "max_guests": 2,
    "property_type": "APARTMENT",
    "photo_url": "/images/rooms/room-06.jpg",
    "listed_at": "2026-01-30T21:52:24.583042",
    "status": "LISTED",
    "region": "서울",
    "address": "서울특별시 망원로 31",
    "avg_rating": null,
    "review_count": 0
  },
  {
    "id": "c6f3216a-91e4-4dc3-881a-8c3b80377d73",
    "name": "연남 오션뷰 호텔",
    "name_en": null,
    "description": "서울특별시 연남에 있는 호텔입니다. 최대 2인까지 묵을 수 있고, 체크인은 15시, 체크아웃은 11시입니다.",
    "host_name": "정하준",
    "highlights": [
      "전 객실 오션뷰",
      "도보 5분 거리 지하철",
      "장기 숙박 할인"
    ],
    "max_guests": 2,
    "property_type": "HOTEL",
    "photo_url": "/images/rooms/room-07.jpg",
    "listed_at": "2025-10-17T21:52:24.583042",
    "status": "LISTED",
    "region": "서울",
    "address": "서울특별시 연남로 58",
    "avg_rating": null,
    "review_count": 0
  },
  {
    "id": "b589ae3c-0770-457e-9335-27c1f7550c2b",
    "name": "성수 라운지 게스트하우스",
    "name_en": null,
    "description": "서울특별시 성수에 있는 게스트하우스입니다. 최대 2인까지 묵을 수 있고, 체크인은 15시, 체크아웃은 11시입니다.",
    "host_name": "김민준",
    "highlights": [
      "조용한 주택가",
      "도보 5분 거리 지하철",
      "장기 숙박 할인"
    ],
    "max_guests": 2,
    "property_type": "GUESTHOUSE",
    "photo_url": "/images/rooms/room-08.jpg",
    "listed_at": "2026-04-07T21:52:24.583042",
    "status": "LISTED",
    "region": "서울",
    "address": "서울특별시 성수로 51",
    "avg_rating": null,
    "review_count": 0
  },
  {
    "id": "8e11c61d-942f-4aff-8dec-a4bf722677ef",
    "name": "익선동 바비큐 펜션",
    "name_en": null,
    "description": "서울특별시 익선동에 있는 펜션입니다. 최대 2인까지 묵을 수 있고, 체크인은 15시, 체크아웃은 11시입니다.",
    "host_name": "박도윤",
    "highlights": [
      "전 객실 오션뷰",
      "장기 숙박 할인",
      "주차 무료"
    ],
    "max_guests": 2,
    "property_type": "PENSION",
    "photo_url": "/images/rooms/room-09.jpg",
    "listed_at": "2026-02-21T21:52:24.583042",
    "status": "LISTED",
    "region": "서울",
    "address": "서울특별시 익선동로 105",
    "avg_rating": null,
    "review_count": 0
  },
  {
    "id": "88150e87-e104-4fb2-a873-2635550d0685",
    "name": "서촌 한옥 단독주택",
    "name_en": null,
    "description": "서울특별시 서촌에 있는 단독주택입니다. 최대 2인까지 묵을 수 있고, 체크인은 15시, 체크아웃은 11시입니다.",
    "host_name": "최지우",
    "highlights": [
      "조용한 주택가",
      "장기 숙박 할인",
      "전 객실 오션뷰"
    ],
    "max_guests": 2,
    "property_type": "HOUSE",
    "photo_url": "/images/rooms/room-10.jpg",
    "listed_at": "2026-04-08T21:52:24.583042",
    "status": "LISTED",
    "region": "서울",
    "address": "서울특별시 서촌로 9",
    "avg_rating": null,
    "review_count": 0
  },
  {
    "id": "fb0e8688-8f06-4ac5-8d17-f6b2bbedd3b3",
    "name": "한남 루프탑 아파트",
    "name_en": null,
    "description": "서울특별시 한남에 있는 아파트입니다. 최대 6인까지 묵을 수 있고, 체크인은 15시, 체크아웃은 11시입니다.",
    "host_name": "정하준",
    "highlights": [
      "셀프 체크인",
      "전 객실 오션뷰",
      "주차 무료"
    ],
    "max_guests": 6,
    "property_type": "APARTMENT",
    "photo_url": "/images/rooms/room-11.jpg",
    "listed_at": "2025-09-24T21:52:24.583042",
    "status": "LISTED",
    "region": "서울",
    "address": "서울특별시 한남로 9",
    "avg_rating": null,
    "review_count": 0
  },
  {
    "id": "2e9516e5-5e8f-415b-bc1e-1f17fa8d9ea0",
    "name": "망원 시티 호텔",
    "name_en": null,
    "description": "서울특별시 망원에 있는 호텔입니다. 최대 4인까지 묵을 수 있고, 체크인은 15시, 체크아웃은 11시입니다.",
    "host_name": "김민준",
    "highlights": [
      "조용한 주택가",
      "장기 숙박 할인",
      "도보 5분 거리 지하철"
    ],
    "max_guests": 4,
    "property_type": "HOTEL",
    "photo_url": "/images/rooms/room-12.jpg",
    "listed_at": "2026-06-30T21:52:24.583042",
    "status": "LISTED",
    "region": "서울",
    "address": "서울특별시 망원로 93",
    "avg_rating": null,
    "review_count": 0
  },
  {
    "id": "b4691699-a253-4eb3-a272-79bbca0d2b7d",
    "name": "해운대 시티뷰 아파트",
    "name_en": null,
    "description": "부산광역시 해운대에 있는 아파트입니다. 최대 3인까지 묵을 수 있고, 체크인은 15시, 체크아웃은 11시입니다.",
    "host_name": "김민준",
    "highlights": [
      "주차 무료",
      "전 객실 오션뷰",
      "조용한 주택가"
    ],
    "max_guests": 3,
    "property_type": "APARTMENT",
    "photo_url": "/images/rooms/room-13.jpg",
    "listed_at": "2026-04-04T21:52:24.583042",
    "status": "LISTED",
    "region": "부산",
    "address": "부산광역시 해운대로 30",
    "avg_rating": null,
    "review_count": 0
  },
  {
    "id": "cf38a761-41fa-488e-9f49-8baa13f242ff",
    "name": "광안리 스위트 호텔",
    "name_en": null,
    "description": "부산광역시 광안리에 있는 호텔입니다. 최대 4인까지 묵을 수 있고, 체크인은 15시, 체크아웃은 11시입니다.",
    "host_name": "박도윤",
    "highlights": [
      "주차 무료",
      "조용한 주택가",
      "도보 5분 거리 지하철"
    ],
    "max_guests": 4,
    "property_type": "HOTEL",
    "photo_url": "/images/rooms/room-14.jpg",
    "listed_at": "2025-10-28T21:52:24.583042",
    "status": "LISTED",
    "region": "부산",
    "address": "부산광역시 광안리로 71",
    "avg_rating": null,
    "review_count": 0
  },
  {
    "id": "3f1edc2c-6af9-4c7b-aa36-3cb70d24dab1",
    "name": "송정 북카페 게스트하우스",
    "name_en": null,
    "description": "부산광역시 송정에 있는 게스트하우스입니다. 최대 6인까지 묵을 수 있고, 체크인은 15시, 체크아웃은 11시입니다.",
    "host_name": "이서연",
    "highlights": [
      "도보 5분 거리 지하철",
      "셀프 체크인",
      "전 객실 오션뷰"
    ],
    "max_guests": 6,
    "property_type": "GUESTHOUSE",
    "photo_url": "/images/rooms/room-15.jpg",
    "listed_at": "2026-01-22T21:52:24.583042",
    "status": "LISTED",
    "region": "부산",
    "address": "부산광역시 송정로 25",
    "avg_rating": null,
    "review_count": 0
  },
  {
    "id": "eca93670-35f9-4e1a-b046-6b756ac57377",
    "name": "영도 독채 펜션",
    "name_en": null,
    "description": "부산광역시 영도에 있는 펜션입니다. 최대 4인까지 묵을 수 있고, 체크인은 15시, 체크아웃은 11시입니다.",
    "host_name": "박도윤",
    "highlights": [
      "조용한 주택가",
      "주차 무료",
      "셀프 체크인"
    ],
    "max_guests": 4,
    "property_type": "PENSION",
    "photo_url": "/images/rooms/room-16.jpg",
    "listed_at": "2025-10-10T21:52:24.583042",
    "status": "LISTED",
    "region": "부산",
    "address": "부산광역시 영도로 5",
    "avg_rating": null,
    "review_count": 0
  },
  {
    "id": "ef6a10c2-6504-486f-9763-316a7d41cc03",
    "name": "해운대 정원 단독주택",
    "name_en": null,
    "description": "부산광역시 해운대에 있는 단독주택입니다. 최대 3인까지 묵을 수 있고, 체크인은 15시, 체크아웃은 11시입니다.",
    "host_name": "정하준",
    "highlights": [
      "셀프 체크인",
      "도보 5분 거리 지하철",
      "주차 무료"
    ],
    "max_guests": 3,
    "property_type": "HOUSE",
    "photo_url": "/images/rooms/room-17.jpg",
    "listed_at": "2026-06-07T21:52:24.583042",
    "status": "LISTED",
    "region": "부산",
    "address": "부산광역시 해운대로 38",
    "avg_rating": null,
    "review_count": 0
  },
  {
    "id": "ed5c802f-7605-4ab0-9633-ac27bdb18403",
    "name": "광안리 복층 아파트",
    "name_en": null,
    "description": "부산광역시 광안리에 있는 아파트입니다. 최대 8인까지 묵을 수 있고, 체크인은 15시, 체크아웃은 11시입니다.",
    "host_name": "정하준",
    "highlights": [
      "도보 5분 거리 지하철",
      "조용한 주택가",
      "주차 무료"
    ],
    "max_guests": 8,
    "property_type": "APARTMENT",
    "photo_url": "/images/rooms/room-18.jpg",
    "listed_at": "2026-07-08T21:52:24.583042",
    "status": "LISTED",
    "region": "부산",
    "address": "부산광역시 광안리로 22",
    "avg_rating": null,
    "review_count": 0
  },
  {
    "id": "8b73210f-36b9-40e1-b999-ac51d8d22d6e",
    "name": "송정 오션뷰 호텔",
    "name_en": null,
    "description": "부산광역시 송정에 있는 호텔입니다. 최대 4인까지 묵을 수 있고, 체크인은 15시, 체크아웃은 11시입니다.",
    "host_name": "이서연",
    "highlights": [
      "조용한 주택가",
      "셀프 체크인",
      "장기 숙박 할인"
    ],
    "max_guests": 4,
    "property_type": "HOTEL",
    "photo_url": "/images/rooms/room-19.jpg",
    "listed_at": "2026-01-23T21:52:24.583042",
    "status": "LISTED",
    "region": "부산",
    "address": "부산광역시 송정로 3",
    "avg_rating": null,
    "review_count": 0
  },
  {
    "id": "8b0b7c7c-cb31-4d87-9b35-0ca3d02fdab2",
    "name": "영도 라운지 게스트하우스",
    "name_en": null,
    "description": "부산광역시 영도에 있는 게스트하우스입니다. 최대 4인까지 묵을 수 있고, 체크인은 15시, 체크아웃은 11시입니다.",
    "host_name": "이서연",
    "highlights": [
      "주차 무료",
      "장기 숙박 할인",
      "셀프 체크인"
    ],
    "max_guests": 4,
    "property_type": "GUESTHOUSE",
    "photo_url": "/images/rooms/room-20.jpg",
    "listed_at": "2026-07-12T21:52:24.583042",
    "status": "LISTED",
    "region": "부산",
    "address": "부산광역시 영도로 35",
    "avg_rating": null,
    "review_count": 0
  },
  {
    "id": "78256ecd-990a-4976-9349-44dc6e9937ae",
    "name": "애월 시티뷰 아파트",
    "name_en": null,
    "description": "제주특별자치도 애월에 있는 아파트입니다. 최대 3인까지 묵을 수 있고, 체크인은 15시, 체크아웃은 11시입니다.",
    "host_name": "정하준",
    "highlights": [
      "장기 숙박 할인",
      "도보 5분 거리 지하철",
      "주차 무료"
    ],
    "max_guests": 3,
    "property_type": "APARTMENT",
    "photo_url": "/images/rooms/room-21.jpg",
    "listed_at": "2026-05-28T21:52:24.583042",
    "status": "LISTED",
    "region": "제주",
    "address": "제주특별자치도 애월로 52",
    "avg_rating": null,
    "review_count": 0
  },
  {
    "id": "60b2e134-67e1-4bc7-a81b-c3a883a9623d",
    "name": "성산 스위트 호텔",
    "name_en": null,
    "description": "제주특별자치도 성산에 있는 호텔입니다. 최대 4인까지 묵을 수 있고, 체크인은 15시, 체크아웃은 11시입니다.",
    "host_name": "정하준",
    "highlights": [
      "전 객실 오션뷰",
      "도보 5분 거리 지하철",
      "셀프 체크인"
    ],
    "max_guests": 4,
    "property_type": "HOTEL",
    "photo_url": "/images/rooms/room-22.jpg",
    "listed_at": "2026-01-31T21:52:24.583042",
    "status": "LISTED",
    "region": "제주",
    "address": "제주특별자치도 성산로 1",
    "avg_rating": null,
    "review_count": 0
  },
  {
    "id": "51908106-212d-473a-9606-9b708dc11ca5",
    "name": "한림 북카페 게스트하우스",
    "name_en": null,
    "description": "제주특별자치도 한림에 있는 게스트하우스입니다. 최대 6인까지 묵을 수 있고, 체크인은 15시, 체크아웃은 11시입니다.",
    "host_name": "김민준",
    "highlights": [
      "장기 숙박 할인",
      "셀프 체크인",
      "전 객실 오션뷰"
    ],
    "max_guests": 6,
    "property_type": "GUESTHOUSE",
    "photo_url": "/images/rooms/room-23.jpg",
    "listed_at": "2025-12-17T21:52:24.583042",
    "status": "LISTED",
    "region": "제주",
    "address": "제주특별자치도 한림로 47",
    "avg_rating": null,
    "review_count": 0
  },
  {
    "id": "09a4ec5e-2750-4cd2-9bb2-16b8f0c99210",
    "name": "표선 독채 펜션",
    "name_en": null,
    "description": "제주특별자치도 표선에 있는 펜션입니다. 최대 2인까지 묵을 수 있고, 체크인은 15시, 체크아웃은 11시입니다.",
    "host_name": "이서연",
    "highlights": [
      "셀프 체크인",
      "전 객실 오션뷰",
      "조용한 주택가"
    ],
    "max_guests": 2,
    "property_type": "PENSION",
    "photo_url": "/images/rooms/room-24.jpg",
    "listed_at": "2025-09-10T21:52:24.583042",
    "status": "LISTED",
    "region": "제주",
    "address": "제주특별자치도 표선로 97",
    "avg_rating": null,
    "review_count": 0
  },
  {
    "id": "36ca06d2-5006-4bfa-93b4-e4c064542d0a",
    "name": "구좌 정원 단독주택",
    "name_en": null,
    "description": "제주특별자치도 구좌에 있는 단독주택입니다. 최대 8인까지 묵을 수 있고, 체크인은 15시, 체크아웃은 11시입니다.",
    "host_name": "최지우",
    "highlights": [
      "도보 5분 거리 지하철",
      "셀프 체크인",
      "조용한 주택가"
    ],
    "max_guests": 8,
    "property_type": "HOUSE",
    "photo_url": "/images/rooms/room-01.jpg",
    "listed_at": "2026-01-28T21:52:24.583042",
    "status": "LISTED",
    "region": "제주",
    "address": "제주특별자치도 구좌로 68",
    "avg_rating": null,
    "review_count": 0
  },
  {
    "id": "3688a239-db15-49cf-997a-6182df9774bc",
    "name": "애월 복층 아파트",
    "name_en": null,
    "description": "제주특별자치도 애월에 있는 아파트입니다. 최대 8인까지 묵을 수 있고, 체크인은 15시, 체크아웃은 11시입니다.",
    "host_name": "이서연",
    "highlights": [
      "주차 무료",
      "전 객실 오션뷰",
      "도보 5분 거리 지하철"
    ],
    "max_guests": 8,
    "property_type": "APARTMENT",
    "photo_url": "/images/rooms/room-02.jpg",
    "listed_at": "2026-04-09T21:52:24.583042",
    "status": "LISTED",
    "region": "제주",
    "address": "제주특별자치도 애월로 48",
    "avg_rating": null,
    "review_count": 0
  },
  {
    "id": "e3df1b23-f249-4025-bfe0-cf0905ade2ca",
    "name": "성산 오션뷰 호텔",
    "name_en": null,
    "description": "제주특별자치도 성산에 있는 호텔입니다. 최대 3인까지 묵을 수 있고, 체크인은 15시, 체크아웃은 11시입니다.",
    "host_name": "최지우",
    "highlights": [
      "조용한 주택가",
      "장기 숙박 할인",
      "셀프 체크인"
    ],
    "max_guests": 3,
    "property_type": "HOTEL",
    "photo_url": "/images/rooms/room-03.jpg",
    "listed_at": "2026-01-27T21:52:24.583042",
    "status": "LISTED",
    "region": "제주",
    "address": "제주특별자치도 성산로 101",
    "avg_rating": null,
    "review_count": 0
  },
  {
    "id": "1e3efa62-a0c3-4af0-88ce-7864a205df5c",
    "name": "한림 라운지 게스트하우스",
    "name_en": null,
    "description": "제주특별자치도 한림에 있는 게스트하우스입니다. 최대 6인까지 묵을 수 있고, 체크인은 15시, 체크아웃은 11시입니다.",
    "host_name": "정하준",
    "highlights": [
      "주차 무료",
      "전 객실 오션뷰",
      "장기 숙박 할인"
    ],
    "max_guests": 6,
    "property_type": "GUESTHOUSE",
    "photo_url": "/images/rooms/room-04.jpg",
    "listed_at": "2025-08-18T21:52:24.583042",
    "status": "LISTED",
    "region": "제주",
    "address": "제주특별자치도 한림로 85",
    "avg_rating": null,
    "review_count": 0
  },
  {
    "id": "18444bff-518e-4b19-98a0-4f7b6b2771da",
    "name": "표선 바비큐 펜션",
    "name_en": null,
    "description": "제주특별자치도 표선에 있는 펜션입니다. 최대 6인까지 묵을 수 있고, 체크인은 15시, 체크아웃은 11시입니다.",
    "host_name": "김민준",
    "highlights": [
      "주차 무료",
      "도보 5분 거리 지하철",
      "전 객실 오션뷰"
    ],
    "max_guests": 6,
    "property_type": "PENSION",
    "photo_url": "/images/rooms/room-05.jpg",
    "listed_at": "2025-11-09T21:52:24.583042",
    "status": "LISTED",
    "region": "제주",
    "address": "제주특별자치도 표선로 74",
    "avg_rating": null,
    "review_count": 0
  },
  {
    "id": "d4eaa82b-615f-4f90-bbfe-562bc9b786e1",
    "name": "구좌 한옥 단독주택",
    "name_en": null,
    "description": "제주특별자치도 구좌에 있는 단독주택입니다. 최대 6인까지 묵을 수 있고, 체크인은 15시, 체크아웃은 11시입니다.",
    "host_name": "김민준",
    "highlights": [
      "주차 무료",
      "도보 5분 거리 지하철",
      "전 객실 오션뷰"
    ],
    "max_guests": 6,
    "property_type": "HOUSE",
    "photo_url": "/images/rooms/room-06.jpg",
    "listed_at": "2026-04-07T21:52:24.583042",
    "status": "LISTED",
    "region": "제주",
    "address": "제주특별자치도 구좌로 89",
    "avg_rating": null,
    "review_count": 0
  },
  {
    "id": "483a2abe-8bf0-4b5d-b4cd-40aad66fe2b9",
    "name": "경포 시티뷰 아파트",
    "name_en": null,
    "description": "강원특별자치도 강릉시 경포에 있는 아파트입니다. 최대 2인까지 묵을 수 있고, 체크인은 15시, 체크아웃은 11시입니다.",
    "host_name": "최지우",
    "highlights": [
      "셀프 체크인",
      "도보 5분 거리 지하철",
      "주차 무료"
    ],
    "max_guests": 2,
    "property_type": "APARTMENT",
    "photo_url": "/images/rooms/room-07.jpg",
    "listed_at": "2026-06-23T21:52:24.583042",
    "status": "LISTED",
    "region": "강릉",
    "address": "강원특별자치도 강릉시 경포로 108",
    "avg_rating": null,
    "review_count": 0
  },
  {
    "id": "cf5eb973-ff34-497d-8f58-c2a9fbc26301",
    "name": "안목 스위트 호텔",
    "name_en": null,
    "description": "강원특별자치도 강릉시 안목에 있는 호텔입니다. 최대 6인까지 묵을 수 있고, 체크인은 15시, 체크아웃은 11시입니다.",
    "host_name": "최지우",
    "highlights": [
      "도보 5분 거리 지하철",
      "장기 숙박 할인",
      "셀프 체크인"
    ],
    "max_guests": 6,
    "property_type": "HOTEL",
    "photo_url": "/images/rooms/room-08.jpg",
    "listed_at": "2026-07-12T21:52:24.583042",
    "status": "LISTED",
    "region": "강릉",
    "address": "강원특별자치도 강릉시 안목로 77",
    "avg_rating": null,
    "review_count": 0
  },
  {
    "id": "125c41b8-fa68-4be1-b252-55d17fd8ce59",
    "name": "주문진 북카페 게스트하우스",
    "name_en": null,
    "description": "강원특별자치도 강릉시 주문진에 있는 게스트하우스입니다. 최대 6인까지 묵을 수 있고, 체크인은 15시, 체크아웃은 11시입니다.",
    "host_name": "박도윤",
    "highlights": [
      "장기 숙박 할인",
      "도보 5분 거리 지하철",
      "조용한 주택가"
    ],
    "max_guests": 6,
    "property_type": "GUESTHOUSE",
    "photo_url": "/images/rooms/room-09.jpg",
    "listed_at": "2026-02-19T21:52:24.583042",
    "status": "LISTED",
    "region": "강릉",
    "address": "강원특별자치도 강릉시 주문진로 20",
    "avg_rating": null,
    "review_count": 0
  },
  {
    "id": "7a0e88fc-4448-4fbc-95ff-50f367475fcc",
    "name": "사천 독채 펜션",
    "name_en": null,
    "description": "강원특별자치도 강릉시 사천에 있는 펜션입니다. 최대 4인까지 묵을 수 있고, 체크인은 15시, 체크아웃은 11시입니다.",
    "host_name": "정하준",
    "highlights": [
      "전 객실 오션뷰",
      "장기 숙박 할인",
      "주차 무료"
    ],
    "max_guests": 4,
    "property_type": "PENSION",
    "photo_url": "/images/rooms/room-10.jpg",
    "listed_at": "2026-06-10T21:52:24.583042",
    "status": "LISTED",
    "region": "강릉",
    "address": "강원특별자치도 강릉시 사천로 76",
    "avg_rating": null,
    "review_count": 0
  },
  {
    "id": "81bf7139-9760-48fb-bb00-38d2e415a118",
    "name": "경포 정원 단독주택",
    "name_en": null,
    "description": "강원특별자치도 강릉시 경포에 있는 단독주택입니다. 최대 3인까지 묵을 수 있고, 체크인은 15시, 체크아웃은 11시입니다.",
    "host_name": "정하준",
    "highlights": [
      "도보 5분 거리 지하철",
      "전 객실 오션뷰",
      "주차 무료"
    ],
    "max_guests": 3,
    "property_type": "HOUSE",
    "photo_url": "/images/rooms/room-11.jpg",
    "listed_at": "2025-11-18T21:52:24.583042",
    "status": "LISTED",
    "region": "강릉",
    "address": "강원특별자치도 강릉시 경포로 53",
    "avg_rating": null,
    "review_count": 0
  },
  {
    "id": "3cb2ee73-79e3-4627-9b9d-e948505cd9f6",
    "name": "안목 복층 아파트",
    "name_en": null,
    "description": "강원특별자치도 강릉시 안목에 있는 아파트입니다. 최대 2인까지 묵을 수 있고, 체크인은 15시, 체크아웃은 11시입니다.",
    "host_name": "정하준",
    "highlights": [
      "주차 무료",
      "전 객실 오션뷰",
      "도보 5분 거리 지하철"
    ],
    "max_guests": 2,
    "property_type": "APARTMENT",
    "photo_url": "/images/rooms/room-12.jpg",
    "listed_at": "2025-10-01T21:52:24.583042",
    "status": "LISTED",
    "region": "강릉",
    "address": "강원특별자치도 강릉시 안목로 98",
    "avg_rating": null,
    "review_count": 0
  },
  {
    "id": "a5422723-d00f-42ea-b022-93227e17d655",
    "name": "황리단길 시티뷰 아파트",
    "name_en": null,
    "description": "경상북도 경주시 황리단길에 있는 아파트입니다. 최대 3인까지 묵을 수 있고, 체크인은 15시, 체크아웃은 11시입니다.",
    "host_name": "정하준",
    "highlights": [
      "주차 무료",
      "셀프 체크인",
      "전 객실 오션뷰"
    ],
    "max_guests": 3,
    "property_type": "APARTMENT",
    "photo_url": "/images/rooms/room-13.jpg",
    "listed_at": "2026-07-02T21:52:24.583042",
    "status": "LISTED",
    "region": "경주",
    "address": "경상북도 경주시 황리단길로 75",
    "avg_rating": null,
    "review_count": 0
  },
  {
    "id": "674d716b-affa-4aea-be04-cf17a3be980a",
    "name": "보문 스위트 호텔",
    "name_en": null,
    "description": "경상북도 경주시 보문에 있는 호텔입니다. 최대 3인까지 묵을 수 있고, 체크인은 15시, 체크아웃은 11시입니다.",
    "host_name": "박도윤",
    "highlights": [
      "도보 5분 거리 지하철",
      "전 객실 오션뷰",
      "주차 무료"
    ],
    "max_guests": 3,
    "property_type": "HOTEL",
    "photo_url": "/images/rooms/room-14.jpg",
    "listed_at": "2025-10-14T21:52:24.583042",
    "status": "LISTED",
    "region": "경주",
    "address": "경상북도 경주시 보문로 33",
    "avg_rating": null,
    "review_count": 0
  },
  {
    "id": "bd8262af-70bf-41b0-97ba-89873ef10dc6",
    "name": "불국사 북카페 게스트하우스",
    "name_en": null,
    "description": "경상북도 경주시 불국사에 있는 게스트하우스입니다. 최대 4인까지 묵을 수 있고, 체크인은 15시, 체크아웃은 11시입니다.",
    "host_name": "박도윤",
    "highlights": [
      "장기 숙박 할인",
      "조용한 주택가",
      "주차 무료"
    ],
    "max_guests": 4,
    "property_type": "GUESTHOUSE",
    "photo_url": "/images/rooms/room-15.jpg",
    "listed_at": "2026-04-08T21:52:24.583042",
    "status": "LISTED",
    "region": "경주",
    "address": "경상북도 경주시 불국사로 96",
    "avg_rating": null,
    "review_count": 0
  },
  {
    "id": "6d636db3-59b5-42e2-b9a3-afc248768e41",
    "name": "황리단길 독채 펜션",
    "name_en": null,
    "description": "경상북도 경주시 황리단길에 있는 펜션입니다. 최대 4인까지 묵을 수 있고, 체크인은 15시, 체크아웃은 11시입니다.",
    "host_name": "박도윤",
    "highlights": [
      "도보 5분 거리 지하철",
      "전 객실 오션뷰",
      "주차 무료"
    ],
    "max_guests": 4,
    "property_type": "PENSION",
    "photo_url": "/images/rooms/room-16.jpg",
    "listed_at": "2026-04-07T21:52:24.583042",
    "status": "LISTED",
    "region": "경주",
    "address": "경상북도 경주시 황리단길로 2",
    "avg_rating": null,
    "review_count": 0
  },
  {
    "id": "97f78c9e-24a3-4881-8c51-b4717f3849cc",
    "name": "보문 정원 단독주택",
    "name_en": null,
    "description": "경상북도 경주시 보문에 있는 단독주택입니다. 최대 2인까지 묵을 수 있고, 체크인은 15시, 체크아웃은 11시입니다.",
    "host_name": "김민준",
    "highlights": [
      "주차 무료",
      "도보 5분 거리 지하철",
      "셀프 체크인"
    ],
    "max_guests": 2,
    "property_type": "HOUSE",
    "photo_url": "/images/rooms/room-17.jpg",
    "listed_at": "2026-05-31T21:52:24.583042",
    "status": "LISTED",
    "region": "경주",
    "address": "경상북도 경주시 보문로 115",
    "avg_rating": null,
    "review_count": 0
  }
]

export const GEN_ADMIN_STATS = {
  "total_users": 3,
  "today_bookings": 6,
  "today_revenue": 720000,
  "listed_count": 41
}

export const GEN_RECENT_BOOKINGS = [
  {
    "id": "e793a737-6cad-4598-b349-e0a2b26c6fef",
    "booking_number": "BK260831T000",
    "user_name": "김민준",
    "property_name": "연남 시티뷰 아파트",
    "total_price": 90000,
    "status": "CONFIRMED",
    "booked_at": "2026-09-01T05:52:25.559150"
  },
  {
    "id": "62ea767c-7b7e-4b84-8703-57ad7cbd3342",
    "booking_number": "BK260831T001",
    "user_name": "이서연",
    "property_name": "연남 시티뷰 아파트",
    "total_price": 102000,
    "status": "CONFIRMED",
    "booked_at": "2026-09-01T04:52:25.559150"
  },
  {
    "id": "7c6b904d-c5fc-431c-9e82-5b5be1d72069",
    "booking_number": "BK260831T002",
    "user_name": "김민준",
    "property_name": "성수 스위트 호텔",
    "total_price": 114000,
    "status": "CONFIRMED",
    "booked_at": "2026-09-01T03:52:25.559150"
  },
  {
    "id": "6abaa027-a7d3-4d5a-8b42-38099f5c9d6d",
    "booking_number": "BK260831T003",
    "user_name": "이서연",
    "property_name": "성수 스위트 호텔",
    "total_price": 126000,
    "status": "CONFIRMED",
    "booked_at": "2026-09-01T02:52:25.559150"
  },
  {
    "id": "205775f0-9871-41a8-8bd7-0d30dc6e5402",
    "booking_number": "BK260831T004",
    "user_name": "김민준",
    "property_name": "익선동 북카페 게스트하우스",
    "total_price": 138000,
    "status": "CONFIRMED",
    "booked_at": "2026-09-01T01:52:25.559150"
  },
  {
    "id": "a8713cf2-2b3a-4829-8a0d-f069945df8b6",
    "booking_number": "BK260831T005",
    "user_name": "이서연",
    "property_name": "익선동 북카페 게스트하우스",
    "total_price": 150000,
    "status": "CONFIRMED",
    "booked_at": "2026-09-01T00:52:25.559150"
  },
  {
    "id": "b23b1f43-a39e-449f-8483-492bbe1131e4",
    "booking_number": "BK2608270045",
    "user_name": "이서연",
    "property_name": "광안리 복층 아파트",
    "total_price": 90000,
    "status": "CONFIRMED",
    "booked_at": "2026-08-26T15:00:00"
  },
  {
    "id": "e65a2ebd-9c76-47bd-93cb-e0455584c717",
    "booking_number": "BK2608300048",
    "user_name": "김민준",
    "property_name": "불국사 북카페 게스트하우스",
    "total_price": 90000,
    "status": "CONFIRMED",
    "booked_at": "2026-08-26T15:00:00"
  },
  {
    "id": "12da9e7f-776b-446e-9c4e-66160dc96d0f",
    "booking_number": "BK2608270027",
    "user_name": "이서연",
    "property_name": "익선동 바비큐 펜션",
    "total_price": 90000,
    "status": "CONFIRMED",
    "booked_at": "2026-08-25T15:00:00"
  },
  {
    "id": "0b9c3b59-e187-4895-b00c-3fea4046c734",
    "booking_number": "BK2608290016",
    "user_name": "김민준",
    "property_name": "송정 오션뷰 호텔",
    "total_price": 90000,
    "status": "CONFIRMED",
    "booked_at": "2026-08-24T15:00:00"
  }
]

export const GEN_ADMIN_USERS = [
  {
    "id": "075b11e2-1207-42e9-ad88-846dc67d20e1",
    "email": "user2@stay.example",
    "name": "이서연",
    "phone": "010-2345-6789",
    "role": "USER",
    "created_at": "2026-08-31T21:52:25",
    "booking_count": 33
  },
  {
    "id": "cd7724fc-0fcc-4969-a139-b48ac474fbfb",
    "email": "admin@stay.example",
    "name": "관리자",
    "phone": "010-9999-0000",
    "role": "ADMIN",
    "created_at": "2026-08-31T21:52:25",
    "booking_count": 0
  },
  {
    "id": "ed85ab4c-01ad-4a7f-92b7-c411b524b066",
    "email": "user1@stay.example",
    "name": "김민준",
    "phone": "010-1234-5678",
    "role": "USER",
    "created_at": "2026-08-31T21:52:25",
    "booking_count": 33
  }
]

export const GEN_ADMIN_PROPERTIES = []

export const GEN_ADMIN_STAY_DATES = [
  {
    "id": "7864260c-b249-4931-8ac3-91d216dcf8d4",
    "property_id": "686fbe51-3036-493a-a40f-725e4186006f",
    "property_name": "연남 시티뷰 아파트",
    "room_type_id": "5aaa26cc-3d31-4a81-8138-b2393f7f5cf8",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "02a21daf-56d2-4272-b78d-56949902bf11",
    "property_id": "686fbe51-3036-493a-a40f-725e4186006f",
    "property_name": "연남 시티뷰 아파트",
    "room_type_id": "3269d2fd-335c-4e64-a378-e0f53c2f874e",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "56a2521f-859e-4a8c-8a52-b87c2f1c7f8e",
    "property_id": "7f786cb1-838c-4239-a806-42d18e286155",
    "property_name": "성수 스위트 호텔",
    "room_type_id": "87a9065c-375f-4712-8101-91bb1e08d1c9",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "c8fc430f-b953-4196-9cb3-e94e2ee030bf",
    "property_id": "7f786cb1-838c-4239-a806-42d18e286155",
    "property_name": "성수 스위트 호텔",
    "room_type_id": "e6709479-7e9d-4802-a3cf-951f2c18806a",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "44f57c36-09c4-494b-8ee4-f137b4464aea",
    "property_id": "b3b17692-6482-4617-9fbe-d401b0c9e853",
    "property_name": "익선동 북카페 게스트하우스",
    "room_type_id": "47a23fef-1d07-4f05-a730-dbdf2cf078ec",
    "room_type_name": "스탠다드",
    "total_rooms": 12,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "8b514731-e77b-4aba-bdca-ecfaf587c98d",
    "property_id": "b3b17692-6482-4617-9fbe-d401b0c9e853",
    "property_name": "익선동 북카페 게스트하우스",
    "room_type_id": "ed0af307-a1fa-42f4-bd42-f31b6977bba4",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "26cd4598-bfe1-474d-9847-7fa2bc871348",
    "property_id": "593a9e16-dbca-42f3-80f7-4be2221b8d3a",
    "property_name": "서촌 독채 펜션",
    "room_type_id": "edf3ae04-77db-467c-9ffe-8c1fed0b7b8e",
    "room_type_name": "스탠다드",
    "total_rooms": 12,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "2d10f076-c438-49ae-a3fe-b1e8f3dea32f",
    "property_id": "593a9e16-dbca-42f3-80f7-4be2221b8d3a",
    "property_name": "서촌 독채 펜션",
    "room_type_id": "4380bd96-b5b8-4931-aea8-a269e2986e87",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "bae75422-b1a2-42c7-88a7-8a910af0f586",
    "property_id": "ca3480bf-6993-4501-ae00-5031eeec3e2c",
    "property_name": "한남 정원 단독주택",
    "room_type_id": "f328f1b9-f11f-446b-9baa-4daa28d95c8a",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "e3bc6639-67ea-40f2-b798-18b66d3343c9",
    "property_id": "ca3480bf-6993-4501-ae00-5031eeec3e2c",
    "property_name": "한남 정원 단독주택",
    "room_type_id": "4249235c-9498-4b5b-ac7c-c225935f4a4b",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "0d1b41c3-fdd9-40f1-8b19-5459b8ae280b",
    "property_id": "fbc52bc2-7c7b-4615-98ef-08634a1281c0",
    "property_name": "망원 복층 아파트",
    "room_type_id": "ee042265-390d-4b7b-8000-76bf7eb18020",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "f06fd0a9-85c4-4e8d-83cc-30e10d68cbfb",
    "property_id": "fbc52bc2-7c7b-4615-98ef-08634a1281c0",
    "property_name": "망원 복층 아파트",
    "room_type_id": "e890bf8b-405b-4baa-b146-e26217331f21",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "eff4a72e-0609-4900-b91c-e962ff9adc94",
    "property_id": "c6f3216a-91e4-4dc3-881a-8c3b80377d73",
    "property_name": "연남 오션뷰 호텔",
    "room_type_id": "2bd6e0eb-cba1-49e1-834c-59ee60c76daa",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "c57c2a4a-d499-4c99-be1b-3295138d44ec",
    "property_id": "c6f3216a-91e4-4dc3-881a-8c3b80377d73",
    "property_name": "연남 오션뷰 호텔",
    "room_type_id": "42f7247d-6ba3-430a-a63e-c2f05705d3c0",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "f38085cb-7c42-4549-9899-1d235b942db2",
    "property_id": "b589ae3c-0770-457e-9335-27c1f7550c2b",
    "property_name": "성수 라운지 게스트하우스",
    "room_type_id": "93cd213e-3b2c-4bc6-89b3-6fe89464e6ab",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "2a753a9d-06dc-4acd-a0ad-1d7d9dc5fec8",
    "property_id": "b589ae3c-0770-457e-9335-27c1f7550c2b",
    "property_name": "성수 라운지 게스트하우스",
    "room_type_id": "661d002e-8543-49f6-ad34-3a916f5456d3",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "e7e82509-cef4-419e-9538-995834ec5f61",
    "property_id": "8e11c61d-942f-4aff-8dec-a4bf722677ef",
    "property_name": "익선동 바비큐 펜션",
    "room_type_id": "e9665036-1481-4fb2-a0bd-49a9491ee7fa",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "93215827-7cec-494b-961a-1f70f5527d97",
    "property_id": "8e11c61d-942f-4aff-8dec-a4bf722677ef",
    "property_name": "익선동 바비큐 펜션",
    "room_type_id": "7ab0dcb8-4967-41a6-8004-ce43ec6be455",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "46c79c31-bfe3-4963-8b2f-eb5026ba8321",
    "property_id": "88150e87-e104-4fb2-a873-2635550d0685",
    "property_name": "서촌 한옥 단독주택",
    "room_type_id": "d207f5f8-1518-437e-b368-346d1a13e289",
    "room_type_name": "스탠다드",
    "total_rooms": 12,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "a42933b5-874c-4ecb-babf-1495cbd52636",
    "property_id": "88150e87-e104-4fb2-a873-2635550d0685",
    "property_name": "서촌 한옥 단독주택",
    "room_type_id": "353bd5d0-cbc8-49cf-9626-e8d70f683c2c",
    "room_type_name": "디럭스",
    "total_rooms": 8,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "0e6b4607-f97c-4b6d-8764-3117e40c90f8",
    "property_id": "fb0e8688-8f06-4ac5-8d17-f6b2bbedd3b3",
    "property_name": "한남 루프탑 아파트",
    "room_type_id": "002a67ad-0f8f-4021-a590-70334bc0d1b4",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "78d8b704-6dc9-4fee-bbd8-29588066eea9",
    "property_id": "fb0e8688-8f06-4ac5-8d17-f6b2bbedd3b3",
    "property_name": "한남 루프탑 아파트",
    "room_type_id": "9d02ab10-eaca-4ba9-9528-e0b5e84a2883",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "c37c8973-a1f0-452a-889b-6d72f9bb018e",
    "property_id": "2e9516e5-5e8f-415b-bc1e-1f17fa8d9ea0",
    "property_name": "망원 시티 호텔",
    "room_type_id": "5af10628-b8dc-44bd-b0b3-0dd50d980b5e",
    "room_type_name": "스탠다드",
    "total_rooms": 12,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "f93c6d83-dcd7-4b90-845c-bd07cc0149d2",
    "property_id": "2e9516e5-5e8f-415b-bc1e-1f17fa8d9ea0",
    "property_name": "망원 시티 호텔",
    "room_type_id": "199532e5-c0c6-4f26-a430-5952608373b1",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "eed595ed-693f-4d53-b8eb-522b80334533",
    "property_id": "b4691699-a253-4eb3-a272-79bbca0d2b7d",
    "property_name": "해운대 시티뷰 아파트",
    "room_type_id": "6157063e-caa3-43ba-ac58-3ecb9a3f8388",
    "room_type_name": "스탠다드",
    "total_rooms": 12,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "943179bb-6524-4aab-bf0f-804dbe8c8fc3",
    "property_id": "b4691699-a253-4eb3-a272-79bbca0d2b7d",
    "property_name": "해운대 시티뷰 아파트",
    "room_type_id": "a9b354b5-961f-4438-ae8b-4f04f5c31df3",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "ef583b58-35c0-46e7-9f2f-b0e6a39dc1c1",
    "property_id": "cf38a761-41fa-488e-9f49-8baa13f242ff",
    "property_name": "광안리 스위트 호텔",
    "room_type_id": "666a9423-9394-4d70-9a34-026d2741f38a",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "e572996e-dc45-4af2-919b-38aa3034aaed",
    "property_id": "cf38a761-41fa-488e-9f49-8baa13f242ff",
    "property_name": "광안리 스위트 호텔",
    "room_type_id": "c5870b7e-79d9-48ce-854b-274e986ead18",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "d6ecd2da-3166-43e0-9ef1-684e5d0895cd",
    "property_id": "3f1edc2c-6af9-4c7b-aa36-3cb70d24dab1",
    "property_name": "송정 북카페 게스트하우스",
    "room_type_id": "20745d83-d591-4d5a-87de-abe7b9833e26",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "ab568a12-9deb-4679-a7f2-2ca7b2043b9c",
    "property_id": "3f1edc2c-6af9-4c7b-aa36-3cb70d24dab1",
    "property_name": "송정 북카페 게스트하우스",
    "room_type_id": "c6280e4b-7e9d-4f5a-a88a-c671a0026382",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "b1d96dd2-4014-46a0-aea1-7db87575ceb7",
    "property_id": "eca93670-35f9-4e1a-b046-6b756ac57377",
    "property_name": "영도 독채 펜션",
    "room_type_id": "83e79f60-268f-4fe4-a095-4dcf1f0f15fe",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "42a30908-f04d-4acc-b28b-e53483ca4fe1",
    "property_id": "eca93670-35f9-4e1a-b046-6b756ac57377",
    "property_name": "영도 독채 펜션",
    "room_type_id": "a2553994-c660-4f6c-8d30-85c05ced4955",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "994e5d0f-aa8d-4bbf-9747-91624fbec35f",
    "property_id": "ef6a10c2-6504-486f-9763-316a7d41cc03",
    "property_name": "해운대 정원 단독주택",
    "room_type_id": "50a56dc6-3508-4a88-8db8-6890b5d95e66",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "2addacb3-ad92-4019-932e-4290f035f120",
    "property_id": "ef6a10c2-6504-486f-9763-316a7d41cc03",
    "property_name": "해운대 정원 단독주택",
    "room_type_id": "f7f6a27e-1827-486a-b490-1ca7dd92be3f",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "1ae57f67-d28e-4f1a-96d2-4df2659a7e0c",
    "property_id": "ed5c802f-7605-4ab0-9633-ac27bdb18403",
    "property_name": "광안리 복층 아파트",
    "room_type_id": "38b4adc4-9fc7-4779-8f1b-fb4b792a0e3d",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "2d0b127d-02f0-46f4-8498-e8f6bb196815",
    "property_id": "ed5c802f-7605-4ab0-9633-ac27bdb18403",
    "property_name": "광안리 복층 아파트",
    "room_type_id": "3eed79a2-08e2-4c7b-8aaa-fdbf6f6c1eed",
    "room_type_name": "디럭스",
    "total_rooms": 8,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "ea3adcc8-e880-44b6-b3c1-9a72f133bf2f",
    "property_id": "8b73210f-36b9-40e1-b999-ac51d8d22d6e",
    "property_name": "송정 오션뷰 호텔",
    "room_type_id": "adac59e3-1321-417c-bc5a-56d88e13ff0d",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "8c8bdd2c-d59f-4dde-9173-21c82b7dc7ed",
    "property_id": "8b73210f-36b9-40e1-b999-ac51d8d22d6e",
    "property_name": "송정 오션뷰 호텔",
    "room_type_id": "6f31afaa-41b3-4a60-8157-b330fa33e1cc",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "a57d42d1-c675-4697-851d-f3ead9c9ce9b",
    "property_id": "8b0b7c7c-cb31-4d87-9b35-0ca3d02fdab2",
    "property_name": "영도 라운지 게스트하우스",
    "room_type_id": "85bfdd3b-aa2e-417a-b0ef-b5d8b0976d32",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "fb40d3f9-a261-41aa-aaf5-d892df1a7202",
    "property_id": "8b0b7c7c-cb31-4d87-9b35-0ca3d02fdab2",
    "property_name": "영도 라운지 게스트하우스",
    "room_type_id": "0ad5684f-80dc-4a9b-8883-4a0854bec7cb",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "3b3ed709-cd97-4ef4-a18e-27beb4ec4195",
    "property_id": "78256ecd-990a-4976-9349-44dc6e9937ae",
    "property_name": "애월 시티뷰 아파트",
    "room_type_id": "725b0c11-0b05-41b1-8e6b-e778c151a8ec",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "b3485d78-3794-4bbf-81d6-3613fd813559",
    "property_id": "78256ecd-990a-4976-9349-44dc6e9937ae",
    "property_name": "애월 시티뷰 아파트",
    "room_type_id": "64cf3818-ac5e-4604-85b6-2320e9e59937",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "59370f8a-8957-4fef-b1b7-b5a246752016",
    "property_id": "60b2e134-67e1-4bc7-a81b-c3a883a9623d",
    "property_name": "성산 스위트 호텔",
    "room_type_id": "ee0e9271-872b-4c3e-902c-08188cd33584",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "da32665e-0f9c-440b-a5ab-3ccb5938111b",
    "property_id": "60b2e134-67e1-4bc7-a81b-c3a883a9623d",
    "property_name": "성산 스위트 호텔",
    "room_type_id": "5187eb2b-133e-4e91-93d9-3ad828d4f893",
    "room_type_name": "디럭스",
    "total_rooms": 8,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "7d8a728d-51a3-46b2-8160-aa3c7ab5df6b",
    "property_id": "51908106-212d-473a-9606-9b708dc11ca5",
    "property_name": "한림 북카페 게스트하우스",
    "room_type_id": "6a83e43c-b1ea-4ec5-b09f-9a9634f2f14b",
    "room_type_name": "스탠다드",
    "total_rooms": 12,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "53efb16b-7406-4f3f-b29a-b8c5640c654e",
    "property_id": "51908106-212d-473a-9606-9b708dc11ca5",
    "property_name": "한림 북카페 게스트하우스",
    "room_type_id": "f9d395a0-6dd9-4d63-8d28-e8a68e38202c",
    "room_type_name": "디럭스",
    "total_rooms": 8,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "028ecc01-cec3-4159-bae7-308b6c10e5ca",
    "property_id": "09a4ec5e-2750-4cd2-9bb2-16b8f0c99210",
    "property_name": "표선 독채 펜션",
    "room_type_id": "20e319a4-fca2-4d0c-9d64-b680fa6cd68c",
    "room_type_name": "스탠다드",
    "total_rooms": 12,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "9e673c27-489d-404f-8785-be87580981cb",
    "property_id": "09a4ec5e-2750-4cd2-9bb2-16b8f0c99210",
    "property_name": "표선 독채 펜션",
    "room_type_id": "36a53949-7c74-447e-8703-a53ba5475825",
    "room_type_name": "디럭스",
    "total_rooms": 8,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "ccb71e06-25a6-4446-9f7f-530f59fe6b04",
    "property_id": "36ca06d2-5006-4bfa-93b4-e4c064542d0a",
    "property_name": "구좌 정원 단독주택",
    "room_type_id": "769ba52c-389e-4f17-93a1-072da8b37671",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "767e0bd6-5a91-4d40-a15e-6597b070ae26",
    "property_id": "36ca06d2-5006-4bfa-93b4-e4c064542d0a",
    "property_name": "구좌 정원 단독주택",
    "room_type_id": "22cef8ad-26c5-4931-a523-52131ba9ee27",
    "room_type_name": "디럭스",
    "total_rooms": 8,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "0f496b2d-7c86-40cd-a551-26e6fb0de5ed",
    "property_id": "3688a239-db15-49cf-997a-6182df9774bc",
    "property_name": "애월 복층 아파트",
    "room_type_id": "b7f399bd-95d7-44b9-bbe0-6b36cd0d8e84",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "d3c09164-021f-45e8-a701-d30b9db4fbea",
    "property_id": "3688a239-db15-49cf-997a-6182df9774bc",
    "property_name": "애월 복층 아파트",
    "room_type_id": "4bca1572-7965-40dd-9d29-e8babab87417",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "2bc3f9f4-aa74-42c0-9cce-c6e8d8aa53b5",
    "property_id": "e3df1b23-f249-4025-bfe0-cf0905ade2ca",
    "property_name": "성산 오션뷰 호텔",
    "room_type_id": "865a218a-ece8-4277-8881-fb6f4c2329a3",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "19bdd229-ce6a-4657-bf7b-aacd48c94fc0",
    "property_id": "e3df1b23-f249-4025-bfe0-cf0905ade2ca",
    "property_name": "성산 오션뷰 호텔",
    "room_type_id": "1ea85a29-8391-4573-bb4f-48e94d7b1a6c",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "1658a4a5-5bd3-491a-9a1a-962fc096f6d4",
    "property_id": "1e3efa62-a0c3-4af0-88ce-7864a205df5c",
    "property_name": "한림 라운지 게스트하우스",
    "room_type_id": "2867ad59-af7f-4e51-b772-5be020c956ee",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "f32ceab5-0b88-46b2-8b5e-1b72de47300f",
    "property_id": "1e3efa62-a0c3-4af0-88ce-7864a205df5c",
    "property_name": "한림 라운지 게스트하우스",
    "room_type_id": "e5ecb581-9a29-4c67-afbc-04dd18d4a1f7",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "10581226-4e7a-4bf5-a613-3cab58f69d6d",
    "property_id": "18444bff-518e-4b19-98a0-4f7b6b2771da",
    "property_name": "표선 바비큐 펜션",
    "room_type_id": "1ed40f9c-e537-4184-a929-e63e957aa861",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "cb29c336-86c1-44a8-b265-a1033bf92e57",
    "property_id": "18444bff-518e-4b19-98a0-4f7b6b2771da",
    "property_name": "표선 바비큐 펜션",
    "room_type_id": "a223bdb1-b1a9-4eca-8b43-f7ceaafc7bad",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "53f23122-3681-4fc0-aedb-32803c40a91c",
    "property_id": "d4eaa82b-615f-4f90-bbfe-562bc9b786e1",
    "property_name": "구좌 한옥 단독주택",
    "room_type_id": "bfeccc2c-22d2-4c62-9f80-80e9a8299a0b",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "b38305b4-5f52-4b59-9978-cd2b0ee9a472",
    "property_id": "d4eaa82b-615f-4f90-bbfe-562bc9b786e1",
    "property_name": "구좌 한옥 단독주택",
    "room_type_id": "1b1da6ab-5427-45dd-9540-f764b12e489a",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "98a5f6b1-765b-4dad-9935-503d71d19ad4",
    "property_id": "483a2abe-8bf0-4b5d-b4cd-40aad66fe2b9",
    "property_name": "경포 시티뷰 아파트",
    "room_type_id": "2a6a8a4d-0c1f-430b-8549-f14de6884469",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "5a611f99-12a0-46ae-bc51-08c54b661fca",
    "property_id": "483a2abe-8bf0-4b5d-b4cd-40aad66fe2b9",
    "property_name": "경포 시티뷰 아파트",
    "room_type_id": "f1084b17-9a75-41f8-8516-9e64067fc944",
    "room_type_name": "디럭스",
    "total_rooms": 8,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "a111337b-3758-4afd-8d3b-d8ec4df46066",
    "property_id": "cf5eb973-ff34-497d-8f58-c2a9fbc26301",
    "property_name": "안목 스위트 호텔",
    "room_type_id": "0ea684bb-182e-439e-958e-d750016a441f",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "2ae7ca2c-314b-4cc2-8395-0f4396cf5485",
    "property_id": "cf5eb973-ff34-497d-8f58-c2a9fbc26301",
    "property_name": "안목 스위트 호텔",
    "room_type_id": "6ff5a00a-d72b-4528-b78e-b7bb7c5b838b",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "0c162233-87d4-40e8-8837-8b8e7e88b372",
    "property_id": "125c41b8-fa68-4be1-b252-55d17fd8ce59",
    "property_name": "주문진 북카페 게스트하우스",
    "room_type_id": "0175585e-e25e-4760-9f4e-94d5c5f75a27",
    "room_type_name": "스탠다드",
    "total_rooms": 12,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "87c633e5-1814-410f-9dae-4d073136b747",
    "property_id": "125c41b8-fa68-4be1-b252-55d17fd8ce59",
    "property_name": "주문진 북카페 게스트하우스",
    "room_type_id": "dfeb5d4c-91ce-4eb3-9e2f-9ba1ccfc9c54",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "219273fa-1f3f-4a50-9092-ca871abe08f4",
    "property_id": "7a0e88fc-4448-4fbc-95ff-50f367475fcc",
    "property_name": "사천 독채 펜션",
    "room_type_id": "c70b6fd8-fb6a-4e08-856e-607c152ca81f",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "b4eca259-5876-4da6-ad61-fb7dfcc09dce",
    "property_id": "7a0e88fc-4448-4fbc-95ff-50f367475fcc",
    "property_name": "사천 독채 펜션",
    "room_type_id": "2cf4a219-035c-43ee-a43d-48bc2588026c",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "b10d49c7-3b61-418d-bece-f69dc799333f",
    "property_id": "81bf7139-9760-48fb-bb00-38d2e415a118",
    "property_name": "경포 정원 단독주택",
    "room_type_id": "03cb59c8-f04e-432b-9c65-8bc46bf5a49d",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "c13bf3c6-cd16-4b71-8444-454ee72d4413",
    "property_id": "81bf7139-9760-48fb-bb00-38d2e415a118",
    "property_name": "경포 정원 단독주택",
    "room_type_id": "e6c31ae5-8647-4dc2-a780-ce0e7e5d448f",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "e88cc8f4-4451-45ba-b224-105ea6f136b2",
    "property_id": "3cb2ee73-79e3-4627-9b9d-e948505cd9f6",
    "property_name": "안목 복층 아파트",
    "room_type_id": "f02f0ffd-576f-4486-853e-d5090725b0a8",
    "room_type_name": "스탠다드",
    "total_rooms": 12,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "2f5cc51d-454f-489a-9294-b706ab99a57f",
    "property_id": "3cb2ee73-79e3-4627-9b9d-e948505cd9f6",
    "property_name": "안목 복층 아파트",
    "room_type_id": "888aca55-6078-4c00-ae2c-59a52e9fa299",
    "room_type_name": "디럭스",
    "total_rooms": 8,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "7879b7e4-dc6c-4676-b0d4-be4a009739a4",
    "property_id": "a5422723-d00f-42ea-b022-93227e17d655",
    "property_name": "황리단길 시티뷰 아파트",
    "room_type_id": "bb2c96cf-396f-44b7-b849-68a5240d03b9",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "dff6a393-3c66-492f-899a-b077b0ec8cc9",
    "property_id": "a5422723-d00f-42ea-b022-93227e17d655",
    "property_name": "황리단길 시티뷰 아파트",
    "room_type_id": "9cd934d3-a758-43ae-a9a4-edb9d3151ff4",
    "room_type_name": "디럭스",
    "total_rooms": 8,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "87f9b588-df33-4db1-9a0c-6e0499ebb301",
    "property_id": "674d716b-affa-4aea-be04-cf17a3be980a",
    "property_name": "보문 스위트 호텔",
    "room_type_id": "e2890856-b22f-4fcb-aa1e-6e58cec4b57e",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "2b20c072-9919-496e-9615-072c739329fe",
    "property_id": "674d716b-affa-4aea-be04-cf17a3be980a",
    "property_name": "보문 스위트 호텔",
    "room_type_id": "c0cdcc6d-9f35-4920-8363-b0637e3cf254",
    "room_type_name": "디럭스",
    "total_rooms": 8,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "02d24d42-3e94-4838-be2c-b7e01f51a958",
    "property_id": "bd8262af-70bf-41b0-97ba-89873ef10dc6",
    "property_name": "불국사 북카페 게스트하우스",
    "room_type_id": "3b5d0eaa-43fa-4959-bb7e-8042c821b400",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "b7f74b50-dd5a-419e-b5cb-cdfe2744f841",
    "property_id": "bd8262af-70bf-41b0-97ba-89873ef10dc6",
    "property_name": "불국사 북카페 게스트하우스",
    "room_type_id": "aca0fb5f-7c28-40ed-83b4-9273141c7865",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "f402d6b4-0eda-44e5-a7f0-71a3784664a7",
    "property_id": "6d636db3-59b5-42e2-b9a3-afc248768e41",
    "property_name": "황리단길 독채 펜션",
    "room_type_id": "a67122cb-c394-4f7e-b8d9-78e1fb799624",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "1ea6bbe2-7586-4cff-a941-8c31d32f62c7",
    "property_id": "6d636db3-59b5-42e2-b9a3-afc248768e41",
    "property_name": "황리단길 독채 펜션",
    "room_type_id": "13d3fac0-867e-470f-b3b9-7ff4d8bdf930",
    "room_type_name": "디럭스",
    "total_rooms": 8,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "62f4bffa-c97f-4036-b8dc-a7ebf018b29a",
    "property_id": "97f78c9e-24a3-4881-8c51-b4717f3849cc",
    "property_name": "보문 정원 단독주택",
    "room_type_id": "5f8dcef9-d288-4e81-a836-688b998ea09d",
    "room_type_name": "스탠다드",
    "total_rooms": 12,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "e6c7bf34-5bd9-4b0d-b181-8b28e325a5e5",
    "property_id": "97f78c9e-24a3-4881-8c51-b4717f3849cc",
    "property_name": "보문 정원 단독주택",
    "room_type_id": "b6a9d06d-f35f-4815-a962-85075694e82d",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "2fc76fef-b766-4efd-839c-d832e4123c7b",
    "property_id": "686fbe51-3036-493a-a40f-725e4186006f",
    "property_name": "연남 시티뷰 아파트",
    "room_type_id": "5aaa26cc-3d31-4a81-8138-b2393f7f5cf8",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "a0ebe084-6807-4807-96dc-dc6e2952cbcb",
    "property_id": "686fbe51-3036-493a-a40f-725e4186006f",
    "property_name": "연남 시티뷰 아파트",
    "room_type_id": "3269d2fd-335c-4e64-a378-e0f53c2f874e",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "5ee580dd-54f1-456d-9e6d-eb86632775a8",
    "property_id": "7f786cb1-838c-4239-a806-42d18e286155",
    "property_name": "성수 스위트 호텔",
    "room_type_id": "87a9065c-375f-4712-8101-91bb1e08d1c9",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "57e9d46f-1ac2-4d6b-bddf-155307955448",
    "property_id": "7f786cb1-838c-4239-a806-42d18e286155",
    "property_name": "성수 스위트 호텔",
    "room_type_id": "e6709479-7e9d-4802-a3cf-951f2c18806a",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "82d8d7d4-4484-4c5b-bb64-dbff302b9552",
    "property_id": "b3b17692-6482-4617-9fbe-d401b0c9e853",
    "property_name": "익선동 북카페 게스트하우스",
    "room_type_id": "47a23fef-1d07-4f05-a730-dbdf2cf078ec",
    "room_type_name": "스탠다드",
    "total_rooms": 12,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "b0e95831-0af3-4da6-9b46-c4d48143b58f",
    "property_id": "b3b17692-6482-4617-9fbe-d401b0c9e853",
    "property_name": "익선동 북카페 게스트하우스",
    "room_type_id": "ed0af307-a1fa-42f4-bd42-f31b6977bba4",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "66043c1b-3ca5-48d9-a574-e44591a53fda",
    "property_id": "593a9e16-dbca-42f3-80f7-4be2221b8d3a",
    "property_name": "서촌 독채 펜션",
    "room_type_id": "edf3ae04-77db-467c-9ffe-8c1fed0b7b8e",
    "room_type_name": "스탠다드",
    "total_rooms": 12,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "9fc9d0f7-8bf3-4e7f-9a1d-f9b636b55ad8",
    "property_id": "593a9e16-dbca-42f3-80f7-4be2221b8d3a",
    "property_name": "서촌 독채 펜션",
    "room_type_id": "4380bd96-b5b8-4931-aea8-a269e2986e87",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "8aa07e04-9a3f-4ef3-8e92-74f7810f70e3",
    "property_id": "ca3480bf-6993-4501-ae00-5031eeec3e2c",
    "property_name": "한남 정원 단독주택",
    "room_type_id": "f328f1b9-f11f-446b-9baa-4daa28d95c8a",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "58170517-daee-4069-94e9-9263ac961527",
    "property_id": "ca3480bf-6993-4501-ae00-5031eeec3e2c",
    "property_name": "한남 정원 단독주택",
    "room_type_id": "4249235c-9498-4b5b-ac7c-c225935f4a4b",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "48dab6f3-d5fc-4ea0-8462-a0ab07c44c97",
    "property_id": "fbc52bc2-7c7b-4615-98ef-08634a1281c0",
    "property_name": "망원 복층 아파트",
    "room_type_id": "ee042265-390d-4b7b-8000-76bf7eb18020",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "bc5f50ae-fac9-44d8-b33b-4df1f0eba2ce",
    "property_id": "fbc52bc2-7c7b-4615-98ef-08634a1281c0",
    "property_name": "망원 복층 아파트",
    "room_type_id": "e890bf8b-405b-4baa-b146-e26217331f21",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "18d27769-9425-41f2-8d25-e941ae5174e1",
    "property_id": "c6f3216a-91e4-4dc3-881a-8c3b80377d73",
    "property_name": "연남 오션뷰 호텔",
    "room_type_id": "2bd6e0eb-cba1-49e1-834c-59ee60c76daa",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "446e2df3-4f31-4db5-829f-396b2a3dab9d",
    "property_id": "c6f3216a-91e4-4dc3-881a-8c3b80377d73",
    "property_name": "연남 오션뷰 호텔",
    "room_type_id": "42f7247d-6ba3-430a-a63e-c2f05705d3c0",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "f640e0cf-6594-445b-9f36-fc4baf0fd6f9",
    "property_id": "b589ae3c-0770-457e-9335-27c1f7550c2b",
    "property_name": "성수 라운지 게스트하우스",
    "room_type_id": "93cd213e-3b2c-4bc6-89b3-6fe89464e6ab",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "a0c1b38f-3f28-4556-81f5-4eb246f7ed84",
    "property_id": "b589ae3c-0770-457e-9335-27c1f7550c2b",
    "property_name": "성수 라운지 게스트하우스",
    "room_type_id": "661d002e-8543-49f6-ad34-3a916f5456d3",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "9884a847-7dbc-429a-8c4d-3cd0fc100e7d",
    "property_id": "8e11c61d-942f-4aff-8dec-a4bf722677ef",
    "property_name": "익선동 바비큐 펜션",
    "room_type_id": "e9665036-1481-4fb2-a0bd-49a9491ee7fa",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "4af32e6e-62ba-453e-ab8f-485b84e38ac6",
    "property_id": "8e11c61d-942f-4aff-8dec-a4bf722677ef",
    "property_name": "익선동 바비큐 펜션",
    "room_type_id": "7ab0dcb8-4967-41a6-8004-ce43ec6be455",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "a5bc69bb-07cf-4187-a779-9d9db6a3b666",
    "property_id": "88150e87-e104-4fb2-a873-2635550d0685",
    "property_name": "서촌 한옥 단독주택",
    "room_type_id": "d207f5f8-1518-437e-b368-346d1a13e289",
    "room_type_name": "스탠다드",
    "total_rooms": 12,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "6d38ef52-a3c8-41d6-be29-c7680ab6d05a",
    "property_id": "88150e87-e104-4fb2-a873-2635550d0685",
    "property_name": "서촌 한옥 단독주택",
    "room_type_id": "353bd5d0-cbc8-49cf-9626-e8d70f683c2c",
    "room_type_name": "디럭스",
    "total_rooms": 8,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "2f1e16d8-300a-46cc-ab0f-5fd905fc5942",
    "property_id": "fb0e8688-8f06-4ac5-8d17-f6b2bbedd3b3",
    "property_name": "한남 루프탑 아파트",
    "room_type_id": "002a67ad-0f8f-4021-a590-70334bc0d1b4",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "1aa0e862-fc2f-4e45-98f0-f6d5d6a86a0a",
    "property_id": "fb0e8688-8f06-4ac5-8d17-f6b2bbedd3b3",
    "property_name": "한남 루프탑 아파트",
    "room_type_id": "9d02ab10-eaca-4ba9-9528-e0b5e84a2883",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "62876629-2256-4e80-8781-ee3c4dc1fd4e",
    "property_id": "2e9516e5-5e8f-415b-bc1e-1f17fa8d9ea0",
    "property_name": "망원 시티 호텔",
    "room_type_id": "5af10628-b8dc-44bd-b0b3-0dd50d980b5e",
    "room_type_name": "스탠다드",
    "total_rooms": 12,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "936571fb-9f87-4af6-8894-20a94a114226",
    "property_id": "2e9516e5-5e8f-415b-bc1e-1f17fa8d9ea0",
    "property_name": "망원 시티 호텔",
    "room_type_id": "199532e5-c0c6-4f26-a430-5952608373b1",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "f32a4752-92a4-4632-828c-c649b64b403d",
    "property_id": "b4691699-a253-4eb3-a272-79bbca0d2b7d",
    "property_name": "해운대 시티뷰 아파트",
    "room_type_id": "6157063e-caa3-43ba-ac58-3ecb9a3f8388",
    "room_type_name": "스탠다드",
    "total_rooms": 12,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "57e9772b-4e06-482a-a7ad-a3edeec4933c",
    "property_id": "b4691699-a253-4eb3-a272-79bbca0d2b7d",
    "property_name": "해운대 시티뷰 아파트",
    "room_type_id": "a9b354b5-961f-4438-ae8b-4f04f5c31df3",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "31a3996b-6a31-4adc-9233-1452db0cae24",
    "property_id": "cf38a761-41fa-488e-9f49-8baa13f242ff",
    "property_name": "광안리 스위트 호텔",
    "room_type_id": "666a9423-9394-4d70-9a34-026d2741f38a",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "403ca5de-6c7f-4a07-82e3-b2eb6e0adc39",
    "property_id": "cf38a761-41fa-488e-9f49-8baa13f242ff",
    "property_name": "광안리 스위트 호텔",
    "room_type_id": "c5870b7e-79d9-48ce-854b-274e986ead18",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "6809f11b-038d-4891-842f-b2b413624ff4",
    "property_id": "3f1edc2c-6af9-4c7b-aa36-3cb70d24dab1",
    "property_name": "송정 북카페 게스트하우스",
    "room_type_id": "20745d83-d591-4d5a-87de-abe7b9833e26",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "18a45ed9-4393-4513-ad6a-6e6af79bf4d1",
    "property_id": "3f1edc2c-6af9-4c7b-aa36-3cb70d24dab1",
    "property_name": "송정 북카페 게스트하우스",
    "room_type_id": "c6280e4b-7e9d-4f5a-a88a-c671a0026382",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "d6549b2c-d43a-47b5-9c7d-810ad48197fb",
    "property_id": "eca93670-35f9-4e1a-b046-6b756ac57377",
    "property_name": "영도 독채 펜션",
    "room_type_id": "83e79f60-268f-4fe4-a095-4dcf1f0f15fe",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "262c6b4a-bf07-4218-bc6b-5fb21c4e73a5",
    "property_id": "eca93670-35f9-4e1a-b046-6b756ac57377",
    "property_name": "영도 독채 펜션",
    "room_type_id": "a2553994-c660-4f6c-8d30-85c05ced4955",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "8e9b1ae3-036d-47ac-96ba-e57e55f24b8a",
    "property_id": "ef6a10c2-6504-486f-9763-316a7d41cc03",
    "property_name": "해운대 정원 단독주택",
    "room_type_id": "50a56dc6-3508-4a88-8db8-6890b5d95e66",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "1039678f-af72-431c-a65b-9b23e73e3f1c",
    "property_id": "ef6a10c2-6504-486f-9763-316a7d41cc03",
    "property_name": "해운대 정원 단독주택",
    "room_type_id": "f7f6a27e-1827-486a-b490-1ca7dd92be3f",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "aeba5008-a3d4-4dbb-a4ba-0e739de85583",
    "property_id": "ed5c802f-7605-4ab0-9633-ac27bdb18403",
    "property_name": "광안리 복층 아파트",
    "room_type_id": "38b4adc4-9fc7-4779-8f1b-fb4b792a0e3d",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "2aef21cb-66ec-4235-ba9c-063052828522",
    "property_id": "ed5c802f-7605-4ab0-9633-ac27bdb18403",
    "property_name": "광안리 복층 아파트",
    "room_type_id": "3eed79a2-08e2-4c7b-8aaa-fdbf6f6c1eed",
    "room_type_name": "디럭스",
    "total_rooms": 8,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "e562f010-e0f1-4e70-8e29-b687b461a9ed",
    "property_id": "8b73210f-36b9-40e1-b999-ac51d8d22d6e",
    "property_name": "송정 오션뷰 호텔",
    "room_type_id": "adac59e3-1321-417c-bc5a-56d88e13ff0d",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "5aedcd7b-08cb-4c73-a45a-7931203064d9",
    "property_id": "8b73210f-36b9-40e1-b999-ac51d8d22d6e",
    "property_name": "송정 오션뷰 호텔",
    "room_type_id": "6f31afaa-41b3-4a60-8157-b330fa33e1cc",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "308db300-3e00-4d65-83de-5eb47d61e626",
    "property_id": "8b0b7c7c-cb31-4d87-9b35-0ca3d02fdab2",
    "property_name": "영도 라운지 게스트하우스",
    "room_type_id": "85bfdd3b-aa2e-417a-b0ef-b5d8b0976d32",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "a198a45e-8622-4e95-b25a-a032bed88e17",
    "property_id": "8b0b7c7c-cb31-4d87-9b35-0ca3d02fdab2",
    "property_name": "영도 라운지 게스트하우스",
    "room_type_id": "0ad5684f-80dc-4a9b-8883-4a0854bec7cb",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "bb85844c-7feb-4f04-9ce4-53eeed92e90e",
    "property_id": "78256ecd-990a-4976-9349-44dc6e9937ae",
    "property_name": "애월 시티뷰 아파트",
    "room_type_id": "725b0c11-0b05-41b1-8e6b-e778c151a8ec",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "d1c68cfa-ab5a-4c4e-be14-a87599905b3f",
    "property_id": "78256ecd-990a-4976-9349-44dc6e9937ae",
    "property_name": "애월 시티뷰 아파트",
    "room_type_id": "64cf3818-ac5e-4604-85b6-2320e9e59937",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "f896cca0-704d-49da-a202-4b1560414c5b",
    "property_id": "60b2e134-67e1-4bc7-a81b-c3a883a9623d",
    "property_name": "성산 스위트 호텔",
    "room_type_id": "ee0e9271-872b-4c3e-902c-08188cd33584",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "2d0a9c37-e3da-401f-a1d3-94697db2c1ec",
    "property_id": "60b2e134-67e1-4bc7-a81b-c3a883a9623d",
    "property_name": "성산 스위트 호텔",
    "room_type_id": "5187eb2b-133e-4e91-93d9-3ad828d4f893",
    "room_type_name": "디럭스",
    "total_rooms": 8,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "effa338c-e6c1-4553-a3f4-afbbf470e469",
    "property_id": "51908106-212d-473a-9606-9b708dc11ca5",
    "property_name": "한림 북카페 게스트하우스",
    "room_type_id": "6a83e43c-b1ea-4ec5-b09f-9a9634f2f14b",
    "room_type_name": "스탠다드",
    "total_rooms": 12,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "7f07cbc5-7904-4418-bef0-5ba7bcc7b51a",
    "property_id": "51908106-212d-473a-9606-9b708dc11ca5",
    "property_name": "한림 북카페 게스트하우스",
    "room_type_id": "f9d395a0-6dd9-4d63-8d28-e8a68e38202c",
    "room_type_name": "디럭스",
    "total_rooms": 8,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "33fb1e16-c241-4129-86fd-ea03b5fe47e5",
    "property_id": "09a4ec5e-2750-4cd2-9bb2-16b8f0c99210",
    "property_name": "표선 독채 펜션",
    "room_type_id": "20e319a4-fca2-4d0c-9d64-b680fa6cd68c",
    "room_type_name": "스탠다드",
    "total_rooms": 12,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "f4935dad-28d4-4c12-87a3-3dc91e6c6834",
    "property_id": "09a4ec5e-2750-4cd2-9bb2-16b8f0c99210",
    "property_name": "표선 독채 펜션",
    "room_type_id": "36a53949-7c74-447e-8703-a53ba5475825",
    "room_type_name": "디럭스",
    "total_rooms": 8,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "1e8e6bda-b19f-48de-b265-e78abc1b06db",
    "property_id": "36ca06d2-5006-4bfa-93b4-e4c064542d0a",
    "property_name": "구좌 정원 단독주택",
    "room_type_id": "769ba52c-389e-4f17-93a1-072da8b37671",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "36bb02d1-7f44-40f9-b82b-25e341a7b53e",
    "property_id": "36ca06d2-5006-4bfa-93b4-e4c064542d0a",
    "property_name": "구좌 정원 단독주택",
    "room_type_id": "22cef8ad-26c5-4931-a523-52131ba9ee27",
    "room_type_name": "디럭스",
    "total_rooms": 8,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "9b4f0fd9-dd80-47f2-af26-f455787eb559",
    "property_id": "3688a239-db15-49cf-997a-6182df9774bc",
    "property_name": "애월 복층 아파트",
    "room_type_id": "b7f399bd-95d7-44b9-bbe0-6b36cd0d8e84",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "92db80af-1206-4fcc-8e2c-a38b14aa72a5",
    "property_id": "3688a239-db15-49cf-997a-6182df9774bc",
    "property_name": "애월 복층 아파트",
    "room_type_id": "4bca1572-7965-40dd-9d29-e8babab87417",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "f324077d-9307-4880-8f89-70d66b2b3ac9",
    "property_id": "e3df1b23-f249-4025-bfe0-cf0905ade2ca",
    "property_name": "성산 오션뷰 호텔",
    "room_type_id": "865a218a-ece8-4277-8881-fb6f4c2329a3",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "e72c1669-16be-4beb-99c6-88997e8610d7",
    "property_id": "e3df1b23-f249-4025-bfe0-cf0905ade2ca",
    "property_name": "성산 오션뷰 호텔",
    "room_type_id": "1ea85a29-8391-4573-bb4f-48e94d7b1a6c",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "cc551943-db9d-4557-8fca-c1d5658ce382",
    "property_id": "1e3efa62-a0c3-4af0-88ce-7864a205df5c",
    "property_name": "한림 라운지 게스트하우스",
    "room_type_id": "2867ad59-af7f-4e51-b772-5be020c956ee",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "94f90b96-e94c-4585-86d8-cb0d5beab962",
    "property_id": "1e3efa62-a0c3-4af0-88ce-7864a205df5c",
    "property_name": "한림 라운지 게스트하우스",
    "room_type_id": "e5ecb581-9a29-4c67-afbc-04dd18d4a1f7",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "ffd30266-1c07-4133-9446-ffb9776e52a1",
    "property_id": "18444bff-518e-4b19-98a0-4f7b6b2771da",
    "property_name": "표선 바비큐 펜션",
    "room_type_id": "1ed40f9c-e537-4184-a929-e63e957aa861",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "20455eac-529b-4b5a-9801-af90a93b925f",
    "property_id": "18444bff-518e-4b19-98a0-4f7b6b2771da",
    "property_name": "표선 바비큐 펜션",
    "room_type_id": "a223bdb1-b1a9-4eca-8b43-f7ceaafc7bad",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "6d603981-eacf-4595-b207-5928b83ed16f",
    "property_id": "d4eaa82b-615f-4f90-bbfe-562bc9b786e1",
    "property_name": "구좌 한옥 단독주택",
    "room_type_id": "bfeccc2c-22d2-4c62-9f80-80e9a8299a0b",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "985b17d4-1a63-478d-9717-61683744e7e1",
    "property_id": "d4eaa82b-615f-4f90-bbfe-562bc9b786e1",
    "property_name": "구좌 한옥 단독주택",
    "room_type_id": "1b1da6ab-5427-45dd-9540-f764b12e489a",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "31b48863-697c-4447-a595-2b5e4b7a050c",
    "property_id": "483a2abe-8bf0-4b5d-b4cd-40aad66fe2b9",
    "property_name": "경포 시티뷰 아파트",
    "room_type_id": "2a6a8a4d-0c1f-430b-8549-f14de6884469",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "6b522365-4d84-48ba-8c2d-33acd0fd8d28",
    "property_id": "483a2abe-8bf0-4b5d-b4cd-40aad66fe2b9",
    "property_name": "경포 시티뷰 아파트",
    "room_type_id": "f1084b17-9a75-41f8-8516-9e64067fc944",
    "room_type_name": "디럭스",
    "total_rooms": 8,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "3db2dcac-6efa-4d58-9d46-cc36d243c1a0",
    "property_id": "cf5eb973-ff34-497d-8f58-c2a9fbc26301",
    "property_name": "안목 스위트 호텔",
    "room_type_id": "0ea684bb-182e-439e-958e-d750016a441f",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "39c7c57c-754c-4a10-a807-11f432d36bf2",
    "property_id": "cf5eb973-ff34-497d-8f58-c2a9fbc26301",
    "property_name": "안목 스위트 호텔",
    "room_type_id": "6ff5a00a-d72b-4528-b78e-b7bb7c5b838b",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "17d1360c-91b9-4b37-9cc9-07cded0508d1",
    "property_id": "125c41b8-fa68-4be1-b252-55d17fd8ce59",
    "property_name": "주문진 북카페 게스트하우스",
    "room_type_id": "0175585e-e25e-4760-9f4e-94d5c5f75a27",
    "room_type_name": "스탠다드",
    "total_rooms": 12,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "f8489b35-f8ee-4d43-adfc-7e4ad7d47598",
    "property_id": "125c41b8-fa68-4be1-b252-55d17fd8ce59",
    "property_name": "주문진 북카페 게스트하우스",
    "room_type_id": "dfeb5d4c-91ce-4eb3-9e2f-9ba1ccfc9c54",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "4e75b871-f3c2-49d0-be47-7354bebf5ef2",
    "property_id": "7a0e88fc-4448-4fbc-95ff-50f367475fcc",
    "property_name": "사천 독채 펜션",
    "room_type_id": "c70b6fd8-fb6a-4e08-856e-607c152ca81f",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "1889ad28-50fe-4f7b-a4cc-2298afc3594f",
    "property_id": "7a0e88fc-4448-4fbc-95ff-50f367475fcc",
    "property_name": "사천 독채 펜션",
    "room_type_id": "2cf4a219-035c-43ee-a43d-48bc2588026c",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "08806fee-b572-49ae-afe8-a2f83808cd3f",
    "property_id": "81bf7139-9760-48fb-bb00-38d2e415a118",
    "property_name": "경포 정원 단독주택",
    "room_type_id": "03cb59c8-f04e-432b-9c65-8bc46bf5a49d",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "f9d112ee-c9f1-4b5e-9447-4f64eac38c59",
    "property_id": "81bf7139-9760-48fb-bb00-38d2e415a118",
    "property_name": "경포 정원 단독주택",
    "room_type_id": "e6c31ae5-8647-4dc2-a780-ce0e7e5d448f",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "af6e269d-919a-4916-a8e0-5229430f0228",
    "property_id": "3cb2ee73-79e3-4627-9b9d-e948505cd9f6",
    "property_name": "안목 복층 아파트",
    "room_type_id": "f02f0ffd-576f-4486-853e-d5090725b0a8",
    "room_type_name": "스탠다드",
    "total_rooms": 12,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "2c8f9784-f3c8-47f9-801d-3d8be96f290f",
    "property_id": "3cb2ee73-79e3-4627-9b9d-e948505cd9f6",
    "property_name": "안목 복층 아파트",
    "room_type_id": "888aca55-6078-4c00-ae2c-59a52e9fa299",
    "room_type_name": "디럭스",
    "total_rooms": 8,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "b2a6271e-f2a7-4215-8382-8d729f5e5610",
    "property_id": "a5422723-d00f-42ea-b022-93227e17d655",
    "property_name": "황리단길 시티뷰 아파트",
    "room_type_id": "bb2c96cf-396f-44b7-b849-68a5240d03b9",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "a3eecd74-7e4d-4d66-974d-76ca06133f39",
    "property_id": "a5422723-d00f-42ea-b022-93227e17d655",
    "property_name": "황리단길 시티뷰 아파트",
    "room_type_id": "9cd934d3-a758-43ae-a9a4-edb9d3151ff4",
    "room_type_name": "디럭스",
    "total_rooms": 8,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "00aea766-b49c-4567-b529-dd507942cfdb",
    "property_id": "674d716b-affa-4aea-be04-cf17a3be980a",
    "property_name": "보문 스위트 호텔",
    "room_type_id": "e2890856-b22f-4fcb-aa1e-6e58cec4b57e",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "96ba8824-4f7c-4a70-93be-113251128466",
    "property_id": "674d716b-affa-4aea-be04-cf17a3be980a",
    "property_name": "보문 스위트 호텔",
    "room_type_id": "c0cdcc6d-9f35-4920-8363-b0637e3cf254",
    "room_type_name": "디럭스",
    "total_rooms": 8,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "c3f71e39-023f-4f17-a8e3-8f9d29e214d0",
    "property_id": "bd8262af-70bf-41b0-97ba-89873ef10dc6",
    "property_name": "불국사 북카페 게스트하우스",
    "room_type_id": "3b5d0eaa-43fa-4959-bb7e-8042c821b400",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "3b9724e9-474a-4500-8a9e-4755d0219478",
    "property_id": "bd8262af-70bf-41b0-97ba-89873ef10dc6",
    "property_name": "불국사 북카페 게스트하우스",
    "room_type_id": "aca0fb5f-7c28-40ed-83b4-9273141c7865",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "d4f1b796-7dbd-4084-89eb-ed52a9c9ba92",
    "property_id": "6d636db3-59b5-42e2-b9a3-afc248768e41",
    "property_name": "황리단길 독채 펜션",
    "room_type_id": "a67122cb-c394-4f7e-b8d9-78e1fb799624",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "98b43004-dd7e-4aa3-a0b2-fa91bdcfd0e5",
    "property_id": "6d636db3-59b5-42e2-b9a3-afc248768e41",
    "property_name": "황리단길 독채 펜션",
    "room_type_id": "13d3fac0-867e-470f-b3b9-7ff4d8bdf930",
    "room_type_name": "디럭스",
    "total_rooms": 8,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "e038f3ba-b331-4dbd-99a6-bd82fa002d83",
    "property_id": "97f78c9e-24a3-4881-8c51-b4717f3849cc",
    "property_name": "보문 정원 단독주택",
    "room_type_id": "5f8dcef9-d288-4e81-a836-688b998ea09d",
    "room_type_name": "스탠다드",
    "total_rooms": 12,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "a0bfea34-9038-454b-904d-715d3c0f0ad5",
    "property_id": "97f78c9e-24a3-4881-8c51-b4717f3849cc",
    "property_name": "보문 정원 단독주택",
    "room_type_id": "b6a9d06d-f35f-4815-a962-85075694e82d",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "107a0b3c-b97f-4b24-b037-fdf435d2fa11",
    "property_id": "686fbe51-3036-493a-a40f-725e4186006f",
    "property_name": "연남 시티뷰 아파트",
    "room_type_id": "5aaa26cc-3d31-4a81-8138-b2393f7f5cf8",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "3d91955b-575f-4818-9d6f-83270af531f3",
    "property_id": "686fbe51-3036-493a-a40f-725e4186006f",
    "property_name": "연남 시티뷰 아파트",
    "room_type_id": "3269d2fd-335c-4e64-a378-e0f53c2f874e",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "172bc837-7a1f-48d2-9f82-6796313ec58f",
    "property_id": "7f786cb1-838c-4239-a806-42d18e286155",
    "property_name": "성수 스위트 호텔",
    "room_type_id": "87a9065c-375f-4712-8101-91bb1e08d1c9",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "5ef68dcb-8a10-4a7f-ae93-3c2dc03f43d2",
    "property_id": "7f786cb1-838c-4239-a806-42d18e286155",
    "property_name": "성수 스위트 호텔",
    "room_type_id": "e6709479-7e9d-4802-a3cf-951f2c18806a",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "d7824cf8-ad96-4df0-97c6-f26ee445ea24",
    "property_id": "b3b17692-6482-4617-9fbe-d401b0c9e853",
    "property_name": "익선동 북카페 게스트하우스",
    "room_type_id": "47a23fef-1d07-4f05-a730-dbdf2cf078ec",
    "room_type_name": "스탠다드",
    "total_rooms": 12,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "2b8b6f48-a58f-488b-9e88-bb2999fb8059",
    "property_id": "b3b17692-6482-4617-9fbe-d401b0c9e853",
    "property_name": "익선동 북카페 게스트하우스",
    "room_type_id": "ed0af307-a1fa-42f4-bd42-f31b6977bba4",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "aba5670b-b9c9-4099-ada5-028a14de1b8e",
    "property_id": "593a9e16-dbca-42f3-80f7-4be2221b8d3a",
    "property_name": "서촌 독채 펜션",
    "room_type_id": "edf3ae04-77db-467c-9ffe-8c1fed0b7b8e",
    "room_type_name": "스탠다드",
    "total_rooms": 12,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "8afe27de-91b7-4183-a3db-40c9673a2758",
    "property_id": "593a9e16-dbca-42f3-80f7-4be2221b8d3a",
    "property_name": "서촌 독채 펜션",
    "room_type_id": "4380bd96-b5b8-4931-aea8-a269e2986e87",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "944be4eb-7749-42e9-a29b-23aedce1ce2a",
    "property_id": "ca3480bf-6993-4501-ae00-5031eeec3e2c",
    "property_name": "한남 정원 단독주택",
    "room_type_id": "f328f1b9-f11f-446b-9baa-4daa28d95c8a",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "4982d2da-85e3-4a03-965c-dc0f7ed843b6",
    "property_id": "ca3480bf-6993-4501-ae00-5031eeec3e2c",
    "property_name": "한남 정원 단독주택",
    "room_type_id": "4249235c-9498-4b5b-ac7c-c225935f4a4b",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "f64aca66-f8a5-4b92-b644-bb2355f934e0",
    "property_id": "fbc52bc2-7c7b-4615-98ef-08634a1281c0",
    "property_name": "망원 복층 아파트",
    "room_type_id": "ee042265-390d-4b7b-8000-76bf7eb18020",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "1dcbc50f-01a7-42ab-b6af-feaf0a1d5aef",
    "property_id": "fbc52bc2-7c7b-4615-98ef-08634a1281c0",
    "property_name": "망원 복층 아파트",
    "room_type_id": "e890bf8b-405b-4baa-b146-e26217331f21",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "7c978a7c-8d1a-4d27-9c61-bcde81ade584",
    "property_id": "c6f3216a-91e4-4dc3-881a-8c3b80377d73",
    "property_name": "연남 오션뷰 호텔",
    "room_type_id": "2bd6e0eb-cba1-49e1-834c-59ee60c76daa",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "996a169f-5534-409e-ba3f-9dc64595c537",
    "property_id": "c6f3216a-91e4-4dc3-881a-8c3b80377d73",
    "property_name": "연남 오션뷰 호텔",
    "room_type_id": "42f7247d-6ba3-430a-a63e-c2f05705d3c0",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "07f725dd-aa65-4ff7-a6ab-97edd1d7aa4f",
    "property_id": "b589ae3c-0770-457e-9335-27c1f7550c2b",
    "property_name": "성수 라운지 게스트하우스",
    "room_type_id": "93cd213e-3b2c-4bc6-89b3-6fe89464e6ab",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "0d8f2dc9-2bcd-475f-b2d3-011c5ca3b9d4",
    "property_id": "b589ae3c-0770-457e-9335-27c1f7550c2b",
    "property_name": "성수 라운지 게스트하우스",
    "room_type_id": "661d002e-8543-49f6-ad34-3a916f5456d3",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "bfc48e03-7558-443c-9da4-25d1fb5aa4c1",
    "property_id": "8e11c61d-942f-4aff-8dec-a4bf722677ef",
    "property_name": "익선동 바비큐 펜션",
    "room_type_id": "e9665036-1481-4fb2-a0bd-49a9491ee7fa",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "f148df72-6654-4648-b5a5-ce34738f05fd",
    "property_id": "8e11c61d-942f-4aff-8dec-a4bf722677ef",
    "property_name": "익선동 바비큐 펜션",
    "room_type_id": "7ab0dcb8-4967-41a6-8004-ce43ec6be455",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "059d8f7f-c684-41ed-aac3-8e3f4d9966d5",
    "property_id": "88150e87-e104-4fb2-a873-2635550d0685",
    "property_name": "서촌 한옥 단독주택",
    "room_type_id": "d207f5f8-1518-437e-b368-346d1a13e289",
    "room_type_name": "스탠다드",
    "total_rooms": 12,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "ec73b309-4fe5-4594-8b10-b5ea486574a7",
    "property_id": "88150e87-e104-4fb2-a873-2635550d0685",
    "property_name": "서촌 한옥 단독주택",
    "room_type_id": "353bd5d0-cbc8-49cf-9626-e8d70f683c2c",
    "room_type_name": "디럭스",
    "total_rooms": 8,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "5edfe87b-f2fc-4054-ba8d-ba865430ad1c",
    "property_id": "fb0e8688-8f06-4ac5-8d17-f6b2bbedd3b3",
    "property_name": "한남 루프탑 아파트",
    "room_type_id": "002a67ad-0f8f-4021-a590-70334bc0d1b4",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "3f64b154-bdf1-4657-8a94-24024e6c54a1",
    "property_id": "fb0e8688-8f06-4ac5-8d17-f6b2bbedd3b3",
    "property_name": "한남 루프탑 아파트",
    "room_type_id": "9d02ab10-eaca-4ba9-9528-e0b5e84a2883",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "1922113b-3fc8-465f-ae6c-2750723b3c82",
    "property_id": "2e9516e5-5e8f-415b-bc1e-1f17fa8d9ea0",
    "property_name": "망원 시티 호텔",
    "room_type_id": "5af10628-b8dc-44bd-b0b3-0dd50d980b5e",
    "room_type_name": "스탠다드",
    "total_rooms": 12,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "3de40bf6-8985-4872-9211-698b14180182",
    "property_id": "2e9516e5-5e8f-415b-bc1e-1f17fa8d9ea0",
    "property_name": "망원 시티 호텔",
    "room_type_id": "199532e5-c0c6-4f26-a430-5952608373b1",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "21f71aba-5bc7-45ea-9449-0794f79490b7",
    "property_id": "b4691699-a253-4eb3-a272-79bbca0d2b7d",
    "property_name": "해운대 시티뷰 아파트",
    "room_type_id": "6157063e-caa3-43ba-ac58-3ecb9a3f8388",
    "room_type_name": "스탠다드",
    "total_rooms": 12,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "754cf581-5637-4aa7-a245-f08bc90c852e",
    "property_id": "b4691699-a253-4eb3-a272-79bbca0d2b7d",
    "property_name": "해운대 시티뷰 아파트",
    "room_type_id": "a9b354b5-961f-4438-ae8b-4f04f5c31df3",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "d712ddc4-4b17-495a-9bd4-79f15b48d05c",
    "property_id": "cf38a761-41fa-488e-9f49-8baa13f242ff",
    "property_name": "광안리 스위트 호텔",
    "room_type_id": "666a9423-9394-4d70-9a34-026d2741f38a",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "f9d884f8-fa6f-49d6-8a66-e76654df3fa9",
    "property_id": "cf38a761-41fa-488e-9f49-8baa13f242ff",
    "property_name": "광안리 스위트 호텔",
    "room_type_id": "c5870b7e-79d9-48ce-854b-274e986ead18",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "e170da1e-7115-4efa-9e04-73ef0ac7f7bc",
    "property_id": "3f1edc2c-6af9-4c7b-aa36-3cb70d24dab1",
    "property_name": "송정 북카페 게스트하우스",
    "room_type_id": "20745d83-d591-4d5a-87de-abe7b9833e26",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "8f4a494e-2235-4e00-aeff-095c3e9c4275",
    "property_id": "3f1edc2c-6af9-4c7b-aa36-3cb70d24dab1",
    "property_name": "송정 북카페 게스트하우스",
    "room_type_id": "c6280e4b-7e9d-4f5a-a88a-c671a0026382",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "ab7c9aa6-293c-4139-ac68-664e392a879f",
    "property_id": "eca93670-35f9-4e1a-b046-6b756ac57377",
    "property_name": "영도 독채 펜션",
    "room_type_id": "83e79f60-268f-4fe4-a095-4dcf1f0f15fe",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "3a2e9de1-43dc-4faa-8ee2-e36aa1fd3f54",
    "property_id": "eca93670-35f9-4e1a-b046-6b756ac57377",
    "property_name": "영도 독채 펜션",
    "room_type_id": "a2553994-c660-4f6c-8d30-85c05ced4955",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "e7cc73ec-0660-4165-a314-8668c4a0adb5",
    "property_id": "ef6a10c2-6504-486f-9763-316a7d41cc03",
    "property_name": "해운대 정원 단독주택",
    "room_type_id": "50a56dc6-3508-4a88-8db8-6890b5d95e66",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "26dc49b6-30a9-46b9-ad20-95a4b9ab63c3",
    "property_id": "ef6a10c2-6504-486f-9763-316a7d41cc03",
    "property_name": "해운대 정원 단독주택",
    "room_type_id": "f7f6a27e-1827-486a-b490-1ca7dd92be3f",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "0cc3282b-5a1b-4c8e-b4e3-8dffa93d3e25",
    "property_id": "ed5c802f-7605-4ab0-9633-ac27bdb18403",
    "property_name": "광안리 복층 아파트",
    "room_type_id": "38b4adc4-9fc7-4779-8f1b-fb4b792a0e3d",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "651e72c9-32ff-477c-bb56-3aa00187cedd",
    "property_id": "ed5c802f-7605-4ab0-9633-ac27bdb18403",
    "property_name": "광안리 복층 아파트",
    "room_type_id": "3eed79a2-08e2-4c7b-8aaa-fdbf6f6c1eed",
    "room_type_name": "디럭스",
    "total_rooms": 8,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "abe50943-68ba-4055-b57f-1ae505c52639",
    "property_id": "8b73210f-36b9-40e1-b999-ac51d8d22d6e",
    "property_name": "송정 오션뷰 호텔",
    "room_type_id": "adac59e3-1321-417c-bc5a-56d88e13ff0d",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "dcdba59c-49ce-49a0-86d5-ff0a93aeafc1",
    "property_id": "8b73210f-36b9-40e1-b999-ac51d8d22d6e",
    "property_name": "송정 오션뷰 호텔",
    "room_type_id": "6f31afaa-41b3-4a60-8157-b330fa33e1cc",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "4f30ab90-d6f1-41a3-933d-7118dc39638d",
    "property_id": "8b0b7c7c-cb31-4d87-9b35-0ca3d02fdab2",
    "property_name": "영도 라운지 게스트하우스",
    "room_type_id": "85bfdd3b-aa2e-417a-b0ef-b5d8b0976d32",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "20c89442-683b-4bdc-9f46-9a7497596fa0",
    "property_id": "8b0b7c7c-cb31-4d87-9b35-0ca3d02fdab2",
    "property_name": "영도 라운지 게스트하우스",
    "room_type_id": "0ad5684f-80dc-4a9b-8883-4a0854bec7cb",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "3cb5a776-2b36-49f1-a39e-291afbdbd67c",
    "property_id": "78256ecd-990a-4976-9349-44dc6e9937ae",
    "property_name": "애월 시티뷰 아파트",
    "room_type_id": "725b0c11-0b05-41b1-8e6b-e778c151a8ec",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "d3a3f4a3-16e5-4aa4-94f6-a4b0023310d3",
    "property_id": "78256ecd-990a-4976-9349-44dc6e9937ae",
    "property_name": "애월 시티뷰 아파트",
    "room_type_id": "64cf3818-ac5e-4604-85b6-2320e9e59937",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "c0a73486-359a-43da-810d-ccdb107d4a8a",
    "property_id": "60b2e134-67e1-4bc7-a81b-c3a883a9623d",
    "property_name": "성산 스위트 호텔",
    "room_type_id": "ee0e9271-872b-4c3e-902c-08188cd33584",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "5df876c9-1edf-451c-bbac-5b3c63fe79d2",
    "property_id": "60b2e134-67e1-4bc7-a81b-c3a883a9623d",
    "property_name": "성산 스위트 호텔",
    "room_type_id": "5187eb2b-133e-4e91-93d9-3ad828d4f893",
    "room_type_name": "디럭스",
    "total_rooms": 8,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "6d846a26-2725-4c62-8535-ed453338319c",
    "property_id": "51908106-212d-473a-9606-9b708dc11ca5",
    "property_name": "한림 북카페 게스트하우스",
    "room_type_id": "6a83e43c-b1ea-4ec5-b09f-9a9634f2f14b",
    "room_type_name": "스탠다드",
    "total_rooms": 12,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "abcdaf69-637e-48a3-9924-4b836bb66aa9",
    "property_id": "51908106-212d-473a-9606-9b708dc11ca5",
    "property_name": "한림 북카페 게스트하우스",
    "room_type_id": "f9d395a0-6dd9-4d63-8d28-e8a68e38202c",
    "room_type_name": "디럭스",
    "total_rooms": 8,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "cf41e1de-e30e-4fbf-be30-3799e913f494",
    "property_id": "09a4ec5e-2750-4cd2-9bb2-16b8f0c99210",
    "property_name": "표선 독채 펜션",
    "room_type_id": "20e319a4-fca2-4d0c-9d64-b680fa6cd68c",
    "room_type_name": "스탠다드",
    "total_rooms": 12,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "2e5a970c-d362-4b80-bbb9-ad13ea30192a",
    "property_id": "09a4ec5e-2750-4cd2-9bb2-16b8f0c99210",
    "property_name": "표선 독채 펜션",
    "room_type_id": "36a53949-7c74-447e-8703-a53ba5475825",
    "room_type_name": "디럭스",
    "total_rooms": 8,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "9a17b57c-5995-4f38-9f9c-f7d2848f3a48",
    "property_id": "36ca06d2-5006-4bfa-93b4-e4c064542d0a",
    "property_name": "구좌 정원 단독주택",
    "room_type_id": "769ba52c-389e-4f17-93a1-072da8b37671",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "1e99d317-0b0d-4055-b0ec-057803bc2a19",
    "property_id": "36ca06d2-5006-4bfa-93b4-e4c064542d0a",
    "property_name": "구좌 정원 단독주택",
    "room_type_id": "22cef8ad-26c5-4931-a523-52131ba9ee27",
    "room_type_name": "디럭스",
    "total_rooms": 8,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "aebf3047-8e7e-4fc1-b051-087c3434a3f9",
    "property_id": "3688a239-db15-49cf-997a-6182df9774bc",
    "property_name": "애월 복층 아파트",
    "room_type_id": "b7f399bd-95d7-44b9-bbe0-6b36cd0d8e84",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "fd925efe-98bb-4984-9505-4500e0fded20",
    "property_id": "3688a239-db15-49cf-997a-6182df9774bc",
    "property_name": "애월 복층 아파트",
    "room_type_id": "4bca1572-7965-40dd-9d29-e8babab87417",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "4534b400-4523-449c-911f-947e1d512b98",
    "property_id": "e3df1b23-f249-4025-bfe0-cf0905ade2ca",
    "property_name": "성산 오션뷰 호텔",
    "room_type_id": "865a218a-ece8-4277-8881-fb6f4c2329a3",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "9349f5b9-e742-4bde-8e2b-339f970fd2b2",
    "property_id": "e3df1b23-f249-4025-bfe0-cf0905ade2ca",
    "property_name": "성산 오션뷰 호텔",
    "room_type_id": "1ea85a29-8391-4573-bb4f-48e94d7b1a6c",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "cb9b5db4-4ca5-44ba-9608-4ed1a5b40a63",
    "property_id": "1e3efa62-a0c3-4af0-88ce-7864a205df5c",
    "property_name": "한림 라운지 게스트하우스",
    "room_type_id": "2867ad59-af7f-4e51-b772-5be020c956ee",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "e69e08dd-8024-4728-8bcb-d31d184616ae",
    "property_id": "1e3efa62-a0c3-4af0-88ce-7864a205df5c",
    "property_name": "한림 라운지 게스트하우스",
    "room_type_id": "e5ecb581-9a29-4c67-afbc-04dd18d4a1f7",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "4e336e1e-aca7-492a-a9c1-7e9de6babd21",
    "property_id": "18444bff-518e-4b19-98a0-4f7b6b2771da",
    "property_name": "표선 바비큐 펜션",
    "room_type_id": "1ed40f9c-e537-4184-a929-e63e957aa861",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "6c4ce3d9-4be6-4332-8ddc-b0304de18370",
    "property_id": "18444bff-518e-4b19-98a0-4f7b6b2771da",
    "property_name": "표선 바비큐 펜션",
    "room_type_id": "a223bdb1-b1a9-4eca-8b43-f7ceaafc7bad",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "afb0f54a-54a2-4008-b45b-db1189189a96",
    "property_id": "d4eaa82b-615f-4f90-bbfe-562bc9b786e1",
    "property_name": "구좌 한옥 단독주택",
    "room_type_id": "bfeccc2c-22d2-4c62-9f80-80e9a8299a0b",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "f5474ab8-6716-433b-88b5-fa90fc3a2724",
    "property_id": "d4eaa82b-615f-4f90-bbfe-562bc9b786e1",
    "property_name": "구좌 한옥 단독주택",
    "room_type_id": "1b1da6ab-5427-45dd-9540-f764b12e489a",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "71ac0ca1-79ff-48f7-a54e-a62d8e868a72",
    "property_id": "483a2abe-8bf0-4b5d-b4cd-40aad66fe2b9",
    "property_name": "경포 시티뷰 아파트",
    "room_type_id": "2a6a8a4d-0c1f-430b-8549-f14de6884469",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "5a76a9f3-174d-44eb-8398-cb02234edead",
    "property_id": "483a2abe-8bf0-4b5d-b4cd-40aad66fe2b9",
    "property_name": "경포 시티뷰 아파트",
    "room_type_id": "f1084b17-9a75-41f8-8516-9e64067fc944",
    "room_type_name": "디럭스",
    "total_rooms": 8,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "e29543e9-9441-4eb4-ab53-2a52cf795c9b",
    "property_id": "cf5eb973-ff34-497d-8f58-c2a9fbc26301",
    "property_name": "안목 스위트 호텔",
    "room_type_id": "0ea684bb-182e-439e-958e-d750016a441f",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "5262bf9c-657b-4b4c-8772-62aa2db39fe2",
    "property_id": "cf5eb973-ff34-497d-8f58-c2a9fbc26301",
    "property_name": "안목 스위트 호텔",
    "room_type_id": "6ff5a00a-d72b-4528-b78e-b7bb7c5b838b",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "ce5dbaef-d808-4119-bd0f-f6356d4a5a1a",
    "property_id": "125c41b8-fa68-4be1-b252-55d17fd8ce59",
    "property_name": "주문진 북카페 게스트하우스",
    "room_type_id": "0175585e-e25e-4760-9f4e-94d5c5f75a27",
    "room_type_name": "스탠다드",
    "total_rooms": 12,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "80220ef3-fd9c-492f-ba23-896b33267e0e",
    "property_id": "125c41b8-fa68-4be1-b252-55d17fd8ce59",
    "property_name": "주문진 북카페 게스트하우스",
    "room_type_id": "dfeb5d4c-91ce-4eb3-9e2f-9ba1ccfc9c54",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "b645522e-23fe-467b-90c6-7a1010643c1f",
    "property_id": "7a0e88fc-4448-4fbc-95ff-50f367475fcc",
    "property_name": "사천 독채 펜션",
    "room_type_id": "c70b6fd8-fb6a-4e08-856e-607c152ca81f",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "d4b0badf-96e7-4236-80b4-5e0a69b0c94a",
    "property_id": "7a0e88fc-4448-4fbc-95ff-50f367475fcc",
    "property_name": "사천 독채 펜션",
    "room_type_id": "2cf4a219-035c-43ee-a43d-48bc2588026c",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "0ec85140-9a28-4de0-ad43-05b676048860",
    "property_id": "81bf7139-9760-48fb-bb00-38d2e415a118",
    "property_name": "경포 정원 단독주택",
    "room_type_id": "03cb59c8-f04e-432b-9c65-8bc46bf5a49d",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "5b710913-1cc2-4781-9aca-6e050b994241",
    "property_id": "81bf7139-9760-48fb-bb00-38d2e415a118",
    "property_name": "경포 정원 단독주택",
    "room_type_id": "e6c31ae5-8647-4dc2-a780-ce0e7e5d448f",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "43a07303-553d-49c6-abe8-267c8b2b7762",
    "property_id": "3cb2ee73-79e3-4627-9b9d-e948505cd9f6",
    "property_name": "안목 복층 아파트",
    "room_type_id": "f02f0ffd-576f-4486-853e-d5090725b0a8",
    "room_type_name": "스탠다드",
    "total_rooms": 12,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "a3a8232c-7b61-4488-ab83-e3cc6519ec07",
    "property_id": "3cb2ee73-79e3-4627-9b9d-e948505cd9f6",
    "property_name": "안목 복층 아파트",
    "room_type_id": "888aca55-6078-4c00-ae2c-59a52e9fa299",
    "room_type_name": "디럭스",
    "total_rooms": 8,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "f6567fe0-e7c9-4ff7-86bd-d1595188f524",
    "property_id": "a5422723-d00f-42ea-b022-93227e17d655",
    "property_name": "황리단길 시티뷰 아파트",
    "room_type_id": "bb2c96cf-396f-44b7-b849-68a5240d03b9",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "aaa78afa-f86c-492a-83a1-5a733f57334a",
    "property_id": "a5422723-d00f-42ea-b022-93227e17d655",
    "property_name": "황리단길 시티뷰 아파트",
    "room_type_id": "9cd934d3-a758-43ae-a9a4-edb9d3151ff4",
    "room_type_name": "디럭스",
    "total_rooms": 8,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "b4bdaf2e-e205-4e12-bd03-5f41099e9229",
    "property_id": "674d716b-affa-4aea-be04-cf17a3be980a",
    "property_name": "보문 스위트 호텔",
    "room_type_id": "e2890856-b22f-4fcb-aa1e-6e58cec4b57e",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "a792897c-c6db-45b2-8ec1-8b2f3228292c",
    "property_id": "674d716b-affa-4aea-be04-cf17a3be980a",
    "property_name": "보문 스위트 호텔",
    "room_type_id": "c0cdcc6d-9f35-4920-8363-b0637e3cf254",
    "room_type_name": "디럭스",
    "total_rooms": 8,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "b1e4fc03-4f6f-46f3-9818-585ed25b3acd",
    "property_id": "bd8262af-70bf-41b0-97ba-89873ef10dc6",
    "property_name": "불국사 북카페 게스트하우스",
    "room_type_id": "3b5d0eaa-43fa-4959-bb7e-8042c821b400",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "aab7caff-ae95-45a3-83cb-3a861c0461b8",
    "property_id": "bd8262af-70bf-41b0-97ba-89873ef10dc6",
    "property_name": "불국사 북카페 게스트하우스",
    "room_type_id": "aca0fb5f-7c28-40ed-83b4-9273141c7865",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "9facb7f9-50c6-46e1-8f64-848327967df9",
    "property_id": "6d636db3-59b5-42e2-b9a3-afc248768e41",
    "property_name": "황리단길 독채 펜션",
    "room_type_id": "a67122cb-c394-4f7e-b8d9-78e1fb799624",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "303f04e3-84dd-400a-a6e8-05c0fb3662c0",
    "property_id": "6d636db3-59b5-42e2-b9a3-afc248768e41",
    "property_name": "황리단길 독채 펜션",
    "room_type_id": "13d3fac0-867e-470f-b3b9-7ff4d8bdf930",
    "room_type_name": "디럭스",
    "total_rooms": 8,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "98174f8e-3e5e-4566-a627-dfaf34a04da8",
    "property_id": "97f78c9e-24a3-4881-8c51-b4717f3849cc",
    "property_name": "보문 정원 단독주택",
    "room_type_id": "5f8dcef9-d288-4e81-a836-688b998ea09d",
    "room_type_name": "스탠다드",
    "total_rooms": 12,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "d6f178e0-79ec-4fdd-ab1b-75d793160612",
    "property_id": "97f78c9e-24a3-4881-8c51-b4717f3849cc",
    "property_name": "보문 정원 단독주택",
    "room_type_id": "b6a9d06d-f35f-4815-a962-85075694e82d",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "54f74c18-0fcf-4ca6-a901-5c21ea988ea4",
    "property_id": "686fbe51-3036-493a-a40f-725e4186006f",
    "property_name": "연남 시티뷰 아파트",
    "room_type_id": "5aaa26cc-3d31-4a81-8138-b2393f7f5cf8",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "7b404ce8-6f53-4775-acce-5d9caddcfa65",
    "property_id": "686fbe51-3036-493a-a40f-725e4186006f",
    "property_name": "연남 시티뷰 아파트",
    "room_type_id": "3269d2fd-335c-4e64-a378-e0f53c2f874e",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "16af469e-3a47-44f6-a80d-4bb2968739c3",
    "property_id": "7f786cb1-838c-4239-a806-42d18e286155",
    "property_name": "성수 스위트 호텔",
    "room_type_id": "87a9065c-375f-4712-8101-91bb1e08d1c9",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "9bd70604-6f18-4e26-bc6f-9efafe24b5bb",
    "property_id": "7f786cb1-838c-4239-a806-42d18e286155",
    "property_name": "성수 스위트 호텔",
    "room_type_id": "e6709479-7e9d-4802-a3cf-951f2c18806a",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "b61e845d-538f-4cd4-9ffb-d1306bfceabe",
    "property_id": "b3b17692-6482-4617-9fbe-d401b0c9e853",
    "property_name": "익선동 북카페 게스트하우스",
    "room_type_id": "47a23fef-1d07-4f05-a730-dbdf2cf078ec",
    "room_type_name": "스탠다드",
    "total_rooms": 12,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "5acbf3a8-cb97-44ba-8580-3c6f52ed8b3f",
    "property_id": "b3b17692-6482-4617-9fbe-d401b0c9e853",
    "property_name": "익선동 북카페 게스트하우스",
    "room_type_id": "ed0af307-a1fa-42f4-bd42-f31b6977bba4",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "27e7a486-08cc-444a-8c0c-57161f9f0398",
    "property_id": "593a9e16-dbca-42f3-80f7-4be2221b8d3a",
    "property_name": "서촌 독채 펜션",
    "room_type_id": "edf3ae04-77db-467c-9ffe-8c1fed0b7b8e",
    "room_type_name": "스탠다드",
    "total_rooms": 12,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "5d915e56-4ba6-4f2c-8f8b-b0f7d8030c52",
    "property_id": "593a9e16-dbca-42f3-80f7-4be2221b8d3a",
    "property_name": "서촌 독채 펜션",
    "room_type_id": "4380bd96-b5b8-4931-aea8-a269e2986e87",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "e481b2f9-03da-4552-b030-27030cf6ec5f",
    "property_id": "ca3480bf-6993-4501-ae00-5031eeec3e2c",
    "property_name": "한남 정원 단독주택",
    "room_type_id": "f328f1b9-f11f-446b-9baa-4daa28d95c8a",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "cb3de962-e806-4655-b8d2-95ef05aa4392",
    "property_id": "ca3480bf-6993-4501-ae00-5031eeec3e2c",
    "property_name": "한남 정원 단독주택",
    "room_type_id": "4249235c-9498-4b5b-ac7c-c225935f4a4b",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "84714d8d-706f-475b-894a-c9da643bacfa",
    "property_id": "fbc52bc2-7c7b-4615-98ef-08634a1281c0",
    "property_name": "망원 복층 아파트",
    "room_type_id": "ee042265-390d-4b7b-8000-76bf7eb18020",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "4ee586bf-0d76-47ca-8532-2a6fa6ad4d87",
    "property_id": "fbc52bc2-7c7b-4615-98ef-08634a1281c0",
    "property_name": "망원 복층 아파트",
    "room_type_id": "e890bf8b-405b-4baa-b146-e26217331f21",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "751ce4d1-80a8-4863-b74f-30f0ce034c3b",
    "property_id": "c6f3216a-91e4-4dc3-881a-8c3b80377d73",
    "property_name": "연남 오션뷰 호텔",
    "room_type_id": "2bd6e0eb-cba1-49e1-834c-59ee60c76daa",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "5cf54f8d-48e6-4462-8a1a-9d97b42786e7",
    "property_id": "c6f3216a-91e4-4dc3-881a-8c3b80377d73",
    "property_name": "연남 오션뷰 호텔",
    "room_type_id": "42f7247d-6ba3-430a-a63e-c2f05705d3c0",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "7bd7cbcb-11b6-4539-a071-c3836831d525",
    "property_id": "b589ae3c-0770-457e-9335-27c1f7550c2b",
    "property_name": "성수 라운지 게스트하우스",
    "room_type_id": "93cd213e-3b2c-4bc6-89b3-6fe89464e6ab",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "538cb454-185c-455d-8adf-94558f45b362",
    "property_id": "b589ae3c-0770-457e-9335-27c1f7550c2b",
    "property_name": "성수 라운지 게스트하우스",
    "room_type_id": "661d002e-8543-49f6-ad34-3a916f5456d3",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "e26f6724-297c-461d-882b-de9e2e8c4030",
    "property_id": "8e11c61d-942f-4aff-8dec-a4bf722677ef",
    "property_name": "익선동 바비큐 펜션",
    "room_type_id": "e9665036-1481-4fb2-a0bd-49a9491ee7fa",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "3d11478e-be00-4bc0-bc9e-53db5158aecb",
    "property_id": "8e11c61d-942f-4aff-8dec-a4bf722677ef",
    "property_name": "익선동 바비큐 펜션",
    "room_type_id": "7ab0dcb8-4967-41a6-8004-ce43ec6be455",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "16d0755e-be11-45ea-9f76-b2a87f59edbc",
    "property_id": "88150e87-e104-4fb2-a873-2635550d0685",
    "property_name": "서촌 한옥 단독주택",
    "room_type_id": "d207f5f8-1518-437e-b368-346d1a13e289",
    "room_type_name": "스탠다드",
    "total_rooms": 12,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "300eac38-b9b3-4b26-bc82-88aa1fb16eba",
    "property_id": "88150e87-e104-4fb2-a873-2635550d0685",
    "property_name": "서촌 한옥 단독주택",
    "room_type_id": "353bd5d0-cbc8-49cf-9626-e8d70f683c2c",
    "room_type_name": "디럭스",
    "total_rooms": 8,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "dd9f1149-d2e0-40d8-ab22-e0e81ec6d7c2",
    "property_id": "fb0e8688-8f06-4ac5-8d17-f6b2bbedd3b3",
    "property_name": "한남 루프탑 아파트",
    "room_type_id": "002a67ad-0f8f-4021-a590-70334bc0d1b4",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "59622e78-81da-47e2-be9f-4146efaca8b2",
    "property_id": "fb0e8688-8f06-4ac5-8d17-f6b2bbedd3b3",
    "property_name": "한남 루프탑 아파트",
    "room_type_id": "9d02ab10-eaca-4ba9-9528-e0b5e84a2883",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "167ebf33-3fb3-4321-88c0-6150fdb0f8ff",
    "property_id": "2e9516e5-5e8f-415b-bc1e-1f17fa8d9ea0",
    "property_name": "망원 시티 호텔",
    "room_type_id": "5af10628-b8dc-44bd-b0b3-0dd50d980b5e",
    "room_type_name": "스탠다드",
    "total_rooms": 12,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "d0591690-081c-49bc-8094-9cdd5d57092d",
    "property_id": "2e9516e5-5e8f-415b-bc1e-1f17fa8d9ea0",
    "property_name": "망원 시티 호텔",
    "room_type_id": "199532e5-c0c6-4f26-a430-5952608373b1",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "b6f73516-7837-4f55-9b3f-0bed4e118113",
    "property_id": "b4691699-a253-4eb3-a272-79bbca0d2b7d",
    "property_name": "해운대 시티뷰 아파트",
    "room_type_id": "6157063e-caa3-43ba-ac58-3ecb9a3f8388",
    "room_type_name": "스탠다드",
    "total_rooms": 12,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "1b8bf7c7-3be0-43e0-a7d0-a63441c078ee",
    "property_id": "b4691699-a253-4eb3-a272-79bbca0d2b7d",
    "property_name": "해운대 시티뷰 아파트",
    "room_type_id": "a9b354b5-961f-4438-ae8b-4f04f5c31df3",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "a89f4413-e55a-4c97-85ad-349c65df57a3",
    "property_id": "cf38a761-41fa-488e-9f49-8baa13f242ff",
    "property_name": "광안리 스위트 호텔",
    "room_type_id": "666a9423-9394-4d70-9a34-026d2741f38a",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "86e006fc-be66-44e3-8263-dc489ad2f7e3",
    "property_id": "cf38a761-41fa-488e-9f49-8baa13f242ff",
    "property_name": "광안리 스위트 호텔",
    "room_type_id": "c5870b7e-79d9-48ce-854b-274e986ead18",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "bc18dfd9-30e2-40e5-9a3a-7a4823fbfb22",
    "property_id": "3f1edc2c-6af9-4c7b-aa36-3cb70d24dab1",
    "property_name": "송정 북카페 게스트하우스",
    "room_type_id": "20745d83-d591-4d5a-87de-abe7b9833e26",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "d9ebf1fc-6164-4ec5-bd16-f8657fb972de",
    "property_id": "3f1edc2c-6af9-4c7b-aa36-3cb70d24dab1",
    "property_name": "송정 북카페 게스트하우스",
    "room_type_id": "c6280e4b-7e9d-4f5a-a88a-c671a0026382",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "951c5626-1d06-43d4-be16-5ebfe595ffb3",
    "property_id": "eca93670-35f9-4e1a-b046-6b756ac57377",
    "property_name": "영도 독채 펜션",
    "room_type_id": "83e79f60-268f-4fe4-a095-4dcf1f0f15fe",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "2f342486-55a6-41ad-a7ae-a3b95ea8f137",
    "property_id": "eca93670-35f9-4e1a-b046-6b756ac57377",
    "property_name": "영도 독채 펜션",
    "room_type_id": "a2553994-c660-4f6c-8d30-85c05ced4955",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "6a76fd19-cfa7-477c-949c-626654162849",
    "property_id": "ef6a10c2-6504-486f-9763-316a7d41cc03",
    "property_name": "해운대 정원 단독주택",
    "room_type_id": "50a56dc6-3508-4a88-8db8-6890b5d95e66",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "c023a8a1-e212-4006-a53c-76412196747f",
    "property_id": "ef6a10c2-6504-486f-9763-316a7d41cc03",
    "property_name": "해운대 정원 단독주택",
    "room_type_id": "f7f6a27e-1827-486a-b490-1ca7dd92be3f",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "9a73d4a4-6705-45a1-8a34-ee249d242d44",
    "property_id": "ed5c802f-7605-4ab0-9633-ac27bdb18403",
    "property_name": "광안리 복층 아파트",
    "room_type_id": "38b4adc4-9fc7-4779-8f1b-fb4b792a0e3d",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "764705e9-f7c3-46a3-b313-b89164461d12",
    "property_id": "ed5c802f-7605-4ab0-9633-ac27bdb18403",
    "property_name": "광안리 복층 아파트",
    "room_type_id": "3eed79a2-08e2-4c7b-8aaa-fdbf6f6c1eed",
    "room_type_name": "디럭스",
    "total_rooms": 8,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "78031af3-2c0b-4dcb-8fdb-a632a5613511",
    "property_id": "8b73210f-36b9-40e1-b999-ac51d8d22d6e",
    "property_name": "송정 오션뷰 호텔",
    "room_type_id": "adac59e3-1321-417c-bc5a-56d88e13ff0d",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "ac90f6bb-8195-480a-93fd-f72f4a6f3d76",
    "property_id": "8b73210f-36b9-40e1-b999-ac51d8d22d6e",
    "property_name": "송정 오션뷰 호텔",
    "room_type_id": "6f31afaa-41b3-4a60-8157-b330fa33e1cc",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "b1117eb4-f6aa-4bb3-bdd3-4cac433a3adb",
    "property_id": "8b0b7c7c-cb31-4d87-9b35-0ca3d02fdab2",
    "property_name": "영도 라운지 게스트하우스",
    "room_type_id": "85bfdd3b-aa2e-417a-b0ef-b5d8b0976d32",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "fef0a696-8bd8-4e58-9b14-601439025ba7",
    "property_id": "8b0b7c7c-cb31-4d87-9b35-0ca3d02fdab2",
    "property_name": "영도 라운지 게스트하우스",
    "room_type_id": "0ad5684f-80dc-4a9b-8883-4a0854bec7cb",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "82f519aa-ccee-4e70-b3ec-e83d14a9b5b5",
    "property_id": "78256ecd-990a-4976-9349-44dc6e9937ae",
    "property_name": "애월 시티뷰 아파트",
    "room_type_id": "725b0c11-0b05-41b1-8e6b-e778c151a8ec",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "037c9d63-f616-4e9c-9fe6-098670b29f4d",
    "property_id": "78256ecd-990a-4976-9349-44dc6e9937ae",
    "property_name": "애월 시티뷰 아파트",
    "room_type_id": "64cf3818-ac5e-4604-85b6-2320e9e59937",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "b29c7398-3d37-4912-96d9-6bdec3ff084d",
    "property_id": "60b2e134-67e1-4bc7-a81b-c3a883a9623d",
    "property_name": "성산 스위트 호텔",
    "room_type_id": "ee0e9271-872b-4c3e-902c-08188cd33584",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "b32fa8c5-5d2d-4160-a9fc-bf6e44826dab",
    "property_id": "60b2e134-67e1-4bc7-a81b-c3a883a9623d",
    "property_name": "성산 스위트 호텔",
    "room_type_id": "5187eb2b-133e-4e91-93d9-3ad828d4f893",
    "room_type_name": "디럭스",
    "total_rooms": 8,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "4182aa56-4d1a-4d24-b320-5ceee418bba2",
    "property_id": "51908106-212d-473a-9606-9b708dc11ca5",
    "property_name": "한림 북카페 게스트하우스",
    "room_type_id": "6a83e43c-b1ea-4ec5-b09f-9a9634f2f14b",
    "room_type_name": "스탠다드",
    "total_rooms": 12,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "742ed965-001e-421c-8d80-43088a225f2b",
    "property_id": "51908106-212d-473a-9606-9b708dc11ca5",
    "property_name": "한림 북카페 게스트하우스",
    "room_type_id": "f9d395a0-6dd9-4d63-8d28-e8a68e38202c",
    "room_type_name": "디럭스",
    "total_rooms": 8,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "b2279a2d-a614-416d-86ae-fd5717013810",
    "property_id": "09a4ec5e-2750-4cd2-9bb2-16b8f0c99210",
    "property_name": "표선 독채 펜션",
    "room_type_id": "20e319a4-fca2-4d0c-9d64-b680fa6cd68c",
    "room_type_name": "스탠다드",
    "total_rooms": 12,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "3724ac6d-3430-474e-a1b0-a5e2bd7c9110",
    "property_id": "09a4ec5e-2750-4cd2-9bb2-16b8f0c99210",
    "property_name": "표선 독채 펜션",
    "room_type_id": "36a53949-7c74-447e-8703-a53ba5475825",
    "room_type_name": "디럭스",
    "total_rooms": 8,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "f8a6cb06-15e7-41d0-99b9-286b900aeae2",
    "property_id": "36ca06d2-5006-4bfa-93b4-e4c064542d0a",
    "property_name": "구좌 정원 단독주택",
    "room_type_id": "769ba52c-389e-4f17-93a1-072da8b37671",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "1a55a85d-e357-4299-b044-17e6d7fa58f6",
    "property_id": "36ca06d2-5006-4bfa-93b4-e4c064542d0a",
    "property_name": "구좌 정원 단독주택",
    "room_type_id": "22cef8ad-26c5-4931-a523-52131ba9ee27",
    "room_type_name": "디럭스",
    "total_rooms": 8,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "d2b8cf87-aa82-4bee-b720-6d7762694522",
    "property_id": "3688a239-db15-49cf-997a-6182df9774bc",
    "property_name": "애월 복층 아파트",
    "room_type_id": "b7f399bd-95d7-44b9-bbe0-6b36cd0d8e84",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "c207aef9-f027-4f7c-aeb9-e191248a4e21",
    "property_id": "3688a239-db15-49cf-997a-6182df9774bc",
    "property_name": "애월 복층 아파트",
    "room_type_id": "4bca1572-7965-40dd-9d29-e8babab87417",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "9e6fc48a-4602-445e-a22f-eaa138e94136",
    "property_id": "e3df1b23-f249-4025-bfe0-cf0905ade2ca",
    "property_name": "성산 오션뷰 호텔",
    "room_type_id": "865a218a-ece8-4277-8881-fb6f4c2329a3",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "ccf802e3-01fd-4065-8af1-c82646a81824",
    "property_id": "e3df1b23-f249-4025-bfe0-cf0905ade2ca",
    "property_name": "성산 오션뷰 호텔",
    "room_type_id": "1ea85a29-8391-4573-bb4f-48e94d7b1a6c",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  }
]

export const GEN_ADMIN_ROOM_TYPES = [
  {
    "id": "f1084b17-9a75-41f8-8516-9e64067fc944",
    "name": "디럭스",
    "property_id": "483a2abe-8bf0-4b5d-b4cd-40aad66fe2b9",
    "property_name": "경포 시티뷰 아파트",
    "total_rooms": 8
  },
  {
    "id": "2a6a8a4d-0c1f-430b-8549-f14de6884469",
    "name": "스탠다드",
    "property_id": "483a2abe-8bf0-4b5d-b4cd-40aad66fe2b9",
    "property_name": "경포 시티뷰 아파트",
    "total_rooms": 6
  },
  {
    "id": "e6c31ae5-8647-4dc2-a780-ce0e7e5d448f",
    "name": "디럭스",
    "property_id": "81bf7139-9760-48fb-bb00-38d2e415a118",
    "property_name": "경포 정원 단독주택",
    "total_rooms": 6
  },
  {
    "id": "03cb59c8-f04e-432b-9c65-8bc46bf5a49d",
    "name": "스탠다드",
    "property_id": "81bf7139-9760-48fb-bb00-38d2e415a118",
    "property_name": "경포 정원 단독주택",
    "total_rooms": 9
  },
  {
    "id": "3eed79a2-08e2-4c7b-8aaa-fdbf6f6c1eed",
    "name": "디럭스",
    "property_id": "ed5c802f-7605-4ab0-9633-ac27bdb18403",
    "property_name": "광안리 복층 아파트",
    "total_rooms": 8
  },
  {
    "id": "38b4adc4-9fc7-4779-8f1b-fb4b792a0e3d",
    "name": "스탠다드",
    "property_id": "ed5c802f-7605-4ab0-9633-ac27bdb18403",
    "property_name": "광안리 복층 아파트",
    "total_rooms": 9
  },
  {
    "id": "c5870b7e-79d9-48ce-854b-274e986ead18",
    "name": "디럭스",
    "property_id": "cf38a761-41fa-488e-9f49-8baa13f242ff",
    "property_name": "광안리 스위트 호텔",
    "total_rooms": 4
  },
  {
    "id": "666a9423-9394-4d70-9a34-026d2741f38a",
    "name": "스탠다드",
    "property_id": "cf38a761-41fa-488e-9f49-8baa13f242ff",
    "property_name": "광안리 스위트 호텔",
    "total_rooms": 6
  },
  {
    "id": "22cef8ad-26c5-4931-a523-52131ba9ee27",
    "name": "디럭스",
    "property_id": "36ca06d2-5006-4bfa-93b4-e4c064542d0a",
    "property_name": "구좌 정원 단독주택",
    "total_rooms": 8
  },
  {
    "id": "769ba52c-389e-4f17-93a1-072da8b37671",
    "name": "스탠다드",
    "property_id": "36ca06d2-5006-4bfa-93b4-e4c064542d0a",
    "property_name": "구좌 정원 단독주택",
    "total_rooms": 9
  },
  {
    "id": "1b1da6ab-5427-45dd-9540-f764b12e489a",
    "name": "디럭스",
    "property_id": "d4eaa82b-615f-4f90-bbfe-562bc9b786e1",
    "property_name": "구좌 한옥 단독주택",
    "total_rooms": 4
  },
  {
    "id": "bfeccc2c-22d2-4c62-9f80-80e9a8299a0b",
    "name": "스탠다드",
    "property_id": "d4eaa82b-615f-4f90-bbfe-562bc9b786e1",
    "property_name": "구좌 한옥 단독주택",
    "total_rooms": 9
  },
  {
    "id": "e890bf8b-405b-4baa-b146-e26217331f21",
    "name": "디럭스",
    "property_id": "fbc52bc2-7c7b-4615-98ef-08634a1281c0",
    "property_name": "망원 복층 아파트",
    "total_rooms": 4
  },
  {
    "id": "ee042265-390d-4b7b-8000-76bf7eb18020",
    "name": "스탠다드",
    "property_id": "fbc52bc2-7c7b-4615-98ef-08634a1281c0",
    "property_name": "망원 복층 아파트",
    "total_rooms": 6
  },
  {
    "id": "199532e5-c0c6-4f26-a430-5952608373b1",
    "name": "디럭스",
    "property_id": "2e9516e5-5e8f-415b-bc1e-1f17fa8d9ea0",
    "property_name": "망원 시티 호텔",
    "total_rooms": 6
  },
  {
    "id": "5af10628-b8dc-44bd-b0b3-0dd50d980b5e",
    "name": "스탠다드",
    "property_id": "2e9516e5-5e8f-415b-bc1e-1f17fa8d9ea0",
    "property_name": "망원 시티 호텔",
    "total_rooms": 12
  },
  {
    "id": "c0cdcc6d-9f35-4920-8363-b0637e3cf254",
    "name": "디럭스",
    "property_id": "674d716b-affa-4aea-be04-cf17a3be980a",
    "property_name": "보문 스위트 호텔",
    "total_rooms": 8
  },
  {
    "id": "e2890856-b22f-4fcb-aa1e-6e58cec4b57e",
    "name": "스탠다드",
    "property_id": "674d716b-affa-4aea-be04-cf17a3be980a",
    "property_name": "보문 스위트 호텔",
    "total_rooms": 9
  },
  {
    "id": "b6a9d06d-f35f-4815-a962-85075694e82d",
    "name": "디럭스",
    "property_id": "97f78c9e-24a3-4881-8c51-b4717f3849cc",
    "property_name": "보문 정원 단독주택",
    "total_rooms": 6
  },
  {
    "id": "5f8dcef9-d288-4e81-a836-688b998ea09d",
    "name": "스탠다드",
    "property_id": "97f78c9e-24a3-4881-8c51-b4717f3849cc",
    "property_name": "보문 정원 단독주택",
    "total_rooms": 12
  },
  {
    "id": "aca0fb5f-7c28-40ed-83b4-9273141c7865",
    "name": "디럭스",
    "property_id": "bd8262af-70bf-41b0-97ba-89873ef10dc6",
    "property_name": "불국사 북카페 게스트하우스",
    "total_rooms": 6
  },
  {
    "id": "3b5d0eaa-43fa-4959-bb7e-8042c821b400",
    "name": "스탠다드",
    "property_id": "bd8262af-70bf-41b0-97ba-89873ef10dc6",
    "property_name": "불국사 북카페 게스트하우스",
    "total_rooms": 9
  },
  {
    "id": "2cf4a219-035c-43ee-a43d-48bc2588026c",
    "name": "디럭스",
    "property_id": "7a0e88fc-4448-4fbc-95ff-50f367475fcc",
    "property_name": "사천 독채 펜션",
    "total_rooms": 4
  },
  {
    "id": "c70b6fd8-fb6a-4e08-856e-607c152ca81f",
    "name": "스탠다드",
    "property_id": "7a0e88fc-4448-4fbc-95ff-50f367475fcc",
    "property_name": "사천 독채 펜션",
    "total_rooms": 9
  },
  {
    "id": "4380bd96-b5b8-4931-aea8-a269e2986e87",
    "name": "디럭스",
    "property_id": "593a9e16-dbca-42f3-80f7-4be2221b8d3a",
    "property_name": "서촌 독채 펜션",
    "total_rooms": 6
  },
  {
    "id": "edf3ae04-77db-467c-9ffe-8c1fed0b7b8e",
    "name": "스탠다드",
    "property_id": "593a9e16-dbca-42f3-80f7-4be2221b8d3a",
    "property_name": "서촌 독채 펜션",
    "total_rooms": 12
  },
  {
    "id": "353bd5d0-cbc8-49cf-9626-e8d70f683c2c",
    "name": "디럭스",
    "property_id": "88150e87-e104-4fb2-a873-2635550d0685",
    "property_name": "서촌 한옥 단독주택",
    "total_rooms": 8
  },
  {
    "id": "d207f5f8-1518-437e-b368-346d1a13e289",
    "name": "스탠다드",
    "property_id": "88150e87-e104-4fb2-a873-2635550d0685",
    "property_name": "서촌 한옥 단독주택",
    "total_rooms": 12
  },
  {
    "id": "5187eb2b-133e-4e91-93d9-3ad828d4f893",
    "name": "디럭스",
    "property_id": "60b2e134-67e1-4bc7-a81b-c3a883a9623d",
    "property_name": "성산 스위트 호텔",
    "total_rooms": 8
  },
  {
    "id": "ee0e9271-872b-4c3e-902c-08188cd33584",
    "name": "스탠다드",
    "property_id": "60b2e134-67e1-4bc7-a81b-c3a883a9623d",
    "property_name": "성산 스위트 호텔",
    "total_rooms": 9
  },
  {
    "id": "1ea85a29-8391-4573-bb4f-48e94d7b1a6c",
    "name": "디럭스",
    "property_id": "e3df1b23-f249-4025-bfe0-cf0905ade2ca",
    "property_name": "성산 오션뷰 호텔",
    "total_rooms": 4
  },
  {
    "id": "865a218a-ece8-4277-8881-fb6f4c2329a3",
    "name": "스탠다드",
    "property_id": "e3df1b23-f249-4025-bfe0-cf0905ade2ca",
    "property_name": "성산 오션뷰 호텔",
    "total_rooms": 9
  },
  {
    "id": "661d002e-8543-49f6-ad34-3a916f5456d3",
    "name": "디럭스",
    "property_id": "b589ae3c-0770-457e-9335-27c1f7550c2b",
    "property_name": "성수 라운지 게스트하우스",
    "total_rooms": 4
  },
  {
    "id": "93cd213e-3b2c-4bc6-89b3-6fe89464e6ab",
    "name": "스탠다드",
    "property_id": "b589ae3c-0770-457e-9335-27c1f7550c2b",
    "property_name": "성수 라운지 게스트하우스",
    "total_rooms": 6
  },
  {
    "id": "e6709479-7e9d-4802-a3cf-951f2c18806a",
    "name": "디럭스",
    "property_id": "7f786cb1-838c-4239-a806-42d18e286155",
    "property_name": "성수 스위트 호텔",
    "total_rooms": 6
  },
  {
    "id": "87a9065c-375f-4712-8101-91bb1e08d1c9",
    "name": "스탠다드",
    "property_id": "7f786cb1-838c-4239-a806-42d18e286155",
    "property_name": "성수 스위트 호텔",
    "total_rooms": 9
  },
  {
    "id": "c6280e4b-7e9d-4f5a-a88a-c671a0026382",
    "name": "디럭스",
    "property_id": "3f1edc2c-6af9-4c7b-aa36-3cb70d24dab1",
    "property_name": "송정 북카페 게스트하우스",
    "total_rooms": 4
  },
  {
    "id": "20745d83-d591-4d5a-87de-abe7b9833e26",
    "name": "스탠다드",
    "property_id": "3f1edc2c-6af9-4c7b-aa36-3cb70d24dab1",
    "property_name": "송정 북카페 게스트하우스",
    "total_rooms": 9
  },
  {
    "id": "6f31afaa-41b3-4a60-8157-b330fa33e1cc",
    "name": "디럭스",
    "property_id": "8b73210f-36b9-40e1-b999-ac51d8d22d6e",
    "property_name": "송정 오션뷰 호텔",
    "total_rooms": 4
  },
  {
    "id": "adac59e3-1321-417c-bc5a-56d88e13ff0d",
    "name": "스탠다드",
    "property_id": "8b73210f-36b9-40e1-b999-ac51d8d22d6e",
    "property_name": "송정 오션뷰 호텔",
    "total_rooms": 6
  },
  {
    "id": "888aca55-6078-4c00-ae2c-59a52e9fa299",
    "name": "디럭스",
    "property_id": "3cb2ee73-79e3-4627-9b9d-e948505cd9f6",
    "property_name": "안목 복층 아파트",
    "total_rooms": 8
  },
  {
    "id": "f02f0ffd-576f-4486-853e-d5090725b0a8",
    "name": "스탠다드",
    "property_id": "3cb2ee73-79e3-4627-9b9d-e948505cd9f6",
    "property_name": "안목 복층 아파트",
    "total_rooms": 12
  },
  {
    "id": "6ff5a00a-d72b-4528-b78e-b7bb7c5b838b",
    "name": "디럭스",
    "property_id": "cf5eb973-ff34-497d-8f58-c2a9fbc26301",
    "property_name": "안목 스위트 호텔",
    "total_rooms": 4
  },
  {
    "id": "0ea684bb-182e-439e-958e-d750016a441f",
    "name": "스탠다드",
    "property_id": "cf5eb973-ff34-497d-8f58-c2a9fbc26301",
    "property_name": "안목 스위트 호텔",
    "total_rooms": 9
  },
  {
    "id": "4bca1572-7965-40dd-9d29-e8babab87417",
    "name": "디럭스",
    "property_id": "3688a239-db15-49cf-997a-6182df9774bc",
    "property_name": "애월 복층 아파트",
    "total_rooms": 4
  },
  {
    "id": "b7f399bd-95d7-44b9-bbe0-6b36cd0d8e84",
    "name": "스탠다드",
    "property_id": "3688a239-db15-49cf-997a-6182df9774bc",
    "property_name": "애월 복층 아파트",
    "total_rooms": 9
  },
  {
    "id": "64cf3818-ac5e-4604-85b6-2320e9e59937",
    "name": "디럭스",
    "property_id": "78256ecd-990a-4976-9349-44dc6e9937ae",
    "property_name": "애월 시티뷰 아파트",
    "total_rooms": 6
  },
  {
    "id": "725b0c11-0b05-41b1-8e6b-e778c151a8ec",
    "name": "스탠다드",
    "property_id": "78256ecd-990a-4976-9349-44dc6e9937ae",
    "property_name": "애월 시티뷰 아파트",
    "total_rooms": 6
  },
  {
    "id": "3269d2fd-335c-4e64-a378-e0f53c2f874e",
    "name": "디럭스",
    "property_id": "686fbe51-3036-493a-a40f-725e4186006f",
    "property_name": "연남 시티뷰 아파트",
    "total_rooms": 6
  },
  {
    "id": "5aaa26cc-3d31-4a81-8138-b2393f7f5cf8",
    "name": "스탠다드",
    "property_id": "686fbe51-3036-493a-a40f-725e4186006f",
    "property_name": "연남 시티뷰 아파트",
    "total_rooms": 9
  },
  {
    "id": "42f7247d-6ba3-430a-a63e-c2f05705d3c0",
    "name": "디럭스",
    "property_id": "c6f3216a-91e4-4dc3-881a-8c3b80377d73",
    "property_name": "연남 오션뷰 호텔",
    "total_rooms": 6
  },
  {
    "id": "2bd6e0eb-cba1-49e1-834c-59ee60c76daa",
    "name": "스탠다드",
    "property_id": "c6f3216a-91e4-4dc3-881a-8c3b80377d73",
    "property_name": "연남 오션뷰 호텔",
    "total_rooms": 6
  },
  {
    "id": "a2553994-c660-4f6c-8d30-85c05ced4955",
    "name": "디럭스",
    "property_id": "eca93670-35f9-4e1a-b046-6b756ac57377",
    "property_name": "영도 독채 펜션",
    "total_rooms": 6
  },
  {
    "id": "83e79f60-268f-4fe4-a095-4dcf1f0f15fe",
    "name": "스탠다드",
    "property_id": "eca93670-35f9-4e1a-b046-6b756ac57377",
    "property_name": "영도 독채 펜션",
    "total_rooms": 6
  },
  {
    "id": "0ad5684f-80dc-4a9b-8883-4a0854bec7cb",
    "name": "디럭스",
    "property_id": "8b0b7c7c-cb31-4d87-9b35-0ca3d02fdab2",
    "property_name": "영도 라운지 게스트하우스",
    "total_rooms": 6
  },
  {
    "id": "85bfdd3b-aa2e-417a-b0ef-b5d8b0976d32",
    "name": "스탠다드",
    "property_id": "8b0b7c7c-cb31-4d87-9b35-0ca3d02fdab2",
    "property_name": "영도 라운지 게스트하우스",
    "total_rooms": 6
  },
  {
    "id": "7ab0dcb8-4967-41a6-8004-ce43ec6be455",
    "name": "디럭스",
    "property_id": "8e11c61d-942f-4aff-8dec-a4bf722677ef",
    "property_name": "익선동 바비큐 펜션",
    "total_rooms": 4
  },
  {
    "id": "e9665036-1481-4fb2-a0bd-49a9491ee7fa",
    "name": "스탠다드",
    "property_id": "8e11c61d-942f-4aff-8dec-a4bf722677ef",
    "property_name": "익선동 바비큐 펜션",
    "total_rooms": 9
  },
  {
    "id": "ed0af307-a1fa-42f4-bd42-f31b6977bba4",
    "name": "디럭스",
    "property_id": "b3b17692-6482-4617-9fbe-d401b0c9e853",
    "property_name": "익선동 북카페 게스트하우스",
    "total_rooms": 4
  },
  {
    "id": "47a23fef-1d07-4f05-a730-dbdf2cf078ec",
    "name": "스탠다드",
    "property_id": "b3b17692-6482-4617-9fbe-d401b0c9e853",
    "property_name": "익선동 북카페 게스트하우스",
    "total_rooms": 12
  },
  {
    "id": "dfeb5d4c-91ce-4eb3-9e2f-9ba1ccfc9c54",
    "name": "디럭스",
    "property_id": "125c41b8-fa68-4be1-b252-55d17fd8ce59",
    "property_name": "주문진 북카페 게스트하우스",
    "total_rooms": 4
  },
  {
    "id": "0175585e-e25e-4760-9f4e-94d5c5f75a27",
    "name": "스탠다드",
    "property_id": "125c41b8-fa68-4be1-b252-55d17fd8ce59",
    "property_name": "주문진 북카페 게스트하우스",
    "total_rooms": 12
  },
  {
    "id": "36a53949-7c74-447e-8703-a53ba5475825",
    "name": "디럭스",
    "property_id": "09a4ec5e-2750-4cd2-9bb2-16b8f0c99210",
    "property_name": "표선 독채 펜션",
    "total_rooms": 8
  },
  {
    "id": "20e319a4-fca2-4d0c-9d64-b680fa6cd68c",
    "name": "스탠다드",
    "property_id": "09a4ec5e-2750-4cd2-9bb2-16b8f0c99210",
    "property_name": "표선 독채 펜션",
    "total_rooms": 12
  },
  {
    "id": "a223bdb1-b1a9-4eca-8b43-f7ceaafc7bad",
    "name": "디럭스",
    "property_id": "18444bff-518e-4b19-98a0-4f7b6b2771da",
    "property_name": "표선 바비큐 펜션",
    "total_rooms": 4
  },
  {
    "id": "1ed40f9c-e537-4184-a929-e63e957aa861",
    "name": "스탠다드",
    "property_id": "18444bff-518e-4b19-98a0-4f7b6b2771da",
    "property_name": "표선 바비큐 펜션",
    "total_rooms": 6
  },
  {
    "id": "9d02ab10-eaca-4ba9-9528-e0b5e84a2883",
    "name": "디럭스",
    "property_id": "fb0e8688-8f06-4ac5-8d17-f6b2bbedd3b3",
    "property_name": "한남 루프탑 아파트",
    "total_rooms": 6
  },
  {
    "id": "002a67ad-0f8f-4021-a590-70334bc0d1b4",
    "name": "스탠다드",
    "property_id": "fb0e8688-8f06-4ac5-8d17-f6b2bbedd3b3",
    "property_name": "한남 루프탑 아파트",
    "total_rooms": 6
  },
  {
    "id": "4249235c-9498-4b5b-ac7c-c225935f4a4b",
    "name": "디럭스",
    "property_id": "ca3480bf-6993-4501-ae00-5031eeec3e2c",
    "property_name": "한남 정원 단독주택",
    "total_rooms": 6
  },
  {
    "id": "f328f1b9-f11f-446b-9baa-4daa28d95c8a",
    "name": "스탠다드",
    "property_id": "ca3480bf-6993-4501-ae00-5031eeec3e2c",
    "property_name": "한남 정원 단독주택",
    "total_rooms": 9
  },
  {
    "id": "e5ecb581-9a29-4c67-afbc-04dd18d4a1f7",
    "name": "디럭스",
    "property_id": "1e3efa62-a0c3-4af0-88ce-7864a205df5c",
    "property_name": "한림 라운지 게스트하우스",
    "total_rooms": 4
  },
  {
    "id": "2867ad59-af7f-4e51-b772-5be020c956ee",
    "name": "스탠다드",
    "property_id": "1e3efa62-a0c3-4af0-88ce-7864a205df5c",
    "property_name": "한림 라운지 게스트하우스",
    "total_rooms": 6
  },
  {
    "id": "f9d395a0-6dd9-4d63-8d28-e8a68e38202c",
    "name": "디럭스",
    "property_id": "51908106-212d-473a-9606-9b708dc11ca5",
    "property_name": "한림 북카페 게스트하우스",
    "total_rooms": 8
  },
  {
    "id": "6a83e43c-b1ea-4ec5-b09f-9a9634f2f14b",
    "name": "스탠다드",
    "property_id": "51908106-212d-473a-9606-9b708dc11ca5",
    "property_name": "한림 북카페 게스트하우스",
    "total_rooms": 12
  },
  {
    "id": "a9b354b5-961f-4438-ae8b-4f04f5c31df3",
    "name": "디럭스",
    "property_id": "b4691699-a253-4eb3-a272-79bbca0d2b7d",
    "property_name": "해운대 시티뷰 아파트",
    "total_rooms": 6
  },
  {
    "id": "6157063e-caa3-43ba-ac58-3ecb9a3f8388",
    "name": "스탠다드",
    "property_id": "b4691699-a253-4eb3-a272-79bbca0d2b7d",
    "property_name": "해운대 시티뷰 아파트",
    "total_rooms": 12
  },
  {
    "id": "f7f6a27e-1827-486a-b490-1ca7dd92be3f",
    "name": "디럭스",
    "property_id": "ef6a10c2-6504-486f-9763-316a7d41cc03",
    "property_name": "해운대 정원 단독주택",
    "total_rooms": 4
  },
  {
    "id": "50a56dc6-3508-4a88-8db8-6890b5d95e66",
    "name": "스탠다드",
    "property_id": "ef6a10c2-6504-486f-9763-316a7d41cc03",
    "property_name": "해운대 정원 단독주택",
    "total_rooms": 6
  },
  {
    "id": "13d3fac0-867e-470f-b3b9-7ff4d8bdf930",
    "name": "디럭스",
    "property_id": "6d636db3-59b5-42e2-b9a3-afc248768e41",
    "property_name": "황리단길 독채 펜션",
    "total_rooms": 8
  },
  {
    "id": "a67122cb-c394-4f7e-b8d9-78e1fb799624",
    "name": "스탠다드",
    "property_id": "6d636db3-59b5-42e2-b9a3-afc248768e41",
    "property_name": "황리단길 독채 펜션",
    "total_rooms": 9
  },
  {
    "id": "9cd934d3-a758-43ae-a9a4-edb9d3151ff4",
    "name": "디럭스",
    "property_id": "a5422723-d00f-42ea-b022-93227e17d655",
    "property_name": "황리단길 시티뷰 아파트",
    "total_rooms": 8
  },
  {
    "id": "bb2c96cf-396f-44b7-b849-68a5240d03b9",
    "name": "스탠다드",
    "property_id": "a5422723-d00f-42ea-b022-93227e17d655",
    "property_name": "황리단길 시티뷰 아파트",
    "total_rooms": 9
  }
]

export const GEN_ADMIN_REFUNDS = [
  {
    "id": "d9fbba6c-20cf-47ed-84d4-f8a8840a651e",
    "booking_id": "544a6284-33a1-460f-9d43-8e79092d8d32",
    "booking_number": "BK2608260042",
    "user_name": "김민준",
    "property_name": "서촌 한옥 단독주택",
    "refund_amount": 90000,
    "reason": "일정이 변경되었습니다",
    "status": "COMPLETED",
    "requested_at": "2026-08-25T15:00:00",
    "processed_at": "2026-08-26T15:00:00"
  },
  {
    "id": "32630d55-834e-4272-b470-c4eb47e7bf31",
    "booking_id": "959e5d57-ec75-4e73-bc2b-715af6531585",
    "booking_number": "BK2608260007",
    "user_name": "이서연",
    "property_name": "표선 바비큐 펜션",
    "refund_amount": 72000,
    "reason": "다른 숙소를 예약했습니다",
    "status": "PENDING",
    "requested_at": "2026-08-24T15:00:00",
    "processed_at": null
  },
  {
    "id": "9331bafd-4055-4130-8179-e7ce1a3ba739",
    "booking_id": "886f6213-cccf-4d80-be77-d4322cf2187a",
    "booking_number": "BK2608200049",
    "user_name": "이서연",
    "property_name": "송정 오션뷰 호텔",
    "refund_amount": 72000,
    "reason": "다른 숙소를 예약했습니다",
    "status": "PENDING",
    "requested_at": "2026-08-20T15:00:00",
    "processed_at": null
  },
  {
    "id": "7aa2b8fe-48d1-4e7a-9caf-433d98550d1a",
    "booking_id": "46d7ccc5-bde0-4f53-ac71-1600c1546f4d",
    "booking_number": "BK2608260028",
    "user_name": "김민준",
    "property_name": "한남 루프탑 아파트",
    "refund_amount": 72000,
    "reason": "다른 숙소를 예약했습니다",
    "status": "PENDING",
    "requested_at": "2026-08-18T15:00:00",
    "processed_at": null
  },
  {
    "id": "854f11cb-823a-44ad-b243-f97c45735ec9",
    "booking_id": "0871227d-72c8-4421-8341-8030802c7536",
    "booking_number": "BK2608160056",
    "user_name": "김민준",
    "property_name": "안목 스위트 호텔",
    "refund_amount": 72000,
    "reason": "개인 사정",
    "status": "REJECTED",
    "requested_at": "2026-08-13T15:00:00",
    "processed_at": "2026-08-14T15:00:00"
  },
  {
    "id": "dfce270a-5f4f-40bf-8258-a75cf435ee4a",
    "booking_id": "7b83305c-ad7d-42dd-8804-f05cb416f023",
    "booking_number": "BK2608190000",
    "user_name": "김민준",
    "property_name": "광안리 스위트 호텔",
    "refund_amount": 90000,
    "reason": "일정이 변경되었습니다",
    "status": "COMPLETED",
    "requested_at": "2026-08-12T15:00:00",
    "processed_at": "2026-08-13T15:00:00"
  },
  {
    "id": "631f6bef-1f57-4194-8db4-84a27816fcd2",
    "booking_id": "1ff14c35-07f6-4b35-b8f2-b1f93e86862d",
    "booking_number": "BK2608170014",
    "user_name": "김민준",
    "property_name": "해운대 시티뷰 아파트",
    "refund_amount": 72000,
    "reason": "개인 사정",
    "status": "REJECTED",
    "requested_at": "2026-08-04T15:00:00",
    "processed_at": "2026-08-05T15:00:00"
  },
  {
    "id": "7f53df0e-0418-4ad9-b0ff-3cb05bc33682",
    "booking_id": "de23371e-0a53-44c6-b177-3d4f28cc1fe4",
    "booking_number": "BK2608120021",
    "user_name": "이서연",
    "property_name": "안목 스위트 호텔",
    "refund_amount": 90000,
    "reason": "일정이 변경되었습니다",
    "status": "COMPLETED",
    "requested_at": "2026-08-04T15:00:00",
    "processed_at": "2026-08-05T15:00:00"
  },
  {
    "id": "f6acb498-b7c4-4be7-abc6-95d4fc0571ad",
    "booking_id": "fb4640ff-e966-4856-ba30-1db40d9b9fbe",
    "booking_number": "BK2608110035",
    "user_name": "이서연",
    "property_name": "연남 시티뷰 아파트",
    "refund_amount": 72000,
    "reason": "개인 사정",
    "status": "REJECTED",
    "requested_at": "2026-07-30T15:00:00",
    "processed_at": "2026-07-31T15:00:00"
  }
]

export const GEN_ADMIN_PEAK_DATES = [
  {
    "id": "41bbe1a1-3781-4dbc-8d4d-1ca4b4d602b4",
    "date": "2026-07-25",
    "name": "여름 성수기",
    "extra_charge": 30000,
    "description": "여름 성수기 요금이 적용된다"
  },
  {
    "id": "1fad0a78-1242-4cc3-ba08-394cb1e823a3",
    "date": "2026-08-01",
    "name": "여름 성수기",
    "extra_charge": 30000,
    "description": "여름 성수기 요금이 적용된다"
  },
  {
    "id": "3df211dc-fa74-42a7-a2dc-e73bcf1b3dcd",
    "date": "2026-08-15",
    "name": "광복절 연휴",
    "extra_charge": 30000,
    "description": "광복절 연휴 요금이 적용된다"
  },
  {
    "id": "2e92323d-bb9c-41e8-b138-1a2e0cde8138",
    "date": "2026-10-03",
    "name": "개천절 연휴",
    "extra_charge": 30000,
    "description": "개천절 연휴 요금이 적용된다"
  },
  {
    "id": "c9924778-e347-433e-a759-b8bd95cc253f",
    "date": "2026-12-25",
    "name": "크리스마스",
    "extra_charge": 30000,
    "description": "크리스마스 요금이 적용된다"
  },
  {
    "id": "a7705413-ae66-4357-8be0-74f394894968",
    "date": "2026-12-31",
    "name": "연말",
    "extra_charge": 30000,
    "description": "연말 요금이 적용된다"
  }
]

export const GEN_ADMIN_COUPONS = [
  {
    "id": "24d52e37-cee8-4cc8-8ef3-24efa8ff8dcd",
    "code": "WELCOME10",
    "name": "첫 예약 10% 할인",
    "type_code": "PERCENT",
    "discount_value": 10,
    "min_booking_amount": 50000,
    "max_discount_amount": 30000,
    "valid_from": "2026-08-01T21:52:24.583042",
    "valid_to": "2026-10-30T21:52:24.583042",
    "max_issues": 1000,
    "issued_count": 0,
    "is_active": true
  },
  {
    "id": "a62d6f5f-c550-425f-a2fa-777b6c80a53e",
    "code": "AUTUMN20000",
    "name": "가을 여행 2만원",
    "type_code": "FIXED_AMOUNT",
    "discount_value": 20000,
    "min_booking_amount": 150000,
    "max_discount_amount": null,
    "valid_from": "2026-08-24T21:52:24.583042",
    "valid_to": "2026-10-15T21:52:24.583042",
    "max_issues": 500,
    "issued_count": 0,
    "is_active": true
  },
  {
    "id": "a6c6ae86-39e8-42ea-a52f-227dfb8a2ae8",
    "code": "LONGSTAY15",
    "name": "장기 숙박 15%",
    "type_code": "PERCENT",
    "discount_value": 15,
    "min_booking_amount": 300000,
    "max_discount_amount": 80000,
    "valid_from": "2026-06-02T21:52:24.583042",
    "valid_to": "2026-08-30T21:52:24.583042",
    "max_issues": 200,
    "issued_count": 0,
    "is_active": true
  }
]

export const GEN_ADMIN_REVIEWS = [
  {
    "id": "e3bdb31b-da2e-4806-ae4f-7996c982a39c",
    "user_id": "075b11e2-1207-42e9-ad88-846dc67d20e1",
    "user_name": "이서연",
    "property_id": "ed5c802f-7605-4ab0-9633-ac27bdb18403",
    "rating": 5,
    "content": "가격 대비 만족스러웠습니다. 수건이 조금 부족했어요.",
    "status_code": "REPORTED",
    "helpful_count": 0,
    "verified_stay": false,
    "created_at": "2026-09-02T11:00:00",
    "updated_at": "2026-08-31T21:52:25"
  },
  {
    "id": "9a33fa1d-49a4-4a41-aaaa-0839d37d3322",
    "user_id": "ed85ab4c-01ad-4a7f-92b7-c411b524b066",
    "user_name": "김민준",
    "property_id": "36ca06d2-5006-4bfa-93b4-e4c064542d0a",
    "rating": 5,
    "content": "위치가 조용해서 푹 쉬었습니다. 주차도 편했어요.",
    "status_code": "ACTIVE",
    "helpful_count": 6,
    "verified_stay": false,
    "created_at": "2026-09-02T11:00:00",
    "updated_at": "2026-08-31T21:52:25"
  },
  {
    "id": "20374603-6148-41f2-934b-e10d05983cf1",
    "user_id": "ed85ab4c-01ad-4a7f-92b7-c411b524b066",
    "user_name": "김민준",
    "property_id": "8b73210f-36b9-40e1-b999-ac51d8d22d6e",
    "rating": 4,
    "content": "청소 상태가 아주 좋았습니다. 체크인 안내도 친절했어요.",
    "status_code": "ACTIVE",
    "helpful_count": 2,
    "verified_stay": false,
    "created_at": "2026-09-02T11:00:00",
    "updated_at": "2026-08-31T21:52:25"
  },
  {
    "id": "29336ec9-49d5-44de-a4d1-dbc2f646c822",
    "user_id": "ed85ab4c-01ad-4a7f-92b7-c411b524b066",
    "user_name": "김민준",
    "property_id": "bd8262af-70bf-41b0-97ba-89873ef10dc6",
    "rating": 3,
    "content": "가격 대비 만족스러웠습니다. 수건이 조금 부족했어요.",
    "status_code": "REPORTED",
    "helpful_count": 7,
    "verified_stay": false,
    "created_at": "2026-09-02T11:00:00",
    "updated_at": "2026-08-31T21:52:25"
  },
  {
    "id": "e10e3225-2602-46f3-b704-02e6662cf07f",
    "user_id": "075b11e2-1207-42e9-ad88-846dc67d20e1",
    "user_name": "이서연",
    "property_id": "8e11c61d-942f-4aff-8dec-a4bf722677ef",
    "rating": 5,
    "content": "청소 상태가 아주 좋았습니다. 체크인 안내도 친절했어요.",
    "status_code": "ACTIVE",
    "helpful_count": 8,
    "verified_stay": false,
    "created_at": "2026-08-31T11:00:00",
    "updated_at": "2026-08-31T21:52:25"
  },
  {
    "id": "8807644d-9e9e-4854-935a-f5d68937ad8f",
    "user_id": "ed85ab4c-01ad-4a7f-92b7-c411b524b066",
    "user_name": "김민준",
    "property_id": "b4691699-a253-4eb3-a272-79bbca0d2b7d",
    "rating": 4,
    "content": "청소 상태가 아주 좋았습니다. 체크인 안내도 친절했어요.",
    "status_code": "ACTIVE",
    "helpful_count": 6,
    "verified_stay": false,
    "created_at": "2026-08-31T11:00:00",
    "updated_at": "2026-08-31T21:52:25"
  },
  {
    "id": "282b16ab-d8bf-4edd-8743-d4ac5a7fd38a",
    "user_id": "075b11e2-1207-42e9-ad88-846dc67d20e1",
    "user_name": "이서연",
    "property_id": "3688a239-db15-49cf-997a-6182df9774bc",
    "rating": 5,
    "content": "위치가 조용해서 푹 쉬었습니다. 주차도 편했어요.",
    "status_code": "ACTIVE",
    "helpful_count": 4,
    "verified_stay": false,
    "created_at": "2026-08-30T11:00:00",
    "updated_at": "2026-08-31T21:52:25"
  },
  {
    "id": "e2a59ec4-b2ca-4d80-990d-3c0501dc0671",
    "user_id": "ed85ab4c-01ad-4a7f-92b7-c411b524b066",
    "user_name": "김민준",
    "property_id": "a5422723-d00f-42ea-b022-93227e17d655",
    "rating": 4,
    "content": "위치가 조용해서 푹 쉬었습니다. 주차도 편했어요.",
    "status_code": "ACTIVE",
    "helpful_count": 10,
    "verified_stay": false,
    "created_at": "2026-08-30T11:00:00",
    "updated_at": "2026-08-31T21:52:25"
  },
  {
    "id": "6785ce3a-0962-4411-a42e-c1ef90abb6c6",
    "user_id": "075b11e2-1207-42e9-ad88-846dc67d20e1",
    "user_name": "이서연",
    "property_id": "60b2e134-67e1-4bc7-a81b-c3a883a9623d",
    "rating": 3,
    "content": "뷰가 정말 좋습니다. 재방문 의사 있습니다.",
    "status_code": "HIDDEN",
    "helpful_count": 4,
    "verified_stay": false,
    "created_at": "2026-08-29T11:00:00",
    "updated_at": "2026-08-31T21:52:25"
  },
  {
    "id": "75c95b54-2af2-4e35-89a8-ac33495139ef",
    "user_id": "075b11e2-1207-42e9-ad88-846dc67d20e1",
    "user_name": "이서연",
    "property_id": "125c41b8-fa68-4be1-b252-55d17fd8ce59",
    "rating": 4,
    "content": "위치가 조용해서 푹 쉬었습니다. 주차도 편했어요.",
    "status_code": "ACTIVE",
    "helpful_count": 12,
    "verified_stay": false,
    "created_at": "2026-08-28T11:00:00",
    "updated_at": "2026-08-31T21:52:25"
  },
  {
    "id": "b0b75f0a-ad3d-4e4b-83ce-79f0d3f6b956",
    "user_id": "075b11e2-1207-42e9-ad88-846dc67d20e1",
    "user_name": "이서연",
    "property_id": "6d636db3-59b5-42e2-b9a3-afc248768e41",
    "rating": 3,
    "content": "뷰가 정말 좋습니다. 재방문 의사 있습니다.",
    "status_code": "HIDDEN",
    "helpful_count": 8,
    "verified_stay": false,
    "created_at": "2026-08-28T11:00:00",
    "updated_at": "2026-08-31T21:52:25"
  },
  {
    "id": "e913ca14-4ecc-4819-b96e-316cc6efd3c1",
    "user_id": "ed85ab4c-01ad-4a7f-92b7-c411b524b066",
    "user_name": "김민준",
    "property_id": "fb0e8688-8f06-4ac5-8d17-f6b2bbedd3b3",
    "rating": 5,
    "content": "위치가 조용해서 푹 쉬었습니다. 주차도 편했어요.",
    "status_code": "ACTIVE",
    "helpful_count": 10,
    "verified_stay": false,
    "created_at": "2026-08-27T11:00:00",
    "updated_at": "2026-08-31T21:52:25"
  },
  {
    "id": "8f34d45f-0bd0-47bb-b939-253a4028870a",
    "user_id": "ed85ab4c-01ad-4a7f-92b7-c411b524b066",
    "user_name": "김민준",
    "property_id": "8b0b7c7c-cb31-4d87-9b35-0ca3d02fdab2",
    "rating": 5,
    "content": "뷰가 정말 좋습니다. 재방문 의사 있습니다.",
    "status_code": "HIDDEN",
    "helpful_count": 8,
    "verified_stay": false,
    "created_at": "2026-08-27T11:00:00",
    "updated_at": "2026-08-31T21:52:25"
  },
  {
    "id": "f9a0c6b2-ea21-4f21-a2a7-6331308553ef",
    "user_id": "075b11e2-1207-42e9-ad88-846dc67d20e1",
    "user_name": "이서연",
    "property_id": "686fbe51-3036-493a-a40f-725e4186006f",
    "rating": 4,
    "content": "뷰가 정말 좋습니다. 재방문 의사 있습니다.",
    "status_code": "ACTIVE",
    "helpful_count": 9,
    "verified_stay": false,
    "created_at": "2026-08-26T11:00:00",
    "updated_at": "2026-08-31T21:52:25"
  },
  {
    "id": "aafe7787-b422-4b81-bf1b-42c537aea612",
    "user_id": "075b11e2-1207-42e9-ad88-846dc67d20e1",
    "user_name": "이서연",
    "property_id": "674d716b-affa-4aea-be04-cf17a3be980a",
    "rating": 5,
    "content": "뷰가 정말 좋습니다. 재방문 의사 있습니다.",
    "status_code": "HIDDEN",
    "helpful_count": 0,
    "verified_stay": false,
    "created_at": "2026-08-25T11:00:00",
    "updated_at": "2026-08-31T21:52:25"
  },
  {
    "id": "02329b2f-8a99-479b-bbf8-cb18424811dd",
    "user_id": "ed85ab4c-01ad-4a7f-92b7-c411b524b066",
    "user_name": "김민준",
    "property_id": "483a2abe-8bf0-4b5d-b4cd-40aad66fe2b9",
    "rating": 5,
    "content": "가격 대비 만족스러웠습니다. 수건이 조금 부족했어요.",
    "status_code": "ACTIVE",
    "helpful_count": 1,
    "verified_stay": false,
    "created_at": "2026-08-25T11:00:00",
    "updated_at": "2026-08-31T21:52:25"
  },
  {
    "id": "36705b1b-f0c9-4eaf-adea-a168f940a88a",
    "user_id": "075b11e2-1207-42e9-ad88-846dc67d20e1",
    "user_name": "이서연",
    "property_id": "3cb2ee73-79e3-4627-9b9d-e948505cd9f6",
    "rating": 4,
    "content": "청소 상태가 아주 좋았습니다. 체크인 안내도 친절했어요.",
    "status_code": "ACTIVE",
    "helpful_count": 11,
    "verified_stay": false,
    "created_at": "2026-08-25T11:00:00",
    "updated_at": "2026-08-31T21:52:25"
  },
  {
    "id": "9a2dbcfd-d3c5-490f-84be-c4750520e912",
    "user_id": "075b11e2-1207-42e9-ad88-846dc67d20e1",
    "user_name": "이서연",
    "property_id": "a5422723-d00f-42ea-b022-93227e17d655",
    "rating": 5,
    "content": "사진과 거의 같았습니다. 다음에 또 오고 싶네요.",
    "status_code": "ACTIVE",
    "helpful_count": 4,
    "verified_stay": false,
    "created_at": "2026-08-24T11:00:00",
    "updated_at": "2026-08-31T21:52:25"
  },
  {
    "id": "49d2ac44-494a-40b0-af15-6483913f9d46",
    "user_id": "075b11e2-1207-42e9-ad88-846dc67d20e1",
    "user_name": "이서연",
    "property_id": "7a0e88fc-4448-4fbc-95ff-50f367475fcc",
    "rating": 4,
    "content": "뷰가 정말 좋습니다. 재방문 의사 있습니다.",
    "status_code": "ACTIVE",
    "helpful_count": 4,
    "verified_stay": false,
    "created_at": "2026-08-22T11:00:00",
    "updated_at": "2026-08-31T21:52:25"
  },
  {
    "id": "97559aa2-552d-440e-8f73-cb035ee0f24a",
    "user_id": "075b11e2-1207-42e9-ad88-846dc67d20e1",
    "user_name": "이서연",
    "property_id": "fbc52bc2-7c7b-4615-98ef-08634a1281c0",
    "rating": 5,
    "content": "청소 상태가 아주 좋았습니다. 체크인 안내도 친절했어요.",
    "status_code": "ACTIVE",
    "helpful_count": 11,
    "verified_stay": false,
    "created_at": "2026-08-22T11:00:00",
    "updated_at": "2026-08-31T21:52:25"
  },
  {
    "id": "9889730c-275e-4e52-8c5d-127d66835a7c",
    "user_id": "ed85ab4c-01ad-4a7f-92b7-c411b524b066",
    "user_name": "김민준",
    "property_id": "cf5eb973-ff34-497d-8f58-c2a9fbc26301",
    "rating": 4,
    "content": "가격 대비 만족스러웠습니다. 수건이 조금 부족했어요.",
    "status_code": "ACTIVE",
    "helpful_count": 7,
    "verified_stay": false,
    "created_at": "2026-08-21T11:00:00",
    "updated_at": "2026-08-31T21:52:25"
  },
  {
    "id": "14c449f5-851d-42a9-a1f0-8c8cca5fd479",
    "user_id": "ed85ab4c-01ad-4a7f-92b7-c411b524b066",
    "user_name": "김민준",
    "property_id": "8e11c61d-942f-4aff-8dec-a4bf722677ef",
    "rating": 3,
    "content": "사진과 거의 같았습니다. 다음에 또 오고 싶네요.",
    "status_code": "ACTIVE",
    "helpful_count": 11,
    "verified_stay": false,
    "created_at": "2026-08-21T11:00:00",
    "updated_at": "2026-08-31T21:52:25"
  },
  {
    "id": "eb2557f0-d86f-4f57-b4a1-bc664f1c20cd",
    "user_id": "075b11e2-1207-42e9-ad88-846dc67d20e1",
    "user_name": "이서연",
    "property_id": "8b0b7c7c-cb31-4d87-9b35-0ca3d02fdab2",
    "rating": 4,
    "content": "청소 상태가 아주 좋았습니다. 체크인 안내도 친절했어요.",
    "status_code": "ACTIVE",
    "helpful_count": 5,
    "verified_stay": false,
    "created_at": "2026-08-21T11:00:00",
    "updated_at": "2026-08-31T21:52:25"
  },
  {
    "id": "5e550c85-330b-443c-9d07-26b618ecb4ca",
    "user_id": "ed85ab4c-01ad-4a7f-92b7-c411b524b066",
    "user_name": "김민준",
    "property_id": "b3b17692-6482-4617-9fbe-d401b0c9e853",
    "rating": 4,
    "content": "청소 상태가 아주 좋았습니다. 체크인 안내도 친절했어요.",
    "status_code": "ACTIVE",
    "helpful_count": 12,
    "verified_stay": false,
    "created_at": "2026-08-20T11:00:00",
    "updated_at": "2026-08-31T21:52:25"
  },
  {
    "id": "fb66487f-2aa4-4756-a0d6-b4cdd43fea77",
    "user_id": "075b11e2-1207-42e9-ad88-846dc67d20e1",
    "user_name": "이서연",
    "property_id": "1e3efa62-a0c3-4af0-88ce-7864a205df5c",
    "rating": 5,
    "content": "위치가 조용해서 푹 쉬었습니다. 주차도 편했어요.",
    "status_code": "ACTIVE",
    "helpful_count": 11,
    "verified_stay": false,
    "created_at": "2026-08-20T11:00:00",
    "updated_at": "2026-08-31T21:52:25"
  },
  {
    "id": "b3928cf9-b988-4c60-b4df-a5a303a08a69",
    "user_id": "ed85ab4c-01ad-4a7f-92b7-c411b524b066",
    "user_name": "김민준",
    "property_id": "ef6a10c2-6504-486f-9763-316a7d41cc03",
    "rating": 5,
    "content": "위치가 조용해서 푹 쉬었습니다. 주차도 편했어요.",
    "status_code": "ACTIVE",
    "helpful_count": 5,
    "verified_stay": false,
    "created_at": "2026-08-19T11:00:00",
    "updated_at": "2026-08-31T21:52:25"
  },
  {
    "id": "49a1b1ee-d12b-4443-89d4-f5b32c177220",
    "user_id": "ed85ab4c-01ad-4a7f-92b7-c411b524b066",
    "user_name": "김민준",
    "property_id": "81bf7139-9760-48fb-bb00-38d2e415a118",
    "rating": 5,
    "content": "사진과 거의 같았습니다. 다음에 또 오고 싶네요.",
    "status_code": "ACTIVE",
    "helpful_count": 1,
    "verified_stay": false,
    "created_at": "2026-08-19T11:00:00",
    "updated_at": "2026-08-31T21:52:25"
  },
  {
    "id": "de96a38f-c8c1-4091-9e66-b1b0486fd43e",
    "user_id": "075b11e2-1207-42e9-ad88-846dc67d20e1",
    "user_name": "이서연",
    "property_id": "36ca06d2-5006-4bfa-93b4-e4c064542d0a",
    "rating": 4,
    "content": "사진과 거의 같았습니다. 다음에 또 오고 싶네요.",
    "status_code": "ACTIVE",
    "helpful_count": 6,
    "verified_stay": false,
    "created_at": "2026-08-19T11:00:00",
    "updated_at": "2026-08-31T21:52:25"
  },
  {
    "id": "f78f7578-1e96-4580-a246-f01e1eb9fd46",
    "user_id": "075b11e2-1207-42e9-ad88-846dc67d20e1",
    "user_name": "이서연",
    "property_id": "b589ae3c-0770-457e-9335-27c1f7550c2b",
    "rating": 4,
    "content": "가격 대비 만족스러웠습니다. 수건이 조금 부족했어요.",
    "status_code": "REPORTED",
    "helpful_count": 3,
    "verified_stay": false,
    "created_at": "2026-08-18T11:00:00",
    "updated_at": "2026-08-31T21:52:25"
  },
  {
    "id": "553ef474-2a62-4c7e-a3be-85e3826eccee",
    "user_id": "ed85ab4c-01ad-4a7f-92b7-c411b524b066",
    "user_name": "김민준",
    "property_id": "e3df1b23-f249-4025-bfe0-cf0905ade2ca",
    "rating": 4,
    "content": "위치가 조용해서 푹 쉬었습니다. 주차도 편했어요.",
    "status_code": "ACTIVE",
    "helpful_count": 5,
    "verified_stay": false,
    "created_at": "2026-08-18T11:00:00",
    "updated_at": "2026-08-31T21:52:25"
  },
  {
    "id": "2436c9a9-8d29-489e-8e96-4eb13782c6a8",
    "user_id": "ed85ab4c-01ad-4a7f-92b7-c411b524b066",
    "user_name": "김민준",
    "property_id": "ed5c802f-7605-4ab0-9633-ac27bdb18403",
    "rating": 5,
    "content": "가격 대비 만족스러웠습니다. 수건이 조금 부족했어요.",
    "status_code": "ACTIVE",
    "helpful_count": 5,
    "verified_stay": false,
    "created_at": "2026-08-18T11:00:00",
    "updated_at": "2026-08-31T21:52:25"
  },
  {
    "id": "ca8e9c19-eb6d-482a-a358-ff8afb12e867",
    "user_id": "ed85ab4c-01ad-4a7f-92b7-c411b524b066",
    "user_name": "김민준",
    "property_id": "51908106-212d-473a-9606-9b708dc11ca5",
    "rating": 4,
    "content": "가격 대비 만족스러웠습니다. 수건이 조금 부족했어요.",
    "status_code": "REPORTED",
    "helpful_count": 9,
    "verified_stay": false,
    "created_at": "2026-08-16T11:00:00",
    "updated_at": "2026-08-31T21:52:25"
  },
  {
    "id": "57c09e69-05fc-4a93-8b24-6d901fc4c121",
    "user_id": "ed85ab4c-01ad-4a7f-92b7-c411b524b066",
    "user_name": "김민준",
    "property_id": "fbc52bc2-7c7b-4615-98ef-08634a1281c0",
    "rating": 5,
    "content": "뷰가 정말 좋습니다. 재방문 의사 있습니다.",
    "status_code": "ACTIVE",
    "helpful_count": 0,
    "verified_stay": false,
    "created_at": "2026-08-16T11:00:00",
    "updated_at": "2026-08-31T21:52:25"
  },
  {
    "id": "5986496b-dbca-49b5-a2d3-dd14d47cf62c",
    "user_id": "075b11e2-1207-42e9-ad88-846dc67d20e1",
    "user_name": "이서연",
    "property_id": "cf5eb973-ff34-497d-8f58-c2a9fbc26301",
    "rating": 5,
    "content": "뷰가 정말 좋습니다. 재방문 의사 있습니다.",
    "status_code": "ACTIVE",
    "helpful_count": 3,
    "verified_stay": false,
    "created_at": "2026-08-13T11:00:00",
    "updated_at": "2026-08-31T21:52:25"
  },
  {
    "id": "87023d18-a9cc-4fe4-b984-675800f1acbd",
    "user_id": "075b11e2-1207-42e9-ad88-846dc67d20e1",
    "user_name": "이서연",
    "property_id": "ef6a10c2-6504-486f-9763-316a7d41cc03",
    "rating": 4,
    "content": "사진과 거의 같았습니다. 다음에 또 오고 싶네요.",
    "status_code": "ACTIVE",
    "helpful_count": 10,
    "verified_stay": false,
    "created_at": "2026-08-12T11:00:00",
    "updated_at": "2026-08-31T21:52:25"
  },
  {
    "id": "dd1977df-12ab-4927-b7c4-c83c252a2ea2",
    "user_id": "075b11e2-1207-42e9-ad88-846dc67d20e1",
    "user_name": "이서연",
    "property_id": "d4eaa82b-615f-4f90-bbfe-562bc9b786e1",
    "rating": 5,
    "content": "가격 대비 만족스러웠습니다. 수건이 조금 부족했어요.",
    "status_code": "ACTIVE",
    "helpful_count": 0,
    "verified_stay": false,
    "created_at": "2026-08-12T11:00:00",
    "updated_at": "2026-08-31T21:52:25"
  }
]

export const GEN_ADMIN_BOARD_TYPES = [
  {
    "id": "7d187379-2a3f-4cd1-a236-843f35073b12",
    "code": "BREAKFAST",
    "name": "조식 포함",
    "extra_charge": 18000,
    "description": "1박당 조식 1회가 포함된다"
  },
  {
    "id": "6f7d22d1-02bd-41ca-b59c-9cd452218997",
    "code": "HALF_BOARD",
    "name": "조식·석식 포함",
    "extra_charge": 42000,
    "description": "1박당 조식과 석식이 포함된다"
  },
  {
    "id": "2c7deb7c-aa34-4072-9701-82c753034ac2",
    "code": "ROOM_ONLY",
    "name": "객실만",
    "extra_charge": 0,
    "description": "식사가 포함되지 않는다"
  }
]

export const GEN_FORECAST_SEGMENTS = {
  "model": "poisson_gbdt",
  "dimension": "region",
  "note": "가장 최근 폴드 기준. 전체 평균 뒤에 가려지는 구간 편차를 드러낸다.",
  "rows": [
    {
      "key": "Seoul",
      "wape": 0.2751,
      "mae": 0.9573,
      "rmse": 1.2552,
      "zero_ratio": 0.0744,
      "n": 336
    },
    {
      "key": "Busan",
      "wape": 0.3116,
      "mae": 0.9432,
      "rmse": 1.1828,
      "zero_ratio": 0.0625,
      "n": 224
    },
    {
      "key": "Jeju",
      "wape": 0.3316,
      "mae": 0.8764,
      "rmse": 1.1143,
      "zero_ratio": 0.1179,
      "n": 280
    },
    {
      "key": "Gangneung",
      "wape": 0.3753,
      "mae": 0.6433,
      "rmse": 0.8053,
      "zero_ratio": 0.2321,
      "n": 168
    },
    {
      "key": "Gyeongju",
      "wape": 0.5159,
      "mae": 0.6817,
      "rmse": 0.82,
      "zero_ratio": 0.3,
      "n": 140
    }
  ]
}

export const GEN_FORECAST_SEGMENTS_BY_TYPE = {
  "model": "poisson_gbdt",
  "dimension": "property_type",
  "note": "가장 최근 폴드 기준. 전체 평균 뒤에 가려지는 구간 편차를 드러낸다.",
  "rows": [
    {
      "key": "GUESTHOUSE",
      "wape": 0.3055,
      "mae": 0.9414,
      "rmse": 1.2029,
      "zero_ratio": 0.1214,
      "n": 280
    },
    {
      "key": "HOTEL",
      "wape": 0.3115,
      "mae": 0.8821,
      "rmse": 1.1303,
      "zero_ratio": 0.1429,
      "n": 196
    },
    {
      "key": "HOUSE",
      "wape": 0.3126,
      "mae": 0.8298,
      "rmse": 1.0467,
      "zero_ratio": 0.131,
      "n": 168
    },
    {
      "key": "APARTMENT",
      "wape": 0.3169,
      "mae": 0.8248,
      "rmse": 1.1125,
      "zero_ratio": 0.125,
      "n": 224
    },
    {
      "key": "PENSION",
      "wape": 0.3608,
      "mae": 0.7899,
      "rmse": 0.9941,
      "zero_ratio": 0.1464,
      "n": 280
    }
  ]
}

export const GEN_FORECAST_LOW_DEMAND = {
  "threshold": 1,
  "count": 241,
  "measured_on": "2025-12-04",
  "note": "region_wape 가 null 이면 그 지역을 잴 표본이 없었다는 뜻이다 — 0 이 아니다.",
  "rows": [
    {
      "property_id": "P039",
      "region": "Gyeongju",
      "stay_date": "2025-12-16",
      "predicted": 0.351,
      "region_wape": 0.5159,
      "region_n": 140
    },
    {
      "property_id": "P041",
      "region": "Gyeongju",
      "stay_date": "2025-12-10",
      "predicted": 0.369,
      "region_wape": 0.5159,
      "region_n": 140
    },
    {
      "property_id": "P037",
      "region": "Gyeongju",
      "stay_date": "2025-12-15",
      "predicted": 0.371,
      "region_wape": 0.5159,
      "region_n": 140
    },
    {
      "property_id": "P041",
      "region": "Gyeongju",
      "stay_date": "2025-12-30",
      "predicted": 0.376,
      "region_wape": 0.5159,
      "region_n": 140
    },
    {
      "property_id": "P041",
      "region": "Gyeongju",
      "stay_date": "2025-12-16",
      "predicted": 0.38,
      "region_wape": 0.5159,
      "region_n": 140
    },
    {
      "property_id": "P041",
      "region": "Gyeongju",
      "stay_date": "2025-12-09",
      "predicted": 0.387,
      "region_wape": 0.5159,
      "region_n": 140
    },
    {
      "property_id": "P041",
      "region": "Gyeongju",
      "stay_date": "2025-12-31",
      "predicted": 0.396,
      "region_wape": 0.5159,
      "region_n": 140
    },
    {
      "property_id": "P039",
      "region": "Gyeongju",
      "stay_date": "2025-12-22",
      "predicted": 0.396,
      "region_wape": 0.5159,
      "region_n": 140
    },
    {
      "property_id": "P037",
      "region": "Gyeongju",
      "stay_date": "2025-12-17",
      "predicted": 0.399,
      "region_wape": 0.5159,
      "region_n": 140
    },
    {
      "property_id": "P039",
      "region": "Gyeongju",
      "stay_date": "2025-12-09",
      "predicted": 0.403,
      "region_wape": 0.5159,
      "region_n": 140
    },
    {
      "property_id": "P037",
      "region": "Gyeongju",
      "stay_date": "2025-12-08",
      "predicted": 0.406,
      "region_wape": 0.5159,
      "region_n": 140
    },
    {
      "property_id": "P033",
      "region": "Gangneung",
      "stay_date": "2025-12-23",
      "predicted": 0.417,
      "region_wape": 0.3753,
      "region_n": 168
    },
    {
      "property_id": "P025",
      "region": "Jeju",
      "stay_date": "2025-12-10",
      "predicted": 0.423,
      "region_wape": 0.3316,
      "region_n": 280
    },
    {
      "property_id": "P029",
      "region": "Jeju",
      "stay_date": "2025-12-09",
      "predicted": 0.427,
      "region_wape": 0.3316,
      "region_n": 280
    },
    {
      "property_id": "P029",
      "region": "Jeju",
      "stay_date": "2025-12-08",
      "predicted": 0.429,
      "region_wape": 0.3316,
      "region_n": 280
    },
    {
      "property_id": "P029",
      "region": "Jeju",
      "stay_date": "2025-12-16",
      "predicted": 0.431,
      "region_wape": 0.3316,
      "region_n": 280
    },
    {
      "property_id": "P041",
      "region": "Gyeongju",
      "stay_date": "2025-12-29",
      "predicted": 0.438,
      "region_wape": 0.5159,
      "region_n": 140
    },
    {
      "property_id": "P034",
      "region": "Gangneung",
      "stay_date": "2025-12-17",
      "predicted": 0.438,
      "region_wape": 0.3753,
      "region_n": 168
    },
    {
      "property_id": "P036",
      "region": "Gangneung",
      "stay_date": "2025-12-30",
      "predicted": 0.451,
      "region_wape": 0.3753,
      "region_n": 168
    },
    {
      "property_id": "P037",
      "region": "Gyeongju",
      "stay_date": "2025-12-09",
      "predicted": 0.452,
      "region_wape": 0.5159,
      "region_n": 140
    },
    {
      "property_id": "P037",
      "region": "Gyeongju",
      "stay_date": "2025-12-23",
      "predicted": 0.454,
      "region_wape": 0.5159,
      "region_n": 140
    },
    {
      "property_id": "P033",
      "region": "Gangneung",
      "stay_date": "2025-12-24",
      "predicted": 0.454,
      "region_wape": 0.3753,
      "region_n": 168
    },
    {
      "property_id": "P036",
      "region": "Gangneung",
      "stay_date": "2025-12-15",
      "predicted": 0.455,
      "region_wape": 0.3753,
      "region_n": 168
    },
    {
      "property_id": "P039",
      "region": "Gyeongju",
      "stay_date": "2025-12-10",
      "predicted": 0.456,
      "region_wape": 0.5159,
      "region_n": 140
    },
    {
      "property_id": "P039",
      "region": "Gyeongju",
      "stay_date": "2025-12-30",
      "predicted": 0.459,
      "region_wape": 0.5159,
      "region_n": 140
    },
    {
      "property_id": "P034",
      "region": "Gangneung",
      "stay_date": "2025-12-15",
      "predicted": 0.46,
      "region_wape": 0.3753,
      "region_n": 168
    },
    {
      "property_id": "P028",
      "region": "Jeju",
      "stay_date": "2025-12-23",
      "predicted": 0.461,
      "region_wape": 0.3316,
      "region_n": 280
    },
    {
      "property_id": "P028",
      "region": "Jeju",
      "stay_date": "2025-12-08",
      "predicted": 0.462,
      "region_wape": 0.3316,
      "region_n": 280
    },
    {
      "property_id": "P033",
      "region": "Gangneung",
      "stay_date": "2025-12-17",
      "predicted": 0.463,
      "region_wape": 0.3753,
      "region_n": 168
    },
    {
      "property_id": "P029",
      "region": "Jeju",
      "stay_date": "2025-12-10",
      "predicted": 0.464,
      "region_wape": 0.3316,
      "region_n": 280
    },
    {
      "property_id": "P028",
      "region": "Jeju",
      "stay_date": "2025-12-22",
      "predicted": 0.467,
      "region_wape": 0.3316,
      "region_n": 280
    },
    {
      "property_id": "P036",
      "region": "Gangneung",
      "stay_date": "2025-12-09",
      "predicted": 0.467,
      "region_wape": 0.3753,
      "region_n": 168
    },
    {
      "property_id": "P039",
      "region": "Gyeongju",
      "stay_date": "2025-12-08",
      "predicted": 0.472,
      "region_wape": 0.5159,
      "region_n": 140
    },
    {
      "property_id": "P037",
      "region": "Gyeongju",
      "stay_date": "2025-12-24",
      "predicted": 0.473,
      "region_wape": 0.5159,
      "region_n": 140
    },
    {
      "property_id": "P037",
      "region": "Gyeongju",
      "stay_date": "2025-12-29",
      "predicted": 0.477,
      "region_wape": 0.5159,
      "region_n": 140
    },
    {
      "property_id": "P033",
      "region": "Gangneung",
      "stay_date": "2025-12-16",
      "predicted": 0.478,
      "region_wape": 0.3753,
      "region_n": 168
    },
    {
      "property_id": "P025",
      "region": "Jeju",
      "stay_date": "2025-12-24",
      "predicted": 0.48,
      "region_wape": 0.3316,
      "region_n": 280
    },
    {
      "property_id": "P028",
      "region": "Jeju",
      "stay_date": "2025-12-30",
      "predicted": 0.483,
      "region_wape": 0.3316,
      "region_n": 280
    },
    {
      "property_id": "P039",
      "region": "Gyeongju",
      "stay_date": "2025-12-29",
      "predicted": 0.483,
      "region_wape": 0.5159,
      "region_n": 140
    },
    {
      "property_id": "P037",
      "region": "Gyeongju",
      "stay_date": "2025-12-30",
      "predicted": 0.485,
      "region_wape": 0.5159,
      "region_n": 140
    }
  ]
}

export const GEN_FORECAST_METRICS = {
  "baseline": "seasonal_naive",
  "serving": "poisson_gbdt",
  "measured_by": "scripts/run_baseline.py — walk-forward 5폴드, reports/ 에 커밋됨",
  "rows": [
    {
      "model": "poisson_gbdt",
      "wape_mean": 0.3276,
      "wape_std": 0.0147,
      "wape_worst": 0.3477,
      "mae_mean": 0.8699,
      "folds": 5,
      "vs_baseline_pct": 50.1
    },
    {
      "model": "poisson_glm",
      "wape_mean": 0.379,
      "wape_std": 0.0122,
      "wape_worst": 0.3967,
      "mae_mean": 1.0071,
      "folds": 5,
      "vs_baseline_pct": 42.2
    },
    {
      "model": "pickup_ratio",
      "wape_mean": 0.4486,
      "wape_std": 0.0244,
      "wape_worst": 0.4936,
      "mae_mean": 1.191,
      "folds": 5,
      "vs_baseline_pct": 31.6
    },
    {
      "model": "weekday_mean",
      "wape_mean": 0.4908,
      "wape_std": 0.0231,
      "wape_worst": 0.5165,
      "mae_mean": 1.3043,
      "folds": 5,
      "vs_baseline_pct": 25.2
    },
    {
      "model": "moving_average",
      "wape_mean": 0.571,
      "wape_std": 0.0252,
      "wape_worst": 0.5965,
      "mae_mean": 1.5182,
      "folds": 5,
      "vs_baseline_pct": 13
    },
    {
      "model": "seasonal_naive",
      "wape_mean": 0.6562,
      "wape_std": 0.026,
      "wape_worst": 0.6819,
      "mae_mean": 1.7449,
      "folds": 5,
      "vs_baseline_pct": null
    }
  ]
}

export const GEN_SALES_PROSPECTS = [
  {
    "id": "a7071209-d28b-4d77-81fa-1d051268dbee",
    "name": "강문 오션 펜션",
    "region": "강릉",
    "area": "강문",
    "property_type": "PENSION",
    "capacity": 4,
    "rating": 4.6,
    "contactable": true,
    "has_open_opportunity": false
  },
  {
    "id": "4180b520-b760-414f-82c8-b780bc386696",
    "name": "사천 솔밭 단독주택",
    "region": "강릉",
    "area": "사천",
    "property_type": "HOUSE",
    "capacity": 6,
    "rating": 4.1,
    "contactable": true,
    "has_open_opportunity": false
  },
  {
    "id": "7fd501f1-ab80-46ea-a8a1-d9b210993f1c",
    "name": "보문 한옥채",
    "region": "경주",
    "area": "보문",
    "property_type": "HOUSE",
    "capacity": 4,
    "rating": 4.8,
    "contactable": true,
    "has_open_opportunity": false
  },
  {
    "id": "5532dbb2-92e1-4fde-abcb-8c68657d0943",
    "name": "불국사 앞 게스트하우스",
    "region": "경주",
    "area": "불국사",
    "property_type": "GUESTHOUSE",
    "capacity": 12,
    "rating": 4,
    "contactable": true,
    "has_open_opportunity": false
  },
  {
    "id": "3bb539ad-7249-4291-a2b2-7a609bba1f3a",
    "name": "광안리 저평점 펜션",
    "region": "부산",
    "area": "광안리",
    "property_type": "PENSION",
    "capacity": 4,
    "rating": 2.6,
    "contactable": true,
    "has_open_opportunity": false
  },
  {
    "id": "50327d63-7db1-491b-81c5-1d8801f1378f",
    "name": "망원 골목 아파트",
    "region": "서울",
    "area": "망원",
    "property_type": "APARTMENT",
    "capacity": 2,
    "rating": 4.5,
    "contactable": true,
    "has_open_opportunity": false
  },
  {
    "id": "5729a0b2-2479-4375-9161-d3191af5efc7",
    "name": "안덕 바다뷰 펜션",
    "region": "제주",
    "area": "안덕",
    "property_type": "PENSION",
    "capacity": 6,
    "rating": 4.4,
    "contactable": true,
    "has_open_opportunity": false
  },
  {
    "id": "93ed0994-e4eb-4bfb-91e6-63aadc934296",
    "name": "조천 돌담 독채",
    "region": "제주",
    "area": "조천",
    "property_type": "PENSION",
    "capacity": 4,
    "rating": 4.7,
    "contactable": true,
    "has_open_opportunity": false
  },
  {
    "id": "031a219f-73e4-4888-9da6-cc7cf109714f",
    "name": "표선 정원 단독주택",
    "region": "제주",
    "area": "표선",
    "property_type": "HOUSE",
    "capacity": 8,
    "rating": 4.2,
    "contactable": true,
    "has_open_opportunity": false
  },
  {
    "id": "c697fa37-83b4-4fe2-a3f5-957e139d446d",
    "name": "한림 연락처없는 펜션",
    "region": "제주",
    "area": "한림",
    "property_type": "PENSION",
    "capacity": 4,
    "rating": 4.3,
    "contactable": false,
    "has_open_opportunity": false
  }
]

export const GEN_SALES_OPPORTUNITIES = [
  {
    "id": "150e1abf-373d-42f6-9dc9-5502dcb6b3b4",
    "mode": "ACQUISITION",
    "status": "QUALIFIED",
    "product": "LISTING",
    "score": 37,
    "confidence": "low",
    "rationale": "강릉 PENSION 시장은 숙소당 예측 수요 1.76 에 우리 공급이 1곳이다. 4인 규모가 이 시장 중앙값(4인)에 가깝다 · 평점 4.6 · 강문에는 우리 숙소가 아직 없다. (예측 오차가 커 사람 확인 필요)",
    "target_name": "강문 오션 펜션",
    "region": "강릉",
    "property_type": "PENSION"
  },
  {
    "id": "eeb0dd94-b4a9-43bf-a2c3-b34f9bd1df78",
    "mode": "ACQUISITION",
    "status": "QUALIFIED",
    "product": "LISTING",
    "score": 25,
    "confidence": "high",
    "rationale": "제주 PENSION 시장은 숙소당 예측 수요 2.00 에 우리 공급이 2곳이다. 4인 규모가 이 시장 중앙값(4인)에 가깝다 · 평점 4.7 · 조천에는 우리 숙소가 아직 없다.",
    "target_name": "조천 돌담 독채",
    "region": "제주",
    "property_type": "PENSION"
  },
  {
    "id": "4de5ccca-718b-4767-8316-4fd26b7c6404",
    "mode": "ACQUISITION",
    "status": "QUALIFIED",
    "product": "LISTING",
    "score": 20,
    "confidence": "high",
    "rationale": "제주 PENSION 시장은 숙소당 예측 수요 2.00 에 우리 공급이 2곳이다. 안덕에는 우리 숙소가 아직 없다.",
    "target_name": "안덕 바다뷰 펜션",
    "region": "제주",
    "property_type": "PENSION"
  },
  {
    "id": "927b7d6a-779c-43a8-aa0b-ccb34f6374a0",
    "mode": "ACQUISITION",
    "status": "QUALIFIED",
    "product": "LISTING",
    "score": 15,
    "confidence": "high",
    "rationale": "서울 APARTMENT 시장은 숙소당 예측 수요 3.31 에 우리 공급이 3곳이다. 평점 4.5.",
    "target_name": "망원 골목 아파트",
    "region": "서울",
    "property_type": "APARTMENT"
  },
  {
    "id": "bd13d313-45c6-4ae4-9d85-551ffc2bc794",
    "mode": "ACQUISITION",
    "status": "QUALIFIED",
    "product": "LISTING",
    "score": 14,
    "confidence": "low",
    "rationale": "강릉 HOUSE 시장은 숙소당 예측 수요 1.79 에 우리 공급이 1곳이다. 적합도 특이사항 없음. (예측 오차가 커 사람 확인 필요)",
    "target_name": "사천 솔밭 단독주택",
    "region": "강릉",
    "property_type": "HOUSE"
  },
  {
    "id": "ac80b793-1b53-4884-b491-797b8f675ded",
    "mode": "ACQUISITION",
    "status": "QUALIFIED",
    "product": "LISTING",
    "score": 14,
    "confidence": "high",
    "rationale": "제주 HOUSE 시장은 숙소당 예측 수요 2.19 에 우리 공급이 2곳이다. 8인 규모가 이 시장 중앙값(7인)에 가깝다.",
    "target_name": "표선 정원 단독주택",
    "region": "제주",
    "property_type": "HOUSE"
  },
  {
    "id": "edfe4a90-8ac9-45bc-b35c-5ccf7a1d2751",
    "mode": "ACQUISITION",
    "status": "QUALIFIED",
    "product": "LISTING",
    "score": 11,
    "confidence": "low",
    "rationale": "경주 HOUSE 시장은 숙소당 예측 수요 1.71 에 우리 공급이 1곳이다. 평점 4.8. (예측 오차가 커 사람 확인 필요)",
    "target_name": "보문 한옥채",
    "region": "경주",
    "property_type": "HOUSE"
  },
  {
    "id": "1e54d615-10bc-460f-bcfc-ef953348f058",
    "mode": "ACQUISITION",
    "status": "QUALIFIED",
    "product": "LISTING",
    "score": 9,
    "confidence": "low",
    "rationale": "경주 GUESTHOUSE 시장은 숙소당 예측 수요 1.21 에 우리 공급이 1곳이다. 적합도 특이사항 없음. (예측 오차가 커 사람 확인 필요)",
    "target_name": "불국사 앞 게스트하우스",
    "region": "경주",
    "property_type": "GUESTHOUSE"
  }
]

export const GEN_SALES_OPPORTUNITY_DETAIL: Record<string, Record<string, unknown>> =
  {
  "eeb0dd94-b4a9-43bf-a2c3-b34f9bd1df78": {
    "id": "eeb0dd94-b4a9-43bf-a2c3-b34f9bd1df78",
    "mode": "ACQUISITION",
    "status": "QUALIFIED",
    "product": "LISTING",
    "score": 25,
    "confidence": "high",
    "rationale": "제주 PENSION 시장은 숙소당 예측 수요 2.00 에 우리 공급이 2곳이다. 4인 규모가 이 시장 중앙값(4인)에 가깝다 · 평점 4.7 · 조천에는 우리 숙소가 아직 없다.",
    "target_name": "조천 돌담 독채",
    "region": "제주",
    "property_type": "PENSION",
    "score_breakdown": {
      "gap_score": 0.2664,
      "fit_score": 0.95,
      "fit_axes": {
        "capacity": 1,
        "rating": 0.85,
        "area": 1
      },
      "fit_reasons": [
        "4인 규모가 이 시장 중앙값(4인)에 가깝다",
        "평점 4.7",
        "조천에는 우리 숙소가 아직 없다"
      ],
      "market": {
        "region": "제주",
        "property_type": "PENSION",
        "demand": 1.998154761904762,
        "supply": 2,
        "wape": 0.3316
      }
    },
    "next_action": "제안 생성",
    "prospect": {
      "id": "93ed0994-e4eb-4bfb-91e6-63aadc934296",
      "name": "조천 돌담 독채",
      "area": "조천",
      "capacity": 4,
      "rating": 4.7,
      "contact_email": "jocheon@example.com",
      "contact_phone": "064-100-0001",
      "source": "seed"
    }
  },
  "4de5ccca-718b-4767-8316-4fd26b7c6404": {
    "id": "4de5ccca-718b-4767-8316-4fd26b7c6404",
    "mode": "ACQUISITION",
    "status": "QUALIFIED",
    "product": "LISTING",
    "score": 20,
    "confidence": "high",
    "rationale": "제주 PENSION 시장은 숙소당 예측 수요 2.00 에 우리 공급이 2곳이다. 안덕에는 우리 숙소가 아직 없다.",
    "target_name": "안덕 바다뷰 펜션",
    "region": "제주",
    "property_type": "PENSION",
    "score_breakdown": {
      "gap_score": 0.2664,
      "fit_score": 0.7333,
      "fit_axes": {
        "capacity": 0.5,
        "rating": 0.7,
        "area": 1
      },
      "fit_reasons": [
        "안덕에는 우리 숙소가 아직 없다"
      ],
      "market": {
        "region": "제주",
        "property_type": "PENSION",
        "demand": 1.998154761904762,
        "supply": 2,
        "wape": 0.3316
      }
    },
    "next_action": "제안 생성",
    "prospect": {
      "id": "5729a0b2-2479-4375-9161-d3191af5efc7",
      "name": "안덕 바다뷰 펜션",
      "area": "안덕",
      "capacity": 6,
      "rating": 4.4,
      "contact_email": "andeok@example.com",
      "contact_phone": null,
      "source": "seed"
    }
  },
  "927b7d6a-779c-43a8-aa0b-ccb34f6374a0": {
    "id": "927b7d6a-779c-43a8-aa0b-ccb34f6374a0",
    "mode": "ACQUISITION",
    "status": "QUALIFIED",
    "product": "LISTING",
    "score": 15,
    "confidence": "high",
    "rationale": "서울 APARTMENT 시장은 숙소당 예측 수요 3.31 에 우리 공급이 3곳이다. 평점 4.5.",
    "target_name": "망원 골목 아파트",
    "region": "서울",
    "property_type": "APARTMENT",
    "score_breakdown": {
      "gap_score": 0.3156,
      "fit_score": 0.4722,
      "fit_axes": {
        "capacity": 0.6667,
        "rating": 0.75,
        "area": 0
      },
      "fit_reasons": [
        "평점 4.5"
      ],
      "market": {
        "region": "서울",
        "property_type": "APARTMENT",
        "demand": 3.314071428571429,
        "supply": 3,
        "wape": 0.2751
      }
    },
    "next_action": "제안 생성",
    "prospect": {
      "id": "50327d63-7db1-491b-81c5-1d8801f1378f",
      "name": "망원 골목 아파트",
      "area": "망원",
      "capacity": 2,
      "rating": 4.5,
      "contact_email": "mangwon@example.com",
      "contact_phone": null,
      "source": "seed"
    }
  },
  "bd13d313-45c6-4ae4-9d85-551ffc2bc794": {
    "id": "bd13d313-45c6-4ae4-9d85-551ffc2bc794",
    "mode": "ACQUISITION",
    "status": "QUALIFIED",
    "product": "LISTING",
    "score": 14,
    "confidence": "low",
    "rationale": "강릉 HOUSE 시장은 숙소당 예측 수요 1.79 에 우리 공급이 1곳이다. 적합도 특이사항 없음. (예측 오차가 커 사람 확인 필요)",
    "target_name": "사천 솔밭 단독주택",
    "region": "강릉",
    "property_type": "HOUSE",
    "score_breakdown": {
      "gap_score": 0.3969,
      "fit_score": 0.35,
      "fit_axes": {
        "capacity": 0,
        "rating": 0.55,
        "area": 0.5
      },
      "fit_reasons": [],
      "market": {
        "region": "강릉",
        "property_type": "HOUSE",
        "demand": 1.7862142857142858,
        "supply": 1,
        "wape": 0.3753
      }
    },
    "next_action": "제안 생성",
    "prospect": {
      "id": "4180b520-b760-414f-82c8-b780bc386696",
      "name": "사천 솔밭 단독주택",
      "area": "사천",
      "capacity": 6,
      "rating": 4.1,
      "contact_email": "sacheon@example.com",
      "contact_phone": null,
      "source": "seed"
    }
  },
  "ac80b793-1b53-4884-b491-797b8f675ded": {
    "id": "ac80b793-1b53-4884-b491-797b8f675ded",
    "mode": "ACQUISITION",
    "status": "QUALIFIED",
    "product": "LISTING",
    "score": 14,
    "confidence": "high",
    "rationale": "제주 HOUSE 시장은 숙소당 예측 수요 2.19 에 우리 공급이 2곳이다. 8인 규모가 이 시장 중앙값(7인)에 가깝다.",
    "target_name": "표선 정원 단독주택",
    "region": "제주",
    "property_type": "HOUSE",
    "score_breakdown": {
      "gap_score": 0.2925,
      "fit_score": 0.4857,
      "fit_axes": {
        "capacity": 0.8571,
        "rating": 0.6,
        "area": 0
      },
      "fit_reasons": [
        "8인 규모가 이 시장 중앙값(7인)에 가깝다"
      ],
      "market": {
        "region": "제주",
        "property_type": "HOUSE",
        "demand": 2.1937142857142855,
        "supply": 2,
        "wape": 0.3316
      }
    },
    "next_action": "제안 생성",
    "prospect": {
      "id": "031a219f-73e4-4888-9da6-cc7cf109714f",
      "name": "표선 정원 단독주택",
      "area": "표선",
      "capacity": 8,
      "rating": 4.2,
      "contact_email": "pyoseon@example.com",
      "contact_phone": null,
      "source": "seed"
    }
  },
  "edfe4a90-8ac9-45bc-b35c-5ccf7a1d2751": {
    "id": "edfe4a90-8ac9-45bc-b35c-5ccf7a1d2751",
    "mode": "ACQUISITION",
    "status": "QUALIFIED",
    "product": "LISTING",
    "score": 11,
    "confidence": "low",
    "rationale": "경주 HOUSE 시장은 숙소당 예측 수요 1.71 에 우리 공급이 1곳이다. 평점 4.8. (예측 오차가 커 사람 확인 필요)",
    "target_name": "보문 한옥채",
    "region": "경주",
    "property_type": "HOUSE",
    "score_breakdown": {
      "gap_score": 0.3791,
      "fit_score": 0.3,
      "fit_axes": {
        "capacity": 0,
        "rating": 0.9,
        "area": 0
      },
      "fit_reasons": [
        "평점 4.8"
      ],
      "market": {
        "region": "경주",
        "property_type": "HOUSE",
        "demand": 1.7060714285714285,
        "supply": 1,
        "wape": 0.5159
      }
    },
    "next_action": "제안 생성",
    "prospect": {
      "id": "7fd501f1-ab80-46ea-a8a1-d9b210993f1c",
      "name": "보문 한옥채",
      "area": "보문",
      "capacity": 4,
      "rating": 4.8,
      "contact_email": "bomun@example.com",
      "contact_phone": "054-100-0002",
      "source": "seed"
    }
  },
  "1e54d615-10bc-460f-bcfc-ef953348f058": {
    "id": "1e54d615-10bc-460f-bcfc-ef953348f058",
    "mode": "ACQUISITION",
    "status": "QUALIFIED",
    "product": "LISTING",
    "score": 9,
    "confidence": "low",
    "rationale": "경주 GUESTHOUSE 시장은 숙소당 예측 수요 1.21 에 우리 공급이 1곳이다. 적합도 특이사항 없음. (예측 오차가 커 사람 확인 필요)",
    "target_name": "불국사 앞 게스트하우스",
    "region": "경주",
    "property_type": "GUESTHOUSE",
    "score_breakdown": {
      "gap_score": 0.2692,
      "fit_score": 0.3333,
      "fit_axes": {
        "capacity": 0,
        "rating": 0.5,
        "area": 0.5
      },
      "fit_reasons": [],
      "market": {
        "region": "경주",
        "property_type": "GUESTHOUSE",
        "demand": 1.2111964285714285,
        "supply": 1,
        "wape": 0.5159
      }
    },
    "next_action": "제안 생성",
    "prospect": {
      "id": "5532dbb2-92e1-4fde-abcb-8c68657d0943",
      "name": "불국사 앞 게스트하우스",
      "area": "불국사",
      "capacity": 12,
      "rating": 4,
      "contact_email": "bulguk@example.com",
      "contact_phone": null,
      "source": "seed"
    }
  },
  "150e1abf-373d-42f6-9dc9-5502dcb6b3b4": {
    "id": "150e1abf-373d-42f6-9dc9-5502dcb6b3b4",
    "mode": "ACQUISITION",
    "status": "QUALIFIED",
    "product": "LISTING",
    "score": 37,
    "confidence": "low",
    "rationale": "강릉 PENSION 시장은 숙소당 예측 수요 1.76 에 우리 공급이 1곳이다. 4인 규모가 이 시장 중앙값(4인)에 가깝다 · 평점 4.6 · 강문에는 우리 숙소가 아직 없다. (예측 오차가 커 사람 확인 필요)",
    "target_name": "강문 오션 펜션",
    "region": "강릉",
    "property_type": "PENSION",
    "score_breakdown": {
      "gap_score": 0.3921,
      "fit_score": 0.9333,
      "fit_axes": {
        "capacity": 1,
        "rating": 0.8,
        "area": 1
      },
      "fit_reasons": [
        "4인 규모가 이 시장 중앙값(4인)에 가깝다",
        "평점 4.6",
        "강문에는 우리 숙소가 아직 없다"
      ],
      "market": {
        "region": "강릉",
        "property_type": "PENSION",
        "demand": 1.7645892857142857,
        "supply": 1,
        "wape": 0.3753
      }
    },
    "next_action": "제안 생성",
    "prospect": {
      "id": "a7071209-d28b-4d77-81fa-1d051268dbee",
      "name": "강문 오션 펜션",
      "area": "강문",
      "capacity": 4,
      "rating": 4.6,
      "contact_email": "gangmun@example.com",
      "contact_phone": null,
      "source": "seed"
    }
  }
}

export const GEN_CONTENT_SEARCH = {
  "hits": [
    {
      "chunk_id": "P0068:AMENITY:수영장",
      "property_id": "P0068",
      "doc_type": "AMENITY",
      "score": 0.028992,
      "text": "Jeju 스테이 068에서는 수영장을(를) 이용하실 수 있습니다."
    },
    {
      "chunk_id": "P0071:AMENITY:수영장",
      "property_id": "P0071",
      "doc_type": "AMENITY",
      "score": 0.028485,
      "text": "Jeju 하우스 071에서는 수영장을(를) 이용하실 수 있습니다."
    },
    {
      "chunk_id": "P0073:AMENITY:수영장",
      "property_id": "P0073",
      "doc_type": "AMENITY",
      "score": 0.028034,
      "text": "Seoul 빌라 073에서는 수영장을(를) 이용하실 수 있습니다."
    },
    {
      "chunk_id": "P0100:AMENITY:수영장",
      "property_id": "P0100",
      "doc_type": "AMENITY",
      "score": 0.027799,
      "text": "Jeju 하우스 100에서는 수영장을(를) 이용하실 수 있습니다."
    },
    {
      "chunk_id": "P0099:AMENITY:수영장",
      "property_id": "P0099",
      "doc_type": "AMENITY",
      "score": 0.027652,
      "text": "Gangneung 빌라 099에서는 수영장을(를) 이용하실 수 있습니다."
    }
  ],
  "grounded": true,
  "reason": "충분",
  "candidates_before_filter": 986,
  "candidates_after_filter": 964,
  "filter_reduction": 0.0223
}
