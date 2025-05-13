import Link from "next/link"
import { Calendar, Clock, ArrowRight } from "lucide-react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { type Locale, getLocalizedPathname } from "@/lib/i18n/config"
import { BlogPost } from "@/lib/types"

interface BlogCardProps {
  post: BlogPost
  locale: Locale
  readingTimeText: string
}

export function BlogCard({ post, locale, readingTimeText }: BlogCardProps) {
  return (
    <Link href={getLocalizedPathname(`/blog/${post.slug}`, locale)}>
      <Card className="group h-full overflow-hidden border-border bg-white shadow-sm transition-all duration-300 hover:border-accent-400/30 hover:shadow-md hover:shadow-accent-400/10">
        <CardHeader className="p-6">
          <CardTitle className="text-xl text-foreground group-hover:text-gradient group-hover:from-accent-500 group-hover:to-primary-500 transition-all duration-300">
            {post.title}
          </CardTitle>
          <CardDescription>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <time dateTime={post.date}>{post.formattedDate}</time>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6">
          <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-4 p-6 pt-0">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag: string) => (
              <Link
                key={tag}
                href={getLocalizedPathname(`/blog/tag/${tag}`, locale)}
                onClick={(e) => e.stopPropagation()}
              >
                <Badge 
                  variant="outline" 
                  className="border-accent-400/30 bg-accent-100/50 text-accent-700 hover:bg-accent-200 transition-colors"
                >
                  {tag}
                </Badge>
              </Link>
            ))}
          </div>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{readingTimeText}</span>
            </div>
            <span className="text-accent-600 opacity-0 transform translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
              <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}

