/* 이 파일은 `scripts/gen-fixtures.mjs` 가 만든다. **손으로 고치지 않는다.**
 *
 * 실제 서비스 응답을 그대로 받아 적은 것이라 모양과 분량이 실물과 같다.
 * 고칠 것이 있으면 시드나 서비스를 고치고 다시 뽑는다.
 *
 *     node scripts/gen-fixtures.mjs
 *
 * 생성 시각: 2026-08-31T21:31:53.145Z
 */

/** 기회 상세로 바로 들어오는 주소가 있어 id 를 고정한다. */
export const DEMO_OPPORTUNITY_ID = "150e1abf-373d-42f6-9dc9-5502dcb6b3b4"

export const GEN_PROPERTIES = [
  {
    "id": "4a10a306-f183-4c6f-a4cd-6cbdb4b87706",
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
    "listed_at": "2026-02-17T10:57:18.350075",
    "status": "LISTED",
    "region": "서울",
    "address": "서울특별시 연남로 55",
    "avg_rating": null,
    "review_count": 0
  },
  {
    "id": "609c92ab-b68a-458b-8914-d1097241046b",
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
    "listed_at": "2026-02-09T10:57:18.350075",
    "status": "LISTED",
    "region": "서울",
    "address": "서울특별시 성수로 32",
    "avg_rating": null,
    "review_count": 0
  },
  {
    "id": "7b4ae7bd-8f6b-43c6-8f41-2d59ce63413f",
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
    "listed_at": "2025-10-28T10:57:18.350075",
    "status": "LISTED",
    "region": "서울",
    "address": "서울특별시 익선동로 7",
    "avg_rating": null,
    "review_count": 0
  },
  {
    "id": "3a1d98b7-fa57-44e7-a2ef-e0e571d7af47",
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
    "listed_at": "2026-02-21T10:57:18.350075",
    "status": "LISTED",
    "region": "서울",
    "address": "서울특별시 서촌로 31",
    "avg_rating": null,
    "review_count": 0
  },
  {
    "id": "40e80ec8-e562-4176-ad9a-056fadbc4166",
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
    "listed_at": "2026-01-13T10:57:18.350075",
    "status": "LISTED",
    "region": "서울",
    "address": "서울특별시 한남로 77",
    "avg_rating": null,
    "review_count": 0
  },
  {
    "id": "d5d4689e-2e81-40eb-b15d-b21bd9360888",
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
    "listed_at": "2026-01-30T10:57:18.350075",
    "status": "LISTED",
    "region": "서울",
    "address": "서울특별시 망원로 31",
    "avg_rating": null,
    "review_count": 0
  },
  {
    "id": "e37a48b9-35a2-4122-97d0-e552cd290ff4",
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
    "listed_at": "2025-10-17T10:57:18.350075",
    "status": "LISTED",
    "region": "서울",
    "address": "서울특별시 연남로 58",
    "avg_rating": null,
    "review_count": 0
  },
  {
    "id": "c9c314ca-59d1-4431-8a50-5565a05f08fd",
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
    "listed_at": "2026-04-07T10:57:18.350075",
    "status": "LISTED",
    "region": "서울",
    "address": "서울특별시 성수로 51",
    "avg_rating": null,
    "review_count": 0
  },
  {
    "id": "3b24489d-04e0-4c20-94ec-8fbcf469cd77",
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
    "listed_at": "2026-02-21T10:57:18.350075",
    "status": "LISTED",
    "region": "서울",
    "address": "서울특별시 익선동로 105",
    "avg_rating": null,
    "review_count": 0
  },
  {
    "id": "175c8523-6df6-4dd6-b936-e0da28085f5c",
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
    "listed_at": "2026-04-08T10:57:18.350075",
    "status": "LISTED",
    "region": "서울",
    "address": "서울특별시 서촌로 9",
    "avg_rating": null,
    "review_count": 0
  },
  {
    "id": "8389f89b-c35a-498a-a487-4b4cc01118b2",
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
    "listed_at": "2025-09-24T10:57:18.350075",
    "status": "LISTED",
    "region": "서울",
    "address": "서울특별시 한남로 9",
    "avg_rating": null,
    "review_count": 0
  },
  {
    "id": "7c2fd663-3132-4d23-baae-8ea86d0a8195",
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
    "listed_at": "2026-06-30T10:57:18.350075",
    "status": "LISTED",
    "region": "서울",
    "address": "서울특별시 망원로 93",
    "avg_rating": null,
    "review_count": 0
  },
  {
    "id": "19a4a8e4-d7f7-412e-b305-676a50475fb1",
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
    "listed_at": "2026-04-04T10:57:18.350075",
    "status": "LISTED",
    "region": "부산",
    "address": "부산광역시 해운대로 30",
    "avg_rating": null,
    "review_count": 0
  },
  {
    "id": "6c26733c-fdf9-428c-9ae9-ae8940985d69",
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
    "listed_at": "2025-10-28T10:57:18.350075",
    "status": "LISTED",
    "region": "부산",
    "address": "부산광역시 광안리로 71",
    "avg_rating": null,
    "review_count": 0
  },
  {
    "id": "95686545-3f24-403a-beb7-427bf8b936e1",
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
    "listed_at": "2026-01-22T10:57:18.350075",
    "status": "LISTED",
    "region": "부산",
    "address": "부산광역시 송정로 25",
    "avg_rating": null,
    "review_count": 0
  },
  {
    "id": "dbf319e5-60da-4301-a631-3cb365602093",
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
    "listed_at": "2025-10-10T10:57:18.350075",
    "status": "LISTED",
    "region": "부산",
    "address": "부산광역시 영도로 5",
    "avg_rating": null,
    "review_count": 0
  },
  {
    "id": "041f39e6-0d4d-4a82-838b-eebdd55b04ac",
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
    "listed_at": "2026-06-07T10:57:18.350075",
    "status": "LISTED",
    "region": "부산",
    "address": "부산광역시 해운대로 38",
    "avg_rating": null,
    "review_count": 0
  },
  {
    "id": "847e1e84-891a-480b-aa9f-2afb2ca2075e",
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
    "listed_at": "2026-07-08T10:57:18.350075",
    "status": "LISTED",
    "region": "부산",
    "address": "부산광역시 광안리로 22",
    "avg_rating": null,
    "review_count": 0
  },
  {
    "id": "f02ef597-ef69-419f-ae97-e973138ade65",
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
    "listed_at": "2026-01-23T10:57:18.350075",
    "status": "LISTED",
    "region": "부산",
    "address": "부산광역시 송정로 3",
    "avg_rating": null,
    "review_count": 0
  },
  {
    "id": "9885bdc9-5629-46ba-92a3-e7905efe922a",
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
    "listed_at": "2026-07-12T10:57:18.350075",
    "status": "LISTED",
    "region": "부산",
    "address": "부산광역시 영도로 35",
    "avg_rating": null,
    "review_count": 0
  },
  {
    "id": "c497b765-a58d-4b7c-88b5-3fd7fd7fd1d5",
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
    "listed_at": "2026-05-28T10:57:18.350075",
    "status": "LISTED",
    "region": "제주",
    "address": "제주특별자치도 애월로 52",
    "avg_rating": null,
    "review_count": 0
  },
  {
    "id": "8d69706b-2a48-4da7-b36c-5cffd2117752",
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
    "listed_at": "2026-01-31T10:57:18.350075",
    "status": "LISTED",
    "region": "제주",
    "address": "제주특별자치도 성산로 1",
    "avg_rating": null,
    "review_count": 0
  },
  {
    "id": "acfd86a2-86bb-46f3-bf01-defe504e3cad",
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
    "listed_at": "2025-12-17T10:57:18.350075",
    "status": "LISTED",
    "region": "제주",
    "address": "제주특별자치도 한림로 47",
    "avg_rating": null,
    "review_count": 0
  },
  {
    "id": "22c4abf9-9170-473c-bb3f-b3b07ec7fe2b",
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
    "listed_at": "2025-09-10T10:57:18.350075",
    "status": "LISTED",
    "region": "제주",
    "address": "제주특별자치도 표선로 97",
    "avg_rating": null,
    "review_count": 0
  },
  {
    "id": "2910a497-ec40-4113-8ede-1cd530dbfba8",
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
    "listed_at": "2026-01-28T10:57:18.350075",
    "status": "LISTED",
    "region": "제주",
    "address": "제주특별자치도 구좌로 68",
    "avg_rating": null,
    "review_count": 0
  },
  {
    "id": "0e3b4cb4-c97f-4995-884a-f782f3c00bc1",
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
    "listed_at": "2026-04-09T10:57:18.350075",
    "status": "LISTED",
    "region": "제주",
    "address": "제주특별자치도 애월로 48",
    "avg_rating": null,
    "review_count": 0
  },
  {
    "id": "781a77cd-a4ff-491b-aa40-a8e889212320",
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
    "listed_at": "2026-01-27T10:57:18.350075",
    "status": "LISTED",
    "region": "제주",
    "address": "제주특별자치도 성산로 101",
    "avg_rating": null,
    "review_count": 0
  },
  {
    "id": "ef840de9-a3f9-4bec-9998-252c665b4312",
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
    "listed_at": "2025-08-18T10:57:18.350075",
    "status": "LISTED",
    "region": "제주",
    "address": "제주특별자치도 한림로 85",
    "avg_rating": null,
    "review_count": 0
  },
  {
    "id": "e5e53825-212f-4102-bda6-7bc249808d3b",
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
    "listed_at": "2025-11-09T10:57:18.350075",
    "status": "LISTED",
    "region": "제주",
    "address": "제주특별자치도 표선로 74",
    "avg_rating": null,
    "review_count": 0
  },
  {
    "id": "bdfbd23e-25cd-4dae-8f96-fdf121d0391d",
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
    "listed_at": "2026-04-07T10:57:18.350075",
    "status": "LISTED",
    "region": "제주",
    "address": "제주특별자치도 구좌로 89",
    "avg_rating": null,
    "review_count": 0
  },
  {
    "id": "c64a60ed-729f-4ef4-9969-31b6220a44bb",
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
    "listed_at": "2026-06-23T10:57:18.350075",
    "status": "LISTED",
    "region": "강릉",
    "address": "강원특별자치도 강릉시 경포로 108",
    "avg_rating": null,
    "review_count": 0
  },
  {
    "id": "cec5f56d-624b-4c3a-8ec4-23959ccdba8b",
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
    "listed_at": "2026-07-12T10:57:18.350075",
    "status": "LISTED",
    "region": "강릉",
    "address": "강원특별자치도 강릉시 안목로 77",
    "avg_rating": null,
    "review_count": 0
  },
  {
    "id": "8a4c7499-5cfb-4e1e-9147-a1d22b2b3751",
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
    "listed_at": "2026-02-19T10:57:18.350075",
    "status": "LISTED",
    "region": "강릉",
    "address": "강원특별자치도 강릉시 주문진로 20",
    "avg_rating": null,
    "review_count": 0
  },
  {
    "id": "3dfdc73d-2947-4e72-9089-b069d4cf6717",
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
    "listed_at": "2026-06-10T10:57:18.350075",
    "status": "LISTED",
    "region": "강릉",
    "address": "강원특별자치도 강릉시 사천로 76",
    "avg_rating": null,
    "review_count": 0
  },
  {
    "id": "4d57362f-daa0-4abc-abdc-428c4947cf0c",
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
    "listed_at": "2025-11-18T10:57:18.350075",
    "status": "LISTED",
    "region": "강릉",
    "address": "강원특별자치도 강릉시 경포로 53",
    "avg_rating": null,
    "review_count": 0
  },
  {
    "id": "be5ea5b9-a264-4410-9af7-2b31f616c7ca",
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
    "listed_at": "2025-10-01T10:57:18.350075",
    "status": "LISTED",
    "region": "강릉",
    "address": "강원특별자치도 강릉시 안목로 98",
    "avg_rating": null,
    "review_count": 0
  },
  {
    "id": "f783a07b-4e2c-467c-a318-5283447b41ba",
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
    "listed_at": "2026-07-02T10:57:18.350075",
    "status": "LISTED",
    "region": "경주",
    "address": "경상북도 경주시 황리단길로 75",
    "avg_rating": null,
    "review_count": 0
  },
  {
    "id": "5595dccd-9ac0-4b72-9da9-e1521e81ded4",
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
    "listed_at": "2025-10-14T10:57:18.350075",
    "status": "LISTED",
    "region": "경주",
    "address": "경상북도 경주시 보문로 33",
    "avg_rating": null,
    "review_count": 0
  },
  {
    "id": "c32d7e5d-cd53-4b7e-9d9d-5b003b3c5f91",
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
    "listed_at": "2026-04-08T10:57:18.350075",
    "status": "LISTED",
    "region": "경주",
    "address": "경상북도 경주시 불국사로 96",
    "avg_rating": null,
    "review_count": 0
  },
  {
    "id": "6cf90d98-29ef-4ee0-88c2-08a3e482917b",
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
    "listed_at": "2026-04-07T10:57:18.350075",
    "status": "LISTED",
    "region": "경주",
    "address": "경상북도 경주시 황리단길로 2",
    "avg_rating": null,
    "review_count": 0
  },
  {
    "id": "58d20199-7934-4d26-9e16-622e64654b40",
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
    "listed_at": "2026-05-31T10:57:18.350075",
    "status": "LISTED",
    "region": "경주",
    "address": "경상북도 경주시 보문로 115",
    "avg_rating": null,
    "review_count": 0
  }
]

export const GEN_ADMIN_STATS = {
  "total_users": 3,
  "today_bookings": 0,
  "today_revenue": 0,
  "listed_count": 41
}

export const GEN_RECENT_BOOKINGS = [
  {
    "id": "63dc8ade-82a5-4426-81c0-b68ceed063d3",
    "booking_number": "BK2608260042",
    "user_name": "김민준",
    "property_name": "서촌 한옥 단독주택",
    "total_price": 90000,
    "status": "CANCELLED",
    "booked_at": "2026-08-24T15:00:00"
  },
  {
    "id": "64530e89-d7f6-43cc-98c2-21294c1cd0e2",
    "booking_number": "BK2608290016",
    "user_name": "김민준",
    "property_name": "송정 오션뷰 호텔",
    "total_price": 90000,
    "status": "CONFIRMED",
    "booked_at": "2026-08-23T15:00:00"
  },
  {
    "id": "d1f92f97-b98c-4683-9c0a-5f4d4aa46c53",
    "booking_number": "BK2608260028",
    "user_name": "김민준",
    "property_name": "한남 루프탑 아파트",
    "total_price": 90000,
    "status": "CANCELLED",
    "booked_at": "2026-08-23T15:00:00"
  },
  {
    "id": "8f3557d7-a8f3-4711-92d6-d6c1ad21d3fd",
    "booking_number": "BK2608270030",
    "user_name": "김민준",
    "property_name": "황리단길 시티뷰 아파트",
    "total_price": 90000,
    "status": "CONFIRMED",
    "booked_at": "2026-08-23T15:00:00"
  },
  {
    "id": "5edefd14-f432-4e87-980c-eca3c1ee9267",
    "booking_number": "BK2608260001",
    "user_name": "이서연",
    "property_name": "연남 시티뷰 아파트",
    "total_price": 90000,
    "status": "CONFIRMED",
    "booked_at": "2026-08-22T15:00:00"
  },
  {
    "id": "14951d07-554d-441f-b6d7-43939f0306db",
    "booking_number": "BK2608260038",
    "user_name": "김민준",
    "property_name": "성수 라운지 게스트하우스",
    "total_price": 90000,
    "status": "CONFIRMED",
    "booked_at": "2026-08-22T15:00:00"
  },
  {
    "id": "448ddfd2-4cf4-4381-9fc5-27575c6a94a9",
    "booking_number": "BK2608220002",
    "user_name": "김민준",
    "property_name": "영도 라운지 게스트하우스",
    "total_price": 90000,
    "status": "CONFIRMED",
    "booked_at": "2026-08-21T15:00:00"
  },
  {
    "id": "a2984743-9e07-435f-9a8a-ebcf23989b0d",
    "booking_number": "BK2608260015",
    "user_name": "이서연",
    "property_name": "주문진 북카페 게스트하우스",
    "total_price": 90000,
    "status": "CONFIRMED",
    "booked_at": "2026-08-21T15:00:00"
  },
  {
    "id": "97876c97-6e56-4b91-bcd3-df561901c1b8",
    "booking_number": "BK2608230051",
    "user_name": "이서연",
    "property_name": "보문 정원 단독주택",
    "total_price": 90000,
    "status": "CONFIRMED",
    "booked_at": "2026-08-21T15:00:00"
  },
  {
    "id": "d209bc15-f3af-405d-a567-dafa35206d30",
    "booking_number": "BK2608230010",
    "user_name": "김민준",
    "property_name": "경포 시티뷰 아파트",
    "total_price": 90000,
    "status": "CONFIRMED",
    "booked_at": "2026-08-20T15:00:00"
  }
]

export const GEN_ADMIN_USERS = [
  {
    "id": "a675b8b6-2425-4e08-ba5c-17881d6e612b",
    "email": "admin@stay.example",
    "name": "관리자",
    "phone": "010-9999-0000",
    "role": "ADMIN",
    "created_at": "2026-08-31T10:57:19",
    "booking_count": 0
  },
  {
    "id": "e0ffce26-8f70-420e-8e69-0633063af610",
    "email": "user1@stay.example",
    "name": "김민준",
    "phone": "010-1234-5678",
    "role": "USER",
    "created_at": "2026-08-31T10:57:19",
    "booking_count": 30
  },
  {
    "id": "e5bd845d-b5b6-462d-91c2-7bcca3fa9341",
    "email": "user2@stay.example",
    "name": "이서연",
    "phone": "010-2345-6789",
    "role": "USER",
    "created_at": "2026-08-31T10:57:19",
    "booking_count": 30
  }
]

export const GEN_ADMIN_PROPERTIES = []

