import Link from "next/link"
import { Button } from "@/components/ui/button"
import { getLocalizedPathname } from "@/lib/i18n/config"

export default function NotFound({ params }: { params: { locale: string } }) {
  const locale = params?.locale || "tr"

  return (
    <div className="container flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] gap-4 text-center">
      <div>
        <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-green-400">
          404
        </h1>
      </div>
      <div>
        <p className="text-xl text-purple-300">{locale === "tr" ? "Sayfa bulunamadı" : "Page not found"}</p>
      </div>
      <div>
        <p className="text-gray-400">
          {locale === "tr"
            ? "Aradığınız sayfa mevcut değil veya taşınmış olabilir."
            : "The page you're looking for doesn't exist or has been moved."}
        </p>
      </div>
      <div>
        <Link href={getLocalizedPathname("/", locale)}>
          <Button className="mt-4 bg-purple-600 text-white hover:bg-purple-700">
            {locale === "tr" ? "Ana Sayfaya Dön" : "Go Home"}
          </Button>
        </Link>
      </div>
    </div>
  )
}

