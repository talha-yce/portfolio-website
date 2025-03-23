"use client"

import Link from "next/link"
import Image from "next/image"
import { ExternalLink, Github } from "lucide-react"
import { motion } from "framer-motion"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { ContentMeta } from "@/lib/content-manager"
import { type Locale, getLocalizedPathname } from "@/lib/i18n/config"

interface ProjectCardProps {
  project: ContentMeta
  locale: Locale
  index?: number
}

export function ProjectCard({ project, locale, index = 0 }: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="flex flex-col overflow-hidden border-purple-900/40 bg-black/20 backdrop-blur-sm transition-all duration-300 hover:border-purple-600/60 hover:shadow-[0_0_15px_rgba(147,51,234,0.15)]">
        <Link href={getLocalizedPathname(`/projects/${project.slug}`, locale)} className="overflow-hidden">
          <div className="relative h-48 w-full overflow-hidden">
            <Image
              src={project.coverImage || "/placeholder.svg?height=400&width=600"}
              alt={project.title}
              fill
              className="object-cover transition-transform duration-500 hover:scale-105"
            />
          </div>
        </Link>
        <CardHeader>
          <CardTitle className="text-xl text-purple-300">{project.title}</CardTitle>
          <CardDescription className="text-gray-400">{project.formattedDate}</CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          <p className="text-sm text-gray-400 line-clamp-3">{project.description}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="border-green-600/40 bg-green-950/20 text-green-400">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Link href={getLocalizedPathname(`/projects/${project.slug}`, locale)} className="flex-1">
            <Button variant="default" size="sm" className="w-full bg-purple-600 text-white hover:bg-purple-700">
              {locale === "tr" ? "Detayları Görüntüle" : "View Details"}
            </Button>
          </Link>
          {project.github && (
            <Link href={project.github} target="_blank" rel="noopener noreferrer">
              <Button
                variant="outline"
                size="icon"
                className="border-purple-600/40 hover:border-purple-600 hover:bg-purple-950/20"
              >
                <Github className="h-4 w-4" />
                <span className="sr-only">GitHub</span>
              </Button>
            </Link>
          )}
          {project.link && (
            <Link href={project.link} target="_blank" rel="noopener noreferrer">
              <Button
                variant="outline"
                size="icon"
                className="border-purple-600/40 hover:border-purple-600 hover:bg-purple-950/20"
              >
                <ExternalLink className="h-4 w-4" />
                <span className="sr-only">Visit</span>
              </Button>
            </Link>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  )
}

