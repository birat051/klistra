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

  it('Unauthenticated request to `/dashboard` redirects to `/en/dashboard`', async () => {
    getAuthTokenMock.mockResolvedValue(null)
    const request = new NextRequest(new URL(`${base}/dashboard`))
    const response = await proxy(request)

    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toBe(`${base}/en/dashboard`)
  })

  it('Unauthenticated request to `/en/dashboard` redirects to `/en`', async () => {
    getAuthTokenMock.mockResolvedValue(null)
    const request = new NextRequest(new URL(`${base}/en/dashboard`))
    const response = await proxy(request)

    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toBe(`${base}/en`)
  })

  it('Unauthenticated request to `/sv/dashboard` redirects to `/sv`', async () => {
    getAuthTokenMock.mockResolvedValue(null)
    const request = new NextRequest(new URL(`${base}/sv/dashboard`))
    const response = await proxy(request)

    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toBe(`${base}/sv`)
  })

  it('Authenticated request to `/` redirects to `/en/dashboard`', async () => {
    getAuthTokenMock.mockResolvedValue(decodedToken())
    const request = new NextRequest(new URL(`${base}/`))
    const response = await proxy(request)

    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toBe(`${base}/en/dashboard`)
  })

  it('Authenticated request to `/en` redirects to `/en/dashboard`', async () => {
    getAuthTokenMock.mockResolvedValue(decodedToken())
    const request = new NextRequest(new URL(`${base}/en`))
    const response = await proxy(request)

    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toBe(`${base}/en/dashboard`)
  })

  it('Authenticated request to `/sv` redirects to `/sv/dashboard`', async () => {
    getAuthTokenMock.mockResolvedValue(decodedToken())
    const request = new NextRequest(new URL(`${base}/sv`))
    const response = await proxy(request)

    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toBe(`${base}/sv/dashboard`)
  })

  it('Authenticated request to `/en/dashboard` passes through', async () => {
    getAuthTokenMock.mockResolvedValue(decodedToken())
    const request = new NextRequest(new URL(`${base}/en/dashboard`))
    const response = await proxy(request)

    expect(response.status).toBe(200)
  })

  it('Unauthenticated request to `/` passes through (landing page is public)', async () => {
    getAuthTokenMock.mockResolvedValue(null)
    const request = new NextRequest(new URL(`${base}/`))
    const response = await proxy(request)

    expect(response.status).toBe(200)
  })

  it('Unauthenticated request to `/login` passes through', async () => {
    getAuthTokenMock.mockResolvedValue(null)
    const request = new NextRequest(new URL(`${base}/login`))
    const response = await proxy(request)

    expect(response.status).toBe(200)
  })

  it('Authenticated request to `/login` redirects to `/en/dashboard`', async () => {
    getAuthTokenMock.mockResolvedValue(decodedToken())
    const request = new NextRequest(new URL(`${base}/login`))
    const response = await proxy(request)

    expect(response.status).toBe(307)
    expect(response.headers.get('location')).toBe(`${base}/en/dashboard`)
  })
})

describe('proxy config', () => {
  it('exports matcher for landing locales, login, locale dashboards, legacy dashboard, and room routes', () => {
    expect(config.matcher).toEqual([
      '/',
      '/en',
      '/sv',
      '/login',
      '/dashboard/:path*',
      '/en/dashboard/:path*',
      '/sv/dashboard/:path*',
      '/room/:path*',
    ])
  })
})
