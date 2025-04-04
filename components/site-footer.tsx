import { SocialLinks } from "@/components/social-links"
import { NewsletterSubscription } from "@/components/NewsletterSubscription"
import type { Dictionary } from "@/lib/i18n/dictionaries"

interface SiteFooterProps {
  locale: string
  dictionary: Dictionary
}

export function SiteFooter({ locale, dictionary }: SiteFooterProps) {
  return (
    <>
      <div className="container mx-auto py-8">
        <NewsletterSubscription dictionary={dictionary} />
      </div>
      <footer className="w-full border-t border-purple-900/40 bg-background py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © {new Date().getFullYear()} Talha Yüce.
            {locale === "tr" ? "Tüm hakları saklıdır." : "All rights reserved."}
          </p>
          <SocialLinks />
        </div>
      </footer>
    </>
  )
}

