import mongoose, { Schema, Document, Model } from 'mongoose';

// Define different types of content sections for a blog post
interface ContentSection {
  type: string;
  content: string;
  order: number;
  // For code blocks
  language?: string;
  // For images
  url?: string;
  alt?: string;
  caption?: string;
  width?: number;
  height?: number;
  // For quotes
  source?: string;
  // For links
  href?: string;
  text?: string;
}

// Main BlogPost interface
export interface IBlogPost extends Document {
  title: string;
  slug: string;
  date: Date;
  excerpt: string;
  content: ContentSection[];
  tags: string[];
  coverImage?: string;
  coverImageAlt?: string;
  metaDescription?: string;
  keywords?: string[];
  locale: string;
  author: string;
  lastModified: Date;
  readingTime?: number;
  isPublished: boolean;
  relatedPosts?: mongoose.Types.ObjectId[];
}

const ContentSectionSchema = new Schema<ContentSection>({
  type: { type: String, required: true, enum: ['text', 'heading', 'image', 'code', 'quote', 'link', 'list', 'video'] },
  content: { type: String, required: true },
  order: { type: Number, required: true },
  // Optional fields based on content type
  language: { type: String }, // For code blocks
  url: { type: String }, // For images and videos
  alt: { type: String }, // For images
  caption: { type: String }, // For images
  width: { type: Number }, // For images
  height: { type: Number }, // For images
  source: { type: String }, // For quotes
  href: { type: String }, // For links
  text: { type: String } // For links
});

const BlogPostSchema = new Schema<IBlogPost>({
  title: { type: String, required: true },
  slug: { type: String, required: true },
  date: { type: Date, required: true, default: Date.now },
  excerpt: { type: String, required: true },
  content: { type: [ContentSectionSchema], default: [] },
  tags: { type: [String], default: [] },
  coverImage: { type: String },
  coverImageAlt: { type: String },
  metaDescription: { type: String },
  keywords: { type: [String], default: [] },
  locale: { type: String, required: true, default: 'en', enum: ['en', 'tr'] },
  author: { type: String, default: 'Admin' },
  lastModified: { type: Date, default: Date.now },
  readingTime: { type: Number, default: 0 },
  isPublished: { type: Boolean, default: true },
  relatedPosts: [{ type: Schema.Types.ObjectId, ref: 'BlogPost' }]
}, {
  timestamps: true,
  // Mongoose options to give better error messages
  validateBeforeSave: true,
  strict: true
});

// Add indexes for faster queries - ensuring slug is unique per locale
BlogPostSchema.index({ slug: 1, locale: 1 }, { unique: true });
BlogPostSchema.index({ tags: 1 });
BlogPostSchema.index({ date: -1 });

// Calculate reading time before saving
BlogPostSchema.pre('save', function(next) {
  try {
    // Calculate reading time based on content 
    // Assuming an average reading speed of 200 words per minute
    let totalWords = 0;
    
    if (Array.isArray(this.content)) {
      this.content.forEach(section => {
        if ((section.type === 'text' || section.type === 'heading') && section.content) {
          totalWords += section.content.split(/\s+/).length;
        }
      });
    }
    
    this.readingTime = Math.ceil(totalWords / 200) || 1; // Minimum 1 minute
    next();
  } catch (error) {
    console.error('Error calculating reading time:', error);
    this.readingTime = 1; // Default to 1 minute if calculation fails
    next();
  }
});

// Only create model if it doesn't exist already
let BlogPost: Model<IBlogPost>;

try {
  // Try to get existing model to avoid overwriting
  BlogPost = mongoose.model<IBlogPost>('BlogPost');
} catch {
  // Model doesn't exist yet, create it
  BlogPost = mongoose.model<IBlogPost>('BlogPost', BlogPostSchema);
}

export default BlogPost; 