'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { FormLabel } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Trash } from 'lucide-react'
import { ContentSection } from './BlogEditor'
import { ImageUploader } from './ImageUploader'

// Define content section types
export const contentSectionTypes = [
  { value: 'text', label: 'Text' },
  { value: 'heading', label: 'Heading' },
  { value: 'image', label: 'Image' },
  { value: 'code', label: 'Code' },
  { value: 'quote', label: 'Quote' },
  { value: 'list', label: 'List' },
  { value: 'video', label: 'Video' },
]

interface BlogContentProps {
  contentSections: ContentSection[]
  setContentSections: (sections: ContentSection[]) => void
}

export function BlogContent({ contentSections, setContentSections }: BlogContentProps) {
  // Add a content section
  const addContentSection = (type: string) => {
    setContentSections([
      ...contentSections,
      {
        type,
        content: '',
        order: contentSections.length,
      },
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
  
  // Handle image upload success
  const handleImageUploadSuccess = (index: number, imageUrl: string) => {
    updateContentSection(index, 'url', imageUrl)
  }

  return (
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
                  <div className="flex space-x-2">
                    <Input
                      value={section.url || ''}
                      onChange={(e) => updateContentSection(index, 'url', e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="flex-1"
                    />
                    <ImageUploader onUploadSuccess={(url) => handleImageUploadSuccess(index, url)} />
                  </div>
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
  )
} 