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
    <Card className="group flex h-full flex-col overflow-hidden border-border bg-white shadow-sm transition-all duration-300 hover:border-primary-400/30 hover:shadow-md hover:shadow-primary-400/10">
      <Link href={getLocalizedPathname(`/projects/${project.slug}`, locale)} className="overflow-hidden">
        <div className="relative aspect-[3/2] w-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10" />
          <Image
            src={project.coverImage || "/placeholder.svg?height=400&width=600"}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </Link>
      <CardHeader className="p-6">
        <CardTitle className="text-xl text-foreground group-hover:text-gradient group-hover:from-primary-500 group-hover:to-accent-500 transition-all duration-300">
          {project.title}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {project.formattedDate}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 px-6">
        <p className="text-muted-foreground line-clamp-3">
          {project.description}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <Badge 
              key={tag} 
              variant="outline" 
              className="border-primary-400/30 bg-primary-100/50 text-primary-700 hover:bg-primary-100"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 p-6 pt-0">
        <Link href={getLocalizedPathname(`/projects/${project.slug}`, locale)} className="flex-1">
          <Button 
            variant="default" 
            size="sm" 
            className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white shadow-sm hover:shadow-md hover:shadow-primary/20 transition-all duration-300"
          >
            {locale === "tr" ? "Detayları Görüntüle" : "View Details"}
          </Button>
        </Link>
        <div className="flex gap-2">
          {project.github && (
            <Link href={project.github} target="_blank" rel="noopener noreferrer">
              <Button
                variant="outline"
                size="icon"
                className="border-primary-400/30 hover:border-primary-500 hover:bg-primary-100 hover:text-primary-700"
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
                className="border-primary-400/30 hover:border-primary-500 hover:bg-primary-100 hover:text-primary-700"
              >
                <ExternalLink className="h-4 w-4" />
                <span className="sr-only">Visit</span>
              </Button>
            </Link>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}

