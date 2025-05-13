"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Code, FileText, Home, Menu, User, X } from "lucide-react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { LanguageSwitcher } from "@/components/language-switcher"
import { getLocalizedPathname, type Locale } from "@/lib/i18n/config"
import type { Dictionary } from "@/lib/i18n/dictionaries"

interface SiteHeaderProps {
  locale: Locale
  dictionary: Dictionary
}

export function SiteHeader({ locale, dictionary }: SiteHeaderProps) {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const routes = [
    {
      href: getLocalizedPathname("/", locale),
      label: dictionary.common.home,
      icon: Home,
      active: pathname === getLocalizedPathname("/", locale),
    },
    {
      href: getLocalizedPathname("/about", locale),
      label: dictionary.common.about,
      icon: User,
      active: pathname === getLocalizedPathname("/about", locale),
    },
    {
      href: getLocalizedPathname("/projects", locale),
      label: dictionary.common.projects,
      icon: Code,
      active: pathname === getLocalizedPathname("/projects", locale) || pathname.includes("/projects/"),
    },
    {
      href: getLocalizedPathname("/blog", locale),
      label: dictionary.common.blog,
      icon: FileText,
      active: pathname === getLocalizedPathname("/blog", locale) || pathname.includes("/blog/"),
    },
  ]

  return (
    <motion.header
      className={cn(
        "sticky top-0 z-40 w-full border-b border-border",
        "bg-background/80 backdrop-blur-md"
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href={getLocalizedPathname("/", locale)} className="flex items-center space-x-2">
            <div className="relative group">
              <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 opacity-70 blur-sm group-hover:opacity-100 transition duration-300"></div>
              <div className="relative">
                <Image 
                  src="/logo.png" 
                  alt="Talha Yüce Logo" 
                  width={42} 
                  height={42} 
                  className="rounded-full" 
                />
              </div>
            </div>
            <span className="hidden sm:inline-block font-semibold text-lg bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-accent-500">
              Talha Yüce
            </span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary-600 relative group",
                route.active ? "text-primary-600" : "text-muted-foreground",
              )}
            >
              {route.label}
              <span
                className={cn(
                  "absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500 transition-all duration-300 group-hover:w-full",
                  route.active ? "w-full" : "",
                )}
              />
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <LanguageSwitcher locale={locale} dictionary={dictionary} />
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden hover:bg-primary-100" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>
      {isMenuOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-background/95 backdrop-blur-lg md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="container flex h-16 items-center justify-between border-b border-border">
            <Link href={getLocalizedPathname("/", locale)} className="flex items-center space-x-2">
              <div className="relative">
                <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 opacity-70 blur-sm"></div>
                <div className="relative">
                  <Image 
                    src="/logo.png" 
                    alt="Talha Yüce Logo" 
                    width={42} 
                    height={42} 
                    className="rounded-full" 
                  />
                </div>
              </div>
              <span className="font-semibold text-lg bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-accent-500">
                Talha Yüce
              </span>
            </Link>
            <div className="flex items-center gap-2">
              <LanguageSwitcher locale={locale} dictionary={dictionary} />
              <Button 
                variant="ghost" 
                size="icon" 
                className="hover:bg-primary-100"
                onClick={() => setIsMenuOpen(false)}
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Close menu</span>
              </Button>
            </div>
          </div>
          <nav className="container flex flex-col gap-4 p-4">
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
                    "flex items-center gap-2 text-lg font-medium transition-colors hover:text-primary-600",
                    "p-2 rounded-md hover:bg-primary-100/50",
                    route.active ? "text-primary-600 bg-primary-100/30" : "text-muted-foreground",
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

