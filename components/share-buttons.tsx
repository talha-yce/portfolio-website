'use client'

import { Twitter, Facebook, Linkedin, Link as LinkIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface ShareButtonsProps {
  url: string
  title: string
}

export default function ShareButtons({ url, title }: ShareButtonsProps) {
  const encodedURL = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)
  
  const shareLinks = [
    {
      name: 'Twitter',
      icon: <Twitter className="h-4 w-4" />,
      url: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedURL}`,
    },
    {
      name: 'Facebook',
      icon: <Facebook className="h-4 w-4" />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedURL}`,
    },
    {
      name: 'LinkedIn',
      icon: <Linkedin className="h-4 w-4" />,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedURL}`,
    },
  ]
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(url)
      .then(() => {
        toast.success('URL copied to clipboard')
      })
      .catch(() => {
        toast.error('Failed to copy URL')
      })
  }
  
  return (
    <div className="flex flex-wrap gap-2">
      {shareLinks.map((link) => (
        <Button
          key={link.name}
          size="sm"
          variant="outline"
          className="gap-2"
          onClick={() => window.open(link.url, '_blank')}
        >
          {link.icon}
          <span className="sr-only">Share on {link.name}</span>
        </Button>
      ))}
      
      <Button
        size="sm"
        variant="outline"
        className="gap-2"
        onClick={copyToClipboard}
      >
        <LinkIcon className="h-4 w-4" />
        <span className="sr-only">Copy link</span>
      </Button>
    </div>
  )
} 