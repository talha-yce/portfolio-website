import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://talha-yuce.vercel.app'
  const locales = ['tr', 'en']
  const routes = ['', '/about', '/blog', '/projects']

  const sitemapEntries = locales.flatMap(locale =>
    routes.map(route => ({
      url: `${baseUrl}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: route === '' ? 'monthly' as const : 'weekly' as const,
      priority: route === '' ? 1 : 0.8,
    }))
  )

  return sitemapEntries
} 