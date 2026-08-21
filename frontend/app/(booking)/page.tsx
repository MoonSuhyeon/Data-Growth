'use client'

import { Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { addWishlist, getMyWishlist, getProperties, removeWishlist } from '@/api/properties'
import { SHELL } from '@/components/Navbar'
import { useAuthStore } from '@/store/authStore'
import type { Property } from '@/types'

const PROPERTY_TYPE_LABEL: Record<Property['property_type'], string> = {
  APARTMENT: '아파트',
  HOTEL: '호텔',
  GUESTHOUSE: '게스트하우스',
  PENSION: '펜션',
  HOUSE: '단독주택',
}

const TYPE_ORDER: Property['property_type'][] = [
  'HOTEL', 'PENSION', 'APARTMENT', 'HOUSE', 'GUESTHOUSE',
]

/* ═══════════════════════════════════════════════════════════ 카테고리 칩 */

/**
 * 필터 칩 — **글자만.**
 *
 * 지역·유형마다 대표 사진을 넣어 봤는데, 목록 바로 위에 작은 사진이 열한 개
 * 깔리니 아래 카드의 사진과 경쟁했다. 이 줄이 할 일은 "무엇으로 거를까" 를
 * 고르게 하는 것이지 구경거리를 하나 더 만드는 것이 아니다.
 *
 * 선택 표시도 검정 채움을 버렸다. 화이트 바탕에 검은 덩어리가 하나 있으면 그
 * 자리로 시선이 묶여서, 정작 봐야 할 목록이 뒤로 밀린다. **골드 테두리와 옅은
 * 골드 바탕**으로 바꾼다 — 브랜드 색이고, 면적이 작아 답답하지 않다.
 */
function CategoryChip({
  label, active, onClick,
}: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`shrink-0 px-4 py-2.5 rounded-full border transition-colors text-[14px] leading-[1.45] tracking-[0.01em] whitespace-nowrap ${
        active
          ? 'bg-gold-50 border-gold-500 text-gold-800 font-semibold'
          : 'bg-white border-line text-ink-soft font-normal hover:border-ink/30 hover:text-ink'
      }`}
    >
      {label}
    </button>
  )
}

/* ═══════════════════════════════════════════════════════════ 카드 */

function PropertyCard({
  property, saved, onToggleSave,
}: {
  property: Property
  saved: boolean
  onToggleSave: (id: string) => void
}) {
  return (
    <Link href={`/properties/${property.id}`} className="group block">
      <div className="aspect-[4/3] rounded-2xl overflow-hidden relative bg-mist shadow-sm group-hover:shadow-lg transition-shadow duration-300">
        {property.photo_url ? (
          <img
            src={property.photo_url}
            alt=""
            className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gold-300 gap-2.5">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h3v-6h6v6h3a1 1 0 001-1V10" />
            </svg>
            <span className="text-[12px] leading-[1.5] tracking-wide">준비 중인 사진</span>
          </div>
        )}

        {/* 뱃지. **카드 안쪽으로 12px 들여 놓고 z-index 를 준다** — 모서리에
            붙이면 둥근 모서리에 잘리고, 확대되는 사진 밑에 깔려 사라진다. */}
        {/* 7열에서는 카드 폭이 200px 남짓이라, 뱃지가 길면 하트 밑으로 들어간다.
            하트 자리(약 3rem)를 빼고 남는 만큼만 쓰게 하고 넘치면 자른다. */}
        {/* W컨셉의 브랜드 워터마크를 따른다 — **반투명으로 사진 위에 얹는다.**
            불투명한 알약은 사진을 가리고, 카드 하나에 흰 덩어리가 둘(뱃지·하트)
            생겨 어수선하다. */}
        <span className="absolute top-3 left-3 z-10 max-w-[calc(100%-3.5rem)] truncate text-[12px] leading-[1.5] font-medium px-2.5 py-1 rounded-md bg-charcoal/45 text-white backdrop-blur-[2px]">
          {PROPERTY_TYPE_LABEL[property.property_type]}
        </span>

        {/* 저장 하트. **장식이 아니라 실제로 위시리스트에 넣는다** — 눌러도
            아무 일이 없는 하트는 이 화면에서 걷어낸 죽은 버튼과 같은 잘못이다. */}
        <button
          onClick={(e) => {
            // 카드 전체가 링크라, 막지 않으면 하트를 눌러도 상세로 넘어간다.
            e.preventDefault()
            e.stopPropagation()
            onToggleSave(property.id)
          }}
          aria-label={saved ? '저장 취소' : '저장'}
          aria-pressed={saved}
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/95 backdrop-blur-sm shadow-sm grid place-items-center transition-transform duration-200 hover:scale-110 active:scale-95"
        >
          <svg
            viewBox="0 0 24 24"
            className="w-[19px] h-[19px]"
            fill={saved ? '#7A1B2E' : 'none'}
            stroke={saved ? '#7A1B2E' : '#5C544A'}
            strokeWidth={1.8}
          >
            <path d="M12 21s-7.5-4.7-9.5-9A5.2 5.2 0 0 1 12 6.2 5.2 5.2 0 0 1 21.5 12c-2 4.3-9.5 9-9.5 9z" />
          </svg>
        </button>
      </div>

      {/* 카드 본문. `line-clamp` 로 이름을 한 줄에 가둔다 — 두 줄이 되면 밑의
          지역·인원이 밀려 카드마다 높이가 달라지고 그리드가 어긋난다. */}
      {/* 7열에서 카드 폭이 200px 남짓이 된다. 숙소명과 평점을 한 줄에 두면
          이름이 두세 글자만 남으므로, **이름을 두 줄까지 허용하고 평점은
          아래로 내린다.** `line-clamp-2` 로 세 줄이 되는 것은 막는다 — 카드마다
          높이가 달라지면 그리드가 어긋난다. */}
      <div className="pt-3.5">
        <p className="font-bold text-ink text-[15px] leading-[1.45] line-clamp-2 min-h-[2.9em] group-hover:text-gold-700 transition-colors">
          {property.name}
        </p>
        <div className="flex items-center gap-2 mt-1.5 text-[13px] leading-[1.55]">
          <span className="truncate font-normal text-ink-faint">{property.region}</span>
          {property.avg_rating != null && (
            /* W컨셉이 할인율을 포인트컬러 볼드로 쓰는 자리다. 이 서비스의 카드에는
               가격이 없으므로 **평점**이 그 자리를 대신한다. */
            <span className="flex items-center gap-0.5 shrink-0 ml-auto font-bold text-gold-600">
              <span className="leading-none">★</span>
              {Number(property.avg_rating).toFixed(1)}
            </span>
          )}
        </div>
        <p className="text-ink-faint text-[13px] leading-[1.55]">최대 {property.max_guests}명</p>
      </div>
    </Link>
  )
}

