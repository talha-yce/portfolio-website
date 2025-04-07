"use client"

import { motion } from "framer-motion"
import { ProjectCard } from "@/components/project-card"
import { PageTransition } from "@/components/page-transition"
import type { Locale } from "@/lib/i18n/config"
import type { Dictionary } from "@/lib/i18n/dictionaries"
import type { ContentMeta } from "@/lib/content-manager"

interface ProjectsPageClientProps {
  params: { locale: Locale }
  dictionary: Dictionary
  projects: ContentMeta[]
}

export default function ProjectsPageClient({ params, dictionary, projects }: ProjectsPageClientProps) {
  const locale = params.locale

  return (
    <PageTransition>
      <div className="container py-12">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-green-400">
            {dictionary.projects.title}
          </h1>
          <p className="text-gray-400">{dictionary.projects.description}</p>
        </div>
        <div className="grid gap-6 pt-8 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <ProjectCard key={project.slug} project={project} locale={locale} index={index} />
          ))}
        </div>
      </div>
    </PageTransition>
  )
}

