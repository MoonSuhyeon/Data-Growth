'use client'

import { Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { addWishlist, getMyWishlist, getProperties, removeWishlist } from '@/api/properties'
import { SHELL, TABS, type TabKey } from '@/components/Navbar'
import { useAuthStore } from '@/store/authStore'
import type { Property } from '@/types'

const PROPERTY_TYPE_LABEL: Record<Property['property_type'], string> = {
  APARTMENT: '아파트',
  HOTEL: '호텔',
  GUESTHOUSE: '게스트하우스',
  PENSION: '펜션',
  HOUSE: '단독주택',
}

/** 카테고리 탭의 아이콘. 에어비앤비의 아이콘 줄을 따르되 이모지로 대신한다. */
const TYPE_ICON: Record<Property['property_type'], string> = {
  HOTEL: '🏨',
  PENSION: '🏡',
  APARTMENT: '🏢',
  HOUSE: '🏠',
  GUESTHOUSE: '🛏️',
}

const REGION_ICON: Record<string, string> = {
  서울: '🏙️', 부산: '🌊', 제주: '🌴', 강릉: '🏖️', 경주: '🏯',
  인천: '✈️', 대구: '⛰️', 광주: '🌸', 대전: '🔬', 속초: '🐚',
}

const TYPE_ORDER: Property['property_type'][] = [
  'HOTEL', 'PENSION', 'APARTMENT', 'HOUSE', 'GUESTHOUSE',
]

/* ═══════════════════════════════════════════════════════════ 카테고리 탭 */

function CategoryTab({
  icon, label, active, onClick,
}: { icon: string; label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`shrink-0 flex flex-col items-center gap-2 pb-3 pt-1 px-1 border-b-2 transition-colors ${
        active
          ? 'border-charcoal text-ink font-semibold'
          : 'border-transparent text-ink-soft font-normal hover:text-ink hover:border-line'
      }`}
    >
      <span className="text-[24px] leading-none" aria-hidden>{icon}</span>
      <span className="text-[13px] leading-[1.45] tracking-[0.01em] whitespace-nowrap">{label}</span>
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
      <div className="aspect-[4/3] rounded-2xl overflow-hidden relative bg-ivory-deep shadow-sm group-hover:shadow-lg transition-shadow duration-300">
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
        <span className="absolute top-3 left-3 z-10 text-[12px] leading-[1.5] font-medium px-3 py-1.5 rounded-full bg-white/95 text-ink-soft backdrop-blur-sm shadow-sm">
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
      <div className="pt-4">
        <div className="flex items-start justify-between gap-3">
          <p className="font-semibold text-ink text-[16px] leading-[1.45] line-clamp-1 group-hover:text-gold-700 transition-colors">
            {property.name}
          </p>
          {property.avg_rating != null && (
            <span className="flex items-center gap-1 text-[14px] leading-[1.45] text-ink shrink-0">
              <span className="text-gold-500 leading-none">★</span>
              {Number(property.avg_rating).toFixed(1)}
            </span>
          )}
        </div>
        <p className="text-ink-faint text-[14px] leading-[1.55] mt-1.5">{property.region}</p>
        <p className="text-ink-faint text-[14px] leading-[1.55]">최대 {property.max_guests}명</p>
      </div>
    </Link>
  )
}

/* ═══════════════════════════════════════════════════════════ 화면 */

