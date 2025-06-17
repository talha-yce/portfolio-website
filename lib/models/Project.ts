import mongoose from 'mongoose'

export interface IProject {
  _id?: string
  title: string
  slug: string
  description: string
  date: Date
  content: Array<{
    type: 'paragraph' | 'heading' | 'list' | 'code' | 'image' | 'quote'
    content: string
  }>
  tags: string[]
  github?: string
  demo?: string
  coverImage?: string
  coverImageAlt?: string
  metaDescription?: string
  keywords?: string[]
  locale: 'tr' | 'en'
  author: string
  lastModified?: Date
  readingTime?: number
  isPublished: boolean
  featured: boolean
  status: 'draft' | 'in-progress' | 'completed' | 'archived'
  createdAt?: Date
  updatedAt?: Date
}

const projectSchema = new mongoose.Schema<IProject>({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  content: [{
    type: { type: String, enum: ['paragraph', 'heading', 'list', 'code', 'image', 'quote'], required: true },
    content: { type: String, required: true }
  }],
  tags: [{ type: String }],
  github: { type: String },
  demo: { type: String },
  coverImage: { type: String },
  coverImageAlt: { type: String },
  metaDescription: { type: String },
  keywords: [{ type: String }],
  locale: { type: String, enum: ['tr', 'en'], required: true },
  author: { type: String, required: true },
  lastModified: { type: Date },
  readingTime: { type: Number },
  isPublished: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
  status: { type: String, enum: ['draft', 'in-progress', 'completed', 'archived'], default: 'completed' }
}, {
  timestamps: true
})

// Create indexes for better query performance
projectSchema.index({ slug: 1, locale: 1 })
projectSchema.index({ isPublished: 1, locale: 1 })
projectSchema.index({ featured: 1, locale: 1 })
projectSchema.index({ tags: 1, locale: 1 })
projectSchema.index({ date: -1 })

export const Project = mongoose.models.Project || mongoose.model<IProject>('Project', projectSchema)