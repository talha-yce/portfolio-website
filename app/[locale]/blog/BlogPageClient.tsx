"use client"

import { motion } from "framer-motion"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"
import { useState, useEffect } from "react"

import { BlogCard } from "@/components/blog-card"
import { PageTransition } from "@/components/page-transition"
import { type Locale } from "@/lib/i18n/config"
import type { Dictionary } from "@/lib/i18n/dictionaries"
import { BlogPost } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface BlogPageClientProps {
  locale: Locale
  dictionary: Dictionary
  posts: BlogPost[]
  params?: { locale: Locale }
}

const POSTS_PER_PAGE = 6

export default function BlogPageClient({ locale, dictionary, posts, params }: BlogPageClientProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  
  // Use either the provided locale directly or from params
  const currentLocale = locale || (params?.locale)
  
  // Filter posts based on search query
  const filteredPosts = posts.filter(post => 
    searchQuery === "" || 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (post.excerpt && post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  // Calculate pagination
  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE)
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  )

  // Reset to first page when search query changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  // Handle page changes
  const goToPage = (page: number) => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
    setCurrentPage(page)
  }

  // Generate page numbers array
  const getPageNumbers = () => {
    const pageNumbers = []
    const maxVisiblePages = 5
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i)
    }
    
    return pageNumbers
  }

  return (
    <PageTransition>
      <section className="py-20 relative">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-accent-50/40 via-background to-background pointer-events-none"></div>
        <div className="absolute top-1/4 right-8 w-64 h-64 bg-primary-300/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-1/3 left-8 w-64 h-64 bg-accent-300/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="container relative z-10">
          <motion.div 
            className="max-w-3xl mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-block rounded-full px-3 py-1 text-sm font-medium bg-accent-100 text-accent-800 mb-3">
              {dictionary.common.blog}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-accent-600 to-accent-800">
              {dictionary.blog.title}
            </h1>
            <p className="text-muted-foreground text-lg">{dictionary.blog.description}</p>
            
            <div className="relative mt-8">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder={locale === "tr" ? "Yazıları ara..." : "Search posts..."}
                className="pl-10 pr-4 py-6 border-accent-200 focus-visible:ring-accent-500 bg-white/80"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.length > 0 ? (
              paginatedPosts.map((post, index) => {
                const readingTimeText = dictionary.blog.readingTime.replace("{time}", post.readingTime?.toString() || "0")
                return (
                  <motion.div
                    key={post.slug}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group"
                  >
                    <BlogCard post={post} locale={currentLocale} readingTimeText={readingTimeText} />
                  </motion.div>
                )
              })
            ) : (
              <motion.div 
                className="col-span-3 py-16 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="text-accent-500 mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="mx-auto">
                    <path d="M9.5 9h5"></path><path d="M9.5 13h5"></path><path d="M9.5 17h5"></path>
                    <path d="M5.5 8.5c1.5 0 3 .5 3 2 0 1.5-1.5 2-3 2-1.5 0-3-.5-3-2 0-1.5 1.5-2 3-2Z"></path>
                    <path d="M5.5 16.5c1.5 0 3 .5 3 2 0 1.5-1.5 2-3 2-1.5 0-3-.5-3-2 0-1.5 1.5-2 3-2Z"></path>
                    <path d="M19 2.5V19a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V2.5"></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-medium">{locale === "tr" ? "Yazı bulunamadı" : "No posts found"}</h3>
                <p className="text-muted-foreground mt-2">{locale === "tr" ? "Farklı bir arama terimi deneyin" : "Try a different search term"}</p>
              </motion.div>
            )}
          </div>
          
          {/* Pagination */}
          {filteredPosts.length > 0 && totalPages > 1 && (
            <div className="flex justify-center mt-16">
              <div className="flex items-center gap-2 bg-white/80 p-2 rounded-lg shadow-sm border border-accent-100">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-9 w-9 p-0 border-accent-200 hover:bg-accent-50 disabled:opacity-50"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">{locale === "tr" ? "Önceki Sayfa" : "Previous Page"}</span>
                </Button>
                
                {getPageNumbers().map(page => (
                  <Button
                    key={page}
                    variant={page === currentPage ? "default" : "outline"}
                    size="sm"
                    className={`h-9 w-9 p-0 ${
                      page === currentPage 
                        ? 'bg-accent-600 hover:bg-accent-700 text-white font-medium shadow-sm'
                        : 'border-accent-200 hover:bg-accent-50'
                    }`}
                    onClick={() => goToPage(page)}
                  >
                    {page}
                  </Button>
                ))}
                
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 p-0 border-accent-200 hover:bg-accent-50 disabled:opacity-50"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                  <span className="sr-only">{locale === "tr" ? "Sonraki Sayfa" : "Next Page"}</span>
                </Button>
              </div>
            </div>
          )}
          
          {/* Post count */}
          {filteredPosts.length > 0 && (
            <div className="text-center text-sm text-muted-foreground mt-4">
              {locale === "tr" 
                ? `Toplam ${filteredPosts.length} yazı, sayfa ${currentPage}/${totalPages}`
                : `Showing page ${currentPage} of ${totalPages} (${filteredPosts.length} posts total)`
              }
            </div>
          )}
        </div>
      </section>
    </PageTransition>
  )
}

