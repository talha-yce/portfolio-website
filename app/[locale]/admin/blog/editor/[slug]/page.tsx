'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import BlogEditor from '../../../../../../components/BlogEditor'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { AlertCircle, CheckCircle } from 'lucide-react'

interface PageProps {
  params: {
    slug: string
    locale: string
  }
}

export default function EditBlogPostPage({ params }: PageProps) {
  const [post, setPost] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  
  // Fetch the blog post data
  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // If slug is 'new', we're creating a new post
        if (params.slug === 'new') {
          setPost({
            title: '',
            slug: '',
            excerpt: '',
            metaDescription: '',
            locale: params.locale,
            tags: [],
            keywords: [],
            isPublished: false,
            content: [
              { type: 'text', content: '', order: 0 }
            ]
          })
          setLoading(false)
          return
        }
        
        // Otherwise, fetch the existing post
        const res = await fetch(`/api/blog?slug=${params.slug}&locale=${params.locale}`)
        
        if (!res.ok) {
          throw new Error('Failed to fetch blog post')
        }
        
        const data = await res.json()
        setPost(data)
      } catch (err) {
        console.error('Error fetching blog post:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch blog post')
      } finally {
        setLoading(false)
      }
    }
    
    fetchPost()
  }, [params.slug, params.locale])
  
  if (loading) {
    return (
      <div className="container py-12 space-y-6">
        <Skeleton className="h-12 w-1/2" />
        <Skeleton className="h-72 w-full" />
        <Skeleton className="h-72 w-full" />
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
      <h1 className="text-3xl font-bold mb-8">
        {params.slug === 'new' ? 'Create New Blog Post' : 'Edit Blog Post'}
      </h1>
      
      <BlogEditor 
        initialData={post} 
        locale={params.locale} 
        isEditing={params.slug !== 'new'} 
      />
    </div>
  )
} 