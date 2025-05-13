import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { notFound } from "next/navigation"

import { Button } from "@/components/ui/button"
import { getDictionary } from "@/lib/i18n/dictionaries"
import { getBlogPostsByTag } from "@/lib/services/blogService"
import { sanitizeForClient } from "@/lib/utils"
import { Locale, getLocalizedPathname } from "@/lib/i18n/config"
import BlogPageClient from "../../BlogPageClient"
import { BlogPost, transformToBlogPost } from "@/lib/types"

interface TagPageProps {
  params: {
    locale: Locale
    tag: string
  }
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const locale = params.locale
  const tag = decodeURIComponent(params.tag)
  const dictionary = await getDictionary(locale)
  
  return {
    title: `${dictionary.blog.postsTaggedWith} ${tag} | Talha Yüce`,
    description: `${dictionary.blog.browsePostsTagged} ${tag}`,
  }
}

export default async function TagPage({ params }: TagPageProps) {
  const locale = params.locale
  const tag = decodeURIComponent(params.tag)
  const dictionary = await getDictionary(locale)
  
  const dbPosts = await getBlogPostsByTag(tag, locale)
  
  if (!dbPosts || dbPosts.length === 0) {
    notFound()
  }
  
  // Transform DB posts to ContentMeta compatible format
  const posts: BlogPost[] = dbPosts.map(post => transformToBlogPost(post))
  
  return (
    <div className="container py-8">
      <div className="mb-8">
        <Link href={getLocalizedPathname("/blog", locale)}>
          <Button variant="ghost" className="mb-6 gap-2 text-muted-foreground hover:text-primary-600">
            <ArrowLeft className="h-4 w-4" />
            {dictionary.common.backToBlog}
          </Button>
        </Link>
        
        <h1 className="text-3xl font-bold mb-3 text-foreground">
          {dictionary.blog.postsTaggedWith} <span className="text-primary-600">"{tag}"</span>
        </h1>
        <p className="text-muted-foreground">
          {posts.length} {posts.length === 1 
            ? dictionary.blog.post 
            : dictionary.blog.posts}
        </p>
      </div>
      
      <BlogPageClient
        posts={sanitizeForClient(posts)}
        locale={locale}
        dictionary={dictionary}
      />
    </div>
  )
} 