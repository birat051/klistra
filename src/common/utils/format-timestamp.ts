import { Timestamp } from 'firebase/firestore'

const MINUTE_MS = 60_000
const HOUR_MS = 60 * MINUTE_MS
const DAY_MS = 24 * HOUR_MS

/** Locales supported for relative + absolute date phrasing (matches landing `en` / `sv`). */
export type IFormatTimestampLocale = 'en' | 'sv'

function formatAbsoluteDate(millis: number, locale: IFormatTimestampLocale): string {
  const tag = locale === 'sv' ? 'sv-SE' : 'en-US'
  return new Date(millis).toLocaleDateString(tag, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function formatRelative(diffMs: number, locale: IFormatTimestampLocale): string | null {
  if (locale === 'sv') {
    if (diffMs < MINUTE_MS) {
      return 'just nu'
    }
    if (diffMs < HOUR_MS) {
      const minutes = Math.floor(diffMs / MINUTE_MS)
      const unit = minutes === 1 ? 'minut' : 'minuter'
      return `${minutes} ${unit} sedan`
    }
    if (diffMs < DAY_MS) {
      const hours = Math.floor(diffMs / HOUR_MS)
      const unit = hours === 1 ? 'timme' : 'timmar'
      return `${hours} ${unit} sedan`
    }
    return null
  }

  if (diffMs < MINUTE_MS) {
    return 'just now'
  }
  if (diffMs < HOUR_MS) {
    const minutes = Math.floor(diffMs / MINUTE_MS)
    const unit = minutes === 1 ? 'minute' : 'minutes'
    return `${minutes} ${unit} ago`
  }
  if (diffMs < DAY_MS) {
    const hours = Math.floor(diffMs / HOUR_MS)
    const unit = hours === 1 ? 'hour' : 'hours'
    return `${hours} ${unit} ago`
  }
  return null
}

export function formatTimestamp(
  timestamp: Timestamp,
  locale: IFormatTimestampLocale = 'en',
): string {
  const now = Date.now()
  const then = timestamp.toMillis()
  let diffMs = now - then
  if (diffMs < 0) {
    diffMs = 0
  }

  const relative = formatRelative(diffMs, locale)
  if (relative !== null) {
    return relative
  }

  return formatAbsoluteDate(then, locale)
}
