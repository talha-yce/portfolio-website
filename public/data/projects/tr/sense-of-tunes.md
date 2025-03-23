---
title: "Duygu Analizi ile Müzik Öneri Sistemi"
description: "Metindeki duyguları analiz eden ve analiz sonucuna göre müzik öneren bir web uygulaması."
date: "2023-10-01"
tags: ["ASP.NET Core", "C#", "Hugging Face API", "MongoDB"]
github: "https://github.com/Sense-of-Tunes"
coverImage: "/data/images/projects/sense-of-tunes.jpg"
---

## Proje Genel Bakış

Bu proje, ASP.NET Core (C#) kullanılarak geliştirilen bir web uygulamasıdır. Kullanıcılar uygulamaya duygusal ifadeler içeren metinler girebilir ve yapay zeka (Hugging Face API) ve özel bir filtreleme algoritması kullanılarak duygu analizi gerçekleştirilir.

## Temel Özellikler

- Hugging Face API kullanarak metin tabanlı duygu analizi
- Geliştirilmiş doğruluk için özel filtreleme algoritması
- Duygusal analize dayalı müzik önerileri
- Müzik verilerinin depolanması için MongoDB veritabanı entegrasyonu
- Sorunsuz etkileşim için kullanıcı dostu arayüz

## Teknik Uygulama

Uygulama, backend için ASP.NET Core kullanır ve birincil programlama dili olarak C# kullanılır. Duygu analizi, güçlü doğal dil işleme yetenekleri sağlayan Hugging Face API kullanılarak gerçekleştirilir. Sonuçlar daha sonra doğruluğu artırmak için özel bir algoritma kullanılarak filtrelenir.

Müzik verileri, esnek ve ölçeklenebilir veri depolamaya olanak tanıyan bir MongoDB veritabanında saklanır. Uygulama, duygusal analiz sonuçlarına dayalı müzik önerilerini alır ve bunları kullanıcıya sezgisel bir arayüzde sunar.

