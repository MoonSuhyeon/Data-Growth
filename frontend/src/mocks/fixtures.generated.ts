/* 이 파일은 `scripts/gen-fixtures.mjs` 가 만든다. **손으로 고치지 않는다.**
 *
 * 실제 서비스 응답을 그대로 받아 적은 것이라 모양과 분량이 실물과 같다.
 * 고칠 것이 있으면 시드나 서비스를 고치고 다시 뽑는다.
 *
 *     node scripts/gen-fixtures.mjs
 *
 * 생성 시각: 2026-08-31T12:04:02.462Z
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
    "has_open_opportunity": false
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
    "has_open_opportunity": false
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
    "has_open_opportunity": false
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
    "has_open_opportunity": false
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
    "has_open_opportunity": false
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
    "has_open_opportunity": false
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
    "has_open_opportunity": false
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
    "has_open_opportunity": false
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
