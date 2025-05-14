import { NextRequest, NextResponse } from "next/server";
import mongoose from 'mongoose';

// MongoDB bağlantı bilgileri
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://210541018:7sor4YST3m7N5GyV@ads-test.mnm2j0z.mongodb.net/web';

// Interface tanımı
interface IBlogPost {
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
  _id?: string;
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
  lastModified: { type: Date, default: Date.now }
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

// GET blog posts
export async function GET(request: NextRequest) {
  console.log('[API] GET isteği alındı');
  try {
    const url = new URL(request.url);
    const slug = url.searchParams.get('slug');
    const locale = url.searchParams.get('locale');
    
    await connectDB();
    let BlogPost: any;
    try {
      BlogPost = mongoose.model('BlogPost');
    } catch (e) {
      BlogPost = mongoose.model('BlogPost', BlogPostSchema);
    }
    
    // If slug and locale are provided, fetch a single post
    if (slug && locale) {
      console.log(`[API] Slug ${slug} ve locale ${locale} için blog yazısı aranıyor`);
      const post = await (BlogPost as any).findOne({ 
        slug: slug,
        locale: locale 
      }).lean();
      
      if (!post) {
        console.log(`[API] Blog yazısı bulunamadı: ${slug}`);
        return NextResponse.json({ error: 'Blog yazısı bulunamadı' }, { status: 404 });
      }
      
      console.log(`[API] Blog yazısı bulundu: ${post.title}`);
      return NextResponse.json(post);
    }
    
    // Otherwise, return all published posts
    const posts = await (BlogPost as any).find({ isPublished: true }).lean();
    console.log(`[API] ${posts.length} blog yazısı bulundu`);
    
    return NextResponse.json(posts);
  } catch (error) {
    console.error('[API] GET hatası:', error);
    return NextResponse.json({ error: 'Blog yazıları alınamadı' }, { status: 500 });
  }
}

// POST to create a blog post
export async function POST(request: NextRequest) {
  console.log('[API] POST isteği alındı');
  try {
    const data = await request.json();
    console.log('[API] Blog yazısı verileri:', {
      title: data.title,
      slug: data.slug,
      locale: data.locale,
      hasCoverImage: !!data.coverImage,
      hasMetaDescription: !!data.metaDescription,
      contentSections: Array.isArray(data.content) ? data.content.length : 'content is not an array'
    });
    
    // Bir örnek içerik bölümünü logla (varsa)
    if (Array.isArray(data.content) && data.content.length > 0) {
      console.log('[API] İlk içerik bölümü örneği:', data.content[0]);
    }
    
    // Bağlantı kur
    await connectDB();
    console.log('[API] MongoDB bağlantısı kuruldu');
    
    // Model oluştur veya al
    let BlogPost: any;
    try {
      BlogPost = mongoose.model('BlogPost');
      console.log('[API] Mevcut BlogPost modeli kullanılıyor');
    } catch (e) {
      BlogPost = mongoose.model('BlogPost', BlogPostSchema);
      console.log('[API] Yeni BlogPost modeli oluşturuldu');
    }
    
    // Mevcut slug kontrolü
    const existing = await (BlogPost as any).findOne({ slug: data.slug, locale: data.locale }).lean();
    if (existing) {
      console.log(`[API] Bu slug zaten kullanılıyor: ${data.slug}`);
      return NextResponse.json(
        { error: 'Bu slug zaten kullanılıyor' },
        { status: 409 }
      );
    }
    
    // Doğrudan veritabanına ekle (validasyon olmadan)
    console.log('[API] Blog yazısı oluşturuluyor...');
    const blogDoc = new BlogPost({
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: data.content || [],
      tags: data.tags || [],
      keywords: data.keywords || [],
      locale: data.locale,
      date: new Date(),
      isPublished: data.isPublished !== false,
      coverImage: data.coverImage || '',
      coverImageAlt: data.coverImageAlt || '',
      metaDescription: data.metaDescription || ''
    });
    
    const savedBlog = await blogDoc.save();
    console.log('[API] Blog yazısı başarıyla oluşturuldu:', {
      id: savedBlog._id.toString(),
      title: savedBlog.title
    });
    
    return NextResponse.json({
      success: true,
      _id: savedBlog._id.toString(),
      title: savedBlog.title,
      slug: savedBlog.slug
    }, { status: 201 });
  } catch (error) {
    console.error('[API] POST hatası:', error);
    
    // Hata detaylarını logla
    if (error instanceof Error) {
      console.error('[API] Hata tipi:', error.name);
      console.error('[API] Hata mesajı:', error.message);
      console.error('[API] Hata yığını:', error.stack);
    }
    
    return NextResponse.json({ 
      error: 'Blog yazısı oluşturulamadı',
      details: error instanceof Error ? error.message : 'Bilinmeyen hata'
    }, { status: 500 });
  }
}

// PUT to update a blog post
export async function PUT(request: NextRequest) {
  console.log('[API] PUT isteği alındı');
  try {
    const data = await request.json();
    console.log('[API] Blog güncelleme verileri:', {
      _id: data._id,
      title: data.title,
      slug: data.slug,
      hasCoverImage: !!data.coverImage,
      hasMetaDescription: !!data.metaDescription,
      contentSections: Array.isArray(data.content) ? data.content.length : 'content is not an array'
    });
    
    await connectDB();
    
    let BlogPost: any;
    try {
      BlogPost = mongoose.model('BlogPost');
    } catch (e) {
      BlogPost = mongoose.model('BlogPost', BlogPostSchema);
    }
    
    const updatedPost = await (BlogPost as any).findByIdAndUpdate(
      data._id,
      { ...data, lastModified: new Date() },
      { new: true }
    );
    
    if (!updatedPost) {
      return NextResponse.json({ error: 'Blog yazısı bulunamadı' }, { status: 404 });
    }
    
    return NextResponse.json(updatedPost);
  } catch (error) {
    console.error('[API] PUT hatası:', error);
    return NextResponse.json({ error: 'Blog yazısı güncellenemedi' }, { status: 500 });
  }
}

// DELETE a blog post
export async function DELETE(request: NextRequest) {
  console.log('[API] DELETE isteği alındı');
  const url = new URL(request.url);
  const id = url.searchParams.get('id');
  
  if (!id) {
    return NextResponse.json({ error: 'ID eksik' }, { status: 400 });
  }
  
  try {
    await connectDB();
    
    let BlogPost: any;
    try {
      BlogPost = mongoose.model('BlogPost');
    } catch (e) {
      BlogPost = mongoose.model('BlogPost', BlogPostSchema);
    }
    
    await (BlogPost as any).findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[API] DELETE hatası:', error);
    return NextResponse.json({ error: 'Blog yazısı silinemedi' }, { status: 500 });
  }
} 