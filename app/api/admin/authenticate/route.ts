import { NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import AdminModel from '@/lib/models/Admin'
import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

// This secret should be in an environment variable in production
const JWT_SECRET = process.env.JWT_SECRET || 'talha-yuce-portfolio-admin-secret-key-8290'

export async function POST(request: Request) {
  try {
    // Request içeriğini parse etmeyi dene
    let email, password;
    try {
      const body = await request.json();
      email = body.email;
      password = body.password;
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return NextResponse.json(
        { success: false, message: 'Invalid request body' },
        { status: 400 }
      );
    }
    
    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Connect to the database
    try {
      await connectToDatabase()
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return NextResponse.json(
        { success: false, message: 'Database connection failed' },
        { status: 500 }
      );
    }

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

    // Create response
    const response = NextResponse.json({
      success: true,
      user: {
        id: admin._id,
        email: admin.email,
        username: admin.username
      }
    })
    
    // Set an HTTP-only cookie with the token
    response.cookies.set({
      name: 'adminToken',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 24 hours in seconds
      path: '/',
      sameSite: 'strict'
    })

    return response
  } catch (error) {
    console.error('Authentication error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
} 