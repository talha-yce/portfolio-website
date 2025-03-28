import { SocialLinks } from "@/components/social-links"
import { NewsletterSubscription } from "@/components/NewsletterSubscription"

interface SiteFooterProps {
  locale: string
}

export function SiteFooter({ locale }: SiteFooterProps) {
  return (
    <>
      <div className="container mx-auto py-8">
        <NewsletterSubscription />
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

