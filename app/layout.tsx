import type React from "react"
import type { Metadata } from "next"
import { Space_Grotesk } from "next/font/google"

import "./globals.css"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: {
    default: "Talha Yüce | Software Engineer",
    template: "%s | Talha Yüce",
  },
  description: "Software Engineer specializing in Web Development, Game Development, and AI Applications",
  keywords: ["Software Engineer", "Web Development", "Game Development", "Unity", "AI", "React", "Next.js"],
  authors: [{ name: "Talha Yüce" }],
  creator: "Talha Yüce",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://talha-portfolio.vercel.app",
    title: "Talha Yüce | Software Engineer",
    description: "Software Engineer specializing in Web Development, Game Development, and AI Applications",
    siteName: "Talha Yüce Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Talha Yüce | Software Engineer",
    description: "Software Engineer specializing in Web Development, Game Development, and AI Applications",
  },
  icons: {
    icon: "/favicon.ico",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}



import './globals.css'