'use client'

import { ContentSection } from './BlogEditor'

interface ContentRendererProps {
  section: ContentSection
}

export function ContentRenderer({ section }: ContentRendererProps) {
  switch (section.type) {
    case 'heading':
      return <h2 className="text-2xl font-bold mt-6 mb-4">{section.content}</h2>
    
    case 'text':
      return (
        <div className="mb-6">
          {section.content.split('\n').map((paragraph, i) => (
            <p key={i} className="mb-4">
              {paragraph}
            </p>
          ))}
        </div>
      )
    
    case 'code':
      return (
        <div className="mb-6">
          <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto">
            <code className="text-sm">{section.content}</code>
          </pre>
          {section.language && (
            <div className="text-xs text-gray-500 mt-1">{section.language}</div>
          )}
        </div>
      )
    
    case 'image':
      return (
        <figure className="mb-6">
          {section.url ? (
            <img 
              src={section.url} 
              alt={section.alt || ''} 
              className="rounded-md max-w-full h-auto"
            />
          ) : (
            <div className="bg-gray-200 dark:bg-gray-700 rounded-md h-48 flex items-center justify-center">
              No image URL provided
            </div>
          )}
          {section.caption && (
            <figcaption className="text-center text-sm text-gray-500 mt-2">
              {section.caption}
            </figcaption>
          )}
        </figure>
      )
    
    case 'quote':
      return (
        <blockquote className="border-l-4 border-gray-300 dark:border-gray-600 pl-4 italic my-6">
          <p className="mb-2">{section.content}</p>
          {section.source && (
            <footer className="text-sm text-gray-500">— {section.source}</footer>
          )}
        </blockquote>
      )
    
    case 'list':
      return (
        <ul className="list-disc pl-6 mb-6 space-y-2">
          {section.content.split('\n').map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      )
    
    case 'video':
      // Simple YouTube embed (could be expanded for other platforms)
      const getYouTubeEmbedUrl = (url: string) => {
        const videoId = url.match(/(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/)?.[1]
        return videoId ? `https://www.youtube.com/embed/${videoId}` : null
      }
      
      const embedUrl = section.url ? getYouTubeEmbedUrl(section.url) : null
      
      return (
        <div className="mb-6">
          {embedUrl ? (
            <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-md">
              <iframe
                src={embedUrl}
                className="absolute top-0 left-0 w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          ) : (
            <div className="bg-gray-200 dark:bg-gray-700 rounded-md h-48 flex items-center justify-center">
              Invalid video URL
            </div>
          )}
        </div>
      )
    
    default:
      return <div>Unknown section type: {section.type}</div>
  }
} 