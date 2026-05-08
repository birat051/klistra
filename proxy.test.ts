import { NextRequest } from 'next/server'
import type { DecodedIdToken } from 'firebase-admin/auth'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const getAuthTokenMock = vi.hoisted(() => vi.fn())

vi.mock('@/common/utils/get-auth-token', () => ({
  getAuthToken: getAuthTokenMock,
}))

import { config, proxy } from './proxy'

const base = 'http://localhost:3000'

function decodedToken(): DecodedIdToken {
  return {
    uid: 'user-1',
    aud: 'proj',
    auth_time: 1,
    exp: 9999999999,
    firebase: { sign_in_provider: 'google.com', identities: {} },
    iat: 1,
    iss: 'https://securetoken.google.com/proj',
    sub: 'user-1',
  }
}

describe('proxy', () => {
  beforeEach(() => {
    getAuthTokenMock.mockReset()
  })

  it('Unauthenticated request to `/dashboard` redirects to `/`', async () => {
    getAuthTokenMock.mockResolvedValue(null)
    const request = new NextRequest(new URL(`${base}/dashboard`))
    const response = await proxy(request)

    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toBe(`${base}/`)
  })

  it('Authenticated request to `/` redirects to `/dashboard`', async () => {
    getAuthTokenMock.mockResolvedValue(decodedToken())
    const request = new NextRequest(new URL(`${base}/`))
    const response = await proxy(request)

    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toBe(`${base}/dashboard`)
  })

  it('Authenticated request to `/dashboard` passes through', async () => {
    getAuthTokenMock.mockResolvedValue(decodedToken())
    const request = new NextRequest(new URL(`${base}/dashboard`))
    const response = await proxy(request)

    expect(response.status).toBe(200)
  })

  it('Unauthenticated request to `/` passes through (landing page is public)', async () => {
    getAuthTokenMock.mockResolvedValue(null)
    const request = new NextRequest(new URL(`${base}/`))
    const response = await proxy(request)

    expect(response.status).toBe(200)
  })
})

describe('proxy config', () => {
  it('exports matcher for landing, dashboard, and room routes', () => {
    expect(config.matcher).toEqual(['/', '/dashboard/:path*', '/room/:path*'])
  })
})
