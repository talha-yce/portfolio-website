import Link from "next/link"
import { Calendar, Clock, ArrowRight } from "lucide-react"
import Image from "next/image"

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
    <Link href={getLocalizedPathname(`/blog/${post.slug}`, locale)} className="group block h-full">
      <Card className="h-full overflow-hidden border-border bg-white/60 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-lg hover:shadow-accent-400/5 hover:border-accent-400/40 hover:translate-y-[-4px]">
        {post.coverImage && (
          <div className="relative w-full h-48 overflow-hidden">
            <Image 
              src={post.coverImage}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-50"></div>
          </div>
        )}
        <CardHeader className={`p-6 ${post.coverImage ? 'pt-4' : ''}`}>
          <CardTitle className="text-xl font-bold text-foreground transition-colors duration-300 line-clamp-2 group-hover:text-primary-600">
            {post.title}
          </CardTitle>
          <CardDescription>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
              <Calendar className="h-4 w-4 text-accent-500" />
              <time dateTime={post.date}>{post.formattedDate}</time>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent className="px-6">
          <p className="text-muted-foreground line-clamp-3">{post.excerpt}</p>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-4 p-6 pt-2 border-t border-border/50 mt-auto">
          <div className="flex flex-wrap gap-1.5">
            {post.tags.slice(0, 3).map((tag: string) => (
              <Link
                key={tag}
                href={getLocalizedPathname(`/blog/tag/${tag}`, locale)}
                onClick={(e) => e.stopPropagation()}
              >
                <Badge 
                  variant="outline" 
                  className="px-2.5 py-0.5 text-xs font-medium rounded-full border-accent-400/30 bg-accent-100/50 text-accent-700 hover:bg-accent-200 transition-colors"
                >
                  {tag}
                </Badge>
              </Link>
            ))}
            {post.tags.length > 3 && (
              <Badge variant="outline" className="px-2 py-0.5 text-xs rounded-full border-primary-200 bg-primary-50/50 text-primary-700">
                +{post.tags.length - 3}
              </Badge>
            )}
          </div>
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5 text-primary-500" />
              <span>{readingTimeText}</span>
            </div>
            <span className="text-primary-600 opacity-70 group-hover:opacity-100 transition-all duration-300 flex items-center gap-1 text-sm font-medium">
              <span className="hidden md:inline">Read more</span>
              <ArrowRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}

