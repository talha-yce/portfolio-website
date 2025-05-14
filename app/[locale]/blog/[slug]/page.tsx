import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Calendar, Clock, User, Share2, Tag, Edit, Bookmark } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { getDictionary } from "@/lib/i18n/dictionaries"
import { type Locale, getLocalizedPathname } from "@/lib/i18n/config"
import { getBlogPostBySlug, getRelatedBlogPosts } from "@/lib/services/blogService"
import { sanitizeForClient } from "@/lib/utils"
import dynamic from "next/dynamic"
import { PageTransition } from "@/components/page-transition"
import TableOfContents from "@/components/table-of-contents"
import ShareButtons from "@/components/share-buttons"

// Dynamically import non-critical components
const BlogContent = dynamic(() => import("@/components/blog-content"), {
  loading: () => <div className="animate-pulse bg-gray-200 h-96 rounded-lg w-full" />
})
const AuthorCard = dynamic(() => import("@/components/author-card"))
const RelatedPosts = dynamic(() => import("@/components/related-posts"))

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
    <PageTransition>
      <div className="relative min-h-screen pb-20">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent-50/30 via-background to-background pointer-events-none"></div>
        
        <div className="container py-12 relative z-10">
          <Link href={getLocalizedPathname("/blog", locale)}>
            <Button variant="ghost" className="mb-10 gap-2 text-muted-foreground hover:text-accent-600 group transition-colors">
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              {dictionary.common.backToBlog}
            </Button>
          </Link>
          
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <aside className="lg:col-span-1 space-y-8 order-2 lg:order-1">
              <div className="lg:sticky lg:top-20">
                {headings.length > 0 && (
                  <Card className="overflow-hidden border-border bg-white/60 backdrop-blur-sm shadow-sm">
                    <CardContent className="pt-6">
                      <h3 className="text-lg font-medium mb-3 text-foreground">{dictionary.blog.tableOfContents}</h3>
                      <TableOfContents headings={headings} />
                    </CardContent>
                  </Card>
                )}
                
                <Card className="mt-6 overflow-hidden border-border bg-white/60 backdrop-blur-sm shadow-sm">
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-medium mb-3 text-foreground">{dictionary.blog.sharePost}</h3>
                    <ShareButtons url={url} title={post.title} />
                  </CardContent>
                </Card>
                
                <Card className="mt-6 overflow-hidden border-border bg-white/60 backdrop-blur-sm shadow-sm">
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-medium mb-3 text-foreground">{dictionary.blog.tags}</h3>
                    <div className="flex flex-wrap gap-2">
                      {post.tags.length > 0 ? (
                        post.tags.map((tag) => (
                          <Badge 
                            key={tag} 
                            variant="outline" 
                            className="px-2.5 py-0.5 text-xs font-medium rounded-full border-accent-400/30 bg-accent-100/50 text-accent-700 hover:bg-accent-200 transition-colors"
                          >
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
            <article className="lg:col-span-3 max-w-3xl mx-auto order-1 lg:order-2">
              <div className="space-y-8">
                {post.coverImage && (
                  <div className="overflow-hidden rounded-xl shadow-lg relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-50 z-10"></div>
                    <Image 
                      src={post.coverImage} 
                      alt={post.coverImageAlt || post.title} 
                      width={1200}
                      height={630}
                      priority
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 800px, 1200px"
                      className="w-full h-auto object-cover max-h-[500px]"
                    />
                  </div>
                )}
                
                <div>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-accent-600 to-accent-800 leading-tight">
                    {post.title}
                  </h1>
                  
                  <div className="flex flex-wrap items-center gap-4 mt-6 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2 bg-white/60 px-3 py-1.5 rounded-full shadow-sm">
                      <Calendar className="h-4 w-4 text-accent-500" />
                      <time dateTime={typeof post.date === 'string' ? post.date : new Date(post.date).toISOString()}>
                        {formattedDate}
                      </time>
                    </div>
                    
                    {formattedLastModified && (
                      <div className="flex items-center gap-2 bg-white/60 px-3 py-1.5 rounded-full shadow-sm">
                        <Edit className="h-4 w-4 text-accent-500" />
                        <time dateTime={typeof post.lastModified === 'string' ? post.lastModified : new Date(post.lastModified).toISOString()}>
                          {dictionary.blog.updated}: {formattedLastModified}
                        </time>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 bg-white/60 px-3 py-1.5 rounded-full shadow-sm">
                      <Clock className="h-4 w-4 text-accent-500" />
                      <span>{readingTimeText}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 bg-white/60 px-3 py-1.5 rounded-full shadow-sm">
                      <User className="h-4 w-4 text-accent-500" />
                      <span>{post.author || "Admin"}</span>
                    </div>
                  </div>
                </div>
                
                <div className="italic text-muted-foreground border-l-4 border-accent-500 pl-4 py-4 bg-accent-50/50 rounded-r-md text-lg">
                  {post.excerpt}
                </div>
                
                <Separator className="bg-border/50" />
                
                <div className="prose max-w-none prose-headings:text-foreground prose-headings:font-bold prose-h2:text-2xl prose-h3:text-xl prose-p:text-muted-foreground prose-a:text-accent-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-strong:text-foreground">
                  <BlogContent content={sanitizeForClient(post.content)} />
                </div>
                
                <Separator className="bg-border/50" />
                
                <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 shadow-sm">
                  <AuthorCard author={post.author} />
                </div>
                
                <div className="flex flex-wrap gap-2 items-center mt-6 p-6 bg-white/60 backdrop-blur-sm rounded-xl shadow-sm">
                  <span className="text-foreground font-medium mr-2">{dictionary.blog.keywordsTags}: </span>
                  {post.keywords && post.keywords.length > 0 ? (
                    post.keywords.map((keyword) => (
                      <Badge 
                        key={keyword} 
                        variant="secondary" 
                        className="border-primary-400/30 bg-primary-100/50 text-primary-700 rounded-full px-2.5 py-0.5"
                      >
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
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-accent-600 to-accent-800">
                      {dictionary.blog.relatedPosts}
                    </h2>
                    <p className="text-muted-foreground">{dictionary.blog.relatedPostsSubtitle}</p>
                  </div>
                  <RelatedPosts posts={relatedPosts} locale={locale} dictionary={dictionary} />
                </div>
              )}
            </article>
          </div>
        </div>
      </div>
    </PageTransition>
  )
}

