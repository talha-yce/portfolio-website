import type { Metadata } from "next"
import { getAllContent, type ContentMeta } from "@/lib/content-manager"
import { getDictionary } from "@/lib/i18n/dictionaries"
import type { Locale } from "@/lib/i18n/config"
import { getAllProjects } from "@/lib/services/projectService"
import { Project, transformToProject } from "@/lib/types"
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

  // Fetch projects from database with error handling
  let projects: Project[] = []
  try {
    console.log(`[Projects Page] Fetching projects for locale: ${locale}`)
    const dbProjects = await getAllProjects(locale)
    console.log(`[Projects Page] Database returned ${dbProjects.length} projects`)
    projects = dbProjects.map(project => transformToProject(project))
    console.log(`[Projects Page] Transformed ${projects.length} projects`)
  } catch (error) {
    console.error("[Projects Page] Error fetching projects from database:", error)
    // Fallback to static content if database fetch fails
    console.log("[Projects Page] Falling back to static content")
    try {
      const staticProjects = await getAllContent("projects", locale)
      console.log(`[Projects Page] Static content returned ${staticProjects.length} projects`)
      projects = staticProjects.map(project => ({
        ...project,
        formattedDate: project.formattedDate || new Date(project.date).toLocaleDateString(),
        github: (project as any).github,
        demo: (project as any).demo,
        status: (project as any).status,
        featured: (project as any).featured
      }))
    } catch (fallbackError) {
      console.error("[Projects Page] Error fetching fallback projects:", fallbackError)
    }
  }

  return <ProjectsPageClient params={{ locale }} dictionary={dictionary} projects={projects} />
}

