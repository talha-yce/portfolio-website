import { NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import AdminModel from '@/lib/models/Admin'
import * as jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

// This secret should be in an environment variable in production
const JWT_SECRET = process.env.JWT_SECRET || 'talha-yuce-portfolio-admin-secret-key-8290'

export async function POST(request: Request) {
  try {
    console.log('Authentication attempt...')
    
    // Parse request body
    let email, password;
    try {
      const body = await request.json();
      email = body.email;
      password = body.password;
      console.log('Login attempt for:', email)
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return NextResponse.json(
        { success: false, message: 'Invalid request format' },
        { status: 400 }
      );
    }
    
    // Validate input
    if (!email || !password) {
      console.log('Missing email or password')
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
      console.log('Admin not found for email:', email)
      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      )
    }

    console.log('Admin found:', admin.email, admin.username)

    // Verify password
    try {
      const isValidPassword = await admin.comparePassword(password)
      
      if (!isValidPassword) {
        console.log('Invalid password for user:', email)
        return NextResponse.json(
          { success: false, message: 'Invalid credentials' },
          { status: 401 }
        )
      }
      
      console.log('Password verified successfully for:', email)
    } catch (passwordError) {
      console.error('Password comparison error:', passwordError);
      return NextResponse.json(
        { success: false, message: 'Authentication error' },
        { status: 500 }
      )
    }

    // Create a JWT token that expires in 24 hours
    let token;
    try {
      token = jwt.sign(
        { id: admin._id, email: admin.email, username: admin.username },
        JWT_SECRET,
        { expiresIn: '24h' }
      )
      console.log('JWT token generated successfully')
    } catch (jwtError) {
      console.error('JWT signing error:', jwtError);
      return NextResponse.json(
        { success: false, message: 'Token generation failed' },
        { status: 500 }
      )
    }

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
    console.log('Setting cookie with token...')
    
    response.cookies.set({
      name: 'adminToken',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24, // 24 hours in seconds
      path: '/',
      sameSite: 'lax' // Changed from 'strict' to 'lax' to allow redirects
    })
    
    console.log('Authentication successful, returning response with cookie')
    return response
  } catch (error) {
    console.error('Authentication error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
} 