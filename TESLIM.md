# Teslim ve yayın adımları

Öğrenci no: **20261129027** — Tuana Davarcı

## 1. Zip'leme (Teams teslimi)
Proje klasörünün bir üst dizininde:

```
cd WebSiteVize
zip -r ../20261129027-WEB.zip . -x ".git/*" ".claude/*" "admin.html" "admin/*" ".DS_Store" "*.psd"
```

Sonra dosya adını `20261129027-WEB.zip` → `20261129027-WEB.pdf` olarak değiştir (hoca bu şekilde istiyor) ve Teams'e yükle.

- Boyut sınırı 300 MB. Güncel boyut: aşağıdaki komutla ölç (yaklaşık 11 MB).
  `du -sh ../20261129027-WEB.zip`
- Admin paneli ödevde istenmediği için zip'e konmuyor.

## 2. Rapor (`20261129027-WEB.docx`)
Kapak, vesikalık, öğrenci no, ad soyad, YouTube linki, alan adı/site adresi ve her sayfanın ekran görüntüsü.

## 3. Yayın
- Canlı: https://tuanadavarci.com (Vercel, `main` dalına push edilince birkaç dakikada yayına girer). Vintage tasarım 2026-11-26'da `main`'e birleştirildi; önceki `main` `yedek-main-oncesi` etiketiyle saklı. Açılışı tekrar izlemek için: https://tuanadavarci.com/?intro=1
- Eski adres (GitHub Pages): https://ozgemtuana.github.io/portfolyo/
- İsteğe bağlı alan adı (Namecheap): GitHub deposunda Settings → Pages → Custom domain'e alan adını yaz, Namecheap'te `A` kayıtlarını GitHub Pages IP'lerine, `www` için `CNAME`'i `ozgemtuana.github.io`'ya yönlendir. Sonra `sitemap.xml`, `robots.txt`, `llms.txt` ve her sayfadaki `canonical`/`og:url` adreslerini yeni alan adıyla değiştir.
- Alternatif hosting: Vercel — depoyu bağla, framework "Other", çıktı klasörü kök dizin.

## 4. Kontrol listesi
Her sayfada tek `<h1>`, kendi `title` ve `description`, TR/EN düğmesi, tek sayfa değil çok sayfa. Ayrıntı: `kaynak.txt`, `CREDITS.md`.

## Zip'e girmemesi gerekenler (silinmedi)
- `.scratch/` (test betikleri, ekran görüntüleri; ~970 MB), `teslim/` (zip ve rapor), `references/` (Pinterest referansları, yalnız yerel), `inceleme/`.
- Kullanılmayan görseller: `images/scenes/arch.webp`, `images/scenes/arch-sm.webp`, `images/scenes/cole-fallback.jpg`, `images/textures/dust-scratches.png`, `images/textures/lace-strip.webp`, `images/textures/leather.jpg` (toplam ~0.7 MB).
- Git'te izlenen proje boyutu ~64 MB (300 MB sınırının altında).

## Kullanılan skill'ler
seo-geo-bilingual, impeccable (elle critique + craft-floor), frontend-design (tasarım planı), gsap-* ve threejs-* / web3d-integration-patterns (yüklü, başvuru). Ayrıntı: CREDITS.md ve teslim/KONTROL-RAPORU.md.

