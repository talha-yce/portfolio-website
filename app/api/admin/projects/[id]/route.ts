import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import { Project } from '@/lib/models/Project'
import mongoose from 'mongoose'

interface RouteParams {
  params: { id: string }
}

// Get single project by ID or slug
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    console.log(`[Admin API] Project GET request for ID/slug: ${params.id}`)
    await connectToDatabase()
    
    let project
    
    // Check if it's a MongoDB ObjectId
    if (mongoose.Types.ObjectId.isValid(params.id)) {
      project = await Project.findById(params.id).lean()
    } else {
      // Treat as slug
      project = await Project.findOne({ slug: params.id }).lean()
    }
    
    if (!project) {
      console.log(`[Admin API] Project not found: ${params.id}`)
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      )
    }
    
    console.log(`[Admin API] Project found: ${(project as any).title}`)
    
    return NextResponse.json({
      success: true,
      project: {
        ...(project as any),
        _id: (project as any)._id.toString()
      }
    })
  } catch (error) {
    console.error('[Admin API] Error fetching project:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch project',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Update project
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    console.log(`[Admin API] Project PUT request for ID: ${params.id}`)
    const updateData = await request.json()
    console.log(`[Admin API] Update data received:`, updateData)
    
    await connectToDatabase()
    
    // Remove _id from update data if present
    const { _id, ...dataToUpdate } = updateData
    console.log(`[Admin API] Data to update:`, dataToUpdate)
    
    const updatedProject = await Project.findByIdAndUpdate(
      params.id,
      { ...dataToUpdate, lastModified: new Date() },
      { new: true, runValidators: true }
    ).lean()
    
    console.log(`[Admin API] MongoDB update result:`, updatedProject ? 'Success' : 'Failed')
    
    if (!updatedProject) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      )
    }
    
    console.log(`[Admin API] Project updated successfully: ${(updatedProject as any)._id}`)
    
    return NextResponse.json({
      success: true,
      project: {
        ...(updatedProject as any),
        _id: (updatedProject as any)._id.toString()
      }
    })
  } catch (error) {
    console.error('[Admin API] Error updating project:', error)
    
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
        error: 'Failed to update project',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Partial update project (for status changes, etc.)
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    console.log(`[Admin API] Project PATCH request for ID: ${params.id}`)
    const updateData = await request.json()
    
    await connectToDatabase()
    
    const updatedProject = await Project.findByIdAndUpdate(
      params.id,
      { ...updateData, lastModified: new Date() },
      { new: true, runValidators: true }
    ).lean()
    
    if (!updatedProject) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      )
    }
    
    console.log(`[Admin API] Project patched successfully: ${(updatedProject as any)._id}`)
    
    return NextResponse.json({
      success: true,
      project: {
        ...(updatedProject as any),
        _id: (updatedProject as any)._id.toString()
      }
    })
  } catch (error) {
    console.error('[Admin API] Error patching project:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update project',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// Delete project
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    console.log(`[Admin API] Project DELETE request for ID: ${params.id}`)
    await connectToDatabase()
    
    const deletedProject = await Project.findByIdAndDelete(params.id).lean()
    
    if (!deletedProject) {
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      )
    }
    
    console.log(`[Admin API] Project deleted successfully: ${(deletedProject as any)._id}`)
    
    return NextResponse.json({
      success: true,
      message: 'Project deleted successfully',
      deletedProject: {
        ...(deletedProject as any),
        _id: (deletedProject as any)._id.toString()
      }
    })
  } catch (error) {
    console.error('[Admin API] Error deleting project:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete project',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 