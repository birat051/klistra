import { describe, expect, it, vi } from 'vitest'

const ensureMock = vi.hoisted(() => vi.fn())
const verifyIdTokenMock = vi.hoisted(() => vi.fn())

vi.mock('@/common/services/firebase-admin-app', () => ({
  ensureFirebaseAdminInitialized: () => ensureMock(),
}))

vi.mock('firebase-admin/auth', () => ({
  getAuth: () => ({
    verifyIdToken: (t: string) => verifyIdTokenMock(t),
  }),
}))

import { persistIdTokenSessionCookie } from './persist-id-token-session'

describe('persistIdTokenSessionCookie', () => {
  it('returns 503 when Firebase Admin is not configured', async () => {
    ensureMock.mockReturnValue(false)
    const res = await persistIdTokenSessionCookie('x'.repeat(40))
    expect(res.status).toBe(503)
  })

  it('returns 401 when the ID token fails verification', async () => {
    ensureMock.mockReturnValue(true)
    verifyIdTokenMock.mockRejectedValue(new Error('bad'))
    const res = await persistIdTokenSessionCookie('x'.repeat(40))
    expect(res.status).toBe(401)
  })

  it('sets __session cookie when verification succeeds', async () => {
    ensureMock.mockReturnValue(true)
    const now = Math.floor(Date.now() / 1000)
    verifyIdTokenMock.mockResolvedValue({ exp: now + 3600 })
    const token = 'signed.jwt.payload'
    const res = await persistIdTokenSessionCookie(token)
    expect(res.status).toBe(200)
    expect(res.cookies.get('__session')?.value).toBe(token)
  })
})
