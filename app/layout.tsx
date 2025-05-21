import React from "react"
import type { Metadata } from "next"
import { siteConfig } from "@/config/site"
import Script from "next/script"

import "./globals.css"

export const metadata: Metadata = {
  title: "Talha Yüce | Software Engineer",
  description: "Software Engineer specializing in Web Development, Game Development, and AI Applications",
  keywords: [
    "Talha Yüce", "Yazılım", "Web Geliştirici", "Full Stack", "React", "Next.js", "TypeScript", "Portfolio", "Software Engineer"
  ],
  authors: [
    {
      name: "Talha Yüce",
      url: siteConfig.url,
    },
  ],
  creator: "Talha Yüce",
  metadataBase: new URL(siteConfig.url),
  icons: {
    icon: [
      { url: '/icon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/icon-16x16.png', type: 'image/png', sizes: '16x16' }
    ],
    shortcut: '/icon-32x32.png',
    apple: '/apple-touch-icon.png'
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    url: "https://www.talha-yuce.site/",
    title: "Talha Yüce | Software Engineer",
    description: "Software Engineer specializing in Web Development, Game Development, and AI Applications",
    siteName: "Talha Yüce Portfolio",
    locale: "tr_TR",
    images: [
      {
        url: "https://www.talha-yuce.site/api/og-image",
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "Talha Yüce Portfolio OG Görseli"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Talha Yüce | Software Engineer",
    description: "Software Engineer specializing in Web Development, Game Development, and AI Applications",
    images: ["https://www.talha-yuce.site/api/og-image"],
    site: "@talhayuce",
    creator: "@talhayuce"
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-snippet': -1,
      'max-image-preview': "large",
      'max-video-preview': -1,
    },
  },
  alternates: {
    canonical: "https://www.talha-yuce.site/",
    languages: {
      "tr-TR": "https://www.talha-yuce.site/",
      "en-US": "https://www.talha-yuce.site/en"
    }
  },
  generator: 'Next.js',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="preload" 
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          as="style"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
          media="print" 
        />
        <Script id="font-load">
          {`
            document.querySelector('link[rel="stylesheet"][media="print"]').media = 'all';
          `}
        </Script>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <title>Talha Yüce | Software Engineer</title>
        <meta property="og:title" content="Talha Yüce | Software Engineer" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.talha-yuce.site/" />
        <meta property="og:image" content="https://www.talha-yuce.site/api/og-image" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:alt" content="Talha Yüce Portfolio OG Görseli" />
        <meta property="og:description" content="Software Engineer specializing in Web Development, Game Development, and AI Applications" />
        <meta property="og:site_name" content="Talha Yüce Portfolio" />
        <meta property="og:locale" content="tr_TR" />
        <meta property="og:locale:alternate" content="en_US" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Talha Yüce | Software Engineer" />
        <meta name="twitter:description" content="Software Engineer specializing in Web Development, Game Development, and AI Applications" />
        <meta name="twitter:image" content="https://www.talha-yuce.site/api/og-image" />
        <meta name="twitter:site" content="@talhayuce" />
        <meta name="twitter:creator" content="@talhayuce" />
        <link rel="canonical" href="https://www.talha-yuce.site/" />
      </head>
      <body>
        <React.StrictMode>
          {children}
        </React.StrictMode>
      </body>
    </html>
  )
}