export const GEN_ADMIN_STAY_DATES = [
  {
    "id": "4c78a40e-5f08-41fc-9040-accb54a2fcbd",
    "property_id": "4a10a306-f183-4c6f-a4cd-6cbdb4b87706",
    "property_name": "연남 시티뷰 아파트",
    "room_type_id": "6f6340d2-ab1d-4599-ac06-bc99429dca16",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "7a13ccac-a961-44c0-9619-8df06852fb12",
    "property_id": "4a10a306-f183-4c6f-a4cd-6cbdb4b87706",
    "property_name": "연남 시티뷰 아파트",
    "room_type_id": "5fcf38df-f38d-412d-93a1-eb48eb8f0ee6",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "540f9c42-1ce1-42aa-b80d-da24fd78cfe6",
    "property_id": "609c92ab-b68a-458b-8914-d1097241046b",
    "property_name": "성수 스위트 호텔",
    "room_type_id": "63b04e40-fd63-4eb1-871f-05ecd0d96c9d",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "f7a35c33-4752-4947-ba5b-bc68b76abf35",
    "property_id": "609c92ab-b68a-458b-8914-d1097241046b",
    "property_name": "성수 스위트 호텔",
    "room_type_id": "9c646b05-054b-42cf-afc4-26be71126591",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "95154e25-69d1-40b9-9b4c-b0f1678f8ef7",
    "property_id": "7b4ae7bd-8f6b-43c6-8f41-2d59ce63413f",
    "property_name": "익선동 북카페 게스트하우스",
    "room_type_id": "5db4b4c2-b82b-4d06-990b-c6d3d6202336",
    "room_type_name": "스탠다드",
    "total_rooms": 12,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "b195de01-1acf-4e61-854b-11022f00d8ab",
    "property_id": "7b4ae7bd-8f6b-43c6-8f41-2d59ce63413f",
    "property_name": "익선동 북카페 게스트하우스",
    "room_type_id": "72adae4c-841b-47d0-b4a9-04725124fb15",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "5e802428-96dc-4489-8c50-a42fcf2b87d6",
    "property_id": "3a1d98b7-fa57-44e7-a2ef-e0e571d7af47",
    "property_name": "서촌 독채 펜션",
    "room_type_id": "d3dabddc-debe-44df-a72b-8bb6a2b8e871",
    "room_type_name": "스탠다드",
    "total_rooms": 12,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "f71997a6-feea-473f-a8b6-dfd327f43870",
    "property_id": "3a1d98b7-fa57-44e7-a2ef-e0e571d7af47",
    "property_name": "서촌 독채 펜션",
    "room_type_id": "26ac1f1b-6e17-4e31-a05b-125cd2b25be6",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "1c7f19ae-c638-4a79-9133-13e3385ee19e",
    "property_id": "40e80ec8-e562-4176-ad9a-056fadbc4166",
    "property_name": "한남 정원 단독주택",
    "room_type_id": "0b528972-fb89-4219-9202-e42be73def30",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "bf20e036-7a24-4395-83ef-7e3edfb1a0eb",
    "property_id": "40e80ec8-e562-4176-ad9a-056fadbc4166",
    "property_name": "한남 정원 단독주택",
    "room_type_id": "ba623477-c7e2-4be8-89a4-ac0040e1fa4b",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "c11a3bf8-f31d-4109-b582-d339e1df0ded",
    "property_id": "d5d4689e-2e81-40eb-b15d-b21bd9360888",
    "property_name": "망원 복층 아파트",
    "room_type_id": "37246ca3-31b6-4dae-a07d-51e0743e9645",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "5e4916c8-2c66-42e0-8df7-b35ee8b504e3",
    "property_id": "d5d4689e-2e81-40eb-b15d-b21bd9360888",
    "property_name": "망원 복층 아파트",
    "room_type_id": "4fe54678-edaa-4251-81ac-9756a460eaab",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "adcaf275-79b9-4475-bd82-43218b2e4138",
    "property_id": "e37a48b9-35a2-4122-97d0-e552cd290ff4",
    "property_name": "연남 오션뷰 호텔",
    "room_type_id": "ebece0f4-b568-43b9-8283-d7f9a9c7800d",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "9ccdf51d-af22-4896-8a48-bc8faaa2eb32",
    "property_id": "e37a48b9-35a2-4122-97d0-e552cd290ff4",
    "property_name": "연남 오션뷰 호텔",
    "room_type_id": "cca8ed15-44cb-41ef-9892-65c80f43fd78",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "7ddf6740-7663-4420-b147-185d1d8679be",
    "property_id": "c9c314ca-59d1-4431-8a50-5565a05f08fd",
    "property_name": "성수 라운지 게스트하우스",
    "room_type_id": "0aa4d0ac-3a83-4e72-979f-e336719724b0",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "f68fd93b-58e5-4f83-aa9f-97ce5e5fe8f5",
    "property_id": "c9c314ca-59d1-4431-8a50-5565a05f08fd",
    "property_name": "성수 라운지 게스트하우스",
    "room_type_id": "c5afedcc-0da4-4781-b84c-aaee74a884ad",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "aead2617-d951-4106-ad51-f54ba0c4d511",
    "property_id": "3b24489d-04e0-4c20-94ec-8fbcf469cd77",
    "property_name": "익선동 바비큐 펜션",
    "room_type_id": "a467658c-fde1-49ab-b62a-8dd55382f41a",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "acfac40b-1d89-489e-ab64-3dfcc4cb8672",
    "property_id": "3b24489d-04e0-4c20-94ec-8fbcf469cd77",
    "property_name": "익선동 바비큐 펜션",
    "room_type_id": "5f32049d-5feb-4196-835d-52e1a6dd3aa2",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "2a56d274-191f-4916-a2b9-a328303e57ba",
    "property_id": "175c8523-6df6-4dd6-b936-e0da28085f5c",
    "property_name": "서촌 한옥 단독주택",
    "room_type_id": "4f4f1c77-e3b4-4c8a-937e-62f0b18f2ffe",
    "room_type_name": "스탠다드",
    "total_rooms": 12,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "6258c704-5490-46b0-9e2c-72ddc3d61645",
    "property_id": "175c8523-6df6-4dd6-b936-e0da28085f5c",
    "property_name": "서촌 한옥 단독주택",
    "room_type_id": "c60c395d-68e9-468c-a23c-eeee9eb16008",
    "room_type_name": "디럭스",
    "total_rooms": 8,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "e462e083-4dc5-44c3-8bb3-a333890aa6c5",
    "property_id": "8389f89b-c35a-498a-a487-4b4cc01118b2",
    "property_name": "한남 루프탑 아파트",
    "room_type_id": "cece2850-db17-4364-b515-1b8a57d61e84",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "b2d40457-3010-43f7-9a38-df8de228837d",
    "property_id": "8389f89b-c35a-498a-a487-4b4cc01118b2",
    "property_name": "한남 루프탑 아파트",
    "room_type_id": "c2e24608-5288-43fb-8a74-01f6643732cc",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "098207ba-8d55-4243-9aca-9a6549fa7102",
    "property_id": "7c2fd663-3132-4d23-baae-8ea86d0a8195",
    "property_name": "망원 시티 호텔",
    "room_type_id": "b8421a86-b07d-44c6-a44f-0a0977d3d369",
    "room_type_name": "스탠다드",
    "total_rooms": 12,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "42ba0cac-e976-4ee1-a299-4ccf31258bc9",
    "property_id": "7c2fd663-3132-4d23-baae-8ea86d0a8195",
    "property_name": "망원 시티 호텔",
    "room_type_id": "04e3d7fb-447f-4c1b-b830-bd89f57c8fe5",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "9dbf806a-aec8-48d9-ac01-9250861cae64",
    "property_id": "19a4a8e4-d7f7-412e-b305-676a50475fb1",
    "property_name": "해운대 시티뷰 아파트",
    "room_type_id": "0509e307-9b34-4035-8ced-a68c4364273d",
    "room_type_name": "스탠다드",
    "total_rooms": 12,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "d1c13acb-2043-492f-b42a-8b8f17aa4f22",
    "property_id": "19a4a8e4-d7f7-412e-b305-676a50475fb1",
    "property_name": "해운대 시티뷰 아파트",
    "room_type_id": "ce000fd4-5655-40a8-95ee-f1cc2d0cae2e",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "34535c57-c249-4ec8-a15c-6574c505cd61",
    "property_id": "6c26733c-fdf9-428c-9ae9-ae8940985d69",
    "property_name": "광안리 스위트 호텔",
    "room_type_id": "421154a7-288f-4c30-9ed4-a52dc3b75054",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "a6363106-2339-411e-b361-d592783807e6",
    "property_id": "6c26733c-fdf9-428c-9ae9-ae8940985d69",
    "property_name": "광안리 스위트 호텔",
    "room_type_id": "e3bb0fa5-dcf3-4c30-a379-138a03b3db6f",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "f232a64b-3cc7-4d7e-a436-4d26b64a6237",
    "property_id": "95686545-3f24-403a-beb7-427bf8b936e1",
    "property_name": "송정 북카페 게스트하우스",
    "room_type_id": "b0935f5a-936a-4b3e-aa7e-d90e03f5bdc3",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "cb046301-a449-4c0c-a37e-1cf18085ff15",
    "property_id": "95686545-3f24-403a-beb7-427bf8b936e1",
    "property_name": "송정 북카페 게스트하우스",
    "room_type_id": "5029b7c5-5356-454a-889c-c7a3bf1cbc9f",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "afe9f522-597d-4de1-85e0-70f3d4a52d5d",
    "property_id": "dbf319e5-60da-4301-a631-3cb365602093",
    "property_name": "영도 독채 펜션",
    "room_type_id": "82d65416-adce-40a6-9317-c8b58b19746e",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "260d80ef-a936-43fb-8dfa-b42646ec88af",
    "property_id": "dbf319e5-60da-4301-a631-3cb365602093",
    "property_name": "영도 독채 펜션",
    "room_type_id": "7a99b929-29c9-47e6-9218-87c60d7996f5",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "3ae16819-a45e-4bea-95fc-cd8cb122d855",
    "property_id": "041f39e6-0d4d-4a82-838b-eebdd55b04ac",
    "property_name": "해운대 정원 단독주택",
    "room_type_id": "48a1fdb5-7843-4d45-8f05-ccad2952381f",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "cf8a5ba9-1d33-4afc-9bdc-e004564a833a",
    "property_id": "041f39e6-0d4d-4a82-838b-eebdd55b04ac",
    "property_name": "해운대 정원 단독주택",
    "room_type_id": "00681957-33a5-417e-9621-c79850d16fc5",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "634d8ec4-2cc2-469a-9ded-96b3ee7d26f6",
    "property_id": "847e1e84-891a-480b-aa9f-2afb2ca2075e",
    "property_name": "광안리 복층 아파트",
    "room_type_id": "99d7e42c-64ed-4e11-806a-a58c5360c31e",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "84a6ff66-1d26-40bd-8b0d-3316e97424e9",
    "property_id": "847e1e84-891a-480b-aa9f-2afb2ca2075e",
    "property_name": "광안리 복층 아파트",
    "room_type_id": "f73495c4-5bee-459c-ad17-1dae6068265c",
    "room_type_name": "디럭스",
    "total_rooms": 8,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "68a7c80a-1db3-44e9-ab5f-a66c8329c658",
    "property_id": "f02ef597-ef69-419f-ae97-e973138ade65",
    "property_name": "송정 오션뷰 호텔",
    "room_type_id": "fff9f343-f091-4e67-bf1e-bd7b0fc3de55",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "80780723-e6d9-43a8-969c-460df31465fb",
    "property_id": "f02ef597-ef69-419f-ae97-e973138ade65",
    "property_name": "송정 오션뷰 호텔",
    "room_type_id": "b5abe26b-ec90-4114-b38e-b52e674b2ce5",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "c10b5a10-f2f3-4d29-ad59-2a049e7c4a6b",
    "property_id": "9885bdc9-5629-46ba-92a3-e7905efe922a",
    "property_name": "영도 라운지 게스트하우스",
    "room_type_id": "77c33dd0-1603-4d89-b9b4-84bb284134fd",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "fc6790e0-9054-48e0-b6fd-343b30e70052",
    "property_id": "9885bdc9-5629-46ba-92a3-e7905efe922a",
    "property_name": "영도 라운지 게스트하우스",
    "room_type_id": "42e073bc-e212-4ef7-8bcc-2badc832902c",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "b7926f9b-b553-4e11-93c8-6dd274bb177b",
    "property_id": "c497b765-a58d-4b7c-88b5-3fd7fd7fd1d5",
    "property_name": "애월 시티뷰 아파트",
    "room_type_id": "74406ec7-3fd3-40ee-bb01-94f9e4b2775c",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "05b85dbe-fa76-4f42-84f6-2417a0dce5b4",
    "property_id": "c497b765-a58d-4b7c-88b5-3fd7fd7fd1d5",
    "property_name": "애월 시티뷰 아파트",
    "room_type_id": "dc582355-c3c2-4b84-a1ed-d45d47ba808a",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "4b660541-4a9e-458c-a303-5890d29406fe",
    "property_id": "8d69706b-2a48-4da7-b36c-5cffd2117752",
    "property_name": "성산 스위트 호텔",
    "room_type_id": "7a9878eb-dd72-4325-b1e6-aa71c8bd935a",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "2cc063fc-c95c-4eda-a61c-27a51b9fa990",
    "property_id": "8d69706b-2a48-4da7-b36c-5cffd2117752",
    "property_name": "성산 스위트 호텔",
    "room_type_id": "72271be4-6d23-4578-a254-11d9e396eb91",
    "room_type_name": "디럭스",
    "total_rooms": 8,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "ec42d2a7-8c89-418d-8800-7225ef13f63d",
    "property_id": "acfd86a2-86bb-46f3-bf01-defe504e3cad",
    "property_name": "한림 북카페 게스트하우스",
    "room_type_id": "e7cd5974-c87b-4972-8895-70daf48e6a0e",
    "room_type_name": "스탠다드",
    "total_rooms": 12,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "bc3cc0ad-6c7e-41c8-9727-e2f3e982b059",
    "property_id": "acfd86a2-86bb-46f3-bf01-defe504e3cad",
    "property_name": "한림 북카페 게스트하우스",
    "room_type_id": "15ec50c3-4610-4661-82be-c08db428413c",
    "room_type_name": "디럭스",
    "total_rooms": 8,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "a41df5f8-6fa9-4659-a2b1-0e0e625e4214",
    "property_id": "22c4abf9-9170-473c-bb3f-b3b07ec7fe2b",
    "property_name": "표선 독채 펜션",
    "room_type_id": "d14f2e3b-c980-470a-a260-6adb7ef724f7",
    "room_type_name": "스탠다드",
    "total_rooms": 12,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "206d5453-15b4-4243-afbc-f117bd8b9ae3",
    "property_id": "22c4abf9-9170-473c-bb3f-b3b07ec7fe2b",
    "property_name": "표선 독채 펜션",
    "room_type_id": "e48ff508-0219-4c7a-ae0f-3941509303e0",
    "room_type_name": "디럭스",
    "total_rooms": 8,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "7bf54209-c501-4b9a-a400-38359a16b872",
    "property_id": "2910a497-ec40-4113-8ede-1cd530dbfba8",
    "property_name": "구좌 정원 단독주택",
    "room_type_id": "0fbc80f7-bb63-4f0b-a533-7e2a93c98780",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "8458e9d1-bead-4c51-b047-31e5ed4e0c0b",
    "property_id": "2910a497-ec40-4113-8ede-1cd530dbfba8",
    "property_name": "구좌 정원 단독주택",
    "room_type_id": "ddad8f55-a962-41d4-beaa-fb40f3e3965b",
    "room_type_name": "디럭스",
    "total_rooms": 8,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "21e3622c-8e07-4c6c-ab93-8a713fbb77aa",
    "property_id": "0e3b4cb4-c97f-4995-884a-f782f3c00bc1",
    "property_name": "애월 복층 아파트",
    "room_type_id": "487a97e0-e9c2-40ce-b8c3-861fee47adf9",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "d9471bb0-9635-491a-91fb-0d117b7e3ebe",
    "property_id": "0e3b4cb4-c97f-4995-884a-f782f3c00bc1",
    "property_name": "애월 복층 아파트",
    "room_type_id": "67e5851d-de1e-450e-bc88-1b8f8f12a8e6",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "683978fb-31f1-4999-a9e3-2f33c5813c17",
    "property_id": "781a77cd-a4ff-491b-aa40-a8e889212320",
    "property_name": "성산 오션뷰 호텔",
    "room_type_id": "e9e9a962-c3bb-4ba8-b938-7b704b0b1dbf",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "1c905b00-830d-4765-a873-f78723a4b868",
    "property_id": "781a77cd-a4ff-491b-aa40-a8e889212320",
    "property_name": "성산 오션뷰 호텔",
    "room_type_id": "879cc00f-57d7-4b4a-ac40-aac939f99e73",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "235e8b40-2b27-496f-a98c-626d0b8566a2",
    "property_id": "ef840de9-a3f9-4bec-9998-252c665b4312",
    "property_name": "한림 라운지 게스트하우스",
    "room_type_id": "ffc41e19-98dd-49bd-90e3-de1495240377",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "3b053b1c-d182-4867-9061-f8fd2a768b13",
    "property_id": "ef840de9-a3f9-4bec-9998-252c665b4312",
    "property_name": "한림 라운지 게스트하우스",
    "room_type_id": "01a773bc-9ca2-4a17-b5b2-bb330c26c4ca",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "680023d7-3b52-4a7a-8aa0-9850a41fcf32",
    "property_id": "e5e53825-212f-4102-bda6-7bc249808d3b",
    "property_name": "표선 바비큐 펜션",
    "room_type_id": "01ff72ee-7bf8-42c6-821f-3bc1f9080d73",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "365b2dd0-11d0-4e32-bf0e-1d45ab8a86c8",
    "property_id": "e5e53825-212f-4102-bda6-7bc249808d3b",
    "property_name": "표선 바비큐 펜션",
    "room_type_id": "509002e6-61a4-4b6f-83dc-2fa1ddfb9d05",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "069225c0-24e3-467d-a5f1-03694e9da59e",
    "property_id": "bdfbd23e-25cd-4dae-8f96-fdf121d0391d",
    "property_name": "구좌 한옥 단독주택",
    "room_type_id": "08ce2798-6fd5-4571-8c67-7f54851a8860",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "8977fa6a-d10c-437d-9ffd-f3ff661aa33a",
    "property_id": "bdfbd23e-25cd-4dae-8f96-fdf121d0391d",
    "property_name": "구좌 한옥 단독주택",
    "room_type_id": "d933e0fd-fd5a-42ce-b5e4-af0dfe0b5c1f",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "cf95b34f-b811-4d6d-b9c9-b922e869c7b0",
    "property_id": "c64a60ed-729f-4ef4-9969-31b6220a44bb",
    "property_name": "경포 시티뷰 아파트",
    "room_type_id": "8de2289e-6e24-4658-acc5-7956706e0ed3",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "43437462-7dbe-4270-89c1-657261dbdd51",
    "property_id": "c64a60ed-729f-4ef4-9969-31b6220a44bb",
    "property_name": "경포 시티뷰 아파트",
    "room_type_id": "915cc6b1-d19e-4fc9-a615-b6a59a062b5c",
    "room_type_name": "디럭스",
    "total_rooms": 8,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "e380bb4e-2af4-4564-9623-00bac8cbed94",
    "property_id": "cec5f56d-624b-4c3a-8ec4-23959ccdba8b",
    "property_name": "안목 스위트 호텔",
    "room_type_id": "65a218a5-9d1b-413a-9bbf-4ea93fc68768",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "cf79af1d-e4aa-4843-96cd-b39774c23684",
    "property_id": "cec5f56d-624b-4c3a-8ec4-23959ccdba8b",
    "property_name": "안목 스위트 호텔",
    "room_type_id": "a786ccf3-c2ef-4989-b26b-63a01d5f5561",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "4a8b7f11-b2b5-4c65-872d-dae08ea54192",
    "property_id": "8a4c7499-5cfb-4e1e-9147-a1d22b2b3751",
    "property_name": "주문진 북카페 게스트하우스",
    "room_type_id": "65404a84-3401-4294-ac12-5840a91c07e7",
    "room_type_name": "스탠다드",
    "total_rooms": 12,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "6a0d1e76-cf09-434a-b000-69498c79e871",
    "property_id": "8a4c7499-5cfb-4e1e-9147-a1d22b2b3751",
    "property_name": "주문진 북카페 게스트하우스",
    "room_type_id": "12934d2d-9095-4e0c-8ac2-81d31aedb6a9",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "67ced3fb-2f25-4384-9019-aa4045e8d0f8",
    "property_id": "3dfdc73d-2947-4e72-9089-b069d4cf6717",
    "property_name": "사천 독채 펜션",
    "room_type_id": "1c55e973-0f9a-4130-99bd-bbbd0e410122",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "ee603d00-56b7-4850-bfb0-2cd3408843f9",
    "property_id": "3dfdc73d-2947-4e72-9089-b069d4cf6717",
    "property_name": "사천 독채 펜션",
    "room_type_id": "ef4529f3-20cc-4742-96d8-311dca0deb8b",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "4efde3d6-5f8a-409e-a83f-1f8808cd4ece",
    "property_id": "4d57362f-daa0-4abc-abdc-428c4947cf0c",
    "property_name": "경포 정원 단독주택",
    "room_type_id": "eb356d47-d292-4932-babe-362a66560143",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "3653900a-4871-4184-8f58-80ec0f40ca29",
    "property_id": "4d57362f-daa0-4abc-abdc-428c4947cf0c",
    "property_name": "경포 정원 단독주택",
    "room_type_id": "10ba47b0-7920-4ed4-b1c8-9d51c10a9444",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "d6f8bd1a-53c6-47ce-9c4a-2167096e2445",
    "property_id": "be5ea5b9-a264-4410-9af7-2b31f616c7ca",
    "property_name": "안목 복층 아파트",
    "room_type_id": "c1b95915-9394-4c50-902c-e412075f01b2",
    "room_type_name": "스탠다드",
    "total_rooms": 12,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "02140698-d42c-45d6-8686-c2788081847f",
    "property_id": "be5ea5b9-a264-4410-9af7-2b31f616c7ca",
    "property_name": "안목 복층 아파트",
    "room_type_id": "127bdbd9-7739-455b-9571-47cc2bd14980",
    "room_type_name": "디럭스",
    "total_rooms": 8,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "8a710a0a-0312-4037-8f0e-41cfc2c700d0",
    "property_id": "f783a07b-4e2c-467c-a318-5283447b41ba",
    "property_name": "황리단길 시티뷰 아파트",
    "room_type_id": "656c1cef-763d-4442-8f1d-b9e34a125e28",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "fd870f58-6bce-4a6e-91b8-54d0a97ea6d4",
    "property_id": "f783a07b-4e2c-467c-a318-5283447b41ba",
    "property_name": "황리단길 시티뷰 아파트",
    "room_type_id": "39aad9f8-5ff5-40c4-b321-4a6692fd5458",
    "room_type_name": "디럭스",
    "total_rooms": 8,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "9c721d33-78d9-43e5-b46d-92931efea179",
    "property_id": "5595dccd-9ac0-4b72-9da9-e1521e81ded4",
    "property_name": "보문 스위트 호텔",
    "room_type_id": "891d7f96-6ad5-47de-ac12-dbcb370d8e79",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "d1e55092-3c48-4273-b196-008ea9423efc",
    "property_id": "5595dccd-9ac0-4b72-9da9-e1521e81ded4",
    "property_name": "보문 스위트 호텔",
    "room_type_id": "93da6178-da82-45d7-bab0-85f1361ce70f",
    "room_type_name": "디럭스",
    "total_rooms": 8,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "d464f02b-7814-490f-95d8-c9491c8bc9b6",
    "property_id": "c32d7e5d-cd53-4b7e-9d9d-5b003b3c5f91",
    "property_name": "불국사 북카페 게스트하우스",
    "room_type_id": "5b86074e-ff8e-4d51-be28-81f8a520936b",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "ddb51c8e-fcd6-4753-a4b1-8bc3b8c34102",
    "property_id": "c32d7e5d-cd53-4b7e-9d9d-5b003b3c5f91",
    "property_name": "불국사 북카페 게스트하우스",
    "room_type_id": "b806579e-8af7-4f5d-8cc4-bdf977248556",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "64ea5eab-beea-4c31-a634-00809a8c4919",
    "property_id": "6cf90d98-29ef-4ee0-88c2-08a3e482917b",
    "property_name": "황리단길 독채 펜션",
    "room_type_id": "2ef3fec9-7e81-4e76-a05a-a9033bbbe3e6",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "d40e5693-0381-48a1-b25a-f56e2dd674d3",
    "property_id": "6cf90d98-29ef-4ee0-88c2-08a3e482917b",
    "property_name": "황리단길 독채 펜션",
    "room_type_id": "c53db1c9-05ab-43a3-a8a5-d87ceb2c16f4",
    "room_type_name": "디럭스",
    "total_rooms": 8,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "07768e02-b8e3-473b-8be4-23d016e284f1",
    "property_id": "58d20199-7934-4d26-9e16-622e64654b40",
    "property_name": "보문 정원 단독주택",
    "room_type_id": "c9527f72-3d46-4a93-9664-ce654fc49cb0",
    "room_type_name": "스탠다드",
    "total_rooms": 12,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "11eb9364-6841-4897-a008-98f5105f2ca7",
    "property_id": "58d20199-7934-4d26-9e16-622e64654b40",
    "property_name": "보문 정원 단독주택",
    "room_type_id": "5d46da07-12e0-4be6-a51d-a78344d15cf3",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-08-31T15:00:00",
    "check_out": "2026-09-01T11:00:00",
    "stay_date": "2026-08-31T00:00:00"
  },
  {
    "id": "bd205959-42f6-426c-a8fd-621e19d89062",
    "property_id": "4a10a306-f183-4c6f-a4cd-6cbdb4b87706",
    "property_name": "연남 시티뷰 아파트",
    "room_type_id": "6f6340d2-ab1d-4599-ac06-bc99429dca16",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "d279cc32-85ab-42f6-bc85-97bd482e770b",
    "property_id": "4a10a306-f183-4c6f-a4cd-6cbdb4b87706",
    "property_name": "연남 시티뷰 아파트",
    "room_type_id": "5fcf38df-f38d-412d-93a1-eb48eb8f0ee6",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "e2dacd70-58a2-4637-bca4-9bf256d7fea8",
    "property_id": "609c92ab-b68a-458b-8914-d1097241046b",
    "property_name": "성수 스위트 호텔",
    "room_type_id": "63b04e40-fd63-4eb1-871f-05ecd0d96c9d",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "acfa43e4-40b3-4a37-a858-88b0700b3407",
    "property_id": "609c92ab-b68a-458b-8914-d1097241046b",
    "property_name": "성수 스위트 호텔",
    "room_type_id": "9c646b05-054b-42cf-afc4-26be71126591",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "6ec952ce-ade8-4ec1-ac0e-5e75defa8e9e",
    "property_id": "7b4ae7bd-8f6b-43c6-8f41-2d59ce63413f",
    "property_name": "익선동 북카페 게스트하우스",
    "room_type_id": "5db4b4c2-b82b-4d06-990b-c6d3d6202336",
    "room_type_name": "스탠다드",
    "total_rooms": 12,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "15258cff-abce-4b7d-a573-b13435cfac21",
    "property_id": "7b4ae7bd-8f6b-43c6-8f41-2d59ce63413f",
    "property_name": "익선동 북카페 게스트하우스",
    "room_type_id": "72adae4c-841b-47d0-b4a9-04725124fb15",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "031f545d-1739-4e22-b673-4da47eee8879",
    "property_id": "3a1d98b7-fa57-44e7-a2ef-e0e571d7af47",
    "property_name": "서촌 독채 펜션",
    "room_type_id": "d3dabddc-debe-44df-a72b-8bb6a2b8e871",
    "room_type_name": "스탠다드",
    "total_rooms": 12,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "472eba9f-f902-479c-8061-a4dc38d42a47",
    "property_id": "3a1d98b7-fa57-44e7-a2ef-e0e571d7af47",
    "property_name": "서촌 독채 펜션",
    "room_type_id": "26ac1f1b-6e17-4e31-a05b-125cd2b25be6",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "d2d92428-d99c-48f1-8e05-2ced725c8b4e",
    "property_id": "40e80ec8-e562-4176-ad9a-056fadbc4166",
    "property_name": "한남 정원 단독주택",
    "room_type_id": "0b528972-fb89-4219-9202-e42be73def30",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "1010e3cd-309f-4d20-b224-e2d504f9fa2e",
    "property_id": "40e80ec8-e562-4176-ad9a-056fadbc4166",
    "property_name": "한남 정원 단독주택",
    "room_type_id": "ba623477-c7e2-4be8-89a4-ac0040e1fa4b",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "8f7c1743-4d63-4a77-bba9-8765eaf580ee",
    "property_id": "d5d4689e-2e81-40eb-b15d-b21bd9360888",
    "property_name": "망원 복층 아파트",
    "room_type_id": "37246ca3-31b6-4dae-a07d-51e0743e9645",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "029aac89-e851-415b-ad5a-8cad9786a0e9",
    "property_id": "d5d4689e-2e81-40eb-b15d-b21bd9360888",
    "property_name": "망원 복층 아파트",
    "room_type_id": "4fe54678-edaa-4251-81ac-9756a460eaab",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "f00d5ced-35c5-43b8-85da-e41f0e2c517c",
    "property_id": "e37a48b9-35a2-4122-97d0-e552cd290ff4",
    "property_name": "연남 오션뷰 호텔",
    "room_type_id": "ebece0f4-b568-43b9-8283-d7f9a9c7800d",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "8fd5e55b-ed10-47ab-84fb-5ae5c4c67f8e",
    "property_id": "e37a48b9-35a2-4122-97d0-e552cd290ff4",
    "property_name": "연남 오션뷰 호텔",
    "room_type_id": "cca8ed15-44cb-41ef-9892-65c80f43fd78",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "cfd99cb4-6987-4eec-a5c5-976e555f2864",
    "property_id": "c9c314ca-59d1-4431-8a50-5565a05f08fd",
    "property_name": "성수 라운지 게스트하우스",
    "room_type_id": "0aa4d0ac-3a83-4e72-979f-e336719724b0",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "d01b0371-9c85-45ec-bca3-af55b6dbf52d",
    "property_id": "c9c314ca-59d1-4431-8a50-5565a05f08fd",
    "property_name": "성수 라운지 게스트하우스",
    "room_type_id": "c5afedcc-0da4-4781-b84c-aaee74a884ad",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "5558f8a6-564d-4afa-9c7e-d090d1a6b5ee",
    "property_id": "3b24489d-04e0-4c20-94ec-8fbcf469cd77",
    "property_name": "익선동 바비큐 펜션",
    "room_type_id": "a467658c-fde1-49ab-b62a-8dd55382f41a",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "797e7ba2-deec-444b-afec-e21692a84e2c",
    "property_id": "3b24489d-04e0-4c20-94ec-8fbcf469cd77",
    "property_name": "익선동 바비큐 펜션",
    "room_type_id": "5f32049d-5feb-4196-835d-52e1a6dd3aa2",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "3a6bf211-216b-47b1-b918-2268ce68fbb0",
    "property_id": "175c8523-6df6-4dd6-b936-e0da28085f5c",
    "property_name": "서촌 한옥 단독주택",
    "room_type_id": "4f4f1c77-e3b4-4c8a-937e-62f0b18f2ffe",
    "room_type_name": "스탠다드",
    "total_rooms": 12,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "48511a89-7aad-44b7-86c3-395b46e2cc4b",
    "property_id": "175c8523-6df6-4dd6-b936-e0da28085f5c",
    "property_name": "서촌 한옥 단독주택",
    "room_type_id": "c60c395d-68e9-468c-a23c-eeee9eb16008",
    "room_type_name": "디럭스",
    "total_rooms": 8,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "659729a3-efe8-43f4-8f52-f16f0e1310cb",
    "property_id": "8389f89b-c35a-498a-a487-4b4cc01118b2",
    "property_name": "한남 루프탑 아파트",
    "room_type_id": "cece2850-db17-4364-b515-1b8a57d61e84",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "e7b7bddb-2609-4180-ba7b-860b37df97da",
    "property_id": "8389f89b-c35a-498a-a487-4b4cc01118b2",
    "property_name": "한남 루프탑 아파트",
    "room_type_id": "c2e24608-5288-43fb-8a74-01f6643732cc",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "da89d60b-89d7-46c5-934e-b82be0e00442",
    "property_id": "7c2fd663-3132-4d23-baae-8ea86d0a8195",
    "property_name": "망원 시티 호텔",
    "room_type_id": "b8421a86-b07d-44c6-a44f-0a0977d3d369",
    "room_type_name": "스탠다드",
    "total_rooms": 12,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "5a0e33ad-e824-46cc-a73f-43d2bcb9332c",
    "property_id": "7c2fd663-3132-4d23-baae-8ea86d0a8195",
    "property_name": "망원 시티 호텔",
    "room_type_id": "04e3d7fb-447f-4c1b-b830-bd89f57c8fe5",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "e7e51e8d-83d2-489d-b669-20dbd2eae8fc",
    "property_id": "19a4a8e4-d7f7-412e-b305-676a50475fb1",
    "property_name": "해운대 시티뷰 아파트",
    "room_type_id": "0509e307-9b34-4035-8ced-a68c4364273d",
    "room_type_name": "스탠다드",
    "total_rooms": 12,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "5f987764-05f0-4513-990c-b55c59d5a690",
    "property_id": "19a4a8e4-d7f7-412e-b305-676a50475fb1",
    "property_name": "해운대 시티뷰 아파트",
    "room_type_id": "ce000fd4-5655-40a8-95ee-f1cc2d0cae2e",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "8397aaeb-c819-41c0-abff-8075e28fff3d",
    "property_id": "6c26733c-fdf9-428c-9ae9-ae8940985d69",
    "property_name": "광안리 스위트 호텔",
    "room_type_id": "421154a7-288f-4c30-9ed4-a52dc3b75054",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "e88b8b74-11f2-428f-8835-c51583c31db7",
    "property_id": "6c26733c-fdf9-428c-9ae9-ae8940985d69",
    "property_name": "광안리 스위트 호텔",
    "room_type_id": "e3bb0fa5-dcf3-4c30-a379-138a03b3db6f",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "b46d3ff6-02cc-450f-b5c9-bc5f2347b4e7",
    "property_id": "95686545-3f24-403a-beb7-427bf8b936e1",
    "property_name": "송정 북카페 게스트하우스",
    "room_type_id": "b0935f5a-936a-4b3e-aa7e-d90e03f5bdc3",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "d223f1f9-9aa0-45be-88a6-df1f6260a806",
    "property_id": "95686545-3f24-403a-beb7-427bf8b936e1",
    "property_name": "송정 북카페 게스트하우스",
    "room_type_id": "5029b7c5-5356-454a-889c-c7a3bf1cbc9f",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "eef3f1e2-d6a9-4c74-82a0-7b3d46cd9aa7",
    "property_id": "dbf319e5-60da-4301-a631-3cb365602093",
    "property_name": "영도 독채 펜션",
    "room_type_id": "82d65416-adce-40a6-9317-c8b58b19746e",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "e5301da9-a35a-4047-91e1-296e105b2470",
    "property_id": "dbf319e5-60da-4301-a631-3cb365602093",
    "property_name": "영도 독채 펜션",
    "room_type_id": "7a99b929-29c9-47e6-9218-87c60d7996f5",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "6cd78b19-9892-4b81-a5d3-9a56f146a3de",
    "property_id": "041f39e6-0d4d-4a82-838b-eebdd55b04ac",
    "property_name": "해운대 정원 단독주택",
    "room_type_id": "48a1fdb5-7843-4d45-8f05-ccad2952381f",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "688d5cdd-7b3d-4b16-a9b0-2764db13da52",
    "property_id": "041f39e6-0d4d-4a82-838b-eebdd55b04ac",
    "property_name": "해운대 정원 단독주택",
    "room_type_id": "00681957-33a5-417e-9621-c79850d16fc5",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "3405c57c-f772-4ec0-90c1-9715336e0001",
    "property_id": "847e1e84-891a-480b-aa9f-2afb2ca2075e",
    "property_name": "광안리 복층 아파트",
    "room_type_id": "99d7e42c-64ed-4e11-806a-a58c5360c31e",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "ce1d5230-c37d-44ea-a974-be7c9f1267aa",
    "property_id": "847e1e84-891a-480b-aa9f-2afb2ca2075e",
    "property_name": "광안리 복층 아파트",
    "room_type_id": "f73495c4-5bee-459c-ad17-1dae6068265c",
    "room_type_name": "디럭스",
    "total_rooms": 8,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "2a592541-a6ce-4cce-8492-a47ce8bebdfb",
    "property_id": "f02ef597-ef69-419f-ae97-e973138ade65",
    "property_name": "송정 오션뷰 호텔",
    "room_type_id": "fff9f343-f091-4e67-bf1e-bd7b0fc3de55",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "c02d5418-1692-4c40-9bee-ed177866ce7b",
    "property_id": "f02ef597-ef69-419f-ae97-e973138ade65",
    "property_name": "송정 오션뷰 호텔",
    "room_type_id": "b5abe26b-ec90-4114-b38e-b52e674b2ce5",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "8cc47b78-f0bc-4b62-9a26-8005a6bdb632",
    "property_id": "9885bdc9-5629-46ba-92a3-e7905efe922a",
    "property_name": "영도 라운지 게스트하우스",
    "room_type_id": "77c33dd0-1603-4d89-b9b4-84bb284134fd",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "c85e2e7b-515c-4fc3-987c-d14e9d8ac9a1",
    "property_id": "9885bdc9-5629-46ba-92a3-e7905efe922a",
    "property_name": "영도 라운지 게스트하우스",
    "room_type_id": "42e073bc-e212-4ef7-8bcc-2badc832902c",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "df9fed17-fa7a-4487-9e23-485fc3e2137b",
    "property_id": "c497b765-a58d-4b7c-88b5-3fd7fd7fd1d5",
    "property_name": "애월 시티뷰 아파트",
    "room_type_id": "74406ec7-3fd3-40ee-bb01-94f9e4b2775c",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "549cf744-a6e1-48fe-9ab4-9f08fe4b70e8",
    "property_id": "c497b765-a58d-4b7c-88b5-3fd7fd7fd1d5",
    "property_name": "애월 시티뷰 아파트",
    "room_type_id": "dc582355-c3c2-4b84-a1ed-d45d47ba808a",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "1309e441-bcc1-4c73-92b1-1bd182204bed",
    "property_id": "8d69706b-2a48-4da7-b36c-5cffd2117752",
    "property_name": "성산 스위트 호텔",
    "room_type_id": "7a9878eb-dd72-4325-b1e6-aa71c8bd935a",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "0ffd5da6-e1e7-436f-bd33-4a46dd9e5bf7",
    "property_id": "8d69706b-2a48-4da7-b36c-5cffd2117752",
    "property_name": "성산 스위트 호텔",
    "room_type_id": "72271be4-6d23-4578-a254-11d9e396eb91",
    "room_type_name": "디럭스",
    "total_rooms": 8,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "934cbb85-05d1-4253-9d8b-fd7e5f261bae",
    "property_id": "acfd86a2-86bb-46f3-bf01-defe504e3cad",
    "property_name": "한림 북카페 게스트하우스",
    "room_type_id": "e7cd5974-c87b-4972-8895-70daf48e6a0e",
    "room_type_name": "스탠다드",
    "total_rooms": 12,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "8904369b-6b6c-4992-9a8c-78ae28c4972b",
    "property_id": "acfd86a2-86bb-46f3-bf01-defe504e3cad",
    "property_name": "한림 북카페 게스트하우스",
    "room_type_id": "15ec50c3-4610-4661-82be-c08db428413c",
    "room_type_name": "디럭스",
    "total_rooms": 8,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "1c06791c-b83e-434d-b6f8-7c8444c7fb50",
    "property_id": "22c4abf9-9170-473c-bb3f-b3b07ec7fe2b",
    "property_name": "표선 독채 펜션",
    "room_type_id": "d14f2e3b-c980-470a-a260-6adb7ef724f7",
    "room_type_name": "스탠다드",
    "total_rooms": 12,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "b2d22840-4ef3-4d8c-b0cd-a240be181a3c",
    "property_id": "22c4abf9-9170-473c-bb3f-b3b07ec7fe2b",
    "property_name": "표선 독채 펜션",
    "room_type_id": "e48ff508-0219-4c7a-ae0f-3941509303e0",
    "room_type_name": "디럭스",
    "total_rooms": 8,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "45a5493b-b09d-4ae6-8650-c1419bf9cc1d",
    "property_id": "2910a497-ec40-4113-8ede-1cd530dbfba8",
    "property_name": "구좌 정원 단독주택",
    "room_type_id": "0fbc80f7-bb63-4f0b-a533-7e2a93c98780",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "b8005e2c-0b56-43f6-bd3b-99abbbbe4cef",
    "property_id": "2910a497-ec40-4113-8ede-1cd530dbfba8",
    "property_name": "구좌 정원 단독주택",
    "room_type_id": "ddad8f55-a962-41d4-beaa-fb40f3e3965b",
    "room_type_name": "디럭스",
    "total_rooms": 8,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "9ba3eb1e-69f8-4ca7-865f-498e092e9e4a",
    "property_id": "0e3b4cb4-c97f-4995-884a-f782f3c00bc1",
    "property_name": "애월 복층 아파트",
    "room_type_id": "487a97e0-e9c2-40ce-b8c3-861fee47adf9",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "26e47254-c1b5-4976-b373-8495b721de41",
    "property_id": "0e3b4cb4-c97f-4995-884a-f782f3c00bc1",
    "property_name": "애월 복층 아파트",
    "room_type_id": "67e5851d-de1e-450e-bc88-1b8f8f12a8e6",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "306d00b7-25af-4a60-8113-706e61d37ac6",
    "property_id": "781a77cd-a4ff-491b-aa40-a8e889212320",
    "property_name": "성산 오션뷰 호텔",
    "room_type_id": "e9e9a962-c3bb-4ba8-b938-7b704b0b1dbf",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "7c8cb074-0980-42c0-8024-c6a788250892",
    "property_id": "781a77cd-a4ff-491b-aa40-a8e889212320",
    "property_name": "성산 오션뷰 호텔",
    "room_type_id": "879cc00f-57d7-4b4a-ac40-aac939f99e73",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "608233ad-1007-4df7-ba0e-a6c54a66b236",
    "property_id": "ef840de9-a3f9-4bec-9998-252c665b4312",
    "property_name": "한림 라운지 게스트하우스",
    "room_type_id": "ffc41e19-98dd-49bd-90e3-de1495240377",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "f4630a0c-c0dc-4a19-9424-7ecd5a20873f",
    "property_id": "ef840de9-a3f9-4bec-9998-252c665b4312",
    "property_name": "한림 라운지 게스트하우스",
    "room_type_id": "01a773bc-9ca2-4a17-b5b2-bb330c26c4ca",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "c684a084-560d-4a2b-b9f2-1d3fb2118756",
    "property_id": "e5e53825-212f-4102-bda6-7bc249808d3b",
    "property_name": "표선 바비큐 펜션",
    "room_type_id": "01ff72ee-7bf8-42c6-821f-3bc1f9080d73",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "c7af84f2-5066-4127-a32a-f97cc8e4ba00",
    "property_id": "e5e53825-212f-4102-bda6-7bc249808d3b",
    "property_name": "표선 바비큐 펜션",
    "room_type_id": "509002e6-61a4-4b6f-83dc-2fa1ddfb9d05",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "ab5d2da5-6efb-4611-b5c0-3ae2a56e9321",
    "property_id": "bdfbd23e-25cd-4dae-8f96-fdf121d0391d",
    "property_name": "구좌 한옥 단독주택",
    "room_type_id": "08ce2798-6fd5-4571-8c67-7f54851a8860",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "f6d3cfdf-770f-46ba-8808-722a2a884434",
    "property_id": "bdfbd23e-25cd-4dae-8f96-fdf121d0391d",
    "property_name": "구좌 한옥 단독주택",
    "room_type_id": "d933e0fd-fd5a-42ce-b5e4-af0dfe0b5c1f",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "e739c479-c920-4b59-ac4b-0b3b36d954da",
    "property_id": "c64a60ed-729f-4ef4-9969-31b6220a44bb",
    "property_name": "경포 시티뷰 아파트",
    "room_type_id": "8de2289e-6e24-4658-acc5-7956706e0ed3",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "de5fb983-8ce8-4a14-952e-e0c3da972411",
    "property_id": "c64a60ed-729f-4ef4-9969-31b6220a44bb",
    "property_name": "경포 시티뷰 아파트",
    "room_type_id": "915cc6b1-d19e-4fc9-a615-b6a59a062b5c",
    "room_type_name": "디럭스",
    "total_rooms": 8,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "aed12f4e-f298-4dc6-b0bd-a31a3130c90a",
    "property_id": "cec5f56d-624b-4c3a-8ec4-23959ccdba8b",
    "property_name": "안목 스위트 호텔",
    "room_type_id": "65a218a5-9d1b-413a-9bbf-4ea93fc68768",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "04fd043c-b64d-475e-ba35-22c4ab8fc581",
    "property_id": "cec5f56d-624b-4c3a-8ec4-23959ccdba8b",
    "property_name": "안목 스위트 호텔",
    "room_type_id": "a786ccf3-c2ef-4989-b26b-63a01d5f5561",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "58699066-5240-47ee-8dfd-b145d4c3972f",
    "property_id": "8a4c7499-5cfb-4e1e-9147-a1d22b2b3751",
    "property_name": "주문진 북카페 게스트하우스",
    "room_type_id": "65404a84-3401-4294-ac12-5840a91c07e7",
    "room_type_name": "스탠다드",
    "total_rooms": 12,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "7e067be7-38eb-40b6-9728-d58ec625bf4d",
    "property_id": "8a4c7499-5cfb-4e1e-9147-a1d22b2b3751",
    "property_name": "주문진 북카페 게스트하우스",
    "room_type_id": "12934d2d-9095-4e0c-8ac2-81d31aedb6a9",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "7e9a3277-1eb7-48e8-8f5a-bc2bb2ab64b5",
    "property_id": "3dfdc73d-2947-4e72-9089-b069d4cf6717",
    "property_name": "사천 독채 펜션",
    "room_type_id": "1c55e973-0f9a-4130-99bd-bbbd0e410122",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "99a713fd-2147-45e2-bab7-7995d57b43f4",
    "property_id": "3dfdc73d-2947-4e72-9089-b069d4cf6717",
    "property_name": "사천 독채 펜션",
    "room_type_id": "ef4529f3-20cc-4742-96d8-311dca0deb8b",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "28004b44-3926-4aa9-8567-be36016d87d1",
    "property_id": "4d57362f-daa0-4abc-abdc-428c4947cf0c",
    "property_name": "경포 정원 단독주택",
    "room_type_id": "eb356d47-d292-4932-babe-362a66560143",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "989b3f36-235c-477a-8bc2-725aac140c98",
    "property_id": "4d57362f-daa0-4abc-abdc-428c4947cf0c",
    "property_name": "경포 정원 단독주택",
    "room_type_id": "10ba47b0-7920-4ed4-b1c8-9d51c10a9444",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "c74277c2-1b1d-4f68-96f4-902469e14925",
    "property_id": "be5ea5b9-a264-4410-9af7-2b31f616c7ca",
    "property_name": "안목 복층 아파트",
    "room_type_id": "c1b95915-9394-4c50-902c-e412075f01b2",
    "room_type_name": "스탠다드",
    "total_rooms": 12,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "c5cadaec-4e63-4a90-aa1e-99424a4ceb3a",
    "property_id": "be5ea5b9-a264-4410-9af7-2b31f616c7ca",
    "property_name": "안목 복층 아파트",
    "room_type_id": "127bdbd9-7739-455b-9571-47cc2bd14980",
    "room_type_name": "디럭스",
    "total_rooms": 8,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "72c343bc-be32-4123-8ad4-a2d40737fbce",
    "property_id": "f783a07b-4e2c-467c-a318-5283447b41ba",
    "property_name": "황리단길 시티뷰 아파트",
    "room_type_id": "656c1cef-763d-4442-8f1d-b9e34a125e28",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "bc3c4976-0575-4bc0-8d7e-9db866db6905",
    "property_id": "f783a07b-4e2c-467c-a318-5283447b41ba",
    "property_name": "황리단길 시티뷰 아파트",
    "room_type_id": "39aad9f8-5ff5-40c4-b321-4a6692fd5458",
    "room_type_name": "디럭스",
    "total_rooms": 8,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "3e18292f-4a3b-4e21-9f08-3d01c9029307",
    "property_id": "5595dccd-9ac0-4b72-9da9-e1521e81ded4",
    "property_name": "보문 스위트 호텔",
    "room_type_id": "891d7f96-6ad5-47de-ac12-dbcb370d8e79",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "71304dc6-baa4-4590-b86a-39e923751113",
    "property_id": "5595dccd-9ac0-4b72-9da9-e1521e81ded4",
    "property_name": "보문 스위트 호텔",
    "room_type_id": "93da6178-da82-45d7-bab0-85f1361ce70f",
    "room_type_name": "디럭스",
    "total_rooms": 8,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "5cae8d64-ca4e-4196-b1d8-72ff621c6f5b",
    "property_id": "c32d7e5d-cd53-4b7e-9d9d-5b003b3c5f91",
    "property_name": "불국사 북카페 게스트하우스",
    "room_type_id": "5b86074e-ff8e-4d51-be28-81f8a520936b",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "8b3b31cb-c951-4eec-9d2e-0cba57bd9570",
    "property_id": "c32d7e5d-cd53-4b7e-9d9d-5b003b3c5f91",
    "property_name": "불국사 북카페 게스트하우스",
    "room_type_id": "b806579e-8af7-4f5d-8cc4-bdf977248556",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "151905c3-b33b-49f6-9627-61afd0333522",
    "property_id": "6cf90d98-29ef-4ee0-88c2-08a3e482917b",
    "property_name": "황리단길 독채 펜션",
    "room_type_id": "2ef3fec9-7e81-4e76-a05a-a9033bbbe3e6",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "0b29dc2f-49f0-412f-a7b2-6a5129bc3266",
    "property_id": "6cf90d98-29ef-4ee0-88c2-08a3e482917b",
    "property_name": "황리단길 독채 펜션",
    "room_type_id": "c53db1c9-05ab-43a3-a8a5-d87ceb2c16f4",
    "room_type_name": "디럭스",
    "total_rooms": 8,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "287287e0-1788-4cf6-a4f8-50955420aecd",
    "property_id": "58d20199-7934-4d26-9e16-622e64654b40",
    "property_name": "보문 정원 단독주택",
    "room_type_id": "c9527f72-3d46-4a93-9664-ce654fc49cb0",
    "room_type_name": "스탠다드",
    "total_rooms": 12,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "7d37f308-5820-4690-ac75-6103c511a50b",
    "property_id": "58d20199-7934-4d26-9e16-622e64654b40",
    "property_name": "보문 정원 단독주택",
    "room_type_id": "5d46da07-12e0-4be6-a51d-a78344d15cf3",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-09-01T15:00:00",
    "check_out": "2026-09-02T11:00:00",
    "stay_date": "2026-09-01T00:00:00"
  },
  {
    "id": "8e66d14e-7e2a-42fe-b50d-2235a44b2220",
    "property_id": "4a10a306-f183-4c6f-a4cd-6cbdb4b87706",
    "property_name": "연남 시티뷰 아파트",
    "room_type_id": "6f6340d2-ab1d-4599-ac06-bc99429dca16",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "951504d5-c807-4ac3-b9c7-3bfb56991216",
    "property_id": "4a10a306-f183-4c6f-a4cd-6cbdb4b87706",
    "property_name": "연남 시티뷰 아파트",
    "room_type_id": "5fcf38df-f38d-412d-93a1-eb48eb8f0ee6",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "a437993b-1979-4e36-8887-57a53e73fd6e",
    "property_id": "609c92ab-b68a-458b-8914-d1097241046b",
    "property_name": "성수 스위트 호텔",
    "room_type_id": "63b04e40-fd63-4eb1-871f-05ecd0d96c9d",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "3628a928-3c5b-4b9b-a83a-1902751b7bf6",
    "property_id": "609c92ab-b68a-458b-8914-d1097241046b",
    "property_name": "성수 스위트 호텔",
    "room_type_id": "9c646b05-054b-42cf-afc4-26be71126591",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "e97e6b9d-9cfc-4117-a3bf-f3bdeac85708",
    "property_id": "7b4ae7bd-8f6b-43c6-8f41-2d59ce63413f",
    "property_name": "익선동 북카페 게스트하우스",
    "room_type_id": "5db4b4c2-b82b-4d06-990b-c6d3d6202336",
    "room_type_name": "스탠다드",
    "total_rooms": 12,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "83823d93-33b1-42b3-870f-6d5bb76f03ba",
    "property_id": "7b4ae7bd-8f6b-43c6-8f41-2d59ce63413f",
    "property_name": "익선동 북카페 게스트하우스",
    "room_type_id": "72adae4c-841b-47d0-b4a9-04725124fb15",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "5c23d1c5-c172-4871-9af9-dab7de91b82c",
    "property_id": "3a1d98b7-fa57-44e7-a2ef-e0e571d7af47",
    "property_name": "서촌 독채 펜션",
    "room_type_id": "d3dabddc-debe-44df-a72b-8bb6a2b8e871",
    "room_type_name": "스탠다드",
    "total_rooms": 12,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "6015d00b-f7ef-4afd-bea6-eaec34baa0a4",
    "property_id": "3a1d98b7-fa57-44e7-a2ef-e0e571d7af47",
    "property_name": "서촌 독채 펜션",
    "room_type_id": "26ac1f1b-6e17-4e31-a05b-125cd2b25be6",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "c981335a-2f62-471c-ae6f-9a3a9b629407",
    "property_id": "40e80ec8-e562-4176-ad9a-056fadbc4166",
    "property_name": "한남 정원 단독주택",
    "room_type_id": "0b528972-fb89-4219-9202-e42be73def30",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "89ff5260-3236-4757-9cfb-86b786201a04",
    "property_id": "40e80ec8-e562-4176-ad9a-056fadbc4166",
    "property_name": "한남 정원 단독주택",
    "room_type_id": "ba623477-c7e2-4be8-89a4-ac0040e1fa4b",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "b7359d7c-4e30-46c8-a4eb-202972b29984",
    "property_id": "d5d4689e-2e81-40eb-b15d-b21bd9360888",
    "property_name": "망원 복층 아파트",
    "room_type_id": "37246ca3-31b6-4dae-a07d-51e0743e9645",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "e5681da8-ebce-4859-ab9d-8e63fc390c11",
    "property_id": "d5d4689e-2e81-40eb-b15d-b21bd9360888",
    "property_name": "망원 복층 아파트",
    "room_type_id": "4fe54678-edaa-4251-81ac-9756a460eaab",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "0ae597b6-01af-475c-966e-0d57127341bc",
    "property_id": "e37a48b9-35a2-4122-97d0-e552cd290ff4",
    "property_name": "연남 오션뷰 호텔",
    "room_type_id": "ebece0f4-b568-43b9-8283-d7f9a9c7800d",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "e32d5c06-776b-42ef-ab68-2ad51135980c",
    "property_id": "e37a48b9-35a2-4122-97d0-e552cd290ff4",
    "property_name": "연남 오션뷰 호텔",
    "room_type_id": "cca8ed15-44cb-41ef-9892-65c80f43fd78",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "2f76fcd5-b352-4fcc-a4fd-f33996e566ca",
    "property_id": "c9c314ca-59d1-4431-8a50-5565a05f08fd",
    "property_name": "성수 라운지 게스트하우스",
    "room_type_id": "0aa4d0ac-3a83-4e72-979f-e336719724b0",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "708da89a-594b-4008-b496-2e1b717b65a7",
    "property_id": "c9c314ca-59d1-4431-8a50-5565a05f08fd",
    "property_name": "성수 라운지 게스트하우스",
    "room_type_id": "c5afedcc-0da4-4781-b84c-aaee74a884ad",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "f885c93c-afd4-4097-aaa2-01fd30697087",
    "property_id": "3b24489d-04e0-4c20-94ec-8fbcf469cd77",
    "property_name": "익선동 바비큐 펜션",
    "room_type_id": "a467658c-fde1-49ab-b62a-8dd55382f41a",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "74ae1064-d473-4e75-8e39-b38a377e5712",
    "property_id": "3b24489d-04e0-4c20-94ec-8fbcf469cd77",
    "property_name": "익선동 바비큐 펜션",
    "room_type_id": "5f32049d-5feb-4196-835d-52e1a6dd3aa2",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "d17e0141-6b5a-4e3e-af79-1eb4d5118f0e",
    "property_id": "175c8523-6df6-4dd6-b936-e0da28085f5c",
    "property_name": "서촌 한옥 단독주택",
    "room_type_id": "4f4f1c77-e3b4-4c8a-937e-62f0b18f2ffe",
    "room_type_name": "스탠다드",
    "total_rooms": 12,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "8f434f51-c724-4a3f-ac25-1d5baf8f57f9",
    "property_id": "175c8523-6df6-4dd6-b936-e0da28085f5c",
    "property_name": "서촌 한옥 단독주택",
    "room_type_id": "c60c395d-68e9-468c-a23c-eeee9eb16008",
    "room_type_name": "디럭스",
    "total_rooms": 8,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "fecd2e6b-eba0-45f6-aa4e-b167240c516a",
    "property_id": "8389f89b-c35a-498a-a487-4b4cc01118b2",
    "property_name": "한남 루프탑 아파트",
    "room_type_id": "cece2850-db17-4364-b515-1b8a57d61e84",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "39156040-1498-461d-b5f1-c035f8488a27",
    "property_id": "8389f89b-c35a-498a-a487-4b4cc01118b2",
    "property_name": "한남 루프탑 아파트",
    "room_type_id": "c2e24608-5288-43fb-8a74-01f6643732cc",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "c1411e83-de26-4562-8334-2a756e86acc9",
    "property_id": "7c2fd663-3132-4d23-baae-8ea86d0a8195",
    "property_name": "망원 시티 호텔",
    "room_type_id": "b8421a86-b07d-44c6-a44f-0a0977d3d369",
    "room_type_name": "스탠다드",
    "total_rooms": 12,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "1e06f695-f1a6-4e45-a8f0-8af6d38cb836",
    "property_id": "7c2fd663-3132-4d23-baae-8ea86d0a8195",
    "property_name": "망원 시티 호텔",
    "room_type_id": "04e3d7fb-447f-4c1b-b830-bd89f57c8fe5",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "75322532-f031-40cc-9485-735d7541b292",
    "property_id": "19a4a8e4-d7f7-412e-b305-676a50475fb1",
    "property_name": "해운대 시티뷰 아파트",
    "room_type_id": "0509e307-9b34-4035-8ced-a68c4364273d",
    "room_type_name": "스탠다드",
    "total_rooms": 12,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "09cb83cc-a5f8-45e1-a352-65f07e94bc6a",
    "property_id": "19a4a8e4-d7f7-412e-b305-676a50475fb1",
    "property_name": "해운대 시티뷰 아파트",
    "room_type_id": "ce000fd4-5655-40a8-95ee-f1cc2d0cae2e",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "9c7d9400-35b9-49ac-9a30-8d527f9615d8",
    "property_id": "6c26733c-fdf9-428c-9ae9-ae8940985d69",
    "property_name": "광안리 스위트 호텔",
    "room_type_id": "421154a7-288f-4c30-9ed4-a52dc3b75054",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "cf1f4111-7126-4e51-b3c8-291f02b136ad",
    "property_id": "6c26733c-fdf9-428c-9ae9-ae8940985d69",
    "property_name": "광안리 스위트 호텔",
    "room_type_id": "e3bb0fa5-dcf3-4c30-a379-138a03b3db6f",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "297cfa8d-59bf-4b1c-bfc6-423d4a4ff5c6",
    "property_id": "95686545-3f24-403a-beb7-427bf8b936e1",
    "property_name": "송정 북카페 게스트하우스",
    "room_type_id": "b0935f5a-936a-4b3e-aa7e-d90e03f5bdc3",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "62534a66-952e-4b2e-91fd-3af86e139701",
    "property_id": "95686545-3f24-403a-beb7-427bf8b936e1",
    "property_name": "송정 북카페 게스트하우스",
    "room_type_id": "5029b7c5-5356-454a-889c-c7a3bf1cbc9f",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "fa786d99-9cd6-4c4d-822d-164e68e8b443",
    "property_id": "dbf319e5-60da-4301-a631-3cb365602093",
    "property_name": "영도 독채 펜션",
    "room_type_id": "82d65416-adce-40a6-9317-c8b58b19746e",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "8a109504-07b7-4ab1-8377-46e99a8a00b0",
    "property_id": "dbf319e5-60da-4301-a631-3cb365602093",
    "property_name": "영도 독채 펜션",
    "room_type_id": "7a99b929-29c9-47e6-9218-87c60d7996f5",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "4af2176d-ea3e-4637-a1ec-4ad3cd728ccb",
    "property_id": "041f39e6-0d4d-4a82-838b-eebdd55b04ac",
    "property_name": "해운대 정원 단독주택",
    "room_type_id": "48a1fdb5-7843-4d45-8f05-ccad2952381f",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "138f379d-12c4-4495-b730-c16080298741",
    "property_id": "041f39e6-0d4d-4a82-838b-eebdd55b04ac",
    "property_name": "해운대 정원 단독주택",
    "room_type_id": "00681957-33a5-417e-9621-c79850d16fc5",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "2348239d-d584-409c-a2f3-c8baba6f9f2c",
    "property_id": "847e1e84-891a-480b-aa9f-2afb2ca2075e",
    "property_name": "광안리 복층 아파트",
    "room_type_id": "99d7e42c-64ed-4e11-806a-a58c5360c31e",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "f8e99ff1-0624-4c72-91c8-c8b6ad156e77",
    "property_id": "847e1e84-891a-480b-aa9f-2afb2ca2075e",
    "property_name": "광안리 복층 아파트",
    "room_type_id": "f73495c4-5bee-459c-ad17-1dae6068265c",
    "room_type_name": "디럭스",
    "total_rooms": 8,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "5a4c3562-c377-402b-a2a4-9b8af61389e4",
    "property_id": "f02ef597-ef69-419f-ae97-e973138ade65",
    "property_name": "송정 오션뷰 호텔",
    "room_type_id": "fff9f343-f091-4e67-bf1e-bd7b0fc3de55",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "b6b5838a-d079-4e7a-ac37-2daec5a323c2",
    "property_id": "f02ef597-ef69-419f-ae97-e973138ade65",
    "property_name": "송정 오션뷰 호텔",
    "room_type_id": "b5abe26b-ec90-4114-b38e-b52e674b2ce5",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "1cb6988b-79ae-41e5-802a-b5c6b4e3dec8",
    "property_id": "9885bdc9-5629-46ba-92a3-e7905efe922a",
    "property_name": "영도 라운지 게스트하우스",
    "room_type_id": "77c33dd0-1603-4d89-b9b4-84bb284134fd",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "5d7c7ccd-1e33-425c-a434-fefdcfc75bdc",
    "property_id": "9885bdc9-5629-46ba-92a3-e7905efe922a",
    "property_name": "영도 라운지 게스트하우스",
    "room_type_id": "42e073bc-e212-4ef7-8bcc-2badc832902c",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "edcbc86e-948d-4870-8de5-23030f453a91",
    "property_id": "c497b765-a58d-4b7c-88b5-3fd7fd7fd1d5",
    "property_name": "애월 시티뷰 아파트",
    "room_type_id": "74406ec7-3fd3-40ee-bb01-94f9e4b2775c",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "c66149f0-f25e-474f-923d-57a764e9264d",
    "property_id": "c497b765-a58d-4b7c-88b5-3fd7fd7fd1d5",
    "property_name": "애월 시티뷰 아파트",
    "room_type_id": "dc582355-c3c2-4b84-a1ed-d45d47ba808a",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "f1dcedc5-33dc-49c6-8aa7-100e8d7e49b5",
    "property_id": "8d69706b-2a48-4da7-b36c-5cffd2117752",
    "property_name": "성산 스위트 호텔",
    "room_type_id": "7a9878eb-dd72-4325-b1e6-aa71c8bd935a",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "90474a12-871f-4fd3-b79d-d4e3bc16e0de",
    "property_id": "8d69706b-2a48-4da7-b36c-5cffd2117752",
    "property_name": "성산 스위트 호텔",
    "room_type_id": "72271be4-6d23-4578-a254-11d9e396eb91",
    "room_type_name": "디럭스",
    "total_rooms": 8,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "5908c039-f348-4578-b8fd-d458124e8a21",
    "property_id": "acfd86a2-86bb-46f3-bf01-defe504e3cad",
    "property_name": "한림 북카페 게스트하우스",
    "room_type_id": "e7cd5974-c87b-4972-8895-70daf48e6a0e",
    "room_type_name": "스탠다드",
    "total_rooms": 12,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "03d34495-ac3e-44ce-b175-d768bdeca499",
    "property_id": "acfd86a2-86bb-46f3-bf01-defe504e3cad",
    "property_name": "한림 북카페 게스트하우스",
    "room_type_id": "15ec50c3-4610-4661-82be-c08db428413c",
    "room_type_name": "디럭스",
    "total_rooms": 8,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "38e31cca-b548-4918-9804-04742c610ada",
    "property_id": "22c4abf9-9170-473c-bb3f-b3b07ec7fe2b",
    "property_name": "표선 독채 펜션",
    "room_type_id": "d14f2e3b-c980-470a-a260-6adb7ef724f7",
    "room_type_name": "스탠다드",
    "total_rooms": 12,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "d42af1e0-a1eb-4201-bd8f-7a98374fd3f5",
    "property_id": "22c4abf9-9170-473c-bb3f-b3b07ec7fe2b",
    "property_name": "표선 독채 펜션",
    "room_type_id": "e48ff508-0219-4c7a-ae0f-3941509303e0",
    "room_type_name": "디럭스",
    "total_rooms": 8,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "604eb770-c534-4ada-ae7e-db19861881dc",
    "property_id": "2910a497-ec40-4113-8ede-1cd530dbfba8",
    "property_name": "구좌 정원 단독주택",
    "room_type_id": "0fbc80f7-bb63-4f0b-a533-7e2a93c98780",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "009e6889-ffaf-4af1-a99f-73121da75ec7",
    "property_id": "2910a497-ec40-4113-8ede-1cd530dbfba8",
    "property_name": "구좌 정원 단독주택",
    "room_type_id": "ddad8f55-a962-41d4-beaa-fb40f3e3965b",
    "room_type_name": "디럭스",
    "total_rooms": 8,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "4fff7ac0-8508-4e42-9ccf-ac6f16d13eb3",
    "property_id": "0e3b4cb4-c97f-4995-884a-f782f3c00bc1",
    "property_name": "애월 복층 아파트",
    "room_type_id": "487a97e0-e9c2-40ce-b8c3-861fee47adf9",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "e69978fb-d4d2-4695-9020-6cba456c74a0",
    "property_id": "0e3b4cb4-c97f-4995-884a-f782f3c00bc1",
    "property_name": "애월 복층 아파트",
    "room_type_id": "67e5851d-de1e-450e-bc88-1b8f8f12a8e6",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "61dd3b00-5119-438d-8cb5-18769d70cc2a",
    "property_id": "781a77cd-a4ff-491b-aa40-a8e889212320",
    "property_name": "성산 오션뷰 호텔",
    "room_type_id": "e9e9a962-c3bb-4ba8-b938-7b704b0b1dbf",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "2ae73b1f-30d1-4c75-9c69-6b7e43dfc06c",
    "property_id": "781a77cd-a4ff-491b-aa40-a8e889212320",
    "property_name": "성산 오션뷰 호텔",
    "room_type_id": "879cc00f-57d7-4b4a-ac40-aac939f99e73",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "af25f5b1-3c08-4712-afed-b71369bf32b4",
    "property_id": "ef840de9-a3f9-4bec-9998-252c665b4312",
    "property_name": "한림 라운지 게스트하우스",
    "room_type_id": "ffc41e19-98dd-49bd-90e3-de1495240377",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "27dc36ff-8153-4cfd-a248-d12a85381755",
    "property_id": "ef840de9-a3f9-4bec-9998-252c665b4312",
    "property_name": "한림 라운지 게스트하우스",
    "room_type_id": "01a773bc-9ca2-4a17-b5b2-bb330c26c4ca",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "de58e609-3dab-4e39-bbc5-48cac2b8b19a",
    "property_id": "e5e53825-212f-4102-bda6-7bc249808d3b",
    "property_name": "표선 바비큐 펜션",
    "room_type_id": "01ff72ee-7bf8-42c6-821f-3bc1f9080d73",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "8f3a29c8-562f-4830-947b-ce80d8be96b2",
    "property_id": "e5e53825-212f-4102-bda6-7bc249808d3b",
    "property_name": "표선 바비큐 펜션",
    "room_type_id": "509002e6-61a4-4b6f-83dc-2fa1ddfb9d05",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "f7457165-be76-4af5-9f77-9f8b41d32355",
    "property_id": "bdfbd23e-25cd-4dae-8f96-fdf121d0391d",
    "property_name": "구좌 한옥 단독주택",
    "room_type_id": "08ce2798-6fd5-4571-8c67-7f54851a8860",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "c60292bc-ac5a-42f1-9efb-2f9f1f79ee88",
    "property_id": "bdfbd23e-25cd-4dae-8f96-fdf121d0391d",
    "property_name": "구좌 한옥 단독주택",
    "room_type_id": "d933e0fd-fd5a-42ce-b5e4-af0dfe0b5c1f",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "09adfcf2-7304-43a4-a546-cbfea6413aee",
    "property_id": "c64a60ed-729f-4ef4-9969-31b6220a44bb",
    "property_name": "경포 시티뷰 아파트",
    "room_type_id": "8de2289e-6e24-4658-acc5-7956706e0ed3",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "86bd03a2-2f05-4088-9692-e242351e469b",
    "property_id": "c64a60ed-729f-4ef4-9969-31b6220a44bb",
    "property_name": "경포 시티뷰 아파트",
    "room_type_id": "915cc6b1-d19e-4fc9-a615-b6a59a062b5c",
    "room_type_name": "디럭스",
    "total_rooms": 8,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "f1e29365-8130-4c89-a570-c31fecbd409e",
    "property_id": "cec5f56d-624b-4c3a-8ec4-23959ccdba8b",
    "property_name": "안목 스위트 호텔",
    "room_type_id": "65a218a5-9d1b-413a-9bbf-4ea93fc68768",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "27c22434-8a57-4754-870a-ad79e5a6ee0a",
    "property_id": "cec5f56d-624b-4c3a-8ec4-23959ccdba8b",
    "property_name": "안목 스위트 호텔",
    "room_type_id": "a786ccf3-c2ef-4989-b26b-63a01d5f5561",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "6d8e3708-1eb8-4a97-89cd-57e72c198ace",
    "property_id": "8a4c7499-5cfb-4e1e-9147-a1d22b2b3751",
    "property_name": "주문진 북카페 게스트하우스",
    "room_type_id": "65404a84-3401-4294-ac12-5840a91c07e7",
    "room_type_name": "스탠다드",
    "total_rooms": 12,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "2de4f426-44d6-436d-8606-4d31457fd633",
    "property_id": "8a4c7499-5cfb-4e1e-9147-a1d22b2b3751",
    "property_name": "주문진 북카페 게스트하우스",
    "room_type_id": "12934d2d-9095-4e0c-8ac2-81d31aedb6a9",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "85dd0a6c-be1e-481c-95e1-38cf38366655",
    "property_id": "3dfdc73d-2947-4e72-9089-b069d4cf6717",
    "property_name": "사천 독채 펜션",
    "room_type_id": "1c55e973-0f9a-4130-99bd-bbbd0e410122",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "c360f87f-8951-485d-9afd-a14ab190139c",
    "property_id": "3dfdc73d-2947-4e72-9089-b069d4cf6717",
    "property_name": "사천 독채 펜션",
    "room_type_id": "ef4529f3-20cc-4742-96d8-311dca0deb8b",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "43abb48f-7662-4058-bed8-2ffedab257a7",
    "property_id": "4d57362f-daa0-4abc-abdc-428c4947cf0c",
    "property_name": "경포 정원 단독주택",
    "room_type_id": "eb356d47-d292-4932-babe-362a66560143",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "fd704a38-12dd-49f0-9035-633ceffdca6b",
    "property_id": "4d57362f-daa0-4abc-abdc-428c4947cf0c",
    "property_name": "경포 정원 단독주택",
    "room_type_id": "10ba47b0-7920-4ed4-b1c8-9d51c10a9444",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "82729705-c02b-4f28-8440-9497b7b2ce35",
    "property_id": "be5ea5b9-a264-4410-9af7-2b31f616c7ca",
    "property_name": "안목 복층 아파트",
    "room_type_id": "c1b95915-9394-4c50-902c-e412075f01b2",
    "room_type_name": "스탠다드",
    "total_rooms": 12,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "b5a76d28-4714-45af-ab4b-a02e96592768",
    "property_id": "be5ea5b9-a264-4410-9af7-2b31f616c7ca",
    "property_name": "안목 복층 아파트",
    "room_type_id": "127bdbd9-7739-455b-9571-47cc2bd14980",
    "room_type_name": "디럭스",
    "total_rooms": 8,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "80bb9c96-e8a7-4412-9a2a-ffc5b7ea2c46",
    "property_id": "f783a07b-4e2c-467c-a318-5283447b41ba",
    "property_name": "황리단길 시티뷰 아파트",
    "room_type_id": "656c1cef-763d-4442-8f1d-b9e34a125e28",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "bb68ff22-27cd-4c55-9f8f-ea0de9c3c4f9",
    "property_id": "f783a07b-4e2c-467c-a318-5283447b41ba",
    "property_name": "황리단길 시티뷰 아파트",
    "room_type_id": "39aad9f8-5ff5-40c4-b321-4a6692fd5458",
    "room_type_name": "디럭스",
    "total_rooms": 8,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "19fcea45-08c4-491e-a87f-0e08844ae59a",
    "property_id": "5595dccd-9ac0-4b72-9da9-e1521e81ded4",
    "property_name": "보문 스위트 호텔",
    "room_type_id": "891d7f96-6ad5-47de-ac12-dbcb370d8e79",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "e003f676-a731-4f78-accb-8ce37392ad79",
    "property_id": "5595dccd-9ac0-4b72-9da9-e1521e81ded4",
    "property_name": "보문 스위트 호텔",
    "room_type_id": "93da6178-da82-45d7-bab0-85f1361ce70f",
    "room_type_name": "디럭스",
    "total_rooms": 8,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "b74071ec-7971-4fa4-aa80-a6ca0f66b68f",
    "property_id": "c32d7e5d-cd53-4b7e-9d9d-5b003b3c5f91",
    "property_name": "불국사 북카페 게스트하우스",
    "room_type_id": "5b86074e-ff8e-4d51-be28-81f8a520936b",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "260f1849-292b-49b9-b854-5440b78f644d",
    "property_id": "c32d7e5d-cd53-4b7e-9d9d-5b003b3c5f91",
    "property_name": "불국사 북카페 게스트하우스",
    "room_type_id": "b806579e-8af7-4f5d-8cc4-bdf977248556",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "8d8d410d-6cde-4990-8f7b-ead773bb6f94",
    "property_id": "6cf90d98-29ef-4ee0-88c2-08a3e482917b",
    "property_name": "황리단길 독채 펜션",
    "room_type_id": "2ef3fec9-7e81-4e76-a05a-a9033bbbe3e6",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "11b2be34-2c20-4880-be11-6264bf0fea6e",
    "property_id": "6cf90d98-29ef-4ee0-88c2-08a3e482917b",
    "property_name": "황리단길 독채 펜션",
    "room_type_id": "c53db1c9-05ab-43a3-a8a5-d87ceb2c16f4",
    "room_type_name": "디럭스",
    "total_rooms": 8,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "b14598b1-21de-417b-ace5-17567910d5d9",
    "property_id": "58d20199-7934-4d26-9e16-622e64654b40",
    "property_name": "보문 정원 단독주택",
    "room_type_id": "c9527f72-3d46-4a93-9664-ce654fc49cb0",
    "room_type_name": "스탠다드",
    "total_rooms": 12,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "70216937-c0bf-44d4-bbb9-d60503790f66",
    "property_id": "58d20199-7934-4d26-9e16-622e64654b40",
    "property_name": "보문 정원 단독주택",
    "room_type_id": "5d46da07-12e0-4be6-a51d-a78344d15cf3",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-09-02T15:00:00",
    "check_out": "2026-09-03T11:00:00",
    "stay_date": "2026-09-02T00:00:00"
  },
  {
    "id": "9d01e90a-a6a8-45d5-b9ee-3629eb79a23e",
    "property_id": "4a10a306-f183-4c6f-a4cd-6cbdb4b87706",
    "property_name": "연남 시티뷰 아파트",
    "room_type_id": "6f6340d2-ab1d-4599-ac06-bc99429dca16",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "1b849e79-0fc0-4cc2-9074-28cb00bd820c",
    "property_id": "4a10a306-f183-4c6f-a4cd-6cbdb4b87706",
    "property_name": "연남 시티뷰 아파트",
    "room_type_id": "5fcf38df-f38d-412d-93a1-eb48eb8f0ee6",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "b7d71743-0992-44dd-a281-ad248b7acb9a",
    "property_id": "609c92ab-b68a-458b-8914-d1097241046b",
    "property_name": "성수 스위트 호텔",
    "room_type_id": "63b04e40-fd63-4eb1-871f-05ecd0d96c9d",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "2fc78d1e-6d13-4d8a-8919-4c49bdc9f8fb",
    "property_id": "609c92ab-b68a-458b-8914-d1097241046b",
    "property_name": "성수 스위트 호텔",
    "room_type_id": "9c646b05-054b-42cf-afc4-26be71126591",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "13a86cf7-bbd0-4cd9-98e4-9f6ffa901cac",
    "property_id": "7b4ae7bd-8f6b-43c6-8f41-2d59ce63413f",
    "property_name": "익선동 북카페 게스트하우스",
    "room_type_id": "5db4b4c2-b82b-4d06-990b-c6d3d6202336",
    "room_type_name": "스탠다드",
    "total_rooms": 12,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "2ec83894-3988-4a16-a97e-492c3096fc72",
    "property_id": "7b4ae7bd-8f6b-43c6-8f41-2d59ce63413f",
    "property_name": "익선동 북카페 게스트하우스",
    "room_type_id": "72adae4c-841b-47d0-b4a9-04725124fb15",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "f9051e63-2d02-4d81-b598-fcff73cd3de1",
    "property_id": "3a1d98b7-fa57-44e7-a2ef-e0e571d7af47",
    "property_name": "서촌 독채 펜션",
    "room_type_id": "d3dabddc-debe-44df-a72b-8bb6a2b8e871",
    "room_type_name": "스탠다드",
    "total_rooms": 12,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "a9b245f5-50fb-47a8-832c-f84ee794fa93",
    "property_id": "3a1d98b7-fa57-44e7-a2ef-e0e571d7af47",
    "property_name": "서촌 독채 펜션",
    "room_type_id": "26ac1f1b-6e17-4e31-a05b-125cd2b25be6",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "58f0293d-0e5b-4996-816f-631d43b11e8a",
    "property_id": "40e80ec8-e562-4176-ad9a-056fadbc4166",
    "property_name": "한남 정원 단독주택",
    "room_type_id": "0b528972-fb89-4219-9202-e42be73def30",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "55741470-c5b6-4080-921b-18acbfe5d982",
    "property_id": "40e80ec8-e562-4176-ad9a-056fadbc4166",
    "property_name": "한남 정원 단독주택",
    "room_type_id": "ba623477-c7e2-4be8-89a4-ac0040e1fa4b",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "d2e89ec8-9f23-48f4-90c6-fcc979aa5a72",
    "property_id": "d5d4689e-2e81-40eb-b15d-b21bd9360888",
    "property_name": "망원 복층 아파트",
    "room_type_id": "37246ca3-31b6-4dae-a07d-51e0743e9645",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "d0a109fd-48d9-46e3-897f-f039572f4d1b",
    "property_id": "d5d4689e-2e81-40eb-b15d-b21bd9360888",
    "property_name": "망원 복층 아파트",
    "room_type_id": "4fe54678-edaa-4251-81ac-9756a460eaab",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "307a259b-751b-4411-b87c-2a6cf51a761d",
    "property_id": "e37a48b9-35a2-4122-97d0-e552cd290ff4",
    "property_name": "연남 오션뷰 호텔",
    "room_type_id": "ebece0f4-b568-43b9-8283-d7f9a9c7800d",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "7964ce4b-8a88-4745-8a94-27bf6eeaef7b",
    "property_id": "e37a48b9-35a2-4122-97d0-e552cd290ff4",
    "property_name": "연남 오션뷰 호텔",
    "room_type_id": "cca8ed15-44cb-41ef-9892-65c80f43fd78",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "ff6dce1a-d8e0-4c7a-8242-2edfcf3362b4",
    "property_id": "c9c314ca-59d1-4431-8a50-5565a05f08fd",
    "property_name": "성수 라운지 게스트하우스",
    "room_type_id": "0aa4d0ac-3a83-4e72-979f-e336719724b0",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "0b12f6d5-6326-4504-a82a-a61cc64f7a21",
    "property_id": "c9c314ca-59d1-4431-8a50-5565a05f08fd",
    "property_name": "성수 라운지 게스트하우스",
    "room_type_id": "c5afedcc-0da4-4781-b84c-aaee74a884ad",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "0f61ad51-1e3b-47d7-9c96-64eb3ab00159",
    "property_id": "3b24489d-04e0-4c20-94ec-8fbcf469cd77",
    "property_name": "익선동 바비큐 펜션",
    "room_type_id": "a467658c-fde1-49ab-b62a-8dd55382f41a",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "2d1303ba-64dc-4ac4-b982-1892a93b2db1",
    "property_id": "3b24489d-04e0-4c20-94ec-8fbcf469cd77",
    "property_name": "익선동 바비큐 펜션",
    "room_type_id": "5f32049d-5feb-4196-835d-52e1a6dd3aa2",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "c41e2e4f-67b3-460d-8971-fbbc07db866d",
    "property_id": "175c8523-6df6-4dd6-b936-e0da28085f5c",
    "property_name": "서촌 한옥 단독주택",
    "room_type_id": "4f4f1c77-e3b4-4c8a-937e-62f0b18f2ffe",
    "room_type_name": "스탠다드",
    "total_rooms": 12,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "09be2758-c83d-4bcd-a336-9cae12da89c6",
    "property_id": "175c8523-6df6-4dd6-b936-e0da28085f5c",
    "property_name": "서촌 한옥 단독주택",
    "room_type_id": "c60c395d-68e9-468c-a23c-eeee9eb16008",
    "room_type_name": "디럭스",
    "total_rooms": 8,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "561663c9-7fd5-45a7-8e63-9608cfba2212",
    "property_id": "8389f89b-c35a-498a-a487-4b4cc01118b2",
    "property_name": "한남 루프탑 아파트",
    "room_type_id": "cece2850-db17-4364-b515-1b8a57d61e84",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "dda4e1e9-956e-4685-a932-8ff3e571b4c7",
    "property_id": "8389f89b-c35a-498a-a487-4b4cc01118b2",
    "property_name": "한남 루프탑 아파트",
    "room_type_id": "c2e24608-5288-43fb-8a74-01f6643732cc",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "942e73b3-27cc-463d-b20a-961c81513b5e",
    "property_id": "7c2fd663-3132-4d23-baae-8ea86d0a8195",
    "property_name": "망원 시티 호텔",
    "room_type_id": "b8421a86-b07d-44c6-a44f-0a0977d3d369",
    "room_type_name": "스탠다드",
    "total_rooms": 12,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "b60a6166-3108-417a-a1f1-57544f216300",
    "property_id": "7c2fd663-3132-4d23-baae-8ea86d0a8195",
    "property_name": "망원 시티 호텔",
    "room_type_id": "04e3d7fb-447f-4c1b-b830-bd89f57c8fe5",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "6a9f3d9a-1b74-4363-9295-c92a21900f4b",
    "property_id": "19a4a8e4-d7f7-412e-b305-676a50475fb1",
    "property_name": "해운대 시티뷰 아파트",
    "room_type_id": "0509e307-9b34-4035-8ced-a68c4364273d",
    "room_type_name": "스탠다드",
    "total_rooms": 12,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "96a2b7b4-b9d4-4a32-a46d-c3681d09fa7e",
    "property_id": "19a4a8e4-d7f7-412e-b305-676a50475fb1",
    "property_name": "해운대 시티뷰 아파트",
    "room_type_id": "ce000fd4-5655-40a8-95ee-f1cc2d0cae2e",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "6a6cf34f-a96d-4f4c-a672-f0d040d67851",
    "property_id": "6c26733c-fdf9-428c-9ae9-ae8940985d69",
    "property_name": "광안리 스위트 호텔",
    "room_type_id": "421154a7-288f-4c30-9ed4-a52dc3b75054",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "64650478-4d89-4d38-8b68-e1daa4dd866c",
    "property_id": "6c26733c-fdf9-428c-9ae9-ae8940985d69",
    "property_name": "광안리 스위트 호텔",
    "room_type_id": "e3bb0fa5-dcf3-4c30-a379-138a03b3db6f",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "4b5a8286-6ffd-44a4-b687-514dc511ef08",
    "property_id": "95686545-3f24-403a-beb7-427bf8b936e1",
    "property_name": "송정 북카페 게스트하우스",
    "room_type_id": "b0935f5a-936a-4b3e-aa7e-d90e03f5bdc3",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "d99da535-80ef-499f-81d7-d10c610fe34f",
    "property_id": "95686545-3f24-403a-beb7-427bf8b936e1",
    "property_name": "송정 북카페 게스트하우스",
    "room_type_id": "5029b7c5-5356-454a-889c-c7a3bf1cbc9f",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "66932641-3837-4d19-a75f-57c721b8606b",
    "property_id": "dbf319e5-60da-4301-a631-3cb365602093",
    "property_name": "영도 독채 펜션",
    "room_type_id": "82d65416-adce-40a6-9317-c8b58b19746e",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "28ee0de1-458e-4847-a712-9a785a6c69d6",
    "property_id": "dbf319e5-60da-4301-a631-3cb365602093",
    "property_name": "영도 독채 펜션",
    "room_type_id": "7a99b929-29c9-47e6-9218-87c60d7996f5",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "e66ce7f6-8916-4f30-995e-d0a98505c9ba",
    "property_id": "041f39e6-0d4d-4a82-838b-eebdd55b04ac",
    "property_name": "해운대 정원 단독주택",
    "room_type_id": "48a1fdb5-7843-4d45-8f05-ccad2952381f",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "acb634d4-0b81-4126-b7a8-4ef4180e6cf9",
    "property_id": "041f39e6-0d4d-4a82-838b-eebdd55b04ac",
    "property_name": "해운대 정원 단독주택",
    "room_type_id": "00681957-33a5-417e-9621-c79850d16fc5",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "f20223fe-1d64-4492-af98-216234df3d52",
    "property_id": "847e1e84-891a-480b-aa9f-2afb2ca2075e",
    "property_name": "광안리 복층 아파트",
    "room_type_id": "99d7e42c-64ed-4e11-806a-a58c5360c31e",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "f0f36d7c-0a3b-4dca-ba33-1d1dd4580864",
    "property_id": "847e1e84-891a-480b-aa9f-2afb2ca2075e",
    "property_name": "광안리 복층 아파트",
    "room_type_id": "f73495c4-5bee-459c-ad17-1dae6068265c",
    "room_type_name": "디럭스",
    "total_rooms": 8,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "a521cf6b-40a3-409c-b33c-55401ea4c7d0",
    "property_id": "f02ef597-ef69-419f-ae97-e973138ade65",
    "property_name": "송정 오션뷰 호텔",
    "room_type_id": "fff9f343-f091-4e67-bf1e-bd7b0fc3de55",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "bc519c21-1296-42e4-b4a0-a5deb57e392a",
    "property_id": "f02ef597-ef69-419f-ae97-e973138ade65",
    "property_name": "송정 오션뷰 호텔",
    "room_type_id": "b5abe26b-ec90-4114-b38e-b52e674b2ce5",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "48a5bf30-f687-489f-b6b8-5978f106fd21",
    "property_id": "9885bdc9-5629-46ba-92a3-e7905efe922a",
    "property_name": "영도 라운지 게스트하우스",
    "room_type_id": "77c33dd0-1603-4d89-b9b4-84bb284134fd",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "a970d223-3373-4584-88c8-426622ab9ac5",
    "property_id": "9885bdc9-5629-46ba-92a3-e7905efe922a",
    "property_name": "영도 라운지 게스트하우스",
    "room_type_id": "42e073bc-e212-4ef7-8bcc-2badc832902c",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "b517fafb-9caa-4574-afc2-8c6a148a245b",
    "property_id": "c497b765-a58d-4b7c-88b5-3fd7fd7fd1d5",
    "property_name": "애월 시티뷰 아파트",
    "room_type_id": "74406ec7-3fd3-40ee-bb01-94f9e4b2775c",
    "room_type_name": "스탠다드",
    "total_rooms": 6,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "143759b9-519a-4e49-b680-1a50b4b4154d",
    "property_id": "c497b765-a58d-4b7c-88b5-3fd7fd7fd1d5",
    "property_name": "애월 시티뷰 아파트",
    "room_type_id": "dc582355-c3c2-4b84-a1ed-d45d47ba808a",
    "room_type_name": "디럭스",
    "total_rooms": 6,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "ba358cf7-a72a-4a57-9bd2-ea34243ebe72",
    "property_id": "8d69706b-2a48-4da7-b36c-5cffd2117752",
    "property_name": "성산 스위트 호텔",
    "room_type_id": "7a9878eb-dd72-4325-b1e6-aa71c8bd935a",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "03a1fbbf-db25-4ec1-b409-09b4e49612d7",
    "property_id": "8d69706b-2a48-4da7-b36c-5cffd2117752",
    "property_name": "성산 스위트 호텔",
    "room_type_id": "72271be4-6d23-4578-a254-11d9e396eb91",
    "room_type_name": "디럭스",
    "total_rooms": 8,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "465d3c17-d1c6-48a5-a559-8ee3df4be6da",
    "property_id": "acfd86a2-86bb-46f3-bf01-defe504e3cad",
    "property_name": "한림 북카페 게스트하우스",
    "room_type_id": "e7cd5974-c87b-4972-8895-70daf48e6a0e",
    "room_type_name": "스탠다드",
    "total_rooms": 12,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "b875c03e-5296-4c2a-ab1b-d587663b94bb",
    "property_id": "acfd86a2-86bb-46f3-bf01-defe504e3cad",
    "property_name": "한림 북카페 게스트하우스",
    "room_type_id": "15ec50c3-4610-4661-82be-c08db428413c",
    "room_type_name": "디럭스",
    "total_rooms": 8,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "c7223989-1a08-4688-8125-15b11f218d53",
    "property_id": "22c4abf9-9170-473c-bb3f-b3b07ec7fe2b",
    "property_name": "표선 독채 펜션",
    "room_type_id": "d14f2e3b-c980-470a-a260-6adb7ef724f7",
    "room_type_name": "스탠다드",
    "total_rooms": 12,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "61a377eb-e720-4407-bfbb-69d83eb31308",
    "property_id": "22c4abf9-9170-473c-bb3f-b3b07ec7fe2b",
    "property_name": "표선 독채 펜션",
    "room_type_id": "e48ff508-0219-4c7a-ae0f-3941509303e0",
    "room_type_name": "디럭스",
    "total_rooms": 8,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "1a2f37db-85d3-47ec-8c8f-df199bd1f35d",
    "property_id": "2910a497-ec40-4113-8ede-1cd530dbfba8",
    "property_name": "구좌 정원 단독주택",
    "room_type_id": "0fbc80f7-bb63-4f0b-a533-7e2a93c98780",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "bfa67583-3371-4849-992e-e95a22c4f987",
    "property_id": "2910a497-ec40-4113-8ede-1cd530dbfba8",
    "property_name": "구좌 정원 단독주택",
    "room_type_id": "ddad8f55-a962-41d4-beaa-fb40f3e3965b",
    "room_type_name": "디럭스",
    "total_rooms": 8,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "7bea5f10-5288-4cda-ae8b-6c8881e21b2f",
    "property_id": "0e3b4cb4-c97f-4995-884a-f782f3c00bc1",
    "property_name": "애월 복층 아파트",
    "room_type_id": "487a97e0-e9c2-40ce-b8c3-861fee47adf9",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "79859525-9442-49a1-847f-db91189b3d36",
    "property_id": "0e3b4cb4-c97f-4995-884a-f782f3c00bc1",
    "property_name": "애월 복층 아파트",
    "room_type_id": "67e5851d-de1e-450e-bc88-1b8f8f12a8e6",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "b9bc5c18-a9db-4047-ab5b-ff2bf148ed14",
    "property_id": "781a77cd-a4ff-491b-aa40-a8e889212320",
    "property_name": "성산 오션뷰 호텔",
    "room_type_id": "e9e9a962-c3bb-4ba8-b938-7b704b0b1dbf",
    "room_type_name": "스탠다드",
    "total_rooms": 9,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  },
  {
    "id": "c99554d1-4c6b-468a-b53c-4dfcfbd10ea7",
    "property_id": "781a77cd-a4ff-491b-aa40-a8e889212320",
    "property_name": "성산 오션뷰 호텔",
    "room_type_id": "879cc00f-57d7-4b4a-ac40-aac939f99e73",
    "room_type_name": "디럭스",
    "total_rooms": 4,
    "check_in": "2026-09-03T15:00:00",
    "check_out": "2026-09-04T11:00:00",
    "stay_date": "2026-09-03T00:00:00"
  }
]

