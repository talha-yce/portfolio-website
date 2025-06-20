'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Eye, Upload, X, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { toast } from '@/hooks/use-toast'
import { Locale } from '@/lib/i18n/config'

interface ContentSection {
  type: 'paragraph' | 'heading' | 'list' | 'code' | 'image' | 'quote'
  content: string
}


interface ProjectFormData {
  title: string
  slug: string
  description: string
  date: string
  content: ContentSection[]
  tags: string[]
  github: string
  demo: string
  coverImage: string
  coverImageAlt: string
  metaDescription: string
  keywords: string[]
  locale: Locale
  isPublished: boolean
  featured: boolean
  status: 'draft' | 'in-progress' | 'completed' | 'archived'
}

interface AdminProjectEditorProps {
  params: { locale: Locale }
}

export default function AdminProjectEditor({ params }: AdminProjectEditorProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [tagInput, setTagInput] = useState('')
  const [keywordInput, setKeywordInput] = useState('')
  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    slug: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    content: [{ type: 'paragraph', content: '' }],
    tags: [],
    github: '',
    demo: '',
    coverImage: '',
    coverImageAlt: '',
    metaDescription: '',
    keywords: [],
    locale: params.locale,
    isPublished: false,
    featured: false,
    status: 'draft'
  })

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }))
  }

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }))
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const addKeyword = () => {
    if (keywordInput.trim() && !formData.keywords.includes(keywordInput.trim())) {
      setFormData(prev => ({
        ...prev,
        keywords: [...prev.keywords, keywordInput.trim()]
      }))
      setKeywordInput('')
    }
  }

  const removeKeyword = (keywordToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      keywords: prev.keywords.filter(keyword => keyword !== keywordToRemove)
    }))
  }

  const addContentSection = () => {
    setFormData(prev => ({
      ...prev,
      content: [...prev.content, { type: 'paragraph', content: '' }]
    }))
  }

  const updateContentSection = (index: number, field: keyof ContentSection, value: string) => {
    setFormData(prev => ({
      ...prev,
      content: prev.content.map((section, i) => 
        i === index ? { ...section, [field]: value } : section
      )
    }))
  }

  const removeContentSection = (index: number) => {
    if (formData.content.length > 1) {
      setFormData(prev => ({
        ...prev,
        content: prev.content.filter((_, i) => i !== index)
      }))
    }
  }

  const handleSave = async (publish = false) => {
    if (!formData.title.trim()) {
      toast({
        title: 'Hata',
        description: 'Proje başlığı gereklidir.',
        variant: 'destructive',
      })
      return
    }

    try {
      setSaving(true)
      
      // Transform content to match database schema with proper field structure
      const transformedContent = formData.content.map((section, index) => {
        const baseSection = {
          _id: undefined, // Let MongoDB generate this
          type: section.type,
          text: section.content.trim(),
          order: index
        }
        
        switch (section.type) {
          case 'paragraph':
            return { ...baseSection, type: 'paragraph' }
          case 'heading':
            return { 
              ...baseSection, 
              type: 'heading', 
              level: 2,
              items: []
            }
          case 'list':
            return { 
              ...baseSection, 
              type: 'list',
              items: section.content.split('\n').filter(item => item.trim()).map(item => item.trim())
            }
          case 'code':
            return { 
              ...baseSection, 
              type: 'code', 
              language: 'javascript',
              items: []
            }
          case 'image':
            return { 
              ...baseSection, 
              type: 'image', 
              src: section.content,
              alt: 'Project image',
              caption: '',
              items: []
            }
          case 'quote':
            return { 
              ...baseSection, 
              type: 'quote',
              author: '',
              items: []
            }
          default:
            return { ...baseSection, type: 'paragraph' }
        }
      })
      
      const projectData = {
        ...formData,
        content: transformedContent,
        isPublished: publish || formData.isPublished,
        date: new Date(formData.date),
        lastModified: new Date(),
        author: 'Admin',
        readingTime: Math.ceil(formData.content.reduce((acc, section) => acc + section.content.split(' ').length, 0) / 200)
      }

      const response = await fetch('/api/admin/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to save project')
      }

      toast({
        title: 'Başarılı',
        description: `Proje ${publish ? 'yayınlandı' : 'kaydedildi'}.`,
      })

      // Signal data change for admin refresh
      if (typeof window !== 'undefined') {
        localStorage.setItem('admin-data-changed', Date.now().toString())
        localStorage.removeItem('admin-data-changed')
      }

      router.push(`/${params.locale}/admin/projects`)
    } catch (error) {
      console.error('Error saving project:', error)
      toast({
        title: 'Hata',
        description: error instanceof Error ? error.message : 'Proje kaydedilirken bir hata oluştu.',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Geri
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Yeni Proje</h1>
            <p className="text-muted-foreground">
              Yeni bir proje oluşturun ve yayınlayın
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => handleSave(false)}
            disabled={saving}
          >
            <Save className="mr-2 h-4 w-4" />
            {saving ? 'Kaydediliyor...' : 'Taslak Kaydet'}
          </Button>
          <Button
            onClick={() => handleSave(true)}
            disabled={saving}
          >
            <Eye className="mr-2 h-4 w-4" />
            {saving ? 'Yayınlanıyor...' : 'Yayınla'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Temel Bilgiler</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Başlık *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Proje başlığı"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="proje-slug"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Açıklama *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Proje açıklaması"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Tarih</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Durum</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: any) => setFormData(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Taslak</SelectItem>
                      <SelectItem value="in-progress">Devam Ediyor</SelectItem>
                      <SelectItem value="completed">Tamamlandı</SelectItem>
                      <SelectItem value="archived">Arşivlendi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>İçerik</CardTitle>
              <CardDescription>
                Proje içeriğini bölümler halinde oluşturun
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.content.map((section, index) => (
                <div key={index} className="space-y-2 p-4 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <Select
                      value={section.type}
                      onValueChange={(value: any) => updateContentSection(index, 'type', value)}
                    >
                      <SelectTrigger className="w-[200px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="paragraph">Paragraf</SelectItem>
                        <SelectItem value="heading">Başlık</SelectItem>
                        <SelectItem value="list">Liste</SelectItem>
                        <SelectItem value="code">Kod</SelectItem>
                        <SelectItem value="image">Resim</SelectItem>
                        <SelectItem value="quote">Alıntı</SelectItem>
                      </SelectContent>
                    </Select>
                    {formData.content.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeContentSection(index)}
                        className="text-red-600"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <Textarea
                    value={section.content}
                    onChange={(e) => updateContentSection(index, 'content', e.target.value)}
                    placeholder={`${section.type} içeriği...`}
                    rows={section.type === 'heading' ? 2 : 4}
                  />
                </div>
              ))}
              <Button
                variant="outline"
                onClick={addContentSection}
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Yeni Bölüm Ekle
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Yayın Ayarları</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="published">Yayınlanmış</Label>
                <Switch
                  id="published"
                  checked={formData.isPublished}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPublished: checked }))}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="featured">Öne Çıkan</Label>
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="locale">Dil</Label>
                <Select
                  value={formData.locale}
                  onValueChange={(value: Locale) => setFormData(prev => ({ ...prev, locale: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tr">Türkçe</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Proje Linkleri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="github">GitHub URL</Label>
                <Input
                  id="github"
                  value={formData.github}
                  onChange={(e) => setFormData(prev => ({ ...prev, github: e.target.value }))}
                  placeholder="https://github.com/username/repo"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="demo">Demo URL</Label>
                <Input
                  id="demo"
                  value={formData.demo}
                  onChange={(e) => setFormData(prev => ({ ...prev, demo: e.target.value }))}
                  placeholder="https://demo.example.com"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Etiketler</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Etiket ekle"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                />
                <Button onClick={addTag} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:text-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SEO</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="coverImage">Kapak Resmi URL</Label>
                <Input
                  id="coverImage"
                  value={formData.coverImage}
                  onChange={(e) => setFormData(prev => ({ ...prev, coverImage: e.target.value }))}
                  placeholder="/images/project-cover.jpg"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="metaDescription">Meta Açıklama</Label>
                <Textarea
                  id="metaDescription"
                  value={formData.metaDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                  placeholder="SEO için kısa açıklama"
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>Anahtar Kelimeler</Label>
                <div className="flex gap-2">
                  <Input
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    placeholder="Anahtar kelime ekle"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                  />
                  <Button onClick={addKeyword} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.keywords.map((keyword) => (
                    <Badge key={keyword} variant="outline" className="flex items-center gap-1">
                      {keyword}
                      <button
                        onClick={() => removeKeyword(keyword)}
                        className="ml-1 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 