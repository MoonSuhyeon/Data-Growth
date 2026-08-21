'use client'

import { useState } from 'react'
import AdminLayout from '@/components/AdminLayout'
import { ServiceDownNotice, ServiceUnavailable, fetchService } from '@/components/ServiceState'

/**
 * 응답 모양은 서비스가 커밋한 스키마에서 온다. 손으로 다시 적지 않는다.
 *
 * 손으로 적혀 있던 것과 계약은 이미 어긋나 있었다 — `violations` 는 계약에서
 * 선택 필드인데 필수로 적혀 있어서, 서비스가 생략하면 `.length` 에서 화면이
 * 죽을 참이었다. 세그먼트·포맷 목록도 문자열 배열이라 서비스가 값을 바꿔도
 * 아무 데서도 안 걸렸다.
 */
import type { components } from '@/types/services/content'

type Schemas = components['schemas']
type GenerateRes = Schemas['GenerateResponse']
type SearchRes = Schemas['SearchResponse']

// 열거형은 계약에서 가져온다. 값이 바뀌면 여기서 빌드가 깨진다.
const SEGMENTS: Schemas['Segment'][] = ['COUPLE', 'FAMILY', 'BUSINESS']
const FORMATS: Schemas['ContentFormat'][] = ['SNS', 'AD_COPY', 'CRM']