export const GEN_ADMIN_ROOM_TYPES = [
  {
    "id": "915cc6b1-d19e-4fc9-a615-b6a59a062b5c",
    "name": "디럭스",
    "property_id": "c64a60ed-729f-4ef4-9969-31b6220a44bb",
    "property_name": "경포 시티뷰 아파트",
    "total_rooms": 8
  },
  {
    "id": "8de2289e-6e24-4658-acc5-7956706e0ed3",
    "name": "스탠다드",
    "property_id": "c64a60ed-729f-4ef4-9969-31b6220a44bb",
    "property_name": "경포 시티뷰 아파트",
    "total_rooms": 6
  },
  {
    "id": "10ba47b0-7920-4ed4-b1c8-9d51c10a9444",
    "name": "디럭스",
    "property_id": "4d57362f-daa0-4abc-abdc-428c4947cf0c",
    "property_name": "경포 정원 단독주택",
    "total_rooms": 6
  },
  {
    "id": "eb356d47-d292-4932-babe-362a66560143",
    "name": "스탠다드",
    "property_id": "4d57362f-daa0-4abc-abdc-428c4947cf0c",
    "property_name": "경포 정원 단독주택",
    "total_rooms": 9
  },
  {
    "id": "f73495c4-5bee-459c-ad17-1dae6068265c",
    "name": "디럭스",
    "property_id": "847e1e84-891a-480b-aa9f-2afb2ca2075e",
    "property_name": "광안리 복층 아파트",
    "total_rooms": 8
  },
  {
    "id": "99d7e42c-64ed-4e11-806a-a58c5360c31e",
    "name": "스탠다드",
    "property_id": "847e1e84-891a-480b-aa9f-2afb2ca2075e",
    "property_name": "광안리 복층 아파트",
    "total_rooms": 9
  },
  {
    "id": "e3bb0fa5-dcf3-4c30-a379-138a03b3db6f",
    "name": "디럭스",
    "property_id": "6c26733c-fdf9-428c-9ae9-ae8940985d69",
    "property_name": "광안리 스위트 호텔",
    "total_rooms": 4
  },
  {
    "id": "421154a7-288f-4c30-9ed4-a52dc3b75054",
    "name": "스탠다드",
    "property_id": "6c26733c-fdf9-428c-9ae9-ae8940985d69",
    "property_name": "광안리 스위트 호텔",
    "total_rooms": 6
  },
  {
    "id": "ddad8f55-a962-41d4-beaa-fb40f3e3965b",
    "name": "디럭스",
    "property_id": "2910a497-ec40-4113-8ede-1cd530dbfba8",
    "property_name": "구좌 정원 단독주택",
    "total_rooms": 8
  },
  {
    "id": "0fbc80f7-bb63-4f0b-a533-7e2a93c98780",
    "name": "스탠다드",
    "property_id": "2910a497-ec40-4113-8ede-1cd530dbfba8",
    "property_name": "구좌 정원 단독주택",
    "total_rooms": 9
  },
  {
    "id": "d933e0fd-fd5a-42ce-b5e4-af0dfe0b5c1f",
    "name": "디럭스",
    "property_id": "bdfbd23e-25cd-4dae-8f96-fdf121d0391d",
    "property_name": "구좌 한옥 단독주택",
    "total_rooms": 4
  },
  {
    "id": "08ce2798-6fd5-4571-8c67-7f54851a8860",
    "name": "스탠다드",
    "property_id": "bdfbd23e-25cd-4dae-8f96-fdf121d0391d",
    "property_name": "구좌 한옥 단독주택",
    "total_rooms": 9
  },
  {
    "id": "4fe54678-edaa-4251-81ac-9756a460eaab",
    "name": "디럭스",
    "property_id": "d5d4689e-2e81-40eb-b15d-b21bd9360888",
    "property_name": "망원 복층 아파트",
    "total_rooms": 4
  },
  {
    "id": "37246ca3-31b6-4dae-a07d-51e0743e9645",
    "name": "스탠다드",
    "property_id": "d5d4689e-2e81-40eb-b15d-b21bd9360888",
    "property_name": "망원 복층 아파트",
    "total_rooms": 6
  },
  {
    "id": "04e3d7fb-447f-4c1b-b830-bd89f57c8fe5",
    "name": "디럭스",
    "property_id": "7c2fd663-3132-4d23-baae-8ea86d0a8195",
    "property_name": "망원 시티 호텔",
    "total_rooms": 6
  },
  {
    "id": "b8421a86-b07d-44c6-a44f-0a0977d3d369",
    "name": "스탠다드",
    "property_id": "7c2fd663-3132-4d23-baae-8ea86d0a8195",
    "property_name": "망원 시티 호텔",
    "total_rooms": 12
  },
  {
    "id": "93da6178-da82-45d7-bab0-85f1361ce70f",
    "name": "디럭스",
    "property_id": "5595dccd-9ac0-4b72-9da9-e1521e81ded4",
    "property_name": "보문 스위트 호텔",
    "total_rooms": 8
  },
  {
    "id": "891d7f96-6ad5-47de-ac12-dbcb370d8e79",
    "name": "스탠다드",
    "property_id": "5595dccd-9ac0-4b72-9da9-e1521e81ded4",
    "property_name": "보문 스위트 호텔",
    "total_rooms": 9
  },
  {
    "id": "5d46da07-12e0-4be6-a51d-a78344d15cf3",
    "name": "디럭스",
    "property_id": "58d20199-7934-4d26-9e16-622e64654b40",
    "property_name": "보문 정원 단독주택",
    "total_rooms": 6
  },
  {
    "id": "c9527f72-3d46-4a93-9664-ce654fc49cb0",
    "name": "스탠다드",
    "property_id": "58d20199-7934-4d26-9e16-622e64654b40",
    "property_name": "보문 정원 단독주택",
    "total_rooms": 12
  },
  {
    "id": "b806579e-8af7-4f5d-8cc4-bdf977248556",
    "name": "디럭스",
    "property_id": "c32d7e5d-cd53-4b7e-9d9d-5b003b3c5f91",
    "property_name": "불국사 북카페 게스트하우스",
    "total_rooms": 6
  },
  {
    "id": "5b86074e-ff8e-4d51-be28-81f8a520936b",
    "name": "스탠다드",
    "property_id": "c32d7e5d-cd53-4b7e-9d9d-5b003b3c5f91",
    "property_name": "불국사 북카페 게스트하우스",
    "total_rooms": 9
  },
  {
    "id": "ef4529f3-20cc-4742-96d8-311dca0deb8b",
    "name": "디럭스",
    "property_id": "3dfdc73d-2947-4e72-9089-b069d4cf6717",
    "property_name": "사천 독채 펜션",
    "total_rooms": 4
  },
  {
    "id": "1c55e973-0f9a-4130-99bd-bbbd0e410122",
    "name": "스탠다드",
    "property_id": "3dfdc73d-2947-4e72-9089-b069d4cf6717",
    "property_name": "사천 독채 펜션",
    "total_rooms": 9
  },
  {
    "id": "26ac1f1b-6e17-4e31-a05b-125cd2b25be6",
    "name": "디럭스",
    "property_id": "3a1d98b7-fa57-44e7-a2ef-e0e571d7af47",
    "property_name": "서촌 독채 펜션",
    "total_rooms": 6
  },
  {
    "id": "d3dabddc-debe-44df-a72b-8bb6a2b8e871",
    "name": "스탠다드",
    "property_id": "3a1d98b7-fa57-44e7-a2ef-e0e571d7af47",
    "property_name": "서촌 독채 펜션",
    "total_rooms": 12
  },
  {
    "id": "c60c395d-68e9-468c-a23c-eeee9eb16008",
    "name": "디럭스",
    "property_id": "175c8523-6df6-4dd6-b936-e0da28085f5c",
    "property_name": "서촌 한옥 단독주택",
    "total_rooms": 8
  },
  {
    "id": "4f4f1c77-e3b4-4c8a-937e-62f0b18f2ffe",
    "name": "스탠다드",
    "property_id": "175c8523-6df6-4dd6-b936-e0da28085f5c",
    "property_name": "서촌 한옥 단독주택",
    "total_rooms": 12
  },
  {
    "id": "72271be4-6d23-4578-a254-11d9e396eb91",
    "name": "디럭스",
    "property_id": "8d69706b-2a48-4da7-b36c-5cffd2117752",
    "property_name": "성산 스위트 호텔",
    "total_rooms": 8
  },
  {
    "id": "7a9878eb-dd72-4325-b1e6-aa71c8bd935a",
    "name": "스탠다드",
    "property_id": "8d69706b-2a48-4da7-b36c-5cffd2117752",
    "property_name": "성산 스위트 호텔",
    "total_rooms": 9
  },
  {
    "id": "879cc00f-57d7-4b4a-ac40-aac939f99e73",
    "name": "디럭스",
    "property_id": "781a77cd-a4ff-491b-aa40-a8e889212320",
    "property_name": "성산 오션뷰 호텔",
    "total_rooms": 4
  },
  {
    "id": "e9e9a962-c3bb-4ba8-b938-7b704b0b1dbf",
    "name": "스탠다드",
    "property_id": "781a77cd-a4ff-491b-aa40-a8e889212320",
    "property_name": "성산 오션뷰 호텔",
    "total_rooms": 9
  },
  {
    "id": "c5afedcc-0da4-4781-b84c-aaee74a884ad",
    "name": "디럭스",
    "property_id": "c9c314ca-59d1-4431-8a50-5565a05f08fd",
    "property_name": "성수 라운지 게스트하우스",
    "total_rooms": 4
  },
  {
    "id": "0aa4d0ac-3a83-4e72-979f-e336719724b0",
    "name": "스탠다드",
    "property_id": "c9c314ca-59d1-4431-8a50-5565a05f08fd",
    "property_name": "성수 라운지 게스트하우스",
    "total_rooms": 6
  },
  {
    "id": "9c646b05-054b-42cf-afc4-26be71126591",
    "name": "디럭스",
    "property_id": "609c92ab-b68a-458b-8914-d1097241046b",
    "property_name": "성수 스위트 호텔",
    "total_rooms": 6
  },
  {
    "id": "63b04e40-fd63-4eb1-871f-05ecd0d96c9d",
    "name": "스탠다드",
    "property_id": "609c92ab-b68a-458b-8914-d1097241046b",
    "property_name": "성수 스위트 호텔",
    "total_rooms": 9
  },
  {
    "id": "5029b7c5-5356-454a-889c-c7a3bf1cbc9f",
    "name": "디럭스",
    "property_id": "95686545-3f24-403a-beb7-427bf8b936e1",
    "property_name": "송정 북카페 게스트하우스",
    "total_rooms": 4
  },
  {
    "id": "b0935f5a-936a-4b3e-aa7e-d90e03f5bdc3",
    "name": "스탠다드",
    "property_id": "95686545-3f24-403a-beb7-427bf8b936e1",
    "property_name": "송정 북카페 게스트하우스",
    "total_rooms": 9
  },
  {
    "id": "b5abe26b-ec90-4114-b38e-b52e674b2ce5",
    "name": "디럭스",
    "property_id": "f02ef597-ef69-419f-ae97-e973138ade65",
    "property_name": "송정 오션뷰 호텔",
    "total_rooms": 4
  },
  {
    "id": "fff9f343-f091-4e67-bf1e-bd7b0fc3de55",
    "name": "스탠다드",
    "property_id": "f02ef597-ef69-419f-ae97-e973138ade65",
    "property_name": "송정 오션뷰 호텔",
    "total_rooms": 6
  },
  {
    "id": "127bdbd9-7739-455b-9571-47cc2bd14980",
    "name": "디럭스",
    "property_id": "be5ea5b9-a264-4410-9af7-2b31f616c7ca",
    "property_name": "안목 복층 아파트",
    "total_rooms": 8
  },
  {
    "id": "c1b95915-9394-4c50-902c-e412075f01b2",
    "name": "스탠다드",
    "property_id": "be5ea5b9-a264-4410-9af7-2b31f616c7ca",
    "property_name": "안목 복층 아파트",
    "total_rooms": 12
  },
  {
    "id": "a786ccf3-c2ef-4989-b26b-63a01d5f5561",
    "name": "디럭스",
    "property_id": "cec5f56d-624b-4c3a-8ec4-23959ccdba8b",
    "property_name": "안목 스위트 호텔",
    "total_rooms": 4
  },
  {
    "id": "65a218a5-9d1b-413a-9bbf-4ea93fc68768",
    "name": "스탠다드",
    "property_id": "cec5f56d-624b-4c3a-8ec4-23959ccdba8b",
    "property_name": "안목 스위트 호텔",
    "total_rooms": 9
  },
  {
    "id": "67e5851d-de1e-450e-bc88-1b8f8f12a8e6",
    "name": "디럭스",
    "property_id": "0e3b4cb4-c97f-4995-884a-f782f3c00bc1",
    "property_name": "애월 복층 아파트",
    "total_rooms": 4
  },
  {
    "id": "487a97e0-e9c2-40ce-b8c3-861fee47adf9",
    "name": "스탠다드",
    "property_id": "0e3b4cb4-c97f-4995-884a-f782f3c00bc1",
    "property_name": "애월 복층 아파트",
    "total_rooms": 9
  },
  {
    "id": "dc582355-c3c2-4b84-a1ed-d45d47ba808a",
    "name": "디럭스",
    "property_id": "c497b765-a58d-4b7c-88b5-3fd7fd7fd1d5",
    "property_name": "애월 시티뷰 아파트",
    "total_rooms": 6
  },
  {
    "id": "74406ec7-3fd3-40ee-bb01-94f9e4b2775c",
    "name": "스탠다드",
    "property_id": "c497b765-a58d-4b7c-88b5-3fd7fd7fd1d5",
    "property_name": "애월 시티뷰 아파트",
    "total_rooms": 6
  },
  {
    "id": "5fcf38df-f38d-412d-93a1-eb48eb8f0ee6",
    "name": "디럭스",
    "property_id": "4a10a306-f183-4c6f-a4cd-6cbdb4b87706",
    "property_name": "연남 시티뷰 아파트",
    "total_rooms": 6
  },
  {
    "id": "6f6340d2-ab1d-4599-ac06-bc99429dca16",
    "name": "스탠다드",
    "property_id": "4a10a306-f183-4c6f-a4cd-6cbdb4b87706",
    "property_name": "연남 시티뷰 아파트",
    "total_rooms": 9
  },
  {
    "id": "cca8ed15-44cb-41ef-9892-65c80f43fd78",
    "name": "디럭스",
    "property_id": "e37a48b9-35a2-4122-97d0-e552cd290ff4",
    "property_name": "연남 오션뷰 호텔",
    "total_rooms": 6
  },
  {
    "id": "ebece0f4-b568-43b9-8283-d7f9a9c7800d",
    "name": "스탠다드",
    "property_id": "e37a48b9-35a2-4122-97d0-e552cd290ff4",
    "property_name": "연남 오션뷰 호텔",
    "total_rooms": 6
  },
  {
    "id": "7a99b929-29c9-47e6-9218-87c60d7996f5",
    "name": "디럭스",
    "property_id": "dbf319e5-60da-4301-a631-3cb365602093",
    "property_name": "영도 독채 펜션",
    "total_rooms": 6
  },
  {
    "id": "82d65416-adce-40a6-9317-c8b58b19746e",
    "name": "스탠다드",
    "property_id": "dbf319e5-60da-4301-a631-3cb365602093",
    "property_name": "영도 독채 펜션",
    "total_rooms": 6
  },
  {
    "id": "42e073bc-e212-4ef7-8bcc-2badc832902c",
    "name": "디럭스",
    "property_id": "9885bdc9-5629-46ba-92a3-e7905efe922a",
    "property_name": "영도 라운지 게스트하우스",
    "total_rooms": 6
  },
  {
    "id": "77c33dd0-1603-4d89-b9b4-84bb284134fd",
    "name": "스탠다드",
    "property_id": "9885bdc9-5629-46ba-92a3-e7905efe922a",
    "property_name": "영도 라운지 게스트하우스",
    "total_rooms": 6
  },
  {
    "id": "5f32049d-5feb-4196-835d-52e1a6dd3aa2",
    "name": "디럭스",
    "property_id": "3b24489d-04e0-4c20-94ec-8fbcf469cd77",
    "property_name": "익선동 바비큐 펜션",
    "total_rooms": 4
  },
  {
    "id": "a467658c-fde1-49ab-b62a-8dd55382f41a",
    "name": "스탠다드",
    "property_id": "3b24489d-04e0-4c20-94ec-8fbcf469cd77",
    "property_name": "익선동 바비큐 펜션",
    "total_rooms": 9
  },
  {
    "id": "72adae4c-841b-47d0-b4a9-04725124fb15",
    "name": "디럭스",
    "property_id": "7b4ae7bd-8f6b-43c6-8f41-2d59ce63413f",
    "property_name": "익선동 북카페 게스트하우스",
    "total_rooms": 4
  },
  {
    "id": "5db4b4c2-b82b-4d06-990b-c6d3d6202336",
    "name": "스탠다드",
    "property_id": "7b4ae7bd-8f6b-43c6-8f41-2d59ce63413f",
    "property_name": "익선동 북카페 게스트하우스",
    "total_rooms": 12
  },
  {
    "id": "12934d2d-9095-4e0c-8ac2-81d31aedb6a9",
    "name": "디럭스",
    "property_id": "8a4c7499-5cfb-4e1e-9147-a1d22b2b3751",
    "property_name": "주문진 북카페 게스트하우스",
    "total_rooms": 4
  },
  {
    "id": "65404a84-3401-4294-ac12-5840a91c07e7",
    "name": "스탠다드",
    "property_id": "8a4c7499-5cfb-4e1e-9147-a1d22b2b3751",
    "property_name": "주문진 북카페 게스트하우스",
    "total_rooms": 12
  },
  {
    "id": "e48ff508-0219-4c7a-ae0f-3941509303e0",
    "name": "디럭스",
    "property_id": "22c4abf9-9170-473c-bb3f-b3b07ec7fe2b",
    "property_name": "표선 독채 펜션",
    "total_rooms": 8
  },
  {
    "id": "d14f2e3b-c980-470a-a260-6adb7ef724f7",
    "name": "스탠다드",
    "property_id": "22c4abf9-9170-473c-bb3f-b3b07ec7fe2b",
    "property_name": "표선 독채 펜션",
    "total_rooms": 12
  },
  {
    "id": "509002e6-61a4-4b6f-83dc-2fa1ddfb9d05",
    "name": "디럭스",
    "property_id": "e5e53825-212f-4102-bda6-7bc249808d3b",
    "property_name": "표선 바비큐 펜션",
    "total_rooms": 4
  },
  {
    "id": "01ff72ee-7bf8-42c6-821f-3bc1f9080d73",
    "name": "스탠다드",
    "property_id": "e5e53825-212f-4102-bda6-7bc249808d3b",
    "property_name": "표선 바비큐 펜션",
    "total_rooms": 6
  },
  {
    "id": "c2e24608-5288-43fb-8a74-01f6643732cc",
    "name": "디럭스",
    "property_id": "8389f89b-c35a-498a-a487-4b4cc01118b2",
    "property_name": "한남 루프탑 아파트",
    "total_rooms": 6
  },
  {
    "id": "cece2850-db17-4364-b515-1b8a57d61e84",
    "name": "스탠다드",
    "property_id": "8389f89b-c35a-498a-a487-4b4cc01118b2",
    "property_name": "한남 루프탑 아파트",
    "total_rooms": 6
  },
  {
    "id": "ba623477-c7e2-4be8-89a4-ac0040e1fa4b",
    "name": "디럭스",
    "property_id": "40e80ec8-e562-4176-ad9a-056fadbc4166",
    "property_name": "한남 정원 단독주택",
    "total_rooms": 6
  },
  {
    "id": "0b528972-fb89-4219-9202-e42be73def30",
    "name": "스탠다드",
    "property_id": "40e80ec8-e562-4176-ad9a-056fadbc4166",
    "property_name": "한남 정원 단독주택",
    "total_rooms": 9
  },
  {
    "id": "01a773bc-9ca2-4a17-b5b2-bb330c26c4ca",
    "name": "디럭스",
    "property_id": "ef840de9-a3f9-4bec-9998-252c665b4312",
    "property_name": "한림 라운지 게스트하우스",
    "total_rooms": 4
  },
  {
    "id": "ffc41e19-98dd-49bd-90e3-de1495240377",
    "name": "스탠다드",
    "property_id": "ef840de9-a3f9-4bec-9998-252c665b4312",
    "property_name": "한림 라운지 게스트하우스",
    "total_rooms": 6
  },
  {
    "id": "15ec50c3-4610-4661-82be-c08db428413c",
    "name": "디럭스",
    "property_id": "acfd86a2-86bb-46f3-bf01-defe504e3cad",
    "property_name": "한림 북카페 게스트하우스",
    "total_rooms": 8
  },
  {
    "id": "e7cd5974-c87b-4972-8895-70daf48e6a0e",
    "name": "스탠다드",
    "property_id": "acfd86a2-86bb-46f3-bf01-defe504e3cad",
    "property_name": "한림 북카페 게스트하우스",
    "total_rooms": 12
  },
  {
    "id": "ce000fd4-5655-40a8-95ee-f1cc2d0cae2e",
    "name": "디럭스",
    "property_id": "19a4a8e4-d7f7-412e-b305-676a50475fb1",
    "property_name": "해운대 시티뷰 아파트",
    "total_rooms": 6
  },
  {
    "id": "0509e307-9b34-4035-8ced-a68c4364273d",
    "name": "스탠다드",
    "property_id": "19a4a8e4-d7f7-412e-b305-676a50475fb1",
    "property_name": "해운대 시티뷰 아파트",
    "total_rooms": 12
  },
  {
    "id": "00681957-33a5-417e-9621-c79850d16fc5",
    "name": "디럭스",
    "property_id": "041f39e6-0d4d-4a82-838b-eebdd55b04ac",
    "property_name": "해운대 정원 단독주택",
    "total_rooms": 4
  },
  {
    "id": "48a1fdb5-7843-4d45-8f05-ccad2952381f",
    "name": "스탠다드",
    "property_id": "041f39e6-0d4d-4a82-838b-eebdd55b04ac",
    "property_name": "해운대 정원 단독주택",
    "total_rooms": 6
  },
  {
    "id": "c53db1c9-05ab-43a3-a8a5-d87ceb2c16f4",
    "name": "디럭스",
    "property_id": "6cf90d98-29ef-4ee0-88c2-08a3e482917b",
    "property_name": "황리단길 독채 펜션",
    "total_rooms": 8
  },
  {
    "id": "2ef3fec9-7e81-4e76-a05a-a9033bbbe3e6",
    "name": "스탠다드",
    "property_id": "6cf90d98-29ef-4ee0-88c2-08a3e482917b",
    "property_name": "황리단길 독채 펜션",
    "total_rooms": 9
  },
  {
    "id": "39aad9f8-5ff5-40c4-b321-4a6692fd5458",
    "name": "디럭스",
    "property_id": "f783a07b-4e2c-467c-a318-5283447b41ba",
    "property_name": "황리단길 시티뷰 아파트",
    "total_rooms": 8
  },
  {
    "id": "656c1cef-763d-4442-8f1d-b9e34a125e28",
    "name": "스탠다드",
    "property_id": "f783a07b-4e2c-467c-a318-5283447b41ba",
    "property_name": "황리단길 시티뷰 아파트",
    "total_rooms": 9
  }
]

