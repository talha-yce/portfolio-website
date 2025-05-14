import { NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import mongoose from 'mongoose'
import { NextRequest } from 'next/server'

// Define simple schema for blog posts with timestamps
const BlogPostSchema = new mongoose.Schema({
  locale: String,
  title: String,
  slug: String,
  content: String,
  publishDate: Date,
  updatedAt: Date,
  isPublished: Boolean,
  author: String
}, { timestamps: true })

export async function GET(request: NextRequest) {
  try {
    // Get limit from query parameter, default to 5
    const url = new URL(request.url)
    const limitParam = url.searchParams.get('limit')
    const limit = limitParam ? parseInt(limitParam) : 5
    
    await connectToDatabase()
    
    // Use the model if it exists, or create it
    const BlogPost = mongoose.models.BlogPost || mongoose.model('BlogPost', BlogPostSchema)
    
    // Get latest blog posts with activity information
    const recentPosts = await BlogPost.find({})
      .sort({ updatedAt: -1 }) // Sort by most recently updated
      .limit(limit)
      .select('title updatedAt author isPublished')
      .lean()
    
    // Format the activity data
    const activities = recentPosts.map((post, index) => {
      const date = new Date(post.updatedAt)
      const now = new Date()
      
      // Calculate time difference
      const diffMs = now.getTime() - date.getTime()
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
      const diffDays = Math.floor(diffHours / 24)
      
      let timeDisplay
      if (diffHours < 24) {
        timeDisplay = `${diffHours} saat önce`
      } else {
        timeDisplay = `${diffDays} gün önce`
      }
      
      // Determine action type
      const action = post.isPublished 
        ? 'Blog yazısı yayınlandı' 
        : 'Blog yazısı taslak olarak kaydedildi'
      
      return {
        id: index + 1,
        action: `${action}: ${post.title}`,
        time: timeDisplay,
        user: post.author || 'admin'
      }
    })
    
    return NextResponse.json({ 
      success: true, 
      activities
    })
  } catch (error) {
    console.error('Error fetching blog activities:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch blog activities' },
      { status: 500 }
    )
  }
} 