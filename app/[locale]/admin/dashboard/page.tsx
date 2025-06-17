'use client'

import React from 'react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Plus, Briefcase, BookOpen, User, CheckCircle, Edit } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { motion } from 'framer-motion'

interface PageProps {
  params: Promise<{
    locale: string
  }>
}

export default function AdminDashboard({ params }: PageProps) {
  const { locale } = React.use(params)
  const [loading, setLoading] = useState(true)
  const [isClient, setIsClient] = useState(false)
  const [adminInfo, setAdminInfo] = useState<{ email: string; username: string } | null>(null)
  const [error, setError] = useState('')
  const [stats, setStats] = useState({
    posts: 0,
    trPosts: 0,
    enPosts: 0,
    projects: 0,
  })
  const [recentActivities, setRecentActivities] = useState<any[]>([])
  const [isLoadingStats, setIsLoadingStats] = useState(true)
  const [activeSection, setActiveSection] = useState('overview')
  const [profiles, setProfiles] = useState<any[]>([])
  const [recentProjects, setRecentProjects] = useState<any[]>([])
  const [recentPosts, setRecentPosts] = useState<any[]>([])
  
  const router = useRouter()

  // Logout fonksiyonu
  const handleLogout = async () => {
    try {
      console.log('Dashboard: Logging out...')
      // Call logout API
      await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'include'
      })
      
      console.log('Dashboard: Redirecting to login page after logout...')
      // Force hard navigation to login page
      window.location.href = `/${locale}/admin/login`
    } catch (error) {
      console.error('Dashboard: Logout error:', error)
    }
  }

  // Prevent hydration mismatch
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Fetch admin data and stats from database
  useEffect(() => {
    if (!isClient) return
    
    // Yetkilendirme kontrolü
    const verifyAuth = async () => {
      try {
        console.log('Dashboard: Checking authentication status...')
        const baseUrl = window.location.origin
        const response = await fetch(`${baseUrl}/api/admin/protected-route`, {
          credentials: 'include',
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        })

        if (!response.ok) {
          throw new Error('Invalid or expired session')
        }

        const data = await response.json()
        console.log('Dashboard: Authentication successful:', data)
        setAdminInfo(data.admin)
        
        // Fetch all data concurrently
        await Promise.all([
          fetchStats(),
          fetchRecentActivities(),
          fetchProfiles(),
          fetchRecentContent()
        ]);

      } catch (error: any) {
        console.error('Dashboard: Authentication error:', error)
        setError(error.message || 'Authentication failed')
        
        // Hata durumunda giriş sayfasına yönlendir
        setTimeout(() => {
          window.location.href = `/${locale}/admin/login`
        }, 2000)
      } finally {
        setLoading(false)
      }
    }

    verifyAuth()
  }, [locale, isClient])

  // Veritabanından istatistikleri getiren fonksiyon
  const fetchStats = async () => {
    setIsLoadingStats(true)
    try {
      const baseUrl = window.location.origin
      
      const countResponse = await fetch(`${baseUrl}/api/blog/count`, { cache: 'no-store' })
      const trCountResponse = await fetch(`${baseUrl}/api/blog/count?locale=tr`, { cache: 'no-store' })
      const enCountResponse = await fetch(`${baseUrl}/api/blog/count?locale=en`, { cache: 'no-store' })
      const projectsCountResponse = await fetch(`${baseUrl}/api/projects/count`, { cache: 'no-store' })

      const totalData = countResponse.ok ? await countResponse.json() : { count: 0 }
      const trData = trCountResponse.ok ? await trCountResponse.json() : { count: 0 }
      const enData = enCountResponse.ok ? await enCountResponse.json() : { count: 0 }
      const projectsData = projectsCountResponse.ok ? await projectsCountResponse.json() : { count: 0 }

      setStats({
        posts: totalData.count,
        trPosts: trData.count,
        enPosts: enData.count,
        projects: projectsData.count,
      })
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setIsLoadingStats(false)
    }
  }

  const fetchProfiles = async () => {
    try {
      const baseUrl = window.location.origin
      const response = await fetch(`${baseUrl}/api/admin/profile`, { cache: 'no-store' })
      if (response.ok) {
        const data = await response.json()
        setProfiles(data)
      }
    } catch (error) {
      console.error('Error fetching profiles:', error)
    }
  }

  // Son aktiviteleri getiren fonksiyon
  const fetchRecentActivities = async () => {
    try {
      // Gerçek API çağrısı
      const baseUrl = window.location.origin
      const response = await fetch(`${baseUrl}/api/blog/activity`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.activities && data.activities.length > 0) {
          setRecentActivities(data.activities)
        } else {
          // Fallback to default activities if API returns empty data
          setDefaultActivities()
        }
      } else {
        // API call failed, use default activities
        setDefaultActivities()
      }
    } catch (error) {
      console.error('Error fetching activities:', error)
      // Fallback to default activities on error
      setDefaultActivities()
    }
  }
  
  // Set default activities for fallback
  const setDefaultActivities = () => {
    setRecentActivities([
      { id: 1, action: 'Yeni blog yazısı eklendi', time: '2 saat önce', user: 'admin' },
      { id: 2, action: 'Blog yazısı güncellendi', time: '3 saat önce', user: 'admin' },
      { id: 3, action: 'Kullanıcı profili güncellendi', time: '5 saat önce', user: 'admin' },
      { id: 4, action: 'Site ayarları değiştirildi', time: '1 gün önce', user: 'admin' },
      { id: 5, action: 'Yeni blog yazısı eklendi', time: '2 gün önce', user: 'admin' }
    ])
  }

  const fetchRecentContent = async () => {
    try {
      const baseUrl = window.location.origin;
      // Fetch recent projects
      const projectsResponse = await fetch(`${baseUrl}/api/projects?limit=5`, { cache: 'no-store' });
      if (projectsResponse.ok) {
        const projects = await projectsResponse.json();
        setRecentProjects(projects.data || []);
      }

      // Fetch recent blog posts
      const postsResponse = await fetch(`${baseUrl}/api/blog/all?limit=5`, { cache: 'no-store' });
      if (postsResponse.ok) {
        const posts = await postsResponse.json();
        setRecentPosts(posts.posts || []);
      }
    } catch (error) {
      console.error('Error fetching recent content:', error);
    }
  }

  // Navigation items with correct URLs
  const navItems = [
    { id: 'overview', label: 'Genel Bakış', icon: 'dashboard', url: `/${locale}/admin/dashboard` },
    { id: 'blog', label: 'Blog Yazıları', icon: 'description', url: `/${locale}/admin/blog` },
    { id: 'users', label: 'Kullanıcılar', icon: 'people', url: `/${locale}/admin/users` },
    { id: 'settings', label: 'Ayarlar', icon: 'settings', url: `/${locale}/admin/settings` }
  ]

  // Yönlendirme işlevi
  const navigateTo = (url: string) => {
    router.push(url)
  }

  const getProfileCompleteness = (profile: any) => {
    if (!profile) return 0;
    const fields = [
      'name', 'title', 'email', 'phone', 'location', 'bio', 'github', 'linkedin', 'profileImage'
    ];
    const filledFields = fields.filter(field => profile[field]);
    const arrayFields = ['languages', 'education', 'experience', 'skills', 'certifications'];
    const filledArrayFields = arrayFields.filter(field => profile[field] && profile[field].length > 0);
    
    const totalFields = fields.length + arrayFields.length;
    const totalFilledFields = filledFields.length + filledArrayFields.length;
    
    return Math.round((totalFilledFields / totalFields) * 100);
  };

  const enProfile = profiles.find(p => p.locale === 'en');
  const trProfile = profiles.find(p => p.locale === 'tr');
  
  const chartData = [
    { name: 'İçerikler', projects: stats.projects, trBlogs: stats.trPosts, enBlogs: stats.enPosts },
  ];

  // State Loaders
  if (!isClient || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900" suppressHydrationWarning>
        <div className="text-center">
          <div className="h-16 w-16 animate-spin rounded-full border-t-4 border-blue-500 border-solid mx-auto"></div>
          <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900" suppressHydrationWarning>
        <div className="max-w-md rounded-lg bg-red-50 p-6 text-center dark:bg-red-900/30">
          <svg className="mx-auto h-12 w-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="mt-3 text-lg font-medium text-red-800 dark:text-red-200">Oturum Hatası</h3>
          <p className="mt-2 text-red-700 dark:text-red-300">{error}</p>
          <p className="mt-4 text-sm text-red-600 dark:text-red-400">Giriş sayfasına yönlendiriliyorsunuz...</p>
        </div>
      </div>
    )
  }
  
  // Return content 
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900" suppressHydrationWarning>
      <motion.div 
        className="flex-1 p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Genel Bakış</h1>
          <p className="text-gray-500 dark:text-gray-400">Hoş geldiniz, {adminInfo?.username || 'Admin'}!</p>
        </header>

        {/* Hızlı Erişim Butonları */}
        <motion.div 
          className="mb-8 flex space-x-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Button onClick={() => router.push(`/${locale}/admin/projects/editor`)}>
            <Plus className="mr-2 h-4 w-4" /> Yeni Proje Ekle
          </Button>
          <Button onClick={() => router.push(`/${locale}/admin/blog/editor`)}>
            <Plus className="mr-2 h-4 w-4" /> Yeni Blog Yazısı Ekle
          </Button>
          <Button variant="outline" onClick={() => router.push(`/${locale}/admin/profile/editor`)}>
            <Edit className="mr-2 h-4 w-4" /> Profilleri Düzenle
          </Button>
        </motion.div>

        {/* İstatistikler */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {[
            { title: 'Toplam Proje', value: stats.projects, icon: Briefcase, description: 'Yönetilen proje sayısı', delay: 0.2 },
            { title: 'Toplam Blog Yazısı', value: stats.posts, icon: BookOpen, description: `TR: ${stats.trPosts}, EN: ${stats.enPosts}`, delay: 0.3 },
            { title: 'İngilizce Profil', value: `${getProfileCompleteness(enProfile)}%`, icon: User, description: 'Profil doluluk oranı', delay: 0.4 },
            { title: 'Türkçe Profil', value: `${getProfileCompleteness(trProfile)}%`, icon: User, description: 'Profil doluluk oranı', delay: 0.5 }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: item.delay }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                  <item.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{isLoadingStats ? '...' : item.value}</div>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Son Blog Yazıları */}
        <Card>
          <CardHeader>
            <CardTitle>Son Blog Yazıları</CardTitle>
            <CardDescription>Sistemde gerçekleşen en son eylemler.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-center">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                    <CheckCircle className="h-4 w-4 text-primary" />
                  </div>
                  <div className="ml-4 flex-1">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{activity.action}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                  </div>
                  <Badge variant="outline">{activity.user}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* Content Chart */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>İçerik Dağılımı</CardTitle>
                <CardDescription>Toplam proje ve blog yazılarınızın dağılımı.</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--background))', color: 'hsl(var(--foreground))' }} />
                    <Legend />
                    <Bar dataKey="projects" fill="#8884d8" name="Projeler" />
                    <Bar dataKey="trBlogs" fill="#82ca9d" name="TR Bloglar" />
                    <Bar dataKey="enBlogs" fill="#ffc658" name="EN Bloglar" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Projects */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Son Projeler</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentProjects.length > 0 ? recentProjects.map((project) => (
                  <div key={project.slug} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{project.title}</p>
                      <p className="text-sm text-muted-foreground">{new Date(project.date).toLocaleDateString()}</p>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => router.push(`/${locale}/admin/projects/editor/${project.slug}`)}>
                      Yönet
                    </Button>
                  </div>
                )) : <p className="text-sm text-muted-foreground">Henüz proje eklenmemiş.</p>}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
} 