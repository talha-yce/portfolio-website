import mongoose from 'mongoose';

// Bağlantı URL'sini çevresel değişkenden al veya yedek değeri kullan
// İdeal olarak bu bilgi gizli tutulmalı ve yalnızca güvenli şekilde çevresel değişkenlerden alınmalıdır
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://210541018:7sor4YST3m7N5GyV@ads-test.mnm2j0z.mongodb.net/web';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

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

    console.log('Connecting to MongoDB...');
    
    cached.promise = mongoose.connect(MONGODB_URI, opts)
      .then((mongoose) => {
        console.log('MongoDB connected successfully');
        
        // Bağlantı hata olayı dinleyicisi
        mongoose.connection.on('error', (err) => {
          console.error('MongoDB connection error:', err);
        });
        
        // Bağlantı kesme olayı dinleyicisi
        mongoose.connection.on('disconnected', () => {
          console.warn('MongoDB disconnected, attempting to reconnect...');
        });
        
        // Yeniden bağlanma olayı dinleyicisi
        mongoose.connection.on('reconnected', () => {
          console.log('MongoDB reconnected successfully');
        });
        
        return mongoose;
      })
      .catch((error) => {
        console.error('MongoDB connection error:', error);
        throw error;
      });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    console.error('Failed to resolve MongoDB connection:', error);
    throw error;
  }

  return cached.conn;
}

export default connectToDatabase; 