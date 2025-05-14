'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { BlogMetadata } from './BlogMetadata'
import { BlogContent } from './BlogContent'
import { BlogPreview } from './BlogPreview'
import { BlogBasicInfo } from './BlogBasicInfo'

const formSchema = z.object({
  title: z.string().min(5, { message: 'Title must be at least 5 characters' }),
  slug: z.string().min(3, { message: 'Slug must be at least 3 characters' })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
      message: 'Slug must be lowercase, alphanumeric, and may contain hyphens',
    }),
  excerpt: z.string().min(10, { message: 'Excerpt must be at least 10 characters' }),
  metaDescription: z.string().min(10, { message: 'Meta description must be at least 10 characters' }),
  coverImage: z.string().optional(),
  coverImageAlt: z.string().optional(),
  locale: z.enum(['en', 'tr']),
  isPublished: z.boolean().default(false),
})

// Define content section schema for all section types
export const contentSectionSchema = z.object({
  type: z.string(),
  content: z.string(),
  order: z.number(),
  language: z.string().optional(),
  url: z.string().optional(),
  alt: z.string().optional(),
  caption: z.string().optional(),
  source: z.string().optional(),
  href: z.string().optional(),
  text: z.string().optional(),
})

export type ContentSection = z.infer<typeof contentSectionSchema>

interface BlogEditorProps {
  initialData: any
  locale: string
  isEditing: boolean
}

export default function BlogEditor({ initialData, locale, isEditing }: BlogEditorProps) {
  const router = useRouter()
  const [tags, setTags] = useState<string[]>(initialData?.tags || [])
  const [keywords, setKeywords] = useState<string[]>(initialData?.keywords || [])
  
  // useEffect kullanarak içerik değişimine tepki verelim
  const [contentSections, setContentSections] = useState<ContentSection[]>(
    Array.isArray(initialData?.content) && initialData?.content.length > 0
      ? initialData.content 
      : [{ type: 'text', content: '', order: 0 }]
  )
  
  // Debug içerik bölümlerini
  console.log('Content sections loaded:', {
    count: Array.isArray(initialData?.content) ? initialData.content.length : 0,
    initialDataId: initialData?._id || 'no-id',
    stateCount: contentSections.length
  })
  
  // initialData değiştiğinde içerik bölümlerini güncelle
  useEffect(() => {
    if (!initialData) return;
    
    // Content array'i derin kopyala
    if (Array.isArray(initialData.content)) {
      try {
        // Derin kopya oluştur
        const deepCopy = JSON.parse(JSON.stringify(initialData.content));
        
        console.log('Setting content sections from useEffect:', {
          postId: initialData._id,
          contentCount: deepCopy.length,
          oldStateCount: contentSections.length,
        });
        
        // Her zaman initialData'dan gelen içeriği kullan - forceful update
        setContentSections(deepCopy);
        
        // Detaylı log - ilk 5 öğe
        deepCopy.slice(0, 5).forEach((section: any, idx: number) => {
          console.log(`Content section ${idx}:`, {
            type: section.type, 
            order: section.order,
            contentPreview: section.content?.substring(0, 20)
          });
        });
      } catch (err) {
        console.error('Error setting content sections:', err);
      }
    } else {
      console.warn('initialData.content is not an array:', initialData.content);
    }
  }, [initialData?._id]); // Sadece post ID değiştiğinde çalıştır
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState('basics')

  // Calculate reading time based on content
  const calculateReadingTime = (sections: ContentSection[]): number => {
    // Assuming an average reading speed of 200 words per minute
    let totalWords = 0;
    
    if (Array.isArray(sections)) {
      sections.forEach(section => {
        if ((section.type === 'text' || section.type === 'heading') && section.content) {
          totalWords += section.content.split(/\s+/).length;
        }
      });
    }
    
    return Math.ceil(totalWords / 200) || 1; // Minimum 1 minute
  }

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || '',
      slug: initialData?.slug || '',
      excerpt: initialData?.excerpt || '',
      metaDescription: initialData?.metaDescription || '',
      coverImage: initialData?.coverImage || '',
      coverImageAlt: initialData?.coverImageAlt || '',
      locale: initialData?.locale || locale,
      isPublished: initialData?.isPublished || false,
    },
  })

  // Handle form submission
  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true)
      
      // Validate content sections
      if (contentSections.length === 0 || contentSections.every(section => !section.content)) {
        toast.error('Please add at least one content section with content')
        setIsSubmitting(false)
        return
      }
      
      // Prepare the blog post data
      const blogPostData = {
        ...data,
        tags,
        keywords,
        content: contentSections,
        date: initialData?.date || new Date().toISOString(),
        readingTime: initialData?.readingTime || calculateReadingTime(contentSections),
        relatedPosts: initialData?.relatedPosts || [],
        ...(isEditing && { _id: initialData._id }),
      }
      
      console.log('Blog post data being submitted:', {
        title: blogPostData.title,
        slug: blogPostData.slug,
        _id: blogPostData._id,
        contentSections: blogPostData.content.length,
        readingTime: blogPostData.readingTime,
        isEditing
      });
      
      // Submit to API - use PUT for editing, POST for creating
      const response = await fetch('/api/blog', {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(blogPostData),
      })
      
      if (!response.ok) {
        console.error('API response error:', {
          status: response.status,
          statusText: response.statusText
        });
        const errorData = await response.json();
        console.error('Error response data:', errorData);
        throw new Error(errorData.error || 'Failed to save blog post')
      }
      
      // Success
      toast.success(isEditing ? 'Blog post updated successfully!' : 'Blog post created successfully!')
      
      // Navigate to the blog post
      setTimeout(() => {
        router.push(`/${data.locale}/blog/${data.slug}`)
      }, 1500)
    } catch (error) {
      console.error('Error saving blog post:', error)
      toast.error(error instanceof Error ? error.message : 'An unexpected error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mb-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="basics">Basic Information</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="meta">SEO & Meta</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          
          {/* Basic Information Tab */}
          <TabsContent value="basics">
            <BlogBasicInfo 
              form={form} 
              tags={tags} 
              setTags={setTags}
            />
          </TabsContent>
          
          {/* Content Tab */}
          <TabsContent value="content">
            <BlogContent 
              contentSections={contentSections} 
              setContentSections={setContentSections}
            />
          </TabsContent>
          
          {/* SEO & Meta Tab */}
          <TabsContent value="meta">
            <BlogMetadata 
              form={form} 
              keywords={keywords} 
              setKeywords={setKeywords}
            />
          </TabsContent>
          
          {/* Preview Tab */}
          <TabsContent value="preview">
            <BlogPreview 
              formData={form.getValues()} 
              tags={tags} 
              contentSections={contentSections}
            />
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : (isEditing ? 'Update Post' : 'Create Post')}
          </Button>
        </div>
      </form>
    </Form>
  )
} 