import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getAllContent, getContentItem } from "@/lib/content-manager"
import { getDictionary } from "@/lib/i18n/dictionaries"
import { type Locale, getLocalizedPathname } from "@/lib/i18n/config"

interface BlogPostPageProps {
  params: {
    locale: Locale
    slug: string
  }
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const locale = (await params).locale
  const slug = (await params).slug
  const post = await getContentItem("blog", slug, locale)

  if (!post) {
    return {
      title: "Post Not Found",
    }
  }

  return {
    title: post.title,
    description: post.excerpt,
  }
}

export async function generateStaticParams({ params }: { params: { locale: Locale } }) {
  const locale = (await params).locale
  const posts = await getAllContent("blog", locale)

  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const locale = (await params).locale
  const slug = (await params).slug
  const post = await getContentItem("blog", slug, locale)
  const dictionary = await getDictionary(locale)

  if (!post) {
    notFound()
  }

  const readingTimeText = dictionary.blog.readingTime.replace("{time}", post.readingTime?.toString() || "0")

  return (
    <div className="container py-12">
      <Link href={getLocalizedPathname("/blog", locale)}>
        <Button variant="ghost" className="mb-6 gap-2 text-gray-400 hover:text-purple-400">
          <ArrowLeft className="h-4 w-4" />
          {dictionary.common.backToBlog}
        </Button>
      </Link>
      <article className="mx-auto max-w-3xl">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-green-400">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 text-gray-400">
              <Calendar className="h-4 w-4" />
              <time dateTime={post.date}>{post.formattedDate}</time>
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <Clock className="h-4 w-4" />
              <span>{readingTimeText}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="border-green-600/40 bg-green-950/20 text-green-400">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        <div className="prose prose-invert prose-purple mt-8 max-w-none">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
      </article>
    </div>
  )
}

