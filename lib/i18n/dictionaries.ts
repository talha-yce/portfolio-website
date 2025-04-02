"use server"

import { type Locale, defaultLocale } from "./config"

export type Dictionary = {
  common: {
    home: string
    about: string
    projects: string
    blog: string
    contact: string
    getInTouch: string
    viewAll: string
    viewDetails: string
    viewAllProjects: string
    viewAllPosts: string
    backToProjects: string
    backToBlog: string
  }
  home: {
    heroTitle: string
    heroSubtitle: string
    featuredProjects: string
    projectsSubtitle: string
    latestArticles: string
    articlesSubtitle: string
    contactDescription: string
  }
  about: {
    title: string
    contact: string
    languages: string
    profiles: string
    education: string
    experience: string
    skills: string
    certifications: string
  }
  projects: {
    title: string
    description: string
  }
  blog: {
    title: string
    description: string
    readingTime: string
  }
}

const dictionaries = {
  tr: () => import("./dictionaries/tr.json").then((module) => module.default),
  en: () => import("./dictionaries/en.json").then((module) => module.default),
} as const

export const getDictionary = async (locale: Locale = defaultLocale): Promise<Dictionary> => {
  const dictionary = dictionaries[locale]
  if (!dictionary) {
    throw new Error(`Dictionary for locale "${locale}" not found`)
  }
  return dictionary()
}

