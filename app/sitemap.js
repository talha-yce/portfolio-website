import { getAllContent } from "@/lib/content-manager"
import { locales } from "@/lib/i18n/config"

const baseUrl = "https://talha-yuce.vercel.app"

export default async function sitemap() {
  try {
    // Statik sayfalar
    const staticPages = locales.flatMap((locale) => [
      {
        url: `${baseUrl}/${locale}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'daily',
        priority: 1
      },
      {
        url: `${baseUrl}/${locale}/about`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'monthly',
        priority: 0.8
      },
      {
        url: `${baseUrl}/${locale}/projects`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'weekly',
        priority: 0.8
      },
      {
        url: `${baseUrl}/${locale}/blog`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'weekly',
        priority: 0.8
      },
    ])

    // Blog yazıları
    const blogPages = await Promise.all(
      locales.map(async (locale) => {
        try {
          const posts = await getAllContent("blog", locale)
          return posts.map((post) => ({
            url: `${baseUrl}/${locale}/blog/${post.slug}`,
            lastModified: new Date(post.date).toISOString(),
            changeFrequency: 'weekly',
            priority: 0.6
          }))
        } catch (error) {
          console.error(`Error getting blog posts for locale ${locale}:`, error)
          return []
        }
      })
    )

    // Projeler
    const projectPages = await Promise.all(
      locales.map(async (locale) => {
        try {
          const projects = await getAllContent("projects", locale)
          return projects.map((project) => ({
            url: `${baseUrl}/${locale}/projects/${project.slug}`,
            lastModified: new Date(project.date).toISOString(),
            changeFrequency: 'weekly',
            priority: 0.7
          }))
        } catch (error) {
          console.error(`Error getting projects for locale ${locale}:`, error)
          return []
        }
      })
    )

    // Tüm sayfaları birleştir
    const allPages = [
      {
        url: baseUrl,
        lastModified: new Date().toISOString(),
        changeFrequency: 'daily',
        priority: 1
      },
      ...staticPages,
      ...blogPages.flat(),
      ...projectPages.flat(),
    ]

    // URL'leri benzersiz hale getir
    const uniqueUrls = Array.from(new Set(allPages.map(page => page.url)))
      .map(url => allPages.find(page => page.url === url))
      .filter(Boolean)

    return uniqueUrls
  } catch (error) {
    console.error('Error generating sitemap:', error)
    // Hata durumunda en azından ana sayfaları döndür
    return [
      {
        url: baseUrl,
        lastModified: new Date().toISOString(),
        changeFrequency: 'daily',
        priority: 1
      },
      ...locales.map(locale => ({
        url: `${baseUrl}/${locale}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'daily',
        priority: 1
      }))
    ]
  }
} 