import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, User, Share2, Tag, Edit, Bookmark } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { getDictionary } from "@/lib/i18n/dictionaries"
import { type Locale, getLocalizedPathname } from "@/lib/i18n/config"
import { getBlogPostBySlug, getRelatedBlogPosts } from "@/lib/services/blogService"
import { sanitizeForClient } from "@/lib/utils"
import BlogContent from "@/components/blog-content"
import RelatedPosts from "@/components/related-posts"
import TableOfContents from "@/components/table-of-contents"
import ShareButtons from "@/components/share-buttons"
import AuthorCard from "@/components/author-card"

interface BlogPostPageProps {
  params: {
    locale: Locale
    slug: string
  }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const locale = params.locale
  const slug = params.slug
  const post = await getBlogPostBySlug(slug, locale)
  
  if (!post) {
    return {
      title: "Blog Post Not Found",
    }
  }
  
  return {
    title: post.title,
    description: post.metaDescription || post.excerpt,
    keywords: post.keywords,
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.coverImage ? [post.coverImage] : [],
      type: 'article',
      publishedTime: post.date.toString(),
      modifiedTime: post.lastModified?.toString(),
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.metaDescription || post.excerpt,
      images: post.coverImage ? [post.coverImage] : [],
    }
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const locale = (await params).locale
  const slug = (await params).slug
  const post = await getBlogPostBySlug(slug, locale)
  const dictionary = await getDictionary(locale)

  if (!post) {
    notFound()
  }

  // Get related posts
  const relatedPosts = await getRelatedBlogPosts(post._id, post.tags, locale, 3)
  
  // Format dates
  const formattedDate = post.formattedDate
  const formattedLastModified = post.lastModified 
    ? new Date(post.lastModified).toLocaleDateString(
        locale === 'tr' ? 'tr-TR' : 'en-US', 
        { year: 'numeric', month: 'long', day: 'numeric' }
      ) 
    : null
  
  // Extract headings for table of contents
  const headings = post.content
    .filter(section => section.type === 'heading')
    .map(section => ({ 
      id: section.content.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-'),
      text: section.content,
      level: section.content.startsWith('# ') ? 1 : 
             section.content.startsWith('## ') ? 2 : 
             section.content.startsWith('### ') ? 3 : 2
    }))
  
  const readingTimeText = dictionary.blog.readingTime.replace("{time}", post.readingTime?.toString() || "0")
  const url = typeof window !== 'undefined' ? window.location.href : ''

  return (
    <div className="container py-12">
      <Link href={getLocalizedPathname("/blog", locale)}>
        <Button variant="ghost" className="mb-6 gap-2 text-muted-foreground hover:text-primary-600">
          <ArrowLeft className="h-4 w-4" />
          {dictionary.common.backToBlog}
        </Button>
      </Link>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-1 space-y-8">
          <div className="lg:sticky lg:top-20">
            {headings.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium mb-3 text-foreground">{dictionary.blog.tableOfContents}</h3>
                  <TableOfContents headings={headings} />
                </CardContent>
              </Card>
            )}
            
            <Card className="mt-6">
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-3 text-foreground">{dictionary.blog.sharePost}</h3>
                <ShareButtons url={url} title={post.title} />
              </CardContent>
            </Card>
            
            <Card className="mt-6">
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-3 text-foreground">{dictionary.blog.tags}</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.length > 0 ? (
                    post.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="border-accent-400/30 bg-accent-100/50 text-accent-700">
                        <Link href={getLocalizedPathname(`/blog/tag/${tag}`, locale)}>
                          {tag}
                        </Link>
                      </Badge>
                    ))
                  ) : (
                    <span className="text-muted-foreground">{dictionary.blog.noTags}</span>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </aside>
        
        {/* Main Content */}
        <article className="lg:col-span-3 max-w-3xl">
          <div className="space-y-8">
            {post.coverImage && (
              <div className="overflow-hidden rounded-lg shadow-md">
                <img 
                  src={post.coverImage} 
                  alt={post.coverImageAlt || post.title} 
                  className="w-full h-auto object-cover max-h-[500px]"
                />
              </div>
            )}
            
            <div>
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-accent-600">
                {post.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <time dateTime={typeof post.date === 'string' ? post.date : new Date(post.date).toISOString()}>
                    {formattedDate}
                  </time>
                </div>
                
                {formattedLastModified && (
                  <div className="flex items-center gap-2">
                    <Edit className="h-4 w-4" />
                    <time dateTime={typeof post.lastModified === 'string' ? post.lastModified : new Date(post.lastModified).toISOString()}>
                      {dictionary.blog.updated}: {formattedLastModified}
                    </time>
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{readingTimeText}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{post.author || "Admin"}</span>
                </div>
              </div>
            </div>
            
            <div className="italic text-gray-700 border-l-4 border-primary-500 pl-4 py-3 bg-primary-50/50 rounded-r-md">
              {post.excerpt}
            </div>
            
            <Separator className="bg-border" />
            
            <div className="prose max-w-none">
              <BlogContent content={sanitizeForClient(post.content)} />
            </div>
            
            <Separator className="bg-border" />
            
            <AuthorCard author={post.author} />
            
            <div className="flex flex-wrap gap-2 items-center mt-6">
              <span className="text-gray-700 mr-2">{dictionary.blog.keywordsTags}: </span>
              {post.keywords && post.keywords.length > 0 ? (
                post.keywords.map((keyword) => (
                  <Badge key={keyword} variant="secondary" className="border-primary-400/30 bg-primary-100/50 text-primary-700">
                    {keyword}
                  </Badge>
                ))
              ) : (
                <span className="text-muted-foreground">{dictionary.blog.noKeywords}</span>
              )}
            </div>
          </div>
          
          {relatedPosts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold mb-6 text-foreground">{dictionary.blog.relatedPosts}</h2>
              <RelatedPosts posts={sanitizeForClient(relatedPosts)} locale={locale} dictionary={dictionary} />
            </div>
          )}
        </article>
      </div>
    </div>
  )
}

