import { MetadataRoute } from "next"
import { getAllContent } from "@/lib/content-manager"
import { locales } from "@/lib/i18n/config"

const baseUrl = "https://talha-yuce.vercel.app"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Statik sayfalar
  const staticPages = locales.flatMap((locale) => [
    {
      url: `${baseUrl}/${locale}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily' as const,
      priority: 1
    },
    {
      url: `${baseUrl}/${locale}/about`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly' as const,
      priority: 0.8
    },
    {
      url: `${baseUrl}/${locale}/projects`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly' as const,
      priority: 0.8
    },
    {
      url: `${baseUrl}/${locale}/blog`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly' as const,
      priority: 0.8
    },
  ])

  // Blog yazıları
  const blogPages = await Promise.all(
    locales.map(async (locale) => {
      const posts = await getAllContent("blog", locale)
      return posts.map((post) => ({
        url: `${baseUrl}/${locale}/blog/${post.slug}`,
        lastModified: new Date(post.date).toISOString(),
        changeFrequency: 'weekly' as const,
        priority: 0.6
      }))
    })
  )

  // Projeler
  const projectPages = await Promise.all(
    locales.map(async (locale) => {
      const projects = await getAllContent("projects", locale)
      return projects.map((project) => ({
        url: `${baseUrl}/${locale}/projects/${project.slug}`,
        lastModified: new Date(project.date).toISOString(),
        changeFrequency: 'weekly' as const,
        priority: 0.7
      }))
    })
  )

  // Tüm sayfaları birleştir
  return [
    {
      url: baseUrl,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily' as const,
      priority: 1
    },
    ...staticPages,
    ...blogPages.flat(),
    ...projectPages.flat(),
  ]
} 