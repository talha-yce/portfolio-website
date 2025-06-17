import connectToDatabase from '@/lib/mongodb'
import { Profile, type IProfile } from '@/lib/models/Profile'
import type { Locale } from '@/lib/i18n/config'

export async function getProfile(locale: Locale) {
  try {
    console.log(`[ProfileService] getProfile("${locale}") başladı`);
    await connectToDatabase()
    
    const profile = await Profile.findOne({ locale }).lean()
    
    if (!profile) {
      console.log(`[ProfileService] ${locale} için profil bulunamadı`);
      return null
    }
    
    console.log(`[ProfileService] ${locale} profili bulundu: ${(profile as any).name}`);
    return {
      ...(profile as any),
      _id: (profile as any)._id.toString()
    }
  } catch (error) {
    console.error('[ProfileService] Profil getirirken hata:', error)
    return null
  }
}

export async function updateProfile(locale: Locale, profileData: Partial<IProfile>) {
  try {
    console.log(`[ProfileService] updateProfile("${locale}") başladı`);
    await connectToDatabase()
    
    const updatedProfile = await Profile.findOneAndUpdate(
      { locale },
      { ...profileData, locale, lastModified: new Date() },
      { new: true, upsert: true, runValidators: true }
    ).lean()
    
    console.log(`[ProfileService] ${locale} profili güncellendi`);
    return {
      ...(updatedProfile as any),
      _id: (updatedProfile as any)._id.toString()
    }
  } catch (error) {
    console.error('[ProfileService] Profil güncellenirken hata:', error)
    throw error
  }
}

export async function createProfile(profileData: IProfile) {
  try {
    console.log(`[ProfileService] createProfile("${profileData.locale}") başladı`);
    await connectToDatabase()
    
    const profile = new Profile({
      ...profileData,
      lastModified: new Date()
    })
    
    const savedProfile = await profile.save()
    console.log(`[ProfileService] ${profileData.locale} profili oluşturuldu`);
    
    return {
      ...savedProfile.toObject(),
      _id: savedProfile._id.toString()
    }
  } catch (error) {
    console.error('[ProfileService] Profil oluşturulurken hata:', error)
    throw error
  }
}

export async function getAllProfiles() {
  try {
    console.log(`[ProfileService] getAllProfiles() başladı`);
    await connectToDatabase()
    
    const profiles = await Profile.find({}).lean()
    
    console.log(`[ProfileService] ${profiles.length} profil bulundu`);
    return profiles.map((profile: any) => ({
      ...profile,
      _id: profile._id.toString()
    }))
  } catch (error) {
    console.error('[ProfileService] Profiller getirirken hata:', error)
    return []
  }
}

// Get user data for CV (compatible with old cv-manager interface)
export async function getUserData(locale: string = 'en'): Promise<any> {
  try {
    console.log(`[ProfileService] getUserData("${locale}") başladı`);
    const profile = await getProfile(locale as Locale);
    
    if (!profile) {
      console.log(`[ProfileService] ${locale} için profil bulunamadı, fallback deneniyor`);
      // Fallback to default locale if requested locale not found
      if (locale !== 'en') {
        return getUserData('en');
      }
      // Return empty data if no profile found
      console.log(`[ProfileService] Hiç profil bulunamadı, boş data dönüyor`);
      return {
        name: "",
        title: "",
        email: "",
        phone: "",
        location: "",
        bio: "",
        github: "",
        linkedin: "",
        profileImage: "/placeholder.svg?height=400&width=400",
        languages: [],
        education: [],
        experience: [],
        skills: [],
        certifications: [],
      };
    }
    
    console.log(`[ProfileService] ${locale} profili dönüştürülüyor: ${profile.name}`);
    // Transform database profile to match cv-manager interface
    return {
      name: profile.name || "",
      title: profile.title || "",
      email: profile.email || "",
      phone: profile.phone || "",
      location: profile.location || "",
      bio: profile.bio || "",
      github: profile.github || "",
      linkedin: profile.linkedin || "",
      profileImage: profile.profileImage || "/placeholder.svg?height=400&width=400",
      languages: profile.languages || [],
      education: profile.education || [],
      experience: profile.experience || [],
      skills: profile.skills || [],
      certifications: profile.certifications || [],
    };
  } catch (error) {
    console.error('[ProfileService] getUserData hatası:', error);
    // Return empty data on error
    return {
      name: "",
      title: "",
      email: "",
      phone: "",
      location: "",
      bio: "",
      github: "",
      linkedin: "",
      profileImage: "/placeholder.svg?height=400&width=400",
      languages: [],
      education: [],
      experience: [],
      skills: [],
      certifications: [],
    };
  }
} 