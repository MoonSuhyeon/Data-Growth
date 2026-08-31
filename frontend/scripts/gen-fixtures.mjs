/**
 * 데모 픽스처를 **실제 서비스 응답에서 뽑아낸다.**
 *
 * 손으로 적으면 두 가지가 어긋난다.
 *
 *   1. **모양** — `FORECAST_LOW_DEMAND` 가 `{name, date, occupancy}` 로 적혀
 *      있던 적이 있다. 서비스는 `{region, stay_date, predicted, region_wape}` 를
 *      주는데, 화면이 `predicted.toFixed(2)` 를 불러 페이지가 통째로 죽었다.
 *   2. **분량** — 숙소 둘, 기회 넷으로는 화면이 비어 보인다. 실제 시드는
 *      숙소 41건, 후보 10건이다. 목이 그보다 얇으면 데모가 실물보다 초라해진다.
 *
 * 서비스를 띄운 상태에서 한 번 돌리면 `fixtures.generated.ts` 가 새로 써진다.
 * 그 파일은 **손으로 고치지 않는다** — 고칠 것이 있으면 시드나 서비스를 고치고
 * 다시 뽑는다.
 *
 *     # 백엔드·예측·콘텐츠를 띄운 뒤
 *     node scripts/gen-fixtures.mjs
 */
import { writeFileSync } from 'node:fs'
import { join } from 'node:path'

const BOOKING = process.env.BOOKING_API_URL ?? 'http://127.0.0.1:8000'
const FORECAST = process.env.FORECAST_API_URL ?? 'http://127.0.0.1:8001'
const CONTENT = process.env.CONTENT_API_URL ?? 'http://127.0.0.1:8002'

/** 기회 상세로 바로 들어오는 주소가 있어 첫 기회의 id 를 이 값으로 고정한다. */
const PINNED_ID = '150e1abf-373d-42f6-9dc9-5502dcb6b3b4'

/** 관리자 조회에 쓸 토큰. 시드가 만드는 계정으로 받는다. */
let adminToken = null

async function get(url, auth = false) {
  const r = await fetch(url, {
    headers: auth && adminToken ? { authorization: `Bearer ${adminToken}` } : {},
  })
  if (!r.ok) throw new Error(`${r.status} ${url}`)
  return r.json()
}

async function post(url, body) {
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body ?? {}),
  })
  return { status: r.status, body: await r.json().catch(() => null) }
}

/** 서비스가 죽어 있어도 나머지는 뽑는다 — 하나 때문에 전부 못 만들면 곤란하다. */
async function maybe(label, fn, fallback) {
  try {
    return await fn()
  } catch (e) {
    console.warn(`  건너뜀 ${label}: ${e.message}`)
    return fallback
  }
}

console.log('실제 서비스에서 픽스처를 뽑는다')

// ── 0. 관리자 로그인 ───────────────────────────────────────
// `/admin/*` 는 토큰을 요구한다. 시드 계정으로 받아 둔다.
adminToken = await maybe('admin login', async () => {
  const { body } = await post(`${BOOKING}/api/v1/auth/login`, {
    email: 'admin@stay.example', password: 'admin1234',
  })
  return body?.access_token ?? null
}, null)
console.log(adminToken ? '  관리자 토큰 확보' : '  관리자 토큰 없음 — /admin/* 는 건너뛴다')

// ── 1. 숙소 ────────────────────────────────────────────────
const properties = await get(`${BOOKING}/api/v1/properties?status=LISTED`)
console.log(`  숙소 ${properties.length}건`)

// ── 1-1. 운영 콘솔 대시보드 ────────────────────────────────
const adminStats = await maybe('admin/stats',
  () => get(`${BOOKING}/api/v1/admin/stats`, true), null)
const recentBookings = await maybe('admin/bookings/recent',
  () => get(`${BOOKING}/api/v1/admin/bookings/recent`, true), [])
console.log(`  대시보드 지표 ${adminStats ? 'O' : 'X'} · 최근 예약 ${recentBookings?.length ?? 0}건`)

// ── 1-2. 나머지 운영 화면 ──────────────────────────────────
//
// 목이 없으면 요청이 실제 백엔드로 새고, Vercel 에는 그게 없어 화면이 깨진다.
// 사이드바의 어느 항목을 눌러도 열려야 콘솔이라 부를 수 있다.
const ADMIN_PATHS = {
  GEN_ADMIN_USERS: '/api/v1/admin/users',
  GEN_ADMIN_PROPERTIES: '/api/v1/admin/properties',
  GEN_ADMIN_STAY_DATES: '/api/v1/admin/stay-dates',
  GEN_ADMIN_ROOM_TYPES: '/api/v1/admin/room-types',
  GEN_ADMIN_REFUNDS: '/api/v1/admin/refunds',
  GEN_ADMIN_PEAK_DATES: '/api/v1/admin/peak-dates',
  GEN_ADMIN_COUPONS: '/api/v1/admin/coupons',
  GEN_ADMIN_REVIEWS: '/api/v1/admin/reviews',
  GEN_ADMIN_BOARD_TYPES: '/api/v1/admin/board-types',
}
const adminExtra = {}
for (const [name, path] of Object.entries(ADMIN_PATHS)) {
  adminExtra[name] = await maybe(path, () => get(`${BOOKING}${path}`, true), [])
}
console.log('  운영 화면 ' + Object.entries(adminExtra)
  .map(([k, v]) => `${k.replace('GEN_ADMIN_', '').toLowerCase()} ${Array.isArray(v) ? v.length : '?'}`)
  .join(' · '))