export const GEN_ADMIN_REFUNDS = []

export const GEN_ADMIN_PEAK_DATES = [
  {
    "id": "3550a7f0-5045-49b8-86c5-a1c95afbd433",
    "date": "2026-07-25",
    "name": "여름 성수기",
    "extra_charge": 30000,
    "description": "여름 성수기 요금이 적용된다"
  },
  {
    "id": "8ee13964-7a38-49e8-afd7-c895b913ed31",
    "date": "2026-08-01",
    "name": "여름 성수기",
    "extra_charge": 30000,
    "description": "여름 성수기 요금이 적용된다"
  },
  {
    "id": "2e3d7ede-8361-47be-a244-d8a3f37afcb1",
    "date": "2026-08-15",
    "name": "광복절 연휴",
    "extra_charge": 30000,
    "description": "광복절 연휴 요금이 적용된다"
  },
  {
    "id": "cfb4eda1-4409-4074-bd03-23f3deab929d",
    "date": "2026-10-03",
    "name": "개천절 연휴",
    "extra_charge": 30000,
    "description": "개천절 연휴 요금이 적용된다"
  },
  {
    "id": "094345fb-4ab3-4622-8fa1-66736b987e45",
    "date": "2026-12-25",
    "name": "크리스마스",
    "extra_charge": 30000,
    "description": "크리스마스 요금이 적용된다"
  },
  {
    "id": "3e675a80-72a6-44be-9005-83e9b3bc0d18",
    "date": "2026-12-31",
    "name": "연말",
    "extra_charge": 30000,
    "description": "연말 요금이 적용된다"
  }
]

