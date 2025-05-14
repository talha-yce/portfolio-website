import { NextRequest, NextResponse } from "next/server";
import mongoose from 'mongoose';

// MongoDB connection info
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://210541018:7sor4YST3m7N5GyV@ads-test.mnm2j0z.mongodb.net/web';

// Blog post interface (simple version)
interface IBlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: any[];
  tags: string[];
  keywords: string[];
  locale: string;
  date: Date;
  isPublished: boolean;
  author: string;
  coverImage?: string;
  coverImageAlt?: string;
  metaDescription?: string;
  lastModified?: Date;
  readingTime?: number;
  relatedPosts?: string[];
}

// Connect to MongoDB directly
const connectToDatabase = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      console.log('[GET-FULL] Already connected to MongoDB');
      return mongoose.connection;
    }
    
    const conn = await mongoose.connect(MONGODB_URI);
    console.log('[GET-FULL] MongoDB connection established');
    return conn;
  } catch (error) {
    console.error('[GET-FULL] MongoDB connection error:', error);
    throw error;
  }
};

// GET endpoint to fetch a blog post with full content
export async function GET(request: NextRequest) {
  console.log('[GET-FULL] GET request received');
  
  try {
    // Extract query parameters
    const url = new URL(request.url);
    const slug = url.searchParams.get('slug');
    const locale = url.searchParams.get('locale');
    
    if (!slug || !locale) {
      console.error('[GET-FULL] Missing slug or locale parameter');
      return NextResponse.json({ 
        error: 'Both slug and locale parameters are required' 
      }, { status: 400 });
    }
    
    // URL decode the slug
    const decodedSlug = decodeURIComponent(slug);
    console.log(`[GET-FULL] Searching for blog with slug="${decodedSlug}" and locale="${locale}"`);
    
    // Connect to MongoDB
    await connectToDatabase();
    
    // Use the native MongoDB driver directly for more control
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('MongoDB connection database not available');
    }
    const collection = db.collection('blogposts');
    
    // Search for the blog post
    const post = await collection.findOne({ 
      slug: decodedSlug,
      locale: locale
    });
    
    if (!post) {
      console.log(`[GET-FULL] Blog post not found for slug="${decodedSlug}"`);
      
      // Try to find with a more flexible match
      const normalizeSlug = (s: string) => s
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      
      // Get all posts for the locale
      const allPosts = await collection.find({ locale }).toArray();
      console.log(`[GET-FULL] Found ${allPosts.length} posts for locale="${locale}"`);
      
      // Try to find a match with normalized slug
      const normalizedSearchSlug = normalizeSlug(decodedSlug);
      const matchedPost = allPosts.find(p => 
        normalizeSlug(p.slug) === normalizedSearchSlug
      );
      
      if (!matchedPost) {
        console.log(`[GET-FULL] No match found even with normalized slug`);
        return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
      }
      
      console.log(`[GET-FULL] Found match with normalized slug: ${matchedPost.title}`);
      
      // Log content details
      if (Array.isArray(matchedPost.content)) {
        console.log(`[GET-FULL] Content sections: ${matchedPost.content.length}`);
      } else {
        console.log(`[GET-FULL] Content is not an array:`, typeof matchedPost.content);
      }
      
      return NextResponse.json(matchedPost);
    }
    
    // Success - found the post directly
    console.log(`[GET-FULL] Blog post found: ${post.title}`);
    
    // Log content details
    if (Array.isArray(post.content)) {
      console.log(`[GET-FULL] Content sections: ${post.content.length}`);
      console.log(`[GET-FULL] Content preview:`, post.content.slice(0, 3).map((item: any, idx: number) => ({
        index: idx,
        type: item.type,
        order: item.order,
        contentPreview: item.content?.substring(0, 20) || 'empty'
      })));
    } else {
      console.log(`[GET-FULL] Content is not an array:`, typeof post.content);
    }
    
    return NextResponse.json(post);
  } catch (error) {
    console.error('[GET-FULL] Error processing request:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch blog post',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 