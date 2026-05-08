import { type NextRequest, NextResponse } from 'next/server'

import { getAuthToken } from '@/common/utils/get-auth-token'

const PROTECTED_PREFIXES = ['/dashboard', '/room'] as const

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = await getAuthToken(request)
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))

  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (pathname === '/' && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/dashboard/:path*', '/room/:path*'],
}
