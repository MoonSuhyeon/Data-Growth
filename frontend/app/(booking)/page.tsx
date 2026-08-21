'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { getProperties } from '@/api/properties'
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

/* ─────────────────────────────────────────────────────────── 카드 */

function PropertyCard({ property }: { property: Property }) {
  return (
    <Link href={`/properties/${property.id}`} className="group block">
      {/* 4:3. 예전에는 2:3 이었는데 그건 **영화 포스터 비율**이다 — 숙소 사진은
          가로로 찍히므로 세로로 길게 담으면 방 사진이 잘린다. */}
      <div className="aspect-[4/3] rounded-2xl overflow-hidden mb-3 relative bg-ivory-deep shadow-card group-hover:shadow-card-hover transition-shadow duration-300">
        {property.photo_url ? (
          <img
            src={property.photo_url}
            alt=""
            className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gold-300 gap-2">
            <svg className="w-9 h-9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.1}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l9-9 9 9M5 10v10a1 1 0 001 1h3v-6h6v6h3a1 1 0 001-1V10" />
            </svg>
            <span className="text-[11px] tracking-wide">준비 중인 사진</span>
          </div>
        )}

        <span className="absolute top-3 left-3 text-[11px] font-medium px-2.5 py-1 rounded-full bg-white/92 text-ink-soft backdrop-blur-sm">
          {PROPERTY_TYPE_LABEL[property.property_type]}
        </span>
      </div>

      <div className="flex items-start justify-between gap-2">
        <p className="font-semibold text-ink text-[15px] leading-snug line-clamp-1 group-hover:text-gold-700 transition-colors">
          {property.name}
        </p>
        {property.avg_rating != null && (
          <span className="flex items-center gap-1 text-[13px] text-ink shrink-0 pt-0.5">
            <span className="text-gold-500 leading-none">★</span>
            {Number(property.avg_rating).toFixed(1)}
          </span>
        )}
      </div>
      <p className="text-ink-faint text-[13px] mt-0.5">{property.region}</p>
      <p className="text-ink-faint text-[13px]">최대 {property.max_guests}명</p>
    </Link>
  )
}

/* ─────────────────────────────────────────────────────────── 필터 알약 */

