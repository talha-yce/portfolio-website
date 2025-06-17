import { NextRequest, NextResponse } from 'next/server'
import { getProjectsCount } from '@/lib/services/projectService'
import type { Locale } from '@/lib/i18n/config'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const locale = (searchParams.get('locale') || 'tr') as Locale
    
    console.log(`[API] Projects count GET request - locale: ${locale}`)
    
    const count = await getProjectsCount(locale)
    
    console.log(`[API] Total projects count: ${count}`)
    
    return NextResponse.json({
      success: true,
      count: count
    })
  } catch (error) {
    console.error('[API] Error fetching projects count:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch projects count',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 