import { NextResponse } from 'next/server'

export async function POST() {
  try {
    // Create a response
    const response = NextResponse.json({ success: true })
    
    // Clear the admin token cookie by setting expiry to a past date
    response.cookies.set({
      name: 'adminToken',
      value: '',
      expires: new Date(0),
      path: '/',
    })
    
    return response
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to logout' },
      { status: 500 }
    )
  }
} 