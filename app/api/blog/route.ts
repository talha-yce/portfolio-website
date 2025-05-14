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
  console.log('[API] GET /api/blog başladı');
  const url = new URL(request.url);
  const locale = url.searchParams.get('locale') || 'en';
  const slug = url.searchParams.get('slug');
  
  console.log(`[API] GET parametreleri: locale=${locale}, slug=${slug || 'null'}`);
  
  try {
    if (slug) {
      // Get a specific blog post by slug
      console.log(`[API] getBlogPostBySlug("${slug}", "${locale}") çağrılıyor`);
      const post = await getBlogPostBySlug(slug, locale as any);
      
      if (!post) {
        console.log(`[API] Blog yazısı bulunamadı: ${slug}`);
        return NextResponse.json({ error: 'Post not found' }, { status: 404 });
      }
      
      console.log(`[API] Blog yazısı bulundu: ${post.title}`);
      return NextResponse.json(sanitizeForClient(post));
    }
    
    // Get all blog posts
    console.log(`[API] getAllBlogPosts("${locale}") çağrılıyor`);
    const posts = await getAllBlogPosts(locale as any);
    console.log(`[API] ${posts.length} blog yazısı getirildi`);
    return NextResponse.json(sanitizeForClient(posts));
  } catch (error) {
    console.error('[API] Blog yazılarını getirirken hata:', error);
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
  }
}

// POST to create a new blog post
export async function POST(request: NextRequest) {
  console.log('[API] POST /api/blog başladı - Blog yazısı oluşturma isteği alındı');
  
  try {
    console.log('[API] İstek gövdesini ayrıştırma');
    const data = await request.json();
    console.log('[API] Blog yazısı verileri:', {
      title: data.title,
      slug: data.slug,
      locale: data.locale,
      contentLength: data.content ? data.content.length : 0,
      tags: data.tags
    });
    
    // Basic validation for required fields
    if (!data.title || !data.slug || !data.excerpt) {
      console.log('[API] Eksik alanlar:', {
        title: !data.title,
        slug: !data.slug,
        excerpt: !data.excerpt
      });
      return NextResponse.json(
        { error: 'Missing required fields: title, slug, excerpt' }, 
        { status: 400 }
      );
    }
    
    // Create the blog post - basic error handling
    try {
      console.log('[API] createBlogPost fonksiyonu çağrılıyor');
      const newPost = await createBlogPost(data);
      console.log('[API] Blog yazısı başarıyla oluşturuldu:', {
        id: newPost._id ? String(newPost._id) : 'unknown',
        title: newPost.title
      });
      
      // Return a simplified response to avoid serialization issues
      return NextResponse.json({ 
        success: true, 
        _id: String(newPost._id),
        title: data.title,
        slug: data.slug,
        message: 'Blog post created successfully'
      }, { status: 201 });
    } catch (error: any) {
      console.error('[API] Blog yazısı oluşturma hatası (iç try-catch):', error);
      console.log('[API] Hata detayları:', {
        name: error?.name,
        message: error?.message,
        code: error?.code
      });
      
      // Check for duplicate key error (common issue)
      if (error?.name === 'MongoServerError' && error?.code === 11000) {
        console.log('[API] Tekrar eden slug hatası tespit edildi');
        return NextResponse.json(
          { error: 'A blog post with this slug already exists' },
          { status: 409 }
        );
      }
      
      throw error; // Re-throw to be caught by outer handler
    }
  } catch (error) {
    console.error('[API] Blog yazısı oluşturma hatası (dış try-catch):', error);
    if (error instanceof Error) {
      console.log('[API] Hata mesajı:', error.message);
      console.log('[API] Hata yığını:', error.stack);
    }
    
    return NextResponse.json({ 
      error: 'Failed to create blog post',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// PUT to update a blog post
export async function PUT(request: NextRequest) {
  console.log('[API] PUT /api/blog başladı - Blog yazısı güncelleme isteği alındı');
  
  try {
    console.log('[API] İstek gövdesini ayrıştırma');
    const data = await request.json();
    console.log('[API] Güncellenecek blog:', {
      id: data._id,
      title: data.title,
      slug: data.slug
    });
    
    // Validate required fields
    if (!data._id) {
      console.log('[API] Blog ID eksik');
      return NextResponse.json({ error: 'Missing post ID' }, { status: 400 });
    }
    
    // Update the blog post
    console.log('[API] updateBlogPost fonksiyonu çağrılıyor');
    const updatedPost = await updateBlogPost(data._id, data);
    
    if (!updatedPost) {
      console.log('[API] Güncellenecek blog bulunamadı');
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    
    console.log('[API] Blog yazısı başarıyla güncellendi');
    return NextResponse.json(sanitizeForClient(updatedPost));
  } catch (error) {
    console.error('[API] Blog yazısı güncelleme hatası:', error);
    if (error instanceof Error) {
      console.log('[API] Hata mesajı:', error.message);
    }
    return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500 });
  }
}

// DELETE a blog post
export async function DELETE(request: NextRequest) {
  console.log('[API] DELETE /api/blog başladı');
  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  console.log(`[API] Silinecek blog ID: ${id}`);
  
  if (!id) {
    console.log('[API] Blog ID eksik');
    return NextResponse.json({ error: 'Missing post ID' }, { status: 400 });
  }
  
  try {
    console.log('[API] deleteBlogPost fonksiyonu çağrılıyor');
    await deleteBlogPost(id);
    console.log('[API] Blog yazısı başarıyla silindi');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API] Blog yazısı silme hatası:', error);
    return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 });
  }
} 