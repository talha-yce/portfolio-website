"use server"

import fs from "fs"
import path from "path"
import { type Locale, defaultLocale } from "./i18n/config"

export interface UserEducation {
  degree: string
  institution: string
  date: string
  description?: string
}

export interface UserExperience {
  title: string
  company: string
  date: string
  description?: string
}

export interface UserSkill {
  category: string
  items: string[]
}

export interface UserCertification {
  title: string
  issuer: string
  date: string
  description?: string
}

export interface UserLanguage {
  name: string
  level: string
}

export interface UserData {
  name: string
  title: string
  email: string
  phone: string
  location: string
  bio: string
  github: string
  linkedin: string
  profileImage: string
  languages: UserLanguage[]
  education: UserEducation[]
  experience: UserExperience[]
  skills: UserSkill[]
  certifications: UserCertification[]
}

export const getUserData = async (locale: Locale = defaultLocale): Promise<UserData> => {
  try {
    const filePath = path.join(process.cwd(), "data", "cv", `cv.${locale}.json`)
    const fileContents = fs.readFileSync(filePath, "utf8")
    return JSON.parse(fileContents) as UserData
  } catch (error) {
    console.error(`Error loading CV data for ${locale}:`, error)
    // If the requested locale file doesn't exist, try to fall back to the default locale
    if (locale !== defaultLocale) {
      return getUserData(defaultLocale)
    }
    // If default locale fails, return empty data
    return {
      name: "",
      title: "",
      email: "",
      phone: "",
      location: "",
      bio: "",
      github: "",
      linkedin: "",
      profileImage: "/placeholder.svg?height=400&width=400",
      languages: [],
      education: [],
      experience: [],
      skills: [],
      certifications: [],
    }
  }
}

