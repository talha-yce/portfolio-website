---
title: "Next.js ile Çoklu Dil Desteği (i18n): Detaylı Uygulama Rehberi"
date: "2024-07-04"
excerpt: "Next.js projelerinde çoklu dil desteğini (i18n) etkinleştirmek için kapsamlı bir rehber. Next.js'in yerleşik özellikleri ve popüler kütüphane `next-i18next` ile nasıl çalışılacağını adım adım öğrenin. SEO optimizasyonu ve en iyi uygulamalarla global erişiminizi artırın."
tags: ["Next.js","i18n","Çoklu Dil","Uluslararasılaştırma","React","next-i18next","SEO","Global"]
coverImage: "/data/images/blog/unity-basics.jpg"
---

## Neden Çoklu Dil Desteği (i18n)?

Günümüzde web uygulamalarının global erişime sahip olması, farklı dil ve kültürlere hitap etmeyi zorunlu kılmaktadır. Çoklu dil desteği (i18n), uygulamanızın kullanıcı deneyimini iyileştirerek daha geniş bir kitleye ulaşmanızı sağlar. İşte çoklu dil desteğinin faydaları:

*   **Kullanıcı Memnuniyeti:** Kullanıcılar, kendi dillerinde sunulan içeriği daha kolay anlar ve uygulamanıza daha fazla bağlanır.
*   **Global Erişilebilirlik:** Uygulamanızın farklı dillerde sunulması, dünya genelindeki potansiyel kullanıcı sayısını artırır.
*   **SEO Optimizasyonu:** Çoklu dil desteği, arama motorlarının içeriğinizi farklı dillerde indekslemesine yardımcı olur, böylece uygulamanızın arama sonuçlarındaki görünürlüğü artar.
*   **Rekabet Avantajı:** Küresel pazarda rekabet edebilmek için çoklu dil desteği sunmak önemli bir farklılık yaratır.

## Next.js ile i18n Seçenekleri

Next.js, çoklu dil desteği eklemek için çeşitli seçenekler sunar:

1.  **Next.js Yerleşik i18n Yönlendirme:** Next.js'in `next.config.js` dosyası üzerinden yapılandırılabilen yerleşik i18n yönlendirme özelliği, basit projeler için yeterli olabilir.
2.  **`next-i18next` Kütüphanesi:** `next-i18next`, Next.js uygulamaları için geliştirilmiş, çeviri yönetimi, dil algılama ve SEO optimizasyonu gibi gelişmiş özellikler sunan popüler bir kütüphanedir.
3.  **Özel Çözümler:** İhtiyaçlarınıza özel i18n çözümleri geliştirebilirsiniz. Bu yöntem, daha fazla kontrol sağlar ancak daha fazla geliştirme çabası gerektirir.

Bu rehberde, hem Next.js'in yerleşik i18n özelliklerini hem de `next-i18next` kütüphanesini kullanarak çoklu dil desteği eklemeyi adım adım göstereceğiz.

## Next.js Yerleşik i18n ile Çalışmak

Next.js'in yerleşik i18n yönlendirme özelliği, hızlı bir başlangıç için idealdir.

### Adım 1: `next.config.js` Dosyasını Yapılandırma

`next.config.js` dosyanızı aşağıdaki gibi güncelleyin:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ['en', 'tr', 'de'], // Desteklenen diller
    defaultLocale: 'en', // Varsayılan dil
    localeDetection: true, // Tarayıcı dilini otomatik olarak algıla
  },
}

module.exports = nextConfig;
```

*   `locales`: Uygulamanızın destekleyeceği dillerin listesini belirtir.
*   `defaultLocale`: Uygulama ilk açıldığında kullanılacak varsayılan dili tanımlar.
*   `localeDetection`: Tarayıcının dil tercihine göre otomatik dil algılama özelliğini etkinleştirir.

### Adım 2: Dil Dosyalarını Oluşturma

Her dil için ayrı JSON dosyaları oluşturun. Bu dosyaları genellikle `public/locales/[dil]/[namespace].json` şeklinde düzenlemeniz önerilir. Örnek:

*   `public/locales/en/common.json`:

```json
{
  "welcome": "Welcome to our website!",
  "about": "About Us",
  "language": "Language"
}
```

*   `public/locales/tr/common.json`:

```json
{
  "welcome": "Web sitemize hoş geldiniz!",
  "about": "Hakkımızda",
  "language": "Dil"
}
```

*   `public/locales/de/common.json`:

```json
{
  "welcome": "Willkommen auf unserer Webseite!",
  "about": "Über uns",
  "language": "Sprache"
}
```

### Adım 3: Bileşenlerde Çevirileri Kullanma

`useRouter` hook'unu kullanarak geçerli dil bilgisini alın ve çevirileri dinamik olarak yükleyin:

```jsx
import { useRouter } from 'next/router';
import en from '../../public/locales/en/common.json';
import tr from '../../public/locales/tr/common.json';
import de from '../../public/locales/de/common.json';

