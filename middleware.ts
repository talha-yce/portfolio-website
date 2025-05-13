import { NextRequest, NextResponse } from 'next/server'
import { match as matchLocale } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
import { locales, defaultLocale } from "@/lib/i18n/config"
import jwt from 'jsonwebtoken'

// JWT secret ile aynı olmalı
const JWT_SECRET = process.env.JWT_SECRET || 'talha-yuce-portfolio-admin-secret-key-8290'

function getLocale(request: NextRequest): string {
  // Negotiator expects request headers object, not a NextRequest
  const negotiatorHeaders: Record<string, string> = {}
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value))

  // Use negotiator and intl-localematcher to get best locale
  let languages = new Negotiator({ headers: negotiatorHeaders }).languages()
  return matchLocale(languages, locales, defaultLocale)
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Admin sayfalarını koru
  if (pathname.startsWith('/admin') || pathname.startsWith('/tr/admin') || pathname.startsWith('/en/admin')) {
    // Login sayfaları hariç tüm admin rotalarını koru
    if (!pathname.includes('/admin/login')) {
      const token = request.cookies.get('adminToken')?.value
      const locale = getLocale(request)
      
      // Token yoksa login sayfasına yönlendir
      if (!token) {
        // Eğer URL zaten yerelleştirilmiş bir formatta ise (ör. /tr/admin/...)
        if (locales.some(loc => pathname.startsWith(`/${loc}/admin`))) {
          // Şu anki yerelleştirmeyi koru
          const currentLocale = pathname.split('/')[1]
          return NextResponse.redirect(new URL(`/${currentLocale}/admin/login`, request.url))
        } else {
          // Global admin rotasından yerelleştirilmiş rotaya yönlendir
          return NextResponse.redirect(new URL(`/${locale}/admin/login`, request.url))
        }
      }
      
      try {
        // Token'ı doğrula
        jwt.verify(token, JWT_SECRET)
        // Token geçerliyse, işlemi devam ettir
      } catch (error) {
        // Token geçersiz veya süresi dolmuşsa login sayfasına yönlendir
        // Eğer URL zaten yerelleştirilmiş bir formatta ise
        if (locales.some(loc => pathname.startsWith(`/${loc}/admin`))) {
          // Şu anki yerelleştirmeyi koru
          const currentLocale = pathname.split('/')[1]
          return NextResponse.redirect(new URL(`/${currentLocale}/admin/login`, request.url))
        } else {
          // Global admin rotasından yerelleştirilmiş rotaya yönlendir
          return NextResponse.redirect(new URL(`/${locale}/admin/login`, request.url))
        }
      }
    } else if (pathname === '/admin/login') {
      // Global admin login sayfası isteği için yerelleştirilmiş sayfaya yönlendir
      const locale = getLocale(request)
      return NextResponse.redirect(new URL(`/${locale}/admin/login`, request.url))
    }
  }

  // Yolu dil kodlarıyla eşleştir
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )

  // Locale yönlendirmesi yap
  if (pathnameIsMissingLocale) {
    // Locale'i belirle
    const locale = getLocale(request)

    // Mevcut URL'deki path'i al ve locale ile yeni URL oluştur
    // Örnek: pathname = '/about' ve locale = 'tr' ise, yeni pathname = '/tr/about'
    return NextResponse.redirect(
      new URL(`/${locale}${pathname.startsWith('/') ? pathname : `/${pathname}`}`, request.url)
    )
  }
}

export const config = {
  matcher: [
    // Locale'leri ve statik dosya isteklerini es geç
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|sitemap.xml|robots.txt).*)',
    // Admin rotalarını ekle
    '/admin/:path*',
    '/:locale/admin/:path*'
  ],
}

