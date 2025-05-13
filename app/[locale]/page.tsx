import type { Metadata } from "next"
import HomeClient from "./HomeClient"
import { getDictionary } from "@/lib/i18n/dictionaries"
import type { Locale } from "@/lib/i18n/config"
import { getAllContent, type ContentMeta } from "@/lib/content-manager"
import { getAllBlogPosts } from "@/lib/services/blogService"
import { BlogPost, transformToBlogPost } from "@/lib/types"

export async function generateMetadata({ params }: { params: { locale: Locale } }): Promise<Metadata> {
  const awaitedParams = await params
  const dictionary = await getDictionary(awaitedParams.locale)

  return {
    title: `Talha Yüce | ${awaitedParams.locale === "tr" ? "Yazılım Mühendisi" : "Software Engineer"}`,
    description: dictionary?.home?.heroSubtitle || "",
  }
}

export default async function Home({ params }: { params: { locale: Locale } }) {
  const awaitedParams = await params
  const dictionary = await getDictionary(awaitedParams.locale)

  // Fetch projects with error handling
  let projects: ContentMeta[] = []
  try {
    projects = await getAllContent("projects", awaitedParams.locale)
  } catch (error) {
    console.error("Error fetching projects:", error)
  }
  const featuredProjects = projects.slice(0, 3)

  // Fetch posts from database with error handling
  let recentPosts: BlogPost[] = []
  try {
    const dbPosts = await getAllBlogPosts(awaitedParams.locale)
    // Map database posts to ContentMeta format
    recentPosts = dbPosts.slice(0, 3).map(post => transformToBlogPost(post))
  } catch (error) {
    console.error("Error fetching blog posts from database:", error)
    // Fallback to static content if database fetch fails
    try {
      const staticPosts = await getAllContent("blog", awaitedParams.locale)
      recentPosts = staticPosts.slice(0, 3).map(post => ({
        ...post,
        formattedDate: post.formattedDate || new Date(post.date).toLocaleDateString()
      }))
    } catch (fallbackError) {
      console.error("Error fetching fallback blog posts:", fallbackError)
    }
  }

  return (
    <HomeClient params={awaitedParams} dictionary={dictionary} featuredProjects={featuredProjects} recentPosts={recentPosts} />
  )
}

