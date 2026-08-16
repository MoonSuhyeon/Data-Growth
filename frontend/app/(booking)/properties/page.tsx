'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getProperties } from '@/api/properties'
import { track } from '@/lib/tracking'
import type { Property } from '@/types'

const REGION_ORDER = ['서울', '경기', '인천', '강원', '대전/충청', '대구', '부산/울산', '경상', '광주/전라/제주']

export default function PropertyList() {
  const router = useRouter()
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRegion, setSelectedRegion] = useState(REGION_ORDER[0])

  useEffect(() => {
    getProperties()
      .then((res) => {
        setProperties(res.data)
        const firstWithProperty = REGION_ORDER.find((r) => res.data.some((t) => t.region === r))
        if (firstWithProperty) setSelectedRegion(firstWithProperty)
      })
      .finally(() => setLoading(false))
  }, [])

  const regionCount = properties.reduce<Record<string, number>>((acc, t) => {
    acc[t.region] = (acc[t.region] ?? 0) + 1
    return acc
  }, {})

  const propertiesInRegion = properties.filter((t) => t.region === selectedRegion)

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      {/* 예약 방식 탭 */}
      <div className="flex gap-2 mb-6">
        <Link
          href="/"
          className="px-5 py-2.5 rounded-xl text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
        >
          숙소별 예약
        </Link>
        <span className="px-5 py-2.5 rounded-xl text-sm font-medium bg-blue-600 text-white cursor-default">
          숙소별 예약
        </span>
      </div>

      <h1 className="text-xl font-bold text-gray-900 mb-5">숙소 선택</h1>

      {loading ? (
        <div className="flex border border-gray-200 rounded-xl overflow-hidden animate-pulse" style={{ minHeight: '24rem' }}>
          <div className="w-28 bg-gray-100 border-r border-gray-200 flex-shrink-0" />
          <div className="flex-1 p-4 grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => <div key={i} className="h-20 bg-gray-100 rounded-xl" />)}
          </div>
        </div>
      ) : (
        <div className="flex border border-gray-200 rounded-xl overflow-hidden bg-white" style={{ minHeight: '24rem' }}>
          {/* 지역 목록 */}
          <div className="w-28 bg-gray-50 border-r border-gray-200 flex-shrink-0 overflow-y-auto">
            {REGION_ORDER.map((region) => {
              const isActive = region === selectedRegion
              const count = regionCount[region] ?? 0
              return (
                <button
                  key={region}
                  onClick={() => {
                    setSelectedRegion(region)
                    // 검색 한 번을 식별하는 ID. 같은 검색에서 나온 조회·예약을
                    // 나중에 하나로 묶으려면 서버가 아니라 여기서 만들어야 한다.
                    track({
                      event_name: 'search_performed',
                      search_id: `${Date.now()}-${region}`,
                      region,
                    })
                  }}
                  className={`w-full text-left px-3 py-3.5 text-sm border-b border-gray-100 last:border-b-0 transition-colors ${
                    isActive
                      ? 'bg-white text-blue-600 font-semibold border-l-2 border-l-blue-600'
                      : 'text-gray-600 hover:bg-gray-100 border-l-2 border-l-transparent'
                  }`}
                >
                  {region}
                  <span className={`ml-1 text-xs ${isActive ? 'text-blue-400' : 'text-gray-400'}`}>
                    ({count})
                  </span>
                </button>
              )
            })}
          </div>

          {/* 숙소 카드 */}
          <div className="flex-1 p-4">
            {propertiesInRegion.length === 0 ? (
              <p className="text-sm text-gray-400 pt-6">해당 지역에 숙소이 없습니다.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {propertiesInRegion.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => router.push(`/properties/${t.id}`)}
                    className="text-left p-4 border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-colors group"
                  >
                    <p className="font-semibold text-gray-900 group-hover:text-blue-700">{t.name}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  )
}
