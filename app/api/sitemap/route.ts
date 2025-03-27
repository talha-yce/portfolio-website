import { MetadataRoute } from 'next'
import { NextResponse } from 'next/server'

export async function GET() {
  const sitemap: MetadataRoute.Sitemap = [
    {
      url: 'https://talha-yuce.vercel.app/tr',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: 'https://talha-yuce.vercel.app/en',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: 'https://talha-yuce.vercel.app/tr/about',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://talha-yuce.vercel.app/en/about',
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: 'https://talha-yuce.vercel.app/tr/blog',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: 'https://talha-yuce.vercel.app/en/blog',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: 'https://talha-yuce.vercel.app/tr/projects',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: 'https://talha-yuce.vercel.app/en/projects',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ]

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${sitemap.map((entry) => {
        const lastMod = entry.lastModified instanceof Date 
          ? entry.lastModified.toISOString() 
          : entry.lastModified || new Date().toISOString();
        
        return `
          <url>
            <loc>${entry.url}</loc>
            <lastmod>${lastMod}</lastmod>
            ${entry.changeFrequency ? `<changefreq>${entry.changeFrequency}</changefreq>` : ''}
            ${entry.priority ? `<priority>${entry.priority}</priority>` : ''}
          </url>
        `;
      }).join('')}
    </urlset>`

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'application/xml',
    },
  })
} 