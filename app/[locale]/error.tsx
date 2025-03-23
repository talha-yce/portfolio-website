"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getLocalizedPathname } from "@/lib/i18n/config"

export default function Error({
  error,
  reset,
  params,
}: {
  error: Error & { digest?: string }
  reset: () => void
  params: { locale: string }
}) {
  const locale = params?.locale || "tr"

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="container flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] gap-4 text-center">
      <div>
        <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-green-400">
          {locale === "tr" ? "Hata" : "Error"}
        </h1>
      </div>
      <div>
        <p className="text-xl text-purple-300">
          {locale === "tr" ? "Bir şeyler yanlış gitti" : "Something went wrong"}
        </p>
      </div>
      <div className="flex gap-4">
        <Button onClick={reset} className="mt-4 bg-purple-600 text-white hover:bg-purple-700">
          {locale === "tr" ? "Tekrar Dene" : "Try Again"}
        </Button>
        <Link href={getLocalizedPathname("/", locale)}>
          <Button variant="outline" className="mt-4 border-purple-600 hover:bg-purple-950/20 hover:text-purple-400">
            {locale === "tr" ? "Ana Sayfaya Dön" : "Go Home"}
          </Button>
        </Link>
      </div>
    </div>
  )
}

