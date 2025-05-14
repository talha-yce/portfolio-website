'use client'

import React from 'react'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'

interface PageProps {
  params: Promise<{
    locale: string
  }>
}

export default function SettingsPage({ params }: PageProps) {
  const { locale } = React.use(params)
  const router = useRouter()
  
  const [isClient, setIsClient] = useState(false)
  const [loading, setLoading] = useState(true)
  const [adminProfile, setAdminProfile] = useState<{
    email: string;
    username: string;
  } | null>(null)
  
  // Prevent hydration mismatch
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  // Fetch admin profile
  useEffect(() => {
    if (!isClient) return
    
    const fetchAdminProfile = async () => {
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
          throw new Error('Authentication failed')
        }
        
        const data = await response.json()
        setAdminProfile(data.admin)
      } catch (error) {
        console.error('Error fetching admin profile:', error)
        setTimeout(() => {
          router.push(`/${locale}/admin/login`)
        }, 2000)
      } finally {
        setLoading(false)
      }
    }
    
    fetchAdminProfile()
  }, [isClient, locale, router])
  
  // Handle password change
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const formData = new FormData(e.target as HTMLFormElement)
    const currentPassword = formData.get('currentPassword') as string
    const newPassword = formData.get('newPassword') as string
    const confirmPassword = formData.get('confirmPassword') as string
    
    // Validate password
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match')
      return
    }
    
    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters long')
      return
    }
    
    try {
      // Call API to change password
      const response = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ currentPassword, newPassword }),
        credentials: 'include'
      })
      
      const data = await response.json()
      
      if (response.ok && data.success) {
        toast.success('Password changed successfully')
        // Clear form
        const form = e.target as HTMLFormElement
        form.reset()
      } else {
        toast.error(data.message || 'Failed to change password')
      }
    } catch (error) {
      console.error('Error changing password:', error)
      toast.error('Failed to change password')
    }
  }
  
  // Handle profile update
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const formData = new FormData(e.target as HTMLFormElement)
    const username = formData.get('username') as string
    const email = formData.get('email') as string
    
    try {
      // Call API to update profile
      const response = await fetch('/api/admin/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, email }),
        credentials: 'include'
      })
      
      const data = await response.json()
      
      if (response.ok && data.success) {
        toast.success('Profile updated successfully')
        
        // Update local state
        setAdminProfile(prev => prev ? {
          ...prev,
          username,
          email
        } : null)
      } else {
        toast.error(data.message || 'Failed to update profile')
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    }
  }
  
  // Loading state
  if (loading || !isClient) {
    return (
      <div className="container py-10">
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
              <Skeleton className="h-52 w-full" />
              <Skeleton className="h-52 w-full" />
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="container py-10">
      <h1 className="text-3xl font-bold mb-6">Ayarlar</h1>
      
      <Tabs defaultValue="profile">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="password">Şifre</TabsTrigger>
        </TabsList>
        
        {/* Profile Tab */}
        <TabsContent value="profile">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Profil Bilgileri</CardTitle>
                <CardDescription>
                  Hesap bilgilerinizi güncelleyin
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Kullanıcı Adı</Label>
                    <Input 
                      id="username"
                      name="username"
                      defaultValue={adminProfile?.username || ''}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">E-posta</Label>
                    <Input 
                      id="email"
                      name="email"
                      type="email"
                      defaultValue={adminProfile?.email || ''}
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">Profili Güncelle</Button>
                </form>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Hesap Ayarları</CardTitle>
                <CardDescription>
                  Admin panel tercihlerinizi yönetin
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="session" defaultChecked />
                  <Label htmlFor="session">Aktif oturumları cihaz değiştiğinde sonlandır</Label>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">Ayarları Kaydet</Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        {/* Password Tab */}
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Şifre Değiştir</CardTitle>
              <CardDescription>
                Güvenliğiniz için şifrenizi düzenli olarak değiştirin
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Mevcut Şifre</Label>
                  <Input 
                    id="currentPassword"
                    name="currentPassword"
                    type="password"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Yeni Şifre</Label>
                  <Input 
                    id="newPassword"
                    name="newPassword"
                    type="password"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Yeni Şifre (Tekrar)</Label>
                  <Input 
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                  />
                </div>
                
                <Button type="submit" className="w-full">Şifreyi Değiştir</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 