export const GEN_ADMIN_COUPONS = []

export const GEN_ADMIN_REVIEWS = []

export const GEN_ADMIN_BOARD_TYPES = [
  {
    "id": "fe85de7a-2398-4700-bc61-35b0978234bf",
    "code": "BREAKFAST",
    "name": "조식 포함",
    "extra_charge": 18000,
    "description": "1박당 조식 1회가 포함된다"
  },
  {
    "id": "b296b22c-a20a-4287-98ef-da536bfa283c",
    "code": "HALF_BOARD",
    "name": "조식·석식 포함",
    "extra_charge": 42000,
    "description": "1박당 조식과 석식이 포함된다"
  },
  {
    "id": "6f951857-121b-4c6c-940c-be74ec0fc98f",
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
    "id": "37e11fa3-a91c-49f8-ab4d-cd3e9f2bf134",
    "name": "강문 오션 펜션",
    "region": "강릉",
    "area": "강문",
    "property_type": "PENSION",
    "capacity": 4,
    "rating": 4.6,
    "contactable": true,
    "has_open_opportunity": true
  },
  {
    "id": "d16f6e3d-78c2-44da-9436-80e138c0e531",
    "name": "사천 솔밭 단독주택",
    "region": "강릉",
    "area": "사천",
    "property_type": "HOUSE",
    "capacity": 6,
    "rating": 4.1,
    "contactable": true,
    "has_open_opportunity": true
  },
  {
    "id": "e6d76d70-8859-4e63-acbc-f295e97b9eab",
    "name": "보문 한옥채",
    "region": "경주",
    "area": "보문",
    "property_type": "HOUSE",
    "capacity": 4,
    "rating": 4.8,
    "contactable": true,
    "has_open_opportunity": true
  },
  {
    "id": "8931e7d6-49d4-4045-bbe8-78352434f19b",
    "name": "불국사 앞 게스트하우스",
    "region": "경주",
    "area": "불국사",
    "property_type": "GUESTHOUSE",
    "capacity": 12,
    "rating": 4,
    "contactable": true,
    "has_open_opportunity": true
  },
  {
    "id": "21fe5776-15d3-4ea0-9837-3fde52edb63d",
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
    "id": "6513cecf-f975-4c93-adc9-09224e5d108e",
    "name": "망원 골목 아파트",
    "region": "서울",
    "area": "망원",
    "property_type": "APARTMENT",
    "capacity": 2,
    "rating": 4.5,
    "contactable": true,
    "has_open_opportunity": true
  },
  {
    "id": "10734f35-c8f9-44aa-9724-56fe979b4d3d",
    "name": "안덕 바다뷰 펜션",
    "region": "제주",
    "area": "안덕",
    "property_type": "PENSION",
    "capacity": 6,
    "rating": 4.4,
    "contactable": true,
    "has_open_opportunity": true
  },
  {
    "id": "4d2a1796-4312-48c1-bdd3-d760d8661c35",
    "name": "조천 돌담 독채",
    "region": "제주",
    "area": "조천",
    "property_type": "PENSION",
    "capacity": 4,
    "rating": 4.7,
    "contactable": true,
    "has_open_opportunity": true
  },
  {
    "id": "8d042c3c-8538-48cb-ad1b-2728ee0bd19d",
    "name": "표선 정원 단독주택",
    "region": "제주",
    "area": "표선",
    "property_type": "HOUSE",
    "capacity": 8,
    "rating": 4.2,
    "contactable": true,
    "has_open_opportunity": true
  },
  {
    "id": "ee88162e-2036-4fe4-8658-cd58b05e8331",
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
    "id": "96a1da2d-401b-42d1-bf05-809b0f15c2fc",
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
    "id": "c25af541-7498-4d93-a79c-67b2c8876e92",
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
    "id": "7f8fe315-0061-42c8-bc00-54849bd34dbf",
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
    "id": "82175c59-d8ba-40ae-9b11-9daeb662ab07",
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
    "id": "aff7d6ea-804c-4a2d-a99c-33f0c2553fbb",
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
    "id": "8d677b9a-fab1-415b-87df-b0745205cf9b",
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
    "id": "8fabd892-ac7a-49e8-a4e9-85e1ea761d96",
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
  "96a1da2d-401b-42d1-bf05-809b0f15c2fc": {
    "id": "96a1da2d-401b-42d1-bf05-809b0f15c2fc",
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
      "id": "4d2a1796-4312-48c1-bdd3-d760d8661c35",
      "name": "조천 돌담 독채",
      "area": "조천",
      "capacity": 4,
      "rating": 4.7,
      "contact_email": "jocheon@example.com",
      "contact_phone": "064-100-0001",
      "source": "seed"
    }
  },
  "c25af541-7498-4d93-a79c-67b2c8876e92": {
    "id": "c25af541-7498-4d93-a79c-67b2c8876e92",
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
      "id": "10734f35-c8f9-44aa-9724-56fe979b4d3d",
      "name": "안덕 바다뷰 펜션",
      "area": "안덕",
      "capacity": 6,
      "rating": 4.4,
      "contact_email": "andeok@example.com",
      "contact_phone": null,
      "source": "seed"
    }
  },
  "7f8fe315-0061-42c8-bc00-54849bd34dbf": {
    "id": "7f8fe315-0061-42c8-bc00-54849bd34dbf",
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
      "id": "6513cecf-f975-4c93-adc9-09224e5d108e",
      "name": "망원 골목 아파트",
      "area": "망원",
      "capacity": 2,
      "rating": 4.5,
      "contact_email": "mangwon@example.com",
      "contact_phone": null,
      "source": "seed"
    }
  },
  "82175c59-d8ba-40ae-9b11-9daeb662ab07": {
    "id": "82175c59-d8ba-40ae-9b11-9daeb662ab07",
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
      "id": "d16f6e3d-78c2-44da-9436-80e138c0e531",
      "name": "사천 솔밭 단독주택",
      "area": "사천",
      "capacity": 6,
      "rating": 4.1,
      "contact_email": "sacheon@example.com",
      "contact_phone": null,
      "source": "seed"
    }
  },
  "aff7d6ea-804c-4a2d-a99c-33f0c2553fbb": {
    "id": "aff7d6ea-804c-4a2d-a99c-33f0c2553fbb",
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
      "id": "8d042c3c-8538-48cb-ad1b-2728ee0bd19d",
      "name": "표선 정원 단독주택",
      "area": "표선",
      "capacity": 8,
      "rating": 4.2,
      "contact_email": "pyoseon@example.com",
      "contact_phone": null,
      "source": "seed"
    }
  },
  "8d677b9a-fab1-415b-87df-b0745205cf9b": {
    "id": "8d677b9a-fab1-415b-87df-b0745205cf9b",
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
      "id": "e6d76d70-8859-4e63-acbc-f295e97b9eab",
      "name": "보문 한옥채",
      "area": "보문",
      "capacity": 4,
      "rating": 4.8,
      "contact_email": "bomun@example.com",
      "contact_phone": "054-100-0002",
      "source": "seed"
    }
  },
  "8fabd892-ac7a-49e8-a4e9-85e1ea761d96": {
    "id": "8fabd892-ac7a-49e8-a4e9-85e1ea761d96",
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
      "id": "8931e7d6-49d4-4045-bbe8-78352434f19b",
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
      "id": "37e11fa3-a91c-49f8-ab4d-cd3e9f2bf134",
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
