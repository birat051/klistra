import type { MetadataRoute } from 'next'

import { getSiteOrigin } from '@/common/utils/site-origin'

export default function robots(): MetadataRoute.Robots {
  const origin = getSiteOrigin()
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/dashboard', '/room/', '/_next/'],
      },
    ],
    sitemap: `${origin}/sitemap.xml`,
    host: origin,
  }
}
