'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface PageProps {
  params: Promise<{
    locale: string
  }>
}

interface Activity {
  id: number
  action: string
  time: string
  user: string
}

export default function ActivitiesPage({ params }: PageProps) {
  const { locale } = React.use(params)
  const router = useRouter()

  const [isClient, setIsClient] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activities, setActivities] = useState<Activity[]>([])
  const [error, setError] = useState('')
  
  // Prevent hydration mismatch
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  // Fetch activities from the API
  useEffect(() => {
    if (!isClient) return
    
    const fetchActivities = async () => {
      try {
        setLoading(true)
        
        // Verify authentication first
        const authResponse = await fetch('/api/admin/protected-route', {
          credentials: 'include',
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        })
        
        if (!authResponse.ok) {
          throw new Error('Authentication failed')
        }
        
        // Fetch all activities (using the same API as dashboard, but will fetch more)
        const baseUrl = window.location.origin
        const activitiesResponse = await fetch(`${baseUrl}/api/blog/activity?limit=20`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        })
        
        if (!activitiesResponse.ok) {
          throw new Error('Failed to fetch activities')
        }
        
        const data = await activitiesResponse.json()
        
        if (data.success && data.activities) {
          setActivities(data.activities)
        } else {
          // Fallback with sample data if API returns no activities
          setDefaultActivities()
        }
      } catch (error: any) {
        console.error('Error fetching activities:', error)
        setError(error.message || 'An error occurred')
        
        if (error.message === 'Authentication failed') {
          setTimeout(() => {
            router.push(`/${locale}/admin/login`)
          }, 2000)
        } else {
          // For other errors, show fallback data
          setDefaultActivities()
        }
      } finally {
        setLoading(false)
      }
    }
    
    fetchActivities()
  }, [locale, isClient, router])
  
  // Set default activities for fallback
  const setDefaultActivities = () => {
    setActivities([
      { id: 1, action: 'Yeni blog yazısı eklendi', time: '2 saat önce', user: 'admin' },
      { id: 2, action: 'Blog yazısı güncellendi', time: '3 saat önce', user: 'admin' },
      { id: 3, action: 'Kullanıcı profili güncellendi', time: '5 saat önce', user: 'admin' },
      { id: 4, action: 'Site ayarları değiştirildi', time: '1 gün önce', user: 'admin' },
      { id: 5, action: 'Yeni blog yazısı eklendi', time: '2 gün önce', user: 'admin' },
      { id: 6, action: 'Blog yazısı silindi', time: '3 gün önce', user: 'admin' },
      { id: 7, action: 'Yeni kullanıcı eklendi', time: '4 gün önce', user: 'admin' },
      { id: 8, action: 'Blog yazısı yayınlandı', time: '5 gün önce', user: 'admin' },
      { id: 9, action: 'Kullanıcı şifresi değiştirildi', time: '6 gün önce', user: 'admin' },
      { id: 10, action: 'Site bakımı yapıldı', time: '1 hafta önce', user: 'admin' }
    ])
  }
  
  // Back to dashboard function
  const goBack = () => {
    router.push(`/${locale}/admin/dashboard`)
  }
  
  // Loading state
  if (!isClient || loading) {
    return (
      <div className="p-4 md:p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Son Blog Yazıları</h1>
          <button 
            onClick={goBack}
            className="flex items-center rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            <span className="material-symbols-outlined mr-2">arrow_back</span>
            Geri Dön
          </button>
        </div>
        
        <div className="animate-pulse">
          {[1, 2, 3, 4, 5].map((_, index) => (
            <div key={index} className="mb-4 rounded-lg bg-white p-4 shadow dark:bg-gray-800">
              <div className="flex items-center space-x-4">
                <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 rounded bg-gray-200 dark:bg-gray-700"></div>
                  <div className="h-3 w-1/4 rounded bg-gray-200 dark:bg-gray-700"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
  
  // Error state
  if (error) {
    return (
      <div className="p-4 md:p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Son Blog Yazıları</h1>
          <button 
            onClick={goBack}
            className="flex items-center rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
          >
            <span className="material-symbols-outlined mr-2">arrow_back</span>
            Geri Dön
          </button>
        </div>
        
        <div className="rounded-lg bg-red-50 p-6 text-center dark:bg-red-900/30">
          <svg className="mx-auto h-12 w-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="mt-3 text-lg font-medium text-red-800 dark:text-red-200">Hata</h3>
          <p className="mt-2 text-red-700 dark:text-red-300">{error}</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="p-4 md:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Son Blog Yazıları</h1>
        <button 
          onClick={goBack}
          className="flex items-center rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        >
          <span className="material-symbols-outlined mr-2">arrow_back</span>
          Geri Dön
        </button>
      </div>
      
      <div className="rounded-lg bg-white shadow dark:bg-gray-800">
        <div className="p-6">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {activities.map((activity) => (
              <li key={activity.id} className="py-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white">
                      <span className="material-symbols-outlined text-sm">event_note</span>
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {activity.action}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {activity.user} - {activity.time}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          
          {activities.length === 0 && (
            <div className="py-12 text-center text-gray-500 dark:text-gray-400">
              <span className="material-symbols-outlined text-4xl mb-2">info</span>
              <p>Henüz aktivite bulunmamaktadır.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 