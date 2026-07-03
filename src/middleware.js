import { NextResponse } from 'next/server'

const PROTECTED_ROUTES = ['/dashboard', '/super-admin']
const AUTH_ROUTES = ['/login', '/register']

export function middleware(request) {
  const { pathname } = request.nextUrl

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/images') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // === Simple cookie check for protected routes ===
  const isProtected = PROTECTED_ROUTES.some(p => pathname === p || pathname.startsWith(p + '/'))
  const isAuthRoute = AUTH_ROUTES.some(p => pathname === p || pathname.startsWith(p + '/'))

  const cookieHeader = request.headers.get('cookie') || ''
  const hasToken = cookieHeader.includes('ppro_access_token=')

  if (isProtected && !hasToken) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isAuthRoute && hasToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // === Legacy locale routes ===
  const pathnameHasLocale = ['es', 'en'].some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) {
    if (pathname === '/es/proyectos') return NextResponse.rewrite(new URL('/es/projects', request.url))
    if (pathname.startsWith('/es/proyectos/')) {
      const slug = pathname.replace('/es/proyectos/', '')
      return NextResponse.rewrite(new URL(`/es/projects/${slug}`, request.url))
    }
    if (pathname === '/es/articulos') return NextResponse.rewrite(new URL('/es/posts', request.url))
    if (pathname.startsWith('/es/articulos/')) {
      const slug = pathname.replace('/es/articulos/', '')
      return NextResponse.rewrite(new URL(`/es/posts/${slug}`, request.url))
    }
    return NextResponse.next()
  }

  // Standalone routes pass through
  const standalone = ['/login', '/register', '/dashboard', '/super-admin']
  if (pathname === '/' || standalone.includes(pathname) || standalone.some(r => pathname.startsWith(r + '/'))) {
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next|api|images|.*\\.).*)'],
}
