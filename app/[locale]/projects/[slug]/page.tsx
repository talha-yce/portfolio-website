import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Github, ExternalLink, Calendar } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getAllContent, getContentItem } from "@/lib/content-manager"
import { getDictionary } from "@/lib/i18n/dictionaries"
import { type Locale, getLocalizedPathname } from "@/lib/i18n/config"

interface ProjectPageProps {
  params: {
    locale: Locale
    slug: string
  }
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const locale = (await params).locale
  const slug = (await params).slug
  const project = await getContentItem("projects", slug, locale)

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
  const project = await getContentItem("projects", slug, locale)
  const dictionary = await getDictionary(locale)

  if (!project) {
    notFound()
  }

  return (
    <div className="container py-12">
      <Link href={getLocalizedPathname("/projects", locale)}>
        <Button variant="ghost" className="mb-6 gap-2 text-gray-400 hover:text-purple-400">
          <ArrowLeft className="h-4 w-4" />
          {dictionary.common.backToProjects}
        </Button>
      </Link>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-green-400">
            {project.title}
          </h1>
          <div className="mt-2 flex items-center gap-2 text-gray-400">
            <Calendar className="h-4 w-4" />
            <p>{project.formattedDate}</p>
          </div>
        </div>

        {project.coverImage && (
          <div className="relative aspect-video w-full overflow-hidden rounded-lg border border-purple-900/40 shadow-[0_0_15px_rgba(147,51,234,0.15)]">
            <Image src={project.coverImage || "/placeholder.svg"} alt={project.title} fill className="object-cover" />
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <Badge key={tag} variant="outline" className="border-green-600/40 bg-green-950/20 text-green-400">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="prose prose-invert prose-purple max-w-none">
          <div dangerouslySetInnerHTML={{ __html: project.content }} />
        </div>

        <div className="flex flex-wrap gap-4">
          {project.github && (
            <Link href={project.github} target="_blank" rel="noopener noreferrer">
              <Button className="gap-2 bg-purple-600 text-white hover:bg-purple-700">
                <Github className="h-4 w-4" />
                {locale === "tr" ? "GitHub'da Görüntüle" : "View on GitHub"}
              </Button>
            </Link>
          )}
          {project.link && (
            <Link href={project.link} target="_blank" rel="noopener noreferrer">
              <Button
                variant="outline"
                className="gap-2 border-purple-600 hover:bg-purple-950/20 hover:text-purple-400"
              >
                <ExternalLink className="h-4 w-4" />
                {locale === "tr" ? "Projeyi Ziyaret Et" : "Visit Project"}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}

