# Talha Yüce - Kişisel Portfolyo Websitesi

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org)

Modern, hızlı ve SEO dostu kişisel portfolyo websitesi. Next.js 14, TypeScript ve Tailwind CSS kullanılarak geliştirilmiştir.

## 🌟 Özellikler

- 🚀 **Hızlı ve Optimize**: Next.js 14 ile sunucu tarafı render ve statik site oluşturma
- 🌐 **Çoklu Dil Desteği**: Türkçe ve İngilizce dil desteği
- 📱 **Tam Responsive**: Tüm cihazlarda mükemmel görünüm
- 🎨 **Modern UI**: Tailwind CSS ile modern ve temiz tasarım
- 🔍 **SEO Optimize**: Meta etiketleri, sitemap ve schema.org yapılandırması
- 🌙 **Karanlık Mod**: Sistem temasına uyumlu karanlık/aydınlık mod desteği
- 📝 **Blog Sistemi**: Markdown tabanlı blog yazıları
- 🎮 **Proje Galerisi**: Detaylı proje sayfaları ve filtreleme
- ⚡ **Performans**: Core Web Vitals optimizasyonu
- 🔒 **Güvenlik**: Modern güvenlik başlıkları ve SSL

## 🛠️ Teknolojiler

- **Framework**: [Next.js 14](https://nextjs.org)
- **Dil**: [TypeScript](https://www.typescriptlang.org)
- **Stil**: [Tailwind CSS](https://tailwindcss.com)
- **UI Bileşenleri**: [shadcn/ui](https://ui.shadcn.com)
- **Animasyon**: [Framer Motion](https://www.framer.com/motion)
- **Form Yönetimi**: [React Hook Form](https://react-hook-form.com)
- **İkonlar**: [Lucide Icons](https://lucide.dev)
- **İçerik Yönetimi**: Markdown
- **Analitik**: [Vercel Analytics](https://vercel.com/analytics)
- **Performans**: [Vercel Speed Insights](https://vercel.com/speed-insights)

## 📦 Kurulum

1. Projeyi klonlayın:
```bash
git clone https://github.com/talhayuce/portfolio-website.git
```

2. Bağımlılıkları yükleyin:
```bash
cd portfolio-website
npm install
```

3. Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

4. Tarayıcınızda [http://localhost:3000](http://localhost:3000) adresini açın.

## 🚀 Deployment

Proje [Vercel](https://vercel.com) üzerinde deploy edilmiştir. Yeni bir deployment için:

1. Vercel hesabınıza giriş yapın
2. Yeni proje oluşturun
3. GitHub reponuzu bağlayın
4. Deployment ayarlarını yapılandırın

## 📝 Blog Yazıları

Blog yazıları `public/data/blog` dizininde Markdown formatında saklanır. Yeni bir blog yazısı eklemek için:

1. `public/data/blog` dizininde yeni bir Markdown dosyası oluşturun
2. Frontmatter kısmını doldurun:
```markdown
---
title: "Blog Yazısı Başlığı"
date: "2024-03-20"
excerpt: "Kısa açıklama"
tags: ["tag1", "tag2"]
coverImage: "/path/to/image.jpg"
---
```

## 🎨 Tema Özelleştirme

Tema renkleri ve diğer stil ayarları `tailwind.config.js` dosyasında yapılandırılabilir. Ana renkler:

```javascript
theme: {
  extend: {
    colors: {
      primary: "#000000",
      secondary: "#ffffff",
      // ... diğer renkler
    }
  }
}
```

## 📊 Performans Metrikleri

- **Lighthouse Score**: 98/100
- **Core Web Vitals**: Tüm metrikler yeşil
- **First Contentful Paint**: < 1s
- **Time to Interactive**: < 2s

## 🤝 Katkıda Bulunma

1. Bu repoyu fork edin
2. Yeni bir branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Daha fazla bilgi için `LICENSE` dosyasına bakın.

## 📞 İletişim

Talha Yüce - yucetalha00@gmail.com

Proje Linki: [https://github.com/talhayuce/portfolio-website](https://github.com/talhayuce/portfolio-website)

