import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import { Profile } from '@/lib/models/Profile';

export async function GET() {
  try {
    console.log('=== DEBUG PROFILE START ===');
    
    // Step 1: Connect to database
    await connectToDatabase();
    console.log('✅ Database connected');
    
    // Step 2: Get raw MongoDB connection
    const mongoose = require('mongoose');
    const db = mongoose.connection.db;
    console.log('✅ Database name:', db.databaseName);
    
    // Step 3: List all collections
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map((c: any) => c.name);
    console.log('✅ Available collections:', collectionNames);
    
    // Step 4: Check if userprofiles exists
    const hasUserProfiles = collectionNames.includes('userprofiles');
    console.log('✅ userprofiles collection exists:', hasUserProfiles);
    
    // Step 5: Direct query to userprofiles
    const directCount = await db.collection('userprofiles').countDocuments();
    console.log('✅ Direct count in userprofiles:', directCount);
    
    // Step 6: Get sample data
    const sampleData = await db.collection('userprofiles').findOne();
    console.log('✅ Sample document:', sampleData ? 'Found' : 'Not found');
    
    // Step 7: Test Profile model
    console.log('🔍 Testing Profile model...');
    console.log('🔍 Profile.collection.name:', Profile.collection.name);
    
    const modelCount = await Profile.countDocuments();
    console.log('🔍 Model count:', modelCount);
    
    const modelData = await Profile.find({}).lean();
    console.log('🔍 Model find result:', modelData.length);
    
    if (modelData.length > 0) {
      console.log('🔍 First model document:', modelData[0].name, modelData[0].locale);
    }
    
    console.log('=== DEBUG PROFILE END ===');
    
    return NextResponse.json({
      success: true,
      database: db.databaseName,
      collections: collectionNames,
      hasUserProfiles,
      directCount,
      hasSampleData: !!sampleData,
      sampleFields: sampleData ? Object.keys(sampleData) : [],
      // Model test results
      modelCollectionName: Profile.collection.name,
      modelCount,
      modelDataLength: modelData.length,
      modelWorks: modelCount > 0
    });
  } catch (error) {
    console.error('❌ DEBUG ERROR:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 