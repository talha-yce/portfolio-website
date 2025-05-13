'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Upload } from 'lucide-react'
import { toast } from 'sonner'

interface ImageUploaderProps {
  onUploadSuccess: (imageUrl: string) => void
}

export function ImageUploader({ onUploadSuccess }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    
    const file = files[0]
    
    // Check file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!validTypes.includes(file.type)) {
      toast.error('Invalid file type. Only JPEG, PNG, GIF and WebP are allowed.')
      return
    }
    
    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      toast.error('File is too large. Maximum size is 5MB.')
      return
    }
    
    try {
      setIsUploading(true)
      
      // Create form data
      const formData = new FormData()
      formData.append('file', file)
      
      // Upload the file
      const response = await fetch('/api/blog/upload', {
        method: 'POST',
        body: formData,
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to upload image')
      }
      
      const data = await response.json()
      
      // Call the callback with the image URL
      onUploadSuccess(data.filePath)
      toast.success('Image uploaded successfully!')
    } catch (error) {
      console.error('Error uploading image:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to upload image')
    } finally {
      setIsUploading(false)
      
      // Reset the file input
      e.target.value = ''
    }
  }
  
  return (
    <div>
      <Button 
        type="button" 
        variant="outline"
        size="icon"
        className="relative"
        disabled={isUploading}
      >
        {isUploading ? (
          <span className="animate-spin">↻</span>
        ) : (
          <Upload className="h-4 w-4" />
        )}
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          accept="image/jpeg,image/png,image/gif,image/webp"
          onChange={handleUpload}
          disabled={isUploading}
        />
      </Button>
    </div>
  )
} 