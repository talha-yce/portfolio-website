import connectToDatabase from '../mongodb';
import BlogPost, { IBlogPost } from '../models/BlogPost';
import { type Locale } from '../i18n/config';

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
  await connectToDatabase()
  
  try {
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
  await connectToDatabase()
  
  try {
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
  await connectToDatabase()
  
  try {
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
  await connectToDatabase()
  
  try {
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
    console.log('Connecting to database...')
    await connectToDatabase()
    
    console.log('Creating new blog post with data:', JSON.stringify({
      title: postData.title,
      slug: postData.slug,
      locale: postData.locale
    }))
    
    const newPost = new BlogPost(postData)
    
    console.log('Validating blog post...')
    const validationError = newPost.validateSync()
    if (validationError) {
      console.error('Validation error:', validationError)
      throw validationError
    }
    
    console.log('Saving blog post...')
    await newPost.save()
    console.log('Blog post saved successfully with ID:', newPost._id)
    
    return newPost
  } catch (error) {
    console.error('Error creating blog post:', error)
    // Log more details about the error
    if (error instanceof Error) {
      console.error('Error name:', error.name)
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
      
      // Check for MongoDB duplicate key error
      if (error.name === 'MongoServerError' && (error as any).code === 11000) {
        console.error('Duplicate key error - a blog post with this slug likely already exists')
      }
    }
    throw error
  }
}

// Update a blog post
export async function updateBlogPost(id: string, postData: Partial<IBlogPost>) {
  await connectToDatabase()
  
  try {
    const updatedPost = await BlogPost.findByIdAndUpdate(
      id,
      { ...postData, lastModified: new Date() },
      { new: true }
    )
    return updatedPost
  } catch (error) {
    console.error(`Error updating blog post ${id}:`, error)
    throw error
  }
}

// Delete a blog post
export async function deleteBlogPost(id: string) {
  await connectToDatabase()
  
  try {
    await BlogPost.findByIdAndDelete(id)
    return { success: true }
  } catch (error) {
    console.error(`Error deleting blog post ${id}:`, error)
    throw error
  }
} 