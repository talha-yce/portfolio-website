"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { ProjectCard } from "@/components/project-card"
import { BlogCard } from "@/components/blog-card"
import { SocialLinks } from "@/components/social-links"
import { AnimatedText } from "@/components/animated-text"
import { PageTransition } from "@/components/page-transition"
import { type Locale, getLocalizedPathname } from "@/lib/i18n/config"
import type { ContentMeta } from "@/lib/content-manager"
import type { Dictionary } from "@/lib/i18n/dictionaries"

interface HomeClientProps {
  params: { locale: Locale }
  dictionary: Dictionary
  featuredProjects: ContentMeta[]
  recentPosts: ContentMeta[]
}

export default function HomeClient({ params, dictionary, featuredProjects, recentPosts }: HomeClientProps) {
  return (
    <PageTransition>
      <div className="flex flex-col min-h-screen">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-br from-background via-background to-purple-950/20">
          <div className="container px-4 md:px-6">
            <motion.div 
              className="flex flex-col items-center space-y-4 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.div 
                className="space-y-2 w-full max-w-4xl mx-auto"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="relative flex justify-center">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-green-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse-slow"></div>
                  <AnimatedText
                    text={dictionary?.home?.heroTitle || ""}
                    className="relative text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-green-400 text-center"
                  />
                </div>
                <motion.p 
                  className="mx-auto max-w-[700px] text-gray-400 md:text-xl text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  {dictionary?.home?.heroSubtitle || ""}
                </motion.p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="animate-float"
              >
                <SocialLinks />
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Featured Projects Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-black/40">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <motion.div 
                className="space-y-2 w-full max-w-4xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="relative flex justify-center">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-green-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse-slow"></div>
                  <h2 className="relative text-3xl font-bold tracking-tighter sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-green-400 text-center">
                    {dictionary?.home?.featuredProjects || ""}
                  </h2>
                </div>
                <p className="mx-auto max-w-[700px] text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-center">
                  {dictionary?.home?.projectsSubtitle || ""}
                </p>
              </motion.div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              {featuredProjects.map((project, index) => (
                <ProjectCard key={project.slug} project={project} locale={params.locale} index={index} />
              ))}
            </div>
            <div className="flex justify-center">
              <Link href={getLocalizedPathname("/projects", params.locale)}>
                <Button
                  variant="outline"
                  className="inline-flex h-10 items-center justify-center rounded-md px-8 border-purple-600 hover:bg-purple-950/20 hover:text-purple-400"
                >
                  {dictionary?.common?.viewAllProjects || ""}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Blog Preview Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <motion.div 
                className="space-y-2 w-full max-w-4xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="relative flex justify-center">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-green-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse-slow"></div>
                  <h2 className="relative text-3xl font-bold tracking-tighter sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-green-400 text-center">
                    {dictionary?.home?.latestArticles || ""}
                  </h2>
                </div>
                <p className="mx-auto max-w-[700px] text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-center">
                  {dictionary?.home?.articlesSubtitle || ""}
                </p>
              </motion.div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
              {recentPosts.map((post, index) => {
                const readingTimeText = dictionary?.blog?.readingTime?.replace("{time}", post.readingTime?.toString() || "0") || ""
                return (
                  <motion.div
                    key={post.slug}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <BlogCard post={post} locale={params.locale} readingTimeText={readingTimeText} />
                  </motion.div>
                )
              })}
            </div>
            <div className="flex justify-center">
              <Link href={getLocalizedPathname("/blog", params.locale)}>
                <Button
                  variant="outline"
                  className="inline-flex h-10 items-center justify-center rounded-md px-8 border-purple-600 hover:bg-purple-950/20 hover:text-purple-400"
                >
                  {dictionary?.common?.viewAllPosts || ""}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-black/40">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <motion.div 
                className="space-y-2 w-full max-w-4xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="relative flex justify-center">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-green-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse-slow"></div>
                  <h2 className="relative text-3xl font-bold tracking-tighter sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-green-400 text-center">
                    {dictionary?.common?.getInTouch || ""}
                  </h2>
                </div>
                <p className="mx-auto max-w-[700px] text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed text-center">
                  {dictionary?.home?.contactDescription || ""}
                </p>
              </motion.div>
              <motion.div
                className="w-full max-w-sm space-y-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="flex justify-center space-x-4">
                  <SocialLinks />
                </div>
                <p className="text-gray-400 text-center">{dictionary.common.email}</p>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  )
}

