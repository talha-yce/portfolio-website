'use client'

import { useState } from 'react'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Trash } from 'lucide-react'

interface BlogMetadataProps {
  form: any
  keywords: string[]
  setKeywords: (keywords: string[]) => void
}

export function BlogMetadata({ form, keywords, setKeywords }: BlogMetadataProps) {
  const [keywordInput, setKeywordInput] = useState('')

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

  // Handle key press for keyword input
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addKeyword()
    }
  }

  return (
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
              onKeyDown={handleKeyPress}
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
  )
} 