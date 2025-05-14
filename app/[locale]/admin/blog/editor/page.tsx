'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Check, Plus, Trash } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

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

// Define content section types
const contentSectionTypes = [
  { value: 'text', label: 'Text' },
  { value: 'heading', label: 'Heading' },
  { value: 'image', label: 'Image' },
  { value: 'code', label: 'Code' },
  { value: 'quote', label: 'Quote' },
  { value: 'list', label: 'List' },
  { value: 'video', label: 'Video' },
]

// Content section schema for any section
const contentSectionSchema = z.object({
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

export default function BlogEditor() {
  const router = useRouter()
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')
  const [keywords, setKeywords] = useState<string[]>([])
  const [keywordInput, setKeywordInput] = useState('')
  const [contentSections, setContentSections] = useState<any[]>([
    { type: 'text', content: '', order: 0 }
  ])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeTab, setActiveTab] = useState('basics')

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      slug: '',
      excerpt: '',
      metaDescription: '',
      coverImage: '',
      coverImageAlt: '',
      locale: 'en',
      isPublished: false,
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
        date: new Date().toISOString(),
      }
      
      // Submit to API
      const response = await fetch('/api/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(blogPostData),
      })
      
      const responseData = await response.json()
      
      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to create blog post')
      }
      
      // Success
      toast.success('Blog post created successfully!')
      
      // Navigate to the blog management page first to show success
      router.push(`/${data.locale}/admin/blog`)
    } catch (error) {
      console.error('Error creating blog post:', error)
      
      // Show a more helpful error message
      if (error instanceof Error) {
        toast.error(`Error: ${error.message}`)
      } else {
        toast.error('An unexpected error occurred while creating the blog post')
      }
      
      // Keep the form enabled so the user can try again
      setIsSubmitting(false)
    }
  }
  
  // Generate slug from title
  const generateSlug = () => {
    const title = form.getValues('title')
    if (!title) return
    
    const slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-')     // Replace spaces with hyphens
      .replace(/-+/g, '-')      // Replace multiple hyphens with single hyphen
    
    form.setValue('slug', slug)
  }
  
  // Add a tag
  const addTag = () => {
    if (!tagInput || tags.includes(tagInput)) return
    setTags([...tags, tagInput])
    setTagInput('')
  }
  
  // Remove a tag
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }
  
  // Add a keyword
  const addKeyword = () => {
    if (!keywordInput || keywords.includes(keywordInput)) return
    setKeywords([...keywords, keywordInput])
    setKeywordInput('')
  }
  
  // Remove a keyword
  const removeKeyword = (keywordToRemove: string) => {
    setKeywords(keywords.filter(keyword => keyword !== keywordToRemove))
  }
  
  // Add a content section
  const addContentSection = (type: string) => {
    setContentSections([
      ...contentSections,
      {
        type,
        content: '',
        order: contentSections.length,
      }
    ])
  }
  
  // Remove a content section
  const removeContentSection = (index: number) => {
    const updatedSections = [...contentSections]
    updatedSections.splice(index, 1)
    // Update order values
    updatedSections.forEach((section, i) => {
      section.order = i
    })
    setContentSections(updatedSections)
  }
  
  // Update a content section
  const updateContentSection = (index: number, field: string, value: any) => {
    const updatedSections = [...contentSections]
    updatedSections[index] = {
      ...updatedSections[index],
      [field]: value,
    }
    setContentSections(updatedSections)
  }

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">Create a New Blog Post</h1>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mb-8">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="basics">Basic Information</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="meta">SEO & Meta</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>
            
            {/* Basic Information */}
            <TabsContent value="basics">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Enter the basic information for your blog post.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Post title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex space-x-2 items-end">
                    <FormField
                      control={form.control}
                      name="slug"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Slug</FormLabel>
                          <FormControl>
                            <Input placeholder="post-slug" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="button" onClick={generateSlug} variant="outline">
                      Generate
                    </Button>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="excerpt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Excerpt</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="A short summary of the post"
                            className="min-h-24"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="locale"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Language</FormLabel>
                        <Select 
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select language" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="tr">Turkish</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div>
                    <FormLabel>Tags</FormLabel>
                    <div className="flex flex-wrap gap-2 mt-2 mb-2">
                      {tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="flex items-center gap-1">
                          {tag}
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon" 
                            className="h-4 w-4 rounded-full" 
                            onClick={() => removeTag(tag)}
                          >
                            <Trash className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex space-x-2">
                      <Input 
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        placeholder="Add a tag"
                        className="flex-1"
                      />
                      <Button type="button" onClick={addTag} size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="coverImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cover Image URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/image.jpg" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="coverImageAlt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cover Image Alt Text</FormLabel>
                        <FormControl>
                          <Input placeholder="Image description" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="isPublished"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="h-4 w-4"
                          />
                        </FormControl>
                        <FormLabel className="text-sm">Publish immediately</FormLabel>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Content */}
            <TabsContent value="content">
              <Card>
                <CardHeader>
                  <CardTitle>Post Content</CardTitle>
                  <CardDescription>Add the content sections for your blog post.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {contentSections.map((section, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <Select 
                            value={section.type}
                            onValueChange={(value) => updateContentSection(index, 'type', value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                              {contentSectionTypes.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                  {type.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <span className="text-sm text-gray-400">Section {index + 1}</span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeContentSection(index)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {/* Content field */}
                      <div>
                        <FormLabel>Content</FormLabel>
                        <Textarea
                          value={section.content}
                          onChange={(e) => updateContentSection(index, 'content', e.target.value)}
                          placeholder={`Enter ${section.type} content`}
                          className="min-h-32"
                        />
                      </div>
                      
                      {/* Additional fields based on section type */}
                      {section.type === 'code' && (
                        <div>
                          <FormLabel>Language</FormLabel>
                          <Input
                            value={section.language || ''}
                            onChange={(e) => updateContentSection(index, 'language', e.target.value)}
                            placeholder="javascript, html, css, etc."
                          />
                        </div>
                      )}
                      
                      {section.type === 'image' && (
                        <>
                          <div>
                            <FormLabel>Image URL</FormLabel>
                            <Input
                              value={section.url || ''}
                              onChange={(e) => updateContentSection(index, 'url', e.target.value)}
                              placeholder="https://example.com/image.jpg"
                            />
                          </div>
                          <div>
                            <FormLabel>Alt Text</FormLabel>
                            <Input
                              value={section.alt || ''}
                              onChange={(e) => updateContentSection(index, 'alt', e.target.value)}
                              placeholder="Image description"
                            />
                          </div>
                          <div>
                            <FormLabel>Caption</FormLabel>
                            <Input
                              value={section.caption || ''}
                              onChange={(e) => updateContentSection(index, 'caption', e.target.value)}
                              placeholder="Image caption"
                            />
                          </div>
                        </>
                      )}
                      
                      {section.type === 'quote' && (
                        <div>
                          <FormLabel>Source</FormLabel>
                          <Input
                            value={section.source || ''}
                            onChange={(e) => updateContentSection(index, 'source', e.target.value)}
                            placeholder="Quote source"
                          />
                        </div>
                      )}
                      
                      {section.type === 'video' && (
                        <div>
                          <FormLabel>Video URL</FormLabel>
                          <Input
                            value={section.url || ''}
                            onChange={(e) => updateContentSection(index, 'url', e.target.value)}
                            placeholder="https://youtube.com/watch?v=..."
                          />
                        </div>
                      )}
                      
                      {section.type === 'link' && (
                        <>
                          <div>
                            <FormLabel>Link URL</FormLabel>
                            <Input
                              value={section.href || ''}
                              onChange={(e) => updateContentSection(index, 'href', e.target.value)}
                              placeholder="https://example.com"
                            />
                          </div>
                          <div>
                            <FormLabel>Link Text</FormLabel>
                            <Input
                              value={section.text || ''}
                              onChange={(e) => updateContentSection(index, 'text', e.target.value)}
                              placeholder="Click here"
                            />
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                  
                  <div className="flex justify-center">
                    <Select onValueChange={(value) => addContentSection(value)}>
                      <SelectTrigger className="w-60">
                        <SelectValue placeholder="Add content section" />
                      </SelectTrigger>
                      <SelectContent>
                        {contentSectionTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* SEO & Meta */}
            <TabsContent value="meta">
              <Card>
                <CardHeader>
                  <CardTitle>SEO & Meta Information</CardTitle>
                  <CardDescription>Optimize your post for search engines.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="metaDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Meta Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="A description for search engines"
                            className="min-h-24"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div>
                    <FormLabel>Keywords</FormLabel>
                    <div className="flex flex-wrap gap-2 mt-2 mb-2">
                      {keywords.map((keyword) => (
                        <Badge key={keyword} variant="outline" className="flex items-center gap-1">
                          {keyword}
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="icon" 
                            className="h-4 w-4 rounded-full" 
                            onClick={() => removeKeyword(keyword)}
                          >
                            <Trash className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex space-x-2">
                      <Input 
                        value={keywordInput}
                        onChange={(e) => setKeywordInput(e.target.value)}
                        placeholder="Add a keyword"
                        className="flex-1"
                      />
                      <Button type="button" onClick={addKeyword} size="sm">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Preview */}
            <TabsContent value="preview">
              <Card>
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                  <CardDescription>Preview your blog post before publishing.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Cover image */}
                  {form.getValues('coverImage') && (
                    <div className="rounded-md overflow-hidden">
                      <img 
                        src={form.getValues('coverImage')} 
                        alt={form.getValues('coverImageAlt') || form.getValues('title')}
                        className="w-full h-auto object-cover" 
                      />
                    </div>
                  )}
                  
                  <h1 className="text-3xl font-bold">{form.getValues('title')}</h1>
                  
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <p className="text-gray-300">{form.getValues('excerpt')}</p>
                  
                  <div className="space-y-4 border-t pt-4">
                    {contentSections.map((section, index) => (
                      <div key={index} className="prose prose-invert">
                        {section.type === 'heading' && <h2>{section.content}</h2>}
                        {section.type === 'text' && <p>{section.content}</p>}
                        {section.type === 'code' && (
                          <pre className="bg-gray-800 p-4 rounded-md">
                            <code>{section.content}</code>
                          </pre>
                        )}
                        {section.type === 'image' && section.url && (
                          <figure>
                            <img src={section.url} alt={section.alt || ''} />
                            {section.caption && (
                              <figcaption className="text-center text-sm text-gray-400">
                                {section.caption}
                              </figcaption>
                            )}
                          </figure>
                        )}
                        {section.type === 'quote' && (
                          <blockquote className="border-l-4 border-gray-500 pl-4">
                            {section.content}
                            {section.source && (
                              <footer className="mt-2 text-sm">— {section.source}</footer>
                            )}
                          </blockquote>
                        )}
                        {section.type === 'list' && (
                          <ul className="list-disc pl-6">
                            {section.content.split('\n').map((item: string, i: number) => (
                              <li key={i}>{item}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Post'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
} 