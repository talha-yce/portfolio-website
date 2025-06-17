import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Profile } from '@/lib/models/Profile';

// GET - Fetch all profiles
export async function GET() {
  try {
    await connectToDatabase();
    
    const profiles = await Profile.find({}).sort({ locale: 1, createdAt: -1 });
    
    return NextResponse.json(profiles);
  } catch (error) {
    console.error('Error fetching profiles:', error);
    return NextResponse.json(
      { error: 'Profiller alınırken hata oluştu' },
      { status: 500 }
    );
  }
}

// POST - Create new profile
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const body = await request.json();
    
    // Check if profile with same locale already exists
    const existingProfile = await Profile.findOne({ locale: body.locale });
    if (existingProfile) {
      return NextResponse.json(
        { error: 'Bu dil için profil zaten mevcut' },
        { status: 400 }
      );
    }
    
    const profile = new Profile({
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastModified: new Date()
    });
    
    await profile.save();
    
    return NextResponse.json(profile, { status: 201 });
  } catch (error) {
    console.error('Error creating profile:', error);
    return NextResponse.json(
      { error: 'Profil oluşturulurken hata oluştu' },
      { status: 500 }
    );
  }
} 