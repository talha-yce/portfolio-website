import { NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import { Project } from '@/lib/models/Project'

// API route to seed the database with sample projects for development/testing
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
    console.log('Connecting to database for seeding projects...')
    await connectToDatabase()

    // Clear existing projects
    await Project.deleteMany({})
    console.log('Existing projects cleared')

    // Sample projects data
    const sampleProjects = [
      // Turkish projects
      {
        title: 'Snowboard Yarış Oyunu',
        slug: 'snowboard-race-game',
        description: 'Fizik tedavisi gören kişiler için Unity ile geliştirilen eğlenceli snowboard yarış oyunu prototipi.',
        content: [
          {
            type: 'paragraph',
            text: 'Bu proje, fizik tedavisi sürecini eğlenceli hale getirmek amacıyla Unity oyun motoru kullanılarak geliştirilmiş bir snowboard yarış oyunu prototipidir.'
          },
          {
            type: 'heading',
            text: 'Özellikler',
            level: 2
          },
          {
            type: 'list',
            items: [
              'Unity 3D oyun motoru ile geliştirildi',
              'Fizik tedavisi hastaları için özel tasarım',
              'Eğlenceli snowboard yarış mekaniği',
              'Motivasyonel oyun deneyimi'
            ]
          }
        ],
        date: new Date('2024-08-01'),
        locale: 'tr',
        tags: ['Unity', 'Spline', 'Yarış Oyunu', 'Fizik Tedavisi'],
        github: 'https://github.com/talhayuce/snowboard-race',
        status: 'completed',
        featured: true,
        isPublished: true,
        coverImage: '/data/images/projects/snowboard-race.jpg',
        metaDescription: 'Fizik tedavisi için Unity ile geliştirilmiş snowboard yarış oyunu',
        keywords: ['unity', 'oyun', 'snowboard', 'fizik tedavisi']
      },
      {
        title: 'Hang Gliding Oyunu',
        slug: 'hang-gliding-game',
        description: 'Fizik tedavisi gören kişiler için Unity ile geliştirilen 3D bir oyun prototipi.',
        content: [
          {
            type: 'paragraph',
            text: 'Unity ile geliştirdiğim 3D oyun prototipi. Fizik tedavisi sürecini desteklemek amacıyla tasarlanmış eğlenceli bir deneyim.'
          }
        ],
        date: new Date('2024-07-01'),
        locale: 'tr',
        tags: ['Unity', '3D Oyun', 'Fizik Tedavisi'],
        github: 'https://github.com/talhayuce/hang-gliding',
        status: 'completed',
        featured: true,
        isPublished: true,
        coverImage: '/data/images/projects/hang-gliding.jpg'
      },
      {
        title: 'Fly-rota',
        slug: 'fly-rota',
        description: 'Dünya çapındaki uçuş trafiğini gerçek zamanlı olarak görselleştiren bir web uygulaması.',
        content: [
          {
            type: 'paragraph',
            text: 'Gerçek zamanlı uçuş verilerini kullanarak dünya çapındaki hava trafiğini görselleştiren modern web uygulaması.'
          }
        ],
        date: new Date('2024-05-01'),
        locale: 'tr',
        tags: ['Web Geliştirme', 'Gerçek Zamanlı Veri', 'Görselleştirme'],
        demo: 'https://fly-rota.vercel.app',
        status: 'completed',
        featured: true,
        isPublished: true,
        coverImage: '/data/images/projects/fly-rota.jpg'
      },
      {
        title: 'Duygu Analizi ile Müzik Öneri Sistemi',
        slug: 'emotion-music-recommendation',
        description: 'Metindeki duyguları analiz eden ve analiz sonucuna göre müzik öneren bir web uygulaması.',
        content: [
          {
            type: 'paragraph',
            text: 'ASP.NET Core ve C# kullanılarak geliştirilmiş, metin tabanlı duygu analizi yapan ve sonuca göre müzik önerileri sunan web uygulaması.'
          }
        ],
        date: new Date('2023-11-01'),
        locale: 'tr',
        tags: ['ASP.NET Core', 'C#', 'Hugging Face API', 'MongoDB'],
        status: 'completed',
        featured: false,
        isPublished: true,
        coverImage: '/data/images/projects/sense-of-tunes.jpg'
      },
      // English projects
      {
        title: 'Snowboard Racing Game',
        slug: 'snowboard-race-game',
        description: 'A fun snowboard racing game prototype developed with Unity for people undergoing physical therapy.',
        content: [
          {
            type: 'paragraph',
            text: 'This project is a snowboard racing game prototype developed using the Unity game engine to make the physical therapy process enjoyable.'
          },
          {
            type: 'heading',
            text: 'Features',
            level: 2
          },
          {
            type: 'list',
            items: [
              'Developed with Unity 3D game engine',
              'Special design for physical therapy patients',
              'Fun snowboard racing mechanics',
              'Motivational gaming experience'
            ]
          }
        ],
        date: new Date('2024-08-01'),
        locale: 'en',
        tags: ['Unity', 'Spline', 'Racing Game', 'Physical Therapy'],
        github: 'https://github.com/talhayuce/snowboard-race',
        status: 'completed',
        featured: true,
        isPublished: true,
        coverImage: '/data/images/projects/snowboard-race.jpg',
        metaDescription: 'Snowboard racing game developed with Unity for physical therapy',
        keywords: ['unity', 'game', 'snowboard', 'physical therapy']
      },
      {
        title: 'Hang Gliding Game',
        slug: 'hang-gliding-game',
        description: 'A 3D game prototype developed with Unity for people undergoing physical therapy.',
        content: [
          {
            type: 'paragraph',
            text: 'A 3D game prototype I developed with Unity. Designed to support the physical therapy process with an enjoyable experience.'
          }
        ],
        date: new Date('2024-07-01'),
        locale: 'en',
        tags: ['Unity', '3D Game', 'Physical Therapy'],
        github: 'https://github.com/talhayuce/hang-gliding',
        status: 'completed',
        featured: true,
        isPublished: true,
        coverImage: '/data/images/projects/hang-gliding.jpg'
      },
      {
        title: 'Fly-rota',
        slug: 'fly-rota',
        description: 'A web application that visualizes real-time flight traffic worldwide.',
        content: [
          {
            type: 'paragraph',
            text: 'A modern web application that visualizes worldwide air traffic using real-time flight data.'
          }
        ],
        date: new Date('2024-05-01'),
        locale: 'en',
        tags: ['Web Development', 'Real-time Data', 'Visualization'],
        demo: 'https://fly-rota.vercel.app',
        status: 'completed',
        featured: true,
        isPublished: true,
        coverImage: '/data/images/projects/fly-rota.jpg'
      },
      {
        title: 'Emotion Analysis Music Recommendation System',
        slug: 'emotion-music-recommendation',
        description: 'A web application that analyzes emotions in text and recommends music based on the analysis results.',
        content: [
          {
            type: 'paragraph',
            text: 'A web application developed using ASP.NET Core and C# that performs text-based emotion analysis and provides music recommendations based on the results.'
          }
        ],
        date: new Date('2023-11-01'),
        locale: 'en',
        tags: ['ASP.NET Core', 'C#', 'Hugging Face API', 'MongoDB'],
        status: 'completed',
        featured: false,
        isPublished: true,
        coverImage: '/data/images/projects/sense-of-tunes.jpg'
      }
    ]

    // Insert sample projects
    await Project.insertMany(sampleProjects)
    console.log('Sample projects inserted')

    // Verify the data
    const trCount = await Project.countDocuments({ locale: 'tr' })
    const enCount = await Project.countDocuments({ locale: 'en' })
    const featuredTr = await Project.countDocuments({ locale: 'tr', featured: true })
    const featuredEn = await Project.countDocuments({ locale: 'en', featured: true })

    console.log(`Turkish projects: ${trCount} (${featuredTr} featured)`)
    console.log(`English projects: ${enCount} (${featuredEn} featured)`)

    return NextResponse.json({
      success: true,
      message: 'Sample projects seeded successfully',
      stats: {
        turkish: { total: trCount, featured: featuredTr },
        english: { total: enCount, featured: featuredEn }
      }
    })
  } catch (error) {
    console.error('Error seeding projects:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to seed projects', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// GET method to check project stats
export async function GET() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { success: false, message: 'This route is only available in development mode' },
      { status: 403 }
    )
  }

  try {
    await connectToDatabase()

    const trCount = await Project.countDocuments({ locale: 'tr' })
    const enCount = await Project.countDocuments({ locale: 'en' })
    const featuredTr = await Project.countDocuments({ locale: 'tr', featured: true })
    const featuredEn = await Project.countDocuments({ locale: 'en', featured: true })

    return NextResponse.json({
      success: true,
      stats: {
        turkish: { total: trCount, featured: featuredTr },
        english: { total: enCount, featured: featuredEn }
      }
    })
  } catch (error) {
    console.error('Error checking project stats:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to check project stats' },
      { status: 500 }
    )
  }
} 