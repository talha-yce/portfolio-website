import type React from "react"
import type { Metadata } from "next"
import { Space_Grotesk } from "next/font/google"
import { notFound } from "next/navigation"
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { cn } from "@/lib/utils"

import { ThemeProvider } from "@/components/theme-provider"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { locales, type Locale } from "@/lib/i18n/config"

import "../globals.css"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://talha-yuce.vercel.app"),
  title: {
    template: '%s | Talha Yüce',
    default: 'Talha Yüce | Yazılım Mühendisi',
  },
  description: 'Web Geliştirme, Oyun Geliştirme ve Yapay Zeka Uygulamaları konusunda uzmanlaşmış Yazılım Mühendisi',
  keywords: ['yazılım mühendisi', 'web geliştirme', 'oyun geliştirme', 'yapay zeka', 'frontend', 'backend', 'fullstack', 'react', 'next.js', 'typescript', 'unity', 'c#', 'python'],
  authors: [{ name: "Talha Yüce" }],
  creator: "Talha Yüce",
  publisher: "Talha Yüce",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://talha-yuce.vercel.app",
    title: "Talha Yüce | Yazılım Mühendisi",
    description: "Web Geliştirme, Oyun Geliştirme ve Yapay Zeka Uygulamaları konusunda uzmanlaşmış Yazılım Mühendisi",
    siteName: "Talha Yüce Portfolyo",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Talha Yüce Portfolyo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Talha Yüce | Yazılım Mühendisi",
    description: "Web Geliştirme, Oyun Geliştirme ve Yapay Zeka Uygulamaları konusunda uzmanlaşmış Yazılım Mühendisi",
    images: ["/og-image.jpg"],
    creator: "@talhayuce",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-code",
  },
  alternates: {
    canonical: "https://talha-yuce.vercel.app",
  },
  manifest: undefined,
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-48x48.png', sizes: '48x48', type: 'image/png' },
      { url: '/icon-64x64.png', sizes: '64x64', type: 'image/png' },
      { url: '/icon-96x96.png', sizes: '96x96', type: 'image/png' },
      { url: '/icon-128x128.png', sizes: '128x128', type: 'image/png' },
      { url: '/icon-256x256.png', sizes: '256x256', type: 'image/png' },
      { url: '/icon-384x384.png', sizes: '384x384', type: 'image/png' },
      { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png'
  },
  appleWebApp: {
    capable: true,
    title: 'Talha Yüce | Yazılım Mühendisi',
    statusBarStyle: 'black-translucent',
  },
}

interface RootLayoutProps {
  children: React.ReactNode
  params: {
    locale: string
  }
}

export default async function RootLayout({ children, params }: RootLayoutProps) {
  const locale = (await params).locale as Locale

  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale)) {
    notFound()
  }

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link rel="canonical" href="https://talha-yuce.vercel.app" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#000000" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icon-16x16.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>
      <body className={`${spaceGrotesk.className} bg-background text-foreground`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <div className="relative flex min-h-screen flex-col">
            <SiteHeader locale={locale} />
            <main className="flex-1">{children}</main>
            <SiteFooter locale={locale} />
          </div>
        </ThemeProvider>
        {process.env.NODE_ENV === "production" && (
          <>
            <Analytics />
            <SpeedInsights />
          </>
        )}
        <script
          type="application/json"
          id="manifest"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              name: "Talha Yüce | Yazılım Mühendisi",
              short_name: "Talha Yüce",
              description: "Web Geliştirme, Oyun Geliştirme ve Yapay Zeka Uygulamaları konusunda uzmanlaşmış Yazılım Mühendisi",
              start_url: "/",
              display: "standalone",
              background_color: "#000000",
              theme_color: "#000000",
              orientation: "portrait",
              icons: [
                {
                  src: "/icon-16x16.png",
                  sizes: "16x16",
                  type: "image/png"
                },
                {
                  src: "/icon-32x32.png",
                  sizes: "32x32",
                  type: "image/png"
                },
                {
                  src: "/icon-48x48.png",
                  sizes: "48x48",
                  type: "image/png"
                },
                {
                  src: "/icon-64x64.png",
                  sizes: "64x64",
                  type: "image/png"
                },
                {
                  src: "/icon-96x96.png",
                  sizes: "96x96",
                  type: "image/png"
                },
                {
                  src: "/icon-128x128.png",
                  sizes: "128x128",
                  type: "image/png"
                },
                {
                  src: "/icon-256x256.png",
                  sizes: "256x256",
                  type: "image/png"
                },
                {
                  src: "/icon-384x384.png",
                  sizes: "384x384",
                  type: "image/png"
                },
                {
                  src: "/icon-512x512.png",
                  sizes: "512x512",
                  type: "image/png",
                  purpose: "any maskable"
                }
              ]
            })
          }}
        />
      </body>
    </html>
  )
}