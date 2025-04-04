import type { Metadata } from "next"
import { getUserData } from "@/lib/cv-manager"
import { getDictionary } from "@/lib/i18n/dictionaries"
import type { Locale } from "@/lib/i18n/config"
import AboutPageClient from "./AboutPageClient"

export async function generateMetadata({ params }: { params: { locale: Locale } }): Promise<Metadata> {
  const awaitedParams = await params
  const dictionary = await getDictionary(awaitedParams.locale)

  return {
    title: dictionary.about.title,
    description: dictionary.about.description,
  }
}

export default async function AboutPage({ params }: { params: { locale: Locale } }) {
  const awaitedParams = await params
  const userData = await getUserData(awaitedParams.locale)
  const dictionary = await getDictionary(awaitedParams.locale)

  return <AboutPageClient userData={userData} dictionary={dictionary} locale={awaitedParams.locale} />
}

