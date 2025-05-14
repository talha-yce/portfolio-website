import { NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import AdminModel from '@/lib/models/Admin'
import { cookies } from 'next/headers'
import * as jwt from 'jsonwebtoken'

// This secret should be in an environment variable in production
const JWT_SECRET = process.env.JWT_SECRET || 'talha-yuce-portfolio-admin-secret-key-8290'

export async function POST(request: Request) {
  try {
    // Get token from cookies - cookies() returns a Promise that needs to be awaited
    const cookieStore = await cookies()
    const adminToken = cookieStore.get('adminToken')?.value
    
    if (!adminToken) {
      return NextResponse.json(
        { success: false, message: 'Authentication required' },
        { status: 401 }
      )
    }
    
    // Verify token
    let decoded
    try {
      decoded = jwt.verify(adminToken, JWT_SECRET) as { id: string }
    } catch (err) {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired token' },
        { status: 401 }
      )
    }
    
    // Get request body
    const body = await request.json()
    const { currentPassword, newPassword } = body
    
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, message: 'Current password and new password are required' },
        { status: 400 }
      )
    }
    
    // Connect to database
    await connectToDatabase()
    
    // Find admin user by ID
    const admin = await AdminModel.findById(decoded.id)
    
    if (!admin) {
      return NextResponse.json(
        { success: false, message: 'Admin user not found' },
        { status: 404 }
      )
    }
    
    // Verify current password
    const isValidPassword = await admin.comparePassword(currentPassword)
    
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, message: 'Current password is incorrect' },
        { status: 400 }
      )
    }
    
    // Update password
    admin.password = newPassword
    await admin.save()
    
    return NextResponse.json({ success: true, message: 'Password updated successfully' })
  } catch (error) {
    console.error('Error changing password:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
} 