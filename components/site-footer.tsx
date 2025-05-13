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
      <div className="container mx-auto py-16">
        <NewsletterSubscription dictionary={dictionary} />
      </div>
      <footer className="relative w-full border-t border-border py-8 bg-muted/30">
        <div className="absolute inset-0 bg-noise opacity-[0.03] z-0"></div>
        <div className="absolute bottom-0 right-0 w-96 h-64 bg-primary-100 rounded-full filter blur-3xl z-0 opacity-30"></div>
        
        <div className="container relative z-10 flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex flex-col items-center md:items-start gap-2">
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              © {new Date().getFullYear()} Talha Yüce.
              {locale === "tr" ? " Tüm hakları saklıdır." : " All rights reserved."}
            </p>
            <p className="text-xs text-muted-foreground/70">
              {locale === "tr" 
                ? "Modern teknolojilerle geliştirilmiş kişisel blog ve portfolyo sitesi." 
                : "Personal blog and portfolio site built with modern technologies."}
            </p>
          </div>
          <SocialLinks className="gap-5" />
        </div>
      </footer>
    </>
  )
}

