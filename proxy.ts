import { type NextRequest, NextResponse } from 'next/server'

import { getAuthToken } from '@/common/utils/get-auth-token'

/** Public entry paths for the marketing landing (locale segments + legacy `/`). */
const LANDING_ENTRY_PATHNAMES = new Set(['/', '/en', '/sv'])

function isProtectedPathname(pathname: string): boolean {
  if (pathname === '/room' || pathname.startsWith('/room/')) {
    return true
  }
  if (pathname === '/en/dashboard' || pathname.startsWith('/en/dashboard/')) {
    return true
  }
  if (pathname === '/sv/dashboard' || pathname.startsWith('/sv/dashboard/')) {
    return true
  }
  return false
}

function unauthenticatedLandingPath(pathname: string): '/en' | '/sv' {
  if (pathname === '/sv' || pathname.startsWith('/sv/')) {
    return '/sv'
  }
  return '/en'
}

function authenticatedDashboardPathFromLanding(
  pathname: string,
): '/en/dashboard' | '/sv/dashboard' {
  if (pathname === '/sv' || pathname.startsWith('/sv/')) {
    return '/sv/dashboard'
  }
  return '/en/dashboard'
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = await getAuthToken(request)

  if (pathname === '/dashboard' || pathname.startsWith('/dashboard/')) {
    const suffix = pathname === '/dashboard' ? '' : pathname.slice('/dashboard'.length)
    return NextResponse.redirect(new URL(`/en/dashboard${suffix}`, request.url))
  }

  const isProtected = isProtectedPathname(pathname)

  if (isProtected && !token) {
    const dest = unauthenticatedLandingPath(pathname)
    return NextResponse.redirect(new URL(dest, request.url))
  }

  if (LANDING_ENTRY_PATHNAMES.has(pathname) && token) {
    const dest =
      pathname === '/' ? '/en/dashboard' : authenticatedDashboardPathFromLanding(pathname)
    return NextResponse.redirect(new URL(dest, request.url))
  }

  if (pathname === '/login' && token) {
    return NextResponse.redirect(new URL('/en/dashboard', request.url))
  }

  const htmlLang = pathname === '/sv' || pathname.startsWith('/sv/') ? 'sv' : 'en'
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-klistra-html-lang', htmlLang)
  return NextResponse.next({ request: { headers: requestHeaders } })
}

export const config = {
  matcher: [
    '/',
    '/en',
    '/sv',
    '/login',
    '/dashboard/:path*',
    '/en/dashboard/:path*',
    '/sv/dashboard/:path*',
    '/room/:path*',
  ],
}
