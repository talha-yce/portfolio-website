/**
 * Migration script to import blog posts from Markdown files to MongoDB
 * 
 * Run with: npx ts-node -r tsconfig-paths/register scripts/migrate-blog-to-mongodb.ts
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import connectToDatabase from '../lib/mongodb';
import BlogPost from '../lib/models/BlogPost';

// Helper to convert markdown to structured content
function parseMarkdownToContentSections(content: string) {
  const lines = content.split('\n');
  const sections = [];
  let currentSection = { type: 'text', content: '', order: 0 };
  let sectionOrder = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Handle headings
    if (line.startsWith('#')) {
      // Save previous section if not empty
      if (currentSection.content.trim()) {
        sections.push({ ...currentSection, order: sectionOrder++ });
      }
      
      currentSection = {
        type: 'heading',
        content: line,
        order: sectionOrder++
      };
      
      // Add the heading
      sections.push({ ...currentSection });
      
      // Start new text section
      currentSection = { type: 'text', content: '', order: sectionOrder };
      continue;
    }
    
    // Handle code blocks
    if (line.startsWith('```')) {
      const language = line.slice(3).trim();
      
      // Save previous section if not empty
      if (currentSection.content.trim()) {
        sections.push({ ...currentSection, order: sectionOrder++ });
      }
      
      // Collect code block content
      let codeContent = '';
      i++;
      
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeContent += lines[i] + '\n';
        i++;
      }
      
      // Add code section
      sections.push({
        type: 'code',
        content: codeContent.trim(),
        language: language || 'plaintext',
        order: sectionOrder++
      });
      
      // Start new text section
      currentSection = { type: 'text', content: '', order: sectionOrder };
      continue;
    }
    
    // Handle images
    if (line.includes('![') && line.includes('](')) {
      // Save previous section if not empty
      if (currentSection.content.trim()) {
        sections.push({ ...currentSection, order: sectionOrder++ });
      }
      
      const altMatch = line.match(/!\[(.*?)\]/);
      const urlMatch = line.match(/\((.*?)\)/);
      
      if (altMatch && urlMatch) {
        sections.push({
          type: 'image',
          content: '',
          url: urlMatch[1],
          alt: altMatch[1],
          order: sectionOrder++
        });
      }
      
      // Start new text section
      currentSection = { type: 'text', content: '', order: sectionOrder };
      continue;
    }
    
    // Handle blockquotes
    if (line.startsWith('>')) {
      // Save previous section if not empty
      if (currentSection.content.trim()) {
        sections.push({ ...currentSection, order: sectionOrder++ });
      }
      
      let quoteContent = line.substring(1).trim();
      let sourceLine = '';
      
      // Check if next line contains the quote source
      if (i + 1 < lines.length && lines[i + 1].includes('—')) {
        sourceLine = lines[i + 1].trim();
        i++;
      }
      
      sections.push({
        type: 'quote',
        content: quoteContent,
        source: sourceLine.replace('—', '').trim(),
        order: sectionOrder++
      });
      
      // Start new text section
      currentSection = { type: 'text', content: '', order: sectionOrder };
      continue;
    }
    
    // Handle unordered lists
    if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
      // Save previous section if not empty
      if (currentSection.content.trim() && currentSection.type !== 'list') {
        sections.push({ ...currentSection, order: sectionOrder++ });
        currentSection = { type: 'list', content: '', order: sectionOrder };
      }
      
      // Start list or continue it
      if (currentSection.type !== 'list') {
        currentSection = { type: 'list', content: '', order: sectionOrder };
      }
      
      currentSection.content += line + '\n';
      continue;
    }
    
    // Handle ordered lists
    if (/^\d+\.\s/.test(line.trim())) {
      // Save previous section if not empty
      if (currentSection.content.trim() && currentSection.type !== 'list') {
        sections.push({ ...currentSection, order: sectionOrder++ });
        currentSection = { type: 'list', content: '', order: sectionOrder };
      }
      
      // Start list or continue it
      if (currentSection.type !== 'list') {
        currentSection = { type: 'list', content: '', order: sectionOrder };
      }
      
      currentSection.content += line + '\n';
      continue;
    }
    
    // If it's a blank line and we're not in a list, push current section and start a new one
    if (line.trim() === '' && currentSection.type !== 'list' && currentSection.content.trim()) {
      sections.push({ ...currentSection, order: sectionOrder++ });
      currentSection = { type: 'text', content: '', order: sectionOrder };
      continue;
    }
    
    // Add to current section
    if (currentSection.type === 'text' || currentSection.type === 'list') {
      currentSection.content += line + '\n';
    }
  }
  
  // Add the final section if not empty
  if (currentSection.content.trim()) {
    sections.push({ ...currentSection, order: sectionOrder });
  }
  
  return sections;
}

async function migrateMarkdownToMongoDB() {
  try {
    // Connect to MongoDB
    await connectToDatabase();
    console.log('Connected to MongoDB');
    
    // Locales we want to process
    const locales = ['en', 'tr'];
    
    for (const locale of locales) {
      // Get the path to the blog posts
      const postsDir = path.join(process.cwd(), 'public', 'data', 'blog', locale);
      
      // Check if directory exists
      if (!fs.existsSync(postsDir)) {
        console.log(`Directory not found: ${postsDir}`);
        continue;
      }
      
      // Get all markdown files
      const files = fs.readdirSync(postsDir).filter(file => file.endsWith('.md'));
      console.log(`Found ${files.length} blog posts for locale: ${locale}`);
      
      for (const file of files) {
        const filePath = path.join(postsDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(fileContent);
        
        const slug = file.replace(/\.md$/, '');
        
        // Parse the date
        const date = new Date(data.date);
        
        // Parse markdown content to structured sections
        const contentSections = parseMarkdownToContentSections(content);
        
        // Calculate reading time
        const wordsPerMinute = 200;
        const text = content.split(/\s+/).length;
        const readingTime = Math.ceil(text / wordsPerMinute);
        
        // Create blog post object
        const blogPost = {
          title: data.title,
          slug,
          date,
          excerpt: data.excerpt || '',
          content: contentSections,
          tags: data.tags || [],
          coverImage: data.coverImage || '',
          coverImageAlt: '',
          metaDescription: data.metaDescription || '',
          keywords: data.keywords || [],
          locale,
          author: 'Admin',
          lastModified: new Date(),
          readingTime,
          isPublished: true
        };
        
        // Check if this blog post already exists
        const existingPost = await BlogPost.findOne({ slug, locale });
        
        if (existingPost) {
          console.log(`Updating post: ${slug} (${locale})`);
          await BlogPost.findByIdAndUpdate(existingPost._id, blogPost);
        } else {
          console.log(`Creating post: ${slug} (${locale})`);
          await BlogPost.create(blogPost);
        }
      }
    }
    
    console.log('Migration completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

// Run the migration
migrateMarkdownToMongoDB(); 