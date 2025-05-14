import { NextRequest, NextResponse } from 'next/server'
import { match as matchLocale } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
import { locales, defaultLocale } from "@/lib/i18n/config"

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
  console.log('Middleware: Processing request for path:', pathname)
  
  // API rotalarını kontrol et
  if (pathname.startsWith('/api/')) {
    console.log('Middleware: API route detected, skipping locale handling')
    // API rotalarına dil yönlendirmesi yapma
    return NextResponse.next()
  }

  // Check for admin cookie to debug authentication issues
  const adminToken = request.cookies.get('adminToken')
  console.log('Middleware: Admin token present:', !!adminToken)

  // Admin sayfalarını koru
  if (pathname.startsWith('/admin') || pathname.match(/^\/([a-z]{2})\/admin/)) {
    console.log('Middleware: Admin route detected:', pathname)
    
    // Login sayfaları hariç tüm admin rotalarını koru
    if (!pathname.includes('/admin/login')) {
      console.log('Middleware: Protected admin route detected')
      const token = request.cookies.get('adminToken')?.value
      const locale = getLocale(request)
      
      // Token yoksa login sayfasına yönlendir
      if (!token) {
        console.log('Middleware: No token found, redirecting to login')
        // URL'den mevcut locale'i çıkarmaya çalış
        const localeMatch = pathname.match(/^\/([a-z]{2})\//)
        const currentLocale = localeMatch ? localeMatch[1] : locale
        
        // Yerelleştirilmiş login sayfasına yönlendir
        const redirectUrl = new URL(`/${currentLocale}/admin/login`, request.url)
        console.log('Middleware: Redirecting to:', redirectUrl.pathname)
        return NextResponse.redirect(redirectUrl)
      }
      
      // Modified: Skip token verification in middleware, just check if it exists
      // We'll let the API routes handle actual verification
      console.log('Middleware: Token exists, continuing without verification in middleware')
      
      // Eğer admin rotası yerelleştirilmemiş ise yerelleştir
      if (pathname.startsWith('/admin/')) {
        console.log('Middleware: Localizing admin route')
        const locale = getLocale(request)
        return NextResponse.redirect(new URL(`/${locale}${pathname}`, request.url))
      }
    } else if (pathname === '/admin/login') {
      // Global admin login sayfası isteği için yerelleştirilmiş sayfaya yönlendir
      console.log('Middleware: Localizing admin login route')
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
    console.log('Middleware: Adding locale to path:', locale)

    // Mevcut URL'deki path'i al ve locale ile yeni URL oluştur
    const redirectUrl = new URL(`/${locale}${pathname.startsWith('/') ? pathname : `/${pathname}`}`, request.url)
    console.log('Middleware: Redirecting to:', redirectUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }
  
  console.log('Middleware: Proceeding with request')
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Locale'leri ve statik dosya isteklerini es geç
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|sitemap.xml|robots.txt).*)',
  ],
}

