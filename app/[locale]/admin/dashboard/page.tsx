'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true)
  const [adminInfo, setAdminInfo] = useState<{ email: string; username: string } | null>(null)
  const [error, setError] = useState('')
  const router = useRouter()
  const params = useParams()
  const locale = params.locale as string

  useEffect(() => {
    // Verify the token validity by making a request to a protected endpoint
    const verifyAuth = async () => {
      try {
        const response = await fetch('/api/admin/protected-route', {
          credentials: 'include' // Cookie'leri dahil et
        })

        if (!response.ok) {
          throw new Error('Invalid or expired session')
        }

        const data = await response.json()
        setAdminInfo(data.admin)
      } catch (error: any) {
        setError(error.message || 'Authentication failed')
        // Redirect to login after a short delay
        setTimeout(() => {
          router.push(`/${locale}/admin/login`)
        }, 2000)
      } finally {
        setLoading(false)
      }
    }

    verifyAuth()
  }, [router, locale])

  const handleLogout = async () => {
    try {
      // Çıkış yapma API'sini çağır
      await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'include'
      })
      
      // Login sayfasına yönlendir
      router.push(`/${locale}/admin/login`)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-16 w-16 animate-spin rounded-full border-t-4 border-blue-500 border-solid mx-auto"></div>
          <p className="mt-4 text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="max-w-md rounded-lg bg-red-50 p-6 text-center dark:bg-red-900/30">
          <svg className="mx-auto h-12 w-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 className="mt-3 text-lg font-medium text-red-800 dark:text-red-200">Session Error</h3>
          <p className="mt-2 text-red-700 dark:text-red-300">{error}</p>
          <p className="mt-4 text-sm text-red-600 dark:text-red-400">Redirecting to login...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white shadow dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Logout
          </button>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="rounded-lg border-4 border-dashed border-gray-200 p-6 dark:border-gray-700">
              <h2 className="text-xl font-semibold mb-4 dark:text-white">Welcome, {adminInfo?.username}!</h2>
              <div className="bg-white p-4 rounded-md shadow dark:bg-gray-800">
                <h3 className="font-medium text-gray-900 dark:text-white">Admin Info</h3>
                <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  <p><strong>Email:</strong> {adminInfo?.email}</p>
                  <p><strong>Username:</strong> {adminInfo?.username}</p>
                </div>
              </div>
              
              {/* Add your admin dashboard components here */}
              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                        <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate dark:text-gray-400">Blog Posts</dt>
                          <dd className="text-lg font-medium text-gray-900 dark:text-white">Manage Posts</dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-5 py-3 dark:bg-gray-700">
                    <div className="text-sm">
                      <a href={`/${locale}/admin/blog`} className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
                        View all
                      </a>
                    </div>
                  </div>
                </div>

                <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                        <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate dark:text-gray-400">User Management</dt>
                          <dd className="text-lg font-medium text-gray-900 dark:text-white">Manage Users</dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-5 py-3 dark:bg-gray-700">
                    <div className="text-sm">
                      <a href={`/${locale}/admin/users`} className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
                        View all
                      </a>
                    </div>
                  </div>
                </div>
                
                <div className="overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                        <svg className="h-6 w-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate dark:text-gray-400">Settings</dt>
                          <dd className="text-lg font-medium text-gray-900 dark:text-white">Site Configuration</dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-5 py-3 dark:bg-gray-700">
                    <div className="text-sm">
                      <a href={`/${locale}/admin/settings`} className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
                        View all
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
} 