import type { Metadata } from "next"
import HomeClient from "./HomeClient"
import { getDictionary } from "@/lib/i18n/dictionaries"
import type { Locale } from "@/lib/i18n/config"
import { getAllContent, type ContentMeta } from "@/lib/content-manager"

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

  // Fetch posts with error handling
  let posts: ContentMeta[] = []
  try {
    posts = await getAllContent("blog", awaitedParams.locale)
  } catch (error) {
    console.error("Error fetching blog posts:", error)
  }
  const recentPosts = posts.slice(0, 3)

  return (
    <HomeClient params={params} dictionary={dictionary} featuredProjects={featuredProjects} recentPosts={recentPosts} />
  )
}

