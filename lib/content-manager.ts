"use server"

import fs from "fs"
import path from "path"
import matter from "gray-matter"
import { remark } from "remark"
import html from "remark-html"
import { type Locale, defaultLocale } from "./i18n/config"

export interface ContentMeta {
  slug: string
  title: string
  date: string
  formattedDate?: string
  excerpt?: string
  description?: string
  tags: string[]
  coverImage?: string
  github?: string
  link?: string
  demo?: string
  readingTime?: number
}

export interface ContentItem extends ContentMeta {
  content: string
}

const formatDate = (date: string, locale: Locale): string => {
  return new Date(date).toLocaleDateString(locale === "tr" ? "tr-TR" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

const calculateReadingTime = (content: string): number => {
  const wordsPerMinute = 200
  const words = content.split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

const getDataDirectory = (type: "blog" | "projects", locale: Locale = defaultLocale) => {
  // Make sure we're using the correct path
  const dir = path.join(process.cwd(), "public", "data", type, locale)
  console.log(`Looking for ${type} content in: ${dir}`)
  return dir
}

export const getContentFiles = async (type: "blog" | "projects", locale: Locale = defaultLocale): Promise<string[]> => {
  const contentDir = getDataDirectory(type, locale)

  try {
    if (!fs.existsSync(contentDir)) {
      console.warn(`Directory not found: ${contentDir}, falling back to default locale`)
      if (locale !== defaultLocale) {
        return getContentFiles(type, defaultLocale)
      }
      return []
    }
    return fs.readdirSync(contentDir).filter((file) => file.endsWith(".md"))
  } catch (error) {
    console.error(`Error reading ${type} directory for ${locale}:`, error)
    if (locale !== defaultLocale) {
      return getContentFiles(type, defaultLocale)
    }
    return []
  }
}

export const getContentMeta = async (
  type: "blog" | "projects",
  slug: string,
  locale: Locale = defaultLocale,
): Promise<ContentMeta | null> => {
  try {
    const fullPath = path.join(getDataDirectory(type, locale), `${slug}.md`)

    if (!fs.existsSync(fullPath)) {
      return null
    }

    const fileContents = fs.readFileSync(fullPath, "utf8")
    const { data } = matter(fileContents)

    const meta: ContentMeta = {
      slug,
      title: data.title,
      date: data.date,
      formattedDate: formatDate(data.date, locale),
      tags: data.tags || [],
      coverImage: data.coverImage || null,
      ...(type === "blog" && { excerpt: data.excerpt || "" }),
      ...(type === "projects" && { description: data.description || "" }),
      ...(type === "projects" && { github: data.github || "" }),
      ...(type === "projects" && { link: data.link || "" }),
    }

    if (type === "blog") {
      // Calculate reading time for blog posts
      const content = matter(fileContents).content
      meta.readingTime = calculateReadingTime(content)
    }

    return meta
  } catch (error) {
    console.error(`Error getting ${type} metadata for ${slug}:`, error)
    return null
  }
}

export const getContentItem = async (
  type: "blog" | "projects",
  slug: string,
  locale: Locale = defaultLocale,
): Promise<ContentItem | null> => {
  try {
    const fullPath = path.join(getDataDirectory(type, locale), `${slug}.md`)

    // Check if file exists
    if (!fs.existsSync(fullPath)) {
      // Try to get content from default locale if not found in requested locale
      if (locale !== defaultLocale) {
        return getContentItem(type, slug, defaultLocale)
      }
      return null
    }

    const fileContents = fs.readFileSync(fullPath, "utf8")
    const { data, content } = matter(fileContents)

    // Convert Markdown to HTML
    const processedContent = await remark().use(html, { sanitize: false }).process(content)
    const contentHtml = processedContent.toString()

    const meta = await getContentMeta(type, slug, locale)

    if (!meta) {
      return null
    }

    return {
      ...meta,
      content: contentHtml,
    }
  } catch (error) {
    console.error(`Error getting ${type} content for ${slug}:`, error)

    // Try to get content from default locale if not found in requested locale
    if (locale !== defaultLocale) {
      return getContentItem(type, slug, defaultLocale)
    }

    return null
  }
}

export const getAllContent = async (
  type: "blog" | "projects",
  locale: Locale = defaultLocale,
): Promise<ContentMeta[]> => {
  try {
    const files = await getContentFiles(type, locale)

    if (!files.length) {
      console.warn(`No ${type} files found for locale ${locale}`)
      return []
    }

    const allContent = await Promise.all(
      files.map(async (fileName) => {
        const slug = fileName.replace(/\.md$/, "")
        try {
          const meta = await getContentMeta(type, slug, locale)
          return meta
        } catch (error) {
          console.error(`Error getting metadata for ${slug}:`, error)
          return null
        }
      }),
    )

    // Filter out null values and sort by date (newest first)
    return allContent
      .filter((item): item is ContentMeta => item !== null)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  } catch (error) {
    console.error(`Error getting all ${type} content for ${locale}:`, error)

    // If we can't get content for the requested locale, try the default locale
    if (locale !== defaultLocale) {
      return getAllContent(type, defaultLocale)
    }

    return []
  }
}

