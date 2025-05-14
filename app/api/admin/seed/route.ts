import { NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import AdminModel from '@/lib/models/Admin'

// API route to seed the database with an admin user for development/testing
export async function POST(request: Request) {
  // Only allow this in development mode
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { success: false, message: 'This route is only available in development mode' },
      { status: 403 }
    )
  }

  try {
    // Connect to the database
    console.log('Connecting to database for seeding...')
    await connectToDatabase()

    // Check if we already have an admin user
    const existingAdmin = await AdminModel.findOne({ email: 'yucetalha00@gmail.com' })
    
    if (existingAdmin) {
      console.log('Admin user already exists')
      return NextResponse.json({ 
        success: true, 
        message: 'Admin user already exists',
        user: {
          email: existingAdmin.email,
          username: existingAdmin.username
        }
      })
    }

    // Create a new admin user
    console.log('Creating new admin user...')
    const newAdmin = new AdminModel({
      email: 'yucetalha00@gmail.com',
      username: 'admin',
      password: 'admin123456'
    })

    // Save the user (password will be hashed by the pre-save hook)
    await newAdmin.save()
    console.log('Admin user created successfully')

    return NextResponse.json({ 
      success: true, 
      message: 'Admin user created successfully',
      user: {
        email: newAdmin.email,
        username: newAdmin.username
      }
    })
  } catch (error) {
    console.error('Error seeding admin user:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to seed admin user' },
      { status: 500 }
    )
  }
}

// GET method to check if the admin user exists
export async function GET() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { success: false, message: 'This route is only available in development mode' },
      { status: 403 }
    )
  }

  try {
    // Connect to the database
    await connectToDatabase()

    // Check if we have an admin user
    const admin = await AdminModel.findOne({ email: 'yucetalha00@gmail.com' })
    
    if (admin) {
      return NextResponse.json({ 
        success: true, 
        exists: true,
        user: {
          email: admin.email,
          username: admin.username
        }
      })
    } else {
      return NextResponse.json({ 
        success: true, 
        exists: false
      })
    }
  } catch (error) {
    console.error('Error checking admin user:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to check admin user' },
      { status: 500 }
    )
  }
} 