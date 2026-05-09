import { Timestamp } from 'firebase/firestore'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { formatTimestamp } from './format-timestamp'

const MINUTE_MS = 60_000
const HOUR_MS = 60 * MINUTE_MS
const DAY_MS = 24 * HOUR_MS

describe('formatTimestamp', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns "just now" for timestamps within the last minute', () => {
    const now = new Date('2026-05-09T12:00:00.000Z')
    vi.useFakeTimers({ now })
    const ts = Timestamp.fromMillis(now.getTime() - 30_000)
    expect(formatTimestamp(ts)).toBe('just now')
  })

  it('returns "X minutes ago" for timestamps within the last hour', () => {
    const now = new Date('2026-05-09T12:00:00.000Z')
    vi.useFakeTimers({ now })
    expect(formatTimestamp(Timestamp.fromMillis(now.getTime() - 60_000))).toBe('1 minute ago')
    expect(formatTimestamp(Timestamp.fromMillis(now.getTime() - 5 * MINUTE_MS))).toBe(
      '5 minutes ago',
    )
  })

  it('returns "X hours ago" for timestamps within the last day (English)', () => {
    const now = new Date('2026-05-09T12:00:00.000Z')
    vi.useFakeTimers({ now })
    expect(formatTimestamp(Timestamp.fromMillis(now.getTime() - HOUR_MS))).toBe('1 hour ago')
    expect(formatTimestamp(Timestamp.fromMillis(now.getTime() - 3 * HOUR_MS))).toBe('3 hours ago')
  })

  it('treats future timestamps as "just now" (non-negative diff)', () => {
    const now = new Date('2026-05-09T12:00:00.000Z')
    vi.useFakeTimers({ now })
    const ts = Timestamp.fromMillis(now.getTime() + MINUTE_MS)
    expect(formatTimestamp(ts)).toBe('just now')
  })

  it('returns Swedish relative phrases when locale is sv', () => {
    const now = new Date('2026-05-09T12:00:00.000Z')
    vi.useFakeTimers({ now })
    expect(formatTimestamp(Timestamp.fromMillis(now.getTime() - 20_000), 'sv')).toBe('just nu')
    expect(formatTimestamp(Timestamp.fromMillis(now.getTime() - MINUTE_MS), 'sv')).toBe(
      '1 minut sedan',
    )
    expect(formatTimestamp(Timestamp.fromMillis(now.getTime() - 5 * MINUTE_MS), 'sv')).toBe(
      '5 minuter sedan',
    )
    expect(formatTimestamp(Timestamp.fromMillis(now.getTime() - HOUR_MS), 'sv')).toBe(
      '1 timme sedan',
    )
    expect(formatTimestamp(Timestamp.fromMillis(now.getTime() - 3 * HOUR_MS), 'sv')).toBe(
      '3 timmar sedan',
    )
  })

  it('returns a formatted date string for timestamps older than 24 hours', () => {
    const now = new Date('2026-05-09T12:00:00.000Z')
    vi.useFakeTimers({ now })
    const thenMs = now.getTime() - 25 * 60 * 60_000
    const ts = Timestamp.fromMillis(thenMs)
    const expected = new Date(thenMs).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
    expect(formatTimestamp(ts)).toBe(expected)
  })

  it('uses Swedish date formatting when older than 24 hours and locale is sv', () => {
    const now = new Date('2026-05-09T12:00:00.000Z')
    vi.useFakeTimers({ now })
    const thenMs = now.getTime() - DAY_MS - HOUR_MS
    const ts = Timestamp.fromMillis(thenMs)
    const expected = new Date(thenMs).toLocaleDateString('sv-SE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
    expect(formatTimestamp(ts, 'sv')).toBe(expected)
  })
})
