import React from 'react'
import type { Metadata } from 'next'
import { Space_Grotesk } from "next/font/google"
import { locales, defaultLocale, type Locale } from '@/lib/i18n/config'

import "../globals.css"

// Define the font
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
})

// Generate static metadata
export const metadata: Metadata = {
  title: {
    template: '%s | Talha Yüce',
    default: 'Talha Yüce',
  },
  description: 'Talha Yüce - Software Engineer',
}

// Instead of using params directly, we'll generate the HTML attributes in a client component
export default function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  return (
    <div className={spaceGrotesk.className}>
      <div className="relative flex min-h-screen flex-col">
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}