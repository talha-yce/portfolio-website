import { NextRequest, NextResponse } from 'next/server'
import { getProjectBySlug } from '@/lib/services/projectService'
import type { Locale } from '@/lib/i18n/config'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')
    const locale = (searchParams.get('locale') || 'tr') as Locale
    
    if (!slug) {
      return NextResponse.json(
        { success: false, error: 'Slug parameter is required' },
        { status: 400 }
      )
    }
    
    console.log(`[API] Project single GET request - slug: ${slug}, locale: ${locale}`)
    
    const project = await getProjectBySlug(slug, locale)
    
    if (!project) {
      console.log(`[API] Project not found: ${slug}`)
      return NextResponse.json(
        { success: false, error: 'Project not found' },
        { status: 404 }
      )
    }
    
    console.log(`[API] Project found: ${project.title}`)
    
    return NextResponse.json({
      success: true,
      data: project
    })
  } catch (error) {
    console.error('[API] Error fetching project:', error)
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