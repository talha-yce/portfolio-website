import type React from "react"
import type { Metadata } from "next"
import { Space_Grotesk } from "next/font/google"
import { notFound } from "next/navigation"

import { ThemeProvider } from "@/components/theme-provider"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { locales, type Locale } from "@/lib/i18n/config"

import "../globals.css"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: {
    default: "Talha Yüce | Yazılım Mühendisi",
    template: "%s | Talha Yüce",
  },
  description: "Web Geliştirme, Oyun Geliştirme ve Yapay Zeka Uygulamaları konusunda uzmanlaşmış Yazılım Mühendisi",
  keywords: ["Yazılım Mühendisi", "Web Geliştirme", "Oyun Geliştirme", "Unity", "Yapay Zeka", "React", "Next.js"],
  authors: [{ name: "Talha Yüce" }],
  creator: "Talha Yüce",
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://talha-portfolio.vercel.app",
    title: "Talha Yüce | Yazılım Mühendisi",
    description: "Web Geliştirme, Oyun Geliştirme ve Yapay Zeka Uygulamaları konusunda uzmanlaşmış Yazılım Mühendisi",
    siteName: "Talha Yüce Portfolyo",
  },
  twitter: {
    card: "summary_large_image",
    title: "Talha Yüce | Yazılım Mühendisi",
    description: "Web Geliştirme, Oyun Geliştirme ve Yapay Zeka Uygulamaları konusunda uzmanlaşmış Yazılım Mühendisi",
  },
  icons: {
    icon: "/favicon.ico",
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
      <body className={`${spaceGrotesk.className} bg-background text-foreground`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <div className="relative flex min-h-screen flex-col">
            <SiteHeader locale={locale} />
            <main className="flex-1">{children}</main>
            <SiteFooter locale={locale} />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}