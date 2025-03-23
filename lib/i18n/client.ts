"use client"

import { usePathname, useRouter } from "next/navigation"
import { useMemo } from "react"
import { type Locale, getLocaleFromPathname, getLocalizedPathname } from "./config"

export function useLocale() {
  const pathname = usePathname()
  return useMemo(() => getLocaleFromPathname(pathname), [pathname])
}

export function useChangeLocale() {
  const router = useRouter()
  const pathname = usePathname()

  return (locale: Locale) => {
    const newPathname = getLocalizedPathname(pathname, locale)
    router.push(newPathname)
  }
}

