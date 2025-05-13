import { NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import AdminModel from '@/lib/models/Admin'
import jwt from 'jsonwebtoken'

// This secret should be in an environment variable in production
const JWT_SECRET = process.env.JWT_SECRET || 'talha-yuce-portfolio-admin-secret-key-8290'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    
    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Connect to the database
    await connectToDatabase()

    // Find the admin
    const admin = await AdminModel.findOne({ email })
    
    if (!admin) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await admin.comparePassword(password)
    
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Create a JWT token that expires in 24 hours
    const token = jwt.sign(
      { id: admin._id, email: admin.email, username: admin.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    )

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: admin._id,
        email: admin.email,
        username: admin.username
      }
    })
  } catch (error) {
    console.error('Authentication error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
} 