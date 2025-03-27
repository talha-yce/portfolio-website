import { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/_next/", "/static/"],
    },
    sitemap: "https://talha-yuce.vercel.app/sitemap.xml", // Sitenizin gerçek URL'sini buraya yazın
  }
} 