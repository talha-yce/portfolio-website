import { MetadataRoute } from "next"
import { getAllContent } from "@/lib/content-manager"
import { locales } from "@/lib/i18n/config"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://talha-portfolio.vercel.app"
  const routes = ["", "/projects", "/blog"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1 : 0.8,
  }))

  // Blog posts
  const blogPosts = await getAllContent("blog", "tr")
  const blogRoutes = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }))

  // Projects
  const projects = await getAllContent("projects", "tr")
  const projectRoutes = projects.map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    lastModified: new Date(project.date),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }))

  // Localized routes
  const localizedRoutes = locales.flatMap((locale) =>
    ["", "/projects", "/blog"].map((route) => ({
      url: `${baseUrl}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: route === "" ? 0.9 : 0.7,
    }))
  )

  return [...routes, ...blogRoutes, ...projectRoutes, ...localizedRoutes]
} 