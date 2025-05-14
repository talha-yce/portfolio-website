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
    viewAllProjects?: string
    viewAllPosts: string
    backToProjects: string
    backToBlog: string
    changeLanguage: string
    pageNotFound: string
    pageNotFoundDescription: string
    goHome: string
    email: string
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
    description: string
  }
  projects: {
    title: string
    description: string
  }
  blog: {
    title: string
    description: string
    readingTime: string
    relatedPosts?: string
    relatedPostsSubtitle?: string
    tableOfContents: string
    sharePost: string
    tags: string
    noTags: string
    keywordsTags: string
    noKeywords: string
    updated: string
    authorInfo: string
    publishedOn: string
    categories: string
    showMore: string
    relatedArticles: string
    nextRead: string
    previousArticle: string
    nextArticle: string
    postsTaggedWith: string
    browsePostsTagged: string
    post: string
    posts: string
  }
  newsletter: {
    securityVerification: string
    subscription: string
    verificationCode: string
    success: string
    restart: string
    back: string
    verifyNotRobot: string
    subscriptionComplete: string
    welcomeMessage: string
    firstName: string
    lastName: string
    email: string
    languageSelection: string
    turkish: string
    english: string
    interests: string
    webDevelopment: string
    gameDevelopment: string
    artificialIntelligence: string
    processing: string
    sendVerificationCode: string
    enterVerificationCode: string
    completeSubscription: string
    codeExpired: string
    sendNewCode: string
    tooManyFailedAttempts: string
    tooManyRequests: string
    remainingAttempts: string
    verificationCodeSent: string
    checkSpamFolder: string
    codeExpiresIn: string
    timeRemaining: string
    selectedInterests: string
    autoEmailMessage: string
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

