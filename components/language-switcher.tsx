"use client"

import { useState } from "react"
import { Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { type Locale, localeNames, locales } from "@/lib/i18n/config"
import { useChangeLocale } from "@/lib/i18n/client"
import type { Dictionary } from "@/lib/i18n/dictionaries"

interface LanguageSwitcherProps {
  locale: Locale
  dictionary: Dictionary
}

export function LanguageSwitcher({ locale, dictionary }: LanguageSwitcherProps) {
  const changeLocale = useChangeLocale()
  const [isOpen, setIsOpen] = useState(false)

  const handleChangeLocale = (newLocale: Locale) => {
    changeLocale(newLocale)
    setIsOpen(false)
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-purple-400 transition-colors">
          <Globe className="h-5 w-5" />
          <span className="sr-only">{dictionary.common.changeLanguage}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((localeOption) => (
          <DropdownMenuItem
            key={localeOption}
            onClick={() => handleChangeLocale(localeOption)}
            className={locale === localeOption ? "text-purple-400" : ""}
          >
            {localeNames[localeOption]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