export default function ContentPage() {
  const [query, setQuery] = useState('수영장 있는 숙소')
  const [search, setSearch] = useState<SearchRes | null>(null)
  const [propertyId, setPropertyId] = useState('P0001')
  const [segment, setSegment] = useState(SEGMENTS[0])
  const [format, setFormat] = useState(FORMATS[0])
  const [result, setResult] = useState<GenerateRes | null>(null)
  const [down, setDown] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const call = async <T,>(fn: () => Promise<T>, set: (v: T) => void) => {
    setBusy(true); setDown(null)
    try { set(await fn()) }
    catch (e) {
      if (e instanceof ServiceUnavailable) setDown(e.message)
      else setDown(String((e as Error).message))
    }
    finally { setBusy(false) }
  }

  const doIndex = () => call(
    () => fetchService('/api/content/index', { method: 'POST', body: '{}' }),
    () => {},
  )

  const doSearch = () => call(
    () => fetchService<SearchRes>('/api/content/search', {
      method: 'POST', body: JSON.stringify({ query, top_k: 5 }),
    }),
    setSearch,
  )

  const doGenerate = async () => {
    setBusy(true); setDown(null)
    try {
      const r = await fetch('/api/content/generate', {
        method: 'POST',
        body: JSON.stringify({ property_id: propertyId, segment, format }),
      })
      const body = await r.json()
      if (r.status === 503) { setDown(body.detail); return }
      // 검증에 실패하면 422 로 오고, 본문에 위반 내역이 들어 있다
      setResult(r.status === 422 ? body.detail : body)
    } finally { setBusy(false) }
  }

  return (
    <AdminLayout>
      <div className="mb-9">
        <h1 className="text-[26px] font-bold text-ink leading-[1.3] tracking-[-0.01em]">콘텐츠 생성</h1>
        <p className="text-[14px] leading-[1.6] text-ink-soft mt-2.5">
          생성물의 모든 주장을 원본 레코드와 대조한다. 통과하지 못하면 내보내지 않는다.
        </p>
      </div>

      {down && <ServiceDownNotice detail={down} />}

      <div className="space-y-6">
        <section className="bg-white rounded-2xl border border-line p-6">
          <h2 className="text-[11px] font-semibold text-ink-faint uppercase tracking-[0.16em] mb-5">검색</h2>
          <div className="flex gap-2 mb-3">
            <input
              value={query} onChange={(e) => setQuery(e.target.value)}
              className="flex-1 border border-line rounded-lg px-3 py-2 text-sm"
            />
            <button onClick={doSearch} disabled={busy}
              className="px-4 py-2 rounded-lg bg-charcoal text-white text-sm font-semibold disabled:opacity-50">
              검색
            </button>
            <button onClick={doIndex} disabled={busy}
              className="px-4 py-2 rounded-lg border border-line text-sm font-semibold">
              색인
            </button>
          </div>

          {search && (
            <>
              <div className="grid grid-cols-3 gap-3 mb-3">
                <Stat label="필터 전" value={search.candidates_before_filter} />
                <Stat label="필터 후" value={search.candidates_after_filter} />
                <Stat label="축소율" value={`${(search.filter_reduction * 100).toFixed(1)}%`} />
              </div>
              {search.grounded ? (
                <p className="text-sm text-emerald-700">근거 충분</p>
              ) : (
                <p className="text-sm text-amber-700">
                  기권 — {search.reason}
                  <span className="block text-xs text-gray-400 mt-0.5">
                    검색은 언제나 뭔가를 돌려준다. 쓸 만한지는 따로 판정한다.
                  </span>
                </p>
              )}
              <div className="mt-3 space-y-1">
                {search.hits.map((h) => (
                  <div key={h.chunk_id} className="text-xs border border-gray-100 rounded px-2 py-1.5">
                    <span className="font-mono text-gray-500">{h.property_id} · {h.doc_type} · {h.score.toFixed(4)}</span>
                    <div className="text-gray-700 mt-0.5">{h.text}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </section>

        <section className="bg-white rounded-2xl border border-line p-6">
          <h2 className="text-[11px] font-semibold text-ink-faint uppercase tracking-[0.16em] mb-5">생성</h2>
          <div className="flex gap-2 mb-4">
            <input
              value={propertyId} onChange={(e) => setPropertyId(e.target.value)}
              placeholder="숙소 ID"
              className="w-32 border border-line rounded-lg px-3 py-2 text-sm"
            />
            <select value={segment}
              onChange={(e) => setSegment(e.target.value as Schemas['Segment'])}
              className="border border-line rounded-lg px-3 py-2 text-sm">
              {SEGMENTS.map((s) => <option key={s}>{s}</option>)}
            </select>
            <select value={format}
              onChange={(e) => setFormat(e.target.value as Schemas['ContentFormat'])}
              className="border border-line rounded-lg px-3 py-2 text-sm">
              {FORMATS.map((f) => <option key={f}>{f}</option>)}
            </select>
            <button onClick={doGenerate} disabled={busy}
              className="px-4 py-2 rounded-lg bg-charcoal text-white text-sm font-semibold disabled:opacity-50">
              문구 생성
            </button>
          </div>

          {result && (
            <div className="grid md:grid-cols-5 gap-4">
              <div className="md:col-span-3">
                <textarea readOnly value={result.content}
                  className="w-full h-40 border border-line rounded-lg p-3 text-sm bg-mist" />
              </div>
              <div className="md:col-span-2">
                {result.valid ? (
                  <div className="rounded-lg border border-emerald-300 bg-emerald-50 p-3">
                    <p className="font-bold text-emerald-800 text-sm">검증 통과</p>
                    <p className="text-xs text-emerald-900/70 mt-1">
                      시도 {result.attempts}회 · 백엔드 <code>{result.backend}</code>
                    </p>
                  </div>
                ) : (
                  <div className="rounded-lg border border-red-300 bg-red-50 p-3">
                    {/*
                      `violations` 는 계약에서 선택 필드다. 서비스가 "거부"만 주고
                      사유를 생략할 수 있으므로 없을 때도 화면이 서야 한다 —
                      예전에는 `.length` 에서 그대로 죽었다.
                    */}
                    <p className="font-bold text-red-800 text-sm">
                      거부 — 위반 {result.violations?.length ?? 0}건
                    </p>
                    <ul className="mt-2 space-y-1">
                      {(result.violations ?? []).map((v, i) => (
                        <li key={i} className="text-xs text-red-900/80">
                          <b>{v.type}</b> — {v.detail}
                        </li>
                      ))}
                    </ul>
                    <p className="text-xs text-red-900/60 mt-2">
                      재생성 후에도 어긋나면 내보내지 않는다.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      </div>
    </AdminLayout>
  )
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="border border-line rounded-lg px-3 py-2">
      <div className="text-[12px] leading-[1.6] text-ink-faint uppercase tracking-wide">{label}</div>
      <div className="text-lg font-bold tabular-nums">{value}</div>
    </div>
  )
}
