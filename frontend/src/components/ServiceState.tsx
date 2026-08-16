'use client'

/**
 * 서비스가 안 떠 있을 때 화면이 하는 말.
 *
 * 빈 화면이나 무한 로딩 대신 **무엇이 없는지** 말한다. "데이터가 없다"와
 * "서비스가 안 떠 있다"는 다른 상태이고, 보는 사람이 구분할 수 있어야 한다.
 */
export function ServiceDownNotice({ detail }: { detail?: string }) {
  return (
    <div className="rounded-xl border border-amber-300 bg-amber-50 p-5">
      <p className="font-bold text-amber-800 mb-1">서비스에 연결할 수 없습니다</p>
      <p className="text-sm text-amber-900/80">{detail ?? '해당 서비스가 실행 중인지 확인하세요.'}</p>
      <p className="text-xs text-amber-900/60 mt-3">
        이 화면은 여러 서비스를 호출합니다. 하나가 꺼져 있어도 나머지는 그대로 동작합니다.
      </p>
    </div>
  )
}

export function Loading({ label = '불러오는 중' }: { label?: string }) {
  return <p className="text-sm text-gray-400 py-8 text-center">{label}…</p>
}

export function Empty({ label }: { label: string }) {
  return <p className="text-sm text-gray-400 py-8 text-center">{label}</p>
}

/** BFF 응답을 상태로 바꾼다. 503 은 서비스 다운, 그 외 오류는 그대로 던진다. */
export async function fetchService<T>(url: string, init?: RequestInit): Promise<T> {
  const r = await fetch(url, init)
  const body = await r.json().catch(() => ({}))
  if (r.status === 503 && body?.error === 'service_unavailable') {
    throw new ServiceUnavailable(body.detail ?? '서비스에 연결할 수 없습니다')
  }
  if (!r.ok) throw new Error(body?.detail ?? `요청이 실패했습니다 (${r.status})`)
  return body as T
}

export class ServiceUnavailable extends Error {}
