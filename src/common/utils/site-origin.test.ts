import { afterEach, describe, expect, it, vi } from 'vitest'

import { getMetadataBase, getSiteOrigin } from './site-origin'

describe('site-origin', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('uses NEXT_PUBLIC_SITE_URL when set', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', 'https://example.com/')
    vi.stubEnv('VERCEL_URL', undefined)
    expect(getSiteOrigin()).toBe('https://example.com')
    expect(getMetadataBase().toString()).toBe('https://example.com/')
  })

  it('falls back to VERCEL_URL when NEXT_PUBLIC_SITE_URL is unset', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', '')
    vi.stubEnv('VERCEL_URL', 'app.vercel.app')
    expect(getSiteOrigin()).toBe('https://app.vercel.app')
  })

  it('falls back to localhost when no public URL is configured', () => {
    vi.stubEnv('NEXT_PUBLIC_SITE_URL', '')
    vi.stubEnv('VERCEL_URL', '')
    expect(getSiteOrigin()).toBe('http://localhost:3000')
  })
})
