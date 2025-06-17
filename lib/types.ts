import { ContentMeta } from "./content-manager"

export interface BlogPost extends ContentMeta {
  _id?: string
  content?: any[]
  formattedDate: string
  relatedPosts?: string[]
}

export interface Project extends ContentMeta {
  _id?: string
  content?: any[]
  formattedDate: string
  github?: string
  demo?: string
  status?: string
  featured?: boolean
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

export type DbProject = {
  _id: string
  title: string
  slug: string
  date: Date
  formattedDate: string
  description: string
  content: any[]
  tags: string[]
  github?: string
  demo?: string
  coverImage?: string
  readingTime?: number
  isPublished?: boolean
  featured?: boolean
  status?: string
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

// Type guard for projects
export function isDbProject(project: any): project is DbProject {
  return project && typeof project === 'object' && project.date instanceof Date
}

// Utility function to safely transform any kind of project to Project format
export function transformToProject(project: any): Project {
  return {
    slug: project.slug,
    title: project.title,
    date: typeof project.date === 'object' && project.date instanceof Date 
      ? project.date.toISOString() 
      : String(project.date),
    formattedDate: project.formattedDate || '',
    description: project.description || '',
    tags: Array.isArray(project.tags) ? project.tags : [],
    coverImage: project.coverImage,
    readingTime: project.readingTime,
    github: project.github,
    demo: project.demo,
    status: project.status,
    featured: project.featured,
    _id: project._id
  }
} 