'use client'

import React from 'react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Pencil, Trash, Plus, AlertCircle, Eye, Filter, ExternalLink, Github } from 'lucide-react'
import { toast } from 'sonner'

interface PageProps {
  params: Promise<{
    locale: string
  }>
}

export default function ProjectsAdminPage({ params }: PageProps) {
  const { locale } = React.use(params)
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const filterParam = searchParams.get('filter')

  // Fetch projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Check if we need to filter by locale from URL parameter
        const localeFilter = filterParam || activeFilter
        let apiUrl = '/api/admin/projects'
        
        // If filter is specified, add it to the API URL
        if (localeFilter) {
          apiUrl += `?locale=${localeFilter}`
          setActiveFilter(localeFilter)
        }
        
        // Fetch projects with filter if specified
        const res = await fetch(apiUrl, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        })
        
        if (!res.ok) {
          throw new Error('Failed to fetch projects')
        }
        
        const data = await res.json()
        if (data.success) {
          setProjects(data.projects)
        } else {
          throw new Error(data.error || 'Failed to fetch projects')
        }
      } catch (err) {
        console.error('Error fetching projects:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch projects')
      } finally {
        setLoading(false)
      }
    }
    
    fetchProjects()
  }, [filterParam, activeFilter])

  // Set filter function
  const setFilter = (filter: string | null) => {
    if (filter) {
      router.push(`/${locale}/admin/projects?filter=${filter}`)
    } else {
      router.push(`/${locale}/admin/projects`)
    }
    setActiveFilter(filter)
  }

  // Delete a project
  const deleteProject = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return
    }
    
    try {
      const res = await fetch(`/api/admin/projects/${id}`, {
        method: 'DELETE',
      })
      
      if (!res.ok) {
        throw new Error('Failed to delete project')
      }
      
      // Remove the project from the state
      setProjects(projects.filter(project => project._id !== id))
      toast.success('Project deleted successfully!')
    } catch (err) {
      console.error('Error deleting project:', err)
      toast.error(err instanceof Error ? err.message : 'Failed to delete project')
    }
  }

  // Toggle project publication status
  const togglePublished = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/projects/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isPublished: !currentStatus
        })
      })
      
      if (!res.ok) {
        throw new Error('Failed to update project status')
      }
      
      // Update the project in the state
      setProjects(projects.map(project => 
        project._id === id 
          ? { ...project, isPublished: !currentStatus }
          : project
      ))
      
      toast.success(`Project ${!currentStatus ? 'published' : 'unpublished'} successfully!`)
    } catch (err) {
      console.error('Error updating project status:', err)
      toast.error(err instanceof Error ? err.message : 'Failed to update project status')
    }
  }

  if (loading) {
    return (
      <div className="container py-12 space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-1/4" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-12">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container py-12">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <h1 className="text-3xl font-bold">Project Management</h1>
          <div className="ml-4 flex items-center">
            <Filter className="w-4 h-4 mr-2 text-gray-500" />
            <select 
              value={activeFilter || ''}
              onChange={(e) => setFilter(e.target.value || null)}
              className="border-none bg-transparent text-sm font-medium text-gray-500 focus:outline-none"
            >
              <option value="">All Languages</option>
              <option value="tr">Turkish Only</option>
              <option value="en">English Only</option>
            </select>
          </div>
        </div>
        <Button onClick={() => router.push(`/${locale}/admin/projects/editor`)}>
          <Plus className="mr-2 h-4 w-4" /> Create New Project
        </Button>
      </div>
      
      <Tabs defaultValue="published">
        <TabsList className="mb-6">
          <TabsTrigger value="published">Published</TabsTrigger>
          <TabsTrigger value="drafts">Drafts</TabsTrigger>
          <TabsTrigger value="all">All Projects</TabsTrigger>
        </TabsList>
        
        <TabsContent value="published">
          <div className="space-y-4">
            {projects.filter(project => project.isPublished).length === 0 ? (
              <p className="text-center text-gray-500 py-10">
                No published projects {activeFilter ? `in ${activeFilter.toUpperCase()}` : ''}.
              </p>
            ) : (
              projects
                .filter(project => project.isPublished)
                .map(project => (
                  <ProjectCard 
                    key={project._id} 
                    project={project} 
                    locale={locale} 
                    onDelete={deleteProject}
                    onTogglePublished={togglePublished}
                  />
                ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="drafts">
          <div className="space-y-4">
            {projects.filter(project => !project.isPublished).length === 0 ? (
              <p className="text-center text-gray-500 py-10">
                No draft projects {activeFilter ? `in ${activeFilter.toUpperCase()}` : ''}.
              </p>
            ) : (
              projects
                .filter(project => !project.isPublished)
                .map(project => (
                  <ProjectCard 
                    key={project._id} 
                    project={project} 
                    locale={locale} 
                    onDelete={deleteProject}
                    onTogglePublished={togglePublished}
                  />
                ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="all">
          <div className="space-y-4">
            {projects.length === 0 ? (
              <p className="text-center text-gray-500 py-10">
                No projects {activeFilter ? `in ${activeFilter.toUpperCase()}` : ''}.
              </p>
            ) : (
              projects.map(project => (
                <ProjectCard 
                  key={project._id} 
                  project={project} 
                  locale={locale} 
                  onDelete={deleteProject}
                  onTogglePublished={togglePublished}
                />
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface ProjectCardProps {
  project: any
  locale: string
  onDelete: (id: string, title: string) => void
  onTogglePublished: (id: string, currentStatus: boolean) => void
}

function ProjectCard({ project, locale, onDelete, onTogglePublished }: ProjectCardProps) {
  const getStatusBadge = (status: string) => {
    const statusColors = {
      'completed': 'bg-green-100 text-green-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      'draft': 'bg-gray-100 text-gray-800',
      'archived': 'bg-red-100 text-red-800'
    }
    
    return (
      <Badge className={statusColors[status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800'}>
        {status}
      </Badge>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              {project.title}
              {project.featured && (
                <Badge variant="secondary">Featured</Badge>
              )}
              {!project.isPublished && (
                <Badge variant="outline">Draft</Badge>
              )}
            </CardTitle>
            <CardDescription className="mt-2">
              {project.description}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {getStatusBadge(project.status)}
            <Badge variant="outline">{project.locale.toUpperCase()}</Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>Created: {new Date(project.date).toLocaleDateString()}</span>
            {project.lastModified && (
              <span>Modified: {new Date(project.lastModified).toLocaleDateString()}</span>
            )}
          </div>
          
          {project.tags && project.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {project.tags.map((tag: string, index: number) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
          
          <div className="flex items-center gap-4 text-sm">
            {project.github && (
              <a 
                href={project.github} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
              >
                <Github className="w-4 h-4" />
                GitHub
              </a>
            )}
            {project.demo && (
              <a 
                href={project.demo} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-green-600 hover:text-green-800"
              >
                <ExternalLink className="w-4 h-4" />
                Live Demo
              </a>
            )}
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onTogglePublished(project._id, project.isPublished)}
          >
            {project.isPublished ? 'Unpublish' : 'Publish'}
          </Button>
          <Link href={`/${locale}/projects/${project.slug}`} target="_blank">
            <Button variant="outline" size="sm">
              <Eye className="mr-2 h-4 w-4" />
              View
            </Button>
          </Link>
        </div>
        <div className="flex gap-2">
          <Link href={`/${locale}/admin/projects/editor/${project._id}`}>
            <Button variant="outline" size="sm">
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onDelete(project._id, project.title)}
            className="text-red-600 hover:text-red-800"
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
} 