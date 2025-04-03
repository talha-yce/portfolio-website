import { type NextRequest, NextResponse } from "next/server"
import { locales, defaultLocale } from "@/lib/i18n/config"

export function middleware(request: NextRequest) {
  // Get the pathname from the request
  const { pathname } = request.nextUrl

  // Skip middleware for sitemap.xml and robots.txt
  if (pathname === "/sitemap.xml" || pathname === "/robots.txt") {
    return NextResponse.next()
  }

  // Check if the pathname already has a locale
  const pathnameHasLocale = locales.some((locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`)

  // If the pathname doesn't have a locale, redirect to the default locale
  if (!pathnameHasLocale) {
    // Special case for the root path
    if (pathname === "/") {
      return NextResponse.rewrite(new URL(`/${defaultLocale}`, request.url))
    }

    // For all other paths, add the default locale
    return NextResponse.rewrite(new URL(`/${defaultLocale}${pathname}`, request.url))
  }

  return NextResponse.next()
}

export const config = {
  // Match all request paths except for:
  // - API routes
  // - Static files (e.g. images, fonts, etc.)
  // - _next paths (Next.js internals)
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|data/images|icon-|logo|apple-touch-icon).*)"],
}

