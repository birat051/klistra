import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { KlistraLandingDocument } from '@/modules/landing/components/klistra-landing-document'
import { isLandingLocale, LANDING_LOCALES, LANDING_PAGE_SEO } from '@/modules/landing/landing-i18n'

export const dynamic = 'force-static'

export function generateStaticParams() {
  return LANDING_LOCALES.map((locale) => ({ locale }))
}

interface I_LocaleLandingPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: I_LocaleLandingPageProps): Promise<Metadata> {
  const { locale: raw } = await params
  if (!isLandingLocale(raw)) {
    return {}
  }
  const seo = LANDING_PAGE_SEO[raw]
  const canonicalPath = `/${raw}`
  return {
    title: { absolute: seo.title },
    description: seo.description,
    alternates: {
      canonical: canonicalPath,
      languages: {
        en: '/en',
        sv: '/sv',
        'x-default': '/en',
      },
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: canonicalPath,
      siteName: 'Klistra',
      type: 'website',
      locale: raw === 'sv' ? 'sv_SE' : 'en_US',
      alternateLocale: raw === 'sv' ? ['en_US'] : ['sv_SE'],
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
    },
  }
}

export default async function LocaleLandingPage({ params }: I_LocaleLandingPageProps) {
  const { locale: raw } = await params
  if (!isLandingLocale(raw)) {
    notFound()
  }
  return <KlistraLandingDocument locale={raw} />
}
