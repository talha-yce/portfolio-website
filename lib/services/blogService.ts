import connectToDatabase from '../mongodb';
import BlogPost, { IBlogPost } from '../models/BlogPost';
import { type Locale } from '../i18n/config';
import mongoose from 'mongoose';

// Ensure dates are properly formatted for display
const formatDate = (date: Date | string, locale: Locale): string => {
  // Ensure we're working with a valid Date object
  const dateObj = date instanceof Date ? date : new Date(date)
  
  // Check if dateObj is valid before calling toLocaleDateString
  if (isNaN(dateObj.getTime())) {
    console.warn(`Invalid date detected: ${date}, using fallback format`)
    return String(date)
  }
  
  return dateObj.toLocaleDateString(locale === 'tr' ? 'tr-TR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// Get all blog posts for a locale
export async function getAllBlogPosts(locale: Locale) {
  try {
    console.log(`[BlogService] getAllBlogPosts("${locale}") başladı`);
    console.log('[BlogService] MongoDB bağlantısı kuruluyor...');
    await connectToDatabase()
    console.log('[BlogService] MongoDB bağlantısı kuruldu');
    
    console.log(`[BlogService] Blog yazıları sorgulanıyor: { locale: ${locale}, isPublished: true }`);
    const posts = await BlogPost.find({ 
      locale, 
      isPublished: true 
    })
    .sort({ date: -1 })
    .lean()
    
    console.log(`[BlogService] ${posts.length} blog yazısı bulundu`);
    return posts.map(post => ({
      ...post,
      _id: post._id.toString(),
      formattedDate: formatDate(post.date, locale),
      relatedPosts: post.relatedPosts?.map(id => id.toString()),
    }))
  } catch (error) {
    console.error('[BlogService] Blog yazılarını getirirken hata:', error)
    return []
  }
}

// Get a single blog post by slug
export async function getBlogPostBySlug(slug: string, locale: Locale) {
  try {
    console.log(`[BlogService] getBlogPostBySlug("${slug}", "${locale}") başladı`);
    console.log('[BlogService] MongoDB bağlantısı kuruluyor...');
    await connectToDatabase()
    console.log('[BlogService] MongoDB bağlantısı kuruldu');
    
    console.log(`[BlogService] Blog yazısı sorgulanıyor: { slug: ${slug}, locale: ${locale}, isPublished: true }`);
    const post = await BlogPost.findOne({ 
      slug,
      locale,
      isPublished: true
    }).lean()
    
    if (!post) {
      console.log(`[BlogService] Blog yazısı bulunamadı: ${slug}`);
      return null
    }
    
    console.log(`[BlogService] Blog yazısı bulundu: ${post.title}`);
    return {
      ...post,
      _id: post._id.toString(),
      formattedDate: formatDate(post.date, locale),
      relatedPosts: post.relatedPosts?.map(id => id.toString()),
    }
  } catch (error) {
    console.error(`[BlogService] "${slug}" sluglı blog yazısını getirirken hata:`, error)
    return null
  }
}

// Get related blog posts
export async function getRelatedBlogPosts(postId: string, tags: string[], locale: Locale, limit = 3) {
  try {
    console.log(`[BlogService] getRelatedBlogPosts başladı`);
    console.log('[BlogService] MongoDB bağlantısı kuruluyor...');
    await connectToDatabase()
    console.log('[BlogService] MongoDB bağlantısı kuruldu');
    
    // Find posts with matching tags, excluding the current post
    const relatedPosts = await BlogPost.find({
      _id: { $ne: postId },
      locale,
      tags: { $in: tags },
      isPublished: true
    })
    .sort({ date: -1 })
    .limit(limit)
    .lean()
    
    console.log(`[BlogService] ${relatedPosts.length} ilgili blog yazısı bulundu`);
    return relatedPosts.map(post => ({
      ...post,
      _id: post._id.toString(),
      formattedDate: formatDate(post.date, locale),
      relatedPosts: post.relatedPosts?.map(id => id.toString()),
    }))
  } catch (error) {
    console.error('[BlogService] İlgili blog yazılarını getirirken hata:', error)
    return []
  }
}

// Get blog posts by tag
export async function getBlogPostsByTag(tag: string, locale: Locale) {
  try {
    console.log(`[BlogService] getBlogPostsByTag("${tag}", "${locale}") başladı`);
    console.log('[BlogService] MongoDB bağlantısı kuruluyor...');
    await connectToDatabase()
    console.log('[BlogService] MongoDB bağlantısı kuruldu');
    
    const posts = await BlogPost.find({
      tags: tag,
      locale,
      isPublished: true
    })
    .sort({ date: -1 })
    .lean()
    
    console.log(`[BlogService] ${posts.length} blog yazısı bulundu (tag: ${tag})`);
    return posts.map(post => ({
      ...post,
      _id: post._id.toString(),
      formattedDate: formatDate(post.date, locale),
      relatedPosts: post.relatedPosts?.map(id => id.toString()),
    }))
  } catch (error) {
    console.error(`[BlogService] "${tag}" etiketli blog yazılarını getirirken hata:`, error)
    return []
  }
}

// Create a new blog post
export async function createBlogPost(postData: Partial<IBlogPost>) {
  try {
    console.log('[BlogService] createBlogPost başladı');
    console.log('[BlogService] Blog yazısı verileri:', {
      title: postData.title,
      slug: postData.slug,
      locale: postData.locale,
      excerpt: postData.excerpt?.substring(0, 30) + '...',
      contentSections: postData.content?.length || 0
    });
    
    console.log('[BlogService] MongoDB bağlantısı kuruluyor...');
    await connectToDatabase()
    console.log('[BlogService] MongoDB bağlantısı kuruldu');
    
    // Ensure slug isn't already taken for this locale
    console.log(`[BlogService] Aynı slug kontrolü: { slug: ${postData.slug}, locale: ${postData.locale} }`);
    const existingPost = await BlogPost.findOne({
      slug: postData.slug,
      locale: postData.locale
    }).lean();
    
    if (existingPost) {
      console.log(`[BlogService] HATA: ${postData.slug} slug'ı zaten kullanılıyor`);
      const error = new Error(`A blog post with slug "${postData.slug}" already exists in ${postData.locale} locale`);
      (error as any).code = 11000; // Set code to make detection easier
      (error as any).name = 'MongoServerError';
      throw error;
    }
    
    // Create the blog post
    console.log('[BlogService] Yeni blog post oluşturuluyor...');
    try {
      const newPost = new BlogPost(postData);
      console.log('[BlogService] Yeni blog modeli oluşturuldu, kaydediliyor...');
      await newPost.save();
      console.log(`[BlogService] Blog yazısı başarıyla oluşturuldu. ID: ${newPost._id}`);
      return newPost;
    } catch (error: any) {
      console.error('[BlogService] Blog yazısını kaydetme hatası:', error);
      
      // Add extra debugging info for mongoose validation errors
      if (error?.name === 'ValidationError' && error.errors) {
        console.log('[BlogService] Şema doğrulama hatası:');
        for (const field in error.errors) {
          console.log(`[BlogService] Alan: ${field}, Hata: ${error.errors[field].message}`);
        }
      }
      
      throw error;
    }
  } catch (error) {
    console.error('[BlogService] Blog yazısı oluşturma hatası:', error);
    throw error;
  }
}

// Update a blog post
export async function updateBlogPost(id: string, postData: Partial<IBlogPost>) {
  try {
    console.log(`[BlogService] updateBlogPost("${id}") başladı`);
    console.log('[BlogService] Güncellenecek veri:', {
      title: postData.title,
      slug: postData.slug,
      locale: postData.locale
    });
    
    console.log('[BlogService] MongoDB bağlantısı kuruluyor...');
    await connectToDatabase()
    console.log('[BlogService] MongoDB bağlantısı kuruldu');
    
    // Check if updating slug and ensure it's not taken
    if (postData.slug) {
      console.log(`[BlogService] Slug güncellemesi için kontrol yapılıyor: ${postData.slug}`);
      const existingPost = await BlogPost.findOne({
        slug: postData.slug,
        locale: postData.locale,
        _id: { $ne: id }
      }).lean();
      
      if (existingPost) {
        console.log(`[BlogService] HATA: ${postData.slug} slug'ı zaten kullanılıyor`);
        throw new Error(`A blog post with slug "${postData.slug}" already exists in ${postData.locale} locale`);
      }
    }
    
    console.log(`[BlogService] Blog yazısı güncelleniyor ID: ${id}...`);
    const updatedPost = await BlogPost.findByIdAndUpdate(
      id,
      { 
        ...postData, 
        lastModified: new Date() 
      },
      { new: true, runValidators: true }
    )
    
    if (updatedPost) {
      console.log(`[BlogService] Blog yazısı başarıyla güncellendi: ${updatedPost.title}`);
    } else {
      console.log(`[BlogService] Güncellenecek blog yazısı bulunamadı: ${id}`);
    }
    
    return updatedPost
  } catch (error) {
    console.error(`[BlogService] Blog yazısı güncelleme hatası (ID: ${id}):`, error)
    throw error
  }
}

// Delete a blog post
export async function deleteBlogPost(id: string) {
  try {
    console.log(`[BlogService] deleteBlogPost("${id}") başladı`);
    
    console.log('[BlogService] MongoDB bağlantısı kuruluyor...');
    await connectToDatabase()
    console.log('[BlogService] MongoDB bağlantısı kuruldu');
    
    console.log(`[BlogService] Blog yazısı siliniyor ID: ${id}...`);
    await BlogPost.findByIdAndDelete(id)
    console.log(`[BlogService] Blog yazısı başarıyla silindi ID: ${id}`);
    return { success: true }
  } catch (error) {
    console.error(`[BlogService] Blog yazısı silme hatası (ID: ${id}):`, error)
    throw error
  }
} 