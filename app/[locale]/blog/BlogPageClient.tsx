"use client"

import { motion } from "framer-motion"
import { BlogCard } from "@/components/blog-card"
import { PageTransition } from "@/components/page-transition"
import { type Locale } from "@/lib/i18n/config"
import type { Dictionary } from "@/lib/i18n/dictionaries"
import type { ContentMeta } from "@/lib/content-manager"

interface BlogPageClientProps {
  params: { locale: Locale }
  dictionary: Dictionary
  posts: ContentMeta[]
}

export default function BlogPageClient({ params, dictionary, posts }: BlogPageClientProps) {
  const locale = params.locale

  return (
    <PageTransition>
      <div className="container py-12">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-green-400">
            {dictionary.blog.title}
          </h1>
          <p className="text-gray-400">{dictionary.blog.description}</p>
        </div>
        <div className="grid gap-6 pt-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => {
            const readingTimeText = dictionary.blog.readingTime.replace("{time}", post.readingTime?.toString() || "0")
            return (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <BlogCard post={post} locale={locale} readingTimeText={readingTimeText} />
              </motion.div>
            )
          })}
        </div>
      </div>
    </PageTransition>
  )
}

