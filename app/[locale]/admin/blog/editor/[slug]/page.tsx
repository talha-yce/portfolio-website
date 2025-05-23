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
        // URL normalization and encoding for slug
        // Türkçe karakterler için ek güvenlik kontrolü
        const normalizedSlug = decodeURIComponent(params.slug)
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, ''); // Accent işaretlerini kaldır
        
        const encodedSlug = encodeURIComponent(normalizedSlug);

        // Üç farklı API endpoint'ini de deneyelim
        // 1. Normal API endpoint (servis tabanlı)
        // 2. Özel single endpoint
        // 3. Tam içerik getiren yeni endpoint
        const useGetFullContentApi = true; // Bu yeni API'yi kullan
        let apiUrl = `/api/blog?slug=${encodedSlug}&locale=${params.locale}`;
        
        if (useGetFullContentApi) {
          apiUrl = `/api/blog/get-full-content?slug=${encodedSlug}&locale=${params.locale}`;
          console.log('Using full content API endpoint');
        }
        
        console.log('Fetching blog post with parameters:', { 
          originalSlug: params.slug,
          normalizedSlug,
          encodedSlug,
          locale: params.locale,
          url: apiUrl,
          usingFullContentApi: useGetFullContentApi
        });
        
        // API çağrısı
        const res = await fetch(apiUrl, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        
        if (!res.ok) {
          console.error('API response error:', {
            status: res.status,
            statusText: res.statusText
          });
          const errorText = await res.text();
          console.error('Error response body:', errorText);
          throw new Error(`Failed to fetch blog post: ${res.status} ${res.statusText}`);
        }
        
        const data = await res.json();
        console.log('Fetched blog post data:', data);
        
        // İçerik dizisini daha detaylı logla - tüm öğeleri göster
        if (Array.isArray(data.content)) {
          console.log(`FULL CONTENT ARRAY (${data.content.length} items):`);
          data.content.forEach((item: any, idx: number) => {
            console.log(`Item ${idx}:`, JSON.stringify(item));
          });
        }
        
        // Manuel olarak content öğelerini çıkartalım ve doğrulayalım
        const extractedContent = Array.isArray(data.content) 
          ? [...data.content] 
          : [];
        
        // Durumu logla
        console.log('Manual content extraction:', {
          originalContentCount: Array.isArray(data.content) ? data.content.length : 0,
          extractedContentCount: extractedContent.length,
          extractedContent: extractedContent.map((item, i) => ({ 
            index: i, 
            type: item.type, 
            orderValue: item.order
          }))
        });
        
        // Veriyi güvenli şekilde kopyala - özellikle content dizisini
        const processedData = {
          ...data,
          // JSON.parse(JSON.stringify()) ile derin kopya oluştur
          content: extractedContent.length > 0 
            ? JSON.parse(JSON.stringify(extractedContent)) 
            : [{type: 'text', content: '', order: 0}]
        };
        
        console.log('Processed data ready:', {
          id: processedData._id,
          contentLength: processedData.content.length
        });
        
        setPost(processedData);
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