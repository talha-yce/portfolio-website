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
  imageSrc = '/profile-picture.jpg', // Default placeholder
  email = 'yucetalha00@gmail.com',
  github = 'https://github.com/talhayuce',
  linkedin = 'https://linkedin.com/in/talhayuce',
  skills = ['React', 'Next.js', 'TypeScript', 'Node.js', 'Tailwind']
}: ProfileCardProps) {
  return (
    <motion.div
      className="bg-white/80 backdrop-blur-sm rounded-2xl border border-primary-100 p-6 shadow-xl relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Gradient Background */}
      <div className="absolute top-0 right-0 w-full h-32 bg-gradient-to-br from-primary-400/20 to-accent-400/20 rounded-t-2xl -z-10" />
      
      <div className="flex flex-col items-center text-center">
        {/* Profile Picture */}
        <div className="relative w-24 h-24 mb-4 rounded-full overflow-hidden border-4 border-white shadow-md">
          <Image 
            src={imageSrc} 
            alt={name}
            fill
            className="object-cover"
          />
        </div>
        
        {/* Name & Title */}
        <h2 className="text-xl font-bold text-gray-800">{name}</h2>
        <p className="text-sm text-primary-600 mb-3">{title}</p>
        
        {/* Description */}
        {description && (
          <p className="text-sm text-gray-600 mb-4 max-w-xs">{description}</p>
        )}
        
        {/* Skills */}
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {skills.map((skill) => (
            <span 
              key={skill} 
              className="px-2 py-1 bg-primary-100/60 text-primary-800 text-xs rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>
        
        {/* Social Links */}
        <div className="flex gap-3 mb-4">
          <Link href={github} target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="icon" className="bg-white hover:bg-primary-100 text-gray-700 h-9 w-9 rounded-full">
              <Github className="h-4 w-4" />
              <span className="sr-only">GitHub</span>
            </Button>
          </Link>
          <Link href={linkedin} target="_blank" rel="noopener noreferrer">
            <Button variant="ghost" size="icon" className="bg-white hover:bg-primary-100 text-gray-700 h-9 w-9 rounded-full">
              <Linkedin className="h-4 w-4" />
              <span className="sr-only">LinkedIn</span>
            </Button>
          </Link>
          <Link href={`mailto:${email}`}>
            <Button variant="ghost" size="icon" className="bg-white hover:bg-primary-100 text-gray-700 h-9 w-9 rounded-full">
              <Mail className="h-4 w-4" />
              <span className="sr-only">Email</span>
            </Button>
          </Link>
        </div>
        
        {/* Areas */}
        <div className="grid grid-cols-3 gap-2 w-full">
          <div className="flex flex-col items-center p-2 bg-white rounded-lg">
            <Globe className="h-4 w-4 text-primary-600 mb-1" />
            <span className="text-xs text-gray-600">Web Dev</span>
          </div>
          <div className="flex flex-col items-center p-2 bg-white rounded-lg">
            <Terminal className="h-4 w-4 text-primary-600 mb-1" />
            <span className="text-xs text-gray-600">AI Apps</span>
          </div>
          <div className="flex flex-col items-center p-2 bg-white rounded-lg">
            <Cpu className="h-4 w-4 text-primary-600 mb-1" />
            <span className="text-xs text-gray-600">Game Dev</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
} 