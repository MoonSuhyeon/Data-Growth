/** BFF — forecast 서비스로 넘긴다. 화면은 이 경로만 안다. */
import { proxy } from '@/lib/services'

type Ctx = { params: Promise<{ path: string[] }> }

function target(url: string, path: string[]) {
  const qs = new URL(url).search
  return '/' + path.join('/') + qs
}

export async function GET(req: Request, { params }: Ctx) {
  const { path } = await params
  return proxy('forecast', target(req.url, path))
}

export async function POST(req: Request, { params }: Ctx) {
  const { path } = await params
  return proxy('forecast', target(req.url, path), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: await req.text(),
  })
}
