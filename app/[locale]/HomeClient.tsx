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
        <section className="relative w-full py-20 md:py-28 lg:py-36 xl:py-44 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-noise opacity-[0.03] z-0"></div>
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary-200 rounded-full filter blur-3xl animate-glow z-0 opacity-30"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-accent-200 rounded-full filter blur-3xl animate-glow animation-delay-600 z-0 opacity-30"></div>
          
          <div className="container relative px-4 md:px-6 z-10">
            <motion.div 
              className="flex flex-col items-center space-y-8 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.div 
                className="space-y-6 w-full max-w-4xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="relative">
                  <AnimatedText
                    text={dictionary?.home?.heroTitle || ""}
                    className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-primary-500 via-primary-600 to-accent-500 text-center"
                  />
                </div>
                <motion.p 
                  className="mx-auto max-w-[700px] text-muted-foreground md:text-xl text-center"
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
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link href={getLocalizedPathname("/projects", params.locale)} passHref>
                  <Button 
                    className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-md hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
                    size="lg"
                  >
                    {dictionary?.common?.viewAllProjects || "View Projects"}
                  </Button>
                </Link>
                <Link href={getLocalizedPathname("/blog", params.locale)} passHref>
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="border-primary-400 hover:border-primary-500 hover:bg-primary-50"
                  >
                    {dictionary?.common?.viewAllPosts || "Read Blog"}
                  </Button>
                </Link>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
                className="pt-6"
              >
                <SocialLinks className="gap-5" />
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Featured Projects Section */}
        <section className="relative w-full py-20 md:py-28">
          <div className="absolute inset-0 bg-noise opacity-[0.03] z-0"></div>
          <div className="absolute left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
          <div className="absolute right-20 top-40 w-72 h-72 bg-primary-100 rounded-full filter blur-3xl animate-float animation-delay-300 z-0 opacity-20"></div>
          
          <div className="container relative px-4 md:px-6 z-10">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <motion.div 
                className="space-y-3 w-full max-w-4xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-accent-600 text-center">
                  {dictionary?.home?.featuredProjects || ""}
                </h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg lg:text-base xl:text-lg text-center">
                  {dictionary?.home?.projectsSubtitle || ""}
                </p>
              </motion.div>
            </div>
            
            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 py-12 md:grid-cols-2 lg:grid-cols-3">
              {featuredProjects.map((project, index) => (
                <motion.div
                  key={project.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <ProjectCard project={project} locale={params.locale} index={index} />
                </motion.div>
              ))}
            </div>
            
            <motion.div 
              className="flex justify-center"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Link href={getLocalizedPathname("/projects", params.locale)}>
                <Button
                  variant="outline"
                  className="inline-flex h-10 items-center justify-center rounded-md px-8 border-primary-400 hover:border-primary-600 hover:bg-primary-50 hover:text-primary-600 group"
                >
                  {dictionary?.common?.viewAllProjects || ""}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Blog Preview Section */}
        <section className="relative w-full py-20 md:py-28 bg-muted/30">
          <div className="absolute inset-0 bg-noise opacity-[0.03] z-0"></div>
          <div className="absolute left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
          <div className="absolute left-20 bottom-40 w-80 h-80 bg-accent-100 rounded-full filter blur-3xl animate-float animation-delay-600 z-0 opacity-20"></div>
          
          <div className="container relative px-4 md:px-6 z-10">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <motion.div 
                className="space-y-3 w-full max-w-4xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-accent-600 to-primary-600 text-center">
                  {dictionary?.home?.latestArticles || ""}
                </h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg lg:text-base xl:text-lg text-center">
                  {dictionary?.home?.articlesSubtitle || ""}
                </p>
              </motion.div>
            </div>
            
            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 py-12 md:grid-cols-2 lg:grid-cols-3">
              {recentPosts.map((post, index) => {
                const readingTimeText = dictionary?.blog?.readingTime?.replace("{time}", post.readingTime?.toString() || "0") || ""
                return (
                  <motion.div
                    key={post.slug}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <BlogCard post={post} locale={params.locale} readingTimeText={readingTimeText} />
                  </motion.div>
                )
              })}
            </div>
            
            <motion.div 
              className="flex justify-center"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Link href={getLocalizedPathname("/blog", params.locale)}>
                <Button
                  variant="outline"
                  className="inline-flex h-10 items-center justify-center rounded-md px-8 border-accent-400 hover:border-accent-600 hover:bg-accent-50 hover:text-accent-600 group"
                >
                  {dictionary?.common?.viewAllPosts || ""}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="relative w-full py-20 md:py-28">
          <div className="absolute inset-0 bg-noise opacity-[0.03] z-0"></div>
          <div className="absolute left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-radial from-primary-50 to-transparent z-0"></div>
          
          <div className="container relative px-4 md:px-6 z-10">
            <div className="flex flex-col items-center justify-center space-y-8 text-center">
              <motion.div 
                className="space-y-3 w-full max-w-4xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-accent-600 via-primary-600 to-accent-600 text-center">
                  {dictionary?.common?.getInTouch || ""}
                </h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-lg text-center">
                  {dictionary?.home?.contactDescription || ""}
                </p>
              </motion.div>
              
              <motion.div
                className="w-full max-w-md space-y-6 shadow-sm border border-border bg-white p-8 rounded-2xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="flex flex-col items-center space-y-4">
                  <SocialLinks className="gap-5" size={24} />
                  <div className="h-px w-full max-w-xs bg-gradient-to-r from-transparent via-border to-transparent"></div>
                  <p className="text-muted-foreground text-center">{dictionary.common.email}</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  )
}

