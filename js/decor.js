/* ==========================================================================
   Kâğıt kolajı süslemeleri (references/29–31)
   - Damgalar ve monogram (SVG, düz grafik): yuvarlak "PORTFOLYO · TUANA DAVARCI", oval "ESTD 2026 · ANTALYA",
     "TD" monogramı, tarihli posta damgası, gravür rozet. Mürekkep aşınması SVG gürültü filtresiyle.
   - Fotoğraf köşelikleri, el yazısı imza, bilet numarası gibi küçük dekoratif parçalar (aria-hidden).
   - Kâğıt objeler kaydırınca masaya kayarak/dönerek gelir; fareyle üstüne gelince hafifçe kalkıp 3D eğilir.
   Tüm genel sayfalarda (Anasayfa, Hakkımda, Özgeçmiş, Projeler, Blog, Galeri, Süreç, İletişim).
   ========================================================================== */
(function () {
    const PAGES = ["about", "home", "projects", "resume", "blog", "gallery", "process", "contact"];
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lang = () => (document.documentElement.lang === "en" ? "en" : "tr");
    let uid = 0;

    // Aşınmış mürekkep: damga baskısı gibi düzensiz kenar
    const worn = (id) => `<filter id="${id}"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="${7 + uid}"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.2 1.55"/><feComposite in="SourceGraphic" operator="in"/></filter>`;
    const lily = "M0 22V2M0 2C-4 -5 -4 -13 0 -20 4 -13 4 -5 0 2zM0 2C-8 -2 -14 -7 -15 -15 -7 -13 -2 -7 0 2zM0 2C8 -2 14 -7 15 -15 7 -13 2 -7 0 2z";

    function stampRound(top, bottom, mid) {
        const id = "dw" + (++uid), p = "dp" + uid;
        return `<svg class="stamp stamp--round" viewBox="-60 -60 120 120" aria-hidden="true" focusable="false"><defs>${worn(id)}` +
            `<path id="${p}a" d="M-41 0a41 41 0 1 1 82 0"/><path id="${p}b" d="M-44 0a44 44 0 0 0 88 0"/></defs>` +
            `<g filter="url(#${id})" fill="none" stroke="currentColor"><circle r="55" stroke-width="2.2"/><circle r="50" stroke-width=".8"/><circle r="31" stroke-width=".8"/>` +
            `<text fill="currentColor" stroke="none" font-family="Jost, sans-serif" font-size="9.5" letter-spacing="2.4"><textPath href="#${p}a" startOffset="50%" text-anchor="middle">${top}</textPath></text>` +
            `<text fill="currentColor" stroke="none" font-family="Jost, sans-serif" font-size="9" letter-spacing="2.4"><textPath href="#${p}b" startOffset="50%" text-anchor="middle">${bottom}</textPath></text>` +
            (mid ? `<text y="8" fill="currentColor" stroke="none" text-anchor="middle" font-family="Pinyon Script, serif" font-size="27">${mid}</text>` : `<path d="${lily}" stroke-width="1.6" transform="translate(0 -2)"/>`) +
            `<circle cx="-47" cy="0" r="1.6" fill="currentColor"/><circle cx="47" cy="0" r="1.6" fill="currentColor"/></g></svg>`;
    }
    function stampOval(l1, big, l2) {
        const id = "dw" + (++uid);
        return `<svg class="stamp stamp--oval" viewBox="-44 -60 88 120" aria-hidden="true" focusable="false"><defs>${worn(id)}</defs>` +
            `<g filter="url(#${id})" fill="none" stroke="currentColor"><ellipse rx="40" ry="56" stroke-width="2"/><ellipse rx="35" ry="51" stroke-width=".7"/>` +
            `<text y="-24" fill="currentColor" stroke="none" text-anchor="middle" font-family="Jost, sans-serif" font-size="9" letter-spacing="3">${l1}</text>` +
            `<path d="M-18 -14H18M-18 22H18" stroke-width=".7"/>` +
            `<text y="12" fill="currentColor" stroke="none" text-anchor="middle" font-family="Cormorant Garamond, serif" font-size="26" letter-spacing="1">${big}</text>` +
            `<text y="38" fill="currentColor" stroke="none" text-anchor="middle" font-family="Jost, sans-serif" font-size="7.5" letter-spacing="2.6">${l2}</text></g></svg>`;
    }
    function monogram() {
        const id = "dw" + (++uid);
        return `<svg class="stamp stamp--mono" viewBox="-40 -40 80 80" aria-hidden="true" focusable="false"><defs>${worn(id)}</defs><g filter="url(#${id})">` +
            `<circle r="36" fill="none" stroke="currentColor" stroke-width="1.4"/><circle r="32.5" fill="none" stroke="currentColor" stroke-width=".6"/>` +
            `<text x="-7" y="11" text-anchor="middle" fill="currentColor" font-family="Cormorant Garamond, serif" font-size="34" font-weight="500">T</text>` +
            `<text x="8" y="13" text-anchor="middle" fill="currentColor" font-family="Pinyon Script, serif" font-size="38">D</text></g></svg>`;
    }
    function postmark(city, year) {
        const id = "dw" + (++uid), p = "dp" + uid;
        const d = new Date(), mon = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"][d.getMonth()];
        return `<svg class="stamp stamp--post" viewBox="-60 -50 220 100" aria-hidden="true" focusable="false"><defs>${worn(id)}<path id="${p}a" d="M-36 0a36 36 0 1 1 72 0"/><path id="${p}b" d="M-38 0a38 38 0 0 0 76 0"/></defs>` +
            `<g filter="url(#${id})" fill="none" stroke="currentColor"><circle r="45" stroke-width="2"/><circle r="27" stroke-width=".8"/>` +
            `<text fill="currentColor" stroke="none" font-family="Jost, sans-serif" font-size="10" letter-spacing="3"><textPath href="#${p}a" startOffset="50%" text-anchor="middle">${city}</textPath></text>` +
            `<text fill="currentColor" stroke="none" font-family="Jost, sans-serif" font-size="10" letter-spacing="3"><textPath href="#${p}b" startOffset="50%" text-anchor="middle">${year}</textPath></text>` +
            `<text y="4" fill="currentColor" stroke="none" text-anchor="middle" font-family="Special Elite, monospace" font-size="11">${d.getDate()} ${mon}</text>` +
            [-18, -6, 6, 18].map((y) => `<path d="M58 ${y}c12-6 24 6 36 0s24 6 36 0s20 6 30 0" stroke-width="2"/>`).join("") + `</g></svg>`;
    }
    function rosette() {
        // Gravür rozet: dalgalı halka + iki kurdele kuyruğu, ince tarama
        const id = "dh" + (++uid);
        let edge = "";
        for (let i = 0; i <= 96; i++) { const a = i / 96 * Math.PI * 2, r = 30 + 3.2 * Math.sin(a * 24); edge += (i ? "L" : "M") + (r * Math.cos(a)).toFixed(2) + " " + (r * Math.sin(a)).toFixed(2); }
        return `<svg class="engr engr--rosette" viewBox="-40 -40 80 110" aria-hidden="true" focusable="false"><defs>` +
            `<pattern id="${id}" width="2.4" height="2.4" patternUnits="userSpaceOnUse" patternTransform="rotate(40)"><line x1="0" y1="0" x2="0" y2="2.4" stroke="currentColor" stroke-width=".7"/></pattern></defs>` +
            `<g fill="none" stroke="currentColor" stroke-width="1"><path d="M-12 22L-22 66L-12 58L-4 68L-2 24Z" fill="url(#${id})"/><path d="M12 22L22 66L12 58L4 68L2 24Z" fill="url(#${id})"/>` +
            `<path d="${edge}Z" fill="url(#${id})" stroke-width="1.1"/><circle r="22" fill="#efe5d1"/><circle r="22"/><circle r="17" stroke-width=".6"/>` +
            `<text y="6" text-anchor="middle" fill="currentColor" stroke="none" font-family="Cormorant Garamond, serif" font-size="17" font-style="italic">1st</text></g></svg>`;
    }
    const hand = (w) => `<svg class="ink-underline" viewBox="0 0 100 10" preserveAspectRatio="none" aria-hidden="true"><path d="M2 6c14-3 30-4 48-2s32 1 46-3" fill="none" stroke="currentColor" stroke-width="${w || 1.6}" stroke-linecap="round"/></svg>`;

    const T = {
        tr: { sign: "Tuana", ticket: "OPERA · BALE · KORO", seat: "N° 0815 · SAHNE ÖNÜ", club: "KULÜP ÜYELİK KARTI", invite: "Davetiye", score: "PARTİ KAYIT KÂĞIDI", tag: "STİL · ETİKET", diploma: "DİPLOMA · BELGE", register: "KAYIT DEFTERİ", index: "FİŞ N° 7", ruler: "CETVEL · YÜZDE" },
        en: { sign: "Tuana", ticket: "OPERA · BALLET · CHOIR", seat: "N° 0815 · FRONT STALLS", club: "CLUB MEMBERSHIP CARD", invite: "Invitation", score: "GAME SCORE SHEET", tag: "STYLE · TAG", diploma: "DIPLOMA · CERTIFICATE", register: "REGISTER", index: "CARD N° 7", ruler: "RULE · PERCENT" }
    };
    const add = (host, cls, html) => {
        if (!host || host.querySelector(":scope > ." + cls.split(" ")[0])) return null;
        const el = document.createElement("span");
        el.className = cls; el.setAttribute("aria-hidden", "true"); el.innerHTML = html;
        host.appendChild(el); return el;
    };

    function decorate() {
        const page = document.body.dataset.page;
        document.documentElement.classList.toggle("collage", PAGES.includes(page));
        if (!PAGES.includes(page)) return;
        const L = T[lang()];
        // Menü: aktif sayfanın altında el çizimi çizgi; footer: posta damgası + monogram
        document.querySelectorAll(".navbar .nav-link.active, .navbar .nav-link[aria-current]").forEach((a) => add(a, "deco-underline", hand()));
        const foot = document.querySelector(".site-footer > .container");
        if (foot && !foot.querySelector(".deco-post")) {
            add(foot, "deco-post", postmark("ANTALYA · TÜRKİYE", "· 2026 ·"));
            add(foot, "deco-mono", monogram());
        }
        const q = (s) => document.querySelector(s);
        // Kısaca ben: mektup kâğıdı, fotoğraf köşelikleri, imza
        const photo = q(".about-page .id-photo");
        if (photo) add(photo, "deco-corners", "<i></i><i></i><i></i><i></i>");
        add(q(".about-page .about-text"), "deco-sign", L.sign);
        add(q(".about-page .about-text"), "deco-stamp", stampOval("ESTD", "2026", "ANTALYA"));
        // Söz: dantel kartın köşesinde yuvarlak damga rozeti (references/29)
        add(q(".about-page .about-quote"), "deco-badge", stampRound("PORTFOLYO", "TUANA DAVARCI"));
        // Hobiler: her biri kendi objesinde
        const cards = document.querySelectorAll(".about-page .int-card");
        const heads = [L.score, L.ticket, L.club, L.invite, L.tag];
        cards.forEach((c, i) => {
            c.classList.add("obj", "obj--" + ["score", "ticket", "club", "invite", "tag"][i]);
            add(c, "deco-head", heads[i]);
            if (i === 1) add(c, "deco-seat", L.seat);
            if (i === 2) add(c, "deco-mono-sm", monogram());
            if (i === 4) add(c, "deco-hole", "");
        });
        // Eğitim: diploma + oval damga
        const edu = q(".about-page .edu-list");
        if (edu) { edu.classList.add("obj", "obj--diploma"); add(edu, "deco-head", L.diploma); add(edu, "deco-stamp", stampRound("AKDENİZ · ANTALYA", "ESTD 2026", "TD")); }
        const sched = q(".about-page .sched-wrap");
        if (sched) { sched.classList.add("obj", "obj--register"); add(sched, "deco-head", L.register); }
        // Listeler: fiş kartı (ol) ve defter sayfası (ul) + gravür rozet (binicilik)
        const lists = document.querySelectorAll(".about-page .list-card");
        if (lists[0]) { lists[0].classList.add("obj", "obj--index"); add(lists[0], "deco-head", L.index); }
        if (lists[1]) { lists[1].classList.add("obj", "obj--notebook"); add(lists[1], "deco-rosette", rosette()); }
        // Yetenekler: cetvel ve fiş
        document.querySelectorAll(".about-page .skills-panel").forEach((p, i) => { p.classList.add("obj", i ? "obj--card" : "obj--ruler"); if (!i) add(p, "deco-head", L.ruler); });
        // Diğer kâğıtlar
        [".about-page .about-text", ".about-page .code-card", ".about-page .about-quote", ".about-page .hobby-intro"].forEach((s, i) => { const el = q(s); if (el) el.classList.add("obj", ["obj--letter", "obj--typed", "obj--lace", "obj--note"][i]); });
        if (page === "home") decorateHome(L);
        if (page === "projects") decorateProjects(L);
        if (["resume", "blog", "gallery", "process", "contact"].includes(page)) {
            ({ resume: decorateResume, blog: decorateBlog, gallery: decorateGallery, process: decorateProcess, contact: decorateContact })[page]();
            decoratePagenav(N[lang()]);
        }
        arm();
    }

    /* ---------- Dergi süsleri: gravür ayraç, el çizimi ok, bant ---------- */
    function divider() {
        // Zeytin dalı: ortada küçük zambak, iki yana kıvrılan dal ve yapraklar
        const leaf = (x, y, r, s) => `<ellipse cx="${x}" cy="${y}" rx="${5.2 * s}" ry="${1.9 * s}" transform="rotate(${r} ${x} ${y})"/>`;
        let leaves = "";
        for (let i = 0; i < 6; i++) {
            const x = 20 + i * 11, s = 1 - i * 0.1;
            leaves += leaf(100 - x, 10 - (i % 2 ? 3 : -3), i % 2 ? 28 : -28, s) + leaf(100 + x, 10 - (i % 2 ? 3 : -3), i % 2 ? -28 : 28, s);
        }
        return `<svg class="orn-divider" viewBox="0 0 200 20" aria-hidden="true" focusable="false"><g fill="none" stroke="currentColor" stroke-width=".8">` +
            `<path d="M92 10C70 9 50 12 22 10M108 10C130 9 150 12 178 10"/>${leaves.replace(/<ellipse/g, '<ellipse fill="currentColor" fill-opacity=".18"')}` +
            `<path d="${lily}" transform="translate(100 11) scale(.42)" stroke-width="1.9"/></g></svg>`;
    }
    const arrow = (flip) => `<svg class="hand-arrow${flip ? " is-flip" : ""}" viewBox="0 0 120 60" aria-hidden="true" focusable="false"><path d="M6 12C30 6 70 10 92 38" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M80 36l13 4 1-14" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    const tape = (cls) => `<i class="tape ${cls || ""}"></i>`;
    const N = { tr: { gal: "üç kare, üç hikâye", pc: "Sevgilerle, T.", next: "sıradaki sayfa", look: "elle seçildi" }, en: { gal: "three frames, three stories", pc: "With love, T.", next: "next page", look: "hand-picked" } };

    function chapters(root) {
        // Her bölüm başlığının altına gravür ayraç
        root.querySelectorAll("section h2").forEach((h) => {
            if (h.closest(".pagenav, .pj-hero, .hero") || h.nextElementSibling && h.nextElementSibling.classList.contains("orn-wrap")) return;
            const w = document.createElement("span"); w.className = "orn-wrap"; w.setAttribute("aria-hidden", "true"); w.innerHTML = divider();
            h.insertAdjacentElement("afterend", w);
        });
    }

    function decorateHome(L) {
        const n = N[lang()];
        const main = document.querySelector("main");
        chapters(main);
        // Galeri: büyük polaroid + küçük polaroid + pul kenarlı baskı; el yazısı not ve ok
        const gp = [...document.querySelectorAll(".gp-item")];
        ["is-hero", "is-small", "is-stamp"].forEach((c, i) => { if (gp[i]) { gp[i].classList.add("obj", c); } });
        if (gp[0]) add(gp[0], "tape-wrap", tape("t1") + tape("t2"));
        if (gp[1]) add(gp[1], "tape-wrap", tape("t3"));
        const g = document.querySelector(".home-gallery .gp-grid");
        if (g) add(g, "hand-note", `<span>${n.gal}</span>${arrow()}`);
        // Hakkımda özeti: mektup kâğıdı, sayaçlar mürekkep damgası
        const ab = document.querySelector(".about-glass");
        if (ab) { ab.classList.add("obj", "obj--letter-home"); add(ab, "deco-sign", L.sign); add(ab, "deco-stamp", stampOval("ESTD", "2026", "ANTALYA")); }
        // Sözler: farklı boyut ve hizada dantel kartlar
        document.querySelectorAll("[data-quote] .quote").forEach((qq, i) => { qq.classList.add("obj", "obj--lace", "q" + (i + 1)); if (i === 2) add(qq, "deco-badge", stampRound("PORTFOLYO", "TUANA DAVARCI")); });
        // Öne çıkan projeler: kartpostal (pul + posta damgası + el yazısı)
        document.querySelectorAll(".h-card").forEach((c, i) => {
            c.classList.add("postcard");
            add(c, "pc-stamp", `<b>${monogram()}</b>`);
            add(c, "pc-post", postmark("ANTALYA", "2026"));
            add(c, "pc-sign", n.pc);
            c.style.setProperty("--rot", ([-2.2, 1.6, -1, 2.4, -1.8, 1.2, -2.6][i % 7]) + "deg");
        });
        // Hizmetler: dosya ayraçlı fiş kartları
        document.querySelectorAll(".services-glass .service-row").forEach((r, i) => { r.classList.add("tabcard"); r.style.setProperty("--tab", i); });
        // Look'lar: dergi sayfası, köşede damga, el yazısı not
        document.querySelectorAll("[data-render='folders'] .folder").forEach((f, i) => {
            f.classList.add("mag", "mag--" + (i % 4 + 1));
            add(f, "mag-stamp", stampRound("LOOK · PODYUM", "ANTALYA · 2026", String(i + 1).padStart(2, "0")));
            add(f, "mag-note", n.look);
            popLook(f, n);
        });
        decoratePagenav(n);
    }

    /* ---------- Look: çerçeveden taşan figürler (moda dergisi "pop-out") ----------
       Kesilmiş figür, arkasındaki daha küçük kâğıt baskının önünde durur; baş/etek çerçeve dışına taşar.
       Bantlar yalnızca çerçevenin köşelerinde (asla yüzde). En yüksek çözünürlüklü figür büyük olur,
       düşük çözünürlüklüler küçük kalır. Tek figürlü Look'ta yanına kumaş kartelası + not gelir. */
    function popLook(f, n) {
        const cuts = [...f.querySelectorAll(".folder-papers .cut")].filter((c) => !c.classList.contains("c-extra")).slice(0, 3);
        if (!cuts.length) return;
        const imgs = cuts.map((c) => c.querySelector("img"));
        const ready = imgs.map((im) => (im.complete && im.naturalWidth ? Promise.resolve() : new Promise((r) => { im.addEventListener("load", r, { once: true }); im.addEventListener("error", r, { once: true }); })));
        Promise.all(ready).then(() => {
            const area = (im) => (im.naturalWidth || 0) * (im.naturalHeight || 0);
            let hero = 0;
            imgs.forEach((im, i) => { if (area(im) > area(imgs[hero])) hero = i; });
            let side = 0;
            cuts.forEach((c, i) => {
                const isCut = !c.classList.contains("print");
                c.classList.add(isCut ? "pop" : "pinned", i === hero ? "pop-hero" : "pop-side");
                c.style.gridArea = i === hero ? "hero" : "s" + (++side);
                c.style.setProperty("--fr", ([-2.4, 2, -1.2][i % 3]) + "deg");
                add(c, "tape-wrap", tape("tc1") + tape("tc2"));
            });
            f.classList.toggle("mag--solo", cuts.length === 1);
            f.classList.toggle("mag--duo", cuts.length === 2);
            if (cuts.length === 1 && !f.querySelector(".swatches")) {
                const aside = document.createElement("div");
                aside.className = "mag-aside"; aside.setAttribute("aria-hidden", "true");
                aside.innerHTML = `<span class="swatches">${swatches(imgs[0]).map((c) => `<i style="--c:${c}"></i>`).join("")}</span><span class="mag-aside-note">${lang() === "en" ? "fabric swatches" : "kumaş kartelası"}</span>`;
                f.appendChild(aside);
            }
        });
    }
    // Figürün kendi renklerinden üç kumaş tonu (açık, orta, koyu)
    function swatches(img) {
        try {
            const cv = document.createElement("canvas"), W = 40, H = 80;
            cv.width = W; cv.height = H;
            const cx = cv.getContext("2d", { willReadFrequently: true });
            cx.drawImage(img, 0, 0, W, H);
            const d = cx.getImageData(0, Math.round(H * 0.3), W, Math.round(H * 0.6)).data, px = [];
            for (let i = 0; i < d.length; i += 4) if (d[i + 3] > 200) px.push([d[i], d[i + 1], d[i + 2]]);
            px.sort((a, b) => (a[0] + a[1] + a[2]) - (b[0] + b[1] + b[2]));
            return [0.25, 0.55, 0.85].map((q) => { const p = px[Math.floor(q * (px.length - 1))] || [180, 150, 130]; return `rgb(${p.join(",")})`; });
        } catch (e) { return ["#d9a09a", "#c4807a", "#8f5550"]; }
    }

    function decorateProjects(L) {
        const n = N[lang()];
        chapters(document.querySelector("main"));
        document.querySelectorAll(".scenes.is-static .scene").forEach((s, i) => {
            s.classList.add("spread", i % 2 ? "spread--b" : "spread--a");
            const art = s.querySelector(".scene-art");
            if (art) add(art, "tape-wrap", tape("t1") + tape("t2"));
            const lab = s.querySelector(".sc-label");
            if (lab) { lab.classList.add("tag-label"); add(lab, "deco-stamp", stampRound("SEÇİLİ İŞLER", "TUANA DAVARCI · 2026", String(i + 1).padStart(2, "0"))); }
        });
        document.querySelectorAll(".scenes.is-static .pf-card").forEach((c, i) => c.style.setProperty("--rot", ([-3, 2, -1.5, 3.2, -2.4, 1][i % 6]) + "deg"));
        // Sayfa sonu çağrısı: kartpostal
        const cta = document.querySelector(".scenes ~ section .card");
        if (cta) { cta.classList.add("cta-postcard"); add(cta, "pc-stamp", `<b>${monogram()}</b>`); add(cta, "pc-post", postmark("ANTALYA", "2026")); add(cta, "pc-sign", n.pc); }
        decoratePagenav(n);
    }

    /* ---------- Kalan sayfalar ---------- */
    const rotSet = [-2.2, 1.6, -1.1, 2.6, -2.8, 1.2, -1.6, 2.2];
    const setRot = (els) => els.forEach((e, i) => e.style.setProperty("--rot", rotSet[i % rotSet.length] + "deg"));
    function decorateResume() {
        chapters(document.querySelector("main"));
        const tls = document.querySelectorAll(".page-offset .timeline");
        if (tls[0]) {
            tls[0].classList.add("strung");
            tls[0].querySelectorAll(".card").forEach((c, i) => {
                c.classList.add("obj", "doc-tag");
                add(c, "doc-hole", "");
                add(c, "doc-stamp", stampRound("DENEYİM · TUANA", "ANTALYA · 2026", String(i + 1).padStart(2, "0")));
            });
        }
        if (tls[1]) tls[1].querySelectorAll(".card").forEach((c) => { c.classList.add("obj", "doc-diploma"); add(c, "doc-stamp", stampOval("ESTD", "2026", "AKDENİZ")); });
        const skills = document.querySelector(".page-offset section:last-of-type > .card");
        if (skills) skills.classList.add("obj", "doc-index");
        setRot([...document.querySelectorAll(".page-offset .obj")]);
    }
    function decorateBlog() {
        document.querySelectorAll(".blog-index .bx").forEach((b, i) => { b.classList.add("obj", "letter-card"); add(b, "pc-stamp", `<b>${monogram()}</b>`); add(b, "pc-post", postmark("ANTALYA", "2026")); });
        document.querySelectorAll(".post").forEach((p) => p.classList.add("letter-paper"));
        document.querySelectorAll(".post-hero, .post-text figure").forEach((f, i) => { f.classList.add("taped-print"); add(f, "tape-wrap", tape("t1") + (i % 2 ? tape("t2") : tape("t3"))); });
        document.querySelectorAll(".post .mini-card").forEach((m) => m.classList.add("obj", "doc-index"));
        document.querySelectorAll(".blog-links a").forEach((a) => a.classList.add("ticket-link"));
        setRot([...document.querySelectorAll(".blog-index .obj")]);
    }
    function decorateGallery() {
        const items = [...document.querySelectorAll(".gallery .g-item")];
        items.forEach((g, i) => {
            g.classList.add("obj", i % 3 === 1 ? "print-old" : "polaroid");
            add(g, "tape-wrap", i % 2 ? tape("t1") : tape("t2") + tape("t3"));
        });
        setRot(items);
    }
    function decorateProcess() {
        const cards = [...document.querySelectorAll(".proc-grid > .proc-card")];
        cards.forEach((c, i) => {
            c.classList.add("obj");
            if (c.querySelector(".proc-palette")) c.classList.add("swatch-card");
            else if (c.querySelector(".proc-sample")) c.classList.add("type-card");
            else if (c.querySelector(".proc-links")) c.classList.add("pinned-card");
            else if (c.querySelector("ol")) c.classList.add("steps-card");
            else if (c.querySelector("ul")) c.classList.add("check-card");
            else c.classList.add("typed-card");
        });
        document.querySelectorAll(".check-card li, .pinned-card li").forEach((li, i) => li.style.setProperty("--tick", (i % 3)));
        setRot(cards);
    }
    function decorateContact() {
        const form = document.querySelector("#contactForm");
        const fc = form && form.closest(".card");
        if (fc) { fc.classList.add("obj", "letter-form"); add(fc, "deco-sign", "Tuana"); }
        const side = [...document.querySelectorAll(".col-lg-5 .card")];
        ["bizcard", "callcard", "addr-label", "stamps-card"].forEach((c, i) => { if (side[i]) side[i].classList.add("obj", c); });
        if (side[1]) add(side[1], "deco-stamp", stampRound("TELEFON", "ANTALYA · 2026"));
        setRot(side);
    }

    function decoratePagenav(n) {
        const next = document.querySelector(".pagenav .pn-next");
        if (next) { next.classList.add("postcard-next"); add(next, "hand-arrow-wrap", arrow()); add(next, "pc-stamp", `<b>${monogram()}</b>`); }
        const prev = document.querySelector(".pagenav .pn-prev");
        if (prev) prev.classList.add("ticket-prev");
    }

    /* ---------- Masaya gelme ve fareyle kalkma ---------- */
    let io = null;
    function arm() {
        const objs = [...document.querySelectorAll(".collage .obj")];
        objs.forEach((el, i) => {
            if (!el.style.getPropertyValue("--rot")) el.style.setProperty("--rot", (((i * 37) % 9) - 4) * 0.55 + "deg");
        });
        if (reduce) { objs.forEach((el) => el.classList.add("is-in")); return; }
        if (io) io.disconnect();
        io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -8% 0px" });
        objs.forEach((el) => io.observe(el));
        if (window.matchMedia("(hover: hover)").matches) objs.forEach((el) => {
            if (el._lift) return; el._lift = true;
            el.addEventListener("mousemove", (e) => {
                const r = el.getBoundingClientRect();
                el.style.setProperty("--ty", (((e.clientX - r.left) / r.width - 0.5) * 6).toFixed(2) + "deg");
                el.style.setProperty("--tx", ((0.5 - (e.clientY - r.top) / r.height) * 5).toFixed(2) + "deg");
            });
            el.addEventListener("mouseleave", () => { el.style.setProperty("--tx", "0deg"); el.style.setProperty("--ty", "0deg"); });
        });
    }

    const run = () => requestAnimationFrame(() => requestAnimationFrame(decorate));   // i18n içerikleri basıldıktan sonra
    document.addEventListener("router:navigated", run);
    new MutationObserver(() => { document.querySelectorAll(".deco-head, .deco-seat, .deco-sign, .pc-sign, .hand-note, .mag-note").forEach((e) => e.remove()); run(); })
        .observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run); else run();
})();
