"use client"

import { motion } from "framer-motion"

import { BlogCard } from "@/components/blog-card"
import { getAllPosts } from "@/lib/blog"

export default async function BlogClientPage() {
  const posts = await getAllPosts()

  return (
    <div className="container py-12">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-green-400">
          Blog
        </h1>
        <p className="text-gray-400">Articles and thoughts on web development, AI, and game development.</p>
      </div>
      <div className="grid gap-6 pt-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, index) => (
          <motion.div
            key={post.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <BlogCard post={post} />
          </motion.div>
        ))}
      </div>
    </div>
  )
}

