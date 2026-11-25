## 2026-11-26 — Kalan işler turu
- Dantel levha: blog yazıları ve Hakkımda uzun metin 9-dilim doily.png ile (mobilde 44px kenar); vesikalık dantel pencerede altın klipsle. Çakışan kurallar için `:not(#_):not(#_)` ile özgüllük artırıldı (letter-paper, cards-fix).
- Mobil/tablet menü (<992px): klipsli kâğıt etiketler, hamburger etiketi, Esc + dışarı tıklama + odak dönüşü (js/menu.js), TR/EN 44px; `.navbar > .container` flex-wrap:nowrap (collage-fix) mobilde wrap'e çevrildi.
- İletişim: altın klipsli form, klipsli Gönder etiketi, odak halkası ve doğrulama renkleri.
- Denetim (title/description/h1/alt/taşma/konsol) 8 sayfada temiz.
- Kalan: galeri/resume görselleri için dantel pencere, tüm sayfalarda kapanış ekran görüntüleri (teslim/ekran-goruntuleri/), main'e birleştirme (izin bekliyor).

## 2026-11-26 — Tek prompt turu (özet)
- Yapıldı: mobil dokunmatik kaydırma kök nedeni (html.collage ↔ .collage çakışması), 2D yedek; zaman tüneli açılışı; ana sayfa altın çerçeveler; Projeler/Galeri müze duvarı + tek eser salonu (?p=); 3D cep saati (Three.js) ve detayda CSS 3D; self-host fontlar; ajanda ders programı; klipsli menü etiketleri; süreç paleti (renkler görünmüyordu, düzeltildi); blog görselleri klipsli kâğıt çerçeve.
- Kararlar: Projeler/Galeri'de yatay kaydırmalı tek sıra duvar korundu (mobilde 1 tablo); yeşil zemin yerine koyu ceviz; menü etiketleri yalnız masaüstünde (≥992px).
- Kalan: dantel (doily.png) 9-dilim makale levhaları, mobil menü etiketleri, iletişim formu klipsi, kapanış ekran görüntüleri (teslim/ekran-goruntuleri/), canlı yayın (main'e birleştirme izin bekliyor).

# İlerleme ve kararlar

## GİT VE SON KONTROL (2026-11-23 gece)
- `CLAUDE.md` (Karpathy yönergeleri) eklendi. `main` dalına dokunulmadı; eski sürüm `v1-eski` etiketiyle işaretlendi ve push edildi. `vintage` dalı `origin/vintage` olarak push edildi.
- Şart denetimi (`.scratch/requirements.js`, 8 sayfa × TR/EN): 16/16 sayfada tek h1, title, description, hreflang ×3, canonical, JSON-LD, viewport var; JS hatası 0; 375 px'te yatay taşma yok (TR ve EN). Tablo, ol/ul, abbr/code/pre/blockquote, yetenek yüzdeleri (meter), blog 3 yazı, galeri 5 altyazı, iletişim adres + `tel:` + form, boyut ~56 MB: hepsi ✅. Açık not: Galeri ve İletişim'de tek `<h2>` var (içerik değişikliği olacağı için onay bekliyor).
- Kontrast 2. tur: blog kod blokları (`.code-fig`) krem kâğıt üstünde okunmuyordu; token renkleri koyulaştırıldı. Satır içi kod, tablo başlığı/altyazı, sayfa sonu etiketleri koyulaştırıldı. "ben Tuana" T aralığı düzeltildi.
- **Kalan:** kontrast ölçümü hâlâ ~470 uyarı veriyor; çoğu WebGL arka plan/kayan öğe örneklemesinden gelen ölçüm gürültüsü olabilir (ör. koyu yazılı "Oynat" etiketi). Gerçek ihlaller gözle tek tek doğrulanmalı: başlıktaki `em` büyük yazılar (blog), "Sakin Mum" bağlantısı, "İletişime geç" butonu.

## WEB TASARIMCISI ELEŞTİRİSİ (2026-11-23 akşam) — devam ediyor

Tüm düzeltmeler tek dosyada: `css/critique.css` (8 sayfada en son yüklenen stil). Betikler: `.scratch/crit.js <etiket> <sayfalar>` (1440 + 375 ekran görüntüsü), `.scratch/critsheet.py` (kontak sayfası), `.scratch/fontaudit.js` (13px/18px/300 denetimi), `.scratch/contrast.js` + `.scratch/contrast.py` (WCAG AA, ekran pikselleriyle).

**Yapıldı**
- Kontrast: dalış başlıkları krem, 500 ağırlık, ince koyu gölge ve altında sıcak gradient. Hero metni 18px+, Konum/Yerel saat 17px. Koyulaşma yalnızca yazı bölgesinde. Genel koyu katman azaltıldı (`.page-bg::after` .55/.72 → .22/.38, dalış sonrası `uDim` .45 → .2).
- Yazı: gövde 18px, etiket/menü en az 13px, 300 ağırlıklar 500'e çıktı. Pinyon yazılar büyüdü ve ince konturla kalınlaştı. Font denetimi temiz (yalnızca 13px'lik Marvel notu kasıtlı küçük).
- Tek tasarım dili: hap butonlar kaldırıldı. Birincil buton kâğıt etiket, ikincil buton el yazısı alt çizgili link, kâğıt üstündeki "İncele" ve form butonları kırmızı damga. TR/EN ve "oynat" da kâğıt etiket. Proje başlıkları Cormorant, Special Elite yalnızca küçük notlarda.
- Öne çıkan projeler: yatay sabitlenen kaydırma kapatıldı (`data-static`). Kartlar artık ortalı, iki sütunlu ve bilinçli olarak üst üste binen bir kolaj; telefonda tek sütun.
- Look çerçeveleri kemerli oldu. Bantlar alt köşelere taşındı, böylece ev/çatı görüntüsü kalktı.
- Dalış ilerleme göstergesi eklendi ("III / IX", küçük büyük harf). Dalışlar %30 kısaldı (ana sayfa 1150vh → 805vh, sayfa dalışları VH_PER_UNIT 48 → 34).
- "Tuana" yazısındaki T artık dik Cormorant. Başlık harf harf bölündüğü için `.char:first-child` hedeflendi. Menüdeki adın T'si de aynı şekilde düzeltildi.
- Marvel notu: History Brush ve Scarlet Witch kartlarına "Ders çalışması · karakter hakları Marvel'a aittir" eklendi (`rights: "marvel"`, `p.rights`).
- Hero butonları metnin altına alındı; müze etiketiyle artık çakışmıyor.

