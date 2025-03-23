import Link from "next/link"
import { Calendar, Clock } from "lucide-react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { ContentMeta } from "@/lib/content-manager"
import { type Locale, getLocalizedPathname } from "@/lib/i18n/config"

interface BlogCardProps {
  post: ContentMeta
  locale: Locale
  readingTimeText: string
}

export function BlogCard({ post, locale, readingTimeText }: BlogCardProps) {
  return (
    <Link href={getLocalizedPathname(`/blog/${post.slug}`, locale)}>
      <Card className="h-full overflow-hidden border-purple-900/40 bg-black/20 backdrop-blur-sm transition-all duration-300 hover:border-purple-600/60 hover:shadow-[0_0_15px_rgba(147,51,234,0.15)]">
        <CardHeader>
          <CardTitle className="text-xl text-purple-300">{post.title}</CardTitle>
          <CardDescription>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Calendar className="h-4 w-4" />
              <time dateTime={post.date}>{post.formattedDate}</time>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400 line-clamp-3">{post.excerpt}</p>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Clock className="h-4 w-4" />
            <span>{readingTimeText}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="border-green-600/40 bg-green-950/20 text-green-400">
                {tag}
              </Badge>
            ))}
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}

