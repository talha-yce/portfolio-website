import { NextRequest, NextResponse } from 'next/server'
import * as jwt from 'jsonwebtoken'

// This secret should be in an environment variable in production
const JWT_SECRET = process.env.JWT_SECRET || 'talha-yuce-portfolio-admin-secret-key-8290'

interface TokenPayload {
  id: string
  email: string
  username: string
}

/**
 * Middleware to verify admin authentication
 * Example usage:
 * 
 * import { verifyAdminAuth } from '@/lib/middleware/admin-auth'
 * 
 * export async function GET(request: NextRequest) {
 *   const authResult = await verifyAdminAuth(request)
 *   if (!authResult.success) {
 *     return authResult.response
 *   }
 *   
 *   // The admin is authenticated, proceed with the request
 *   const admin = authResult.admin
 *   
 *   // Rest of your code...
 * }
 */
export async function verifyAdminAuth(request: NextRequest) {
  console.log('Verifying admin authentication...')
  
  // First check for cookie-based authentication
  const adminToken = request.cookies.get('adminToken')?.value
  console.log('Cookie token present:', !!adminToken)
  
  // Then check for header-based authentication
  const authHeader = request.headers.get('authorization')
  const headerToken = authHeader && authHeader.startsWith('Bearer ') 
    ? authHeader.split(' ')[1] 
    : null
  console.log('Header token present:', !!headerToken)
  
  // Use the token from either cookie or header
  const token = adminToken || headerToken
  
  if (!token) {
    console.log('No authentication token found')
    return {
      success: false,
      response: NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      )
    }
  }

  try {
    console.log('Attempting to verify JWT token...')
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload
    console.log('Token verified successfully for:', decoded.email)
    
    return {
      success: true,
      admin: {
        id: decoded.id,
        email: decoded.email,
        username: decoded.username
      }
    }
  } catch (error) {
    console.error('Token verification error:', error)
    return {
      success: false,
      response: NextResponse.json(
        { success: false, message: 'Invalid or expired session' },
        { status: 401 }
      )
    }
  }
} 