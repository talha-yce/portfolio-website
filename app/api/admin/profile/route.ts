import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Profile } from '@/lib/models/Profile';
import mongoose from 'mongoose';

// GET - Fetch all profiles
export async function GET() {
  try {
    console.log('[Admin API] Profile GET request başladı');
    await connectToDatabase();
    
    // Mongoose modellerini temizle ve yeniden yükle
    if (mongoose.models.Profile) {
      delete mongoose.models.Profile;
    }
    
    // Profile modelini yeniden import et
    require('@/lib/models/Profile');
    
    // Check collection directly to ensure we're getting fresh data
    const db = mongoose.connection.db;
    const directProfiles = await db.collection('userprofiles').find({}).toArray();
    console.log(`[Admin API] Direct query: ${directProfiles.length} profil bulundu`);
    
    // Transform ObjectId to string for JSON serialization
    const transformedProfiles = directProfiles.map((profile: any) => ({
      ...profile,
      _id: profile._id.toString()
    }));
    
    console.log('[Admin API] Returning profiles:', transformedProfiles.length);
    if (transformedProfiles.length > 0) {
      const firstProfile = transformedProfiles[0];
      console.log(`[Admin API] İlk profil: ${firstProfile.name}, locale: ${firstProfile.locale}`);
      console.log(`[Admin API] İlk profil deneyimleri: ${firstProfile.experience?.length || 0}`);
      if (firstProfile.experience?.length > 0) {
        console.log(`[Admin API] İlk deneyim: ${firstProfile.experience[0].company}`);
      }
    }
    
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