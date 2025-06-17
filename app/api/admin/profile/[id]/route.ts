import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Profile } from '@/lib/models/Profile';
import { Types } from 'mongoose';

// GET - Fetch single profile by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    
    const { id } = params;
    
    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Geçersiz profil ID' },
        { status: 400 }
      );
    }
    
    const profile = await Profile.findById(id);
    
    if (!profile) {
      return NextResponse.json(
        { error: 'Profil bulunamadı' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Profil alınırken hata oluştu' },
      { status: 500 }
    );
  }
}

// PUT - Update profile by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    
    const { id } = params;
    const body = await request.json();
    
    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Geçersiz profil ID' },
        { status: 400 }
      );
    }
    
    const profile = await Profile.findByIdAndUpdate(
      id,
      {
        ...body,
        updatedAt: new Date(),
        lastModified: new Date()
      },
      { new: true, runValidators: true }
    );
    
    if (!profile) {
      return NextResponse.json(
        { error: 'Profil bulunamadı' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Profil güncellenirken hata oluştu' },
      { status: 500 }
    );
  }
}

// DELETE - Delete profile by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    
    const { id } = params;
    
    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Geçersiz profil ID' },
        { status: 400 }
      );
    }
    
    const profile = await Profile.findByIdAndDelete(id);
    
    if (!profile) {
      return NextResponse.json(
        { error: 'Profil bulunamadı' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ message: 'Profil başarıyla silindi' });
  } catch (error) {
    console.error('Error deleting profile:', error);
    return NextResponse.json(
      { error: 'Profil silinirken hata oluştu' },
      { status: 500 }
    );
  }
} 