import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import jwt from 'jsonwebtoken'

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
  const headersList = await headers()
  const authHeader = request.headers.get('authorization') || headersList.get('authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return {
      success: false,
      response: NextResponse.json(
        { success: false, message: 'Unauthorized access' },
        { status: 401 }
      )
    }
  }

  const token = authHeader.split(' ')[1]
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload
    
    return {
      success: true,
      admin: {
        id: decoded.id,
        email: decoded.email,
        username: decoded.username
      }
    }
  } catch (error) {
    return {
      success: false,
      response: NextResponse.json(
        { success: false, message: 'Invalid or expired token' },
        { status: 401 }
      )
    }
  }
} 