function HomeInner() {
  const router = useRouter()
  const params = useSearchParams()
  const { user } = useAuthStore()

  const tab = (params.get('tab') as TabKey | null) ?? 'all'
  const tabMeta = TABS.find((t) => t.key === tab) ?? TABS[0]

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

  // 히어로 사진. 평점이 높은 순으로 고르되 **사진이 있는 것만.**
  const hero = useMemo(
    () =>
      properties
        .filter((p) => p.photo_url)
        .sort((a, b) => (Number(b.avg_rating) || 0) - (Number(a.avg_rating) || 0))
        .slice(0, 3),
    [properties],
  )

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
      {/* ═══════════════════════ 검색바 — 헤더 바로 아래, 독립 섹션
           히어로 위에 겹쳐 놓으면 사진 밝기에 따라 글자가 사라지고, 좁은
           화면에서는 카피와 겹쳐 잘린다. 그래서 자기 자리를 준다. */}
      <section className="bg-ivory border-b border-line">
        <div className={`${SHELL} py-7`}>
          <div className="bg-white rounded-full shadow-md border border-line flex items-stretch max-w-3xl mx-auto overflow-hidden">
            {/* 여행지 */}
            <label className="flex-[1.4] flex flex-col justify-center px-7 py-3.5 hover:bg-gold-50/60 transition-colors cursor-text">
              <span className="text-[12px] leading-[1.5] font-semibold text-ink">여행지</span>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="여행지 검색"
                aria-label="여행지 검색"
                className="text-[14px] leading-[1.5] bg-transparent outline-none placeholder:text-ink-faint mt-0.5 w-full"
              />
            </label>

            <span className="w-px bg-line my-3" aria-hidden />

            {/* 날짜 · 게스트 — **아직 예약 조건으로 안 쓴다.**
                에어비앤비의 3분할 모양을 맞추려고 자리는 두되, 고를 수 있는
                것처럼 보이게 만들지 않는다. 날짜와 인원은 숙소를 고른 다음
                예약 화면에서 정하는 구조라, 여기서 받으면 두 곳이 어긋난다. */}
            <div className="hidden sm:flex flex-1 flex-col justify-center px-7 py-3.5">
              <span className="text-[12px] leading-[1.5] font-semibold text-ink">날짜</span>
              <span className="text-[14px] leading-[1.5] text-ink-faint mt-0.5">숙소에서 선택</span>
            </div>

            <span className="hidden sm:block w-px bg-line my-3" aria-hidden />

            <div className="hidden md:flex flex-1 flex-col justify-center px-7 py-3.5">
              <span className="text-[12px] leading-[1.5] font-semibold text-ink">게스트</span>
              <span className="text-[14px] leading-[1.5] text-ink-faint mt-0.5">숙소에서 선택</span>
            </div>

            <div className="flex items-center pr-2 pl-1">
              {query && (
                <button
                  onClick={() => setQuery('')}
                  aria-label="검색어 지우기"
                  className="text-ink-faint hover:text-ink px-3 text-xl leading-none"
                >
                  ×
                </button>
              )}
              <span className="w-12 h-12 rounded-full bg-gilt grid place-items-center shrink-0 shadow-gold">
                <svg className="w-[18px] h-[18px] text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.4}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ 히어로 — 겹치지 않는 자기 구역 */}
      <section className={`${SHELL} pt-10`}>
        <div className="relative rounded-3xl overflow-hidden bg-charcoal min-h-[380px] md:min-h-[460px] flex">
          <div aria-hidden className="absolute inset-0 grid grid-cols-1 md:grid-cols-3">
            {(hero.length === 3 ? hero : []).map((p, i) => (
              <div key={p.id} className={i > 0 ? 'hidden md:block relative' : 'relative'}>
                <img src={p.photo_url!} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>

          {/* 좌하단 그라디언트. 카피가 사진 위에 얹히므로 **글자가 읽히는 것이
              먼저다** — 오버레이 없이 흰 글씨를 올리면 밝은 사진에서 사라진다. */}
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to top right, rgba(26,23,20,0.94) 0%, rgba(26,23,20,0.74) 36%, rgba(26,23,20,0.30) 66%, rgba(26,23,20,0.12) 100%)',
            }}
          />

          <div className="relative flex flex-col justify-end p-8 md:p-14 w-full">
            <p className="text-gold-300 text-[12px] leading-[1.5] font-medium uppercase tracking-[0.38em] mb-5">
              Host 2 Guest
            </p>
            <h1 className="text-white text-[36px] md:text-[52px] font-light leading-[1.25] tracking-[0.01em] max-w-2xl">
              머무는 시간을
              <br />
              <span className="text-gilt font-normal">고르는 일</span>
            </h1>
            <p className="text-white/70 text-[15px] md:text-[17px] leading-[1.6] mt-6 max-w-md">
              호스트가 손수 가꾼 공간만 골라 담았습니다.
              오늘 밤 묵을 곳부터 긴 휴식까지.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════ 카테고리 탭 — 아이콘 + 라벨, 가로 스크롤 */}
      {!loading && !failed && properties.length > 0 && tabMeta.ready && (
        <section className="sticky top-[88px] z-30 bg-ivory/95 backdrop-blur-sm border-b border-line mt-12">
          <div className={`${SHELL} pt-3 flex gap-7 md:gap-8 overflow-x-auto scrollbar-none`}>
            <CategoryTab icon="✨" label="전체" active={!region && !type} onClick={reset} />
            {regions.map((r) => (
              <CategoryTab
                key={r}
                icon={REGION_ICON[r] ?? '📍'}
                label={r}
                active={region === r}
                onClick={() => setRegion(region === r ? null : r)}
              />
            ))}
            {types.map((t) => (
              <CategoryTab
                key={t}
                icon={TYPE_ICON[t]}
                label={PROPERTY_TYPE_LABEL[t]}
                active={type === t}
                onClick={() => setType(type === t ? null : t)}
              />
            ))}
          </div>
        </section>
      )}

      {/* ═══════════════════════ 목록 */}
      <section className={`${SHELL} py-14 md:py-20`}>
        {!tabMeta.ready ? (
          /* 체험·서비스 탭. **눌리기는 하되 거짓말은 안 한다** — 아무 일도 안
             일어나는 탭을 두느니 "아직 열지 않았다" 를 분명히 말한다. */
          <div className="text-center py-24">
            <p className="text-[44px] leading-none mb-6" aria-hidden>{tabMeta.icon}</p>
            <h2 className="text-[24px] md:text-[28px] font-light text-ink leading-[1.4] tracking-[0.01em]">
              {tabMeta.label}은 아직 준비 중입니다
            </h2>
            <p className="text-ink-faint text-[15px] leading-[1.6] mt-4">
              지금은 숙소만 예약하실 수 있습니다.
            </p>
            <Link
              href="/"
              className="inline-block mt-9 bg-charcoal text-gold-200 px-8 py-3.5 rounded-full text-[14px] leading-[1.5] font-medium hover:bg-charcoal-soft transition-colors"
            >
              숙소 보러 가기
            </Link>
          </div>
        ) : (
          <>
            <div className="flex items-end justify-between gap-6 mb-10">
              <div>
                <h2 className="text-[24px] md:text-[30px] font-light text-ink leading-[1.35] tracking-[0.01em]">
                  {filtering ? '검색 결과' : '지금 머물 수 있는 곳'}
                </h2>
                {!loading && !failed && (
                  <p className="text-ink-faint text-[14px] leading-[1.55] mt-3">
                    {visible.length}곳
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
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 md:gap-x-8 gap-y-11">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="aspect-[4/3] bg-ivory-deep rounded-2xl" />
                    <div className="pt-4">
                      <div className="h-4 bg-ivory-deep rounded w-3/4 mb-3" />
                      <div className="h-3 bg-ivory-deep rounded w-1/2" />
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
                  className="mt-8 bg-charcoal text-gold-200 px-8 py-3.5 rounded-full text-[14px] leading-[1.5] font-medium hover:bg-charcoal-soft transition-colors"
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
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 md:gap-x-8 gap-y-11">
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
          </>
        )}
      </section>

      {/* ═══════════════════════ 푸터 */}
      <footer className="bg-charcoal">
        <div className={`${SHELL} py-14 md:py-16`}>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8">
            <div>
              <p className="text-[22px] leading-[1.4] font-medium text-gilt font-[family-name:var(--font-display)] tracking-[0.01em]">
                Host 2 Guest
              </p>
              <p className="text-white/45 text-[14px] leading-[1.6] mt-4">
                호스트가 가꾼 공간을 손님에게.
                <br />
                엄선한 숙소와 투명한 예약.
              </p>
            </div>
            <p className="text-white/30 text-[12px] leading-[1.5] tracking-[0.02em]">© 2026 Host 2 Guest</p>
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
    <Suspense fallback={<div className="min-h-screen bg-ivory" />}>
      <HomeInner />
    </Suspense>
  )
}
