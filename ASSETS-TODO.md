# Gerçek obje görselleri: beklenen dosyalar

Bu görselleri `public/assets/real/` klasörüne koyman yeterli. Site her dosyayı adıyla arar. Dosya yoksa o bölümde yalnızca kart ve yazı görünür; CSS ile çizilmiş taklit obje gösterilmez. Dosya gelince açılma, kalkma ve kayma animasyonlarını o görselle kuracağım.

**Genel kurallar**
- **Şeffaf PNG:** objenin kendisi (zarf kapağı, mühür, mandal, çerçeve…). Arka planı tamamen kaldırılmış, kenarları yumuşak, gölgesiz olsun; gölgeyi ben eklerim.
- **JPG:** tam ekran doku ya da fon.
- **Işık:** sol üstten gelen, sıcak ve yumuşak ışık. Fotoğraflar önden ve düz çekilmiş olsun (perspektifsiz).
- **Lisans:** kendi fotoğrafın, ürettiğin bir görsel ya da kamu malı/CC0 olsun. Kaynağını bana yaz, CREDITS.md'ye eklerim.

## 1. Açılış ve sayfa geçişleri: yeşil kadife zarf (references/26)

**Şu an çalışan:** açılış zarfı kodla üretilen kadife dokusu ve SVG mühürle çalışıyor. Aşağıdaki iki dosyayı koyduğunda ikisi de kendiliğinden gerçek fotoğrafa geçer:
- `envelope-green-velvet.jpg`: zeytin yeşili kadife ya da keten kumaş/kâğıt dokusu, düz ve önden çekilmiş, en az 3200×2200, JPG. Zarfın gövdesi ve kapağı bu dokuyla kaplanır.
- `wax-seal-cream-oval.png`: krem/beyaz oval kabartma mühür mumu (zambak + TD), arka planı şeffaf, 1400×1100, PNG. Çatlama animasyonunda ortadan ikiye bölünür.

| Dosya | İçerik | Boyut | Biçim |
|---|---|---|---|
| `envelope-green-body.png` | Yeşil kadife zarfın gövdesi (arka yüz + alt ve yan kapaklar), kapak hariç, düz önden | 3200×2200 | şeffaf PNG |
| `envelope-green-flap.png` | Üst üçgen kapak, kapalı hâlde (sivri ucu aşağıda), kenarında dantel şerit dahil | 3200×1500 (genişlik gövdeyle aynı) | şeffaf PNG |
| `envelope-green-inside.jpg` | Zarfın iç astarı (kapak açılınca görünen kısım, koyu krem/yeşil desenli kâğıt) | 3200×2200 | JPG |
| `wax-seal-cream-oval.png` | Beyaz/krem oval kabartma mühür, ortada TD monogramı ve zambak | 1400×1100 | şeffaf PNG |
| `wax-seal-cream-left.png` ve `wax-seal-cream-right.png` | (İsteğe bağlı) aynı mührün ortadan çatlamış iki yarısı. Yoksa tek mührü ben ortadan bölerim. | 1400×1100 | şeffaf PNG |
| `invitation-lace-card.png` | Zarftan kayarak çıkan krem dantel kenarlı kart (boş, yazısız) | 2400×3200 | şeffaf PNG |
| `velvet-green.jpg` | (İsteğe bağlı) zarfın etrafında kalan alan için yeşil kadife dokusu, döşenebilir | 2048×2048 | JPG |

Telefon için ayrı dosya gerekmiyor; aynı görselleri küçültüp kullanırım.

## 2. Kartlar (references/27, 28)

| Dosya | İçerik | Boyut | Biçim |
|---|---|---|---|
| `lace-card-cream.png` | Kenarı dantel krem kart, düz, boş | 2400×1600 (yatay) | şeffaf PNG |
| `torn-card-cream.png` | Kenarı yırtık krem kâğıt kart, boş | 2400×1600 | şeffaf PNG |
| `bulldog-clip-gold.png` | Altın/pirinç mandal (bulldog clip), önden, ağzı aşağı bakıyor | 700×600 | şeffaf PNG |
| `notebook-page.jpg` | Eski defter sayfası (çizgili, sararmış), listeler için | 2000×2800 | JPG |

Bunlar gelene kadar kartlarda şu an kullanılan gerçek taramalar duruyor: Met Müzesi dantel kartı, ambientCG kâğıt dokusu.

## 3. Çerçeveli tablolar (references/22–25)

Ortası **tamamen şeffaf** (fotoğraf çerçevenin içine yerleşecek), önden ve düz çekilmiş çerçeveler:

