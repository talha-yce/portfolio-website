'use client'

import React from 'react'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'
import { Check, Mail, User, UserPlus, Key, AlertCircle } from 'lucide-react'

interface Admin {
  _id: string
  email: string
  username: string
  createdAt?: string
}

interface PageProps {
  params: Promise<{
    locale: string
  }>
}

export default function UsersPage({ params }: PageProps) {
  const { locale } = React.use(params)
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [admins, setAdmins] = useState<Admin[]>([])
  const [error, setError] = useState<string | null>(null)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  
  // Fetch admins on component mount
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Normalde API noktanızdan veri çekmeniz gerekir
        // Bu örnekte verileri simüle ediyoruz
        // Gerçek uygulamada:
        // const response = await fetch('/api/admin/users');
        // const data = await response.json();
        
        // Simüle edilmiş veri
        // Mevcut giriş yapmış admin kullanıcısını gösteriyoruz
        const response = await fetch('/api/admin/protected-route', {
          credentials: 'include',
          cache: 'no-store'
        })
        
        if (!response.ok) {
          throw new Error('Failed to fetch admin profile')
        }
        
        const data = await response.json()
        
        // Varolan admin + örnek adminler
        setAdmins([
          {
            _id: '1',
            email: data.admin.email,
            username: data.admin.username,
            createdAt: new Date().toISOString()
          }
        ])
      } catch (error) {
        console.error('Error fetching admins:', error)
        setError(error instanceof Error ? error.message : 'Failed to fetch admins')
      } finally {
        setLoading(false)
      }
    }
    
    fetchAdmins()
  }, [])
  
  // Handle create admin
  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const formData = new FormData(e.target as HTMLFormElement)
    const email = formData.get('email') as string
    const username = formData.get('username') as string
    const password = formData.get('password') as string
    
    // Simple validations
    if (!email || !username || !password) {
      toast.error('Tüm alanları doldurun')
      return
    }
    
    if (password.length < 8) {
      toast.error('Şifre en az 8 karakter olmalıdır')
      return
    }
    
    try {
      // Placeholder for actual API call
      // const response = await fetch('/api/admin/users', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, username, password })
      // });
      
      // if (!response.ok) throw new Error('Failed to create admin');
      
      // Simüle edilmiş başarılı yanıt
      const newAdmin = {
        _id: (admins.length + 1).toString(),
        email,
        username,
        createdAt: new Date().toISOString()
      }
      
      setAdmins([...admins, newAdmin])
      toast.success('Admin kullanıcısı başarıyla oluşturuldu')
      setIsCreateDialogOpen(false)
      
      // Form temizleme
      const form = e.target as HTMLFormElement
      form.reset()
    } catch (error) {
      console.error('Error creating admin:', error)
      toast.error('Admin kullanıcısı oluşturulamadı')
    }
  }
  
  if (loading) {
    return (
      <div className="container py-10">
        <div className="flex justify-between items-center mb-8">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        
        <div className="space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    )
  }
  
  if (error) {
    return (
      <div className="container py-10">
        <div className="bg-red-50 dark:bg-red-900/30 p-4 rounded-md flex items-start">
          <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 mr-3" />
          <div>
            <h3 className="text-red-800 dark:text-red-300 font-medium">Hata Oluştu</h3>
            <p className="text-red-700 dark:text-red-400 text-sm">{error}</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={() => window.location.reload()}
            >
              Tekrar Dene
            </Button>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="container py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Kullanıcı Yönetimi</h1>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Yeni Admin Ekle
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Yeni Admin Kullanıcısı Ekle</DialogTitle>
              <DialogDescription>
                Yeni bir admin kullanıcısı oluşturmak için aşağıdaki formu doldurun.
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleCreateAdmin} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-posta</Label>
                <div className="flex">
                  <Mail className="h-4 w-4 text-gray-500 mr-2 mt-2.5" />
                  <Input id="email" name="email" type="email" required placeholder="ornek@domain.com" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="username">Kullanıcı Adı</Label>
                <div className="flex">
                  <User className="h-4 w-4 text-gray-500 mr-2 mt-2.5" />
                  <Input id="username" name="username" required placeholder="kullanici_adi" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Şifre</Label>
                <div className="flex">
                  <Key className="h-4 w-4 text-gray-500 mr-2 mt-2.5" />
                  <Input id="password" name="password" type="password" required placeholder="********" />
                </div>
              </div>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  İptal
                </Button>
                <Button type="submit">
                  <Check className="h-4 w-4 mr-2" />
                  Oluştur
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      
      <Tabs defaultValue="all">
        <TabsList className="mb-6">
          <TabsTrigger value="all">Tüm Kullanıcılar</TabsTrigger>
          <TabsTrigger value="active">Aktif</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <div className="space-y-4">
            {admins.length === 0 ? (
              <p className="text-center text-gray-500 py-10">Henüz admin kullanıcısı bulunmuyor.</p>
            ) : (
              <div className="rounded-md border">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Kullanıcı
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        E-posta
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Durum
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        İşlemler
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {admins.map((admin) => (
                      <tr key={admin._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                              {admin.username.charAt(0).toUpperCase()}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {admin.username}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {admin.createdAt ? new Date(admin.createdAt).toLocaleDateString() : ''}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">{admin.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                            Aktif
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Button variant="ghost" size="sm" className="text-blue-600 dark:text-blue-400 hover:text-blue-800">
                            Düzenle
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600 dark:text-red-400 hover:text-red-800">
                            Sil
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="active">
          <div className="space-y-4">
            {admins.length === 0 ? (
              <p className="text-center text-gray-500 py-10">Henüz aktif admin kullanıcısı bulunmuyor.</p>
            ) : (
              <div className="rounded-md border">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Kullanıcı
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        E-posta
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Durum
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        İşlemler
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                    {admins.map((admin) => (
                      <tr key={admin._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300">
                              {admin.username.charAt(0).toUpperCase()}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {admin.username}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {admin.createdAt ? new Date(admin.createdAt).toLocaleDateString() : ''}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">{admin.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                            Aktif
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Button variant="ghost" size="sm" className="text-blue-600 dark:text-blue-400 hover:text-blue-800">
                            Düzenle
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600 dark:text-red-400 hover:text-red-800">
                            Sil
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 