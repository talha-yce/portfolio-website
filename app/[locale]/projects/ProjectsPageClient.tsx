"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { Filter, ChevronLeft, ChevronRight } from "lucide-react"

import { ProjectCard } from "@/components/project-card"
import { PageTransition } from "@/components/page-transition"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Locale } from "@/lib/i18n/config"
import type { Dictionary } from "@/lib/i18n/dictionaries"
import type { ContentMeta } from "@/lib/content-manager"

interface ProjectsPageClientProps {
  params: { locale: Locale }
  dictionary: Dictionary
  projects: ContentMeta[]
}

const PROJECTS_PER_PAGE = 6

export default function ProjectsPageClient({ params, dictionary, projects }: ProjectsPageClientProps) {
  const locale = params.locale
  
  // Extract all unique tags from projects
  const allTags = Array.from(new Set(projects.flatMap(project => project.tags)))
  
  // State for active tag filter
  const [activeTag, setActiveTag] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  
  // Filter projects based on selected tag
  const filteredProjects = activeTag 
    ? projects.filter(project => project.tags.includes(activeTag))
    : projects
    
  // Calculate pagination
  const totalPages = Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE)
  const paginatedProjects = filteredProjects.slice(
    (currentPage - 1) * PROJECTS_PER_PAGE,
    currentPage * PROJECTS_PER_PAGE
  )
  
  // Reset to first page when tag filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [activeTag])
  
  // Handle page changes
  const goToPage = (page: number) => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
    setCurrentPage(page)
  }
  
  // Generate page numbers array
  const getPageNumbers = () => {
    const pageNumbers = []
    const maxVisiblePages = 5
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i)
    }
    
    return pageNumbers
  }

  return (
    <PageTransition>
      <section className="py-20 relative">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary-50/40 via-background to-background pointer-events-none"></div>
        <div className="absolute top-1/4 left-8 w-64 h-64 bg-primary-300/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-1/3 right-8 w-64 h-64 bg-accent-300/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="container relative z-10">
          <motion.div 
            className="max-w-3xl mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-block rounded-full px-3 py-1 text-sm font-medium bg-primary-100 text-primary-800 mb-3">
              {dictionary.common.projects}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-800">
              {dictionary.projects.title}
            </h1>
            <p className="text-muted-foreground text-lg">{dictionary.projects.description}</p>
          </motion.div>
          
          {/* Tag Filters */}
          {allTags.length > 0 && (
            <motion.div 
              className="mb-8" 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Filter className="h-5 w-5 text-primary-500" />
                <h3 className="text-lg font-medium text-foreground">{locale === "tr" ? "Teknolojiye göre filtrele" : "Filter by technology"}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={activeTag === null ? "default" : "outline"}
                  size="sm"
                  className={`rounded-full ${activeTag === null 
                    ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20' 
                    : 'border-primary-200 hover:bg-primary-50'}`}
                  onClick={() => setActiveTag(null)}
                >
                  {locale === "tr" ? "Tümü" : "All"}
                </Button>
                {allTags.map(tag => (
                  <Button
                    key={tag}
                    variant={activeTag === tag ? "default" : "outline"}
                    size="sm"
                    className={`rounded-full ${activeTag === tag 
                      ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20' 
                      : 'border-primary-200 hover:bg-primary-50'}`}
                    onClick={() => setActiveTag(tag)}
                  >
                    {tag}
                  </Button>
                ))}
              </div>
            </motion.div>
          )}
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredProjects.length > 0 ? (
              paginatedProjects.map((project, index) => (
                <motion.div
                  key={project.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group"
                >
                  <ProjectCard project={project} locale={locale} index={index} />
                </motion.div>
              ))
            ) : (
              <motion.div 
                className="col-span-3 py-16 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-primary-500 mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-medium">{locale === "tr" ? "Proje bulunamadı" : "No projects found"}</h3>
                <p className="text-muted-foreground mt-2">{locale === "tr" ? "Farklı bir filtre deneyin" : "Try a different filter"}</p>
              </motion.div>
            )}
          </div>
          
          {/* Pagination */}
          {filteredProjects.length > 0 && totalPages > 1 && (
            <div className="flex justify-center mt-16">
              <div className="flex items-center gap-2 bg-white/80 p-2 rounded-lg shadow-sm border border-primary-100">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-9 w-9 p-0 border-primary-200 hover:bg-primary-50 disabled:opacity-50"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">{locale === "tr" ? "Önceki Sayfa" : "Previous Page"}</span>
                </Button>
                
                {getPageNumbers().map(page => (
                  <Button
                    key={page}
                    variant={page === currentPage ? "default" : "outline"}
                    size="sm"
                    className={`h-9 w-9 p-0 ${
                      page === currentPage 
                        ? 'bg-primary-600 hover:bg-primary-700 text-white font-medium shadow-sm'
                        : 'border-primary-200 hover:bg-primary-50'
                    }`}
                    onClick={() => goToPage(page)}
                  >
                    {page}
                  </Button>
                ))}
                
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 p-0 border-primary-200 hover:bg-primary-50 disabled:opacity-50"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">{locale === "tr" ? "Sonraki Sayfa" : "Next Page"}</span>
                </Button>
              </div>
            </div>
          )}
          
          {/* Project count */}
          {filteredProjects.length > 0 && (
            <div className="text-center text-sm text-muted-foreground mt-4">
              {locale === "tr" 
                ? `Toplam ${filteredProjects.length} proje, sayfa ${currentPage}/${totalPages}`
                : `Showing page ${currentPage} of ${totalPages} (${filteredProjects.length} projects total)`
              }
            </div>
          )}
        </div>
      </section>
    </PageTransition>
  )
}

