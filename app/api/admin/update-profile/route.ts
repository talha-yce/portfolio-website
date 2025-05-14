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
    const { username, email } = body
    
    if (!username || !email) {
      return NextResponse.json(
        { success: false, message: 'Username and email are required' },
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
    
    // Check if email is already in use by another admin
    if (admin.email !== email) {
      const existingAdmin = await AdminModel.findOne({ email, _id: { $ne: admin._id } })
      
      if (existingAdmin) {
        return NextResponse.json(
          { success: false, message: 'Email already in use' },
          { status: 400 }
        )
      }
    }
    
    // Check if username is already in use by another admin
    if (admin.username !== username) {
      const existingAdmin = await AdminModel.findOne({ username, _id: { $ne: admin._id } })
      
      if (existingAdmin) {
        return NextResponse.json(
          { success: false, message: 'Username already in use' },
          { status: 400 }
        )
      }
    }
    
    // Update profile
    admin.username = username
    admin.email = email
    await admin.save()
    
    // Create new token with updated info
    const newToken = jwt.sign(
      { id: admin._id, email: admin.email, username: admin.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    )
    
    // Create response
    const response = NextResponse.json({ 
      success: true, 
      message: 'Profile updated successfully',
      admin: {
        email: admin.email,
        username: admin.username
      }
    })
    
    // Set cookie with new token
    response.cookies.set({
      name: 'adminToken',
      value: newToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 24 hours in seconds
      path: '/',
      sameSite: 'lax'
    })
    
    return response
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
} 