import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getProperties } from '../api/properties'
import type { Property } from '../types'

const PROPERTY_TYPE_LABEL: Record<Property['property_type'], string> = {
  APARTMENT: '아파트',
  HOTEL: '호텔',
  GUESTHOUSE: '게스트하우스',
  PENSION: '펜션',
  HOUSE: '단독주택',
}

const TYPE_STYLE: Record<Property['property_type'], string> = {
  APARTMENT: 'bg-white/90 text-gray-600 border border-gray-300',
  HOTEL: 'bg-sky-500 text-white',
  GUESTHOUSE: 'bg-emerald-500 text-white',
  PENSION: 'bg-orange-500 text-white',
  HOUSE: 'text-white',
}

const BURGUNDY = '#8B1A2B'

function PropertyCard({ property }: { property: Property }) {
  const houseStyle = property.property_type === 'HOUSE' ? { backgroundColor: BURGUNDY } : {}

  return (
    <Link to={`/properties/${property.id}`} className="group block">
      <div
        className="aspect-[2/3] rounded-2xl overflow-hidden mb-3 relative bg-sky-100 shadow-sm group-hover:shadow-xl transition-all duration-300"
        style={{ border: '1.5px solid #bae6fd', outline: '0px solid transparent' }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = BURGUNDY)}
        onMouseLeave={e => (e.currentTarget.style.borderColor = '#bae6fd')}
      >
        {property.photo_url ? (
          <img
            src={property.photo_url}
            alt={property.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-sky-300 gap-2">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
            </svg>
            <span className="text-xs font-medium">사진 없음</span>
          </div>
        )}

        {/* Rating badge */}
        <span
          className={`absolute top-2 left-2 text-xs font-bold px-2 py-0.5 rounded-md backdrop-blur-sm ${TYPE_STYLE[property.property_type]}`}
          style={houseStyle}
        >
          {PROPERTY_TYPE_LABEL[property.property_type]}
        </span>

        {/* Rating overlay at bottom */}
        {property.avg_rating && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent px-3 py-3">
            <span className="text-yellow-400 text-sm leading-none">★</span>
            <span className="text-white text-xs ml-1 font-semibold">{Number(property.avg_rating).toFixed(1)}</span>
          </div>
        )}
      </div>

      <p className="font-semibold text-gray-900 text-sm line-clamp-1 group-hover:text-orange-500 transition-colors leading-snug">
        {property.name}
      </p>
      <p className="text-gray-400 text-xs mt-0.5">{property.max_guests}분</p>
    </Link>
  )
}

export default function Home() {
  const navigate = useNavigate()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProperties('LISTED')
      .then((res) => setProperties(res.data))
      .finally(() => setLoading(false))
  }, [])

  return (
    <main className="flex-1">
      {/* Hero Banner */}
      <div
        className="py-10 px-4"
        style={{ background: 'linear-gradient(135deg, #0ea5e9 0%, #38bdf8 50%, #7dd3fc 100%)' }}
      >
        <div className="max-w-6xl mx-auto">
          <p className="text-sky-100 text-xs font-semibold uppercase tracking-widest mb-2">Now Playing</p>
          <h1 className="text-3xl font-black text-white mb-1.5 leading-tight">
            지금 바로 예약하세요
          </h1>
          <p className="text-sky-100 text-sm mb-6">최신 숙소를 가장 빠르게, 원하는 객실으로</p>
          <div className="flex gap-2.5">
            <button
              onClick={() => {}}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-colors shadow-lg"
              style={{ boxShadow: '0 4px 14px rgba(249,115,22,0.45)' }}
            >
              숙소별 예약
            </button>
            <button
              onClick={() => navigate('/regions')}
              className="bg-white/20 hover:bg-white/35 text-white border border-white/50 px-6 py-2.5 rounded-xl text-sm font-semibold transition-colors backdrop-blur-sm"
            >
              숙소별 예약
            </button>
          </div>
        </div>
      </div>

      {/* Property Section */}
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Section header */}
        <div className="flex items-center gap-3 mb-7">
          <div className="w-1 h-7 rounded-full" style={{ backgroundColor: BURGUNDY }} />
          <h2 className="text-xl font-black text-gray-900">현재 예약 가능</h2>
          {!loading && (
            <span
              className="ml-auto text-xs font-semibold px-3 py-1 rounded-full"
              style={{ backgroundColor: '#8B1A2B15', color: BURGUNDY }}
            >
              {properties.length}편
            </span>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[2/3] bg-sky-100 rounded-2xl mb-3" />
                <div className="h-4 bg-sky-100 rounded-lg w-3/4 mb-1.5" />
                <div className="h-3 bg-sky-100 rounded-lg w-1/2" />
              </div>
            ))}
          </div>
        ) : properties.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <svg className="w-12 h-12 mx-auto mb-3 text-sky-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
            </svg>
            <p className="text-sm">예약 가능인 숙소가 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-8" style={{ backgroundColor: '#0c4a6e' }}>
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-0.5 mb-2">
                <span className="text-lg font-black text-white tracking-tight">CINE</span>
                <span className="text-lg font-black text-orange-400 tracking-tight">BOOK</span>
              </div>
              <p className="text-sky-300 text-xs">숙소 예약 서비스 · 최신 숙소 · 편리한 예약</p>
            </div>
            <p className="text-sky-400 text-xs">© 2026 CineBook. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
