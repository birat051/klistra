import type { MetadataRoute } from 'next'

import { getSiteOrigin } from '@/common/utils/site-origin'
import { LANDING_LOCALES } from '@/modules/landing/landing-i18n'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteOrigin()
  const lastModified = new Date()

  const locales = LANDING_LOCALES.map((locale) => ({
    url: `${base}/${locale}`,
    lastModified,
    changeFrequency: 'weekly' as const,
    priority: 1,
  }))

  return [
    { url: `${base}/`, lastModified, changeFrequency: 'weekly', priority: 1 },
    ...locales,
    { url: `${base}/login`, lastModified, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/llms.txt`, lastModified, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${base}/llms-full.txt`, lastModified, changeFrequency: 'monthly', priority: 0.3 },
  ]
}
