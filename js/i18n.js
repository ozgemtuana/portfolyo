/* ==========================================================================
   İçerik yükleme + Türkçe / İngilizce dil desteği
   - İçerik js/content.js içindeki window.SITE_CONTENT'ten gelir.
   - Admin panelinde kaydedilen sürüm localStorage'da ("site-content-override")
     durur; varsa önce o kullanılır (aynı tarayıcıda anında önizleme için).
   - Projeler, deneyim, eğitim, yetenekler, diller ve istatistikler
     data-render="..." kutularına buradan basılır (main.js'den ÖNCE).
   - data-i18n="anahtar"       → elemanın metni
   - data-i18n-html="anahtar"  → elemanın HTML içeriği
   - data-i18n-ph="anahtar"    → placeholder
   - data-i18n-aria="anahtar"  → aria-label
   Seçilen dil localStorage'da saklanır. Varsayılan: Türkçe.
   ========================================================================== */

const CONTENT_KEY = "site-content-override";
const LANG_KEY = "site-lang";

/* ---------- İçeriği oku: önce admin kaydı, yoksa dosyadaki varsayılan ---------- */
function loadSiteContent() {
    const def = window.SITE_CONTENT || {};
    let ov = null;
    try {
        const raw = localStorage.getItem(CONTENT_KEY);
        if (raw) ov = JSON.parse(raw);
    } catch (e) { ov = null; /* bozuk kayıt ya da localStorage kapalı */ }
    return mergeContent(def, ov);
}

// Kayıttaki alanlar dosyadakilerin üzerine yazılır; eksik metin anahtarları dosyadan tamamlanır
function mergeContent(def, ov) {
    const out = Object.assign({}, def);
    if (ov && typeof ov === "object") {
        Object.keys(ov).forEach((k) => {
            if (Array.isArray(def[k]) && !Array.isArray(ov[k])) return; // şekli bozuk alanı alma
            out[k] = ov[k];
        });
        out.profile = Object.assign({}, def.profile, ov.profile);
        const dt = def.text || {}, ot = ov.text || {};
        out.text = {
            tr: Object.assign({}, dt.tr, ot.tr),
            en: Object.assign({}, dt.en, ot.en)
        };
    }
    out.profile = out.profile || {};
    out.text = out.text || { tr: {}, en: {} };
    ["projects", "experience", "education", "skills", "skillBars", "languages", "stats", "gallery", "folders", "hobbyFolders", "courses", "softSkills"].forEach((k) => {
        if (!Array.isArray(out[k])) out[k] = [];
    });
    return out;
}

const SITE = loadSiteContent();

// Kişisel bilgiler (iki dilde ortak) — main.js de kullanır
const PROFILE = SITE.profile;

/* ---------- Sözlükler: statik metinler + listelerden üretilen anahtarlar ---------- */
function fillProfile(s) {
    return typeof s === "string"
        ? s.replace(/\{name\}/g, PROFILE.name || "").replace(/\{firstName\}/g, PROFILE.firstName || "")
        : s;
}

function buildDictionaries(site) {
    const dicts = { tr: {}, en: {} };
    ["tr", "en"].forEach((lang) => {
        const d = dicts[lang];
        const txt = (site.text && site.text[lang]) || {};
        Object.keys(txt).forEach((k) => (d[k] = fillProfile(txt[k])));
        // Çok dilli alan: {tr, en} ya da düz metin olabilir
        const pick = (v) => (v && typeof v === "object" ? (v[lang] !== undefined && v[lang] !== "" ? v[lang] : v.tr || v.en || "") : v || "");
        site.projects.forEach((p, i) => {
            d[`p.${i + 1}.t`] = pick(p.title);
            d[`p.${i + 1}.tag`] = pick(p.tag);
            d[`p.${i + 1}.d`] = pick(p.desc);
        });
        ((site.portfolio && site.portfolio.sections) || []).forEach((x, i) => {
            ["tab", "title", "body"].forEach((f) => (d[`pf.${i + 1}.${f}`] = pick(x[f])));
        });
        site.experience.forEach((x, i) => {
            ["date", "role", "company", "desc"].forEach((f) => (d[`exp.${i + 1}.${f}`] = pick(x[f])));
        });
        site.education.forEach((x, i) => {
            ["date", "school", "degree", "field", "desc"].forEach((f) => (d[`edu.${i + 1}.${f}`] = pick(x[f])));
        });
        site.skills.forEach((s, i) => (d[`skill.${i + 1}`] = pick(s)));
        site.skillBars.forEach((s, i) => (d[`bar.${i + 1}`] = pick(s.name)));
        site.languages.forEach((s, i) => (d[`langs.${i + 1}`] = pick(s)));
        site.stats.forEach((s, i) => (d[`stats.${i + 1}`] = pick(s.label)));
        (site.gallery || []).forEach((g, i) => {
            d[`g.${i + 1}.alt`] = pick(g.alt);
            d[`g.${i + 1}.cap`] = pick(g.caption);
            d[`g.${i + 1}.place`] = pick(g.place);
        });
        site.courses.forEach((c, i) => (d[`course.${i + 1}.name`] = pick(c.name)));
        site.softSkills.forEach((s, i) => (d[`soft.${i + 1}`] = pick(s.name)));
        // Deri dosyalar: podyum/işler ("folder.N") ve hobi albümü ("hfolder.N")
        [["folder", site.folders], ["hfolder", site.hobbyFolders]].forEach(([pre, list]) => list.forEach((f, i) => {
            const n = i + 1;
            d[`${pre}.${n}.title`] = pick(f.title);
            d[`${pre}.${n}.event`] = pick(f.event);
            (f.tabs || []).forEach((t, k) => (d[`${pre}.${n}.tab${k + 1}`] = pick(t)));
            (f.notes || []).forEach((t, k) => (d[`${pre}.${n}.note${k + 1}`] = pick(t)));
            (f.items || []).forEach((it, k) => (d[`${pre}.${n}.img${k + 1}`] = pick(it.alt)));
        }));
    });
    return dicts;
}

