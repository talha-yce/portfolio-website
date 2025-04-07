"use client"

import Link from "next/link"
import { Github, Linkedin, Mail } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"

export function SocialLinks() {
  const socialLinks = [
    {
      href: "https://github.com/talha-yce",
      icon: Github,
      label: "GitHub",
    },
    {
      href: "https://www.linkedin.com/in/talha-yüce/",
      icon: Linkedin,
      label: "LinkedIn",
    },
    {
      href: "mailto:yucetalha00@gmail.com",
      icon: Mail,
      label: "Email",
    },
  ]

  return (
    <div className="flex items-center gap-4">
      {socialLinks.map((link, index) => (
        <motion.div 
          key={link.label} 
          whileHover={{ 
            scale: 1.1,
            rotate: 5,
            transition: { duration: 0.2 }
          }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <Link href={link.href} target="_blank" rel="noopener noreferrer">
            <Button
              variant="ghost"
              size="icon"
              className="relative group text-muted-foreground hover:text-purple-400 transition-colors"
            >
              <motion.div
                className="absolute inset-0 rounded-full bg-purple-400/10 scale-0 group-hover:scale-100 transition-transform duration-300"
              />
              <link.icon className="h-5 w-5 relative z-10" />
              <span className="sr-only">{link.label}</span>
            </Button>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}

