import type { NextRequest } from 'next/server'
import type { DecodedIdToken } from 'firebase-admin/auth'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const adminMocks = vi.hoisted(() => ({
  verifyIdToken: vi.fn(),
  getApps: vi.fn(),
  initializeApp: vi.fn((options: unknown) => {
    void options
    return undefined
  }),
  cert: vi.fn((credential: unknown) => {
    void credential
    return {}
  }),
}))

vi.mock('firebase-admin/app', () => ({
  cert: (credential: unknown) => adminMocks.cert(credential),
  getApps: () => adminMocks.getApps(),
  initializeApp: (options: unknown) => adminMocks.initializeApp(options),
}))

vi.mock('firebase-admin/auth', () => ({
  getAuth: () => ({
    verifyIdToken: (idToken: string) => adminMocks.verifyIdToken(idToken),
  }),
}))

import { getAuthToken } from './get-auth-token'

function mockRequest(sessionCookie: string | undefined): NextRequest {
  return {
    cookies: {
      get(name: string) {
        if (name !== '__session' || sessionCookie === undefined) {
          return undefined
        }
        return { name: '__session', value: sessionCookie }
      },
    },
  } as unknown as NextRequest
}

describe('getAuthToken', () => {
  const originalServiceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY

  beforeEach(() => {
    adminMocks.verifyIdToken.mockReset()
    adminMocks.getApps.mockReset()
    adminMocks.initializeApp.mockClear()
    adminMocks.cert.mockClear()
    adminMocks.getApps.mockReturnValue([{ name: '[DEFAULT]' }])
    delete process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  })

  afterEach(() => {
    if (originalServiceAccount === undefined) {
      delete process.env.FIREBASE_SERVICE_ACCOUNT_KEY
    } else {
      process.env.FIREBASE_SERVICE_ACCOUNT_KEY = originalServiceAccount
    }
  })

  it('returns a decoded token object when a valid `__session` cookie is present', async () => {
    const decoded: DecodedIdToken = {
      uid: 'user-1',
      aud: 'proj',
      auth_time: 1,
      exp: 9999999999,
      firebase: {
        sign_in_provider: 'google.com',
        identities: {},
      },
      iat: 1,
      iss: 'https://securetoken.google.com/proj',
      sub: 'user-1',
    }
    adminMocks.verifyIdToken.mockResolvedValue(decoded)

    const token = await getAuthToken(mockRequest('valid.jwt.segment'))

    expect(token).toEqual(decoded)
    expect(adminMocks.verifyIdToken).toHaveBeenCalledWith('valid.jwt.segment')
  })

  it('returns `null` when the cookie is absent', async () => {
    const token = await getAuthToken(mockRequest(undefined))

    expect(token).toBeNull()
    expect(adminMocks.verifyIdToken).not.toHaveBeenCalled()
  })

  it('returns `null` when the cookie value cannot be verified', async () => {
    adminMocks.verifyIdToken.mockRejectedValue(new Error('invalid token'))

    const token = await getAuthToken(mockRequest('bad.token'))

    expect(token).toBeNull()
    expect(adminMocks.verifyIdToken).toHaveBeenCalledWith('bad.token')
  })

  it('returns `null` when Firebase Admin is not initialised and no service account is configured', async () => {
    adminMocks.getApps.mockReturnValue([])

    const token = await getAuthToken(mockRequest('some.token'))

    expect(token).toBeNull()
    expect(adminMocks.verifyIdToken).not.toHaveBeenCalled()
  })
})
