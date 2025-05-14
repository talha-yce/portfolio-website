'use client'

import React from 'react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface PageProps {
  params: Promise<{
    locale: string
  }>
}

export default function AdminLogin({ params }: PageProps) {
  const { locale } = React.use(params)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [seedLoading, setSeedLoading] = useState(false)
  const [error, setError] = useState('')
  const [seedMessage, setSeedMessage] = useState('')
  const [isClient, setIsClient] = useState(false)
  const router = useRouter()
  
  // Prevent hydration mismatch by ensuring we're on the client
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Check for existing admin user in development mode
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && isClient) {
      const checkAdminUser = async () => {
        try {
          const baseUrl = window.location.origin;
          const response = await fetch(`${baseUrl}/api/admin/seed`, {
            method: 'GET',
          })
          
          const data = await response.json()
          
          if (data.success && data.exists) {
            setSeedMessage(`Test admin exists: ${data.user.email}`)
          } else {
            setSeedMessage('No test admin found. Click "Create Test Admin" to create one.')
          }
        } catch (error) {
          console.error('Error checking admin user:', error)
        }
      }
      
      checkAdminUser()
    }
  }, [isClient])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      console.log('Login: Attempting login with:', { email })
      
      // Use absolute URL to avoid locale-related issues
      const baseUrl = window.location.origin;
      const response = await fetch(`${baseUrl}/api/admin/authenticate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      })

      // Handle the response
      let data
      let text
      
      try {
        text = await response.text()
        console.log('Login: Server response text:', text)
        
        try {
          data = text ? JSON.parse(text) : {}
        } catch (parseError) {
          console.error('Login: JSON parse error:', parseError)
          throw new Error('Failed to parse server response')
        }
      } catch (responseError) {
        console.error('Login: Response handling error:', responseError)
        throw new Error('Failed to process server response')
      }

      if (!response.ok) {
        console.error('Login: Failed with status:', response.status)
        throw new Error(data.message || `Authentication failed (${response.status})`)
      }

      console.log('Login: Successful, redirecting to dashboard')
      
      // Create a delay before redirecting
      setTimeout(() => {
        console.log('Login: Executing delayed redirect...')
        // Use a form to submit to the dashboard route
        const form = document.createElement('form')
        form.method = 'GET'
        form.action = `/${locale}/admin/dashboard`
        document.body.appendChild(form)
        form.submit()
      }, 500) // Delay for 500ms to ensure cookie is set
    } catch (error: any) {
      console.error('Login: Error occurred:', error)
      setError(error.message || 'An error occurred during login')
    } finally {
      setLoading(false)
    }
  }
  
  const handleCreateTestAdmin = async () => {
    if (process.env.NODE_ENV !== 'development') return
    
    setSeedLoading(true)
    setSeedMessage('')
    
    try {
      const baseUrl = window.location.origin;
      const response = await fetch(`${baseUrl}/api/admin/seed`, {
        method: 'POST',
      })
      
      const data = await response.json()
      
      if (data.success) {
        setSeedMessage(`Test admin created: ${data.user.email} (Password: admin123456)`)
        // Prefill the form with the test credentials
        setEmail(data.user.email)
        setPassword('admin123456')
      } else {
        setSeedMessage(`Failed: ${data.message}`)
      }
    } catch (error: any) {
      console.error('Error creating test admin:', error)
      setSeedMessage('Failed to create test admin')
    } finally {
      setSeedLoading(false)
    }
  }

  // Only render content after client-side hydration
  if (!isClient) {
    return <div className="min-h-screen bg-gray-50 dark:bg-gray-900"></div>
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4" suppressHydrationWarning>
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md dark:bg-gray-800">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Admin Login
          </h2>
          {process.env.NODE_ENV === 'development' && (
            <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
              Development mode
            </p>
          )}
        </div>
        
        {error && (
          <div className="rounded-md bg-red-50 p-4 dark:bg-red-900/30">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800 dark:text-red-200">{error}</p>
              </div>
            </div>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="-space-y-px rounded-md shadow-sm">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="relative block w-full rounded-t-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 dark:bg-gray-700 dark:text-white dark:ring-gray-600 dark:placeholder:text-gray-400 sm:text-sm sm:leading-6"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="relative block w-full rounded-b-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 dark:bg-gray-700 dark:text-white dark:ring-gray-600 dark:placeholder:text-gray-400 sm:text-sm sm:leading-6"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
          
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4">
              {seedMessage && (
                <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">{seedMessage}</p>
              )}
              <button
                type="button"
                onClick={handleCreateTestAdmin}
                disabled={seedLoading}
                className="w-full rounded-md bg-gray-600 px-3 py-2 text-sm font-medium text-white hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {seedLoading ? 'Creating Test Admin...' : 'Create Test Admin'}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  )
} 