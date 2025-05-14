'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Github, Linkedin, Mail, Terminal, Code, Cpu, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface ProfileCardProps {
  name: string
  title: string
  description?: string
  imageSrc?: string
  email?: string
  github?: string
  linkedin?: string
  skills?: string[]
}

export default function ProfileCard({
  name,
  title,
  description,
  imageSrc = '/data/images/profile/talha-yuce.jpg', // Public öneki kaldırıldı
  email = 'yucetalha00@gmail.com',
  github = 'https://github.com/talhayuce',
  linkedin = 'https://linkedin.com/in/talhayuce',
  skills = ['React', 'Next.js', 'TypeScript', 'Node.js', 'Tailwind']
}: ProfileCardProps) {
  return (
    <motion.div
      className="bg-white/90 backdrop-blur-sm rounded-2xl border border-primary-100 p-6 shadow-xl w-full max-w-md overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Light gradient background */}
      <div className="absolute top-0 right-0 left-0 h-24 bg-gradient-to-br from-primary-100/50 to-accent-100/50 rounded-t-2xl -z-10" />
      
      <div className="flex flex-col items-center text-center">
        {/* Profile Picture with gradient border */}
        <div className="relative mb-5">
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-300 to-accent-300 p-[3px] blur-[2px]"></div>
          <div className="relative h-28 w-28 rounded-full overflow-hidden border-4 border-white shadow-md">
            <Image 
              src={imageSrc} 
              alt={name}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
        
        {/* Name & Title */}
        <h2 className="text-2xl font-bold text-gray-800 mb-1">{name}</h2>
        <p className="text-primary-600 font-medium mb-3">{title}</p>
        
        {/* Description */}
        {description && (
          <p className="text-gray-600 mb-4 max-w-xs">{description}</p>
        )}
        
        {/* Skills */}
        <div className="flex flex-wrap justify-center gap-2 mb-5 px-2">
          {skills.map((skill) => (
            <span 
              key={skill} 
              className="px-3 py-1 bg-primary-100/80 text-primary-800 text-xs font-medium rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>
        
        {/* Social Links */}
        <div className="flex gap-4 mb-6">
          <Link href={github} target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="icon" className="bg-white hover:bg-primary-100 text-gray-700 h-10 w-10 rounded-full shadow-sm">
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </Button>
          </Link>
          <Link href={linkedin} target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="icon" className="bg-white hover:bg-primary-100 text-gray-700 h-10 w-10 rounded-full shadow-sm">
              <Linkedin className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span>
            </Button>
          </Link>
          <Link href={`mailto:${email}`}>
            <Button variant="ghost" size="icon" className="bg-white hover:bg-primary-100 text-gray-700 h-10 w-10 rounded-full shadow-sm">
              <Mail className="h-5 w-5" />
              <span className="sr-only">Email</span>
            </Button>
          </Link>
        </div>
        
        {/* Areas */}
        <div className="grid grid-cols-3 gap-3 w-full">
          <div className="flex flex-col items-center p-3 bg-white rounded-lg shadow-sm">
            <Globe className="h-5 w-5 text-primary-600 mb-2" />
            <span className="text-xs text-gray-700 font-medium">Web Dev</span>
          </div>
          <div className="flex flex-col items-center p-3 bg-white rounded-lg shadow-sm">
            <Code className="h-5 w-5 text-primary-600 mb-2" />
            <span className="text-xs text-gray-700 font-medium">AI Apps</span>
          </div>
          <div className="flex flex-col items-center p-3 bg-white rounded-lg shadow-sm">
            <Cpu className="h-5 w-5 text-primary-600 mb-2" />
            <span className="text-xs text-gray-700 font-medium">Game Dev</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
} 