function Pill({
  active, onClick, children,
}: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
        active
          ? 'bg-charcoal text-gold-200 border-charcoal shadow-card'
          : 'bg-white text-ink-soft border-line hover:border-gold-300 hover:text-gold-700'
      }`}
    >
      {children}
    </button>
  )
}

/* ─────────────────────────────────────────────────────────── 화면 */

export default function Home() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)

  // 히어로에 있던 버튼 두 개가 여기로 왔다.
  //
  // 예전에는 라벨이 똑같이 "숙소별 예약" 인 버튼이 둘이었고, 하나는
  // `onClick={() => {}}` 라 아무 일도 안 했으며 다른 하나는 존재하지 않는
  // `/regions` 로 보내 404 를 띄웠다. **누를 수 있게 생겼는데 아무 일도
  // 안 일어나는 것**이 화면에서 가장 나쁜 종류의 거짓말이라, 지우는 대신
  // 실제로 목록을 거르는 기능으로 바꿨다.
  const [query, setQuery] = useState('')
  const [region, setRegion] = useState<string | null>(null)
  const [type, setType] = useState<Property['property_type'] | null>(null)

  useEffect(() => {
    getProperties('LISTED')
      .then((res) => setProperties(res.data))
      .catch(() => setFailed(true))
      .finally(() => setLoading(false))
  }, [])

  // 지역은 고정 목록이 아니라 **데이터에서 뽑는다.** 손으로 적어 두면 숙소가
  // 없는 지역이 칩으로 남아, 눌러도 빈 화면이 나온다.
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
      {/* ═══════════════════════════════════════════════ 히어로 */}
      <section className="relative bg-charcoal overflow-hidden">
        {/* 은은한 골드 후광. 이미지 없이 고급스러움을 내는 가장 싼 방법이고,
            무엇보다 **불러올 것이 없어서 늦게 뜨지 않는다.** */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-[0.55]"
          style={{
            background:
              'radial-gradient(70% 120% at 78% 8%, rgba(229,193,88,0.30) 0%, transparent 58%), radial-gradient(50% 90% at 10% 100%, rgba(122,27,46,0.35) 0%, transparent 60%)',
          }}
        />

        <div className="relative max-w-6xl mx-auto px-4 pt-16 pb-12 md:pt-24 md:pb-16">
          <p className="text-gold-300 text-[11px] font-medium uppercase tracking-[0.3em] mb-5">
            Host 2 Guest
          </p>
          <h1 className="text-white text-[34px] md:text-[52px] leading-[1.12] font-medium max-w-2xl">
            머무는 시간을
            <br className="hidden sm:block" />
            <span className="text-gilt"> 고르는 일</span>
          </h1>
          <p className="text-white/60 text-[15px] md:text-base mt-5 max-w-md leading-relaxed">
            호스트가 손수 가꾼 공간만 골라 담았습니다. 오늘 밤 묵을 곳부터
            긴 휴식까지.
          </p>

          {/* 검색바 — 에어비앤비의 알약형 바를 따르되 색만 골드로 */}
          <div className="mt-9 bg-white rounded-full shadow-card-hover p-1.5 pl-6 flex items-center max-w-xl">
            <svg className="w-4 h-4 text-ink-faint shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
            </svg>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="지역, 숙소 이름으로 찾기"
              aria-label="숙소 검색"
              className="flex-1 px-3 py-2.5 text-[15px] bg-transparent outline-none placeholder:text-ink-faint"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                aria-label="검색어 지우기"
                className="text-ink-faint hover:text-ink px-2 text-lg leading-none"
              >
                ×
              </button>
            )}
            <span className="hidden sm:grid w-11 h-11 rounded-full bg-gilt place-items-center shrink-0 shadow-gold">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.4}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
              </svg>
            </span>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ 필터 */}
      {!loading && !failed && properties.length > 0 && (
        <section className="sticky top-[72px] z-30 bg-ivory/95 backdrop-blur-sm border-b border-line">
          <div className="max-w-6xl mx-auto px-4 py-3.5 flex gap-2 overflow-x-auto scrollbar-none">
            <Pill active={!region && !type} onClick={reset}>전체</Pill>
            <span className="w-px bg-line shrink-0 my-1" aria-hidden />
            {regions.map((r) => (
              <Pill key={r} active={region === r} onClick={() => setRegion(region === r ? null : r)}>
                {r}
              </Pill>
            ))}
            <span className="w-px bg-line shrink-0 my-1" aria-hidden />
            {types.map((t) => (
              <Pill key={t} active={type === t} onClick={() => setType(type === t ? null : t)}>
                {PROPERTY_TYPE_LABEL[t]}
              </Pill>
            ))}
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════ 목록 */}
      <section className="max-w-6xl mx-auto px-4 py-10 md:py-14">
        <div className="flex items-end justify-between gap-4 mb-7">
          <div>
            <h2 className="text-[22px] md:text-[26px] font-medium text-ink">
              {filtering ? '검색 결과' : '지금 머물 수 있는 곳'}
            </h2>
            {!loading && !failed && (
              <p className="text-ink-faint text-sm mt-1.5">
                {visible.length}곳
                {filtering && properties.length !== visible.length && (
                  <span className="text-ink-faint"> · 전체 {properties.length}곳</span>
                )}
              </p>
            )}
          </div>
          {filtering && (
            <button
              onClick={reset}
              className="text-sm font-medium text-gold-700 hover:text-gold-800 underline underline-offset-4 shrink-0"
            >
              필터 해제
            </button>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[4/3] bg-ivory-deep rounded-2xl mb-3" />
                <div className="h-4 bg-ivory-deep rounded w-3/4 mb-2" />
                <div className="h-3 bg-ivory-deep rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : failed ? (
          /* 목록을 못 불러온 것과 숙소가 없는 것은 **다른 사실이다.**
             둘 다 "숙소가 없습니다" 로 그리면, 서버가 죽어도 화면은 평온해 보이고
             아무도 눈치채지 못한다. */
          <div className="text-center py-24">
            <p className="text-ink font-medium">숙소 목록을 불러오지 못했습니다.</p>
            <p className="text-ink-faint text-sm mt-2">
              잠시 뒤 다시 시도해 주세요. 숙소가 없는 것이 아니라 연결에 실패했습니다.
            </p>
            <button
              onClick={() => location.reload()}
              className="mt-6 bg-charcoal text-gold-200 px-6 py-2.5 rounded-full text-sm font-medium hover:bg-charcoal-soft transition-colors"
            >
              다시 시도
            </button>
          </div>
        ) : visible.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-ink font-medium">
              {filtering ? '조건에 맞는 숙소가 없습니다.' : '아직 등록된 숙소가 없습니다.'}
            </p>
            {filtering && (
              <button
                onClick={reset}
                className="mt-5 text-sm font-medium text-gold-700 hover:text-gold-800 underline underline-offset-4"
              >
                조건 지우고 전체 보기
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-8">
            {visible.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </section>

      {/* ═══════════════════════════════════════════════ 푸터 */}
      <footer className="bg-charcoal mt-8">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <p className="text-[19px] font-medium text-gilt font-[family-name:var(--font-display)]">
                Host 2 Guest
              </p>
              <p className="text-white/45 text-[13px] mt-2.5 leading-relaxed">
                호스트가 가꾼 공간을 손님에게. 엄선한 숙소와 투명한 예약.
              </p>
            </div>
            <p className="text-white/30 text-xs">© 2026 Host 2 Guest</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
