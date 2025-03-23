---
title: "Unity Oyun Geliştirme Temelleri"
date: "2024-02-20"
excerpt: "Unity ile oyun geliştirmeye giriş, motorun temellerini ve C# yazımını kapsayan bir rehber."
tags: ["Unity", "Oyun Geliştirme", "C#"]
coverImage: "/data/images/blog/unity-basics.jpg"
---

Unity, çeşitli platformlar için 2D ve 3D oyunlar oluşturmanıza olanak tanıyan güçlü bir oyun motorudur. Bu makalede, Unity arayüzü, GameObject'ler, Bileşenler ve C# betik yazımı dahil olmak üzere Unity oyun geliştirmenin temellerini ele alacağız.

## Unity Arayüzü

Unity arayüzü Scene görünümü, Game görünümü, Hierarchy, Project ve Inspector dahil olmak üzere çeşitli pencerelerden oluşur. Scene görünümü oyununuzu oluşturduğunuz yer, Game görünümü oyuncunun göreceği şey, Hierarchy sahnenizde bulunan tüm nesneleri listeler, Project penceresi projenizde bulunan tüm varlıkları gösterir ve Inspector seçili nesnenin özelliklerini gösterir.

## GameObject'ler ve Bileşenler

Unity'de oyununuzdaki her şey bir GameObject'tir. GameObject'ler, GameObject'in davranışını tanımlayan Bileşenleri içerebilen kapsayıcılardır. Örneğin, bir GameObject'in Transform bileşeni (konumunu, rotasyonunu ve ölçeğini tanımlar), Renderer bileşeni (görünür hale getirir) ve Collider bileşeni (diğer nesnelerle etkileşime girmesine izin verir) olabilir.

## C# Betik Yazımı

Unity, birincil betik dili olarak C# kullanır. C# betikleri, GameObject'lere davranışlarını tanımlamak için ekleyebileceğiniz Bileşenlerdir. İşte bir GameObject'i hareket ettiren basit bir C# betiği örneği:

```csharp
using UnityEngine;

public class Hareket : MonoBehaviour
{
  public float hiz = 5.0f;

  void Update()
  {
      float yatay = Input.GetAxis("Horizontal");
      float dikey = Input.GetAxis("Vertical");

      Vector3 hareket = new Vector3(yatay, 0, dikey) * hiz * Time.deltaTime;
      transform.Translate(hareket);
  }
}

