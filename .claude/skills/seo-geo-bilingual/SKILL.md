---
name: seo-geo-bilingual
description: Bu sitede yeni sayfa eklerken ya da metin değiştirirken SEO, GEO ve TR/EN düzenini korumak için kullan.
---

# SEO + GEO + iki dilli yapı (WebSiteVize)

## Ne zaman
Yeni sayfa eklerken, başlık/açıklama değiştirirken, metin eklerken.

## Kurallar
1. Her sayfada tek `<h1>`, çok `<h2>`. Gerçek metin HTML'de durur; 3D arka planda kalır.
2. Her sayfa `<body data-title="meta.title.X" data-desc="meta.desc.X">` taşır. İki anahtar da `js/content.js` içinde `text.tr` ve `text.en` altında tanımlanır. `js/i18n.js` bunlardan `<title>`, `description`, `og:*`, `twitter:*` etiketlerini doldurur.
3. `<head>` içinde statik Türkçe `description`, `canonical`, `og:*`, `twitter:*` ve JSON-LD (BreadcrumbList; ana sayfada ayrıca WebSite + Person) bulunur. Statik metin, JS çalıştırmayan tarayıcılar içindir.
4. Yeni sayfa eklenince: `sitemap.xml`, `llms.txt`, `js/router.js` FILES, `js/transition.js` PAGES, `js/i18n.js` pagenav ORDER, `js/world.js` RANGES ve her sayfanın navbar'ı güncellenir.
5. Dil değişimi aynı URL üzerinde JS ile olur; ayrı `/en/` URL'si yoktur. Bu yüzden `hreflang` yazılmaz (yanlış bilgi vermemek için).
6. Çevirisi olmayan anahtar bırakma: TR ve EN birlikte eklenir.
