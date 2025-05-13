"use client"

import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { useRef } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { SocialLinks } from "@/components/social-links"
import CodeBackground from "@/components/code-background"
import { ProjectCard } from "@/components/project-card"
import { BlogCard } from "@/components/blog-card"
import { PageTransition } from "@/components/page-transition"
import { getLocalizedPathname, type Locale } from "@/lib/i18n/config"
import type { Dictionary } from "@/lib/i18n/dictionaries"
import type { ContentMeta } from "@/lib/content-manager"
import { BlogPost } from "@/lib/types"

interface HomeClientProps {
  params: { locale: Locale }
  dictionary: Dictionary
  featuredProjects: ContentMeta[]
  recentPosts: BlogPost[]
}

export default function HomeClient({ params, dictionary, featuredProjects, recentPosts }: HomeClientProps) {
  const scrollRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end start"],
  })
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "20%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0])

  const locale = params.locale

  return (
    <PageTransition>
      <section ref={scrollRef} className="relative overflow-hidden">
        {/* Hero Section */}
        <motion.div
          style={{ y, opacity }}
          className="container relative"
        >
          <div className="grid gap-4 py-16 md:py-20 lg:py-40 lg:gap-8 lg:grid-cols-[1fr_400px]">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tighter md:text-5xl lg:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-accent-600">
                {dictionary.home.heroTitle}
              </h1>
              <p className="text-muted-foreground text-lg md:text-xl">
                {dictionary.home.heroSubtitle}
              </p>
              <div className="flex gap-2 pt-4">
                <Link href={getLocalizedPathname("/projects", locale)}>
                  <Button variant="default" className="gap-2">
                    {dictionary.common.projects}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href={getLocalizedPathname("/blog", locale)}>
                  <Button variant="outline" className="gap-2">
                    {dictionary.common.blog}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <div className="py-4">
                <SocialLinks size={24} />
              </div>
            </div>
            {/* Decorative Code Elements - Hidden on Mobile */}
            <div className="hidden lg:flex items-center justify-center relative p-8 bg-primary-50/80 rounded-2xl shadow-xl">
              <CodeBackground />
            </div>
          </div>
        </motion.div>
        
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-accent-50/30 pointer-events-none" />
      </section>

      {/* Projects Section */}
      <section className="py-20">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-accent-600">
                {dictionary.home.featuredProjects}
              </h2>
              <p className="text-muted-foreground">{dictionary.home.projectsSubtitle}</p>
            </div>
            <Link href={getLocalizedPathname("/projects", locale)} className="mt-4 md:mt-0">
              <Button variant="outline">
                {dictionary.common.viewAllProjects}
              </Button>
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((project, index) => (
              <motion.div
                key={project.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ProjectCard project={project} locale={locale} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Section */}
      <section className="py-20 bg-accent-50/30">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-accent-600">
                {dictionary.home.latestArticles}
              </h2>
              <p className="text-muted-foreground">{dictionary.home.articlesSubtitle}</p>
            </div>
            <Link href={getLocalizedPathname("/blog", locale)} className="mt-4 md:mt-0">
              <Button variant="outline">
                {dictionary.common.viewAllPosts}
              </Button>
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recentPosts.map((post, index) => {
              const readingTimeText = dictionary.blog.readingTime.replace("{time}", post.readingTime?.toString() || "0")
              return (
                <motion.div
                  key={post.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <BlogCard post={post} locale={locale} readingTimeText={readingTimeText} />
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20">
        <div className="container">
          <Card className="bg-primary-50/50 border-primary-100">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">{dictionary.common.getInTouch}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-6 text-muted-foreground">{dictionary.home.contactDescription}</p>
              <div className="flex flex-col md:flex-row gap-4">
                <Link href="mailto:yucet@talha-yuce.site">
                  <Button className="w-full md:w-auto">{dictionary.common.email}</Button>
                </Link>
                <div className="flex items-center gap-2">
                  <SocialLinks />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </PageTransition>
  )
}

