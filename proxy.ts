import { type NextRequest, NextResponse } from 'next/server'

import { getAuthToken } from '@/common/utils/get-auth-token'

const PROTECTED_PREFIXES = ['/dashboard', '/room'] as const

/** Public entry paths for the marketing landing (locale segments + legacy `/`). */
const LANDING_ENTRY_PATHNAMES = new Set(['/', '/en', '/sv'])

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = await getAuthToken(request)
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))

  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/en', request.url))
  }

  if (LANDING_ENTRY_PATHNAMES.has(pathname) && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if (pathname === '/login' && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  const htmlLang = pathname === '/sv' || pathname.startsWith('/sv/') ? 'sv' : 'en'
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-klistra-html-lang', htmlLang)
  return NextResponse.next({ request: { headers: requestHeaders } })
}

export const config = {
  matcher: ['/', '/en', '/sv', '/login', '/dashboard/:path*', '/room/:path*'],
}
