import type { MetadataRoute } from "next"
import { getAllContent } from "@/lib/content-manager"
import { locales, defaultLocale } from "@/lib/i18n/config"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.talha-yuce.site"

  // Get current date for lastModified
  const date = new Date()

  // Static routes for each locale
  const staticRoutes = locales.flatMap((locale) => {
    // For default locale, don't include the locale in the URL
    const localePath = locale === defaultLocale ? "" : `/${locale}`

    return [
      {
        url: `${baseUrl}${localePath || "/"}`,
        lastModified: date,
        changeFrequency: "daily" as const,
        priority: 1.0,
      },
      {
        url: `${baseUrl}${localePath}/about`,
        lastModified: date,
        changeFrequency: "weekly" as const,
        priority: 0.9,
      },
      {
        url: `${baseUrl}${localePath}/projects`,
        lastModified: date,
        changeFrequency: "daily" as const,
        priority: 0.9,
      },
      {
        url: `${baseUrl}${localePath}/blog`,
        lastModified: date,
        changeFrequency: "daily" as const,
        priority: 0.9,
      },
    ]
  })

  // Dynamic routes for projects
  let projectRoutes: Array<{
    url: string
    lastModified: Date
    changeFrequency: "weekly"
    priority: number
  }> = []

  try {
    const projects = await getAllContent("projects")
    projectRoutes = projects.flatMap((project) =>
      locales.map((locale) => {
        const localePath = locale === defaultLocale ? "" : `/${locale}`
        return {
          url: `${baseUrl}${localePath}/projects/${project.slug}`,
          lastModified: new Date(project.date),
          changeFrequency: "weekly" as const,
          priority: 0.8,
        }
      })
    )
  } catch (error) {
    console.error("Error generating project routes for sitemap:", error)
  }

  // Dynamic routes for blog posts
  let blogRoutes: Array<{
    url: string
    lastModified: Date
    changeFrequency: "weekly"
    priority: number
  }> = []

  try {
    const blogPosts = await getAllContent("blog")
    blogRoutes = blogPosts.flatMap((post) =>
      locales.map((locale) => {
        const localePath = locale === defaultLocale ? "" : `/${locale}`
        return {
          url: `${baseUrl}${localePath}/blog/${post.slug}`,
          lastModified: new Date(post.date),
          changeFrequency: "weekly" as const,
          priority: 0.8,
        }
      })
    )
  } catch (error) {
    console.error("Error generating blog routes for sitemap:", error)
  }

  return [...staticRoutes, ...projectRoutes, ...blogRoutes]
}

