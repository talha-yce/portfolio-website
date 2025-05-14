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
    console.log('Received blog post creation request with data:', {
      title: data.title,
      slug: data.slug,
      locale: data.locale
    });
    
    // Validate required fields
    if (!data.title || !data.slug || !data.excerpt || !data.content) {
      console.error('Missing required fields in blog post data');
      return NextResponse.json(
        { error: 'Missing required fields: title, slug, excerpt, content' }, 
        { status: 400 }
      );
    }
    
    // Check content structure
    if (!Array.isArray(data.content) || data.content.length === 0) {
      console.error('Invalid content structure: content must be a non-empty array');
      return NextResponse.json(
        { error: 'Invalid content structure: content must be a non-empty array' },
        { status: 400 }
      );
    }
    
    // Validate content sections
    for (const section of data.content) {
      if (!section.type || !section.content) {
        console.error('Invalid content section:', section);
        return NextResponse.json(
          { error: 'Each content section must have a type and content' },
          { status: 400 }
        );
      }
    }
    
    console.log('Calling blogService.createBlogPost...');
    // Create the blog post
    const newPost = await createBlogPost(data);
    console.log('Blog post created successfully with ID:', newPost._id);
    
    // Prepare post for client response - convert MongoDB document to a plain object
    const safePost = {
      _id: String(newPost._id),
      title: String(newPost.title),
      slug: String(newPost.slug),
      locale: String(newPost.locale),
      excerpt: String(newPost.excerpt),
      success: true,
      message: 'Blog post created successfully'
    };
    
    return NextResponse.json(safePost, { status: 201 });
  } catch (error) {
    console.error('Error details in blog post creation:', error);
    
    // Check for specific error types
    if (error instanceof Error) {
      // Log error details
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      
      // Handle duplicate key error
      if (error.name === 'MongoServerError' && (error as any).code === 11000) {
        return NextResponse.json(
          { error: 'A blog post with this slug already exists. Please choose a different slug.' }, 
          { status: 409 }
        );
      }
      
      // Handle validation errors
      if (error.name === 'ValidationError') {
        return NextResponse.json(
          { error: `Validation error: ${error.message}` }, 
          { status: 400 }
        );
      }
    }
    
    return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 });
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