import Link from "next/link"
import { type Locale, getLocalizedPathname } from "@/lib/i18n/config"
import type { Dictionary } from "@/lib/i18n/dictionaries"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "lucide-react"

interface RelatedPostsProps {
  posts: any[]
  locale: Locale
  dictionary: Dictionary
}

export default function RelatedPosts({ posts, locale, dictionary }: RelatedPostsProps) {
  if (posts.length === 0) return null;
  
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {posts.map((post) => (
        <Link key={post._id} href={getLocalizedPathname(`/blog/${post.slug}`, locale)}>
          <Card className="h-full overflow-hidden border-border bg-white shadow-sm transition-all duration-300 hover:border-primary-400/30 hover:shadow-md hover:shadow-primary-400/10">
            <CardHeader>
              <CardTitle className="text-lg text-foreground group-hover:text-primary-600 line-clamp-2">{post.title}</CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <time dateTime={post.date}>{post.formattedDate}</time>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm line-clamp-2">{post.excerpt}</p>
            </CardContent>
            <CardFooter>
              <div className="flex flex-wrap gap-2">
                {post.tags.slice(0, 3).map((tag: string) => (
                  <Badge key={tag} variant="outline" className="border-accent-400/30 bg-accent-100/50 text-accent-700 text-xs">
                    {tag}
                  </Badge>
                ))}
                {post.tags.length > 3 && (
                  <Badge variant="outline" className="border-accent-400/30 bg-accent-100/50 text-accent-700 text-xs">
                    +{post.tags.length - 3}
                  </Badge>
                )}
              </div>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  )
} 