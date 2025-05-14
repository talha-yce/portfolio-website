import { NextRequest, NextResponse } from "next/server";
import { 
  getAllBlogPosts, 
  getBlogPostBySlug, 
  createBlogPost, 
  updateBlogPost, 
  deleteBlogPost 
} from "@/lib/services/blogService";
import { sanitizeForClient } from "@/lib/utils";

// GET all blog posts
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const locale = url.searchParams.get('locale') || 'en';
  const slug = url.searchParams.get('slug');
  
  try {
    if (slug) {
      // Get a specific blog post by slug
      const post = await getBlogPostBySlug(slug, locale as any);
      
      if (!post) {
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
      }
      
      return NextResponse.json(sanitizeForClient(post));
    }
    
    // Get all blog posts
    const posts = await getAllBlogPosts(locale as any);
    return NextResponse.json(sanitizeForClient(posts));
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
  }
}

// POST to create a new blog post
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Basic validation for required fields
    if (!data.title || !data.slug || !data.excerpt) {
      return NextResponse.json(
        { error: 'Missing required fields: title, slug, excerpt' }, 
        { status: 400 }
      );
    }
    
    // Create the blog post - basic error handling
    try {
      const newPost = await createBlogPost(data);
      
      // Return a simplified response to avoid serialization issues
      return NextResponse.json({ 
        success: true, 
        _id: String(newPost._id),
        title: data.title,
        slug: data.slug,
        message: 'Blog post created successfully'
      }, { status: 201 });
    } catch (error: any) {
      console.error('Database error creating blog post:', error);
      
      // Check for duplicate key error (common issue)
      if (error?.name === 'MongoServerError' && error?.code === 11000) {
        return NextResponse.json(
          { error: 'A blog post with this slug already exists' },
          { status: 409 }
        );
      }
      
      throw error; // Re-throw to be caught by outer handler
    }
  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json({ 
      error: 'Failed to create blog post',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// PUT to update a blog post
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data._id) {
      return NextResponse.json({ error: 'Missing post ID' }, { status: 400 });
    }
    
    // Update the blog post
    const updatedPost = await updateBlogPost(data._id, data);
    
    if (!updatedPost) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    
    return NextResponse.json(sanitizeForClient(updatedPost));
  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500 });
  }
}

// DELETE a blog post
export async function DELETE(request: NextRequest) {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  
  if (!id) {
    return NextResponse.json({ error: 'Missing post ID' }, { status: 400 });
  }
  
  try {
    await deleteBlogPost(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 });
  }
} 