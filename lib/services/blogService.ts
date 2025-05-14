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
    await connectToDatabase()
    
    const posts = await BlogPost.find({ 
      locale, 
      isPublished: true 
    })
    .sort({ date: -1 })
    .lean()
    
    return posts.map(post => ({
      ...post,
      _id: post._id.toString(),
      formattedDate: formatDate(post.date, locale),
      relatedPosts: post.relatedPosts?.map(id => id.toString()),
    }))
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return []
  }
}

// Get a single blog post by slug
export async function getBlogPostBySlug(slug: string, locale: Locale) {
  try {
    await connectToDatabase()
    
    const post = await BlogPost.findOne({ 
      slug,
      locale,
      isPublished: true
    }).lean()
    
    if (!post) return null
    
    return {
      ...post,
      _id: post._id.toString(),
      formattedDate: formatDate(post.date, locale),
      relatedPosts: post.relatedPosts?.map(id => id.toString()),
    }
  } catch (error) {
    console.error(`Error fetching blog post ${slug}:`, error)
    return null
  }
}

// Get related blog posts
export async function getRelatedBlogPosts(postId: string, tags: string[], locale: Locale, limit = 3) {
  try {
    await connectToDatabase()
    
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
    
    return relatedPosts.map(post => ({
      ...post,
      _id: post._id.toString(),
      formattedDate: formatDate(post.date, locale),
      relatedPosts: post.relatedPosts?.map(id => id.toString()),
    }))
  } catch (error) {
    console.error('Error fetching related posts:', error)
    return []
  }
}

// Get blog posts by tag
export async function getBlogPostsByTag(tag: string, locale: Locale) {
  try {
    await connectToDatabase()
    
    const posts = await BlogPost.find({
      tags: tag,
      locale,
      isPublished: true
    })
    .sort({ date: -1 })
    .lean()
    
    return posts.map(post => ({
      ...post,
      _id: post._id.toString(),
      formattedDate: formatDate(post.date, locale),
      relatedPosts: post.relatedPosts?.map(id => id.toString()),
    }))
  } catch (error) {
    console.error(`Error fetching posts by tag ${tag}:`, error)
    return []
  }
}

// Create a new blog post
export async function createBlogPost(postData: Partial<IBlogPost>) {
  try {
    await connectToDatabase()
    
    // Ensure slug isn't already taken for this locale
    const existingPost = await BlogPost.findOne({
      slug: postData.slug,
      locale: postData.locale
    }).lean();
    
    if (existingPost) {
      const error = new Error(`A blog post with slug "${postData.slug}" already exists in ${postData.locale} locale`);
      (error as any).code = 11000; // Set code to make detection easier
      (error as any).name = 'MongoServerError';
      throw error;
    }
    
    // Create the blog post
    const newPost = new BlogPost(postData);
    await newPost.save();
    
    return newPost;
  } catch (error) {
    console.error('Error creating blog post:', error);
    throw error;
  }
}

// Update a blog post
export async function updateBlogPost(id: string, postData: Partial<IBlogPost>) {
  try {
    await connectToDatabase()
    
    // Check if updating slug and ensure it's not taken
    if (postData.slug) {
      const existingPost = await BlogPost.findOne({
        slug: postData.slug,
        locale: postData.locale,
        _id: { $ne: id }
      }).lean();
      
      if (existingPost) {
        throw new Error(`A blog post with slug "${postData.slug}" already exists in ${postData.locale} locale`);
      }
    }
    
    const updatedPost = await BlogPost.findByIdAndUpdate(
      id,
      { 
        ...postData, 
        lastModified: new Date() 
      },
      { new: true, runValidators: true }
    )
    return updatedPost
  } catch (error) {
    console.error(`Error updating blog post ${id}:`, error)
    throw error
  }
}

// Delete a blog post
export async function deleteBlogPost(id: string) {
  try {
    await connectToDatabase()
    
    await BlogPost.findByIdAndDelete(id)
    return { success: true }
  } catch (error) {
    console.error(`Error deleting blog post ${id}:`, error)
    throw error
  }
} 