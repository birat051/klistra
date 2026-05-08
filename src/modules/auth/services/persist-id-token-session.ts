import { getAuth } from 'firebase-admin/auth'
import { NextResponse } from 'next/server'

import { ensureFirebaseAdminInitialized } from '@/common/services/firebase-admin-app'

/**
 * Validates an OAuth ID token and sets the `__session` cookie read by `getAuthToken` / `proxy.ts`.
 */
export async function persistIdTokenSessionCookie(idToken: string): Promise<NextResponse> {
  if (!ensureFirebaseAdminInitialized()) {
    return NextResponse.json({ error: 'auth_server_unconfigured' }, { status: 503 })
  }

  try {
    const decoded = await getAuth().verifyIdToken(idToken)
    const nowSec = Math.floor(Date.now() / 1000)
    const maxAge = Math.max(60, decoded.exp - nowSec)

    const response = NextResponse.json({ ok: true })
    response.cookies.set('__session', idToken, {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      maxAge,
    })
    return response
  } catch {
    return NextResponse.json({ error: 'invalid_id_token' }, { status: 401 })
  }
}
