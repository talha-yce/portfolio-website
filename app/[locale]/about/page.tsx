import type { Metadata } from "next"
import { getUserData } from "@/lib/cv-manager"
import { getDictionary } from "@/lib/i18n/dictionaries"
import type { Locale } from "@/lib/i18n/config"
import AboutPageClient from "./AboutPageClient"

export async function generateMetadata({ params }: { params: { locale: Locale } }): Promise<Metadata> {
  const dictionary = await getDictionary(params.locale)

  return {
    title: dictionary.about.title,
    description:
      params.locale === "tr"
        ? "Talha Yüce hakkında daha fazla bilgi edinin, web geliştirme, oyun geliştirme ve yapay zeka uygulamaları konusunda uzmanlaşmış bir yazılım mühendisi."
        : "Learn more about Talha Yüce, a software engineer specializing in web development, game development, and AI applications.",
  }
}

export default async function AboutPage({ params }: { params: { locale: Locale } }) {
  const userData = await getUserData(params.locale)
  const dictionary = await getDictionary(params.locale)

  return <AboutPageClient userData={userData} dictionary={dictionary} />
}

