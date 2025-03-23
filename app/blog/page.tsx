import type { Metadata } from "next"

import BlogClientPage from "./BlogClientPage"

export const metadata: Metadata = {
  title: "Blog",
  description: "Articles and thoughts on web development, AI, and game development.",
}

export default async function BlogPage() {
  return <BlogClientPage />
}

