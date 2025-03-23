"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Code, FileText, Home, Menu, User, X } from "lucide-react"
import { useState } from "react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { LanguageSwitcher } from "@/components/language-switcher"
import { getLocalizedPathname, type Locale } from "@/lib/i18n/config"

interface SiteHeaderProps {
  locale: Locale
}

export function SiteHeader({ locale }: SiteHeaderProps) {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const routes = [
    {
      href: getLocalizedPathname("/", locale),
      label: "Home",
      icon: Home,
      active: pathname === getLocalizedPathname("/", locale),
    },
    {
      href: getLocalizedPathname("/about", locale),
      label: "About",
      icon: User,
      active: pathname === getLocalizedPathname("/about", locale),
    },
    {
      href: getLocalizedPathname("/projects", locale),
      label: "Projects",
      icon: Code,
      active: pathname === getLocalizedPathname("/projects", locale) || pathname.includes("/projects/"),
    },
    {
      href: getLocalizedPathname("/blog", locale),
      label: "Blog",
      icon: FileText,
      active: pathname === getLocalizedPathname("/blog", locale) || pathname.includes("/blog/"),
    },
  ]

  return (
    <motion.header
      className="sticky top-0 z-40 w-full border-b border-purple-900/40 bg-background/80 backdrop-blur-md"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href={getLocalizedPathname("/", locale)} className="flex items-center space-x-2">
            <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-green-400">
              TY
            </span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-purple-400 relative group",
                route.active ? "text-purple-400" : "text-muted-foreground",
              )}
            >
              {route.label}
              <span
                className={cn(
                  "absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-green-400 transition-all duration-300 group-hover:w-full",
                  route.active ? "w-full" : "",
                )}
              />
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <LanguageSwitcher locale={locale} />
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>
      {isMenuOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-background md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="container flex h-16 items-center justify-between">
            <Link href={getLocalizedPathname("/", locale)} className="flex items-center space-x-2">
              <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-green-400">
                TY
              </span>
            </Link>
            <div className="flex items-center gap-2">
              <LanguageSwitcher locale={locale} />
              <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)}>
                <X className="h-5 w-5" />
                <span className="sr-only">Close menu</span>
              </Button>
            </div>
          </div>
          <nav className="container grid gap-6 py-6">
            {routes.map((route, index) => (
              <motion.div
                key={route.href}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
              >
                <Link
                  href={route.href}
                  className={cn(
                    "flex items-center gap-2 text-lg font-medium transition-colors hover:text-purple-400",
                    route.active ? "text-purple-400" : "text-muted-foreground",
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <route.icon className="h-5 w-5" />
                  {route.label}
                </Link>
              </motion.div>
            ))}
          </nav>
        </motion.div>
      )}
    </motion.header>
  )
}

