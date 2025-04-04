import Link from "next/link"
import { Button } from "@/components/ui/button"
import { defaultLocale } from "@/lib/i18n/config"
import { getDictionary } from "@/lib/i18n/dictionaries"

export default async function NotFound() {
  const dictionary = await getDictionary(defaultLocale)

  return (
    <div className="container flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] gap-4 text-center">
      <div>
        <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-green-400">
          404
        </h1>
      </div>
      <div>
        <p className="text-xl text-purple-300">{dictionary.common.pageNotFound}</p>
      </div>
      <div>
        <p className="text-gray-400">{dictionary.common.pageNotFoundDescription}</p>
      </div>
      <div>
        <Link href={`/${defaultLocale}`}>
          <Button className="mt-4 bg-purple-600 text-white hover:bg-purple-700">
            {dictionary.common.goHome}
          </Button>
        </Link>
      </div>
    </div>
  )
}

