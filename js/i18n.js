/* ==========================================================================
   Türkçe / İngilizce dil desteği
   - data-i18n="anahtar"       → elemanın metni
   - data-i18n-html="anahtar"  → elemanın HTML içeriği
   - data-i18n-ph="anahtar"    → placeholder
   - data-i18n-aria="anahtar"  → aria-label
   Seçilen dil localStorage'da saklanır. Varsayılan: Türkçe.
   ========================================================================== */

// Kişisel bilgilerini buradan değiştir (iki dilde ortak olanlar)
const PROFILE = {
    name: "Tuana Davarcı",
    firstName: "Tuana",
    email: "ozgmtuana15@gmail.com",
    phone: "0552 311 07 00",
    location: "Antalya, TR",
    github: "https://github.com/ozgemtuana",
    instagram: "https://www.instagram.com/ozgemtuana/"
};

const I18N = {
    tr: {
        "lang.py": "Python — Programlama dili",
        "exp.3.desc": "Markaların ürün tanıtımı ve sosyal medya kampanyaları için çekimlerde yer alıyorum.",
        "exp.3.company": "Serbest",
        "exp.3.role": "Model",
        "exp.3.date": "Güncel",
        "meta.title.home": "Ana Sayfa — " + PROFILE.name,
        "meta.title.resume": "Özgeçmiş — " + PROFILE.name,
        "meta.title.projects": "Projeler — " + PROFILE.name,
        "meta.title.contact": "İletişim — " + PROFILE.name,

        "nav.home": "Ana Sayfa",
        "nav.resume": "Özgeçmiş",
        "nav.projects": "Projeler",
        "nav.contact": "İletişim",
        "nav.toggle": "Menüyü aç/kapat",

        "hero.status": "Yeni projelere açığım",
        "hero.line1": "Merhaba,",
        "hero.line2": "ben <em>" + PROFILE.firstName + "</em>",
        "hero.based": "Konum",
        "hero.local": "Yerel saat",
        "cursor.view": "Gör",
        "cursor.mail": "Yaz",
        "hero.sub": "Akdeniz Üniversitesi'nde Bilgisayar Programcılığı öğrencisiyim. Web tasarım, ürün tanıtımı ve sosyal medya yönetimiyle markalara akılda kalan bir görsel dil kazandırıyorum.",
        "hero.cta1": "Projelerimi Gör",
        "hero.cta2": "Özgeçmiş",
        "hero.scroll": "Kaydır",

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
        "stats.1": "Tamamlanan proje",
        "stats.2": "Kullandığım araç",
        "stats.3": "Fincan kahve",

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

        "cta.eyebrow": "Bir fikrin mi var?",
        "cta.big": "Hadi <em>konuşalım</em>",

        "footer.copy": "© 2026 " + PROFILE.name + ". Tüm hakları saklıdır.",
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
        "exp.1.date": "Güncel",
        "exp.1.role": "Instagram Sosyal Medya Yöneticisi",
        "exp.1.company": "Serbest",
        "exp.1.desc": "Markaların Instagram hesapları için içerik planlıyor, paylaşımları hazırlıyor ve takipçi etkileşimini yönetiyorum.",
        "exp.2.date": "Güncel",
        "exp.2.role": "Web Tasarım & Ürün Tanıtımı",
        "exp.2.company": "Serbest",
        "exp.2.desc": "Ürünler için tanıtım görselleri tasarlıyor, küçük işletmeler için responsive web sayfaları hazırlıyorum.",
        "edu.1.date": "2026 - Günümüz",
        "edu.1.school": "Akdeniz Üniversitesi",
        "edu.1.degree": "Teknik Bilimler MYO · 1. sınıf",
        "edu.1.field": "Bilgisayar Programcılığı",
        "edu.1.desc": "Web programlama, Python ve grafik tasarım derslerine odaklanıyorum; öğrendiklerimi kendi projelerimde uyguluyorum.",
        "lang.tr": "Türkçe — Ana dil",
        "lang.en": "İngilizce",

        "projects.title": "Seçili <em>işler</em>",
        "projects.sub": "Tasarım, ürün tanıtımı ve web çalışmalarımdan bir seçki.",
        "p.1.t": "Vanilla Cola",
        "p.1.d": "Vanilla Coca-Cola için hazırladığım ürün tanıtım görseli: akışkan çizgiler ve yansımalı sahne.",
        "p.1.tag": "Ürün Tanıtımı",
        "p.2.t": "History Brush",
        "p.2.d": "Photoshop History Brush tekniğiyle siyah-beyaz sahnede tek karakteri renkle öne çıkaran çalışma.",
        "p.2.tag": "Photoshop",
        "p.3.t": "Kişisel Portfolyo",
        "p.3.d": "Bu sitenin kendisi: HTML5, CSS3, GSAP ve Three.js ile kaydırma animasyonları.",
        "p.3.tag": "Web Tasarım",
        "p.4.t": "@ozgemtuana",
        "p.4.d": "Instagram hesabım için içerik üretimi, çekim ve paylaşım planlaması.",
        "p.4.tag": "Sosyal Medya",
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

    en: {
        "lang.py": "Python — Programming language",
        "exp.3.desc": "I take part in shoots for brands' product promotions and social media campaigns.",
        "exp.3.company": "Freelance",
        "exp.3.role": "Model",
        "exp.3.date": "Current",
        "meta.title.home": "Home — " + PROFILE.name,
        "meta.title.resume": "Resume — " + PROFILE.name,
        "meta.title.projects": "Projects — " + PROFILE.name,
        "meta.title.contact": "Contact — " + PROFILE.name,

        "nav.home": "Home",
        "nav.resume": "Resume",
        "nav.projects": "Projects",
        "nav.contact": "Contact",
        "nav.toggle": "Toggle navigation",

        "hero.status": "Available for new projects",
        "hero.line1": "Hello,",
        "hero.line2": "I'm <em>" + PROFILE.firstName + "</em>",
        "hero.based": "Based in",
        "hero.local": "Local time",
        "cursor.view": "View",
        "cursor.mail": "Write",
        "hero.sub": "Computer Programming student at Akdeniz University. I give brands a memorable visual language through web design, product promotion and social media management.",
        "hero.cta1": "See my work",
        "hero.cta2": "Resume",
        "hero.scroll": "Scroll",

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
        "stats.1": "Projects completed",
        "stats.2": "Tools I use",
        "stats.3": "Cups of coffee",

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

        "cta.eyebrow": "Got an idea?",
        "cta.big": "Let's <em>talk</em>",

        "footer.copy": "© 2026 " + PROFILE.name + ". All rights reserved.",
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
        "exp.1.date": "Current",
        "exp.1.role": "Instagram Social Media Manager",
        "exp.1.company": "Freelance",
        "exp.1.desc": "I plan content, prepare posts and manage follower engagement for brands' Instagram accounts.",
        "exp.2.date": "Current",
        "exp.2.role": "Web Design & Product Promotion",
        "exp.2.company": "Freelance",
        "exp.2.desc": "I design promotional visuals for products and build responsive web pages for small businesses.",
        "edu.1.date": "2026 - Present",
        "edu.1.school": "Akdeniz University",
        "edu.1.degree": "Vocational School of Technical Sciences · 1st year",
        "edu.1.field": "Computer Programming",
        "edu.1.desc": "Focusing on web programming, Python and graphic design, and applying what I learn in my own projects.",
        "lang.tr": "Turkish — Native",
        "lang.en": "English",

        "projects.title": "Selected <em>work</em>",
        "projects.sub": "A selection of my design, product promotion and web work.",
        "p.1.t": "Vanilla Cola",
        "p.1.d": "A product promotion visual for Vanilla Coca-Cola: flowing lines and a reflective stage.",
        "p.1.tag": "Product Promo",
        "p.2.t": "History Brush",
        "p.2.d": "A Photoshop History Brush piece that brings one character to life in colour on a black-and-white scene.",
        "p.2.tag": "Photoshop",
        "p.3.t": "Personal Portfolio",
        "p.3.d": "This very site: scroll animations with HTML5, CSS3, GSAP and Three.js.",
        "p.3.tag": "Web Design",
        "p.4.t": "@ozgemtuana",
        "p.4.d": "Content creation, shooting and post planning for my Instagram account.",
        "p.4.tag": "Social Media",
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
};

const LANG_KEY = "site-lang";

function getLang() {
    try {
        const saved = localStorage.getItem(LANG_KEY);
        if (saved && I18N[saved]) return saved;
    } catch (e) { /* localStorage kapalı olabilir */ }
    return "tr";
}

function t(key, lang) {
    const dict = I18N[lang || getLang()];
    return dict[key] !== undefined ? dict[key] : key;
}

function applyLang(lang) {
    const dict = I18N[lang];
    document.documentElement.lang = lang;

    document.querySelectorAll("[data-i18n]").forEach((el) => {
        const v = dict[el.dataset.i18n];
        if (v !== undefined) el.textContent = v;
    });
    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
        const v = dict[el.dataset.i18nHtml];
        if (v !== undefined) el.innerHTML = v;
    });
    document.querySelectorAll("[data-i18n-ph]").forEach((el) => {
        const v = dict[el.dataset.i18nPh];
        if (v !== undefined) el.placeholder = v;
    });
    document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
        const v = dict[el.dataset.i18nAria];
        if (v !== undefined) el.setAttribute("aria-label", v);
    });

    const titleKey = document.body.dataset.title;
    if (titleKey && dict[titleKey]) document.title = dict[titleKey];

    document.querySelectorAll(".lang-switch button").forEach((b) => {
        const on = b.dataset.lang === lang;
        b.classList.toggle("active", on);
        b.setAttribute("aria-pressed", on);
    });

    // Ortak profil alanları
    document.querySelectorAll("[data-profile]").forEach((el) => {
        const v = PROFILE[el.dataset.profile];
        if (v === undefined) return;
        if (el.tagName === "A" && el.dataset.profileHref !== undefined) {
            const p = el.dataset.profile;
            el.href = p === "email" ? "mailto:" + v : p === "phone" ? "tel:+9" + v.replace(/\s/g, "") : v;
        } else {
            el.textContent = v;
        }
    });

    document.dispatchEvent(new CustomEvent("langchange", { detail: { lang } }));
}

function setLang(lang) {
    try { localStorage.setItem(LANG_KEY, lang); } catch (e) { /* yoksay */ }
    applyLang(lang);
}

document.addEventListener("click", (e) => {
    const btn = e.target.closest(".lang-switch button");
    if (btn) setLang(btn.dataset.lang);
});

applyLang(getLang());