| Dosya | İçerik | Boyut |
|---|---|---|
| `frame-oval-black-gold.png` | Oval, siyah-altın, köşelerinde çiçek oymalı (22) | 2400×3000 |
| `frame-baroque-wide.png` | Geniş yatay, kıvrımlı altın süslemeli (23) | 3600×2400 |
| `frame-square-gold.png` | Kare, kalın altın oyma (24) | 3000×3000 |
| `frame-leaf-gold.png` | Yatay, yaprak motifli altın (25) | 3600×2600 |
| `frame-portrait-gold.png` | Dikey altın varaklı çerçeve (galeri fotoğrafları dikey) | 2400×3200 |

Her çerçeve için iç açıklığın köşe koordinatlarını bilmem gerekmiyor; şeffaf alanı kendim ölçerim.

## 4. Projeler sayfası objeleri

| Dosya | İçerik | Boyut | Biçim |
|---|---|---|---|
| `keyhole-brass.png` | Pirinç anahtar deliği plakası, deliği şeffaf | 2000×2600 | şeffaf PNG |
| `portfolio-leather-back.png` | Açık deri portfolyonun iç/arka kısmı (sağda ayraç sekmeleri) | 3000×2200 | şeffaf PNG |
| `portfolio-leather-cover.png` | Portfolyonun ön kapağı, ayrı (sol kenarından açılacak) | 1500×2200 | şeffaf PNG |
| `cloche-gold-dome.png` | Altın servis kubbesi, tepsisiz | 2000×1600 | şeffaf PNG |
| `cloche-tray.png` | Altın tepsi | 2400×800 | şeffaf PNG |
| `jewel-box-base.png` | Mücevher kutusunun gövdesi (içi kadife) | 2200×1400 | şeffaf PNG |
| `jewel-box-lid.png` | Kutunun kapağı, ayrı | 2200×900 | şeffaf PNG |
| `album-cover.png` | Eski fotoğraf albümünün kapağı | 2000×2600 | şeffaf PNG |
| `album-page.jpg` | Albümün iç sayfası (koyu karton, fotoğraf köşelikli) | 2000×2600 | JPG |
| `envelope-cream-body.png` ve `envelope-cream-flap.png` | Mektup sahnesi için krem zarf gövdesi ve kapağı | 2400×1700 | şeffaf PNG |
| `letter-paper.jpg` | Eski mektup kâğıdı | 2000×2800 | JPG |

## 5. Blog: mühürlü mektuplar ve mum

| Dosya | İçerik | Boyut | Biçim |
|---|---|---|---|
| `wax-seal-red.png` | Bordo mühür mumu mührü (zeytin dalı ya da monogram) | 1000×1000 | şeffaf PNG |
| `wax-seal-green.png` | Koyu yeşil mühür | 1000×1000 | şeffaf PNG |
| `seal-stamp-brass.png` | Ahşap saplı pirinç mühür damgası, yandan | 800×1600 | şeffaf PNG |
| `candle-lit.png` | Yanan ince mum ya da mühür mumu çubuğu (alev dahil) | 600×1800 | şeffaf PNG |

## 6. İletişim

| Dosya | İçerik | Boyut | Biçim |
|---|---|---|---|
| `envelope-white-scalloped-body.png` ve `envelope-white-scalloped-flap.png` | Dalgalı (scalloped) kapaklı beyaz zarf, kabartma gazebo | 3000×2100 | şeffaf PNG |
| `wax-seal-gold-lily.png` | Zambak motifli antik altın mühür | 1000×1000 | şeffaf PNG |

## 7. Ana sayfa ve Hakkımda: deri dosyalar

| Dosya | İçerik | Boyut | Biçim |
|---|---|---|---|
| `leather-folder-front.png` | Koyu kahve deri dosyanın ön kapağı | 1600×2100 | şeffaf PNG |
| `leather-folder-back.png` | Dosyanın arka kısmı (kâğıtlar bunun önünden çıkar) | 1600×2100 | şeffaf PNG |
| `oval-frame-portrait.png` | Hakkımda'daki vesikalık için oval antik çerçeve, ortası şeffaf (13) | 2000×2600 | şeffaf PNG |

## 8. İmleç

| Dosya | İçerik | Boyut | Biçim |
|---|---|---|---|
| `brush.png` | Antika ressam fırçası, 45° eğik, **fırça ucu sol alt köşede** (imlecin tam noktası orası olacak) | 512×512 | şeffaf PNG |

Gelene kadar geçici olarak basit bir fırça çizimi kullanılıyor (yalnızca masaüstünde).
