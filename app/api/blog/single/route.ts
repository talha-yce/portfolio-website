import { NextRequest, NextResponse } from "next/server";
import mongoose from 'mongoose';

// MongoDB bağlantı bilgileri
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://210541018:7sor4YST3m7N5GyV@ads-test.mnm2j0z.mongodb.net/web';

// Blog Post arayüzü
interface IBlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: any[];
  tags: string[];
  keywords: string[];
  locale: string;
  date: Date;
  isPublished: boolean;
  author: string;
  coverImage?: string;
  coverImageAlt?: string;
  metaDescription?: string;
  lastModified?: Date;
  readingTime?: number;
  relatedPosts?: string[];
}

// BlogPost şeması (basitleştirilmiş)
const BlogPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true },
  excerpt: { type: String, required: true },
  content: { type: Array, default: [] },
  tags: { type: [String], default: [] },
  keywords: { type: [String], default: [] },
  locale: { type: String, required: true, default: 'en' },
  date: { type: Date, default: Date.now },
  isPublished: { type: Boolean, default: true },
  author: { type: String, default: 'Admin' },
  coverImage: { type: String },
  coverImageAlt: { type: String },
  metaDescription: { type: String },
  lastModified: { type: Date, default: Date.now },
  readingTime: { type: Number, default: 0 },
  relatedPosts: { type: [String], default: [] }
}, {
  timestamps: true
});

// Direkt MongoDB bağlantısı kur
const connectDB = async () => {
  console.log('[API] MongoDB bağlantı girişimi...');
  try {
    if (mongoose.connection.readyState === 1) {
      console.log('[API] Zaten bağlı, mevcut bağlantı kullanılıyor');
      return mongoose;
    }
    
    const conn = await mongoose.connect(MONGODB_URI);
    console.log('[API] MongoDB bağlantısı başarılı', {
      host: conn.connection.host,
      name: conn.connection.name,
      readyState: conn.connection.readyState
    });
    return conn;
  } catch (error) {
    console.error('[API] MongoDB bağlantı hatası:', error);
    throw error;
  }
};

// GET a single blog post by slug
export async function GET(request: NextRequest) {
  console.log('[API/SINGLE] GET isteği alındı');
  try {
    const url = new URL(request.url);
    const slug = url.searchParams.get('slug');
    const locale = url.searchParams.get('locale');
    
    if (!slug || !locale) {
      console.error('[API/SINGLE] Slug veya locale parametresi eksik');
      return NextResponse.json({
        error: 'Slug ve locale parametreleri gerekli'
      }, { status: 400 });
    }
    
    // URL decode işlemi yap - çoklu decode için güvenli
    let decodedSlug = slug;
    try {
      // Çoklu decode uygulamak için - URL birden fazla encode edilmiş olabilir
      while (decodedSlug !== decodeURIComponent(decodedSlug)) {
        decodedSlug = decodeURIComponent(decodedSlug);
      }
    } catch (e) {
      console.error('[API/SINGLE] URL decode hatası, orijinal slug kullanılıyor');
      decodedSlug = slug;  // Decode edilemezse orijinal slug'ı kullan
    }
    
    console.log(`[API/SINGLE] Blog araması: orijinal="${slug}", decoded="${decodedSlug}", locale="${locale}"`);
    
    await connectDB();
    
    // BlogPost modelini oluştur
    let BlogPost: any;
    try {
      // Önce mevcut modeli silmeye çalışalım
      if (mongoose.models.BlogPost) {
        delete mongoose.models.BlogPost;
      }
      // Yeni model oluştur
      BlogPost = mongoose.model('BlogPost', BlogPostSchema);
      console.log('[API/SINGLE] BlogPost modeli yeniden oluşturuldu');
    } catch (e) {
      console.error('[API/SINGLE] Model oluşturma hatası:', e);
      BlogPost = mongoose.model('BlogPost');
      console.log('[API/SINGLE] Mevcut BlogPost modeli kullanılıyor');
    }
    
    // Tüm blog yazılarını çek ve slug eşleşmesini kontrol et
    const allPosts = await BlogPost.find({ locale }).lean();
    console.log(`[API/SINGLE] ${allPosts.length} adet ${locale} blog yazısı bulundu`);
    
    // Log tüm postların sluglarını
    console.log('[API/SINGLE] Veri tabanındaki tüm sluglar:', 
      allPosts.map((p: IBlogPost) => `"${p.slug}"`)
    );
    
    // İlk olarak tam eşleşme ara
    let post = allPosts.find((p: IBlogPost) => p.slug === decodedSlug);
    
    // Tam eşleşme bulunamazsa, normalize edilmiş slug'ları karşılaştır
    if (!post) {
      console.log('[API/SINGLE] Tam eşleşme bulunamadı, normalize edilmiş eşleşme deneniyor');
      
      // Normalize etme fonksiyonu
      const normalize = (text: string) => text
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ı/g, 'i')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c')
        .replace(/[^a-z0-9-]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      
      const normalizedSlug = normalize(decodedSlug);
      console.log(`[API/SINGLE] Normalize edilmiş slug: "${normalizedSlug}"`);
      
      post = allPosts.find((p: IBlogPost) => normalize(p.slug) === normalizedSlug);
    }
    
    if (!post) {
      console.log(`[API/SINGLE] Blog yazısı bulunamadı: "${decodedSlug}"`);
      return NextResponse.json({ error: 'Blog yazısı bulunamadı' }, { status: 404 });
    }
    
    // İçerik bölümlerini logla
    if (Array.isArray(post.content)) {
      console.log(`[API/SINGLE] İçerik bölümleri: ${post.content.length} adet`);
      // İlk 3 bölümü örnek olarak logla
      post.content.slice(0, 3).forEach((section: any, index: number) => {
        console.log(`[API/SINGLE] Bölüm ${index}:`, {
          type: section.type,
          contentPreview: section.content ? section.content.substring(0, 30) + '...' : 'boş içerik'
        });
      });
    } else {
      console.log(`[API/SINGLE] İçerik bölümleri dizi değil:`, post.content);
    }
    
    console.log(`[API/SINGLE] Blog yazısı bulundu: "${post.title}"`);
    
    // Yanıt nesnesini oluştur
    const response = {
      ...post,
      contentSectionCount: Array.isArray(post.content) ? post.content.length : 0
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('[API/SINGLE] Hata:', error);
    return NextResponse.json({ 
      error: 'Blog yazısı alınamadı',
      details: error instanceof Error ? error.message : 'Bilinmeyen hata' 
    }, { status: 500 });
  }
} 