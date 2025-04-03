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
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-48x48.png", sizes: "48x48", type: "image/png" },
      { url: "/icon-64x64.png", sizes: "64x64", type: "image/png" },
      { url: "/icon-96x96.png", sizes: "96x96", type: "image/png" },
      { url: "/icon-128x128.png", sizes: "128x128", type: "image/png" },
      { url: "/icon-256x256.png", sizes: "256x256", type: "image/png" },
      { url: "/icon-384x384.png", sizes: "384x384", type: "image/png" },
      { url: "/icon-512x512.png", sizes: "512x512", type: "image/png" }
    ],
    shortcut: "/icon-96x96.png",
    apple: "/apple-touch-icon.png",
  },
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={spaceGrotesk.className}>{children}</body>
    </html>
  )
}