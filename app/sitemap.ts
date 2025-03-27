import type { MetadataRoute } from "next"
import { getAllContent } from "@/lib/content-manager"
import { locales, defaultLocale } from "@/lib/i18n/config"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://talha-yuce.vercel.app"

  // Get current date for lastModified
  const date = new Date()

  // Static routes for each locale
  const staticRoutes = locales.flatMap((locale) => {
    const localePath = locale === defaultLocale ? "" : `/${locale}`

    return [
      {
        url: `${baseUrl}${localePath}`,
        lastModified: date,
        changeFrequency: "weekly" as const,
        priority: 1.0,
      },
      {
        url: `${baseUrl}${localePath}/about`,
        lastModified: date,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      },
      {
        url: `${baseUrl}${localePath}/projects`,
        lastModified: date,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      },
      {
        url: `${baseUrl}${localePath}/blog`,
        lastModified: date,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      },
    ]
  })

  // Dynamic routes for projects
  const projectRoutes = await Promise.all(
    locales.map(async (locale) => {
      try {
        const projects = await getAllContent("projects", locale)
        return projects.map((project) => ({
          url: `${baseUrl}/${locale}/projects/${project.slug}`,
          lastModified: new Date(project.date),
          changeFrequency: "monthly" as const,
          priority: 0.7,
        }))
      } catch (error) {
        console.error(`Error getting projects for sitemap (${locale}):`, error)
        return []
      }
    }),
  )

  // Dynamic routes for blog posts
  const blogRoutes = await Promise.all(
    locales.map(async (locale) => {
      try {
        const posts = await getAllContent("blog", locale)
        return posts.map((post) => ({
          url: `${baseUrl}/${locale}/blog/${post.slug}`,
          lastModified: new Date(post.date),
          changeFrequency: "monthly" as const,
          priority: 0.7,
        }))
      } catch (error) {
        console.error(`Error getting blog posts for sitemap (${locale}):`, error)
        return []
      }
    }),
  )

  // Combine all routes
  return [...staticRoutes, ...projectRoutes.flat(), ...blogRoutes.flat()]
}

