/* ==========================================================================
   Sayfa dalışlarının verisi (js/pagedive.js okur)
   Her sayfa: bir tablo zinciri. Her tablo: dosya adı (images/paintings/<key>-hi|2048.webp),
   en/boy oranı, müze etiketi ve 2–4 zoom durağı. Durak: tablo içi oransal merkez (u, v),
   ekrana sığacak kutu (w, h), başlık (t) ve kısa italik açıklama (q), TR/EN.
   Tablolar arası geçiş dönüşümlüdür: mürekkep dağılması / sinematik karartma.
   Kaynaklar ve lisanslar: CREDITS.md
   ========================================================================== */
window.PAGE_DIVES = {
    about: [{
        key: "fragonard-reading", a: 3182 / 4000,
        label: { tr: ["Jean-Honoré Fragonard", "Kitap Okuyan Genç Kız", "y. 1769 · National Gallery of Art · yağlı boya"],
                 en: ["Jean-Honoré Fragonard", "Young Girl Reading", "c. 1769 · National Gallery of Art · oil on canvas"] },
        stops: [
            { u: 0.43, v: 0.25, w: 0.34, h: 0.22, t: { tr: "Okuyan yüz", en: "The reader" }, q: { tr: "Dünya susar, yalnızca sayfa konuşur.", en: "The world goes quiet; only the page speaks." } },
            { u: 0.74, v: 0.56, w: 0.42, h: 0.32, t: { tr: "Fırça darbeleri", en: "Brushstrokes" }, q: { tr: "Hızlı, cesur fırça izleri: kumaş neredeyse uçuşuyor.", en: "Quick, bold strokes: the fabric almost flutters." } },
            { u: 0.16, v: 0.52, w: 0.26, h: 0.15, t: { tr: "Kitap", en: "The book" }, q: { tr: "Öğrenmek, bitmeyen bir mektuptur.", en: "Learning is a letter that never ends." } }
        ],
        end: { u: 0.17, v: 0.5, w: 0.1, h: 0.07 }
    }],
    resume: [{
        key: "lorrain-merchants", a: 3840 / 2559,
        label: { tr: ["Claude Lorrain", "Tüccarlarla Manzara", "y. 1629 · National Gallery of Art · yağlı boya"],
                 en: ["Claude Lorrain", "Landscape with Merchants", "c. 1629 · National Gallery of Art · oil on canvas"] },
        stops: [
            { u: 0.5, v: 0.84, w: 0.32, h: 0.2, t: { tr: "Kıyıdaki tüccarlar", en: "Merchants on the shore" }, q: { tr: "Her yolculuk, yüklenen ilk sandıkla başlar.", en: "Every journey begins with the first crate loaded." } },
            { u: 0.78, v: 0.52, w: 0.26, h: 0.2, t: { tr: "Tepedeki kule", en: "The hilltop tower" }, q: { tr: "Uzaktaki hedef, yolu anlamlı kılar.", en: "A distant goal gives the road its meaning." } },
            { u: 0.5, v: 0.6, w: 0.34, h: 0.22, t: { tr: "Ufuktaki ışık", en: "Light on the horizon" }, q: { tr: "Claude, güneşi doğrudan resmeden ilk ressamlardandı.", en: "Claude was among the first painters to paint the sun itself." } }
        ]
    }],
    projects: [{
        key: "vermeer-art-of-painting", a: 3840 / 4562,
        label: { tr: ["Johannes Vermeer", "Resim Sanatı", "y. 1666–68 · Kunsthistorisches Museum · yağlı boya"],
                 en: ["Johannes Vermeer", "The Art of Painting", "c. 1666–68 · Kunsthistorisches Museum · oil on canvas"] },
        stops: [
            { u: 0.65, v: 0.2, w: 0.32, h: 0.15, t: { tr: "Avize", en: "The chandelier" }, q: { tr: "Pirinçte yakalanan ışık: Vermeer ayrıntıda saklıdır.", en: "Light caught in brass: Vermeer lives in the details." } },
            { u: 0.45, v: 0.47, w: 0.24, h: 0.22, t: { tr: "Clio", en: "Clio" }, q: { tr: "Tarihin ilham perisi: defne tacı, trompet ve kitap.", en: "The muse of history: laurel, trumpet and book." } },
            { u: 0.56, v: 0.3, w: 0.46, h: 0.25, t: { tr: "Harita", en: "The map" }, q: { tr: "Bir fikir, bir eskiz, bir dünya.", en: "One idea, one sketch, one world." } },
            { u: 0.71, v: 0.58, w: 0.34, h: 0.32, t: { tr: "Ressam", en: "The painter" }, q: { tr: "Her kare, hareket etmeyi bekleyen bir tablodur.", en: "Every frame is a painting waiting to move." } }
        ]
    }],
    blog: [{
        key: "vermeer-lady-writing", a: 3510 / 4000,
        label: { tr: ["Johannes Vermeer", "Mektup Yazan Kadın", "y. 1665 · National Gallery of Art · yağlı boya"],
                 en: ["Johannes Vermeer", "A Lady Writing", "c. 1665 · National Gallery of Art · oil on canvas"] },
        stops: [
            { u: 0.52, v: 0.42, w: 0.22, h: 0.16, t: { tr: "Bakış", en: "The glance" }, q: { tr: "Yazarken başını kaldırıp bize bakıyor.", en: "She looks up from her letter, straight at us." } },
            { u: 0.3, v: 0.62, w: 0.32, h: 0.15, t: { tr: "Tüy kalem", en: "The quill" }, q: { tr: "Kod, modern çağın mürekkebidir.", en: "Code is the ink of the modern age." } },
            { u: 0.09, v: 0.6, w: 0.22, h: 0.13, t: { tr: "Mücevher kutusu", en: "The jewel box" }, q: { tr: "Her satır, ekranda yazılmış bir mektuptur.", en: "Every line of code is a letter written on a screen." } }
        ],
        end: { u: 0.3, v: 0.64, w: 0.12, h: 0.06 }
    }],
    gallery: [
        { key: "coe-1-savage", a: 3840 / 2387,
          label: { tr: ["Thomas Cole", "İmparatorluğun Seyri: Yabanıl Durum", "1834 · New-York Historical Society · yağlı boya"], en: ["Thomas Cole", "The Course of Empire: The Savage State", "1834 · New-York Historical Society · oil on canvas"] },
          stops: [{ u: 0.56, v: 0.36, w: 0.32, h: 0.3, t: { tr: "Kaya tepe", en: "The crag" }, q: { tr: "Bu kaya beş tablonun hepsinde aynı yerde durur.", en: "This crag stands in the same place in all five paintings." } }] },
        { key: "coe-2-arcadian", a: 3840 / 2393,
          label: { tr: ["Thomas Cole", "İmparatorluğun Seyri: Pastoral Durum", "1834 · New-York Historical Society · yağlı boya"], en: ["Thomas Cole", "The Course of Empire: The Arcadian or Pastoral State", "1834 · New-York Historical Society · oil on canvas"] },
          stops: [{ u: 0.38, v: 0.47, w: 0.26, h: 0.2, t: { tr: "İlk tapınak", en: "The first temple" }, q: { tr: "Çobanlar, çiftçiler ve taştan ilk tapınak.", en: "Shepherds, farmers and the first stone temple." } }] },
        { key: "coe-3-consummation", a: 3840 / 2603,
          label: { tr: ["Thomas Cole", "İmparatorluğun Seyri: Doruk", "1835–36 · New-York Historical Society · yağlı boya"], en: ["Thomas Cole", "The Course of Empire: The Consummation of Empire", "1835–36 · New-York Historical Society · oil on canvas"] },
          stops: [{ u: 0.7, v: 0.42, w: 0.26, h: 0.32, t: { tr: "Zafer", en: "Triumph" }, q: { tr: "Mermer, altın ve sonu gelmeyen bir alay.", en: "Marble, gold and an endless procession." } }] },
        { key: "coe-4-destruction", a: 3840 / 2382,
          label: { tr: ["Thomas Cole", "İmparatorluğun Seyri: Yıkım", "1836 · New-York Historical Society · yağlı boya"], en: ["Thomas Cole", "The Course of Empire: Destruction", "1836 · New-York Historical Society · oil on canvas"] },
          stops: [{ u: 0.84, v: 0.36, w: 0.3, h: 0.42, t: { tr: "Başsız heykel", en: "The headless statue" }, q: { tr: "Kaosun ortasında hâlâ ileri atılan bir savaşçı.", en: "A warrior still lunging forward amid the chaos." } }] },
        { key: "coe-5-desolation", a: 3840 / 2389,
          label: { tr: ["Thomas Cole", "İmparatorluğun Seyri: Issızlık", "1836 · New-York Historical Society · yağlı boya"], en: ["Thomas Cole", "The Course of Empire: Desolation", "1836 · New-York Historical Society · oil on canvas"] },
          stops: [{ u: 0.27, v: 0.38, w: 0.24, h: 0.5, t: { tr: "Son sütun", en: "The last column" }, q: { tr: "Zaman geçer, iz kalır: sütunun tepesinde bir kuş yuvası.", en: "Time passes, the mark remains: a bird's nest on the column." } }] }
    ],
    process: [{
        key: "vanhaecht-gallery", a: 3840 / 2791,
        label: { tr: ["Willem van Haecht", "Cornelis van der Geest'in Galerisi", "1628 · Rubenshuis, Anvers · yağlı boya"],
                 en: ["Willem van Haecht", "The Gallery of Cornelis van der Geest", "1628 · Rubenshuis, Antwerp · oil on panel"] },
        stops: [
            { u: 0.1, v: 0.36, w: 0.2, h: 0.42, t: { tr: "Pencereden ışık", en: "Light from the windows" }, q: { tr: "Her fikir önce ışığı bulur.", en: "Every idea first finds the light." } },
            { u: 0.42, v: 0.3, w: 0.36, h: 0.3, t: { tr: "Duvardaki ilham", en: "Inspiration on the walls" }, q: { tr: "Bir koleksiyon, büyük bir moodboard'dur.", en: "A collection is one big moodboard." } },
            { u: 0.15, v: 0.74, w: 0.3, h: 0.28, t: { tr: "Ziyaretçiler", en: "The visitors" }, q: { tr: "Arşidükler Albert ve Isabella galeriyi geziyor (1615).", en: "Archdukes Albert and Isabella tour the gallery (1615)." } },
            { u: 0.72, v: 0.48, w: 0.3, h: 0.32, t: { tr: "Heykeller", en: "The statues" }, q: { tr: "Tasarım, görünen düşüncedir.", en: "Design is thought made visible." } }
        ]
    }],
    contact: [
        { key: "friedrich-window", a: 3840 / 4807,
          label: { tr: ["Caspar David Friedrich", "Pencerede Kadın", "1822 · Alte Nationalgalerie, Berlin · yağlı boya"], en: ["Caspar David Friedrich", "Woman at a Window", "1822 · Alte Nationalgalerie, Berlin · oil on canvas"] },
          start: { u: 0.5, v: 0.5, w: 1, h: 1 },
          stops: [
              { u: 0.5, v: 0.6, w: 0.32, h: 0.34, t: { tr: "Pencerede", en: "At the window" }, q: { tr: "Her güzel iş, bir mektupla başlar.", en: "Every beautiful work begins with a letter." } },
              { u: 0.55, v: 0.27, w: 0.32, h: 0.2, t: { tr: "Direkler", en: "The masts" }, q: { tr: "Dışarıda, nehirde bir geminin direği.", en: "Outside, the mast of a ship on the river." } },
              { u: 0.49, v: 0.43, w: 0.16, h: 0.12, t: { tr: "Açık kanat", en: "The open pane" }, q: { tr: "Pencere açılır; bahçeye çıkıyoruz.", en: "The window opens; we step out to the garden." } }
          ] },
        { key: "corot-villa-deste", a: 3840 / 2658,
          label: { tr: ["Camille Corot", "Tivoli, Villa d'Este Bahçeleri", "1843 · Louvre Müzesi · yağlı boya"], en: ["Camille Corot", "Tivoli, the Gardens of the Villa d'Este", "1843 · Musée du Louvre · oil on canvas"] },
          stops: [
              { u: 0.42, v: 0.68, w: 0.4, h: 0.36, t: { tr: "Korkulukta", en: "On the balustrade" }, q: { tr: "Mektubunu mühürle, gerisini zamana bırak.", en: "Seal your letter, leave the rest to time." } },
              { u: 0.68, v: 0.32, w: 0.26, h: 0.46, t: { tr: "Serviler", en: "The cypresses" }, q: { tr: "Gizli bahçe, sisli tepelere açılır.", en: "The secret garden opens onto misty hills." } }
          ] }
    ]
};
