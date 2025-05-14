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
import { Pencil, Trash, Plus, AlertCircle, Eye, Filter } from 'lucide-react'
import { toast } from 'sonner'

interface PageProps {
  params: Promise<{
    locale: string
  }>
}

export default function BlogAdminPage({ params }: PageProps) {
  const { locale } = React.use(params)
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  
  const router = useRouter()
  const searchParams = useSearchParams()
  const filterParam = searchParams.get('filter')

  // Fetch blog posts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Check if we need to filter by locale from URL parameter
        const localeFilter = filterParam || activeFilter
        let apiUrl = '/api/blog/all'
        
        // If filter is specified, add it to the API URL
        if (localeFilter) {
          apiUrl += `?locale=${localeFilter}`
          setActiveFilter(localeFilter)
        }
        
        // Fetch posts with filter if specified
        const res = await fetch(apiUrl, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        })
        
        if (!res.ok) {
          throw new Error('Failed to fetch blog posts')
        }
        
        const data = await res.json()
        setPosts(data)
      } catch (err) {
        console.error('Error fetching blog posts:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch blog posts')
      } finally {
        setLoading(false)
      }
    }
    
    fetchPosts()
  }, [filterParam, activeFilter])

  // Set filter function
  const setFilter = (filter: string | null) => {
    if (filter) {
      router.push(`/${locale}/admin/blog?filter=${filter}`)
    } else {
      router.push(`/${locale}/admin/blog`)
    }
    setActiveFilter(filter)
  }

  // Delete a blog post
  const deletePost = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return
    }
    
    try {
      const res = await fetch(`/api/blog?id=${id}`, {
        method: 'DELETE',
      })
      
      if (!res.ok) {
        throw new Error('Failed to delete blog post')
      }
      
      // Remove the post from the state
      setPosts(posts.filter(post => post._id !== id))
      toast.success('Blog post deleted successfully!')
    } catch (err) {
      console.error('Error deleting blog post:', err)
      toast.error(err instanceof Error ? err.message : 'Failed to delete blog post')
    }
  }

  // Get current filter display text
  const getFilterText = () => {
    if (!activeFilter) return 'All Languages'
    return activeFilter.toUpperCase() === 'TR' ? 'Turkish Only' : 'English Only'
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
          <h1 className="text-3xl font-bold">Blog Management</h1>
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
        <Button onClick={() => router.push(`/${locale}/admin/blog/editor/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Create New Post
        </Button>
      </div>
      
      <Tabs defaultValue="published">
        <TabsList className="mb-6">
          <TabsTrigger value="published">Published</TabsTrigger>
          <TabsTrigger value="drafts">Drafts</TabsTrigger>
        </TabsList>
        
        <TabsContent value="published">
          <div className="space-y-4">
            {posts.filter(post => post.isPublished).length === 0 ? (
              <p className="text-center text-gray-500 py-10">
                No published posts {activeFilter ? `in ${activeFilter.toUpperCase()}` : ''}.
              </p>
            ) : (
              posts
                .filter(post => post.isPublished)
                .map(post => (
                  <BlogPostCard 
                    key={post._id} 
                    post={post} 
                    locale={locale} 
                    onDelete={deletePost} 
                  />
                ))
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="drafts">
          <div className="space-y-4">
            {posts.filter(post => !post.isPublished).length === 0 ? (
              <p className="text-center text-gray-500 py-10">
                No draft posts {activeFilter ? `in ${activeFilter.toUpperCase()}` : ''}.
              </p>
            ) : (
              posts
                .filter(post => !post.isPublished)
                .map(post => (
                  <BlogPostCard 
                    key={post._id} 
                    post={post} 
                    locale={locale} 
                    onDelete={deletePost} 
                  />
                ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface BlogPostCardProps {
  post: any
  locale: string
  onDelete: (id: string, title: string) => void
}

function BlogPostCard({ post, locale, onDelete }: BlogPostCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between">
          <div>
            <CardTitle>{post.title}</CardTitle>
            <CardDescription>
              {post.formattedDate || new Date(post.date).toLocaleDateString()}
            </CardDescription>
          </div>
          <Badge className="h-6 ml-2" variant={post.locale === 'tr' ? 'destructive' : 'default'}>
            {post.locale?.toUpperCase() || locale.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="line-clamp-2 text-gray-500 mb-4">{post.excerpt}</p>
        <div className="flex flex-wrap gap-2">
          {post.tags?.map((tag: string) => (
            <Badge key={tag} variant="outline">{tag}</Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex space-x-2">
          <Button asChild variant="outline" size="sm">
            <Link href={`/${post.locale || locale}/blog/${post.slug}`}>
              <Eye className="mr-2 h-4 w-4" /> View
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href={`/${locale}/admin/blog/editor/${post.slug}`}>
              <Pencil className="mr-2 h-4 w-4" /> Edit
            </Link>
          </Button>
        </div>
        <Button 
          variant="destructive" 
          size="sm" 
          onClick={() => onDelete(post._id, post.title)}
        >
          <Trash className="mr-2 h-4 w-4" /> Delete
        </Button>
      </CardFooter>
    </Card>
  )
} 