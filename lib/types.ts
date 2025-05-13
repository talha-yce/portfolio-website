import { ContentMeta } from "./content-manager"

export interface BlogPost extends ContentMeta {
  _id?: string
  content?: any[]
  formattedDate: string
  relatedPosts?: string[]
}

export type DbBlogPost = {
  _id: string
  title: string
  slug: string
  date: Date
  formattedDate: string
  excerpt: string
  content: any[]
  tags: string[]
  coverImage?: string
  readingTime?: number
  relatedPosts?: string[]
  isPublished?: boolean
  [key: string]: any
}

// Update Dictionary augmentation
declare module "@/lib/i18n/dictionaries" {
  interface Blog {
    postsTaggedWith?: string
    browsePostsTagged?: string
    post?: string
    posts?: string
  }
}

// Type guard for blog posts
export function isDbBlogPost(post: any): post is DbBlogPost {
  return post && typeof post === 'object' && post.date instanceof Date
}

// Utility function to safely transform any kind of blog post to BlogPost format
export function transformToBlogPost(post: any): BlogPost {
  return {
    slug: post.slug,
    title: post.title,
    date: typeof post.date === 'object' && post.date instanceof Date 
      ? post.date.toISOString() 
      : String(post.date),
    formattedDate: post.formattedDate || '',
    excerpt: post.excerpt || '',
    tags: Array.isArray(post.tags) ? post.tags : [],
    coverImage: post.coverImage,
    readingTime: post.readingTime,
    _id: post._id,
    relatedPosts: post.relatedPosts
  }
} 