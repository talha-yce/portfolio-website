import type React from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import type { Locale } from "@/lib/i18n/config"

interface SiteLayoutProps {
  children: React.ReactNode
  locale: Locale
  dictionary: any
}

export function SiteLayout({ children, locale, dictionary }: SiteLayoutProps) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <SiteHeader locale={locale} dictionary={dictionary} />
      <main className="flex-1">
        {children}
      </main>
      <SiteFooter locale={locale} dictionary={dictionary} />
    </div>
  )
} 