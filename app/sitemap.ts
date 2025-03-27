import { MetadataRoute } from "next"
import { getAllContent } from "@/lib/content-manager"
import { locales } from "@/lib/i18n/config"

const baseUrl = "https://talha-yuce.vercel.app" // Sitenizin URL'si

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    // Tüm projeleri ve blog yazılarını al
    const projects = await Promise.all(
      locales.map(async (locale) => {
        try {
          const items = await getAllContent("projects", locale)
          return items.map((item) => ({
            url: `${baseUrl}/${locale}/projects/${item.slug}`,
            lastModified: new Date(item.date).toISOString(),
            changeFrequency: 'weekly' as const,
            priority: 0.7
          }))
        } catch (error) {
          console.error(`Error getting projects for locale ${locale}:`, error)
          return []
        }
      })
    )

    const blogPosts = await Promise.all(
      locales.map(async (locale) => {
        try {
          const items = await getAllContent("blog", locale)
          return items.map((item) => ({
            url: `${baseUrl}/${locale}/blog/${item.slug}`,
            lastModified: new Date(item.date).toISOString(),
            changeFrequency: 'weekly' as const,
            priority: 0.6
          }))
        } catch (error) {
          console.error(`Error getting blog posts for locale ${locale}:`, error)
          return []
        }
      })
    )

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

    return [
      {
        url: baseUrl,
        lastModified: new Date().toISOString(),
        changeFrequency: 'daily' as const,
        priority: 1
      },
      ...staticPages,
      ...projects.flat(),
      ...blogPosts.flat(),
    ]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    // Hata durumunda en azından ana sayfaları döndür
    return [
      {
        url: baseUrl,
        lastModified: new Date().toISOString(),
        changeFrequency: 'daily' as const,
        priority: 1
      },
      ...locales.map(locale => ({
        url: `${baseUrl}/${locale}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'daily' as const,
        priority: 1
      }))
    ]
  }
} 