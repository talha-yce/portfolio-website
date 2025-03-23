import type { Metadata } from "next"
import { getDictionary } from "@/lib/i18n/dictionaries"
import type { Locale } from "@/lib/i18n/config"
import BlogPageClient from "./BlogPageClient"
import { getAllContent, type ContentMeta } from "@/lib/content-manager"

export async function generateMetadata({ params }: { params: { locale: Locale } }): Promise<Metadata> {
  const locale = (await params).locale
  const dictionary = await getDictionary(locale)

  return {
    title: dictionary.blog.title,
    description: dictionary.blog.description,
  }
}

export default async function BlogPage({ params }: { params: { locale: Locale } }) {
  const locale = (await params).locale
  const dictionary = await getDictionary(locale)

  let posts: ContentMeta[] = []
  try {
    posts = await getAllContent("blog", locale)
  } catch (error) {
    console.error("Error fetching blog posts:", error)
  }

  return <BlogPageClient params={{ locale }} dictionary={dictionary} posts={posts} />
}

