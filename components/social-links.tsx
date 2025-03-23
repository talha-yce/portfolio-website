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
    <div className="flex items-center gap-2">
      {socialLinks.map((link, index) => (
        <motion.div key={link.label} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <Link href={link.href} target="_blank" rel="noopener noreferrer">
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-purple-400 transition-colors"
            >
              <link.icon className="h-5 w-5" />
              <span className="sr-only">{link.label}</span>
            </Button>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}