const translations = {
  en: en,
  tr: tr,
  de: de,
};

function HomePage() {
  const router = useRouter();
  const { locale } = router;
  const t = translations[locale];

  return (
    <div>
      <h1>{t.welcome}</h1>
      <p>{t.about}</p>
      <p>Dil: {locale}</p>
    </div>
  );
}

export default HomePage;
```

### Adım 4: Dil Seçici Ekleme

Kullanıcının dil değiştirmesi için bir dil seçici bileşeni ekleyin:

```jsx
import { useRouter } from 'next/router';

function LanguageSwitcher() {
  const router = useRouter();
  const { locales, locale } = router;

  const handleLocaleChange = (newLocale) => {
    router.push(router.pathname, router.asPath, { locale: newLocale });
  };

  return (
    <div>
      {locales.map((loc) => (
        <button key={loc} onClick={() => handleLocaleChange(loc)} disabled={locale === loc}>
          {loc}
        </button>
      ))}
    </div>
  );
}

export default LanguageSwitcher;
```

## `next-i18next` ile Gelişmiş i18n

`next-i18next` kütüphanesi, daha karmaşık ve ölçeklenebilir uygulamalar için idealdir. Bu kütüphane, çeviri yönetimi, dil algılama ve SEO optimizasyonu gibi gelişmiş özellikler sunar.

### Adım 1: Gerekli Paketleri Yükleme

```bash
npm install next-i18next i18next
```

### Adım 2: `next-i18next.config.js` Dosyasını Oluşturma

Projenizin kök dizininde `next-i18next.config.js` adında bir dosya oluşturun:

```javascript
// next-i18next.config.js
module.exports = {
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'tr', 'de'],
  },
  localePath: typeof window === 'undefined' ? require('path').resolve('./public/locales') : '/public/locales',
};
```

### Adım 3: `_app.js` Dosyasını Güncelleme

`_app.js` dosyanızı `appWithTranslation` ile sarın:

```jsx
import { appWithTranslation } from 'next-i18next';

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default appWithTranslation(MyApp);
```

### Adım 4: Bileşenlerde Çevirileri Kullanma

`useTranslation` hook'unu kullanarak çevirileri alın:

```jsx
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

function HomePage() {
  const { t } = useTranslation('common');

  return (
    <div>
      <h1>{t('welcome')}</h1>
      <p>{t('about')}</p>
      <p>{t('language')}</p>
    </div>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default HomePage;
```

### Adım 5: Dil Seçici Ekleme (`next-i18next`)

```jsx
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const router = useRouter();

  const handleLocaleChange = (newLocale) => {
    router.push(router.pathname, router.asPath, { locale: newLocale });
  };


  return (
    <div>
      <select
        onChange={(e) => handleLocaleChange(e.target.value)}
        value={i18n.language}
      >
        {i18n.languages.map((locale) => (
          <option key={locale} value={locale}>
            {locale}
          </option>
        ))}
      </select>
    </div>
  );
}

export default LanguageSwitcher;
```

## SEO Optimizasyonu ve En İyi Uygulamalar

*   **Tutarlı Çeviri Anahtarları:** Tüm çevirilerinizde tutarlı anahtar adları kullanın.
*   **Çeviri Yönetimi Araçları:** Çevirileri yönetmek için Phrase, Lokalise veya Crowdin gibi araçları kullanmayı düşünün.
*   **SEO Optimizasyonu:** Her dil için ayrı URL'ler kullanın ve `<link rel="alternate" hreflang="x" href="..." />` etiketlerini ekleyin.
*   **Dinamik İçerik:** Kullanıcıların dil tercihlerine göre dinamik olarak değişen içerik için i18n çözümlerinizi uyarlayın.
*   **Test:** Çevirilerin doğru ve tutarlı olduğundan emin olmak için düzenli olarak test yapın.

## Sonuç

Next.js, çoklu dil desteği eklemek için çeşitli ve güçlü araçlar sunar. İster basit projeler için Next.js'in yerleşik özelliklerini kullanın, ister daha karmaşık uygulamalar için `next-i18next` gibi bir kütüphaneyi tercih edin, doğru yaklaşımı seçerek uygulamanızın global erişimini artırabilir ve kullanıcı deneyimini iyileştirebilirsiniz.
