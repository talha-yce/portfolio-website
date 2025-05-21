import type React from "react"
import type { Metadata } from "next"
import { Space_Grotesk } from "next/font/google"
import { notFound } from "next/navigation"
import dynamic from "next/dynamic"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/theme-provider"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { locales, type Locale } from "@/lib/i18n/config"
import { getDictionary } from "@/lib/i18n/dictionaries"

import "../globals.css"

// Dynamically import analytics components
const Analytics = dynamic(() => 
  import('@vercel/analytics/react').then((mod) => mod.Analytics)
)
const SpeedInsights = dynamic(() => 
  import('@vercel/speed-insights/next').then((mod) => mod.SpeedInsights)
)

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  preload: true,
  fallback: ['system-ui', 'sans-serif'],
  variable: '--font-space-grotesk',
})

export const metadata: Metadata = {
  metadataBase: new URL("https://www.talha-yuce.site"),
  title: {
    template: '%s | Talha Yüce',
    default: 'Talha Yüce | Yazılım Mühendisi & Web Geliştirici',
  },
  description: 'Talha Yüce - Web Geliştirme, Oyun Geliştirme ve Yapay Zeka Uygulamaları konusunda uzmanlaşmış Yazılım Mühendisi. React, Next.js, TypeScript ve Unity ile modern web ve oyun uygulamaları geliştiriyorum.',
  keywords: [
    'talha yüce',
    'yazılım mühendisi',
    'web geliştirici',
    'frontend developer',
    'react developer',
    'next.js developer',
    'typescript developer',
    'unity developer',
    'oyun geliştirici',
    'yapay zeka',
    'web uygulamaları',
    'portfolio',
    'kişisel website'
  ],
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
    url: "https://www.talha-yuce.site",
    title: "Talha Yüce | Yazılım Mühendisi & Web Geliştirici",
    description: "Web Geliştirme, Oyun Geliştirme ve Yapay Zeka Uygulamaları konusunda uzmanlaşmış Yazılım Mühendisi. React, Next.js, TypeScript ve Unity ile modern web ve oyun uygulamaları geliştiriyorum.",
    siteName: "Talha Yüce Portfolio",
    images: [
      {
        url: "https://www.talha-yuce.site/og.png",
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "Talha Yüce Portfolio OG Görseli"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Talha Yüce | Yazılım Mühendisi & Web Geliştirici",
    description: "Web Geliştirme, Oyun Geliştirme ve Yapay Zeka Uygulamaları konusunda uzmanlaşmış Yazılım Mühendisi. React, Next.js, TypeScript ve Unity ile modern web ve oyun uygulamaları geliştiriyorum.",
    images: ["https://www.talha-yuce.site/og.png"],
    site: "@talhayuce",
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
    canonical: "https://www.talha-yuce.site",
    languages: {
      'tr-TR': 'https://www.talha-yuce.site/tr',
      'en-US': 'https://www.talha-yuce.site/en',
    },
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
  const awaitedParams = await params
  const locale = awaitedParams.locale as Locale

  if (!locales.includes(locale)) {
    notFound()
  }

  const dictionary = await getDictionary(locale)

  return (
    <html lang={locale} suppressHydrationWarning className={spaceGrotesk.variable} prefix="og: https://ogp.me/ns#">
      <head>
        <link rel="canonical" href="https://www.talha-yuce.site" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#f8f9fa" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200" />
        
        {/* Explicit OpenGraph and Twitter meta tags */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.talha-yuce.site" />
        <meta property="og:title" content="Talha Yüce | Yazılım Mühendisi & Web Geliştirici" />
        <meta property="og:description" content="Web Geliştirme, Oyun Geliştirme ve Yapay Zeka Uygulamaları konusunda uzmanlaşmış Yazılım Mühendisi." />
        <meta property="og:image" content="https://www.talha-yuce.site/og.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:alt" content="Talha Yüce Portfolio OG Görseli" />
        <meta property="og:site_name" content="Talha Yüce Portfolio" />
        <meta property="og:locale" content="tr_TR" />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@talhayuce" />
        <meta name="twitter:creator" content="@talhayuce" />
        <meta name="twitter:title" content="Talha Yüce | Yazılım Mühendisi & Web Geliştirici" />
        <meta name="twitter:description" content="Web Geliştirme, Oyun Geliştirme ve Yapay Zeka Uygulamaları konusunda uzmanlaşmış Yazılım Mühendisi." />
        <meta name="twitter:image" content="https://www.talha-yuce.site/og.png" />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Talha Yüce",
              "url": "https://www.talha-yuce.site",
              "sameAs": [
                "https://github.com/talhayuce",
                "https://linkedin.com/in/talhayuce"
              ],
              "jobTitle": "Software Engineer",
              "worksFor": {
                "@type": "Organization",
                "name": "Freelance"
              },
              "description": "Web Geliştirme, Oyun Geliştirme ve Yapay Zeka Uygulamaları konusunda uzmanlaşmış Yazılım Mühendisi",
              "knowsAbout": [
                "Web Development",
                "Game Development",
                "Artificial Intelligence",
                "React",
                "Next.js",
                "TypeScript",
                "Unity",
                "C#",
                "Python"
              ]
            })
          }}
        />
      </head>
      <body className={cn(spaceGrotesk.className, "bg-background text-foreground")}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
          <div className="relative flex min-h-screen flex-col">
            <SiteHeader locale={locale} dictionary={dictionary} />
            <main className="flex-1">
              {children}
            </main>
            <SiteFooter locale={locale} dictionary={dictionary} />
          </div>
        </ThemeProvider>
        {process.env.NODE_ENV === "production" && (
          <>
            <Analytics />
            <SpeedInsights />
          </>
        )}
      </body>
    </html>
  )
}