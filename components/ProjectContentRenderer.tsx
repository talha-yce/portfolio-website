'use client'

interface ProjectContentSection {
  type: 'paragraph' | 'heading' | 'list' | 'code' | 'image' | 'quote' | 'text'
  text?: string
  content?: string
  items?: string[]
  level?: number
  language?: string
  src?: string
  alt?: string
  caption?: string
  author?: string
  order?: number
}

interface ProjectContentRendererProps {
  content: ProjectContentSection[]
}

export function ProjectContentRenderer({ content }: ProjectContentRendererProps) {
  if (!Array.isArray(content)) {
    return null
  }

  // Sort content by order if available
  const sortedContent = content.sort((a, b) => {
    if (a.order !== undefined && b.order !== undefined) {
      return a.order - b.order
    }
    return 0
  })

  return (
    <div className="space-y-6">
      {sortedContent.map((section, index) => {
        // Get text content from either 'text' or 'content' field
        const textContent = section.text || section.content || ''
        
        switch (section.type) {
          case 'heading':
            const HeadingTag = section.level === 3 ? 'h3' : 'h2'
            return (
              <HeadingTag 
                key={index} 
                className={`font-bold mt-8 mb-4 text-foreground ${
                  section.level === 3 ? 'text-xl' : 'text-2xl'
                }`}
              >
                {textContent.replace(/\r/g, '')}
              </HeadingTag>
            )
          
          case 'paragraph':
          case 'text':
            return (
              <div key={index} className="mb-6">
                {textContent.split(/\r?\n/).filter(p => p.trim()).map((paragraph, i) => (
                  <p key={i} className="mb-4 text-muted-foreground leading-relaxed">
                    {paragraph.trim()}
                  </p>
                ))}
              </div>
            )
          
          case 'list':
            // Handle both items array and text content
            const listItems = section.items || 
              textContent.split(/\r?\n/).filter(item => item.trim())
            
            return (
              <ul key={index} className="list-disc pl-6 mb-6 space-y-2">
                {listItems.map((item, i) => (
                  <li key={i} className="text-muted-foreground">
                    {item.replace(/^[-\*]\s*/, '').trim()}
                  </li>
                ))}
              </ul>
            )
          
          case 'code':
            return (
              <div key={index} className="mb-6">
                <pre className="bg-muted/50 p-4 rounded-lg overflow-x-auto border">
                  <code className={`text-sm font-mono ${section.language ? `language-${section.language}` : ''}`}>
                    {textContent}
                  </code>
                </pre>
              </div>
            )
          
          case 'image':
            return (
              <figure key={index} className="mb-6">
                <img 
                  src={section.src || textContent} 
                  alt={section.alt || section.caption || ''} 
                  className="rounded-lg max-w-full h-auto border shadow-sm mx-auto"
                />
                {section.caption && (
                  <figcaption className="text-center text-sm text-muted-foreground mt-2">
                    {section.caption}
                  </figcaption>
                )}
              </figure>
            )
          
          case 'quote':
            return (
              <blockquote key={index} className="border-l-4 border-primary-500 pl-6 italic my-6 bg-muted/30 py-4 rounded-r-lg">
                <p className="text-foreground">{textContent}</p>
                {section.author && (
                  <cite className="block text-right text-sm text-muted-foreground mt-2">
                    — {section.author}
                  </cite>
                )}
              </blockquote>
            )
          
          default:
            return (
              <div key={index} className="mb-4 p-4 bg-muted/50 rounded border">
                <p className="text-sm text-muted-foreground">
                  Content type: {section.type}
                </p>
                <p className="text-sm">{textContent}</p>
              </div>
            )
        }
      })}
    </div>
  )
} 