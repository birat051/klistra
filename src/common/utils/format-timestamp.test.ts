import { Timestamp } from 'firebase/firestore'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { formatTimestamp } from './format-timestamp'

const MINUTE_MS = 60_000

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
})
