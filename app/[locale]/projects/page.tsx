import type { Metadata } from "next"
import { getAllContent, type ContentMeta } from "@/lib/content-manager"
import { getDictionary } from "@/lib/i18n/dictionaries"
import type { Locale } from "@/lib/i18n/config"
import ProjectsPageClient from "./ProjectsPageClient"

export async function generateMetadata({ params }: { params: { locale: Locale } }): Promise<Metadata> {
  const locale = (await params).locale
  const dictionary = await getDictionary(locale)

  return {
    title: dictionary.projects.title,
    description: dictionary.projects.description,
  }
}

export default async function ProjectsPage({ params }: { params: { locale: Locale } }) {
  const locale = (await params).locale
  const dictionary = await getDictionary(locale)

  let projects: ContentMeta[] = []
  try {
    projects = await getAllContent("projects", locale)
  } catch (error) {
    console.error("Error fetching projects:", error)
  }

  return <ProjectsPageClient params={params} dictionary={dictionary} projects={projects} />
}

