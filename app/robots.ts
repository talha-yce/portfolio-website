import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/_next/",
        "/static/",
        "/private/",
        "/admin/",
      ],
    },
    sitemap: [
      "https://www.talha-yuce.site/sitemap.xml",
      "https://www.talha-yuce.site/sitemap-pages.xml",
      "https://www.talha-yuce.site/sitemap-projects.xml",
      "https://www.talha-yuce.site/sitemap-blog.xml",
    ],
  }
}