/* ═══════════════════════════════════════════════════════════ 화면 */

function HomeInner() {
  const router = useRouter()
  const params = useSearchParams()
  const { user } = useAuthStore()

  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)
  const [saved, setSaved] = useState<Set<string>>(new Set())

  const [query, setQuery] = useState('')
  const [region, setRegion] = useState<string | null>(null)
  const [type, setType] = useState<Property['property_type'] | null>(null)

  useEffect(() => {
    getProperties('LISTED')
      .then((res) => setProperties(res.data))
      .catch(() => setFailed(true))
      .finally(() => setLoading(false))
  }, [])

  // 저장 목록은 **한 번에** 받는다. 카드마다 `checkWishlist` 를 부르면 숙소가
  // 40개일 때 요청이 40개 나간다.
  useEffect(() => {
    if (!user) { setSaved(new Set()); return }
    getMyWishlist()
      .then((res) => setSaved(new Set(res.data.map((w) => w.property_id))))
      .catch(() => {})
  }, [user])

  const toggleSave = useCallback((id: string) => {
    if (!user) { router.push('/login'); return }

    const wasSaved = saved.has(id)
    // 낙관적으로 먼저 바꾼다. 하트는 누른 즉시 반응해야 하고, 실패는 드물다.
    setSaved((prev) => {
      const next = new Set(prev)
      if (wasSaved) next.delete(id); else next.add(id)
      return next
    })

    const call = wasSaved ? removeWishlist(id) : addWishlist(id)
    call.catch(() => {
      // 실패하면 **되돌린다.** 안 되돌리면 화면은 저장됐다고 하는데 서버에는
      // 없어서, 다음에 들어오면 하트가 조용히 풀려 있다.
      setSaved((prev) => {
        const next = new Set(prev)
        if (wasSaved) next.add(id); else next.delete(id)
        return next
      })
    })
  }, [user, saved, router])

  // 지역은 고정 목록이 아니라 **데이터에서 뽑는다.** 손으로 적어 두면 숙소가
  // 없는 지역이 탭으로 남아, 눌러도 빈 화면이 나온다.
  const regions = useMemo(
    () => [...new Set(properties.map((p) => p.region))].sort((a, b) => a.localeCompare(b, 'ko')),
    [properties],
  )
  const types = useMemo(() => {
    const present = new Set(properties.map((p) => p.property_type))
    return TYPE_ORDER.filter((t) => present.has(t))
  }, [properties])

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return properties.filter((p) => {
      if (region && p.region !== region) return false
      if (type && p.property_type !== type) return false
      if (!q) return true
      return (
        p.name.toLowerCase().includes(q) ||
        p.region.toLowerCase().includes(q) ||
        (p.address ?? '').toLowerCase().includes(q)
      )
    })
  }, [properties, query, region, type])

  const filtering = Boolean(query.trim() || region || type)
  const reset = () => { setQuery(''); setRegion(null); setType(null) }

  return (
    <main className="flex-1">
      {/* ═══════════════════════ 검색바 — 떠 있는 알약
           히어로는 지웠다. 사진 위에 글자를 얹으면 밝기에 따라 읽히지 않고,
           그 문제를 오버레이로 덮으면 사진이 안 보인다. 목록을 한 화면이라도
           빨리 보여 주는 편이 이 서비스에서는 낫다. */}
      <section className="bg-canvas pt-7 pb-6">
        <div className={SHELL}>
          {/* 테두리를 뺐다. 화이트 바탕에서는 선과 그림자를 같이 쓰면 윤곽이 두 겹으로
              보인다 — 떠 있는 느낌은 그림자 하나로 충분하다. */}
          <div className="mx-auto max-w-[860px] bg-white rounded-full shadow-[0_2px_16px_rgba(32,28,24,0.10)] hover:shadow-[0_6px_28px_rgba(32,28,24,0.16)] transition-shadow flex items-stretch">
            {/* 여행지 — **실제로 거르는 유일한 칸이다.** */}
            <label className="flex-[1.3] flex flex-col justify-center pl-9 pr-6 py-4 rounded-l-full hover:bg-mist transition-colors cursor-text">
              <span className="text-[13px] leading-[1.5] font-semibold text-ink">여행지</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="여행지 검색"
                aria-label="여행지 검색"
                className="text-[14px] leading-[1.5] bg-transparent outline-none placeholder:text-ink-faint mt-1 w-full"
              />
            </label>

            <span className="w-px bg-line my-3.5 shrink-0" aria-hidden />

            {/* 날짜 · 게스트
                문구는 에어비앤비를 따라 "날짜 추가" 로 둔다. 다만 **버튼이
                아니라 안내다** — 이 서비스는 날짜와 인원을 숙소 상세에서
                고르는 구조이고, 여기서 받으면 두 곳이 어긋난다. 누를 수 있게
                생기면 안 되므로 `button` 이 아니라 글자로 둔다. */}
            <div className="hidden sm:flex flex-1 flex-col justify-center px-6 py-4">
              <span className="text-[13px] leading-[1.5] font-semibold text-ink">날짜</span>
              <span className="text-[14px] leading-[1.5] text-ink-faint mt-1">날짜 추가</span>
            </div>

            <span className="hidden md:block w-px bg-line my-3.5 shrink-0" aria-hidden />

            <div className="hidden md:flex flex-1 flex-col justify-center px-6 py-4">
              <span className="text-[13px] leading-[1.5] font-semibold text-ink">게스트</span>
              <span className="text-[14px] leading-[1.5] text-ink-faint mt-1">게스트 추가</span>
            </div>

            <div className="flex items-center gap-1 pr-2.5 pl-2">
              {query && (
                <button
                  onClick={() => setQuery('')}
                  aria-label="검색어 지우기"
                  className="text-ink-faint hover:text-ink px-2.5 text-xl leading-none"
                >
                  ×
                </button>
              )}
              <span className="w-[52px] h-[52px] rounded-full bg-gilt grid place-items-center shrink-0 shadow-gold">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.4}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ 카테고리 탭 — 아이콘 + 라벨, 가로 스크롤 */}
      {!loading && !failed && properties.length > 0 && (
        <section className="sticky top-[76px] z-30 bg-canvas/95 backdrop-blur-sm border-b border-line">
          <div className={`${SHELL} py-4 flex gap-2.5 overflow-x-auto scrollbar-none`}>
            <CategoryChip label="전체" active={!region && !type} onClick={reset} />
            {regions.map((r) => (
              <CategoryChip
                key={r}
                label={r}
                active={region === r}
                onClick={() => setRegion(region === r ? null : r)}
              />
            ))}
            {types.map((t) => (
              <CategoryChip
                key={t}
                label={PROPERTY_TYPE_LABEL[t]}
                active={type === t}
                onClick={() => setType(type === t ? null : t)}
              />
            ))}
          </div>
        </section>
      )}

      {/* ═══════════════════════ 목록 */}
      <section className={`${SHELL} pt-10 md:pt-12 pb-20 md:pb-24`}>
        <div className="flex items-end justify-between gap-6 mb-7">
          <div>
            {/* 무신사의 위계를 따른다 — **제목은 두껍고 큼직하게**, 그 아래
                부가정보는 얇고 작게. 굵기 차이만으로 위계가 정리되면 부제나
                구분선이 필요 없다. */}
            <h2 className="text-[26px] md:text-[32px] font-bold text-ink leading-[1.3] tracking-[-0.01em]">
              {filtering ? '검색 결과' : '지금 머물 수 있는 곳'}
            </h2>
            {!loading && !failed && (
              <p className="text-ink-faint text-[14px] leading-[1.55] mt-2.5 font-normal">
                <span className="font-bold text-gold-600">{visible.length}곳</span>
                {filtering && properties.length !== visible.length && (
                  <span> · 전체 {properties.length}곳</span>
                )}
              </p>
            )}
          </div>
          {filtering && (
            <button
              onClick={reset}
              className="text-[14px] leading-[1.5] font-medium text-gold-700 hover:text-gold-800 underline underline-offset-4 shrink-0"
            >
              필터 해제
            </button>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-x-5 md:gap-x-6 gap-y-10">
            {Array.from({ length: 14 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/3] bg-mist rounded-2xl" />
                <div className="pt-4">
                  <div className="h-4 bg-mist rounded w-3/4 mb-3" />
                  <div className="h-3 bg-mist rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : failed ? (
          /* 목록을 못 불러온 것과 숙소가 없는 것은 **다른 사실이다.**
             둘 다 "숙소가 없습니다" 로 그리면 서버가 죽어도 화면은 평온해
             보이고 아무도 눈치채지 못한다. */
          <div className="text-center py-24">
            <p className="text-ink font-medium text-[18px] leading-[1.5]">숙소 목록을 불러오지 못했습니다.</p>
            <p className="text-ink-faint text-[14px] leading-[1.6] mt-4">
              잠시 뒤 다시 시도해 주세요. 숙소가 없는 것이 아니라 연결에 실패했습니다.
            </p>
            <button
              onClick={() => location.reload()}
              className="mt-8 bg-charcoal text-white px-8 py-3.5 rounded-full text-[14px] leading-[1.5] font-medium hover:bg-charcoal-soft transition-colors"
            >
              다시 시도
            </button>
          </div>
        ) : visible.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-ink font-medium text-[18px] leading-[1.5]">
              {filtering ? '조건에 맞는 숙소가 없습니다.' : '아직 등록된 숙소가 없습니다.'}
            </p>
            {filtering && (
              <button
                onClick={reset}
                className="mt-6 text-[14px] leading-[1.5] font-medium text-gold-700 hover:text-gold-800 underline underline-offset-4"
              >
                조건 지우고 전체 보기
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-x-5 md:gap-x-6 gap-y-10">
            {visible.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                saved={saved.has(property.id)}
                onToggleSave={toggleSave}
              />
            ))}
          </div>
        )}
      </section>

      {/* ═══════════════════════ 푸터 */}
      {/* 푸터
           검정으로 뒀더니 화이트 헤더와 정면으로 부딪혔다. 한 화면의 위아래가
           반대색이면 같은 사이트로 안 보인다 — 아래쪽만 다른 서비스처럼 뜬다.

           **헤더와 같은 규칙을 쓴다**: 화이트 바탕, 실선 하나로 구분, 워드마크는
           같은 모양. 위아래가 서로를 비추면 그 사이의 목록이 주인공이 된다. */}
      <footer className="border-t border-line">
        <div className={`${SHELL} py-12`}>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <p className="text-[19px] font-bold tracking-[-0.02em] text-ink leading-none">
                Host <span className="text-gold-600">2</span> Guest
              </p>
              <p className="text-ink-faint text-[14px] leading-[1.6] mt-3.5">
                호스트가 가꾼 공간을 손님에게.
                <br />
                엄선한 숙소와 투명한 예약.
              </p>
            </div>
            <p className="text-ink-faint text-[12px] leading-[1.5] tracking-[0.02em]">© 2026 Host 2 Guest</p>
          </div>
        </div>
      </footer>
    </main>
  )
}

export default function Home() {
  // `useSearchParams` 는 프리렌더 중에 Suspense 경계를 요구한다. 없으면 빌드가
  // 통째로 실패한다.
  return (
    <Suspense fallback={<div className="min-h-screen bg-canvas" />}>
      <HomeInner />
    </Suspense>
  )
}
