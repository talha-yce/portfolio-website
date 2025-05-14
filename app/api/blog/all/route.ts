import { NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import mongoose from 'mongoose'
import { NextRequest } from 'next/server'

// Define simple schema for blog posts
const BlogPostSchema = new mongoose.Schema({
  locale: String,
  title: String,
  slug: String,
  content: String,
  excerpt: String,
  date: Date,
  tags: [String],
  author: String,
  isPublished: Boolean
})

export async function GET(request: NextRequest) {
  try {
    // Get locale from query parameter
    const url = new URL(request.url)
    const locale = url.searchParams.get('locale')
    
    await connectToDatabase()
    
    // Use the model if it exists, or create it
    const BlogPost = mongoose.models.BlogPost || mongoose.model('BlogPost', BlogPostSchema)
    
    // Create query based on locale presence
    const query: { locale?: string } = {}
    
    // If locale is provided, filter by it
    if (locale) {
      query.locale = locale
    }
    
    // Get filtered blog posts sorted by date (newest first)
    const posts = await BlogPost.find(query).sort({ date: -1 })
    
    // Return the posts
    return NextResponse.json(posts)
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch blog posts' },
      { status: 500 }
    )
  }
} 