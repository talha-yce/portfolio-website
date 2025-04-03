import type React from "react"
import type { Metadata } from "next"
import { Space_Grotesk } from "next/font/google"
import { siteConfig } from "@/config/site"

import "./globals.css"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "Software Engineer",
    "Web Developer",
    "Full Stack Developer",
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
  ],
  authors: [
    {
      name: "Talha Yüce",
      url: "https://talha-yuce.site",
    },
  ],
  creator: "Talha Yüce",
  icons: {
    icon: [
      {
        url: "/favicon.ico",
        sizes: "32x32",
      },
      {
        url: "/icon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
      {
        url: "/icon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
    ],
    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    other: [
      {
        rel: "icon",
        url: "/favicon.ico",
      },
    ],
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://talha-yuce.vercel.app",
    title: "Talha Yüce | Software Engineer",
    description: "Software Engineer specializing in Web Development, Game Development, and AI Applications",
    siteName: "Talha Yüce Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Talha Yüce | Software Engineer",
    description: "Software Engineer specializing in Web Development, Game Development, and AI Applications",
  },
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {  return children
}

import './globals.css'
