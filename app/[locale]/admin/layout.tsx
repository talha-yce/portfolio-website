'use client'

import React, { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface AdminLayoutProps {
  children: React.ReactNode
  params: Promise<{
    locale: string
  }>
}

export default function AdminLayout({
  children,
  params,
}: AdminLayoutProps) {
  const { locale } = React.use(params)
  const router = useRouter()
  const pathname = usePathname()
  
  const [adminInfo, setAdminInfo] = useState<{ email: string; username: string } | null>(null)
  const [isClient, setIsClient] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  
  // Get the current active section from the URL
  const getActiveSection = () => {
    const path = pathname.split('/')
    // Get the section after /admin/ in the URL
    const section = path[path.indexOf('admin') + 1] || 'dashboard'
    return section
  }
  
  const activeSection = getActiveSection()
  
  // Navigation items with correct URLs
  const navItems = [
    { id: 'dashboard', label: 'Genel Bakış', icon: 'dashboard', url: `/${locale}/admin/dashboard` },
    { id: 'blog', label: 'Blog Yazıları', icon: 'description', url: `/${locale}/admin/blog` },
    { id: 'projects', label: 'Projeler', icon: 'work', url: `/${locale}/admin/projects` },
    { id: 'users', label: 'Kullanıcılar', icon: 'people', url: `/${locale}/admin/users` },
    { id: 'settings', label: 'Ayarlar', icon: 'settings', url: `/${locale}/admin/settings` }
  ]
  
  // Avoid hydration mismatch
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  // Admin authentication check
  useEffect(() => {
    // Skip auth check for login page
    if (pathname.includes('/admin/login')) {
      setLoading(false)
      return
    }
    
    if (!isClient) return
    
    const verifyAuth = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/admin/protected-route', {
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
        setAdminInfo(data.admin)
      } catch (error) {
        console.error('Layout auth error:', error)
        // Only redirect on auth error if not already on login page
        if (!pathname.includes('/admin/login')) {
          toast.error('Oturum süresi doldu. Lütfen tekrar giriş yapın.')
          router.push(`/${locale}/admin/login`)
        }
      } finally {
        setLoading(false)
      }
    }
    
    verifyAuth()
  }, [pathname, locale, isClient, router])
  
  // Logout function
  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'include'
      })
      
      // Force hard navigation to login page
      window.location.href = `/${locale}/admin/login`
    } catch (error) {
      console.error('Logout error:', error)
    }
  }
  
  // Navigation function
  const navigateTo = (url: string) => {
    setMobileMenuOpen(false)
    router.push(url)
  }
  
  // Skip layout for login page
  if (pathname.includes('/admin/login')) {
    return <>{children}</>
  }
  
  // Loading state
  if (loading || !isClient) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="h-16 w-16 animate-spin rounded-full border-t-4 border-blue-500 border-solid mx-auto"></div>
          <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">Yükleniyor...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex h-screen overflow-hidden">
        {/* Desktop Sidebar */}
        <div className="hidden md:flex md:flex-shrink-0">
          <div className="flex w-64 flex-col">
            <div className="flex flex-grow flex-col overflow-y-auto border-r border-gray-200 bg-white pt-5 dark:border-gray-700 dark:bg-gray-800">
              <div className="flex flex-shrink-0 items-center px-4">
                <h1 className="text-xl font-bold text-gray-800 dark:text-white">Admin Panel</h1>
              </div>
              <div className="mt-5 flex flex-grow flex-col">
                <nav className="flex-1 space-y-1 px-2 pb-4">
                  {navItems.map(item => (
                    <button
                      key={item.id}
                      onClick={() => navigateTo(item.url)}
                      className={`${
                        activeSection === item.id
                          ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-200'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm font-medium`}
                    >
                      <span className="material-symbols-outlined mr-3 h-6 w-6">{item.icon}</span>
                      {item.label}
                    </button>
                  ))}
                </nav>
              </div>
              {adminInfo && (
                <div className="flex flex-shrink-0 border-t border-gray-200 p-4 dark:border-gray-700">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white">
                        {adminInfo?.username?.[0].toUpperCase() || 'A'}
                      </span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {adminInfo?.username || 'Admin'}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {adminInfo?.email || 'admin@example.com'}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="ml-auto rounded-md p-1 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100"
                  >
                    <span className="material-symbols-outlined">logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Main Content Area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Mobile Header */}
          <div className="md:hidden bg-white shadow dark:bg-gray-800">
            <div className="px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <span className="material-symbols-outlined">{mobileMenuOpen ? 'close' : 'menu'}</span>
                </button>
                <h1 className="text-lg font-semibold text-gray-800 dark:text-white">Admin Panel</h1>
              </div>
              {adminInfo && (
                <button 
                  onClick={handleLogout}
                  className="rounded-md p-1 text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100"
                >
                  <span className="material-symbols-outlined">logout</span>
                </button>
              )}
            </div>
          </div>
          
          {/* Mobile Sidebar */}
          {mobileMenuOpen && (
            <div className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-50">
              <div className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-800 overflow-y-auto">
                <div className="flex items-center justify-between px-4 py-5">
                  <h1 className="text-xl font-bold text-gray-800 dark:text-white">Admin Panel</h1>
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>
                <nav className="mt-5 px-2 space-y-1">
                  {navItems.map(item => (
                    <button
                      key={item.id}
                      onClick={() => navigateTo(item.url)}
                      className={`${
                        activeSection === item.id
                          ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/50 dark:text-blue-200'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white'
                      } group flex w-full items-center rounded-md px-2 py-2 text-sm font-medium`}
                    >
                      <span className="material-symbols-outlined mr-3 h-6 w-6">{item.icon}</span>
                      {item.label}
                    </button>
                  ))}
                </nav>
                {adminInfo && (
                  <div className="absolute bottom-0 w-full flex flex-shrink-0 border-t border-gray-200 p-4 dark:border-gray-700">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white">
                          {adminInfo?.username?.[0].toUpperCase() || 'A'}
                        </span>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {adminInfo?.username || 'Admin'}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {adminInfo?.email || 'admin@example.com'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Page Content */}
          <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-900">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
} 