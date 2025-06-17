import { NextRequest, NextResponse } from 'next/server'
import { getAllProjects } from '@/lib/services/projectService'
import type { Locale } from '@/lib/i18n/config'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const locale = (searchParams.get('locale') || 'tr') as Locale
    const limit = searchParams.get('limit')
    
    console.log(`[API] Projects GET request - locale: ${locale}, limit: ${limit}`)
    
    const projects = await getAllProjects(locale)
    
    let result = projects
    if (limit) {
      const limitNum = parseInt(limit, 10)
      if (!isNaN(limitNum)) {
        result = projects.slice(0, limitNum)
      }
    }
    
    console.log(`[API] Returning ${result.length} projects`)
    
    return NextResponse.json({
      success: true,
      data: result,
      count: result.length
    })
  } catch (error) {
    console.error('[API] Error fetching projects:', error)
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