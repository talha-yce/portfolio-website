"use client"

import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { useRef, memo } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { SocialLinks } from "@/components/social-links"
import { ProjectCard } from "@/components/project-card"
import { BlogCard } from "@/components/blog-card"
import { PageTransition } from "@/components/page-transition"
import { getLocalizedPathname, type Locale } from "@/lib/i18n/config"
import type { Dictionary } from "@/lib/i18n/dictionaries"
import type { ContentMeta } from "@/lib/content-manager"
import { BlogPost } from "@/lib/types"
import ProfileCard from "@/components/profile-card"
import CodeBackground from "@/components/code-background"

interface HomeClientProps {
  params: { locale: Locale }
  dictionary: Dictionary
  featuredProjects: ContentMeta[]
  recentPosts: BlogPost[]
}

// Memoize project card component for better performance
const MemoizedProjectCard = memo(ProjectCard)

// Memoize blog card component for better performance
const MemoizedBlogCard = memo(BlogCard)

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
      {/* Background code animation */}
      <CodeBackground />
      
      <section ref={scrollRef} className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Hero Section */}
        <div className="absolute inset-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-50/40 via-background to-accent-50/30 pointer-events-none z-0" />
        
        <motion.div
          style={{ y, opacity }}
          className="container relative z-20"
        >
          <div className="grid gap-6 py-16 md:py-24 lg:py-16 lg:gap-12 lg:grid-cols-[1fr_400px]">
            <div className="space-y-6 relative z-40">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-5xl font-bold tracking-tight md:text-6xl lg:text-7xl">
                  <span className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-accent-600 pb-2">
                    {dictionary.home.heroTitle}
                  </span>
                </h1>
              </motion.div>
              
              <motion.p 
                className="text-muted-foreground text-lg md:text-xl max-w-2xl leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {dictionary.home.heroSubtitle}
              </motion.p>
              
              <motion.div 
                className="flex flex-wrap gap-4 pt-6 relative z-50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Link href={getLocalizedPathname("/projects", locale)} className="relative z-50">
                  <Button variant="default" className="gap-2 rounded-full px-6 text-base shadow-lg shadow-primary-500/20 hover:shadow-primary-500/40 transition-all duration-300">
                    {dictionary.common.projects}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href={getLocalizedPathname("/blog", locale)} className="relative z-50">
                  <Button variant="outline" className="gap-2 rounded-full px-6 text-base border-primary-200 hover:bg-primary-50 transition-all duration-300">
                    {dictionary.common.blog}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </motion.div>
              
              <motion.div 
                className="py-6 relative z-50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <SocialLinks size={24} />
              </motion.div>
            </div>
            
            {/* Profile Card instead of Code Elements */}
            <motion.div 
              className="flex items-center justify-center relative p-2 md:p-4 lg:p-8 rounded-2xl z-40 mt-6 lg:mt-0"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <ProfileCard 
                name="Talha Yüce" 
                title="Software Engineer" 
                description={locale === 'tr' ? 
                  "Web, Oyun ve AI geliştirme alanlarında uzmanlaşmış yazılım mühendisi" : 
                  "Software engineer specialized in Web, Game, and AI development"}
              />
            </motion.div>
          </div>
        </motion.div>
        
        {/* Reduce number of decorative elements and ensure they don't block interactions */}
        <div className="absolute top-1/4 left-8 w-64 h-64 bg-primary-300/10 rounded-full blur-3xl pointer-events-none z-0"></div>
      </section>

      {/* Projects Section - Implement lazy loading with IntersectionObserver */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-white to-background pointer-events-none z-0"></div>
        <div className="container relative z-20">
          <motion.div 
            className="mb-12 md:flex md:justify-between md:items-end"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -200px 0px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="max-w-2xl">
              <div className="inline-block rounded-full px-3 py-1 text-sm font-medium bg-primary-100 text-primary-800 mb-3">
                {dictionary.common.projects}
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-800">
                {dictionary.home.featuredProjects}
              </h2>
              <p className="text-muted-foreground text-base md:text-lg">{dictionary.home.projectsSubtitle}</p>
            </div>
            <Link href={getLocalizedPathname("/projects", locale)} className="mt-6 md:mt-0 inline-block relative z-50">
              <Button variant="outline" className="gap-2 rounded-full group border-primary-200 hover:border-primary-400 hover:bg-primary-50 transition-all duration-300">
                {dictionary.common.viewAllProjects}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((project, index) => (
              <motion.div
                key={project.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -100px 0px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative z-40"
              >
                <MemoizedProjectCard project={project} locale={locale} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Section - Implement lazy loading with IntersectionObserver */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-accent-50/30 via-white to-background pointer-events-none z-0"></div>
        <div className="container relative z-20">
          <motion.div 
            className="mb-12 md:flex md:justify-between md:items-end"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -200px 0px" }}
            transition={{ duration: 0.6 }}
          >
            <div className="max-w-2xl">
              <div className="inline-block rounded-full px-3 py-1 text-sm font-medium bg-accent-100 text-accent-800 mb-3">
                {dictionary.common.blog}
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-accent-600 to-accent-800">
                {dictionary.home.latestArticles}
              </h2>
              <p className="text-muted-foreground text-base md:text-lg">{dictionary.home.articlesSubtitle}</p>
            </div>
            <Link href={getLocalizedPathname("/blog", locale)} className="mt-6 md:mt-0 inline-block relative z-50">
              <Button variant="outline" className="gap-2 rounded-full group border-accent-200 hover:border-accent-400 hover:bg-accent-50 transition-all duration-300">
                {dictionary.common.viewAllPosts}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {recentPosts.map((post, index) => {
              const readingTimeText = dictionary.blog.readingTime.replace("{time}", post.readingTime?.toString() || "0")
              return (
                <motion.div
                  key={post.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "0px 0px -100px 0px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group relative z-40"
                >
                  <MemoizedBlogCard post={post} locale={locale} readingTimeText={readingTimeText} />
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Contact Section - Implement lazy loading with IntersectionObserver */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background to-primary-50/30 pointer-events-none z-0"></div>
        <div className="container relative z-20">
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -200px 0px" }}
            transition={{ duration: 0.6 }}
          >
            <Card className="overflow-hidden border-none shadow-xl bg-white backdrop-blur-sm">
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary-100 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl pointer-events-none"></div>
              
              <CardHeader className="pb-6 relative z-40">
                <div className="flex justify-center mb-4">
                  <div className="inline-block rounded-full px-4 py-1.5 text-sm font-medium bg-gradient-to-r from-primary-600 to-accent-600 text-white">
                    {dictionary.common.getInTouch}
                  </div>
                </div>
                <CardTitle className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-primary-700 to-accent-700">
                  {dictionary.common.contact}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="relative z-40">
                <p className="mb-8 text-muted-foreground text-center max-w-2xl mx-auto">{dictionary.home.contactDescription}</p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link href="mailto:yucetalha00@gmail.com" className="relative z-50">
                    <Button className="gap-2 rounded-full px-6 shadow-lg shadow-primary-500/10 hover:shadow-primary-500/20 transition-all duration-300">
                      <span>{dictionary.common.email}</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                  <div className="flex items-center relative z-50">
                    <SocialLinks size={20} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>
    </PageTransition>
  )
}

