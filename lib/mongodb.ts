import mongoose from 'mongoose';

// Bağlantı URL'sini çevresel değişkenden al veya yedek değeri kullan
// İdeal olarak bu bilgi gizli tutulmalı ve yalnızca güvenli şekilde çevresel değişkenlerden alınmalıdır
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://210541018:7sor4YST3m7N5GyV@ads-test.mnm2j0z.mongodb.net/web';

if (!MONGODB_URI) {
  console.error('[MongoDB] MONGODB_URI çevresel değişkeni eksik!');
  throw new Error('Please define the MONGODB_URI environment variable');
}

console.log('[MongoDB] Kullanılan MongoDB URI:', MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@'));

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
// Global mongoose connection cache
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function connectToDatabase() {
  // Eğer zaten bağlıysak, mevcut bağlantıyı döndür
  if (cached.conn) {
    console.log('[MongoDB] Mevcut bağlantı kullanılıyor');
    return cached.conn;
  }

  // Süreçte zaten bir bağlantı denemesi varsa, onu bekle
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      // Bağlantı seçeneklerini geliştirme
      connectTimeoutMS: 10000, // 10 saniye bağlantı zaman aşımı
      socketTimeoutMS: 45000, // 45 saniye soket zaman aşımı
      // Sunucu keşfi ve topografisi izleme
      serverSelectionTimeoutMS: 5000, // Sunucu seçimi zaman aşımı
      // Yeniden bağlantı stratejileri
      maxPoolSize: 10, // Bağlantı havuzundaki maksimum bağlantı sayısı
      // Otomatik yeniden bağlanma davranışını yapılandırma
      heartbeatFrequencyMS: 10000, // 10 saniyede bir kalp atışı
    };

    console.log('[MongoDB] Yeni bir MongoDB bağlantısı kurulmaya çalışılıyor...');
    
    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log('[MongoDB] MongoDB bağlantısı başarılı!');
        console.log(`[MongoDB] Bağlantı durumu: ${mongoose.connection.readyState === 1 ? 'Bağlı' : 'Bağlı değil'}`);
        
        // Veritabanı adını güvenli bir şekilde al
        if (mongoose.connection.db) {
          console.log(`[MongoDB] Bağlantı veritabanı adı: ${mongoose.connection.db.databaseName}`);
          
          // MongoDB versiyonunu almaya çalış
          try {
            mongoose.connection.db.admin().serverInfo()
              .then(info => console.log(`[MongoDB] Sunucu versiyonu: ${info.version}`))
              .catch(err => console.log('[MongoDB] Sunucu versiyonu alınamadı'));
          } catch (e) {
            console.log('[MongoDB] Sunucu versiyonu alınamadı');
          }
        } else {
          console.log('[MongoDB] Veritabanı bağlantısı henüz hazır değil');
        }
        
        // Bağlantı hata olayı dinleyicisi
        mongoose.connection.on('error', (err) => {
          console.error('[MongoDB] Bağlantı hatası:', err);
        });
        
        // Bağlantı kesme olayı dinleyicisi
        mongoose.connection.on('disconnected', () => {
          console.warn('[MongoDB] Bağlantı kesildi, yeniden bağlanmaya çalışılıyor...');
        });
        
        // Yeniden bağlanma olayı dinleyicisi
        mongoose.connection.on('reconnected', () => {
          console.log('[MongoDB] Yeniden bağlantı başarılı');
        });
        
        return mongoose;
      })
      .catch((error) => {
        console.error('[MongoDB] Bağlantı hatası:', error);
        
        // Bağlantı URL'sini kontrol et (güvenlik açısından şifreyi gizliyoruz)
        const hiddenUri = MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@');
        console.error(`[MongoDB] URL: ${hiddenUri}`);
        
        // Daha detaylı hata bilgisi için
        if (error instanceof Error) {
          console.error(`[MongoDB] Hata tipi: ${error.name}`);
          console.error(`[MongoDB] Hata mesajı: ${error.message}`);
          console.error(`[MongoDB] Yığın: ${error.stack || 'Yok'}`);
        }
        
        throw error;
      });
  }
  
  try {
    console.log('[MongoDB] Bağlantı çözümleniyor...');
    cached.conn = await cached.promise;
    console.log('[MongoDB] Bağlantı başarıyla çözümlendi');
  } catch (error) {
    cached.promise = null;
    console.error('[MongoDB] Bağlantı çözümlenirken hata oluştu:', error);
    if (error instanceof Error) {
      console.error(`[MongoDB] Hata detayları: ${error.message}`);
    }
    throw error;
  }

  return cached.conn;
}

export default connectToDatabase; 