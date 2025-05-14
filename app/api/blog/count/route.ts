import { NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import mongoose from 'mongoose'
import { NextRequest } from 'next/server'

// Define simple schema for blog posts
const BlogPostSchema = new mongoose.Schema({
  locale: String,
  title: String,
  slug: String,
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
    
    // Count blog posts based on query
    const count = await BlogPost.countDocuments(query)
    
    return NextResponse.json({ 
      success: true, 
      count,
      locale: locale || 'all' 
    })
  } catch (error) {
    console.error('Error counting blog posts:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to count blog posts' },
      { status: 500 }
    )
  }
} 