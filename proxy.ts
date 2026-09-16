import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const ONBOARDING_COOKIE_KEY = 'stavarkling_onboarding_complete'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const completed = request.cookies.get(ONBOARDING_COOKIE_KEY)?.value === '1'
  const isOnboarding = pathname.startsWith('/onboarding')

  if (!completed && !isOnboarding) {
    const url = request.nextUrl.clone()
    url.pathname = '/onboarding'
    return NextResponse.redirect(url)
  }

  if (completed && isOnboarding) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|images|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
