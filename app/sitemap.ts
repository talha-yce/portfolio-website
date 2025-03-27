import { MetadataRoute } from "next"
import { getAllContent } from "@/lib/content-manager"
import { locales } from "@/lib/i18n/config"

const baseUrl = "https://talha-yuce.vercel.app" // Sitenizin gerçek URL'sini buraya yazın

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Tüm projeleri ve blog yazılarını al
  const projects = await Promise.all(
    locales.map(async (locale) => {
      const items = await getAllContent("projects", locale)
      return items.map((item) => ({
        url: `${baseUrl}/${locale}/projects/${item.slug}`,
        lastModified: new Date(item.date),
      }))
    })
  )

  const blogPosts = await Promise.all(
    locales.map(async (locale) => {
      const items = await getAllContent("blog", locale)
      return items.map((item) => ({
        url: `${baseUrl}/${locale}/blog/${item.slug}`,
        lastModified: new Date(item.date),
      }))
    })
  )

  // Statik sayfalar
  const staticPages = locales.flatMap((locale) => [
    {
      url: `${baseUrl}/${locale}`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/${locale}/about`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/${locale}/projects`,
      lastModified: new Date(),
    },
    {
      url: `${baseUrl}/${locale}/blog`,
      lastModified: new Date(),
    },
  ])

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    ...staticPages,
    ...projects.flat(),
    ...blogPosts.flat(),
  ]
} 