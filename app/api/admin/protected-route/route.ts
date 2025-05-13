import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminAuth } from '@/lib/middleware/admin-auth'

export async function GET(request: NextRequest) {
  // Verify admin authentication
  const authResult = await verifyAdminAuth(request)
  if (!authResult.success) {
    return authResult.response
  }
  
  // The admin is authenticated, proceed with the request
  // Add non-null assertion since we already checked success is true
  const admin = authResult.admin!
  
  return NextResponse.json({
    success: true,
    message: 'This is a protected admin route',
    admin: {
      email: admin.email || 'unknown',
      username: admin.username || 'unknown'
    }
  })
} 