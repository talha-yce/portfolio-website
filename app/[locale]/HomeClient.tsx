"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { ProjectCard } from "@/components/project-card"
import { BlogCard } from "@/components/blog-card"
import { SocialLinks } from "@/components/social-links"
import { AnimatedText } from "@/components/animated-text"
import { type Locale, getLocalizedPathname } from "@/lib/i18n/config"
import type { ContentMeta } from "@/lib/content-manager"

interface HomeClientProps {
  params: { locale: Locale }
  dictionary: any
  featuredProjects: ContentMeta[]
  recentPosts: ContentMeta[]
}

export default function HomeClient({ params, dictionary, featuredProjects, recentPosts }: HomeClientProps) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-br from-background via-background to-purple-950/20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <AnimatedText
                text={dictionary?.home?.heroTitle || ""}
                className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-green-400"
              />
              <p className="mx-auto max-w-[700px] text-gray-400 md:text-xl">{dictionary?.home?.heroSubtitle || ""}</p>
            </div>
            <div className="space-x-4">
              <Link href={getLocalizedPathname("/about", params.locale)}>
                <Button className="inline-flex h-10 items-center justify-center rounded-md bg-purple-600 px-8 text-sm font-medium text-white shadow transition-colors hover:bg-purple-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50">
                  {dictionary?.common?.about || ""}
                </Button>
              </Link>
              <Link href={getLocalizedPathname("/projects", params.locale)}>
                <Button
                  variant="outline"
                  className="inline-flex h-10 items-center justify-center rounded-md border border-purple-600 bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-purple-950/20 hover:text-purple-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                  {dictionary?.common?.projects || ""}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Projects Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-black/40">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-green-400">
                {dictionary?.home?.featuredProjects || ""}
              </h2>
              <p className="mx-auto max-w-[700px] text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                {dictionary?.home?.projectsSubtitle || ""}
              </p>
            </div>
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
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-green-400">
                {dictionary?.home?.latestArticles || ""}
              </h2>
              <p className="mx-auto max-w-[700px] text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                {dictionary?.home?.articlesSubtitle || ""}
              </p>
            </div>
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
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-green-400">
                {dictionary?.common?.getInTouch || ""}
              </h2>
              <p className="mx-auto max-w-[700px] text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                {dictionary?.home?.contactDescription || ""}
              </p>
            </div>
            <div className="w-full max-w-sm space-y-2">
              <div className="flex justify-center space-x-4">
                <SocialLinks />
              </div>
              <p className="text-gray-400">{dictionary.common.email}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

