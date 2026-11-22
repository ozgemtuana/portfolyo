/* ==========================================================================
   Kâğıt kolajı süslemeleri (references/29–31)
   - Damgalar ve monogram (SVG, düz grafik): yuvarlak "PORTFOLYO · TUANA DAVARCI", oval "ESTD 2026 · ANTALYA",
     "TD" monogramı, tarihli posta damgası, gravür rozet. Mürekkep aşınması SVG gürültü filtresiyle.
   - Fotoğraf köşelikleri, el yazısı imza, bilet numarası gibi küçük dekoratif parçalar (aria-hidden).
   - Kâğıt objeler kaydırınca masaya kayarak/dönerek gelir; fareyle üstüne gelince hafifçe kalkıp 3D eğilir.
   Şimdilik yalnızca Hakkımda sayfası (onaydan sonra diğer sayfalar).
   ========================================================================== */
(function () {
    const PAGES = ["about"];
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
        arm();
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
    new MutationObserver(() => { document.querySelectorAll(".deco-head, .deco-seat, .deco-sign").forEach((e) => e.remove()); run(); })
        .observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run); else run();
})();
