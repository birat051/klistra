/**
 * Absolute site origin (no trailing slash) for `metadataBase`, canonical URLs,
 * sitemap entries, and `robots.txt`.
 *
 * Production: set `NEXT_PUBLIC_SITE_URL` (e.g. `https://klistra.example`).
 * On Vercel, `VERCEL_URL` is used when the public URL env is unset.
 */
export function getSiteOrigin(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (explicit != null && explicit !== '') {
    return explicit.replace(/\/+$/, '')
  }

  const vercel = process.env.VERCEL_URL?.trim()
  if (vercel != null && vercel !== '') {
    const host = vercel.replace(/^https?:\/\//i, '')
    return `https://${host}`
  }

  return 'http://localhost:3000'
}

export function getMetadataBase(): URL {
  return new URL(`${getSiteOrigin()}/`)
}
