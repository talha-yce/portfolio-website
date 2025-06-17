'use client'

interface ContentSection {
  type: 'paragraph' | 'heading' | 'list' | 'code' | 'image' | 'quote'
  content: string
}

interface BlogContentRendererProps {
  content: ContentSection[]
}

export function BlogContentRenderer({ content }: BlogContentRendererProps) {
  if (!Array.isArray(content)) {
    return null
  }

  return (
    <div className="space-y-6">
      {content.map((section, index) => {
        switch (section.type) {
          case 'heading':
            return (
              <h2 key={index} className="text-2xl font-bold mt-8 mb-4 text-foreground">
                {section.content}
              </h2>
            )
          
          case 'paragraph':
            return (
              <div key={index} className="mb-6">
                {section.content.split('\n').map((paragraph, i) => (
                  <p key={i} className="mb-4 text-muted-foreground leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            )
          
          case 'code':
            return (
              <div key={index} className="mb-6">
                <pre className="bg-muted/50 p-4 rounded-lg overflow-x-auto border">
                  <code className="text-sm font-mono">{section.content}</code>
                </pre>
              </div>
            )
          
          case 'image':
            // For images, we expect the content to be the image URL
            return (
              <figure key={index} className="mb-6">
                <img 
                  src={section.content} 
                  alt="" 
                  className="rounded-lg max-w-full h-auto border shadow-sm"
                />
              </figure>
            )
          
          case 'quote':
            return (
              <blockquote key={index} className="border-l-4 border-primary-500 pl-6 italic my-6 bg-muted/30 py-4 rounded-r-lg">
                <p className="text-foreground">{section.content}</p>
              </blockquote>
            )
          
          case 'list':
            return (
              <ul key={index} className="list-disc pl-6 mb-6 space-y-2">
                {section.content.split('\n').filter(item => item.trim()).map((item, i) => (
                  <li key={i} className="text-muted-foreground">{item.trim()}</li>
                ))}
              </ul>
            )
          
          default:
            return (
              <div key={index} className="mb-4 p-4 bg-muted/50 rounded border">
                <p className="text-sm text-muted-foreground">
                  Unknown content type: {section.type}
                </p>
                <p className="text-sm">{section.content}</p>
              </div>
            )
        }
      })}
    </div>
  )
} 