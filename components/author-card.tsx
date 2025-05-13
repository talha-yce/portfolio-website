'use client'

import { User } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface AuthorCardProps {
  author: string
}

const authors = {
  'Admin': {
    name: 'Admin',
    bio: 'Site yöneticisi ve içerik editörü.',
    avatar: '/images/avatar-admin.jpg',
    social: {
      twitter: 'https://twitter.com/',
      github: 'https://github.com/',
      linkedin: 'https://linkedin.com/in/'
    }
  },
  // Diğer yazarlar burada eklenebilir
}

export default function AuthorCard({ author }: AuthorCardProps) {
  // Varsayılan yazar bilgisi
  const defaultAuthor = {
    name: author || 'Admin',
    bio: 'Blog yazarı',
    avatar: null,
    social: {}
  }
  
  // Kayıtlı yazarı bul veya varsayılanı kullan
  const authorInfo = authors[author as keyof typeof authors] || defaultAuthor
  
  return (
    <Card className="overflow-hidden bg-white border-border">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            {authorInfo.avatar ? (
              <img 
                src={authorInfo.avatar} 
                alt={authorInfo.name} 
                className="h-14 w-14 rounded-full object-cover border-2 border-primary-500"
              />
            ) : (
              <div className="h-14 w-14 rounded-full bg-primary-100 border-2 border-primary-500 flex items-center justify-center">
                <User className="h-6 w-6 text-primary-600" />
              </div>
            )}
          </div>
          <div>
            <h3 className="font-medium text-lg text-foreground">{authorInfo.name}</h3>
            <p className="text-muted-foreground text-sm mt-1">{authorInfo.bio}</p>
            
            {Object.keys(authorInfo.social).length > 0 && (
              <div className="flex gap-2 mt-3">
                {Object.entries(authorInfo.social).map(([platform, url]) => (
                  <a 
                    key={platform}
                    href={url as string} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-primary-600 hover:text-primary-800 underline"
                  >
                    {platform.charAt(0).toUpperCase() + platform.slice(1)}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 