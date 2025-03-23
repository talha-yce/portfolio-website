export type Locale = "tr" | "en"

export const defaultLocale: Locale = "tr"

export const locales: Locale[] = ["tr", "en"]

export const localeNames: Record<Locale, string> = {
  tr: "Türkçe",
  en: "English",
}

export const getLocaleFromPathname = (pathname: string): Locale => {
  // Paths start with /en or /tr, extract the locale
  const segments = pathname.split("/")
  const localeSegment = segments[1] as Locale

  if (locales.includes(localeSegment)) {
    return localeSegment
  }

  return defaultLocale
}

export const removeLocaleFromPathname = (pathname: string): string => {
  const segments = pathname.split("/")

  if (locales.includes(segments[1] as Locale)) {
    segments.splice(1, 1)
    return segments.join("/") || "/"
  }

  return pathname
}

export const getLocalizedPathname = (pathname: string, locale: Locale): string => {
  const cleanPath = removeLocaleFromPathname(pathname)

  if (locale === defaultLocale) {
    return cleanPath
  }

  return `/${locale}${cleanPath === "/" ? "" : cleanPath}`
}

