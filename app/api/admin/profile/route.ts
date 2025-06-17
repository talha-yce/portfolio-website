import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Profile } from '@/lib/models/Profile';

// GET - Fetch all profiles
export async function GET() {
  try {
    console.log('[Admin API] Profile GET request başladı');
    await connectToDatabase();
    
    // Check collection directly first
    const mongoose = require('mongoose');
    const db = mongoose.connection.db;
    const directProfiles = await db.collection('userprofiles').find({}).toArray();
    console.log(`[Admin API] Direct query: ${directProfiles.length} profil bulundu`);
    
    const profiles = await Profile.find({}).sort({ locale: 1, createdAt: -1 }).lean();
    
    console.log(`[Admin API] Model query: ${profiles.length} profil bulundu`);
    console.log(`[Admin API] Collection name: ${Profile.collection.name}`);
    
    if (profiles.length > 0) {
      console.log(`[Admin API] İlk profil:`, profiles[0].name, profiles[0].locale);
    }
    
    // If model query is empty but direct query has data, use direct query
    if (profiles.length === 0 && directProfiles.length > 0) {
      console.log('[Admin API] Using direct query results');
      const transformedDirectProfiles = directProfiles.map((profile: any) => ({
        ...profile,
        _id: profile._id.toString()
      }));
      return NextResponse.json(transformedDirectProfiles);
    }
    
    // Transform ObjectId to string for JSON serialization
    const transformedProfiles = profiles.map((profile: any) => ({
      ...profile,
      _id: profile._id.toString()
    }));
    
    console.log('[Admin API] Returning profiles:', transformedProfiles.length);
    return NextResponse.json(transformedProfiles);
  } catch (error) {
    console.error('[Admin API] Error fetching profiles:', error);
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