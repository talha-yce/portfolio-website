import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminAuth } from '@/lib/middleware/admin-auth'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: NextRequest) {
  try {
    console.log('Protected route: Starting authentication check')
    
    // Verify admin authentication
    const authResult = await verifyAdminAuth(request)
    if (!authResult.success) {
      console.log('Protected route: Authentication failed')
      return authResult.response
    }
    
    // The admin is authenticated, proceed with the request
    const admin = authResult.admin!
    console.log('Protected route: Authentication successful for', admin.email)
    
    const response = NextResponse.json({
      success: true,
      message: 'Authentication successful',
      admin: {
        email: admin.email || 'unknown',
        username: admin.username || 'unknown'
      }
    })
    
    // Set cache control headers
    response.headers.set('Cache-Control', 'no-store, max-age=0')
    
    return response
  } catch (error) {
    console.error('Protected route error:', error)
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 }
    )
  }
} 