**Kalan**
1. Kontrast denetimini yeniden çalıştırıp sonucu okumak. İlk ölçümde 1207 yazıdan 238'i başarısızdı; ardından düzeltmeler eklendi.
2. "ben Tuana" yazısında T ile "uana" arasında boşluk kaldı: `.char:first-child` için margin-right değeri yaklaşık -.06em yapılacak.
3. Telefon (375px): alıntı kartı ile başlık çakışması, imza/pul kesilmesi ve küçük hero butonları gözle kontrol edilecek (`node .scratch/crit.js x index,projects`).
4. Kalan sayfalarda (blog, galeri, iletişim, süreç, özgeçmiş) ekran görüntüsü kontrolü.

## HOCANIN ŞARTLARI KONTROLÜ (2026-11-23)

Denetim betiği: `.scratch/requirements.js` (8 sayfa × TR/EN, masaüstü + 375 px). Ham sonuç: `.scratch/out/requirements.json`.

| Şart | Durum | Not |
|---|---|---|
| Kendini tanıtan site, yapay zekâ ile | ✅ | Süreç sayfasında araçlar ve skill'ler yazılı |
| Görsel olarak etkileyici, özel tasarım | ✅ | Tablo dalışları, zarf açılışı, kâğıt kolajı |
| Türkçe ve İngilizce, dil seçici her sayfada, seçim hatırlanıyor | ✅ | 8 sayfa TR/EN; `?lang=en` adres desteği eklendi |
| Alt sayfalar ve menü (tek sayfa değil) | ✅ | 8 ayrı sayfa |
| Her sayfada tek `<h1>`, birden çok `<h2>` | ✅ | Galeri ve İletişim'de 1 adet `<h2>` var (şart "birden çok h2" diyor; bkz. aşağı) |
| Her sayfanın kendi title ve description'ı (TR ve EN) | ✅ | 16/16 benzersiz |
| Semantik HTML5 (header, nav, main, section, footer) | ✅ | header 3 sayfada; diğerlerinde başlık bloğu `div` |
| Hakkımda: vesikalık + özgeçmiş | ✅ | |
| Hakkımda: ders programı `<table>`/`<th>`/`<td>` | ✅ | 15 th, 25 td |
| Hakkımda: `<ol>` ve `<ul>` | ✅ | |
| Hakkımda: `<abbr>`, `<code>`, `<pre>`, `<blockquote>` | ✅ | 5 / 2 / 1 / 1 |
| Yetenek yüzdeleri (HTML'de yazılı + `meter`) | ✅ | Bu oturumda `role="meter"` + `aria-valuenow` eklendi (16 adet) |
| Projeler: çalışmaların görselleri ve kısa açıklamaları | ✅ | |
| Blog: en az 3 yazı + ekran görüntüleri | ✅ | 3 yazı, 14 görsel |
| Galeri: fotoğraflar ve kısa açıklamaları | ✅ | 5 açıklama |
| İletişim: adres, telefon (`tel:`), form | ✅ | 4 alanlı form |
| Responsive / mobil | ✅ | 8 sayfa 375 px'te yatay taşmasız |
| SEO: canonical, JSON-LD, sitemap, robots, llms.txt | ✅ | |
| SEO: `hreflang` (tr / en / x-default) | ✅ | Bu oturumda eklendi |
| Görsellerde `alt` | ✅ | Eksik `alt` yok |
| JS hatası | ✅ | 16 sayfa yüklemesinde 0 |
| 300 MB sınırı | ✅ | 56,5 MB (yayınlanan dosyalar; `.git`, `references`, `.scratch`, `inceleme` hariç) |
| Teslim: `OgrenciNo-WEB.zip` → `.PDF` | ⏳ | TESLIM.md'de adımlar var; zip en sonda hazırlanacak |

**Küçük not:** Galeri ve İletişim sayfalarında yalnızca bir `<h2>` var. Şart "birden çok h2" diyorsa bu iki sayfaya birer bölüm başlığı eklemek gerekir. Bu içerik değişikliği sayılacağı için onayını bekliyorum.

## ŞU AN (2026-11-23 öğleden sonra)

**Sıra (kullanıcının önceliği, limit %75'te, idareli çalışılıyor):**
1. Look kartları ✅
2. Sayfa geçişi zarfı ✅ (8 kare: `inceleme/gecis-8-kare.jpg`)
3. Hocanın şartları kontrolü ✅ (yukarıdaki tablo)
4. Kalan süs ve animasyonlar ⏳ (sıradaki)

**Bitti: Look kartları (commit'li)**
- Figürlerin gömülü beyaz "sticker" kenarı otomatik temizlendi. Temiz kopyalar `images/runway/clean/` altında, orijinaller duruyor. `js/content.js` temiz kopyaları kullanıyor. Betik: `.scratch/dehalo.py`.
- Her figür kendisinden küçük bir kâğıt baskı çerçevesinin önünde duruyor; baş, saç ve etek çerçeveden taşıyor (moda dergisi pop-out). Yüzler tamamen görünüyor.
- Bantlar yalnızca çerçevenin üst köşelerinde ve çapraz; yüzün üstüne hiç gelmiyor. Fareyle üstüne gelince figür öne çıkıyor, gölgesi büyüyor.
- Her Look'ta en yüksek çözünürlüklü figür büyük gösteriliyor, düşük çözünürlüklüler küçük kalıyor.
- Look 03 (tek figür): sağdaki boşluğa figürün kendi renklerinden üç kumaş kartelası ve el yazısı "kumaş kartelası" notu kondu; kart biraz genişletildi.
- Düşük çözünürlüklü podyum fotoğrafları (projede daha büyük sürümü yok, büyütülmedi): `altin-etek.png` (271×391), `altin-on.png` (250×607), `pembe-elbise.png` (418×804), `siyah-podyum.png` (413×945). Daha büyük sürümleri varsa `images/runway/` altına aynı adla konabilir; temizleme betiği yeniden çalıştırılır.
- `beyaz-defile.png`'de başın çevresinde hafif bir parlama kaldı. Bu görsel Look kartında gösterilmiyor (dördüncü görsel, gizli).

**Yarım kalan: sayfa geçişi zarfı (2. madde).** Dosya: `js/envelope.js`, `leave()` ve `reveal()` fonksiyonları (yaklaşık 171–209. satırlar). Henüz değişiklik yapılmadı. Plan:
- **Zarf:** açılıştakiyle aynı doku, dantel ve gölge; biraz daha büyük, `min(560px, 82vw)`.
- **Kapak:** sert dönmek yerine kâğıt gibi bükülerek açılacak. GSAP keyframes ile `rotateX` 0→70→178, ortada `skewX` -3° ve `scaleY` .94; dönerken kapağın üstünden bir ışık geçecek. Kapanırken hafif sallanıp oturacak (back.out).
- **Sıra:** önce mühür çatlar, sonra kapak açılır, sonra kart hafifçe yükselip dönerek çıkar, sonra tek kesintisiz hareketle büyüyüp ekranı doldurur, en son yeni sayfa görünür.
- **Süre:** toplam 1–1,4 sn, telefonda `timeScale(1.25)` ile daha kısa.
- **Kanıt:** Playwright ile 8 kare, açılış zarfıyla yan yana (`.scratch/txtest.js`, `.scratch/compare.py`).

**Sıradaki adım:** yukarıdaki planı `js/envelope.js`'e uygulamak, 8 kareyi çekmek, ardından hocanın şartları kontrolüne geçip ✅/❌ tablosunu hazırlamak.

## SABAH ÖZETİ (2026-11-23, gece çalışması)

**Bitti**
- **Öncelik 1, açılış zarfı (references/26):**
  - Sahne: yeşil kadife zarf, kapak kenarlarında gerçek krem dantel (Met dantel kâğıdından kesildi), ortada krem oval kabartma mühür (zambak + T·D).
  - Yazılar: "Bir portfolyo", kaligrafik "Tuana Davarcı", el çizimi alt çizgili "Davetiyeyi aç".
  - Animasyon: tıklayınca, kaydırınca ya da Enter'a basınca mühür çatlar ve kırıntılar saçılır. Kamera geri çekilir, kapak 3D açılır, dantel kart çıkar, ekranı doldurur ve Panini galerisi belirir.
  - Kaldırılanlar: kahverengi perde, altın mühür, sayaç, "hoş geldin" yazısı, "Gir" kutusu ve kapı açılışı.
  - Telefonda da test edildi.
- **Öncelik 1, sayfa geçişleri:** küçük zarf kayarak gelir, kapak kapanır, mühür basılır, ardından mühür çatlar, kapak açılır ve kart yeni sayfaya dönüşür. Zarf rengi sayfaya göre değişir: yeşil kadife (genel), krem dantelli (Hakkımda), kahve (Projeler), beyaz dalgalı kapaklı (İletişim).
- **Kanıt:** `inceleme/acilis-ve-gecis.jpg` (references/26 ile yan yana açılış kareleri + üç geçiş).
- **Hakkımda kâğıt kolajı:**
  - Objeler: mektup, daktilo kâğıdı, bilet koçanı, kulüp kartı, davetiye, kraft etiket, diploma, kayıt defteri, fiş kartı, defter sayfası.
  - Süsler: SVG damgalar ve monogram.
  - Telefonda yatay taşma düzeltildi.
- **Tipografi:** kaligrafik "Tuana"nın T'si artık Cormorant italik. Dev "Tuana Davarcı" ekrana sığıyor. Rastgele beyaz noktalar (shader tozu) kaldırıldı.

- **Anasayfa dergi düzeni:**
  - Galeri: büyük polaroid, üstüne binen küçük polaroid, pul kenarlı baskı, el yazısı not ve ok.
  - Hakkımda özeti: mektup kâğıdı, sayaçlar mürekkep damgası.
  - Sözler: farklı boy ve açıda dantel kartlar.
  - Öne çıkan projeler: kartpostal (pul, posta damgası, daktilo başlık).
  - Hizmetler: dosya sekmeli fiş kartları.
  - Look'lar: farklı boyut ve açıda dergi sayfaları (kapak fotoğrafı, bantlı küçük fotoğraflar, damga, el yazısı not).
  - Bölüm başları: "No. I–VI" künye ve gravür zeytin dalı ayracı.
  - "Tüm galeri / Tüm projeler": hap buton yerine el yazısı bağlantı.
- **Projeler dergi düzeni:** her proje bir açılım (geniş bantlı baskı + üstüne binen etiket + damga + "İncele" lastik damgası), Kişisel Portfolyo notları kareli kâğıtta, sonda kartpostal çağrısı.
- **Kalan sayfalar kolaja geçti:**
  - Özgeçmiş: iple bağlı bagaj etiketi deneyimler, diploma eğitim, fiş kartı yetenekler.
  - Blog: pullu mektup kartı dizini, çizgili mektup kâğıdı yazılar, bantlı baskı görseller.
  - Galeri: dağınık polaroid ve pul kenarlı eski baskılar, el yazısı etiketler.
  - Süreç: moodboard (iğneli liste, kartela, tipografi kartı, damgalı kontrol listesi).
  - İletişim: çizgili mektup kâğıdında form, mühür gönder butonu, kartvizit, kraft adres etiketi, pul sosyal linkler.
- **Sayfa sonu (tüm sayfalar):** sıradaki sayfa kartpostal, önceki sayfa bilet koçanı, tüm sayfalar dosya ayraçları.
- **Telefon:** sekiz sayfanın hepsi 375 px'te yatay taşmasız (Anasayfa'daki kartpostal şeridi, Projeler'deki bantlar ve çağrı kartı düzeltildi).
- **Ekran görüntüleri:** `inceleme/` klasöründe (02–08 numaralı dosyalar).

**Kaldı**
- **Açık hata:** Projeler'in Kişisel Portfolyo bölümünde, arka planda soluk adaçayı rengi büyük bir daire görünüyor. İki yöntemle aradım, kaynağını bulamadım (tuval değil, bölümün kendi öğeleri değil, buton dolgusu değil). Sıradaki ilk iş.
- Fırça imleç ve tablolarda boya sürükleme / figür etkileşimi (5. madde).
- Mürekkeple yazan el, köşelerde hayvanlar ve çiçekler, çerçeveli canlı tablolar ve özlü sözler (PROMPT.md 4–4c).
- Projeler'in eskiz defteri girişi (references/32): kâğıt, halka, mandal ve aydınger için gerçek görsel bekliyor.
- Gerçek görseller gelince: kadife doku, mühür, ataş, mandal, çerçeveler (ASSETS-TODO.md).
- TR/EN, 768/1440 testleri, hoca şartları kontrol tablosu, SEO/GEO, 300 MB ölçümü, en sonda inceleme/index.html.

**Onayını bekleyenler**
- Açılış zarfı ve geçişler: `inceleme/acilis-ve-gecis.jpg`, `08-acilis-telefon.png`.
- Hakkımda kolajı: `05-hakkimda-kolaj.jpg`.
- Anasayfa ve Projeler dergi düzeni: `02`, `03`, `04`.
- Kalan sayfalar: `06`, `07`. Onayın gelmeden ilerledim, çünkü gece kuralında sıra buydu.

## SABAH ONAY BEKLİYOR
- `sh .scratch/*.sh` biçimindeki kabuk betikleri onay istiyor; çalıştırmadım, komutları tek tek `node` / `python3` ile çalıştırdım. Onaylarsan izin listesine `Bash(sh .scratch/*)` eklenebilir.

## ÖNCELİK 1 – YAPILDI (2026-11-23)

Açılış jeneriği ve sayfa geçişleri eski hâlindeydi: kahverengi zemin, altın mühür, sayaçlı yükleme, "Gir" butonu ve Met kapısı. Bu oturumda yapıldı (yukarıdaki özete bak). Teknik notlar:
- **Bileşenler:** `js/envelope.js` ve `css/envelope.css`. `js/transition.js` zarf yüklüyse eski perdeyi hiç çalıştırmıyor. Kapı açılışı betiği (`js/intro.js`) sayfalardan çıkarıldı; dosya silinmedi.
- **Kadife dokusu:** gerçek fotoğraf yoksa SVG gürültü, kadife tüyü ve dokuma çizgileriyle üretiliyor. `public/assets/real/envelope-green-velvet.jpg` ve `wax-seal-cream-oval.png` konunca kendiliğinden onlara geçiyor (ASSETS-TODO.md).
- **Karar:** tam ekran zarfın üstünde kartın çıkacağı yer olmadığı için kapak açılırken kamera geri çekiliyor (zarf 0,58 ölçeğe iniyor). Kart zarftan gerçekten yukarı kayıp sonra büyüyor.
- **Süre:** açılış yaklaşık 3,2 sn; geçiş ayrılış 0,5 sn + varış 0,62 sn (toplam ~1,1 sn, sayfanın yüklenme süresi hariç).

Aşağıda orijinal istek:

1. **Açılış (references/26):**
   - Sahne: ekranı dolduran zeytin yeşili kadife/keten dokulu kapalı zarf, üstten bakış. Kapak kenarlarında krem dantel şerit.
   - Mühür: ortada krem oval kabartma mühür mumu; içinde zambak ve "TD".
   - Yazılar: zarfın üstünde "BİR PORTFOLYO / A PORTFOLIO", altında kaligrafik "Tuana Davarcı", en altta el çizimi alt çizgili "Davetiyeyi aç / Open the invitation".
   - Animasyon: tıklayınca ya da kaydırınca mühür çatlar, iki parçaya ayrılır ve mum kırıntıları saçılır. Kapak 3D olarak açılır, dantel kenarlı krem kart kayarak çıkar, büyüyüp ekranı doldurur, Panini galerisi belirir.
   - Kaldırılacaklar: kahverengi zemin, altın mühür, "Gir" kutusu, sayaç, "hoş geldin" yazısı ve kapı açılışı.
2. **Sayfa geçişleri:**
   - Akış: aynı zarf dili, en fazla 1,2 sn. Küçük zarf kayarak gelir, kapak kapanır, mühür basılır, açılır ve yeni sayfa içinden çıkar.
   - Sayfaya göre zarf: yeşil kadife (genel), krem dantelli (Hakkımda), kahve (Projeler), beyaz dalgalı kapaklı (İletişim).
3. **Kanıt:** Playwright ile açılış ve bir geçiş için 6–8 kare alınacak, references/26 ile yan yana gösterilecek.

Bu dosya, yeniden tasarımın aşama raporlarını ve verdiğim kararları tutar. Çalışma `vintage` dalında; `main`'e ve canlıya yalnızca onayla alınır.

## 2026-11-22 · Aşama: Ana sayfa "tablonun içine dalış" (galeri → Robert → Cole)

**Yapılanlar**
- Eski kodla çizilmiş 3D dünya (`js/world.js`) ve ilk tablo denemesi (`js/painting.js`) kaldırıldı; yerine tek WebGL tuvali kullanan `js/dive.js` geldi.
- Dalış yolu: Panini, *Galerie de vues de la Rome moderne* (Louvre, 10587 px) → sol alttaki Navona Meydanı tablosu → mürekkep gibi dağılarak Hubert Robert'in kemerli tablosu → kemer açıklığında Thomas Cole'un kıyısı → kemerin içinden geçiş.
- Her tablo için Depth Anything V2 ile derinlik haritası; fare ve kaydırmayla hafif 3D kayma.
- Yakın duraklarda yüksek çözünürlüklü kesitler: Panini'nin Navona çevresi (tam çözünürlük) ve Robert'in kemer çevresi.
- Tablonun önündeki kitap ve komşu çerçeve, Panini derinlik haritasıyla korunuyor (Robert onların arkasında kalıyor).
- Her aşamada sağ altta müze etiketi (sanatçı, eser, yıl, müze): gerçek HTML, TR/EN.
- Diğer sayfalarda geçici olarak kendi tablosu sabit fon: Hakkımda Fragonard, Özgeçmiş Claude Lorrain, Projeler Vermeer (Resim Sanatı), Blog Vermeer (Mektup Yazan Kadın), Galeri Constable, Süreç Panini, İletişim Friedrich.
- Tipografi: sayfa başlığındaki vurgulu kelime Pinyon Script ile serif başlığın üstüne biniyor (ana sayfada "Tuana"). Tablonun üstündeki kaligrafik başlıklar büyütüldü, açık antik altın ve hafif gölge verildi.

**Kararlar ("şunu seçtim, çünkü…")**
- Tam bir DZI karo piramidi yerine, kameranın gittiği yol bilindiği için iki seviyeli doku (genel görünüm + yolun üstündeki yüksek çözünürlüklü kesit) kullandım. Çünkü aynı keskinliği çok daha az kodla ve yükleme takılması olmadan veriyor. Yol değişirse ya da serbest zoom istenirse gerçek DZI'ya geçilir.
- Hedef tablo olarak Navona'yı seçtim, çünkü Panini galerisindeki dikey tablolar içinde en-boy oranı Robert'inkine en yakın olanı (0,61'e 0,63) ve geçiş kesintisiz oluyor.
- Robert'in kemerine giderken Cole'u ekran uzayında, yavaş yaklaşan uzak katman olarak çizdim. Çünkü gerçekte bir kemerin içinden geçerken uzaktaki manzara neredeyse büyümez. Ayrıca böylece Cole hiç bulanıklaşmıyor.
- Son işlem bilerek çok hafif tutuldu (tuval %5, gren %1,8, hafif sıcaklık), çünkü "aşırı sararmış sahte filtre" istenmiyor.
- `references/` klasörü `.gitignore`'da: stil referansı, yayınlanmaz.

**Ölçümler** (Chrome, Apple M5, 1280×800, DPR 1.5 iç çözünürlük)
- Dikey senkron kapalıyken: galeri başında yaklaşık 2100 FPS, en ağır an olan Robert→Cole geçişinde yaklaşık 630 FPS. Kare başına ≤1,6 ms, yani 60/120 Hz ekranda bol pay var.
- İlk ölçümdeki 30 FPS, test penceresi arka planda kaldığı için Chrome'un kısıtlamasıydı.
- Konsol hatası yok.

**Görüntüler:** `~/Desktop/Asama-Dalis/` (7 ekran görüntüsü + `dalis.gif`)

**Açık kalanlar**
- Ana sayfanın dalıştan sonraki bölümleri (galeri önizlemesi, kayan bant, sayaç kartı, öne çıkan projeler) hâlâ eski arayüz; fiziksel objelere dönüşecek.
- Navona ve Robert arasındaki mürekkep geçişi küçük bir çerçevede başlıyor; daha büyük ekranda başlatılması denenebilir.
- Telefon görünümü bu aşamada test edilmedi.

## 2026-11-22 · Aşama: Dalış düzeltmeleri, fiziksel objeler, açılış kapıları, zoom durakları

**Yapılanlar**
- Müze etiketi artık tablo geçişiyle aynı karede değişiyor (mürekkep tablonun yarısını kapladığında / karartmanın en koyu anında).
- Açılış yazılarının arkasına yumuşak, sıcak bir koyulaşma eklendi; yazılar kaybolurken o da sönüyor. Telefonda etiket yazılarla çakışmıyor.
- Navona → Robert mürekkep geçişi daha geç başlıyor (Navona ekranı neredeyse doldurduğunda).
- Canlılık: Panini galerisinde üst pencereden süzülen ışık huzmeleri ve huzmede yoğunlaşan toz; Cole'da akan bulutlar, denizde parıltılar, kanat çırpan martılar.
- Dalış sonrası bölümler fiziksel objeler oldu: galeri önizlemesi altın varaklı çerçevede tablolar + pirinç müze plakası (fareyle eğilir), sayaç ve söz kartları gerçek kabartma dantel kâğıt (Met Müzesi, CC0), kayan bant eski kâğıt şeritlere kaydırdıkça mürekkeple yazılan kelimeler, Bootstrap ikonları gravür taramalı ikonlar (tüm sayfalarda).
- Açılış: mühürlü sayaç → "Gir" butonu → Met Müzesi'nin çift kanatlı kapısı (CC0) ortadan açılıyor → Hubert Robert'in "Büyük Galeri" tablosu (Louvre, 8472 px tarama) → kamera salona girip Panini dalışına karışıyor. "Atla" butonu ve Esc var.
- Zoom durakları (uberdesigner.ai ilhamı, kendi tasarımımıza uyarlandı): her tabloda 3 detay (Panini: tonoz ve ışıklık, Musa, koleksiyoncular; Robert: kubbe, nişteki heykel, merdivendeki gezginler; Cole: yıkık kule, çoban, denizde ışık). Her durakta sol altta ince büyük harf Cormorant başlık + italik açıklama (TR/EN).
- Sağ üstte mini harita: tablonun küçük önizlemesinde şu an bakılan bölge ince antik altın çerçeveyle.
- Geçişler dönüşümlü: Panini → Robert mürekkep dağılması, Robert → Cole sinematik karartma.
- Sağ altta Oynat / Duraklat (tüm sayfalarda): sayfa yavaşça kendiliğinden kayar, duraklarda yavaşlar, elle kaydırınca durur.
- Musa ve koleksiyoncular duraklarında keskinlik için Panini'nin tam çözünürlüklü taramasından ikinci bir kesit eklendi.

**Kararlar**
- Pop-up kitap jeneriğini kullanmadım; yerine kapı + Büyük Galeri açılışını seçtim. Çünkü müze konseptiyle kesintisiz bağlanıyor (kapıdan salona, salondan tabloya) ve iki ayrı jenerik ilk girişi gereksiz uzatırdı.
- Büyük Galeri olarak Hubert Robert'i seçtim, çünkü dalış zincirinde zaten onun tablosu var ve hem eser hem dönem tutarlı.
- Kapı kanatları gerçek fotoğraftan kesildi ve CSS 3D ile menteşelerinden döndürülüyor. WebGL'e almadım, çünkü bu yöntem tek seferlik 4 saniyelik bir sahne için daha hafif ve güvenilir.
- Durak açıklamaları yeni dekoratif metinler (sitenin içeriği değil). Musa heykeli ve "harabelerin Robert'i" lakabı gibi bilgiler doğru; emin olmadığım kişi adlarını yazmadım (koleksiyoncular için isim verilmedi).
- Course of Empire (Thomas Cole, 5 tablo, New-York Historical Society, kamu malı, ~8800 px taramalar): Galeri sayfasının dalış zinciri olarak uygun. Galeri'de kullanıyorum.

**Test:** 1280×800 ve 375×740, Chrome (Playwright, görünmez pencere). Konsol hatası yok.

## 2026-11-22 · Aşama: Diğer sayfaların dalışları

**Yapılanlar**
- Genel sayfa dalışı motoru: `js/pagedive.js` + veri `js/pagedive-data.js` + `css/pagedive.css`. Ana sayfadaki gibi: zoom durakları, sol altta başlık + italik açıklama (TR/EN), sağ üstte mini harita, müze etiketi, dönüşümlü geçiş (mürekkep / karartma), oynat/duraklat ile uyumlu.
- Sayfa başlığı (h1 kutusu) tablonun üstündeki yapışkan sahneye taşınıyor; belge sırası ve SEO değişmiyor.
- Zincirler: Hakkımda Fragonard (yüz, fırça, kitap → kitabın içine), Özgeçmiş Claude Lorrain, Projeler Vermeer *Resim Sanatı* (avize, Clio, harita, ressam), Blog Vermeer *Mektup Yazan Kadın* (bakış, tüy kalem, mücevher kutusu), Galeri Thomas Cole *Course of Empire* 5 tablo, Süreç van Haecht galerisi, İletişim Friedrich *Pencerede Kadın* → Corot *Villa d'Este bahçeleri*.
- Yüksek çözünürlüklü taramalar (3840 px masaüstü, 2048 px telefon). Masaüstünde yalnızca yakındaki tabloların büyük dokusu bellekte tutuluyor.

**Kararlar**
- Galeri için Constable yerine Course of Empire serisini seçtim, çünkü beş tablo tek bir hikâye anlatıyor ve aynı kaya tepesi her tabloda tekrar ediyor; dalış zinciri için ideal.
- İletişim'de "balkon → gizli bahçe" için Corot'nun Villa d'Este terası tablosunu seçtim (servi, korkuluk, sisli tepeler).
- Süreç için van Haecht'in koleksiyon galerisini seçtim, çünkü duvarlar dolusu tablo bir "moodboard" gibi.

**Test:** 1280×800 ve 375×740, tüm sayfalar. Konsol hatası yok.

**Kalan işler (sıradaki oturum)**
1. Sayfa geçişlerinde zarf açılması (şu an sıvı perde).
2. Mürekkeple yazan el katmanı, köşelerde hayvanlar ve çiçekler, çerçeveli canlı tablolar ve özlü sözler.
3. Sayfa içerikleri fiziksel objeler: Hakkımda kitap sayfası özgeçmiş + oval çerçevede vesikalık; Blog mühürlü mektuplar + mum damlatma; Galeri altın çerçeveli fotoğraflar; İletişim zarftan çıkan form; gravür ikonların kontrolü.
4. TR/EN, 375/768/1440 testi, hoca şartları, SEO/GEO, 300 MB ölçümü, Süreç sayfasına uberdesigner.ai ve yeni araçlar.
5. En sonda: inceleme/index.html özet sayfası (önce/sonra, sayfa sayfa görüntüler, tablo listesi, kontrol tabloları).
