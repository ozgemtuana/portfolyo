/* ==========================================================================
   Site içeriği (tek veri dosyası)
   - Tüm metinler, profil bilgileri, projeler, deneyim, eğitim, yetenekler,
     diller ve istatistikler burada tutulur.
   - Bu dosyayı elle düzenleyebilir ya da admin.html panelinden
     "content.js indir" ile yeniden üretip bunun yerine koyabilirsin.
   - Metinlerde {name} ve {firstName} profil bilgileriyle değiştirilir.
   - JSON değil JS dosyasıdır: file:// ile açıldığında da çalışsın diye.
   ========================================================================== */

window.SITE_CONTENT = {
    "profile": {
        "name": "Tuana Davarcı",
        "firstName": "Tuana",
        "email": "ozgmtuana15@gmail.com",
        "phone": "0552 311 07 00",
        "location": "Antalya, TR",
        "github": "https://github.com/ozgemtuana",
        "instagram": "https://www.instagram.com/ozgemtuana/",
        "linkedin": "",
        "cv": "",
        "address": "Muratpaşa, Antalya, TR"
    },
    "text": {
        "tr": {
            "meta.title.home": "Ana Sayfa — {name}",
            "meta.title.resume": "Özgeçmiş — {name}",
            "meta.title.projects": "Projeler — {name}",
            "meta.title.contact": "İletişim — {name}",
            "nav.home": "Ana Sayfa",
            "nav.resume": "Özgeçmiş",
            "nav.projects": "Projeler",
            "nav.contact": "İletişim",
            "nav.toggle": "Menüyü aç/kapat",
            "hero.status": "Yeni projelere açığım",
            "hero.line1": "Merhaba,",
            "hero.line2": "ben <em>{firstName}</em>",
            "hero.based": "Konum",
            "hero.local": "Yerel saat",
            "cursor.view": "Gör",
            "cursor.mail": "Yaz",
            "hero.sub": "Akdeniz Üniversitesi'nde Bilgisayar Programcılığı öğrencisiyim. Web tasarım, ürün tanıtımı ve sosyal medya yönetimiyle markalara akılda kalan bir görsel dil kazandırıyorum.",
            "hero.cta1": "Projelerimi Gör",
            "hero.cta2": "Özgeçmiş",
            "hero.scroll": "Kaydır",
            "hero.inhale": "nefes al",
            "hero.exhale": "nefes ver",
            "marquee.1": "Web Tasarım",
            "marquee.2": "Ürün Tanıtımı",
            "marquee.3": "Sosyal Medya",
            "marquee.4": "Modellik",
            "marquee.5": "Python",
            "marquee.6": "Photoshop",
            "marquee.7": "Instagram",
            "marquee.8": "HTML & CSS",
            "about.eyebrow": "Hakkımda",
            "about.statement": "Kod, tasarım ve kamera önü. Üçünü bir araya getirip markalar için hem güzel görünen hem de işe yarayan dijital deneyimler üretiyorum.",
            "work.eyebrow": "Seçili İşler",
            "work.title": "Öne çıkan <em>projeler</em>",
            "work.all": "Tüm projeler",
            "services.eyebrow": "Neler yapıyorum",
            "services.1.t": "Web Tasarım",
            "services.1.d": "HTML5, CSS3 ve JavaScript ile modern, responsive siteler.",
            "services.2.t": "Ürün Tanıtımı",
            "services.2.d": "Ürünleri öne çıkaran tanıtım görselleri ve kampanya tasarımları.",
            "services.3.t": "Sosyal Medya Yönetimi",
            "services.3.d": "Instagram hesapları için içerik planı, paylaşım ve topluluk yönetimi.",
            "services.4.t": "Modellik",
            "services.4.d": "Markalar için kamera önü çekimler ve ürün tanıtım içerikleri.",
            "runway.eyebrow": "Podyum",
            "runway.title": "Podyumdan <em>kareler</em>",
            "runway.sub": "Her look kendi deri dosyasında. Bir dosyaya tıkla; içindeki kareler kâğıttan kesilmiş gibi çıksın.",
            "runway.click": "Tıkla · Aç · ",
            "runway.open": "Dosyayı aç",
            "runway.close": "Kapat",
            "runway.prev": "Önceki",
            "runway.next": "Sonraki",
            "runway.hint": "Bir kareye tıkla, büyüsün",
            "quote.1.text": "Her çiçek kendi zamanında açar.",
            "quote.1.by": "Atasözü",
            "quote.2.text": "Moda geçer, stil kalır.",
            "quote.2.by": "Coco Chanel",
            "quote.3.text": "Sen okyanusta bir damla değilsin; bir damlada okyanusun tamamısın.",
            "quote.3.by": "Mevlânâ",
            "cta.eyebrow": "Bir fikrin mi var?",
            "cta.big": "Hadi <em>konuşalım</em>",
            "footer.copy": "© 2026 {name}. Tüm hakları saklıdır.",
            "footer.template": "Şablon: Start Bootstrap",
            "footer.up": "Yukarı ↑",
            "resume.title": "Özgeç<em>miş</em>",
            "resume.sub": "Eğitimim, deneyimlerim ve kullandığım araçlar.",
            "resume.download": "CV İndir",
            "resume.exp": "Deneyim",
            "resume.edu": "Eğitim",
            "resume.skills": "Yetenekler",
            "resume.langs": "Diller",
            "resume.prof": "Uzmanlık",
            "projects.title": "Seçili <em>işler</em>",
            "projects.sub": "Tasarım, ürün tanıtımı ve web çalışmalarımdan bir seçki.",
            "projects.view": "İncele",
            "projects.cta": "Bir projede birlikte çalışmak ister misin?",
            "projects.cta.btn": "İletişime geç",
            "contact.title": "Birlikte bir şeyler <em>yapalım</em>",
            "contact.sub": "Proje, staj veya sadece merhaba demek için formu doldurabilirsin.",
            "contact.name": "Adın",
            "contact.email": "E-posta adresin",
            "contact.phone": "Telefon numaran",
            "contact.message": "Mesajın",
            "contact.send": "Gönder",
            "contact.success": "Teşekkürler! Mesajın e-posta uygulamanda açıldı.",
            "contact.error": "Lütfen tüm alanları doğru doldur.",
            "contact.mail": "E-posta",
            "contact.tel": "Telefon",
            "contact.loc": "Konum",
            "contact.social": "Sosyal",
            "schedule.eyebrow": "Bu dönem",
            "schedule.title": "Ders <em>programım</em>",
            "schedule.title.plain": "Haftalık ders programı",
            "schedule.term": "2026–2027 Güz · Bilgisayar Programcılığı",
            "schedule.time": "Saat",
            "schedule.day1": "Pazartesi",
            "schedule.day2": "Salı",
            "schedule.day3": "Çarşamba",
            "schedule.day4": "Perşembe",
            "schedule.day5": "Cuma",
            "schedule.kind.teori": "Teori",
            "schedule.kind.uygulama": "Uygulama",
            "schedule.kind.karma": "Teori + Uygulama",
            "schedule.kind.uzaktan": "Uzaktan",
            "schedule.now": "Şu an derste",
            "schedule.today": "Bugün",
            "schedule.lunch": "Öğle arası",
            "nav.about": "Hakkımda",
            "meta.title.about": "Hakkımda — {name}",
            "about.more": "Hakkımda daha fazlası",
            "aboutpage.title": "Ben <em>kimim?</em>",
            "aboutpage.sub": "Kod yazan, sahneye çıkan ve satranç tahtasında strateji kuran biri.",
            "aboutpage.intro.h": "Kısaca <em>ben</em>",
            "aboutpage.intro.p1": "Akdeniz Üniversitesi'nde Bilgisayar Programcılığı ön lisans öğrencisiyim. Aynı zamanda Anadolu Üniversitesi <abbr title=\"Açıköğretim Fakültesi\">AÖF</abbr>'de <abbr title=\"Yapay Zekâ\">YZ</abbr> destekli kodlama okuyorum.",
            "aboutpage.intro.p2": "Web tarafında <abbr title=\"HyperText Markup Language\">HTML</abbr>, <abbr title=\"Cascading Style Sheets\">CSS</abbr> ve <abbr title=\"JavaScript\">JS</abbr> ile arayüzler kuruyor, Python ile küçük araçlar yazıyorum. İlk satırım klasik bir <code>&lt;h1&gt;Merhaba Dünya&lt;/h1&gt;</code> idi; bu site de o merakın devamı.",
            "aboutpage.intro.p3": "Kodun dışında hayatım sahnede ve tahtada geçti: 6 yıldır lisanslı satranç oyuncusuyum, 5 yıl Devlet Opera ve Balesi korosunda sahne aldım, tenis oynuyorum, yelken eğitimi aldım ve podyumda yürüdüm. Hepsi bana aynı şeyi öğretti: <mark>disiplin, odak ve doğru zamanda doğru hamle.</mark>",
            "aboutpage.code": "// Bir bakışta ben\nconst tuana = {\n  bolum: \"Bilgisayar Programcılığı\",\n  okullar: [\"Akdeniz Üniversitesi\", \"Anadolu Üniversitesi AÖF\"],\n  ilgiAlanlari: [\"satranç\", \"opera\", \"tenis\", \"yelken\", \"podyum\"],\n  gucluYonler: [\"stratejik düşünme\", \"odak\", \"sahne disiplini\"],\n};\n\nfunction sonrakiHamle(hedef) {\n  return `${hedef}: kod + tasarım + sahne`;\n}\n\nconsole.log(sonrakiHamle(\"Yeni projeler\"));\n// → \"Yeni projeler: kod + tasarım + sahne\"",
            "aboutpage.quote": "Satranç, zihnin spor salonudur.",
            "aboutpage.quote.by": "Blaise Pascal",
            "aboutpage.int.eyebrow": "İlgi alanlarım",
            "aboutpage.int.title": "Tahtadan <em>sahneye</em>",
            "aboutpage.chess.t": "Satranç",
            "aboutpage.chess.meta": "6 yıl · Lisanslı oyuncu",
            "aboutpage.chess.list": "<li>Antalya Kadınlar Şampiyonası — <strong>1.</strong></li><li>Finike, Yıldızlar Kategorisi — <strong>1.</strong></li><li>Kumluca Satranç Turnuvası — <strong>1.</strong> ve <strong>2.</strong> derece</li>",
            "aboutpage.chess.tags": "Stratejik düşünme · Analitik problem çözme · Odaklanma · Karar verme",
            "aboutpage.stage.t": "Sahne ve müzik",
            "aboutpage.stage.meta": "2016 – 2021",
            "aboutpage.stage.list": "<li><strong>Devlet Opera ve Balesi</strong> — 5 yıl koro sanatçısı</li><li><cite>Carmen</cite> ve <cite>La Bohème</cite> operalarında 6–7 temsil</li><li><strong>ENBE Orkestrası</strong> ile solo vokal performansı</li>",
            "aboutpage.stage.tags": "Klasik müzik · Sahne disiplini · Toplu performans",
            "aboutpage.sport.t": "Spor",
            "aboutpage.sport.meta": "Tenis 5 yıl · Yelken",
            "aboutpage.sport.list": "<li><strong>Tenis</strong> — 5 yıllık oyunculuk deneyimi</li><li><strong>Yelken</strong> — yelkenli tekne kullanım eğitimi</li>",
            "aboutpage.sport.tags": "El-göz koordinasyonu · Denge · Disiplin · Strateji",
            "aboutpage.runway.t": "Podyum",
            "aboutpage.runway.meta": "3 defile",
            "aboutpage.runway.list": "<li>3 farklı podyum etkinliğinde model</li><li>Podyum yürüyüşü, sahne duruşu ve koreografi</li><li>Etkinlik akışına uyum ve profesyonel görünüm</li>",
            "aboutpage.runway.tags": "Sahne duruşu · Koreografi · Profesyonellik",
            "aboutpage.skills.eyebrow": "Yeteneklerim",
            "aboutpage.skills.title": "Yüzdelerle <em>ben</em>",
            "aboutpage.skills.tech": "Teknik yetenekler",
            "aboutpage.skills.soft": "Kişisel yetkinlikler",
            "aboutpage.edu.title": "Eğitim",
            "aboutpage.edu.1.t": "Akdeniz Üniversitesi",
            "aboutpage.edu.1.d": "Bilgisayar Programcılığı · Ön lisans · <time datetime=\"2026\">2026</time> – devam ediyor",
            "aboutpage.edu.2.t": "Anadolu Üniversitesi",
            "aboutpage.edu.2.d": "Yapay Zekâ Destekli Kodlama · Açıköğretim · <time datetime=\"2026\">2026</time> – devam ediyor",
            "aboutpage.cta": "Birlikte bir şey <em>yapalım mı?</em>",
            "aboutpage.cta.btn": "İletişime geç",
            "aboutpage.style.t": "Moda ve kişisel stil",
            "aboutpage.style.meta": "Stil · İmaj · Estetik",
            "aboutpage.style.list": "<li>Moda trendlerini ve güncel stil anlayışını takip ediyorum</li><li>Renk, desen ve aksesuar uyumunu gözeterek özgün kombinler oluşturuyorum</li><li>Farklı tarzları bir araya getirip yaratıcı, estetik görünümler kuruyorum</li>",
            "aboutpage.style.tags": "Renk uyumu · Görsel bütünlük · Kişisel imaj",
            "aboutpage.hobbies.title": "Hobilerimden <em>kareler</em>",
            "aboutpage.hobbies.sub": "Satranç turnuvalarından opera sahnesine, binicilikten kulis anlarına… Deri dosyayı aç, fotoğrafları tek tek gez.",
            "aboutpage.hobbies.click": "Tıkla ve görselleri gör",
            "nav.blog": "Blog",
            "meta.title.blog": "Blog — {name}",
            "blog.eyebrow": "Yazılar ve notlar",
            "blog.title": "Blog",
            "blog.sub": "Teknolojiyi öğrenirken, markalar için tasarlarken ve podyumda yürürken öğrendiklerim: üç uzun yazı.",
            "blog.note": "Yazılar Türkçe hazırlanmıştır.",
            "blog.read": "Yazıyı oku",
            "blog.min": "dk okuma",
            "blog.end.title": "Daha fazlası <em>için</em>",
            "blog.end.about": "Kimim, nelerle ilgileniyorum?",
            "blog.end.resume": "Eğitim, deneyim ve ders programım.",
            "blog.end.projects": "Ürün tanıtımı ve web çalışmalarım.",
            "blog.end.contact": "Proje ya da iş birliği için yaz.",
            "pagenav.next": "Sıradaki sayfa",
            "pagenav.restart": "Başa dön",
            "pagenav.prev": "Önceki",
            "pagenav.all": "Tüm sayfalar",
            "pagenav.desc.home": "Giriş, plak rafım ve podyumdan kareler.",
            "pagenav.desc.about": "Kimim, ders programım, hobilerim ve yeteneklerim.",
            "pagenav.desc.resume": "Eğitim, deneyim ve kullandığım araçlar.",
            "pagenav.desc.projects": "Ürün tanıtımı ve web çalışmalarım.",
            "pagenav.desc.blog": "Yapay zekâ, dijital tanıtım ve modellik üzerine üç yazı.",
            "pagenav.desc.contact": "Proje, iş birliği ya da merhaba demek için yaz.",
            "aboutpage.photo.alt": "Tuana Davarcı vesikalık fotoğrafı",
            "aboutpage.photo.cap": "Bilgisayar Programcılığı · Akdeniz Üniversitesi",
            "contact.addr": "Adres",
            "nav.gallery": "Galeri",
            "meta.title.gallery": "Galeri — {name}",
            "gallery.eyebrow": "Kareler",
            "gallery.title": "Galeri",
            "gallery.sub": "Beni en çok yansıttığını düşündüğüm fotoğraflar.",
            "nav.process": "Süreç",
            "meta.title.process": "Süreç & İlham — {name}",
            "pagenav.desc.process": "Konsept, ilham, renkler, fontlar ve kullandığım araçlar.",
            "meta.desc.home": "Tuana Davarcı'nın kişisel portfolyosu: Akdeniz Üniversitesi Bilgisayar Programcılığı öğrencisi, grafik animasyon, web tasarım ve ürün tanıtımı.",
            "meta.desc.about": "Tuana Davarcı kimdir? Vesikalık, özgeçmiş, ders programı, ilgi alanları ve yeteneklerin yüzdeleri.",
            "meta.desc.resume": "Tuana Davarcı'nın eğitimi, deneyimi, dilleri ve kullandığı araçlar.",
            "meta.desc.projects": "Grafik Animasyon dersinde hazırlanan çalışmalar: ürün tanıtımı, Photoshop renklendirme, Smart Object ve web arayüzü tasarımı.",
            "meta.desc.blog": "Yapay zekâ, dijital tanıtım ve kişisel marka üzerine üç blog yazısı, ekran görüntüleriyle.",
            "meta.desc.gallery": "Tuana Davarcı'yı en çok yansıtan fotoğraflar ve kısa açıklamaları.",
            "meta.desc.process": "Sitenin konsepti, ilham kaynakları, renk paleti, fontları, kullanılan araçlar ve yapım süreci.",
            "meta.desc.contact": "Tuana Davarcı ile iletişim: adres, telefon ve iletişim formu.",
            "process.eyebrow": "Perde arkası",
            "process.title": "Süreç & <em>ilham</em>",
            "process.sub": "Bu sitenin nasıl düşünüldüğü, nelerden ilham aldığı ve hangi araçlarla yapıldığı.",
            "process.concept.title": "Konsept",
            "process.concept.body": "Site, kendimi bir portfolyo olarak değil, içinde gezilen bir dünya olarak anlatma fikrinden çıktı. Kaydırdıkça kamera ilerliyor; orman, kemerler ve lilyumlar arasında sayfadan sayfaya geçiyorsun. Renkler zeytin yeşili, ahşap kahvesi ve krem; vurgu olarak mat altın kullandım. Bütün içerik gerçek HTML olarak duruyor, 3D yalnızca arka planda.",
            "process.mood.title": "Moodboard ve ilham kaynakları",
            "process.mood.body": "İlhamı Pinterest'te topladım. Aşağıdaki panolar tasarım yönünü belirledi. Telif nedeniyle bu görselleri sitede kullanmadım; yalnızca bağlantılarını veriyorum.",
            "process.ink.1": "Açılış: kitaptan çıkan şato",
            "process.ink.2": "Zarf sayfa geçişi",
            "process.ink.3": "Genel estetik: Old World",
            "process.ink.4": "Altın mühür ve kurdele",
            "process.ink.5": "Kaydırma yolculuğu: kule",
            "process.ink.6": "Anahtar deliği",
            "process.ink.7": "Altın servis kubbesi",
            "process.ink.8": "Arka plan ve dantel kart",
            "process.ink.9": "Fontlar",
            "process.ink.10": "Kahve zarf ve kemerli kart",
            "process.ink.11": "Gizli bahçe zarfı",
            "process.ink.12": "Oval çerçeve",
            "process.pal.title": "Renk paleti",
            "process.pal.body": "Sitede kullanılan renkler (CSS değişkenleri olarak tanımlı):",
            "process.sw.1": "Orman",
            "process.sw.2": "Zeytin",
            "process.sw.3": "Adaçayı",
            "process.sw.4": "Ahşap",
            "process.sw.5": "Ceviz",
            "process.sw.6": "Eski kâğıt",
            "process.sw.7": "Krem",
            "process.sw.8": "Altın",
            "process.type.title": "Tipografi",
            "process.type.display": "Başlıklar: Cormorant Garamond, ince ve yüksek kontrastlı serif; sayfa başlıklarının üstündeki küçük başlıkta Pinyon Script (kaligrafi).",
            "process.type.body": "Metin ve etiketler: Jost, okunaklı ve sade.",
            "process.type.sample": "Merak, her tasarımın ilk fırça darbesidir.",
            "process.tools.title": "Kullanılan araçlar ve teknolojiler",
            "process.tool.1": "Visual Studio Code: kod editörü",
            "process.tool.2": "Claude Code: yapay zekâ destekli kodlama; sayfaların, animasyonların ve testlerin yazımında",
            "process.tool.3": "HTML5 / CSS3 / JavaScript: sitenin temeli; çok sayfalı, framework'süz yapı",
            "process.tool.4": "Bootstrap 5 ve Start Bootstrap “Personal” şablonu: ızgara ve temel bileşenler (şablon kaynağı kaynak.txt'de)",
            "process.tool.5": "Three.js: arka plandaki 3D orman dünyası",
            "process.tool.6": "GSAP + ScrollTrigger: kaydırmaya bağlı animasyonlar",
            "process.tool.7": "Lenis: yumuşak kaydırma",
            "process.tool.8": "Google Fonts: Cormorant Garamond, Jost ve Pinyon Script",
            "process.tool.9": "Playwright: sayfaları farklı ekran boyutlarında otomatik test etmek için",
            "process.tool.10": "GitHub ve GitHub Pages: sürüm takibi ve yayın",
            "process.tool.11": "Pinterest: ilham ve moodboard",
            "process.skill.title": "Claude Code skill'leri",
            "process.skill.body": "Skill'ler .claude/skills/ klasöründe duruyor. Resmî kaynaklardan yüklenenlerin içeriğini yüklemeden önce okudum. Gerçekten uyguladıklarım:",
            "process.skill.1": "seo-geo-bilingual: iki dilli metin, meta etiketleri, JSON-LD, sitemap ve llms.txt düzeni.",
            "process.skill.2": "frontend-design (Anthropic): tasarım planını (renk, font, yerleşim) yazıp brief'e göre gözden geçirme süreci.",
            "process.skill.3": "impeccable (metin yönergeleri): kalite tabanı, tipografi ve kaçınılacak şablon kalıpları. Programın kendi indirilen aracını çalıştırmadım.",
            "process.skill.4": "Yüklü, sonraki aşamalarda kullanılacak: GSAP (core, ScrollTrigger, timeline, performance) ve Three.js (8 skill).",
            "process.steps.title": "Süreç",
            "process.step.1": "İlham toplama: Pinterest'te panolar oluşturdum.",
            "process.step.2": "Moodboard: renk, doku ve duyguyu seçtim.",
            "process.step.3": "Palet ve fontlar: CSS değişkenlerine bağladım.",
            "process.step.4": "3D sahne kurgusu: orman dünyasını ve kamera yolunu tasarladım.",
            "process.step.5": "Kodlama: sayfalar, iki dil, form, galeri ve blog.",
            "process.step.6": "Test: telefon, tablet ve masaüstünde denedim.",
            "process.step.7": "Teslim: klasörü zip'leyip yayınladım.",
            "dive.0.artist": "Giovanni Paolo Panini",
            "dive.0.title": "Modern Roma Manzaraları Galerisi",
            "dive.0.meta": "1759 · Louvre Müzesi · yağlı boya",
            "dive.1.artist": "Hubert Robert",
            "dive.1.title": "Kemerli Manzara ve Aziz Petrus Kubbesi",
            "dive.1.meta": "18. yüzyıl · Ermitaj Müzesi · yağlı boya",
            "dive.2.artist": "Thomas Cole",
            "dive.2.title": "Yıkık Kuleli İtalyan Kıyısı",
            "dive.2.meta": "1838 · National Gallery of Art · yağlı boya",
            "cap.0.t": "Tonoz ve ışıklık",
            "cap.0.q": "Panini hayal ürünü bir galeri kurar; ışık, kemerlerin arasından süzülür.",
            "cap.1.t": "Musa",
            "cap.1.q": "Michelangelo'nun Musa heykeli, tabloların arasında bir başyapıt daha.",
            "cap.2.t": "Koleksiyoncular",
            "cap.2.q": "Ortadaki beyefendiler eserleri inceliyor: sanat, sohbetle büyür.",
            "cap.3.t": "Aziz Petrus Kubbesi",
            "cap.3.q": "Kemerin ardında, sıcak akşam ışığında Roma'nın en tanıdık silueti.",
            "cap.4.t": "Nişteki heykel",
            "cap.4.q": "Hubert Robert'e “harabelerin Robert'i” denirdi; yıkık taş bile onda sahne olur.",
            "cap.5.t": "Merdivendeki gezginler",
            "cap.5.q": "Küçük figürler, taşın ne kadar büyük ve eski olduğunu hissettirir.",
            "cap.6.t": "Yıkık kule",
            "cap.6.q": "Zaman geçer, iz kalır: sarmaşık kuleyi sarar ama kule ayakta.",
            "cap.7.t": "Çoban ve sürüsü",
            "cap.7.q": "Harabenin yanında hayat sakin sakin sürer.",
            "cap.8.t": "Denizde ışık",
            "cap.8.q": "Ufuktaki güneş, sakin denize altın bir yol çizer.",
            "ui.play": "Oynat",
            "ui.pause": "Duraklat",
            "ui.map": "Tablodaki konum",
            "pagenav.desc.gallery": "Beni en çok yansıtan fotoğraflar ve kısa notlar.",
            "aboutpage.lists.eyebrow": "Kısaca",
            "aboutpage.lists.title": "Listelerle <em>ben</em>",
            "aboutpage.lists.skills": "Yeteneklerim",
            "aboutpage.lists.skills.note": "Kullandığım araçlar, öğrenme sırasıyla:",
            "aboutpage.lists.interests": "İlgi alanlarım",
            "aboutpage.lists.interests.note": "Boş zamanımda yaptıklarım:",
            "aboutpage.lists.int1": "Satranç",
            "aboutpage.lists.int2": "Opera ve koro",
            "aboutpage.lists.int3": "Tenis",
            "aboutpage.lists.int4": "Binicilik",
            "aboutpage.lists.int5": "Podyum ve modellik",
            "home.gallery.eyebrow": "Kareler",
            "home.gallery.title": "Galeriden <em>kareler</em>",
            "home.gallery.all": "Tüm galeri",
            "pf.cover.script": "Seçili işler",
            "pf.cover.title": "Portfolyo",
            "scenes.hint": "Anahtar deliğinden geçmek için kaydır",
            "pf.tabs": "Portfolyo bölümleri"
        },
        "en": {
            "meta.title.home": "Home — {name}",
            "meta.title.resume": "Resume — {name}",
            "meta.title.projects": "Projects — {name}",
            "meta.title.contact": "Contact — {name}",
            "nav.home": "Home",
            "nav.resume": "Resume",
            "nav.projects": "Projects",
            "nav.contact": "Contact",
            "nav.toggle": "Toggle navigation",
            "hero.status": "Available for new projects",
            "hero.line1": "Hello,",
            "hero.line2": "I'm <em>{firstName}</em>",
            "hero.based": "Based in",
            "hero.local": "Local time",
            "cursor.view": "View",
            "cursor.mail": "Write",
            "hero.sub": "Computer Programming student at Akdeniz University. I give brands a memorable visual language through web design, product promotion and social media management.",
            "hero.cta1": "See my work",
            "hero.cta2": "Resume",
            "hero.scroll": "Scroll",
            "hero.inhale": "breathe in",
            "hero.exhale": "breathe out",
            "marquee.1": "Web Design",
            "marquee.2": "Product Promo",
            "marquee.3": "Social Media",
            "marquee.4": "Modelling",
            "marquee.5": "Python",
            "marquee.6": "Photoshop",
            "marquee.7": "Instagram",
            "marquee.8": "HTML & CSS",
            "about.eyebrow": "About me",
            "about.statement": "Code, design and being in front of the camera. I bring all three together to create digital experiences for brands that look good and work well.",
            "work.eyebrow": "Selected work",
            "work.title": "Featured <em>projects</em>",
            "work.all": "All projects",
            "services.eyebrow": "What I do",
            "services.1.t": "Web Design",
            "services.1.d": "Modern, responsive websites with HTML5, CSS3 and JavaScript.",
            "services.2.t": "Product Promotion",
            "services.2.d": "Promotional visuals and campaign designs that make products stand out.",
            "services.3.t": "Social Media Management",
            "services.3.d": "Content planning, posting and community management for Instagram accounts.",
            "services.4.t": "Modelling",
            "services.4.d": "On-camera shoots and product promotion content for brands.",
            "runway.eyebrow": "Runway",
            "runway.title": "From the <em>runway</em>",
            "runway.sub": "Each look lives in its own leather folder. Click one and the shots slide out like hand-cut paper.",
            "runway.click": "Click · Open · ",
            "runway.open": "Open folder",
            "runway.close": "Close",
            "runway.prev": "Previous",
            "runway.next": "Next",
            "runway.hint": "Click a shot to enlarge it",
            "quote.1.text": "Every flower blooms in its own time.",
            "quote.1.by": "Proverb",
            "quote.2.text": "Fashion fades, only style remains the same.",
            "quote.2.by": "Coco Chanel",
            "quote.3.text": "You are not a drop in the ocean. You are the entire ocean in a drop.",
            "quote.3.by": "Rumi",
            "cta.eyebrow": "Got an idea?",
            "cta.big": "Let's <em>talk</em>",
            "footer.copy": "© 2026 {name}. All rights reserved.",
            "footer.template": "Template: Start Bootstrap",
            "footer.up": "Back to top ↑",
            "resume.title": "Résu<em>mé</em>",
            "resume.sub": "My education, experience and the tools I use.",
            "resume.download": "Download CV",
            "resume.exp": "Experience",
            "resume.edu": "Education",
            "resume.skills": "Skills",
            "resume.langs": "Languages",
            "resume.prof": "Proficiency",
            "projects.title": "Selected <em>work</em>",
            "projects.sub": "A selection of my design, product promotion and web work.",
            "projects.view": "View",
            "projects.cta": "Want to work on a project together?",
            "projects.cta.btn": "Get in touch",
            "contact.title": "Let's make something <em>together</em>",
            "contact.sub": "Fill in the form for a project, an internship or just to say hi.",
            "contact.name": "Your name",
            "contact.email": "Email address",
            "contact.phone": "Phone number",
            "contact.message": "Your message",
            "contact.send": "Send",
            "contact.success": "Thanks! Your message was opened in your email app.",
            "contact.error": "Please fill in all fields correctly.",
            "contact.mail": "Email",
            "contact.tel": "Phone",
            "contact.loc": "Location",
            "contact.social": "Social",
            "schedule.eyebrow": "This term",
            "schedule.title": "My class <em>schedule</em>",
            "schedule.title.plain": "Weekly class schedule",
            "schedule.term": "Fall 2026–2027 · Computer Programming",
            "schedule.time": "Time",
            "schedule.day1": "Monday",
            "schedule.day2": "Tuesday",
            "schedule.day3": "Wednesday",
            "schedule.day4": "Thursday",
            "schedule.day5": "Friday",
            "schedule.kind.teori": "Theory",
            "schedule.kind.uygulama": "Lab",
            "schedule.kind.karma": "Theory + Lab",
            "schedule.kind.uzaktan": "Online",
            "schedule.now": "In class now",
            "schedule.today": "Today",
            "schedule.lunch": "Lunch break",
            "nav.about": "About",
            "meta.title.about": "About — {name}",
            "about.more": "More about me",
            "aboutpage.title": "Who <em>am I?</em>",
            "aboutpage.sub": "Someone who writes code, takes the stage and builds strategies on the chessboard.",
            "aboutpage.intro.h": "Me in <em>short</em>",
            "aboutpage.intro.p1": "I'm a Computer Programming (associate degree) student at Akdeniz University. I'm also studying <abbr title=\"Artificial Intelligence\">AI</abbr>-assisted coding at Anadolu University's <abbr title=\"Open Education Faculty\">AÖF</abbr>.",
            "aboutpage.intro.p2": "On the web I build interfaces with <abbr title=\"HyperText Markup Language\">HTML</abbr>, <abbr title=\"Cascading Style Sheets\">CSS</abbr> and <abbr title=\"JavaScript\">JS</abbr>, and write small tools in Python. My first line was the classic <code>&lt;h1&gt;Hello World&lt;/h1&gt;</code>; this site is where that curiosity led.",
            "aboutpage.intro.p3": "Outside of code, my life has been on stage and on the board: I've been a licensed chess player for 6 years, sang in the State Opera and Ballet choir for 5 years, play tennis, trained in sailing and walked the runway. They all taught me the same thing: <mark>discipline, focus and the right move at the right time.</mark>",
            "aboutpage.code": "// Me at a glance\nconst tuana = {\n  programme: \"Computer Programming\",\n  schools: [\"Akdeniz University\", \"Anadolu University (Open Ed.)\"],\n  interests: [\"chess\", \"opera\", \"tennis\", \"sailing\", \"runway\"],\n  strengths: [\"strategic thinking\", \"focus\", \"stage discipline\"],\n};\n\nfunction nextMove(goal) {\n  return `${goal}: code + design + stage`;\n}\n\nconsole.log(nextMove(\"New projects\"));\n// → \"New projects: code + design + stage\"",
            "aboutpage.quote": "Chess is the gymnasium of the mind.",
            "aboutpage.quote.by": "Blaise Pascal",
            "aboutpage.int.eyebrow": "My interests",
            "aboutpage.int.title": "From the board <em>to the stage</em>",
            "aboutpage.chess.t": "Chess",
            "aboutpage.chess.meta": "6 years · Licensed player",
            "aboutpage.chess.list": "<li>Antalya Women's Championship — <strong>1st</strong></li><li>Finike, Juniors category — <strong>1st</strong></li><li>Kumluca Chess Tournament — <strong>1st</strong> and <strong>2nd</strong> place</li>",
            "aboutpage.chess.tags": "Strategic thinking · Analytical problem solving · Focus · Decision making",
            "aboutpage.stage.t": "Stage & music",
            "aboutpage.stage.meta": "2016 – 2021",
            "aboutpage.stage.list": "<li><strong>Turkish State Opera and Ballet</strong> — choir artist for 5 years</li><li>6–7 performances of <cite>Carmen</cite> and <cite>La Bohème</cite></li><li>Solo vocal performance with the <strong>ENBE Orchestra</strong></li>",
            "aboutpage.stage.tags": "Classical music · Stage discipline · Ensemble performance",
            "aboutpage.sport.t": "Sports",
            "aboutpage.sport.meta": "Tennis 5 yrs · Sailing",
            "aboutpage.sport.list": "<li><strong>Tennis</strong> — 5 years of playing experience</li><li><strong>Sailing</strong> — trained in sailing boat handling</li>",
            "aboutpage.sport.tags": "Hand-eye coordination · Balance · Discipline · Strategy",
            "aboutpage.runway.t": "Runway",
            "aboutpage.runway.meta": "3 shows",
            "aboutpage.runway.list": "<li>Modelled in 3 different runway events</li><li>Runway walk, stage presence and choreography</li><li>Following the event flow with a professional look</li>",
            "aboutpage.runway.tags": "Stage presence · Choreography · Professionalism",
            "aboutpage.skills.eyebrow": "My skills",
            "aboutpage.skills.title": "Me in <em>percentages</em>",
            "aboutpage.skills.tech": "Technical skills",
            "aboutpage.skills.soft": "Personal strengths",
            "aboutpage.edu.title": "Education",
            "aboutpage.edu.1.t": "Akdeniz University",
            "aboutpage.edu.1.d": "Computer Programming · Associate degree · <time datetime=\"2026\">2026</time> – present",
            "aboutpage.edu.2.t": "Anadolu University",
            "aboutpage.edu.2.d": "AI-Assisted Coding · Open Education · <time datetime=\"2026\">2026</time> – present",
            "aboutpage.cta": "Shall we make <em>something together?</em>",
            "aboutpage.cta.btn": "Get in touch",
            "aboutpage.style.t": "Fashion & personal style",
            "aboutpage.style.meta": "Style · Image · Aesthetics",
            "aboutpage.style.list": "<li>I follow fashion trends and current takes on style</li><li>I put together original outfits with an eye for colour, pattern and accessories</li><li>I combine different styles into creative, aesthetic looks</li>",
            "aboutpage.style.tags": "Colour harmony · Visual coherence · Personal image",
            "aboutpage.hobbies.title": "Moments from <em>my hobbies</em>",
            "aboutpage.hobbies.sub": "From chess tournaments to the opera stage, from horse riding to backstage moments… Open the leather folder and flip through the photos.",
            "aboutpage.hobbies.click": "Click and see the photos",
            "nav.blog": "Blog",
            "meta.title.blog": "Blog — {name}",
            "blog.eyebrow": "Posts & notes",
            "blog.title": "Blog",
            "blog.sub": "What I learn while studying technology, designing for brands and walking the runway: three long reads.",
            "blog.note": "The posts are written in Turkish.",
            "blog.read": "Read the post",
            "blog.min": "min read",
            "blog.end.title": "Keep <em>exploring</em>",
            "blog.end.about": "Who am I and what do I care about?",
            "blog.end.resume": "Education, experience and my class schedule.",
            "blog.end.projects": "My product promotion and web work.",
            "blog.end.contact": "Write to me about a project or collaboration.",
            "pagenav.next": "Next page",
            "pagenav.restart": "Back to the start",
            "pagenav.prev": "Previous",
            "pagenav.all": "All pages",
            "pagenav.desc.home": "Intro, my record shelf and runway shots.",
            "pagenav.desc.about": "Who I am, my class schedule, hobbies and skills.",
            "pagenav.desc.resume": "Education, experience and the tools I use.",
            "pagenav.desc.projects": "My product promotion and web work.",
            "pagenav.desc.blog": "Three posts on AI, digital promotion and modelling.",
            "pagenav.desc.contact": "Write to me about a project, a collaboration or just to say hi.",
            "aboutpage.photo.alt": "Tuana Davarcı ID-style portrait",
            "aboutpage.photo.cap": "Computer Programming · Akdeniz University",
            "contact.addr": "Address",
            "nav.gallery": "Gallery",
            "meta.title.gallery": "Gallery — {name}",
            "gallery.eyebrow": "Frames",
            "gallery.title": "Gallery",
            "gallery.sub": "The photos I think reflect me best.",
            "nav.process": "Process",
            "meta.title.process": "Process & Inspiration — {name}",
            "pagenav.desc.process": "Concept, inspiration, colours, fonts and the tools I used.",
            "meta.desc.home": "Personal portfolio of Tuana Davarcı: computer programming student at Akdeniz University, working in graphic animation, web design and product promotion.",
            "meta.desc.about": "Who is Tuana Davarcı? Portrait, short bio, class schedule, interests and skill percentages.",
            "meta.desc.resume": "Education, experience, languages and tools of Tuana Davarcı.",
            "meta.desc.projects": "Work from the Graphic Animation course: product promotion, Photoshop colouring, Smart Objects and web interface design.",
            "meta.desc.blog": "Three blog posts on AI, digital promotion and personal branding, with screenshots.",
            "meta.desc.gallery": "The photographs that reflect Tuana Davarcı best, with short captions.",
            "meta.desc.process": "The concept, inspiration, colour palette, fonts, tools and building process behind this site.",
            "meta.desc.contact": "Contact Tuana Davarcı: address, phone and contact form.",
            "process.eyebrow": "Behind the scenes",
            "process.title": "Process &amp; <em>inspiration</em>",
            "process.sub": "How this site was imagined, what inspired it and which tools built it.",
            "process.concept.title": "Concept",
            "process.concept.body": "The site grew from the idea of presenting myself not as a portfolio but as a world you walk through. The camera moves as you scroll, passing from page to page among forest, arches and lilies. The colours are olive green, wood brown and cream, with matte gold as the accent. All content is real HTML; the 3D lives only in the background.",
            "process.mood.title": "Moodboard and inspiration",
            "process.mood.body": "I gathered inspiration on Pinterest. The pins below set the design direction. For copyright reasons I do not reuse those images on the site; I only link to them.",
            "process.ink.1": "Opening: a castle rising from a book",
            "process.ink.2": "Envelope page transition",
            "process.ink.3": "Overall aesthetic: Old World",
            "process.ink.4": "Gold seal and ribbon",
            "process.ink.5": "Scroll journey: the tower",
            "process.ink.6": "Keyhole",
            "process.ink.7": "Gold serving cloche",
            "process.ink.8": "Background and lace card",
            "process.ink.9": "Fonts",
            "process.ink.10": "Brown envelope and arched card",
            "process.ink.11": "Secret garden envelope",
            "process.ink.12": "Oval frame",
            "process.pal.title": "Colour palette",
            "process.pal.body": "The colours used on the site (defined as CSS variables):",
            "process.sw.1": "Forest",
            "process.sw.2": "Olive",
            "process.sw.3": "Sage",
            "process.sw.4": "Wood",
            "process.sw.5": "Walnut",
            "process.sw.6": "Aged paper",
            "process.sw.7": "Cream",
            "process.sw.8": "Gold",
            "process.type.title": "Typography",
            "process.type.display": "Headings: Cormorant Garamond, a fine high-contrast serif; Pinyon Script (calligraphy) for the small line above each page title.",
            "process.type.body": "Body text and labels: Jost, clear and plain.",
            "process.type.sample": "Curiosity is the first brushstroke of every design.",
            "process.tools.title": "Tools and technologies",
            "process.tool.1": "Visual Studio Code: code editor",
            "process.tool.2": "Claude Code: AI-assisted coding, used for writing pages, animations and tests",
            "process.tool.3": "HTML5 / CSS3 / JavaScript: the foundation; a multi-page build with no framework",
            "process.tool.4": "Bootstrap 5 ve Start Bootstrap “Personal” şablonu: grid and base components (template source in kaynak.txt)",
            "process.tool.5": "Three.js: the 3D forest world in the background",
            "process.tool.6": "GSAP + ScrollTrigger: scroll-driven animation",
            "process.tool.7": "Lenis: smooth scrolling",
            "process.tool.8": "Google Fonts: Cormorant Garamond, Jost and Pinyon Script",
            "process.tool.9": "Playwright: automated page testing across screen sizes",
            "process.tool.10": "GitHub ve GitHub Pages: version control and hosting",
            "process.tool.11": "Pinterest: inspiration and moodboard",
            "process.skill.title": "Claude Code skills",
            "process.skill.body": "The skills live in .claude/skills/. For those installed from official sources I read the contents before installing. The ones I actually applied:",
            "process.skill.1": "seo-geo-bilingual: bilingual text, meta tags, JSON-LD, sitemap and llms.txt conventions.",
            "process.skill.2": "frontend-design (Anthropic): the process of writing a design plan (colour, type, layout) and reviewing it against the brief.",
            "process.skill.3": "impeccable (text guidance): the quality floor, typography and templated patterns to avoid. I did not run the tool's own downloaded binary.",
            "process.skill.4": "Installed, to be used in later phases: GSAP (core, ScrollTrigger, timeline, performance) and Three.js (8 skills).",
            "process.steps.title": "Process",
            "process.step.1": "Gathering inspiration: I built Pinterest boards.",
            "process.step.2": "Moodboard: I chose colour, texture and mood.",
            "process.step.3": "Palette and fonts: wired them into CSS variables.",
            "process.step.4": "3D scene design: I planned the forest world and camera path.",
            "process.step.5": "Coding: pages, two languages, form, gallery and blog.",
            "process.step.6": "Testing: I tried it on phone, tablet and desktop.",
            "process.step.7": "Delivery: zipped the folder and published the site.",
            "dive.0.artist": "Giovanni Paolo Panini",
            "dive.0.title": "Picture Gallery with Views of Modern Rome",
            "dive.0.meta": "1759 · Musée du Louvre · oil on canvas",
            "dive.1.artist": "Hubert Robert",
            "dive.1.title": "Landscape with an Arch and the Dome of St Peter's",
            "dive.1.meta": "18th century · Hermitage Museum · oil on canvas",
            "dive.2.artist": "Thomas Cole",
            "dive.2.title": "Italian Coast Scene with Ruined Tower",
            "dive.2.meta": "1838 · National Gallery of Art · oil on canvas",
            "cap.0.t": "The vault and skylight",
            "cap.0.q": "Panini builds an imaginary gallery; light pours in between the arches.",
            "cap.1.t": "Moses",
            "cap.1.q": "Michelangelo's Moses, one more masterpiece among the paintings.",
            "cap.2.t": "The collectors",
            "cap.2.q": "The gentlemen at the centre study the works: art grows through conversation.",
            "cap.3.t": "St Peter's dome",
            "cap.3.q": "Beyond the arch, Rome's most familiar silhouette in warm evening light.",
            "cap.4.t": "The statue in the niche",
            "cap.4.q": "Hubert Robert was called “Robert of the Ruins”; even broken stone becomes a stage.",
            "cap.5.t": "Travellers on the steps",
            "cap.5.q": "Tiny figures make you feel how vast and old the stone is.",
            "cap.6.t": "The ruined tower",
            "cap.6.q": "Time passes, the mark remains: ivy wraps the tower, yet it still stands.",
            "cap.7.t": "The shepherd and his flock",
            "cap.7.q": "Beside the ruin, life goes on quietly.",
            "cap.8.t": "Light on the sea",
            "cap.8.q": "The low sun draws a golden path across the calm sea.",
            "ui.play": "Play",
            "ui.pause": "Pause",
            "ui.map": "Position in the painting",
            "pagenav.desc.gallery": "The photos that reflect me best, with short notes.",
            "aboutpage.lists.eyebrow": "In short",
            "aboutpage.lists.title": "Me in <em>lists</em>",
            "aboutpage.lists.skills": "My skills",
            "aboutpage.lists.skills.note": "The tools I use, in the order I learned them:",
            "aboutpage.lists.interests": "My interests",
            "aboutpage.lists.interests.note": "What I do in my free time:",
            "aboutpage.lists.int1": "Chess",
            "aboutpage.lists.int2": "Opera and choir",
            "aboutpage.lists.int3": "Tennis",
            "aboutpage.lists.int4": "Horse riding",
            "aboutpage.lists.int5": "Runway and modelling",
            "home.gallery.eyebrow": "Frames",
            "home.gallery.title": "Frames from the <em>gallery</em>",
            "home.gallery.all": "Full gallery",
            "pf.cover.script": "Selected work",
            "pf.cover.title": "Portfolio",
            "scenes.hint": "Scroll to pass through the keyhole",
            "pf.tabs": "Portfolio sections"
        }
    },
    "projects": [
        {
            "title": {
                "tr": "Vanilla Cola",
                "en": "Vanilla Cola"
            },
            "tag": {
                "tr": "Ürün Tanıtımı",
                "en": "Product Promo"
            },
            "desc": {
                "tr": "Vanilla Coca-Cola için hazırladığım ürün tanıtım görseli: akışkan çizgiler ve yansımalı sahne.",
                "en": "A product promotion visual for Vanilla Coca-Cola: flowing lines and a reflective stage."
            },
            "image": "images/projects/vanilla-cola.jpg",
            "art": "",
            "link": "",
            "featured": true,
            "scene": "cloche"
        },
        {
            "title": {
                "tr": "History Brush",
                "en": "History Brush"
            },
            "tag": {
                "tr": "Photoshop",
                "en": "Photoshop"
            },
            "desc": {
                "tr": "Photoshop History Brush tekniğiyle siyah-beyaz sahnede tek karakteri renkle öne çıkaran çalışma.",
                "en": "A Photoshop History Brush piece that brings one character to life in colour on a black-and-white scene."
            },
            "image": "images/projects/history-brush.jpg",
            "art": "",
            "link": "",
            "featured": true,
            "scene": "frame"
        },
        {
            "title": {
                "tr": "Scarlet Witch Renklendirme",
                "en": "Scarlet Witch Colouring"
            },
            "tag": {
                "tr": "Proje 3",
                "en": "Project 3"
            },
            "desc": {
                "tr": "Photoshop'ta siyah çizgi çizimini renklendirdiğim çizgi roman tarzı çalışma: kırmızı tonlar ve parlayan enerji efekti.",
                "en": "A comic-style piece where I coloured a black line drawing in Photoshop: deep reds and a glowing energy effect."
            },
            "image": "images/projects/proje3.jpg",
            "art": "",
            "link": "",
            "featured": true,
            "scene": "letter"
        },
        {
            "title": {
                "tr": "Güneş Sistemi",
                "en": "The Solar System"
            },
            "tag": {
                "tr": "Proje 4 · Smart Object",
                "en": "Project 4 · Smart Object"
            },
            "desc": {
                "tr": "Photoshop Smart Object ile hazırladığım güneş sistemi: gezegenler akıllı nesne olarak yerleştirildi, yörüngeler ve yıldızlı arka planla tamamlandı.",
                "en": "A solar system built with Photoshop Smart Objects: planets placed as smart objects, finished with orbits and a starry background."
            },
            "image": "images/projects/proje4-gunes-sistemi.jpg",
            "art": "",
            "link": "",
            "featured": true,
            "scene": "jewel"
        },
        {
            "title": {
                "tr": "Zizi Beach Web Arayüzü",
                "en": "Zizi Beach Web Interface"
            },
            "tag": {
                "tr": "Proje 5 · Web Arayüzü",
                "en": "Project 5 · Web Interface"
            },
            "desc": {
                "tr": "zizibeach.com sitesinin arayüzünü 960 Grid System şablonu üzerinde Photoshop'ta yeniden tasarladım; Layer Comps ile 3 farklı yerleşim hazırladım.",
                "en": "I redesigned the zizibeach.com interface in Photoshop on the 960 Grid System template and prepared 3 layouts with Layer Comps."
            },
            "image": "images/projects/proje6-web-arayuzu.jpg",
            "art": "",
            "link": "",
            "featured": true,
            "scene": "album"
        },
        {
            "title": {
                "tr": "Kişisel Portfolyo",
                "en": "Personal Portfolio"
            },
            "tag": {
                "tr": "Web Tasarım",
                "en": "Web Design"
            },
            "desc": {
                "tr": "Bu sitenin kendisi: HTML5, CSS3, GSAP ve Three.js ile kaydırma animasyonları.",
                "en": "This very site: scroll animations with HTML5, CSS3, GSAP and Three.js."
            },
            "image": "",
            "art": "art-3",
            "link": "index.html",
            "featured": true,
            "scene": "portfolio"
        },
        {
            "title": {
                "tr": "@ozgemtuana",
                "en": "@ozgemtuana"
            },
            "tag": {
                "tr": "Sosyal Medya",
                "en": "Social Media"
            },
            "desc": {
                "tr": "Instagram hesabım için içerik üretimi, çekim ve paylaşım planlaması.",
                "en": "Content creation, shooting and post planning for my Instagram account."
            },
            "image": "",
            "art": "art-4",
            "link": "https://www.instagram.com/ozgemtuana/",
            "featured": true,
            "scene": "card"
        }
    ],
    "experience": [
        {
            "date": {
                "tr": "Güncel",
                "en": "Current"
            },
            "role": {
                "tr": "Instagram Sosyal Medya Yöneticisi",
                "en": "Instagram Social Media Manager"
            },
            "company": {
                "tr": "Serbest",
                "en": "Freelance"
            },
            "desc": {
                "tr": "Markaların Instagram hesapları için içerik planlıyor, paylaşımları hazırlıyor ve takipçi etkileşimini yönetiyorum.",
                "en": "I plan content, prepare posts and manage follower engagement for brands' Instagram accounts."
            }
        },
        {
            "date": {
                "tr": "Güncel",
                "en": "Current"
            },
            "role": {
                "tr": "Web Tasarım & Ürün Tanıtımı",
                "en": "Web Design & Product Promotion"
            },
            "company": {
                "tr": "Serbest",
                "en": "Freelance"
            },
            "desc": {
                "tr": "Ürünler için tanıtım görselleri tasarlıyor, küçük işletmeler için responsive web sayfaları hazırlıyorum.",
                "en": "I design promotional visuals for products and build responsive web pages for small businesses."
            }
        },
        {
            "date": {
                "tr": "Güncel",
                "en": "Current"
            },
            "role": {
                "tr": "Model",
                "en": "Model"
            },
            "company": {
                "tr": "Serbest",
                "en": "Freelance"
            },
            "desc": {
                "tr": "3 farklı podyum etkinliğinde model olarak yürüdüm; podyum yürüyüşü, sahne duruşu ve koreografi konusunda deneyim kazandım.",
                "en": "Walked as a model in 3 runway events, gaining experience in runway walk, stage presence and choreography."
            }
        },
        {
            "date": {
                "tr": "2016 - 2021",
                "en": "2016 - 2021"
            },
            "role": {
                "tr": "Koro Sanatçısı",
                "en": "Choir Artist"
            },
            "company": {
                "tr": "Devlet Opera ve Balesi",
                "en": "Turkish State Opera and Ballet"
            },
            "desc": {
                "tr": "Beş yıl boyunca koroda yer aldım; Carmen ve La Bohème operalarında 6–7 temsilde sahneye çıktım. ENBE Orkestrası ile solo vokal performansı gerçekleştirdim.",
                "en": "Sang in the choir for five years and performed in 6–7 productions of Carmen and La Bohème. Also performed a solo vocal with the ENBE Orchestra."
            }
        }
    ],
    "education": [
        {
            "date": {
                "tr": "2026 - Günümüz",
                "en": "2026 - Present"
            },
            "school": {
                "tr": "Akdeniz Üniversitesi",
                "en": "Akdeniz University"
            },
            "degree": {
                "tr": "Teknik Bilimler MYO · 1. sınıf",
                "en": "Vocational School of Technical Sciences · 1st year"
            },
            "field": {
                "tr": "Bilgisayar Programcılığı",
                "en": "Computer Programming"
            },
            "desc": {
                "tr": "Web programlama, Python ve grafik tasarım derslerine odaklanıyorum; öğrendiklerimi kendi projelerimde uyguluyorum.",
                "en": "Focusing on web programming, Python and graphic design, and applying what I learn in my own projects."
            }
        },
        {
            "date": {
                "tr": "2026 - Devam ediyor",
                "en": "2026 - Present"
            },
            "school": {
                "tr": "Anadolu Üniversitesi",
                "en": "Anadolu University"
            },
            "degree": {
                "tr": "Açıköğretim",
                "en": "Open Education"
            },
            "field": {
                "tr": "Yapay Zekâ Destekli Kodlama",
                "en": "AI-Assisted Coding"
            },
            "desc": {
                "tr": "Yapay zekâ araçlarıyla kod yazma, hata ayıklama ve proje geliştirme üzerine açıköğretim programı.",
                "en": "Open education programme on writing, debugging and building projects with AI tools."
            }
        }
    ],
    "skills": [
        {
            "tr": "HTML5",
            "en": "HTML5"
        },
        {
            "tr": "CSS3",
            "en": "CSS3"
        },
        {
            "tr": "JavaScript",
            "en": "JavaScript"
        },
        {
            "tr": "Python",
            "en": "Python"
        },
        {
            "tr": "Bootstrap",
            "en": "Bootstrap"
        },
        {
            "tr": "Adobe Photoshop",
            "en": "Adobe Photoshop"
        },
        {
            "tr": "Instagram",
            "en": "Instagram"
        },
        {
            "tr": "İçerik Üretimi",
            "en": "İçerik Üretimi"
        },
        {
            "tr": "Ürün Fotoğrafçılığı",
            "en": "Ürün Fotoğrafçılığı"
        }
    ],
    "skillBars": [
        {
            "name": {
                "tr": "HTML5",
                "en": "HTML5"
            },
            "percent": 80
        },
        {
            "name": {
                "tr": "CSS3",
                "en": "CSS3"
            },
            "percent": 75
        },
        {
            "name": {
                "tr": "JavaScript",
                "en": "JavaScript"
            },
            "percent": 45
        },
        {
            "name": {
                "tr": "Python",
                "en": "Python"
            },
            "percent": 60
        },
        {
            "name": {
                "tr": "Bootstrap",
                "en": "Bootstrap"
            },
            "percent": 70
        },
        {
            "name": {
                "tr": "Adobe Photoshop",
                "en": "Adobe Photoshop"
            },
            "percent": 75
        },
        {
            "name": {
                "tr": "Instagram / sosyal medya yönetimi",
                "en": "Instagram / social media management"
            },
            "percent": 85
        },
        {
            "name": {
                "tr": "İçerik üretimi",
                "en": "Content creation"
            },
            "percent": 80
        },
        {
            "name": {
                "tr": "Ürün fotoğrafçılığı",
                "en": "Product photography"
            },
            "percent": 70
        },
        {
            "name": {
                "tr": "Microsoft Office",
                "en": "Microsoft Office"
            },
            "percent": 75
        }
    ],
    "languages": [
        {
            "tr": "Türkçe — Ana dil",
            "en": "Turkish — Native"
        },
        {
            "tr": "İngilizce",
            "en": "English"
        },
        {
            "tr": "Python — Programlama dili",
            "en": "Python — Programming language"
        }
    ],
    "stats": [
        {
            "number": 4,
            "suffix": "+",
            "label": {
                "tr": "Tamamlanan proje",
                "en": "Projects completed"
            }
        },
        {
            "number": 6,
            "suffix": "",
            "label": {
                "tr": "Kullandığım araç",
                "en": "Tools I use"
            }
        },
        {
            "number": 999,
            "suffix": "+",
            "label": {
                "tr": "Fincan kahve",
                "en": "Cups of coffee"
            }
        }
    ],
    "folders": [
        {
            "title": {
                "tr": "Look <em>01</em>",
                "en": "Look <em>01</em>"
            },
            "event": {
                "tr": "Yeni Jenerasyon Moda Haftası · Antalya · 2023",
                "en": "New Generation Fashion Week · Antalya · 2023"
            },
            "tabs": [
                {
                    "tr": "Look 01",
                    "en": "Look 01"
                },
                {
                    "tr": "Saten",
                    "en": "Satin"
                },
                {
                    "tr": "Podyum",
                    "en": "Runway"
                }
            ],
            "notes": [
                {
                    "tr": "saten, tek omuz",
                    "en": "satin, one shoulder"
                },
                {
                    "tr": "işlemeli kemer + omuz bandı",
                    "en": "embroidered belt + shoulder band"
                },
                {
                    "tr": "yırtmaç — akışkan etek",
                    "en": "high slit — flowing skirt"
                }
            ],
            "leather": "kahve",
            "items": [
                {
                    "src": "images/runway/clean/altin-etek.png",
                    "alt": {
                        "tr": "Altın saten elbiseyle podyumda",
                        "en": "On the runway in a gold satin dress"
                    },
                    "pos": "left",
                    "rot": -7,
                    "kind": "cut",
                    "wide": false
                },
                {
                    "src": "images/runway/clean/altin-on.png",
                    "alt": {
                        "tr": "Altın saten elbise, önden",
                        "en": "Gold satin dress, front view"
                    },
                    "pos": "right",
                    "rot": 6,
                    "kind": "cut",
                    "wide": false
                },
                {
                    "src": "images/runway/clean/altin-yuruyus.png",
                    "alt": {
                        "tr": "Altın saten elbiseyle yürüyüş",
                        "en": "Walking in the gold satin dress"
                    },
                    "pos": "mid",
                    "rot": -1,
                    "kind": "cut",
                    "wide": true
                }
            ]
        },
        {
            "title": {
                "tr": "Look <em>02</em>",
                "en": "Look <em>02</em>"
            },
            "event": {
                "tr": "Siyah koleksiyon · Podyum",
                "en": "Black collection · Runway"
            },
            "tabs": [
                {
                    "tr": "Look 02",
                    "en": "Look 02"
                },
                {
                    "tr": "Siyah",
                    "en": "Black"
                },
                {
                    "tr": "Podyum",
                    "en": "Runway"
                }
            ],
            "notes": [
                {
                    "tr": "uzun eldiven",
                    "en": "opera gloves"
                },
                {
                    "tr": "zincir & boncuk detay",
                    "en": "chain & bead details"
                },
                {
                    "tr": "kemer tokalı kesimler",
                    "en": "buckled cut-outs"
                }
            ],
            "leather": "kahve",
            "items": [
                {
                    "src": "images/runway/clean/siyah-podyum.png",
                    "alt": {
                        "tr": "Siyah kombinle podyumda",
                        "en": "On the runway in a black outfit"
                    },
                    "pos": "left",
                    "rot": -6,
                    "kind": "cut",
                    "wide": false
                },
                {
                    "src": "images/runway/clean/siyah-kemer.png",
                    "alt": {
                        "tr": "Siyah kemer detaylı kombin",
                        "en": "Black outfit with belt details"
                    },
                    "pos": "right",
                    "rot": 7,
                    "kind": "cut",
                    "wide": false
                },
                {
                    "src": "images/runway/clean/siyah-elbise.png",
                    "alt": {
                        "tr": "Siyah elbise ve uzun eldivenler",
                        "en": "Black dress with opera gloves"
                    },
                    "pos": "mid",
                    "rot": 1,
                    "kind": "cut",
                    "wide": false
                }
            ]
        },
        {
            "title": {
                "tr": "Look <em>03</em>",
                "en": "Look <em>03</em>"
            },
            "event": {
                "tr": "Pembe koleksiyon · Podyum",
                "en": "Pink collection · Runway"
            },
            "tabs": [
                {
                    "tr": "Look 03",
                    "en": "Look 03"
                },
                {
                    "tr": "Pembe",
                    "en": "Pink"
                },
                {
                    "tr": "Podyum",
                    "en": "Runway"
                }
            ],
            "notes": [
                {
                    "tr": "uzun kol, kat kat etek",
                    "en": "long sleeves, tiered skirt"
                },
                {
                    "tr": "işlemeli yaka detayı",
                    "en": "embroidered neckline"
                },
                {
                    "tr": "akışkan yürüyüş",
                    "en": "flowing walk"
                }
            ],
            "leather": "bordo",
            "items": [
                {
                    "src": "images/runway/clean/pembe-elbise.png",
                    "alt": {
                        "tr": "Pembe uzun elbiseyle podyumda yürüyüş",
                        "en": "Walking the runway in a long pink dress"
                    },
                    "pos": "mid",
                    "rot": -2,
                    "kind": "cut",
                    "wide": false
                }
            ]
        },
        {
            "title": {
                "tr": "Look <em>04</em>",
                "en": "Look <em>04</em>"
            },
            "event": {
                "tr": "Kulis · Beyaz koleksiyon",
                "en": "Backstage · White collection"
            },
            "tabs": [
                {
                    "tr": "Look 04",
                    "en": "Look 04"
                },
                {
                    "tr": "Beyaz",
                    "en": "White"
                },
                {
                    "tr": "Kulis",
                    "en": "Backstage"
                }
            ],
            "notes": [
                {
                    "tr": "tek omuz, inci işlemeli tül",
                    "en": "one shoulder, pearl-studded tulle"
                },
                {
                    "tr": "saten, yırtmaçlı etek",
                    "en": "satin skirt with a slit"
                },
                {
                    "tr": "gümüş göz ve dudak makyajı",
                    "en": "silver eye & lip make-up"
                }
            ],
            "leather": "siyah",
            "items": [
                {
                    "src": "images/runway/clean/beyaz-inci.png",
                    "alt": {
                        "tr": "İnci işlemeli beyaz elbiseyle kuliste",
                        "en": "Backstage in a pearl-studded white dress"
                    },
                    "pos": "mid",
                    "rot": 2,
                    "kind": "cut",
                    "wide": false
                },
                {
                    "src": "images/runway/clean/beyaz-sapka.png",
                    "alt": {
                        "tr": "Şapka ve inci işlemeli tülle kulis",
                        "en": "Backstage in a hat and pearl-studded tulle"
                    },
                    "pos": "left",
                    "rot": -6,
                    "kind": "cut",
                    "wide": false
                },
                {
                    "src": "images/runway/clean/beyaz-galeri.png",
                    "alt": {
                        "tr": "Sanat galerisinde, inci işlemeli tül ve şapkayla",
                        "en": "In an art gallery, wearing pearl tulle and a hat"
                    },
                    "pos": "right",
                    "rot": 7,
                    "kind": "cut",
                    "wide": false
                },
                {
                    "src": "images/runway/clean/beyaz-defile.png",
                    "alt": {
                        "tr": "Defile yürüyüşü, beyaz koleksiyon",
                        "en": "Runway walk, white collection"
                    },
                    "pos": "extra",
                    "rot": 0,
                    "kind": "cut",
                    "wide": false
                }
            ]
        },
        {
            "title": {
                "tr": "İşler <em>05</em>",
                "en": "Work <em>05</em>"
            },
            "event": {
                "tr": "Ürün tanıtımı · Sosyal medya",
                "en": "Product promotion · Social media"
            },
            "tabs": [
                {
                    "tr": "İşler",
                    "en": "Work"
                },
                {
                    "tr": "Marka",
                    "en": "Brand"
                },
                {
                    "tr": "Görsel",
                    "en": "Visual"
                }
            ],
            "notes": [
                {
                    "tr": "marka dili",
                    "en": "brand language"
                },
                {
                    "tr": "renk + doku",
                    "en": "colour + texture"
                },
                {
                    "tr": "sosyal medya kurgusu",
                    "en": "social media layout"
                }
            ],
            "leather": "yosun",
            "items": [
                {
                    "src": "images/projects/history-brush.jpg",
                    "alt": {
                        "tr": "History Brush ürün tanıtım görseli",
                        "en": "History Brush product visual"
                    },
                    "pos": "left",
                    "rot": -8,
                    "kind": "print",
                    "wide": false
                },
                {
                    "src": "images/projects/vanilla-cola.jpg",
                    "alt": {
                        "tr": "Vanilla Cola ürün tanıtım görseli",
                        "en": "Vanilla Cola product visual"
                    },
                    "pos": "right",
                    "rot": 7,
                    "kind": "print",
                    "wide": false
                }
            ]
        }
    ],
    "courses": [
        {
            "day": 1,
            "start": "13:30",
            "end": "17:20",
            "code": "MBIL 101",
            "name": {
                "tr": "Programlamanın Temelleri",
                "en": "Programming Fundamentals"
            },
            "room": "303 · Lab L23",
            "teacher": "Öğr. Gör. Hasan Özalp",
            "kind": "karma"
        },
        {
            "day": 2,
            "start": "08:30",
            "end": "10:20",
            "code": "TDB 101",
            "name": {
                "tr": "Türk Dili I",
                "en": "Turkish Language I"
            },
            "room": "Sanal sınıf",
            "teacher": "Öğr. Gör. Talha Tunç",
            "kind": "uzaktan"
        },
        {
            "day": 2,
            "start": "13:30",
            "end": "15:20",
            "code": "ATA 101",
            "name": {
                "tr": "Atatürk İlkeleri ve İnkılap Tarihi I",
                "en": "Principles of Atatürk & History of Turkish Revolution I"
            },
            "room": "Uzaktan eğitim dersliği 2",
            "teacher": "Öğr. Gör. Dr. Koray Ergin",
            "kind": "uzaktan"
        },
        {
            "day": 2,
            "start": "15:30",
            "end": "17:20",
            "code": "YBD 121",
            "name": {
                "tr": "İngilizce I",
                "en": "English I"
            },
            "room": "Uzaktan eğitim",
            "teacher": "Öğr. Gör. Bengü Şahin Kimyon",
            "kind": "uzaktan"
        },
        {
            "day": 3,
            "start": "08:30",
            "end": "10:20",
            "code": "MYO 123",
            "name": {
                "tr": "Fizik I",
                "en": "Physics I"
            },
            "room": "Z05",
            "teacher": "Öğr. Gör. Dr. Reyhan Özaydın Özkara",
            "kind": "teori"
        },
        {
            "day": 3,
            "start": "10:30",
            "end": "12:20",
            "code": "MYO 131",
            "name": {
                "tr": "Temel Matematik",
                "en": "Basic Mathematics"
            },
            "room": "Z03",
            "teacher": "Prof. Dr. Harun Barış Çolakoğlu",
            "kind": "teori"
        },
        {
            "day": 3,
            "start": "13:30",
            "end": "17:20",
            "code": "MBIL 103",
            "name": {
                "tr": "Veri Tabanı I",
                "en": "Databases I"
            },
            "room": "303 · Lab L23",
            "teacher": "Öğr. Gör. Hasan Özalp",
            "kind": "karma"
        },
        {
            "day": 4,
            "start": "08:30",
            "end": "12:20",
            "code": "MBIL 105",
            "name": {
                "tr": "Grafik Animasyon I",
                "en": "Graphic Animation I"
            },
            "room": "Lab L23 · 303",
            "teacher": "Öğr. Gör. Dr. Erokan Canbazoğlu",
            "kind": "karma"
        },
        {
            "day": 4,
            "start": "13:30",
            "end": "15:20",
            "code": "MBIL 113",
            "name": {
                "tr": "Web Tasarımının Temelleri",
                "en": "Fundamentals of Web Design"
            },
            "room": "303 · Lab L23",
            "teacher": "Öğr. Gör. Dr. Erokan Canbazoğlu",
            "kind": "karma"
        },
        {
            "day": 5,
            "start": "13:30",
            "end": "15:20",
            "code": "MBIL 111",
            "name": {
                "tr": "Ofis Yazılımları",
                "en": "Office Software"
            },
            "room": "303 · Lab L23",
            "teacher": "Öğr. Gör. Hasan Özalp",
            "kind": "karma"
        }
    ],
    "softSkills": [
        {
            "name": {
                "tr": "Stratejik düşünme",
                "en": "Strategic thinking"
            },
            "percent": 90
        },
        {
            "name": {
                "tr": "Sahne performansı",
                "en": "Stage performance"
            },
            "percent": 90
        },
        {
            "name": {
                "tr": "Analitik problem çözme",
                "en": "Analytical problem solving"
            },
            "percent": 85
        },
        {
            "name": {
                "tr": "Odaklanma",
                "en": "Focus"
            },
            "percent": 85
        },
        {
            "name": {
                "tr": "Takım çalışması",
                "en": "Teamwork"
            },
            "percent": 85
        },
        {
            "name": {
                "tr": "Karar verme",
                "en": "Decision making"
            },
            "percent": 80
        }
    ],
    "hobbyFolders": [
        {
            "title": {
                "tr": "Hobi <em>albümü</em>",
                "en": "Hobby <em>album</em>"
            },
            "event": {
                "tr": "Tıkla ve görselleri gör",
                "en": "Click and see the photos"
            },
            "tabs": [
                {
                    "tr": "Hobiler",
                    "en": "Hobbies"
                },
                {
                    "tr": "Satranç",
                    "en": "Chess"
                },
                {
                    "tr": "Sahne",
                    "en": "Stage"
                }
            ],
            "notes": [
                {
                    "tr": "satranç turnuvaları",
                    "en": "chess tournaments"
                },
                {
                    "tr": "opera & koro",
                    "en": "opera & choir"
                },
                {
                    "tr": "at üstünde",
                    "en": "on horseback"
                }
            ],
            "leather": "kahve",
            "items": [
                {
                    "src": "images/hobbies/satranc-podyum.jpg",
                    "alt": {
                        "tr": "Satranç turnuvasında ödül töreni",
                        "en": "Award ceremony at a chess tournament"
                    },
                    "pos": "mid",
                    "rot": -1,
                    "kind": "print",
                    "wide": false
                },
                {
                    "src": "images/hobbies/binicilik.jpg",
                    "alt": {
                        "tr": "Binicilik",
                        "en": "Horse riding"
                    },
                    "pos": "left",
                    "rot": -7,
                    "kind": "print",
                    "wide": false
                },
                {
                    "src": "images/hobbies/sahne-carmen.jpg",
                    "alt": {
                        "tr": "Carmen operasında sahne",
                        "en": "On stage in the opera Carmen"
                    },
                    "pos": "right",
                    "rot": 6,
                    "kind": "print",
                    "wide": false
                },
                {
                    "src": "images/hobbies/kulis-kostum.jpg",
                    "alt": {
                        "tr": "Opera kostümleriyle kulis",
                        "en": "Backstage in opera costumes"
                    },
                    "pos": "extra",
                    "rot": 0,
                    "kind": "print",
                    "wide": false
                },
                {
                    "src": "images/hobbies/koro.jpg",
                    "alt": {
                        "tr": "Koro arkadaşlarımla prova arası",
                        "en": "With my choir friends between rehearsals"
                    },
                    "pos": "extra",
                    "rot": 0,
                    "kind": "print",
                    "wide": false
                },
                {
                    "src": "images/hobbies/carmen-haber.jpg",
                    "alt": {
                        "tr": "Antalya Devlet Opera ve Balesi’nin Carmen haberi (2017)",
                        "en": "News about Antalya State Opera and Ballet’s Carmen (2017)"
                    },
                    "pos": "extra",
                    "rot": 0,
                    "kind": "print",
                    "wide": false
                },
                {
                    "src": "images/hobbies/orkestra.jpg",
                    "alt": {
                        "tr": "Orkestra performansı",
                        "en": "Orchestra performance"
                    },
                    "pos": "extra",
                    "rot": 0,
                    "kind": "print",
                    "wide": false
                },
                {
                    "src": "images/hobbies/kostum-duvar.jpg",
                    "alt": {
                        "tr": "Sahne kostümüyle",
                        "en": "In my stage costume"
                    },
                    "pos": "extra",
                    "rot": 0,
                    "kind": "print",
                    "wide": false
                }
            ]
        }
    ],
    "gallery": [
        {
            "image": "images/gallery/side.jpg",
            "place": {
                "tr": "Side, Antalya",
                "en": "Side, Antalya"
            },
            "alt": {
                "tr": "Tuana, gün batımında Side'deki antik sütunların önünde taş bir duvara oturuyor",
                "en": "Tuana sitting on a stone wall in front of ancient columns in Side at sunset"
            },
            "caption": {
                "tr": "Gün batımında antik sütunların arasında. Tarihin içinde yürümek bana hep ilham verir.",
                "en": "Among the ancient columns at sunset. Walking through history always inspires me."
            }
        },
        {
            "image": "images/gallery/dogum-gunu.jpg",
            "place": {
                "tr": "Doğum günü",
                "en": "Birthday"
            },
            "alt": {
                "tr": "Tuana, doğum günü pastasındaki mumların başında gözleri kapalı gülümsüyor",
                "en": "Tuana smiling with closed eyes over the candles of a birthday cake"
            },
            "caption": {
                "tr": "Mumları üflemeden hemen önce, dilek tutarken.",
                "en": "Just before blowing out the candles, making a wish."
            }
        },
        {
            "image": "images/gallery/kaleici.jpg",
            "place": {
                "tr": "Kaleiçi, Antalya",
                "en": "Kaleiçi, Antalya"
            },
            "alt": {
                "tr": "Tuana, Kaleiçi'nde çini süslemeli taş bir kapının önünde yukarı bakıyor",
                "en": "Tuana looking up in front of a stone doorway with tile decoration in Kaleiçi"
            },
            "caption": {
                "tr": "Kaleiçi'nin taş sokaklarında akşam yürüyüşü. Her kapının bir hikâyesi var.",
                "en": "An evening walk through the stone streets of Kaleiçi. Every door has a story."
            }
        },
        {
            "image": "images/gallery/istanbul.jpg",
            "place": {
                "tr": "İstanbul",
                "en": "Istanbul"
            },
            "alt": {
                "tr": "Tuana, İstanbul'da tarihi bir binanın duvarına yaslanmış, yukarı bakıyor",
                "en": "Tuana leaning against the wall of a historic building in Istanbul, looking up"
            },
            "caption": {
                "tr": "İstanbul sokaklarında, binaların arasında kendime yer bulurken.",
                "en": "On the streets of Istanbul, finding my own space among the buildings."
            }
        },
        {
            "image": "images/gallery/spor.jpg",
            "place": {
                "tr": "Spor",
                "en": "Sport"
            },
            "alt": {
                "tr": "Tuana, spor salonunun soyunma odasında aynadan fotoğraf çekiyor",
                "en": "Tuana taking a mirror photo in a gym locker room"
            },
            "caption": {
                "tr": "Spor benim için günün ritmi: disiplin ve enerji.",
                "en": "Sport sets my daily rhythm: discipline and energy."
            }
        }
    ],
    "portfolio": {
        "sections": [
            {
                "tab": {
                    "tr": "Tasarım",
                    "en": "Design"
                },
                "title": {
                    "tr": "Orman ve lilyum dünyası",
                    "en": "A forest and lily world"
                },
                "body": {
                    "tr": "Zeytin yeşili, ahşap kahvesi ve krem tonları; vurgu olarak mat altın. Her sayfa aynı dünyanın başka bir köşesi.",
                    "en": "Olive green, wood brown and cream, with matte gold as the accent. Every page is another corner of the same world."
                }
            },
            {
                "tab": {
                    "tr": "Teknoloji",
                    "en": "Tech"
                },
                "title": {
                    "tr": "Framework'süz, elle yazıldı",
                    "en": "Hand-written, no framework"
                },
                "body": {
                    "tr": "HTML5, CSS3 ve JavaScript. Arka plandaki 3D dünya Three.js ile, kaydırma animasyonları GSAP ile yapıldı.",
                    "en": "HTML5, CSS3 and JavaScript. The 3D background uses Three.js and the scroll animations use GSAP."
                }
            },
            {
                "tab": {
                    "tr": "Sayfalar",
                    "en": "Pages"
                },
                "title": {
                    "tr": "Sekiz sayfa, iki dil",
                    "en": "Eight pages, two languages"
                },
                "body": {
                    "tr": "Türkçe ve İngilizce. Sayfalar arası geçişte site yeniden yüklenmez; menü, geri tuşu ve doğrudan bağlantılar çalışır.",
                    "en": "Turkish and English. Moving between pages does not reload the site; the menu, back button and direct links all work."
                }
            },
            {
                "tab": {
                    "tr": "Erişim",
                    "en": "Access"
                },
                "title": {
                    "tr": "Herkes için okunur",
                    "en": "Readable for everyone"
                },
                "body": {
                    "tr": "Her sayfada tek ana başlık, görsel açıklamaları, klavyeyle gezinme ve azaltılmış hareket desteği.",
                    "en": "One main heading per page, image descriptions, keyboard navigation and reduced-motion support."
                }
            }
        ]
    }
};
