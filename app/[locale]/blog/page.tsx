import type { Metadata } from "next"
import { getAllBlogPosts } from "@/lib/services/blogService" 
import { getDictionary } from "@/lib/i18n/dictionaries"
import { type Locale } from "@/lib/i18n/config"
import { sanitizeForClient } from "@/lib/utils"
import BlogPageClient from "./BlogPageClient"

export async function generateMetadata({ params }: { params: { locale: Locale } }): Promise<Metadata> {
  const locale = (await params).locale
  const dictionary = await getDictionary(locale)

  return {
    title: dictionary.blog?.title || "Blog",
    description: dictionary.blog?.description || "Latest blog posts",
  }
}

export default async function BlogPage({ params }: { params: { locale: Locale } }) {
  const locale = (await params).locale
  const dictionary = await getDictionary(locale)

  let posts: any[] = []
  try {
    posts = await getAllBlogPosts(locale)
  } catch (error) {
    console.error("Error fetching blog posts:", error)
  }

  return <BlogPageClient params={{ locale }} dictionary={dictionary} posts={sanitizeForClient(posts)} />
}

