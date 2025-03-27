import { MetadataRoute } from "next"
import { getAllContent } from "@/lib/content-manager"
import { locales } from "@/lib/i18n/config"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://talha-yuce.vercel.app"

  // Blog yazılarını al (tüm diller için)
  const blogUrls = await Promise.all(
    locales.map(async (locale) => {
      const blogPosts = await getAllContent("blog", locale)
      return blogPosts.map((post) => ({
        url: `${baseUrl}/${locale}/blog/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      }))
    })
  )

  // Projeleri al (tüm diller için)
  const projectUrls = await Promise.all(
    locales.map(async (locale) => {
      const projects = await getAllContent("projects", locale)
      return projects.map((project) => ({
        url: `${baseUrl}/${locale}/projects/${project.slug}`,
        lastModified: new Date(project.date),
        changeFrequency: "monthly" as const,
        priority: 0.6,
      }))
    })
  )

  // Statik sayfalar (tüm diller için)
  const staticPages = locales.flatMap((locale) => [
    {
      url: `${baseUrl}/${locale}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/${locale}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/${locale}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/${locale}/projects`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    },
  ])

  return [...staticPages, ...blogUrls.flat(), ...projectUrls.flat()]
} 