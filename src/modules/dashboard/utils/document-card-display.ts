/** First word of owner name, or "?" when empty — document card meta line. */
export function documentCardOwnerFirstName(displayName: string): string {
  const first = displayName.trim().split(/\s+/)[0]
  return first || '?'
}

/** Deterministic `oklch` background from display name — owner avatar blob. */
export function documentCardAvatarBackground(displayName: string): string {
  let h = 0
  for (let i = 0; i < displayName.length; i += 1) {
    h = displayName.charCodeAt(i) + ((h << 5) - h)
  }
  const hue = Math.abs(h) % 360
  return `oklch(58% 0.12 ${hue})`
}
