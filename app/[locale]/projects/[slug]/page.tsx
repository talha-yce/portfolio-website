import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Github, ExternalLink, Calendar, Tag } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { getAllContent, getContentItem } from "@/lib/content-manager"
import { getDictionary } from "@/lib/i18n/dictionaries"
import { type Locale, getLocalizedPathname } from "@/lib/i18n/config"
import { getProjectBySlug } from "@/lib/services/projectService"
import { PageTransition } from "@/components/page-transition"
import { SiteLayout } from "@/components/site-layout"
import { ProjectContentRenderer } from "@/components/ProjectContentRenderer"
import { sanitizeForClient } from "@/lib/utils"

interface ProjectPageProps {
  params: {
    locale: Locale
    slug: string
  }
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const locale = (await params).locale
  const slug = (await params).slug
  
  // Try database first, fallback to static content
  let project = await getProjectBySlug(slug, locale)
  if (!project) {
    project = await getContentItem("projects", slug, locale)
  }

  if (!project) {
    return {
      title: "Project Not Found",
    }
  }

  return {
    title: project.title,
    description: project.description,
  }
}

export async function generateStaticParams({ params }: { params: { locale: Locale } }) {
  const locale = (await params).locale
  const projects = await getAllContent("projects", locale)

  return projects.map((project) => ({
    slug: project.slug,
  }))
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const locale = (await params).locale
  const slug = (await params).slug
  const dictionary = await getDictionary(locale)
  
  // Try database first, fallback to static content
  let project = await getProjectBySlug(slug, locale)
  if (!project) {
    project = await getContentItem("projects", slug, locale)
  }

  if (!project) {
    notFound()
  }

  return (
    <SiteLayout locale={locale} dictionary={dictionary}>
      <PageTransition>
        <div className="relative min-h-screen pb-20">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary-50/40 via-background to-background pointer-events-none"></div>
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary-300/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-accent-300/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="container py-12 relative z-10">
          <Link href={getLocalizedPathname("/projects", locale)}>
            <Button variant="ghost" className="mb-10 gap-2 text-muted-foreground hover:text-primary-600 group transition-colors">
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              {dictionary.common.backToProjects}
            </Button>
          </Link>
          
          <div className="max-w-4xl mx-auto space-y-10">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="inline-block rounded-full px-3 py-1 text-sm font-medium bg-primary-100 text-primary-800">
                  {dictionary.common.projects}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                  <Calendar className="h-4 w-4 text-primary-500" />
                  <time dateTime={new Date(project.date).toISOString()}>{project.formattedDate}</time>
                </div>
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-800 leading-tight">
                {project.title}
              </h1>
            </div>

            {project.coverImage && (
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl border border-primary-200 shadow-lg">
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-50 z-10"></div>
                <Image 
                  src={project.coverImage || "/placeholder.svg?height=630&width=1200"} 
                  alt={project.title} 
                  fill 
                  sizes="100vw"
                  priority
                  className="object-cover transition-all duration-700 hover:scale-105" 
                />
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-primary-700">
                <Tag className="h-4 w-4" />
                <span className="text-sm font-medium">{locale === "tr" ? "Teknolojiler" : "Technologies"}:</span>
              </div>
              {project.tags.map((tag: string) => (
                <Badge 
                  key={tag} 
                  variant="outline" 
                  className="px-2.5 py-0.5 text-xs font-medium rounded-full border-primary-400/30 bg-primary-100/50 text-primary-700 hover:bg-primary-200 transition-colors"
                >
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-md border border-primary-100">
              <div className="prose max-w-none prose-headings:text-foreground prose-headings:font-bold prose-h2:text-2xl prose-h3:text-xl prose-p:text-muted-foreground prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-lg prose-strong:text-foreground">
                {Array.isArray(project.content) ? (
                  <ProjectContentRenderer content={sanitizeForClient(project.content)} />
                ) : (
                  <div dangerouslySetInnerHTML={{ __html: project.content }} />
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mt-8">
              {project.github && (
                <Link href={project.github} target="_blank" rel="noopener noreferrer">
                  <Button className="gap-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white hover:from-primary-700 hover:to-primary-800 shadow-md shadow-primary-500/20 hover:shadow-lg hover:shadow-primary-500/30 transition-all duration-300">
                    <Github className="h-4 w-4" />
                    {locale === "tr" ? "GitHub'da Görüntüle" : "View on GitHub"}
                  </Button>
                </Link>
              )}
              {project.demo && (
                <Link href={project.demo} target="_blank" rel="noopener noreferrer">
                  <Button
                    variant="outline"
                    className="gap-2 border-primary-200 hover:bg-primary-50 hover:border-primary-300 hover:text-primary-700 transition-all duration-300"
                  >
                    <ExternalLink className="h-4 w-4" />
                    {locale === "tr" ? "Projeyi Ziyaret Et" : "Visit Project"}
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
      </PageTransition>
    </SiteLayout>
  )
}

