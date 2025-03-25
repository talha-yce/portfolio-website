---
title: "Git'in Temel Komutları: İş Akışınızı Kolaylaştıran Komutlar"
date: "2024-07-03"
excerpt: "Git, güçlü bir sürüm kontrol sistemidir. Bu rehber, iş akışınızı basitleştiren ve üretkenliği artıran temel Git komutlarını vurgular."
tags: ["git","sürüm kontrolü","komutlar","iş akışı","üretkenlik"]
coverImage: "/data/images/blog/unity-basics.jpg"
---

## Git'in Temel Komutları: İş Akışınızı Kolaylaştıran Komutlar

Git, geliştiriciler için vazgeçilmez bir araçtır ve verimli sürüm kontrolü ve işbirliği sağlar. Temel Git komutlarını anlamak, iş akışınızı önemli ölçüde kolaylaştırabilir, üretkenliği artırabilir ve hataları azaltabilir. Bu rehber, her geliştiricinin bilmesi gereken temel Git komutlarını kapsamaktadır.

### Temel Git Komutları

#### 1. `git init`

`git init` komutu, proje dizininizde yeni bir Git deposu başlatır. Bu, projenizdeki değişiklikleri izlemenin ilk adımıdır.

```bash
git init
```

#### 2. `git clone`

`git clone` komutu, uzak bir deponun yerel bir kopyasını oluşturur. Bu, mevcut bir projede çalışmaya başlamak veya açık kaynaklı projelere katkıda bulunmak için kullanışlıdır.

```bash
git clone <repository_url>
```

#### 3. `git add`

`git add` komutu, değişiklikleri commit için hazırlar. Belirli dosyaları veya bir dizindeki tüm değişiklikleri ekleyebilirsiniz.

```bash
git add <file>
git add .
```

#### 4. `git commit`

`git commit` komutu, hazırlanan değişiklikleri açıklayıcı bir mesajla depoya kaydeder. İyi commit mesajları, projenizin geçmişini anlamak için çok önemlidir.

```bash
git commit -m "Buraya açıklayıcı bir commit mesajı ekleyin"
```

#### 5. `git status`

`git status` komutu, değiştirilmiş, hazırlanmış ve izlenmeyen dosyalar dahil olmak üzere çalışma dizininizin durumunu gösterir. Bu, değişiklikleri izlemek ve doğru dosyaları commit ettiğinizden emin olmak için yararlıdır.

```bash
git status
```

#### 6. `git branch`

`git branch` komutu, deponuzdaki dalları yönetir. Dal oluşturabilir, listeleyebilir ve silebilirsiniz.

```bash
git branch <branch_name> # Yeni bir dal oluştur
git branch # Tüm dalları listele
git branch -d <branch_name> # Bir dalı sil
```

#### 7. `git checkout`

`git checkout` komutu, dallar arasında geçiş yapar veya çalışma ağacı dosyalarını geri yükler. Bu, farklı özellikler üzerinde çalışmak veya hataları düzeltmek için gereklidir.

```bash
git checkout <branch_name> # Bir dala geç
git checkout -b <new_branch_name> # Yeni bir dal oluştur ve geç
```

#### 8. `git merge`

`git merge` komutu, bir daldaki değişiklikleri başka bir dala birleştirir. Bu, yeni özellikleri veya hata düzeltmelerini ana dala entegre etmek için yaygın olarak kullanılır.

```bash
git checkout <target_branch>
git merge <source_branch>
```

#### 9. `git pull`

`git pull` komutu, uzak bir depodan değişiklikleri getirir ve bunları mevcut dalınıza birleştirir. Bu, en son değişikliklerle güncel kalmak için gereklidir.

```bash
git pull origin <branch_name>
```

#### 10. `git push`

`git push` komutu, yerel değişikliklerinizi uzak bir depoya yükler. Bu, çalışmalarınızı başkalarıyla paylaşmanıza ve projelerde işbirliği yapmanıza olanak tanır.

```bash
git push origin <branch_name>
```

#### 11. `git log`

`git log` komutu, deponuzun commit geçmişini görüntüler. Commit mesajlarını, yazarları ve zaman damgalarını görüntüleyebilirsiniz.

```bash
git log
```

#### 12. `git diff`

`git diff` komutu, commitler, dallar veya dosyalar arasındaki farklılıkları gösterir. Bu, commit etmeden önce değişiklikleri incelemek için kullanışlıdır.

```bash
git diff <file>
```

#### 13. `git reset`

`git reset` komutu, mevcut HEAD'i belirtilen duruma sıfırlar. Bu komut güçlüdür ve commitleri geri almak, değişiklikleri hazırlamaktan çıkarmak veya değişiklikleri atmak için kullanılabilir.

```bash
git reset --hard <commit_hash> # Belirli bir commite sıfırlar ve değişiklikleri atar
```

#### 14. `git stash`

`git stash` komutu, hemen commit etmek istemediğiniz değişiklikleri geçici olarak rafa kaldırır. Bu, dallar arasında geçiş yapmanız gerektiğinde ancak tamamlanmamış çalışmaları commit etmek istemediğinizde kullanışlıdır.

```bash
git stash # Değişiklikleri sakla
git stash pop # Saklanan değişiklikleri uygula
```

### Sonuç

Bu temel Git komutlarında ustalaşmak, iş akışınızı ve üretkenliğinizi önemli ölçüde artırabilir. Git güçlü bir araçtır ve sürekli öğrenme, daha verimli ve etkili bir geliştirici olmanıza yardımcı olacaktır. Bu komutlarla denemeler yapın ve Git'in tüm potansiyelinden yararlanmak için ek özellikleri keşfedin.
    