// ── 2. 예측 ────────────────────────────────────────────────
const segByRegion = await maybe('forecast/segments?by=region',
  () => get(`${FORECAST}/forecast/segments?by=region`), null)
const segByType = await maybe('forecast/segments?by=property_type',
  () => get(`${FORECAST}/forecast/segments?by=property_type`), null)
const lowDemand = await maybe('forecast/low-demand',
  () => get(`${FORECAST}/forecast/low-demand?threshold=1.0&limit=40`), null)
const metrics = await maybe('forecast/metrics',
  () => get(`${FORECAST}/metrics`), null)
console.log(`  저수요 ${lowDemand?.rows?.length ?? 0}행 · 모델 ${metrics?.rows?.length ?? 0}종`)

// ── 3. 영업 ────────────────────────────────────────────────
// 후보 전부에 대해 기회를 만들어 본다. 실물이 거절하는 것은 거절된 채로 두고,
// 통과한 것만 목록에 담는다 — **거절 규칙까지 실물에서 가져오는 것이 요점이다.**
const forecastRows = await maybe('forecast rows',
  () => get(`${FORECAST}/forecast?limit=2000`), { rows: [] })
const wapeMap = {}
for (const r of segByRegion?.rows ?? []) wapeMap[r.key] = r.wape

const prospects = await get(`${BOOKING}/api/v1/sales/prospects`)
console.log(`  후보 ${prospects.length}건`)

for (const p of prospects) {
  if (p.has_open_opportunity || !p.contactable) continue
  const { status } = await post(`${BOOKING}/api/v1/sales/opportunities`, {
    prospect_id: p.id,
    forecast: { rows: forecastRows.rows ?? [], wape_by_region: wapeMap },
  })
  if (status !== 201 && status !== 409) console.log(`    ${p.name}: ${status}`)
}

const opportunities = await get(`${BOOKING}/api/v1/sales/opportunities`)
const details = {}
for (const o of opportunities) {
  details[o.id] = await get(`${BOOKING}/api/v1/sales/opportunities/${o.id}`)
}
console.log(`  기회 ${opportunities.length}건`)

// 첫 기회의 id 를 고정 UUID 로 바꾼다. 심사용 주소가 그 값을 가리킨다.
if (opportunities.length) {
  const first = opportunities[0]
  const old = first.id
  first.id = PINNED_ID
  details[PINNED_ID] = { ...details[old], id: PINNED_ID }
  delete details[old]
}

// ── 4. 콘텐츠 ──────────────────────────────────────────────
const contentSearch = await maybe('content/search', async () => {
  await post(`${CONTENT}/index`, {})
  const r = await fetch(`${CONTENT}/search`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ query: '수영장 있는 숙소', segment: 'FAMILY', top_k: 5 }),
  })
  if (!r.ok) throw new Error(`${r.status}`)
  return r.json()
}, null)
console.log(`  콘텐츠 검색 ${contentSearch?.hits?.length ?? 0}건`)

// ── 5. 파일로 쓴다 ─────────────────────────────────────────
const j = (v) => JSON.stringify(v, null, 2)

// 템플릿 안에서 join 하면 줄바꿈이 리터럴로 박힌다. 밖에서 만들어 둔다.
const adminBlock = Object.entries(adminExtra)
  .map(([n, v]) => `export const ${n} = ${j(v)}`)
  .join(`

`)

const out = `/* 이 파일은 \`scripts/gen-fixtures.mjs\` 가 만든다. **손으로 고치지 않는다.**
 *
 * 실제 서비스 응답을 그대로 받아 적은 것이라 모양과 분량이 실물과 같다.
 * 고칠 것이 있으면 시드나 서비스를 고치고 다시 뽑는다.
 *
 *     node scripts/gen-fixtures.mjs
 *
 * 생성 시각: ${new Date().toISOString()}
 */

/** 기회 상세로 바로 들어오는 주소가 있어 id 를 고정한다. */
export const DEMO_OPPORTUNITY_ID = ${j(PINNED_ID)}

export const GEN_PROPERTIES = ${j(properties)}

export const GEN_ADMIN_STATS = ${j(adminStats)}

export const GEN_RECENT_BOOKINGS = ${j(recentBookings)}

${adminBlock}

export const GEN_FORECAST_SEGMENTS = ${j(segByRegion)}

export const GEN_FORECAST_SEGMENTS_BY_TYPE = ${j(segByType)}

export const GEN_FORECAST_LOW_DEMAND = ${j(lowDemand)}

export const GEN_FORECAST_METRICS = ${j(metrics)}

export const GEN_SALES_PROSPECTS = ${j(prospects)}

export const GEN_SALES_OPPORTUNITIES = ${j(opportunities)}

export const GEN_SALES_OPPORTUNITY_DETAIL: Record<string, Record<string, unknown>> =
  ${j(details)}

export const GEN_CONTENT_SEARCH = ${j(contentSearch)}
`

const target = join(process.cwd(), 'src', 'mocks', 'fixtures.generated.ts')
writeFileSync(target, out, 'utf-8')
console.log(`\n${target} 에 썼다`)
