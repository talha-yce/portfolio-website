'use client'

import { memo, lazy, Suspense } from 'react'
import { Link as LinkIcon } from 'lucide-react'

// Dynamically import SyntaxHighlighter for code splitting
const SyntaxHighlighter = lazy(() => import('react-syntax-highlighter/dist/esm/prism-light').then(mod => ({ default: mod.default })));
const importStyle = () => import('react-syntax-highlighter/dist/esm/styles/prism/vsc-dark-plus').then(mod => mod.default);

interface ContentSectionProps {
  type: string;
  content: string;
  order?: number;
  language?: string;
  url?: string;
  alt?: string;
  caption?: string;
  source?: string;
  href?: string;
  text?: string;
}

// Generate ID for headings to use with the table of contents
const generateHeadingId = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/^#+\s+/, ''); // Remove heading marks
};

// Render different types of content based on the content type
const ContentSection = memo(({ section }: { section: ContentSectionProps }) => {
  switch (section.type) {
    case 'heading': {
      const headingText = section.content.replace(/^#+\s+/, '');
      const headingId = generateHeadingId(section.content);
      
      // Create link icon for direct heading link
      const HeadingLink = () => (
        <a 
          href={`#${headingId}`}
          className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-primary-600 hover:text-primary-700"
          aria-label="Direct link to heading"
        >
          <LinkIcon className="h-4 w-4" />
        </a>
      );
      
      if (section.content.startsWith('# ')) {
        return (
          <h1 id={headingId} className="group text-3xl font-bold mt-8 mb-4 flex items-center text-primary-700">
            {headingText}
            <HeadingLink />
          </h1>
        );
      } else if (section.content.startsWith('## ')) {
        return (
          <h2 id={headingId} className="group text-2xl font-bold mt-6 mb-3 flex items-center text-primary-700">
            {headingText}
            <HeadingLink />
          </h2>
        );
      } else if (section.content.startsWith('### ')) {
        return (
          <h3 id={headingId} className="group text-xl font-bold mt-5 mb-2 flex items-center text-primary-700">
            {headingText}
            <HeadingLink />
          </h3>
        );
      } else if (section.content.startsWith('#### ')) {
        return (
          <h4 id={headingId} className="group text-lg font-bold mt-4 mb-2 flex items-center text-primary-700">
            {headingText}
            <HeadingLink />
          </h4>
        );
      } else {
        return (
          <h2 id={headingId} className="group text-2xl font-bold mt-6 mb-3 flex items-center text-primary-700">
            {headingText}
            <HeadingLink />
          </h2>
        );
      }
    }
    
    case 'text':
      return (
        <div className="mb-4 leading-relaxed text-gray-700">
          {section.content.split('\n').map((paragraph, i) => (
            <p key={i} className="mb-4">{paragraph}</p>
          ))}
        </div>
      );
    
    case 'image':
      return (
        <figure className="my-6">
          <img 
            src={section.url} 
            alt={section.alt || ''} 
            className="rounded-lg w-full h-auto" 
            loading="lazy"
            decoding="async"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
          />
          {section.caption && (
            <figcaption className="text-sm text-gray-600 mt-2 text-center">{section.caption}</figcaption>
          )}
        </figure>
      );
    
    case 'code':
      return (
        <div className="my-6">
          <div className="flex justify-between items-center mb-2">
            {section.language && (
              <div className="text-xs text-primary-700 bg-primary-100 px-3 py-1 rounded-t-md">
                {section.language}
              </div>
            )}
            <button
              onClick={() => {
                navigator.clipboard.writeText(section.content);
                // Could add a toast notification here
              }}
              className="text-xs text-primary-600 hover:text-primary-800 transition-colors"
              aria-label="Copy code"
            >
              Copy
            </button>
          </div>
          <Suspense fallback={
            <pre className="rounded-lg text-sm bg-gray-800 p-4 text-white overflow-x-auto">
              {section.content}
            </pre>
          }>
            <SyntaxHighlighter 
              language={section.language || 'javascript'} 
              style={importStyle()}
              className="rounded-lg text-sm"
              showLineNumbers={true}
              wrapLines={true}
              wrapLongLines={true}
            >
              {section.content}
            </SyntaxHighlighter>
          </Suspense>
        </div>
      );
    
    case 'quote':
      return (
        <blockquote className="border-l-4 border-primary-500 pl-4 my-6 italic text-gray-700 bg-primary-50 p-4 rounded-r-md">
          <p>{section.content}</p>
          {section.source && <footer className="text-gray-600 mt-2 text-sm">— {section.source}</footer>}
        </blockquote>
      );
    
    case 'link':
      return (
        <a 
          href={section.href} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-primary-600 hover:text-primary-800 underline inline-flex items-center"
        >
          {section.text || section.href}
          <LinkIcon className="h-3 w-3 ml-1" />
        </a>
      );
    
    case 'list':
      if (section.content.includes('1.')) {
        // Ordered list
        const items = section.content.split('\n').filter(item => item.trim() !== '');
        return (
          <ol className="list-decimal list-inside my-4 pl-4 space-y-2 text-gray-700">
            {items.map((item, i) => {
              const content = item.replace(/^\d+\.\s+/, '');
              return <li key={i}>{content}</li>;
            })}
          </ol>
        );
      } else {
        // Unordered list
        const items = section.content.split('\n').filter(item => item.trim() !== '');
        return (
          <ul className="list-disc list-inside my-4 pl-4 space-y-2 text-gray-700">
            {items.map((item, i) => {
              const content = item.replace(/^[-*]\s+/, '');
              return <li key={i}>{content}</li>;
            })}
          </ul>
        );
      }
    
    case 'video':
      if (section.url?.includes('youtube')) {
        // YouTube video - lazy load with intersection observer
        const videoId = section.url.includes('v=') 
          ? section.url.split('v=')[1].split('&')[0]
          : section.url.split('/').pop();
        
        return (
          <div className="my-6 aspect-w-16 aspect-h-9">
            <iframe
              src={`https://www.youtube.com/embed/${videoId}`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Embedded YouTube video"
              className="w-full h-96 rounded-lg"
              loading="lazy"
            ></iframe>
          </div>
        );
      } else {
        // Generic video
        return (
          <div className="my-6">
            <video 
              src={section.url} 
              controls 
              className="w-full h-auto rounded-lg"
              preload="metadata"
            >
              Your browser does not support the video tag.
            </video>
          </div>
        );
      }
    
    default:
      return <p className="text-gray-700">{section.content}</p>;
  }
});

ContentSection.displayName = 'ContentSection';

interface BlogContentProps {
  content: ContentSectionProps[];
}

const BlogContent = memo(function BlogContent({ content }: BlogContentProps) {
  // Sort content by order if needed
  const sortedContent = [...content].sort((a, b) => (a.order || 0) - (b.order || 0));
  
  return (
    <div className="blog-content">
      {sortedContent.map((section, index) => (
        <ContentSection key={index} section={section} />
      ))}
    </div>
  );
});

export default BlogContent; 