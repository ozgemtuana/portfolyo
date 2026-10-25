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
        "linkedin": ""
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
            "runway.sub": "Defile için hazırlanmış bir çizim dosyası gibi: her look kendi deri klasöründe.",
            "runway.1.event": "Yeni Jenerasyon Moda Haftası · Antalya · 2023",
            "runway.1.note1": "saten, tek omuz",
            "runway.1.note2": "işlemeli kemer + omuz bandı",
            "runway.1.note3": "yırtmaç — akışkan etek",
            "runway.1.tab1": "Look 01",
            "runway.1.tab2": "Saten",
            "runway.1.tab3": "Podyum",
            "runway.2.event": "Siyah koleksiyon · Podyum",
            "runway.2.note1": "uzun eldiven",
            "runway.2.note2": "zincir & boncuk detay",
            "runway.2.note3": "kemer tokalı kesimler",
            "runway.2.tab1": "Look 02",
            "runway.2.tab2": "Siyah",
            "runway.2.tab3": "Podyum",
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
            "contact.social": "Sosyal"
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
            "runway.sub": "Like a sketch file prepared for a fashion show: each look in its own leather folder.",
            "runway.1.event": "New Generation Fashion Week · Antalya · 2023",
            "runway.1.note1": "satin, one shoulder",
            "runway.1.note2": "embroidered belt + shoulder band",
            "runway.1.note3": "high slit — flowing skirt",
            "runway.1.tab1": "Look 01",
            "runway.1.tab2": "Satin",
            "runway.1.tab3": "Runway",
            "runway.2.event": "Black collection · Runway",
            "runway.2.note1": "opera gloves",
            "runway.2.note2": "chain & bead details",
            "runway.2.note3": "buckled cut-outs",
            "runway.2.tab1": "Look 02",
            "runway.2.tab2": "Black",
            "runway.2.tab3": "Runway",
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
            "contact.social": "Social"
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
            "image": "assets/projects/vanilla-cola.jpg",
            "art": "",
            "link": "",
            "featured": true
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
            "image": "assets/projects/history-brush.jpg",
            "art": "",
            "link": "",
            "featured": true
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
            "featured": true
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
            "featured": true
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
                "tr": "Markaların ürün tanıtımı ve sosyal medya kampanyaları için çekimlerde yer alıyorum.",
                "en": "I take part in shoots for brands' product promotions and social media campaigns."
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
                "tr": "HTML / CSS",
                "en": "HTML / CSS"
            },
            "percent": 80
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
                "tr": "Photoshop",
                "en": "Photoshop"
            },
            "percent": 75
        },
        {
            "name": {
                "tr": "Sosyal Medya",
                "en": "Sosyal Medya"
            },
            "percent": 85
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
    ]
};
