# İlerleme ve kararlar

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
