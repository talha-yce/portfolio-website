import type { Metadata } from "next"
import BlogPageClient from "./BlogPageClient"
import { getDictionary } from "@/lib/i18n/dictionaries"
import type { Locale } from "@/lib/i18n/config"
import { getAllBlogPosts } from "@/lib/services/blogService"
import { getAllContent, type ContentMeta } from "@/lib/content-manager"
import { sanitizeForClient } from "@/lib/utils"
import { BlogPost, transformToBlogPost } from "@/lib/types"

export async function generateMetadata({ params }: { params: { locale: Locale } }): Promise<Metadata> {
  const awaitedParams = await params
  const dictionary = await getDictionary(awaitedParams.locale)

  return {
    title: `${dictionary.blog.title} | Talha Yüce`,
    description: dictionary.blog.description,
  }
}

export default async function BlogPage({ params }: { params: { locale: Locale } }) {
  const awaitedParams = await params
  const dictionary = await getDictionary(awaitedParams.locale)
  
  // Fetch posts from database with error handling
  let posts: BlogPost[] = []
  try {
    const dbPosts = await getAllBlogPosts(awaitedParams.locale)
    
    // Transform DB posts to compatible format
    posts = dbPosts.map(post => transformToBlogPost(post))
  } catch (error) {
    console.error("Error fetching blog posts from database:", error)
    // Fallback to static content if database fetch fails
    try {
      const staticPosts = await getAllContent("blog", awaitedParams.locale)
      posts = staticPosts.map(post => ({
        ...post,
        formattedDate: post.formattedDate || new Date(post.date).toLocaleDateString()
      }))
    } catch (fallbackError) {
      console.error("Error fetching fallback blog posts:", fallbackError)
    }
  }

  return (
    <div className="container py-12">
      <BlogPageClient 
        locale={awaitedParams.locale}
        dictionary={dictionary}
        posts={sanitizeForClient(posts)}
      />
    </div>
  )
}

