import { NextRequest, NextResponse } from 'next/server'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      )
    }
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, GIF and WebP are allowed.' },
        { status: 400 }
      )
    }
    
    // Get file extension
    const fileExtension = file.name.split('.').pop()
    
    // Generate unique filename
    const uniqueFilename = `${uuidv4()}.${fileExtension}`
    
    // Define upload directory
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'blog')
    
    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // Save file
    const filePath = join(uploadDir, uniqueFilename)
    await writeFile(filePath, buffer)
    
    // Return success with file path
    return NextResponse.json({ 
      success: true, 
      filePath: `/uploads/blog/${uniqueFilename}`,
      filename: uniqueFilename
    })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
} 