const I18N = buildDictionaries(SITE);

/* ---------- Listeleri sayfaya bas (şablonun orijinal işaretlemesiyle) ---------- */
function escAttr(s) {
    return String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// Bağlantı yoksa görselin kendisi açılır (yüklenen data: görselleri yeni sekmede açılamaz)
function projectHref(p) {
    if (p.link) return p.link;
    if (p.image && !/^data:/i.test(p.image)) return p.image;
    return "";
}

function linkAttrs(href) {
    if (!href) return "";
    const external = /^(https?:|mailto:|tel:)/i.test(href) || /\.(jpe?g|png|gif|webp|avif|svg)$/i.test(href);
    return ` href="${escAttr(href)}"` + (external ? ' target="_blank" rel="noopener"' : "");
}

// Görsel varsa art-img, yoksa soyut desen (art-1 … art-6)
function projectArt(p) {
    if (p.image) return '<div class="art-img"></div>';
    const art = /^art-[1-6]$/.test(p.art) ? p.art : "art-1";
    return `<div class="${art}"></div>`;
}

function setArtImages(container, list) {
    container.querySelectorAll("[data-pi]").forEach((el) => {
        const p = list[+el.dataset.pi];
        const img = el.querySelector(".art-img");
        if (img && p && p.image) img.style.backgroundImage = 'url("' + String(p.image).replace(/"/g, "%22") + '")';
        el.removeAttribute("data-pi");
    });
}

function renderContent(site) {
    const box = (name) => document.querySelector(`[data-render="${name}"]`);
    const pad = (n) => String(n).padStart(2, "0");
    let el;

    // Ana sayfa: öne çıkan projeler (yatay kaydırma)
    if ((el = box("projects-featured"))) {
        const list = site.projects.map((p, i) => ({ p, i })).filter((x) => x.p.featured);
        el.innerHTML = list.map(({ p, i }, n) =>
            `<a class="h-card"${linkAttrs(projectHref(p))} data-cursor="view" data-pi="${i}">` +
                `<div class="thumb tilt">${projectArt(p)}<span class="glare"></span></div>` +
                `<div class="meta"><div><h3 data-i18n="p.${i + 1}.t"></h3><small data-i18n="p.${i + 1}.tag"></small><p class="h-card-d" data-i18n="p.${i + 1}.d"></p>${p.rights ? '<em class="p-rights" data-i18n="p.rights"></em>' : ""}</div><span class="idx">(${pad(n + 1)})</span></div>` +
            `</a>`).join("");
        setArtImages(el, site.projects);
    }

    // Projeler sayfası: her proje kendi açılış sahnesinde (anahtar deliği → portfolyo → kubbe, çerçeve, mektup...)
    if ((el = box("projectscenes"))) {
        const list = site.projects.map((p, i) => ({ p, i }));
        const pfs = list.filter((x) => x.p.scene === "portfolio");
        const rest = list.filter((x) => x.p.scene && !["portfolio", "card"].includes(x.p.scene));
        const cards = list.filter((x) => !x.p.scene || x.p.scene === "card");
        const link = (p, key) => (projectHref(p) ? `<a class="btn btn-outline-dark sc-link"${linkAttrs(projectHref(p))} data-i18n="${key}"></a>` : "");
        const label = ({ p, i }) =>
            `<div class="sc-label">` +
                `<div class="sc-tag" data-i18n="p.${i + 1}.tag"></div>` +
                `<h2 data-i18n="p.${i + 1}.t"></h2>` +
                `<p data-i18n="p.${i + 1}.d"></p>` +
                (p.rights ? '<p class="p-rights" data-i18n="p.rights"></p>' : "") + link(p, "projects.view") +
            `</div>`;
        const art = ({ p, i }) => `<figure class="scene-art"><img src="${escAttr(p.image)}" alt="" data-i18n-alt="p.${i + 1}.t" loading="lazy" decoding="async"></figure>`;
        const props = {
            cloche: (x) => `<div class="prop prop-cloche"><div class="pc-glow"></div><div class="pc-plate"></div>${art(x)}<div class="pc-dome"><i></i></div></div>`,
            frame: (x) => `<div class="prop prop-frame"><span class="pfr-cord"></span><div class="pfr-frame">${art(x)}</div></div>`,
            letter: (x) => `<div class="prop prop-letter"><div class="pl-back"></div><div class="pl-paper">${art(x)}</div><div class="pl-front"></div><div class="pl-flap"></div><div class="pl-seal"><i class="l"></i><i class="r"></i></div></div>`,
            jewel: (x) => `<div class="prop prop-jewel"><div class="pj-glow"></div><div class="pj-back"></div>${art(x)}<div class="pj-front"></div><div class="pj-lid"></div></div>`,
            album: (x) => `<div class="prop prop-album"><div class="pa-page">${art(x)}</div><div class="pa-cover"><b></b></div></div>`
        };
        const kh = `<svg class="kh-cover" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">` +
            `<defs><mask id="khMask"><rect width="100" height="100" fill="#fff"/><path fill="#000" d="M50 33a7.2 7.2 0 0 1 3.6 13.4L57 64H43l3.4-17.6A7.2 7.2 0 0 1 50 33z"/></mask></defs>` +
            `<rect width="100" height="100" fill="#0a0704" mask="url(#khMask)"/>` +
            `<path fill="none" stroke="#c9a96e" stroke-width=".35" opacity=".7" d="M50 33a7.2 7.2 0 0 1 3.6 13.4L57 64H43l3.4-17.6A7.2 7.2 0 0 1 50 33z"/></svg>`;
        const portfolio = pfs.map((x) =>
            `<section class="scene scene--portfolio" data-scene="portfolio" aria-labelledby="sc-pf">` +
                `<div class="scene-stage">` +
                    `<div class="pf-intro">${label(x).replace("<h2", '<h2 id="sc-pf"')}</div>` +
                    `<div class="pf" data-pf>` +
                        `<div class="pf-book">` +
                            `<div class="pf-inside"><div class="pf-cards">` +
                                (site.portfolio ? site.portfolio.sections : []).map((_, k) =>
                                    `<article class="pf-card" data-k="${k}"><h3 data-i18n="pf.${k + 1}.title"></h3><p data-i18n="pf.${k + 1}.body"></p></article>`).join("") +
                            `</div></div>` +
                            `<div class="pf-cover"><div class="pf-front"><span class="pf-script" data-i18n="pf.cover.script"></span><span class="pf-title" data-i18n="pf.cover.title"></span></div><div class="pf-back"></div></div>` +
                            `<div class="pf-tabs" role="group" data-i18n-aria="pf.tabs">` +
                                (site.portfolio ? site.portfolio.sections : []).map((_, k) =>
                                    `<button type="button" class="pf-tab" data-k="${k}" data-i18n="pf.${k + 1}.tab"></button>`).join("") +
                            `</div>` +
                        `</div>` +
                    `</div>` + kh +
                    `<p class="kh-hint" data-i18n="scenes.hint"></p>` +
                `</div>` +
            `</section>`).join("");
        const scenes = rest.map((x, n) =>
            `<section class="scene scene--${x.p.scene} ${n % 2 ? "is-flip" : ""}" data-scene="${x.p.scene}" aria-labelledby="sc-${x.i}">` +
                `<div class="scene-stage"><div class="scene-prop">${props[x.p.scene](x)}</div>${label(x).replace("<h2", `<h2 id="sc-${x.i}"`)}</div>` +
            `</section>`).join("");
        const plain = cards.map((x) =>
            `<section class="scene scene--card" data-scene="card" aria-labelledby="sc-${x.i}"><div class="scene-stage">${label(x).replace("<h2", `<h2 id="sc-${x.i}"`)}</div></section>`).join("");
        el.innerHTML = portfolio + scenes + plain;
    }

    // Projeler sayfası: tüm projeler
    if ((el = box("projects"))) {
        const delays = ["0.0", "0.1", "0.2"];
        el.innerHTML = site.projects.map((p, i) =>
            `<div class="col-md-6" data-reveal data-delay="${delays[i % 3]}">` +
                `<a class="project-tile d-block text-decoration-none"${linkAttrs(projectHref(p))} data-cursor="view" data-pi="${i}">` +
                    `<div class="thumb tilt clip-reveal">${projectArt(p)}<span class="glare"></span></div>` +
                    `<div class="body">` +
                        `<div class="tag mb-2" data-i18n="p.${i + 1}.tag"></div>` +
                        `<h3 class="fw-bolder" data-i18n="p.${i + 1}.t"></h3>` +
                        `<p class="text-muted mb-3" data-i18n="p.${i + 1}.d"></p>` +
                    `</div>` +
                `</a>` +
            `</div>`).join("");
        setArtImages(el, site.projects);
    }

    // Özgeçmiş: deneyim kartları
    if ((el = box("experience"))) {
        el.innerHTML = '<span class="tl-fill"></span>' + site.experience.map((x, i) =>
            `<div class="card rounded-4 mb-4" data-reveal><div class="card-body p-5"><div class="row align-items-center gx-5">` +
                `<div class="col text-center text-lg-start mb-4 mb-lg-0"><div class="inner-box p-4 rounded-4">` +
                    `<div class="text-primary fw-bolder mb-2" data-i18n="exp.${i + 1}.date"></div>` +
                    `<div class="small fw-bolder" data-i18n="exp.${i + 1}.role"></div>` +
                    `<div class="small text-muted" data-i18n="exp.${i + 1}.company"></div>` +
                `</div></div>` +
                `<div class="col-lg-8"><div data-i18n="exp.${i + 1}.desc"></div></div>` +
            `</div></div></div>`).join("");
    }

    // Özgeçmiş: eğitim kartları
    if ((el = box("education"))) {
        el.innerHTML = '<span class="tl-fill"></span>' + site.education.map((x, i) =>
            `<div class="card rounded-4 mb-4" data-reveal><div class="card-body p-5"><div class="row align-items-center gx-5">` +
                `<div class="col text-center text-lg-start mb-4 mb-lg-0"><div class="inner-box p-4 rounded-4">` +
                    `<div class="text-secondary fw-bolder mb-2" data-i18n="edu.${i + 1}.date"></div>` +
                    `<div class="mb-2"><div class="small fw-bolder" data-i18n="edu.${i + 1}.school"></div></div>` +
                    `<div class="fst-italic">` +
                        `<div class="small text-muted" data-i18n="edu.${i + 1}.degree"></div>` +
                        `<div class="small text-muted" data-i18n="edu.${i + 1}.field"></div>` +
                    `</div>` +
                `</div></div>` +
                `<div class="col-lg-8"><div data-i18n="edu.${i + 1}.desc"></div></div>` +
            `</div></div></div>`).join("");
    }

    // Yetenek etiketleri, uzmanlık çubukları, diller
    if ((el = box("skills"))) {
        el.innerHTML = site.skills.map((s, i) => `<span class="skill-tag" data-i18n="skill.${i + 1}"></span>`).join("");
    }
    if ((el = box("skillbars"))) {
        el.innerHTML = site.skillBars.map((s, i) => {
            const w = Math.max(0, Math.min(100, parseInt(s.percent, 10) || 0));
            return `<div class="col-md-6"><div class="d-flex justify-content-between small mb-2"><span data-i18n="bar.${i + 1}"></span><span class="text-muted">${w}%</span></div><div class="skill-bar" role="meter" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${w}" aria-valuetext="${w}%"><i style="--w: ${w}%"></i></div></div>`;
        }).join("");
    }
    if ((el = box("languages"))) {
        el.innerHTML = site.languages.map((s, i) =>
            `<div class="col"><div class="inner-box p-3 rounded-4 small fw-bolder h-100" data-i18n="langs.${i + 1}"></div></div>`).join("");
    }

    // Deri dosyalar: ana sayfada podyum/işler (data-render="folders"), hakkımda sayfasında hobi albümü (data-render="hobbyfolders")
    [["folders", "folders", "folder", "sealPath"], ["hobbyfolders", "hobbyFolders", "hfolder", "sealHobby"]].forEach(([name, key, pre, sealId]) => {
        if (!(el = box(name))) return;
        const list = site[key];
        const POS = { left: "c-left", right: "c-right", mid: "c-mid", extra: "c-extra" }; // extra: dosyada görünmez, yalnız açılan pencerede
        const LEATHER = { kahve: "", yosun: " folder--moss", siyah: " folder--black", bordo: " folder--wine" };
        const seal = (id) =>
            `<button type="button" class="folder-open" data-open-folder aria-label="" data-i18n-aria="runway.open">` +
                `<svg class="seal-ring" viewBox="0 0 100 100" aria-hidden="true"><defs><path id="${id}" d="M50 50m-37 0a37 37 0 1 1 74 0a37 37 0 1 1-74 0" /></defs><text><textPath href="#${id}" class="seal-text" data-seal-text></textPath></text></svg>` +
                `<svg class="seal-lily" viewBox="0 0 64 64" aria-hidden="true"><path d="M32 54V34M32 34c-3-9-3-18 0-26 3 8 3 17 0 26zM32 34c-8-4-14-11-16-20 8 2 14 9 16 20zM32 34c8-4 14-11 16-20-8 2-14 9-16 20z" /></svg>` +
            `</button>`;
        // Sıra düzeni: 4, 8… dosyada ikili (2×2); diğerlerinde üçlü (5 → 3 + 2). Kutuda data-col varsa o kullanılır.
        const count = list.length;
        const col = el.dataset.col || (count % 3 !== 0 && count % 2 === 0 && count % 4 === 0 ? "col-md-6" : "col-md-6 col-xl-4");
        el.innerHTML = list.map((f, i) => {
            const n = i + 1;
            const items = (f.items || []).filter((it) => it && it.src);
            return `<div class="${col}"><article class="folder${LEATHER[f.leather] || ""}" data-folder>` +
                `<div class="folder-back">` +
                    `<div class="sheet" aria-hidden="true"><span class="sheet-no">N° ${pad(n)}</span>` +
                        [1, 2, 3].map((k) => `<span class="note n${k}" data-i18n="${pre}.${n}.note${k}"></span>`).join("") +
                        `<svg class="sketch" viewBox="0 0 100 100" preserveAspectRatio="none"><path d="M8 22 Q30 16 46 30" /><path d="M92 46 Q74 44 62 54" /><path d="M10 70 Q26 76 38 66" /><path d="M50 6 L50 96" class="dash" /></svg>` +
                    `</div>` +
                    `<ul class="folder-tabs" aria-hidden="true">` + [1, 2, 3].map((k) => `<li data-i18n="${pre}.${n}.tab${k}"></li>`).join("") + `</ul>` +
                `</div>` +
                `<div class="folder-papers">` + items.map((it, k) => {
                    const cls = "cut " + (POS[it.pos] || "c-mid") + (it.kind === "print" ? " print" : "") + (it.wide ? " c-wide" : "");
                    const rot = Number(it.rot) || 0;
                    return `<figure class="${cls}" style="--r: ${rot}deg"><img src="${escAttr(it.src)}" alt="" data-i18n-alt="${pre}.${n}.img${k + 1}" loading="lazy" decoding="async" /></figure>`;
                }).join("") + `</div>` +
                `<div class="folder-front">${seal(sealId + n)}` +
                    `<h3 class="folder-title" data-i18n-html="${pre}.${n}.title"></h3>` +
                    `<p class="folder-meta" data-i18n="${pre}.${n}.event"></p>` +
                `</div>` +
            `</article></div>`;
        }).join("");
    });

    // Özgeçmiş: haftalık ders programı (masaüstünde saat tablosu, telefonda gün gün liste)
    if ((el = box("schedule"))) {
        const toMin = (t) => { const m = String(t || "").match(/(\d{1,2})[:.](\d{2})/); return m ? +m[1] * 60 + +m[2] : NaN; };
        const courses = site.courses
            .map((c, i) => ({ c, i, d: Math.round(+c.day), s: toMin(c.start), e: toMin(c.end) }))
            .filter((x) => x.d >= 1 && x.d <= 5 && x.s < x.e)
            .sort((a, b) => a.d - b.d || a.s - b.s);
        if (!courses.length) {
            el.closest("section").hidden = true;
        } else {
            // Saat satırları: en erken dersten en geç derse kadar saat başı (hh:30 düzeni korunur)
            const first = Math.min(...courses.map((x) => x.s)), last = Math.max(...courses.map((x) => x.e));
            const rows = Math.ceil((last - first) / 60);
            const hhmm = (m) => String(Math.floor(m / 60)).padStart(2, "0") + ":" + String(m % 60).padStart(2, "0");
            // Ders koduna göre sabit renk
            const tint = (code) => { let h = 0; for (const ch of String(code)) h = (h * 31 + ch.charCodeAt(0)) >>> 0; return "t" + (h % 5); };
            const kind = (k) => (["teori", "uygulama", "karma", "uzaktan"].includes(k) ? k : "teori");
            const card = (x) =>
                `<article class="course ${tint(x.c.code)}" data-code="${escAttr(x.c.code || "")}" data-day="${x.d}" data-start="${x.s}" data-end="${x.e}" style="--row: ${Math.floor((x.s - first) / 60) + 2}; --span: ${Math.max(1, Math.round((x.e - x.s + 10) / 60))}; --col: ${x.d + 1}">` +
                    `<div class="course-top"><span class="course-code">${escAttr(x.c.code || "")}</span><span class="course-time">${escAttr(x.c.start)}–${escAttr(x.c.end)}</span></div>` +
                    `<h4 class="course-name" data-i18n="course.${x.i + 1}.name"></h4>` +
                    `<div class="course-meta">` +
                        (x.c.room ? `<span><i class="bi bi-geo-alt"></i>${escAttr(x.c.room)}</span>` : "") +
                        (x.c.teacher ? `<span><i class="bi bi-person"></i>${escAttr(x.c.teacher)}</span>` : "") +
                    `</div>` +
                    `<span class="course-kind k-${kind(x.c.kind)}" data-i18n="schedule.kind.${kind(x.c.kind)}"></span>` +
                    `<span class="course-now" data-i18n="schedule.now"></span>` +
                `</article>`;
            // Gerçek <table>: üst satırda günler (th), solda saatler (th), dersler rowspan'li hücreler (td)
            const spanOf = (x) => Math.max(1, Math.round((x.e - x.s + 10) / 60));
            const covered = {}; // "satır:gün" → önceki bir dersin rowspan'i tarafından kapatılmış hücre
            let grid = `<table class="sched-table"><caption class="visually-hidden" data-i18n="schedule.title.plain"></caption>` +
                `<thead><tr><th scope="col" class="sgt-corner" data-i18n="schedule.time"></th>` +
                [1, 2, 3, 4, 5].map((d) => `<th scope="col" class="sgt-head" data-day="${d}"><span data-i18n="schedule.day${d}"></span><small data-i18n="schedule.today"></small></th>`).join("") +
                `</tr></thead><tbody>`;
            for (let r = 0; r < rows; r++) {
                const t = first + r * 60;
                const busy = courses.some((x) => x.s < t + 50 && x.e > t);
                grid += `<tr><th scope="row" class="sgt-time">${hhmm(t)}</th>`;
                if (!busy) {
                    grid += `<td class="sgt-free" colspan="5" data-i18n="schedule.lunch"></td></tr>`;
                    continue;
                }
                for (let d = 1; d <= 5; d++) {
                    if (covered[r + ":" + d]) continue;
                    const x = courses.find((c) => c.d === d && Math.floor((c.s - first) / 60) === r);
                    if (!x) { grid += `<td class="sgt-cell" data-day="${d}"></td>`; continue; }
                    const sp = spanOf(x);
                    for (let k = 1; k < sp; k++) covered[(r + k) + ":" + d] = true;
                    grid += `<td class="sgt-cell sgt-has" data-day="${d}" rowspan="${sp}">${card(x).replace('class="course ', 'class="course ' + (sp === 1 ? "is-short " : ""))}</td>`;
                }
                grid += `</tr>`;
            }
            grid += `</tbody></table>`;
            const list = `<div class="sched-list">` + [1, 2, 3, 4, 5].map((d) => {
                const day = courses.filter((x) => x.d === d);
                if (!day.length) return "";
                return `<div class="sl-day" data-day="${d}"><h3><span data-i18n="schedule.day${d}"></span><small data-i18n="schedule.today"></small></h3>${day.map(card).join("")}</div>`;
            }).join("") + `</div>`;
            el.innerHTML = grid + list;
            // Bugün ve şu anki ders (Türkiye saatiyle)
            // `el` renderContent içinde yeniden atanır; bu yüzden kutu burada ayrıca saklanır.
            // Sayfa değişince (kutu DOM'dan çıkınca) zamanlayıcı kendini durdurur.
            const host = el;
            if (window.__schedTimer) clearInterval(window.__schedTimer);
            const markNow = () => {
                if (!host.isConnected) { clearInterval(window.__schedTimer); return; }
                const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Europe/Istanbul" }));
                const day = now.getDay(), min = now.getHours() * 60 + now.getMinutes();
                host.querySelectorAll("[data-day]").forEach((n) => n.classList.toggle("is-today", +n.dataset.day === day));
                host.querySelectorAll(".course").forEach((n) => n.classList.toggle("is-now", +n.dataset.day === day && min >= +n.dataset.start && min < +n.dataset.end));
            };
            markNow();
            window.__schedTimer = setInterval(markNow, 60000);
        }
    }

    // Hakkımda: kişisel yetkinlikler — yüzde halkaları (görününce dolar)
    if ((el = box("softskills"))) {
        el.innerHTML = site.softSkills.map((s, i) => {
            const v = Math.max(0, Math.min(100, parseInt(s.percent, 10) || 0));
            return `<div class="ring" style="--p: ${v}" role="meter" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${v}" aria-valuetext="${v}%">` +
                `<svg viewBox="0 0 120 120" aria-hidden="true"><circle class="ring-bg" cx="60" cy="60" r="52" /><circle class="ring-fg" cx="60" cy="60" r="52" pathLength="100" /></svg>` +
                `<b>${v}<small>%</small></b><span data-i18n="soft.${i + 1}"></span>` +
            `</div>`;
        }).join("");
        const rings = el.querySelectorAll(".ring");
        if ("IntersectionObserver" in window) {
            const io = new IntersectionObserver((en) => en.forEach((x) => {
                if (x.isIntersecting) { x.target.classList.add("is-in"); io.unobserve(x.target); }
            }), { threshold: 0.4 });
            rings.forEach((r) => io.observe(r));
        } else rings.forEach((r) => r.classList.add("is-in"));
    }

    // Hakkımda: yeteneklerim (sıralı liste)
    if ((el = box("skillsol"))) el.innerHTML = site.skills.map((x, i) => `<li data-i18n="skill.${i + 1}"></li>`).join("");

    // Ana sayfa: galeriden ilk üç kare
    if ((el = box("gallerypreview"))) {
        el.innerHTML = (site.gallery || []).slice(0, 3).map((g, i) =>
            `<a class="gp-item" href="galeri.html" data-reveal data-delay="${["0.0", "0.1", "0.2"][i]}" data-cursor="view">` +
                `<span class="gp-canvas"><img src="${g.image}" alt="" data-i18n-alt="g.${i + 1}.alt" loading="lazy" decoding="async"></span>` +
                `<span class="gp-place" data-i18n="g.${i + 1}.place"></span>` +
            `</a>`).join("");
    }

    // Müze duvarı (Projeler ve Galeri): her tablo altın çerçevede asılı; davranış js/wall.js (veri: js/content.js > projects / gallery)
    if ((el = box("wall"))) {
        const kind = el.dataset.wall === "gallery" ? "gallery" : "projects";
        const page = kind === "gallery" ? "galeri.html" : "projects.html";
        const list = kind === "gallery"
            ? (site.gallery || []).map((g, i) => ({ i, img: g.image, slug: `foto-${i + 1}`, t: `g.${i + 1}.place`, tag: "", alt: `g.${i + 1}.alt` }))
            : site.projects.map((p, i) => ({ i, img: p.image, slug: `proje-${i + 1}`, t: `p.${i + 1}.t`, tag: `p.${i + 1}.tag`, alt: `p.${i + 1}.t` })).filter((x) => x.img);
        el.dataset.kind = kind;
        el.dataset.page = page;
        el.innerHTML =
            `<div class="wall-room" aria-hidden="true"><i class="wall-cornice"></i><i class="wall-base"></i><i class="wall-floor"></i></div>` +
            `<div class="wall-track" data-lenis-prevent>` +
                list.map((x, n) =>
                    `<a class="wall-art" href="${page}?p=${x.slug}" data-no-pjax data-cursor="view" data-i="${x.i}" data-slug="${x.slug}">` +
                        `<span class="wall-frame wall-frame--landscape"><span class="wall-shadow"></span>` +
                            `<span class="wall-pic"><img src="${escAttr(x.img)}" alt="" data-i18n-alt="${x.alt}" ${n < 2 ? "" : 'loading="lazy" '}decoding="async"></span>` +
                            `<img class="wall-fr" src="images/frames/frame-landscape.png" alt="" aria-hidden="true" decoding="async"><span class="wall-glint"></span></span>` +
                        `<span class="wall-plate"><h2 data-i18n="${x.t}"></h2>${x.tag ? `<small data-i18n="${x.tag}"></small>` : ""}</span>` +
                    `</a>`).join("") +
            `</div>`;
        // Görseli olmayan projeler (kişisel portfolyo, sosyal medya) duvarın altında metin etiketi olarak kalır
        const more = kind === "projects" ? site.projects.map((p, i) => ({ p, i })).filter((x) => !x.p.image) : [];
        if (more.length) {
            const nxt = el.nextElementSibling;
            const ul = document.createElement("div");
            ul.className = "wall-more container px-5";
            ul.innerHTML = more.map(({ p, i }) =>
                `<article class="wall-label"><small data-i18n="p.${i + 1}.tag"></small><h2 data-i18n="p.${i + 1}.t"></h2><p data-i18n="p.${i + 1}.d"></p>` +
                (p.scene === "portfolio" && site.portfolio ? `<ul>${site.portfolio.sections.map((_, k) => `<li><b data-i18n="pf.${k + 1}.title"></b> <span data-i18n="pf.${k + 1}.body"></span></li>`).join("")}</ul>` : "") +
                (projectHref(p) ? `<a class="btn btn-outline-dark sc-link"${linkAttrs(projectHref(p))} data-i18n="projects.view"></a>` : "") + `</article>`).join("");
            if (!(nxt && nxt.classList.contains("wall-more"))) el.insertAdjacentElement("afterend", ul); else nxt.replaceWith(ul);
        }
    }

    // Galeri: fotoğraf + yer + kısa açıklama (js/content.js > gallery)
    if ((el = box("gallery"))) {
        el.innerHTML = (site.gallery || []).map((g, i) =>
            `<figure class="g-item" data-reveal data-delay="${["0.0", "0.08", "0.16"][i % 3]}">` +
                `<div class="g-photo"><img src="${g.image}" alt="" data-i18n-alt="g.${i + 1}.alt" loading="lazy" decoding="async"></div>` +
                `<figcaption><span class="g-place" data-i18n="g.${i + 1}.place"></span><span class="g-cap" data-i18n="g.${i + 1}.cap"></span></figcaption>` +
            `</figure>`).join("");
    }

    // Sayfa sonu: sıradaki sayfa + tüm sayfalara kısa yol
    if ((el = box("pagenav"))) {
        const ORDER = [["home", "index.html", "nav.home"], ["about", "hakkimda.html", "nav.about"], ["resume", "resume.html", "nav.resume"], ["projects", "projects.html", "nav.projects"], ["blog", "blog.html", "nav.blog"], ["gallery", "galeri.html", "nav.gallery"], ["process", "surec.html", "nav.process"], ["contact", "contact.html", "nav.contact"]];
        const cur = Math.max(0, ORDER.findIndex((o) => o[0] === document.body.dataset.page));
        const next = ORDER[(cur + 1) % ORDER.length], prev = ORDER[(cur - 1 + ORDER.length) % ORDER.length];
        const last = cur === ORDER.length - 1;
        el.innerHTML =
            `<div class="container px-5">` +
                `<div class="pn-grid">` +
                    `<a class="pn-next" href="${next[1]}" data-cursor="view">` +
                        `<span class="pn-label" data-i18n="${last ? "pagenav.restart" : "pagenav.next"}"></span>` +
                        `<span class="pn-title" data-i18n="${next[2]}"></span>` +
                        `<span class="pn-desc" data-i18n="pagenav.desc.${next[0]}"></span>` +
                        `<span class="pn-arrow" aria-hidden="true"><i class="bi bi-arrow-right"></i></span>` +
                    `</a>` +
                    `<div class="pn-count" aria-hidden="true">${cur + 1} / ${ORDER.length}</div>` +
                    `<a class="pn-prev" href="${prev[1]}">` +
                        `<span class="pn-label" data-i18n="pagenav.prev"></span>` +
                        `<span class="pn-title" data-i18n="${prev[2]}"></span>` +
                        `<span class="pn-arrow" aria-hidden="true"><i class="bi bi-arrow-left"></i></span>` +
                    `</a>` +
                `</div>` +
                `<div class="pn-all"><span data-i18n="pagenav.all"></span>` +
                    ORDER.map((o) => `<a href="${o[1]}"${o[0] === ORDER[cur][0] ? ' class="is-here" aria-current="page"' : ""} data-i18n="${o[2]}"></a>`).join("") +
                `</div>` +
            `</div>`;
    }

    // Ana sayfa: sayaçlar
    if ((el = box("stats"))) {
        const col = { 1: 12, 2: 6, 3: 4, 4: 3 }[site.stats.length] || 4;
        el.innerHTML = site.stats.map((s, i) => {
            const n = parseInt(s.number, 10) || 0;
            const sup = s.suffix ? `<sup>${escAttr(s.suffix)}</sup>` : "";
            return `<div class="col-sm-${col}"><span class="rule"></span><div class="stat">` +
                `<div class="num"><span data-count="${n}">${n}</span>${sup}</div>` +
                `<div class="label" data-i18n="stats.${i + 1}"></div>` +
            `</div></div>`;
        }).join("");
    }
}

/* ---------- Dil ---------- */
function getLang() {
    // Adresteki ?lang=en / ?lang=tr önce gelir (hreflang bağlantıları ve paylaşılan linkler için); seçim hatırlanır
    try {
        const q = new URLSearchParams(location.search).get("lang");
        if (q && I18N[q]) { try { localStorage.setItem(LANG_KEY, q); } catch (e) { /* yoksay */ } return q; }
    } catch (e) { /* eski tarayıcı */ }
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
    document.querySelectorAll("[data-i18n-alt]").forEach((el) => {
        const v = dict[el.dataset.i18nAlt];
        if (v !== undefined) el.alt = v;
    });
    document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
        const v = dict[el.dataset.i18nAria];
        if (v !== undefined) el.setAttribute("aria-label", v);
    });

    const titleKey = document.body.dataset.title;
    if (titleKey && dict[titleKey]) document.title = dict[titleKey];

    // Sayfaya özel açıklama + paylaşım etiketleri (arama motorları ve sosyal önizleme)
    const descKey = document.body.dataset.desc;
    const setMeta = (sel, v) => { const m = document.querySelector(sel); if (m && v) m.setAttribute("content", v); };
    if (descKey && dict[descKey]) {
        setMeta('meta[name="description"]', dict[descKey]);
        setMeta('meta[property="og:description"]', dict[descKey]);
        setMeta('meta[name="twitter:description"]', dict[descKey]);
    }
    setMeta('meta[property="og:title"]', document.title);
    setMeta('meta[name="twitter:title"]', document.title);
    setMeta('meta[property="og:locale"]', lang === "en" ? "en_US" : "tr_TR");

    document.querySelectorAll(".lang-switch button").forEach((b) => {
        const on = b.dataset.lang === lang;
        b.classList.toggle("active", on);
        b.setAttribute("aria-pressed", on);
    });

    // Ortak profil alanları (boş bırakılan sosyal bağlantılar gizlenir)
    document.querySelectorAll("[data-profile]").forEach((el) => {
        const v = PROFILE[el.dataset.profile];
        if (v === undefined) return;
        if (el.tagName === "A" && el.dataset.profileHref !== undefined) {
            const p = el.dataset.profile;
            el.hidden = !v;
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

renderContent(SITE);
applyLang(getLang());

// Sayfa içeriği değiştiğinde (js/router.js) listeleri yeniden bas ve dili uygula
window.I18N_refresh = () => {
    renderContent(SITE);
    applyLang(getLang());
};
