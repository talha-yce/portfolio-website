import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import { Project, type IProject } from '@/lib/models/Project'

// Get all projects for admin
export async function GET(request: NextRequest) {
  try {
    console.log('[Admin API] Projects GET request')
    await connectToDatabase()
    
    // Get locale filter from query params
    const { searchParams } = new URL(request.url)
    const locale = searchParams.get('locale')
    
    // Build query based on locale filter
    const query = locale ? { locale } : {}
    console.log(`[Admin API] Query filter:`, query)
    
    const projects = await Project.find(query)
      .sort({ createdAt: -1 })
      .lean()
    
    console.log(`[Admin API] Returning ${projects.length} projects for locale: ${locale || 'all'}`)
    
    const formattedProjects = projects.map((project: any) => ({
      ...project,
      _id: project._id.toString(),
      formattedDate: new Date(project.date).toLocaleDateString('tr-TR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    }))
    
    return NextResponse.json({
      success: true,
      projects: formattedProjects
    })
  } catch (error) {
    console.error('[Admin API] Error fetching projects:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch projects',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Create new project
export async function POST(request: NextRequest) {
  try {
    console.log('[Admin API] Projects POST request')
    const projectData = await request.json()
    
    await connectToDatabase()
    
    // Check if slug already exists for this locale
    const existingProject = await Project.findOne({
      slug: projectData.slug,
      locale: projectData.locale
    })
    
    if (existingProject) {
      return NextResponse.json(
        { 
          success: false, 
          error: `A project with slug "${projectData.slug}" already exists in ${projectData.locale} locale`
        },
        { status: 400 }
      )
    }
    
    const newProject = new Project(projectData)
    await newProject.save()
    
    console.log(`[Admin API] Project created successfully: ${newProject._id}`)
    
    return NextResponse.json({
      success: true,
      project: {
        ...newProject.toObject(),
        _id: newProject._id.toString()
      }
    })
  } catch (error) {
    console.error('[Admin API] Error creating project:', error)
    
    // Handle validation errors
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Validation error',
          details: error.message
        },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create project',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 