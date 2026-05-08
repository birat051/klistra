import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono, Newsreader } from 'next/font/google'
import { headers } from 'next/headers'

import {
  SITE_DEFAULT_DESCRIPTION,
  SITE_DEFAULT_TITLE,
} from '@/common/content/site-default-metadata'
import { getMetadataBase } from '@/common/utils/site-origin'

import '@/modules/landing/klistra-landing.css'
import './globals.css'

const newsreader = Newsreader({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-newsreader',
  weight: ['300', '400', '500', '600'],
})

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: {
    default: SITE_DEFAULT_TITLE,
    template: '%s · Klistra',
  },
  description: SITE_DEFAULT_DESCRIPTION,
  applicationName: 'Klistra',
  robots: { index: true, follow: true },
}

/** Matches `design/Landing Page.html` — required for correct mobile/tablet scaling. */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const requestHeaders = await headers()
  const htmlLang = requestHeaders.get('x-klistra-html-lang') === 'sv' ? 'sv' : 'en'

  return (
    <html
      lang={htmlLang}
      className={`${newsreader.variable} ${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
