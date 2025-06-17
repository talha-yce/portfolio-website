import { NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import { Profile } from '@/lib/models/Profile'

// API route to seed the database with profile data from existing JSON files
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
    console.log('Connecting to database for seeding profiles...')
    await connectToDatabase()

    // Clear existing profiles
    await Profile.deleteMany({})
    console.log('Existing profiles cleared')

    // Turkish profile data
    const turkishProfile = {
      name: "Talha Yüce",
      title: "Yazılım Mühendisi",
      email: "yucetalha00@gmail.com",
      phone: "+90 538 550 7019",
      location: "Mersin, Türkiye",
      bio: "Fırat Üniversitesi'nde yazılım mühendisliği öğrencisiyim ve web geliştirme, oyun geliştirme ve yapay zeka uygulamaları konularında tutkuluyum. Çeşitli programlama dilleri ve çerçeveleri konusunda deneyimim var ve her zaman yeni teknolojiler öğrenmeye hevesliyim.",
      github: "https://github.com/talha-yce",
      linkedin: "https://www.linkedin.com/in/talha-yüce/",
      profileImage: "/data/images/profile/talha-yuce.jpg",
      locale: "tr",
      languages: [
        {
          name: "Türkçe",
          level: "Anadil"
        },
        {
          name: "İngilizce",
          level: "A2"
        }
      ],
      education: [
        {
          degree: "Yazılım Mühendisliği",
          institution: "Fırat Üniversitesi",
          date: "2021 - Devam Ediyor",
          description: "Şu anda Elazığ, Türkiye'deki Fırat Üniversitesi'nde Yazılım Mühendisliği alanında lisans eğitimi almaktayım."
        }
      ],
      experience: [
        {
          title: "Unity Oyun Geliştirme Stajyeri",
          company: "İnosens Bilişim Teknolojileri",
          date: "Temmuz 2024 - Eylül 2024",
          description: "Fizik tedavi hastaları için 3B oyun prototipi ve snowboard yarış oyunu dahil olmak üzere Unity oyun geliştirme projeleri üzerinde çalıştım."
        }
      ],
      skills: [
        {
          category: "Programlama Dilleri",
          items: ["Java", "Python", "C#", "JavaScript", "HTML", "CSS"]
        },
        {
          category: "Web Geliştirme",
          items: ["HTML", "JavaScript", "CSS", "ASP.NET", "Web API", "React", "React Native"]
        },
        {
          category: "Veritabanları",
          items: ["MySQL", "MS SQL", "MongoDB", "Firebase"]
        },
        {
          category: "Araçlar ve Ortamlar",
          items: ["Visual Studio", "Unity", "Visual Studio Code", "Git", "GitHub"]
        }
      ],
      certifications: [
        {
          title: "Unity Oyun Geliştirme",
          issuer: "Udemy",
          date: "Temmuz 2023 - Eylül 2023"
        },
        {
          title: "Sürüm Kontrolü: Git ve GitHub",
          issuer: "BTK Akademi",
          date: "Ağustos 2023 - Eylül 2023"
        },
        {
          title: "Unity Dijital Oyun Geliştirme",
          issuer: "BTK Akademi",
          date: "Ağustos 2023 - Ekim 2023"
        },
        {
          title: "Web Geliştirme",
          issuer: "BTK Akademi",
          date: "Ocak 2024 - Devam Ediyor"
        },
        {
          title: "Unity için Programlama Tasarım Kalıpları",
          issuer: "Udemy",
          date: "Haziran 2024"
        }
      ]
    }

    // English profile data
    const englishProfile = {
      name: "Talha Yüce",
      title: "Software Engineer",
      email: "yucetalha00@gmail.com",
      phone: "+90 538 550 7019",
      location: "Mersin, Turkey",
      bio: "I am a software engineering student at Firat University with a passion for web development, game development, and AI applications. I have experience with various programming languages and frameworks, and I am always eager to learn new technologies.",
      github: "https://github.com/talha-yce",
      linkedin: "https://www.linkedin.com/in/talha-yüce/",
      profileImage: "/data/images/profile/talha-yuce.jpg",
      locale: "en",
      languages: [
        {
          name: "Turkish",
          level: "Native"
        },
        {
          name: "English",
          level: "A2"
        }
      ],
      education: [
        {
          degree: "Software Engineering",
          institution: "Firat University",
          date: "2021 - Present",
          description: "Currently pursuing a degree in Software Engineering at Firat University, Elazig, Turkey."
        }
      ],
      experience: [
        {
          title: "Unity Game Development Internship",
          company: "İnosens Bilişim Teknolojileri",
          date: "July 2024 - September 2024",
          description: "Worked on Unity game development projects, including a 3D game prototype for physical therapy patients and a snowboard racing game."
        }
      ],
      skills: [
        {
          category: "Programming Languages",
          items: ["Java", "Python", "C#", "JavaScript", "HTML", "CSS"]
        },
        {
          category: "Web Development",
          items: ["HTML", "JavaScript", "CSS", "ASP.NET", "Web API", "React", "React Native"]
        },
        {
          category: "Databases",
          items: ["MySQL", "MS SQL", "MongoDB", "Firebase"]
        },
        {
          category: "Tools & Environments",
          items: ["Visual Studio", "Unity", "Visual Studio Code", "Git", "GitHub"]
        }
      ],
      certifications: [
        {
          title: "Unity Game Development",
          issuer: "Udemy",
          date: "July 2023 - September 2023"
        },
        {
          title: "Version Control: Git and GitHub",
          issuer: "BTK Akademi",
          date: "August 2023 - September 2023"
        },
        {
          title: "Unity Digital Game Development",
          issuer: "BTK Akademi",
          date: "August 2023 - October 2023"
        },
        {
          title: "Web Development",
          issuer: "BTK Akademi",
          date: "January 2024 - Present"
        },
        {
          title: "Programming Design Patterns for Unity",
          issuer: "Udemy",
          date: "June 2024"
        }
      ]
    }

    // Insert profiles
    await Profile.insertMany([turkishProfile, englishProfile])
    console.log('Profile data seeded successfully')

    // Verify the data
    const trProfile = await Profile.findOne({ locale: 'tr' })
    const enProfile = await Profile.findOne({ locale: 'en' })

    return NextResponse.json({
      success: true,
      message: 'Profile data seeded successfully',
      profiles: {
        turkish: trProfile ? { name: trProfile.name, locale: trProfile.locale } : null,
        english: enProfile ? { name: enProfile.name, locale: enProfile.locale } : null
      }
    })
  } catch (error) {
    console.error('Error seeding profile data:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to seed profile data', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// GET method to check profile data
export async function GET() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { success: false, message: 'This route is only available in development mode' },
      { status: 403 }
    )
  }

  try {
    await connectToDatabase()

    const trProfile = await Profile.findOne({ locale: 'tr' })
    const enProfile = await Profile.findOne({ locale: 'en' })

    return NextResponse.json({
      success: true,
      profiles: {
        turkish: trProfile ? { name: trProfile.name, locale: trProfile.locale, _id: trProfile._id } : null,
        english: enProfile ? { name: enProfile.name, locale: enProfile.locale, _id: enProfile._id } : null
      }
    })
  } catch (error) {
    console.error('Error checking profile data:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to check profile data' },
      { status: 500 }
    )
  }
} 