import mongoose from 'mongoose'

export interface IProfile {
  _id?: string
  name: string
  title: string
  email: string
  phone: string
  location: string
  bio: string
  github?: string
  linkedin?: string
  profileImage?: string
  locale: 'tr' | 'en'
  isActive?: boolean
  languages: Array<{
    name: string
    level: string
  }>
  education: Array<{
    degree: string
    institution: string
    date: string
    description?: string
  }>
  experience: Array<{
    title: string
    company: string
    date: string
    description?: string
    companyUrl?: string
  }>
  skills: Array<{
    category: string
    items: string[]
  }>
  certifications: Array<{
    title: string
    issuer: string
    date: string
  }>
  lastModified?: Date
  createdAt?: Date
  updatedAt?: Date
}

const profileSchema = new mongoose.Schema<IProfile>({
  name: { type: String, required: true },
  title: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  location: { type: String, required: true },
  bio: { type: String, required: true },
  github: { type: String },
  linkedin: { type: String },
  profileImage: { type: String },
  locale: { type: String, enum: ['tr', 'en'], required: true },
  isActive: { type: Boolean, default: true },
  languages: [{
    name: { type: String, required: true },
    level: { type: String, required: true }
  }],
  education: [{
    degree: { type: String, required: true },
    institution: { type: String, required: true },
    date: { type: String, required: true },
    description: { type: String }
  }],
  experience: [{
    title: { type: String, required: true },
    company: { type: String, required: true },
    date: { type: String, required: true },
    description: { type: String },
    companyUrl: { type: String }
  }],
  skills: [{
    category: { type: String, required: true },
    items: [{ type: String }]
  }],
  certifications: [{
    title: { type: String, required: true },
    issuer: { type: String, required: true },
    date: { type: String, required: true }
  }],
  lastModified: { type: Date, default: Date.now }
}, {
  timestamps: true,
  collection: 'userprofiles'
})

// Create indexes for better query performance
profileSchema.index({ locale: 1 })
profileSchema.index({ email: 1 })

// Clear the model from cache if it exists
if (mongoose.models.Profile) {
  delete mongoose.models.Profile;
}

export const Profile = mongoose.model<IProfile>('Profile', profileSchema) 