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
- Şu an GitHub Pages: https://ozgemtuana.github.io/portfolyo/ (`main` dalına push edilince 1–2 dk'da yayına girer).
- İsteğe bağlı alan adı (Namecheap): GitHub deposunda Settings → Pages → Custom domain'e alan adını yaz, Namecheap'te `A` kayıtlarını GitHub Pages IP'lerine, `www` için `CNAME`'i `ozgemtuana.github.io`'ya yönlendir. Sonra `sitemap.xml`, `robots.txt`, `llms.txt` ve her sayfadaki `canonical`/`og:url` adreslerini yeni alan adıyla değiştir.
- Alternatif hosting: Vercel — depoyu bağla, framework "Other", çıktı klasörü kök dizin.

## 4. Kontrol listesi
Her sayfada tek `<h1>`, kendi `title` ve `description`, TR/EN düğmesi, tek sayfa değil çok sayfa. Ayrıntı: `kaynak.txt`, `CREDITS.md`.
