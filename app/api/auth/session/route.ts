import { persistIdTokenSessionCookie } from '@/modules/auth/services/persist-id-token-session'

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'invalid_json' }, { status: 400 })
  }

  if (typeof body !== 'object' || body === null || !('idToken' in body)) {
    return Response.json({ error: 'missing_id_token' }, { status: 400 })
  }

  const idToken = (body as { idToken: unknown }).idToken
  if (typeof idToken !== 'string' || idToken.length < 24) {
    return Response.json({ error: 'missing_id_token' }, { status: 400 })
  }

  return persistIdTokenSessionCookie(idToken)
}
