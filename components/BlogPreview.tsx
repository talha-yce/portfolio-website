'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ContentSection } from './BlogEditor'
import { ContentRenderer } from './ContentRenderer'

interface BlogPreviewProps {
  formData: any
  tags: string[]
  contentSections: ContentSection[]
}

export function BlogPreview({ formData, tags, contentSections }: BlogPreviewProps) {
  // Format date
  const formattedDate = new Date().toLocaleDateString(
    formData.locale === 'tr' ? 'tr-TR' : 'en-US',
    {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
  )

  // Sort content sections by order
  const sortedSections = [...contentSections].sort((a, b) => a.order - b.order)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preview</CardTitle>
        <CardDescription>Preview your blog post before publishing.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Cover image */}
        {formData.coverImage && (
          <div className="rounded-md overflow-hidden">
            <img 
              src={formData.coverImage} 
              alt={formData.coverImageAlt || formData.title}
              className="w-full h-auto object-cover max-h-[400px]" 
            />
          </div>
        )}
        
        <div className="py-2">
          <h1 className="text-3xl font-bold mb-3">{formData.title}</h1>
          
          <div className="text-sm text-gray-500 mb-4">
            {formattedDate}
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>
          
          <p className="text-gray-600 dark:text-gray-300 mb-8 italic border-l-4 pl-4 py-2 border-gray-200 dark:border-gray-700">
            {formData.excerpt}
          </p>
          
          <div className="prose prose-gray dark:prose-invert max-w-none">
            {sortedSections.map((section, index) => (
              <ContentRenderer key={index} section={section} />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 