import connectToDatabase from '@/lib/mongodb'
import { Project, type IProject } from '@/lib/models/Project'
import type { Locale } from '@/lib/i18n/config'

// Ensure dates are properly formatted for display
const formatDate = (date: Date | string, locale: Locale): string => {
  const dateObj = date instanceof Date ? date : new Date(date)
  
  if (isNaN(dateObj.getTime())) {
    console.warn(`Invalid date detected: ${date}, using fallback format`)
    return String(date)
  }
  
  return dateObj.toLocaleDateString(locale === 'tr' ? 'tr-TR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export async function getAllProjects(locale: Locale) {
  try {
    console.log(`[ProjectService] getAllProjects("${locale}") başladı`);
    await connectToDatabase()
    
    const projects = await Project.find({ 
      locale, 
      isPublished: true 
    })
    .sort({ date: -1 })
    .lean()
    
    console.log(`[ProjectService] ${projects.length} proje bulundu`);
    return projects.map((project: any) => ({
      ...project,
      _id: project._id.toString(),
      formattedDate: formatDate(project.date, locale),
    }))
  } catch (error) {
    console.error('[ProjectService] Projeleri getirirken hata:', error)
    return []
  }
}

export async function getFeaturedProjects(locale: Locale, limit: number = 3) {
  try {
    console.log(`[ProjectService] getFeaturedProjects("${locale}", ${limit}) başladı`);
    await connectToDatabase()
    
    let featuredProjects: any[] = []
    
    // 1. Önce featured=true olan projeler (en son tarihli)
    const explicitlyFeatured = await Project.find({ 
      locale, 
      isPublished: true,
      featured: true
    })
    .sort({ date: -1 })
    .limit(limit)
    .lean()
    
    featuredProjects = [...explicitlyFeatured]
    console.log(`[ProjectService] ${explicitlyFeatured.length} açıkça öne çıkarılmış proje bulundu`);
    
    // 2. Eğer yeterli değilse, demo linki olan projeler ekle (featured=false olanlardan)
    if (featuredProjects.length < limit) {
      const remainingLimit = limit - featuredProjects.length
      const demoProjects = await Project.find({ 
        locale, 
        isPublished: true,
        featured: { $ne: true }, // featured olmayan
        demo: { $exists: true, $ne: '' },
        _id: { $nin: featuredProjects.map(p => p._id) }
      })
      .sort({ date: -1 })
      .limit(remainingLimit)
      .lean()
      
      featuredProjects = [...featuredProjects, ...demoProjects]
      console.log(`[ProjectService] ${demoProjects.length} demo linki olan proje eklendi`);
    }
    
    // 3. Eğer hala yeterli değilse, GitHub linki olan projeler ekle
    if (featuredProjects.length < limit) {
      const remainingLimit = limit - featuredProjects.length
      const githubProjects = await Project.find({ 
        locale, 
        isPublished: true,
        featured: { $ne: true }, // featured olmayan
        github: { $exists: true, $ne: '' },
        demo: { $exists: false }, // demo linki olmayan
        _id: { $nin: featuredProjects.map(p => p._id) }
      })
      .sort({ date: -1 })
      .limit(remainingLimit)
      .lean()
      
      featuredProjects = [...featuredProjects, ...githubProjects]
      console.log(`[ProjectService] ${githubProjects.length} GitHub linki olan proje eklendi`);
    }
    
    // 4. Hala yeterli değilse, diğer projelerden ekle
    if (featuredProjects.length < limit) {
      const remainingLimit = limit - featuredProjects.length
      const otherProjects = await Project.find({ 
        locale, 
        isPublished: true,
        featured: { $ne: true }, // featured olmayan
        _id: { $nin: featuredProjects.map(p => p._id) }
      })
      .sort({ date: -1 })
      .limit(remainingLimit)
      .lean()
      
      featuredProjects = [...featuredProjects, ...otherProjects]
      console.log(`[ProjectService] ${otherProjects.length} diğer proje eklendi`);
    }
    
    console.log(`[ProjectService] Toplam ${featuredProjects.length} öne çıkan proje seçildi`);
    console.log(`[ProjectService] Seçilen projeler:`, featuredProjects.map(p => ({ title: p.title, featured: p.featured, demo: !!p.demo, github: !!p.github })));
    
    return featuredProjects.map((project: any) => ({
      ...project,
      _id: project._id.toString(),
      formattedDate: formatDate(project.date, locale),
    }))
  } catch (error) {
    console.error('[ProjectService] Öne çıkan projeleri getirirken hata:', error)
    return []
  }
}

export async function getProjectBySlug(slug: string, locale: Locale) {
  try {
    console.log(`[ProjectService] getProjectBySlug("${slug}", "${locale}") başladı`);
    await connectToDatabase()
    
    const project = await Project.findOne({ 
      slug, 
      locale, 
      isPublished: true 
    }).lean()
    
    if (!project) {
      console.log(`[ProjectService] Proje bulunamadı: ${slug}`);
      return null
    }
    
    console.log(`[ProjectService] Proje bulundu: ${(project as any).title}`);
    return {
      ...(project as any),
      _id: (project as any)._id.toString(),
      formattedDate: formatDate((project as any).date, locale),
    }
  } catch (error) {
    console.error(`[ProjectService] "${slug}" sluglı projeyi getirirken hata:`, error)
    return null
  }
}

export async function getProjectsByTag(tag: string, locale: Locale) {
  try {
    console.log(`[ProjectService] getProjectsByTag("${tag}", "${locale}") başladı`);
    await connectToDatabase()
    
    const projects = await Project.find({ 
      locale, 
      isPublished: true,
      tags: { $in: [tag] }
    })
    .sort({ date: -1 })
    .lean()
    
    console.log(`[ProjectService] ${projects.length} proje bulundu (tag: ${tag})`);
    return projects.map((project: any) => ({
      ...project,
      _id: project._id.toString(),
      formattedDate: formatDate(project.date, locale),
    }))
  } catch (error) {
    console.error(`[ProjectService] "${tag}" etiketli projeleri getirirken hata:`, error)
    return []
  }
}

export async function getRelatedProjects(projectId: string, tags: string[], locale: Locale, limit: number = 3) {
  try {
    console.log(`[ProjectService] getRelatedProjects başladı`);
    await connectToDatabase()
    
    const projects = await Project.find({ 
      _id: { $ne: projectId },
      locale, 
      isPublished: true,
      tags: { $in: tags }
    })
    .sort({ date: -1 })
    .limit(limit)
    .lean()
    
    console.log(`[ProjectService] ${projects.length} ilgili proje bulundu`);
    return projects.map((project: any) => ({
      ...project,
      _id: project._id.toString(),
      formattedDate: formatDate(project.date, locale),
    }))
  } catch (error) {
    console.error('[ProjectService] İlgili projeleri getirirken hata:', error)
    return []
  }
}

export async function getAllProjectTags(locale: Locale): Promise<string[]> {
  try {
    console.log(`[ProjectService] getAllProjectTags("${locale}") başladı`);
    await connectToDatabase()
    
    const result = await Project.aggregate([
      { $match: { locale, isPublished: true } },
      { $unwind: '$tags' },
      { $group: { _id: '$tags' } },
      { $sort: { _id: 1 } }
    ])
    
    console.log(`[ProjectService] ${result.length} benzersiz tag bulundu`);
    return result.map(item => item._id)
  } catch (error) {
    console.error('[ProjectService] Proje taglerini getirirken hata:', error)
    return []
  }
}

export async function getProjectsCount(locale: Locale): Promise<number> {
  try {
    console.log(`[ProjectService] getProjectsCount("${locale}") başladı`);
    await connectToDatabase()
    
    const count = await Project.countDocuments({ 
      locale, 
      isPublished: true 
    })
    
    console.log(`[ProjectService] Toplam ${count} proje sayısı`);
    return count
  } catch (error) {
    console.error('[ProjectService] Proje sayısını getirirken hata:', error)
    return 0
  }
} 