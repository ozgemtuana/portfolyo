/* ==========================================================================
   Müze duvarı davranışı (Projeler ve Galeri; işaretleme js/i18n.js > data-render="wall")
   - Tablolar tek sırada: tekerlek/ok/sürükle/dokunma ile yatay gezinme (scroll-snap), hafif parallax.
   - Görselin oranına göre çerçeve (yatay / dikey / kare) seçilir.
   - Tıklayınca tablo öne gelip büyür (FLIP, ~700 ms), diğerleri soluklaşır, ayrı detay görünümü açılır.
   - Her öğenin adresi var: ?p=proje-5 / ?p=foto-2 (geri tuşu duvara döner; başlık, açıklama, canonical güncellenir).
   - Detay görseli: içerikteki "detailImage" alanı, yoksa mevcut görsel. Yalnız transform/opacity.
   ========================================================================== */
window.Wall = (function () {
    const FRAMES = { landscape: "images/frames/frame-landscape.png", portrait: "images/frames/frame-portrait.png", square: "images/frames/frame-square.png" };
    const reduce = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
    const lang = () => (document.documentElement.lang === "en" ? "en" : "tr");
    const tt = (k) => { try { const v = window.t && window.t(k, lang()); return v && v !== k ? v : ""; } catch (e) { return ""; } };
    const SITE_URL = "https://ozgemtuana.github.io/portfolyo/";

    let root = null, track = null, arts = [], det = null, cur = -1, pushed = false, orig = null, raf = 0, off = [];
    const on = (t, e, f, o) => { t.addEventListener(e, f, o); off.push(() => t.removeEventListener(e, f, o)); };

    const shapeOf = (w, h) => { const r = w / h; return r > 1.15 ? "landscape" : r < 0.87 ? "portrait" : "square"; };
    function setShape(frame, img) {
        const s = shapeOf(img.naturalWidth || 4, img.naturalHeight || 3);
        frame.className = frame.className.replace(/wall-frame--\w+/, "").trim() + " wall-frame--" + s;
        const fr = frame.querySelector(".wall-fr"); if (fr) fr.src = FRAMES[s];
    }

    /* ---------- Duvar ---------- */
    function pad() { // ilk ve son tablo ortalanabilsin
        if (!arts.length) return;
        const w = track.clientWidth;
        track.style.paddingLeft = Math.max(16, (w - arts[0].offsetWidth) / 2) + "px";
        track.style.paddingRight = Math.max(16, (w - arts[arts.length - 1].offsetWidth) / 2) + "px";
    }
    function parallax() {
        raf = 0;
        const mid = track.scrollLeft + track.clientWidth / 2, w = track.clientWidth;
        arts.forEach((a) => {
            const d = (a.offsetLeft + a.offsetWidth / 2 - mid) / w;
            a.style.transform = `translate3d(${(-d * 34).toFixed(1)}px,0,0)`;
        });
    }
    const queue = () => { if (!raf) raf = requestAnimationFrame(parallax); };
    const nearest = () => { const mid = track.scrollLeft + track.clientWidth / 2; let b = 0, bd = 1e9; arts.forEach((a, i) => { const d = Math.abs(a.offsetLeft + a.offsetWidth / 2 - mid); if (d < bd) { bd = d; b = i; } }); return b; };
    const goTo = (i, smooth = true) => {
        const a = arts[Math.max(0, Math.min(arts.length - 1, i))]; if (!a) return;
        track.scrollTo({ left: a.offsetLeft + a.offsetWidth / 2 - track.clientWidth / 2, behavior: smooth && !reduce() ? "smooth" : "auto" });
    };

    function bindTrack() {
        on(track, "scroll", queue, { passive: true });
        on(window, "resize", () => { pad(); queue(); });
        // Tekerlek: dikey kaydırma bir tablo ileri/geri götürür (uçlarda sayfa kaydırmaya izin verilir)
        let lock = 0;
        on(track, "wheel", (e) => {
            if (det) return;
            const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
            if (Math.abs(d) < 4) return;
            const i = nearest(), nx = i + (d > 0 ? 1 : -1);
            if (nx < 0 || nx >= arts.length) return;
            e.preventDefault();
            if (Date.now() - lock < 520) return;
            lock = Date.now(); goTo(nx);
        }, { passive: false });
        // Fare ile sürükle (dokunma zaten doğal kayar)
        let down = null, moved = 0;
        on(track, "pointerdown", (e) => { if (e.pointerType !== "mouse" || e.button) return; down = { x: e.clientX, l: track.scrollLeft }; moved = 0; });
        on(window, "pointermove", (e) => {
            if (!down) return;
            const dx = e.clientX - down.x; moved = Math.max(moved, Math.abs(dx));
            if (moved > 6) { track.classList.add("is-drag"); track.scrollLeft = down.l - dx; }
        });
        on(window, "pointerup", () => {
            if (!down) return; down = null;
            if (track.classList.contains("is-drag")) { const i = nearest(); track.classList.remove("is-drag"); goTo(i); setTimeout(() => (moved = 0), 0); }
        });
        on(track, "click", (e) => { if (moved > 6) { e.preventDefault(); e.stopPropagation(); return; } const a = e.target.closest(".wall-art"); if (a) { e.preventDefault(); open(arts.indexOf(a), true); } }, true);
        // Klavye: oklar komşu tabloya odaklanır
        on(track, "keydown", (e) => {
            if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
            const i = arts.indexOf(document.activeElement); if (i < 0) return;
            const n = arts[i + (e.key === "ArrowRight" ? 1 : -1)]; if (!n) return;
            e.preventDefault(); n.focus({ preventScroll: true }); goTo(arts.indexOf(n));
        });
        arts.forEach((a) => {
            const img = a.querySelector(".wall-pic img"), fr = a.querySelector(".wall-frame");
            const fit = () => { setShape(fr, img); pad(); queue(); };
            if (img.complete && img.naturalWidth) fit(); else img.addEventListener("load", fit, { once: true });
        });
    }

    /* ---------- Detay ---------- */
    const dataOf = (a) => {
        const kind = root.dataset.kind, i = +a.dataset.i;
        const item = kind === "gallery" ? SITE.gallery[i] : SITE.projects[i];
        return { kind, n: i + 1, item, slug: a.dataset.slug };
    };
    const WALLS = ["#7a1420", "#1f3a2a", "#1b2a4a", "#584208", "#3d2616"];
    const STAND = `<svg viewBox="0 0 400 110" preserveAspectRatio="xMidYMax meet" aria-hidden="true"><defs><linearGradient id="brs" x1="0" x2="1"><stop offset="0" stop-color="#7a5a1c"/><stop offset=".45" stop-color="#f0d48a"/><stop offset="1" stop-color="#6b4e16"/></linearGradient></defs>` +
        `<path d="M48 22 Q200 92 352 22" fill="none" stroke="#8a1c2a" stroke-width="7" stroke-linecap="round"/><path d="M48 22 Q200 92 352 22" fill="none" stroke="#d9b45a" stroke-width="1.5" stroke-dasharray="2 6" stroke-linecap="round" opacity=".7"/>` +
        [48, 352].map((x) => `<g><ellipse cx="${x}" cy="104" rx="26" ry="6" fill="url(#brs)"/><rect x="${x - 4}" y="22" width="8" height="82" fill="url(#brs)"/><circle cx="${x}" cy="18" r="9" fill="url(#brs)"/></g>`).join("") + `</svg>`;
    function fill(a) {
        const { kind, n, item } = dataOf(a);
        const gal = kind === "gallery", L = lang();
        det.style.setProperty("--dw", WALLS[cur % WALLS.length]);
        const img = det.querySelector(".wall-pic img"), frame = det.querySelector(".wall-frame");
        img.src = item.detailImage || item.image;
        img.alt = tt(gal ? `g.${n}.alt` : `p.${n}.t`);
        const done = () => setShape(frame, img);
        if (img.complete && img.naturalWidth) done(); else img.onload = done;
        const title = tt(gal ? `g.${n}.place` : `p.${n}.t`);
        const tag = gal ? tt("nav.gallery") : tt(`p.${n}.tag`);
        // Metin: içerikteki "detailText" (TR/EN), yoksa mevcut açıklama
        const dt = item.detailText && (item.detailText[L] || item.detailText.tr);
        const paras = Array.isArray(dt) && dt.length ? dt : [tt(gal ? `g.${n}.cap` : `p.${n}.d`)];
        const link = !gal && item.link ? item.link : "";
        det.querySelector(".wd-title").textContent = title;
        det.querySelector(".wd-tag").textContent = tag;
        det.querySelector(".wd-body").innerHTML = paras.map((t) => `<p>${esc(t)}</p>`).join("") +
            (!gal && item.rights ? `<p class="p-rights">${esc(tt("p.rights"))}</p>` : "") +
            (link ? `<a class="wd-btn" href="${esc(link)}"${/^https?:/i.test(link) ? ' target="_blank" rel="noopener"' : ""}>${esc(tt("projects.view"))}</a>` : "");
        det.querySelector(".wd-back").innerHTML = `<div><h3>${esc(title)}</h3>${paras.map((t) => `<p>${esc(t)}</p>`).join("")}</div>`;
        det.querySelector(".wd-plate").innerHTML = `<b>${esc(title)}</b>` + (tag ? `<span>${esc(tag)}</span>` : "");
        det.setAttribute("aria-label", title);
        det.querySelector(".wall-nav--prev").hidden = cur <= 0;
        det.querySelector(".wall-nav--next").hidden = cur >= arts.length - 1;
        meta(a);
    }
    const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

    // Her detay için ayrı başlık, açıklama ve canonical
    function meta(a) {
        const { kind, n, slug } = dataOf(a), gal = kind === "gallery";
        const name = (window.PROFILE && PROFILE.name) || "";
        const title = tt(gal ? `g.${n}.place` : `p.${n}.t`) + (name ? " — " + name : "");
        const desc = tt(gal ? `g.${n}.cap` : `p.${n}.d`);
        const url = SITE_URL + root.dataset.page + "?p=" + slug;
        document.title = title;
        const set = (sel, attr, v) => { const m = document.querySelector(sel); if (m && v) m.setAttribute(attr, v); };
        set('meta[name="description"]', "content", desc); set('meta[property="og:description"]', "content", desc); set('meta[name="twitter:description"]', "content", desc);
        set('meta[property="og:title"]', "content", title); set('meta[name="twitter:title"]', "content", title);
        set('link[rel="canonical"]', "href", url); set('meta[property="og:url"]', "content", url);
    }
    function restoreMeta() {
        if (!orig) return;
        Object.keys(orig).forEach((k) => { const [sel, attr] = k.split("|"); const m = document.querySelector(sel); if (m) m.setAttribute(attr, orig[k]); });
        document.title = orig.title; orig = null;
    }
    function saveMeta() {
        const q = [['meta[name="description"]', "content"], ['meta[property="og:description"]', "content"], ['meta[name="twitter:description"]', "content"], ['meta[property="og:title"]', "content"], ['meta[name="twitter:title"]', "content"], ['link[rel="canonical"]', "href"], ['meta[property="og:url"]', "content"]];
        orig = { title: document.title };
        q.forEach(([s, a]) => { const m = document.querySelector(s); if (m) orig[s + "|" + a] = m.getAttribute(a); });
    }

    // FLIP: kaynak çerçeveden hedef çerçeveye
    function flip(frame, from, ms, reverse) {
        const to = frame.getBoundingClientRect();
        const s = from.width / to.width, dx = from.left + from.width / 2 - (to.left + to.width / 2), dy = from.top + from.height / 2 - (to.top + to.height / 2);
        const t = `translate(${dx}px,${dy}px) scale(${s})`;
        return frame.animate(reverse ? [{ transform: "none" }, { transform: t }] : [{ transform: t }, { transform: "none" }], { duration: ms, easing: "cubic-bezier(.22,.61,.36,1)", fill: "both" });
    }

    function open(i, push, instant) {
        const a = arts[i]; if (!a || det) return;
        cur = i; pushed = !!push;
        saveMeta();
        det = document.createElement("div");
        det.className = "wall-detail"; det.setAttribute("role", "dialog"); det.setAttribute("aria-modal", "true");
        det.innerHTML = `<div class="wd-room"></div><div class="wall-detail-in">` +
            `<header class="wd-head wd-fade"><h2 class="wd-title"></h2><i class="wd-rule"></i></header>` +
            `<div class="wd-stage"><p class="wd-tag wd-fade"></p><div class="wd-hang"><div class="wd-card"><div class="wd-flipper"><div class="wd-face wd-front"><span class="wall-frame wall-frame--landscape"><span class="wall-shadow"></span><span class="wall-pic"><img alt="" decoding="async"></span><img class="wall-fr" src="${FRAMES.landscape}" alt="" aria-hidden="true"><span class="wall-glint"></span></span></div><div class="wd-face wd-back"></div></div></div><div class="wd-plate wd-fade"></div><button type="button" class="wd-flip wd-fade" aria-pressed="false">${lang() === "en" ? "Flip" : "Çevir"}</button></div><div class="wd-stand wd-fade">${STAND}</div></div>` +
            `<div class="wd-body wd-fade"></div></div>` +
            `<button type="button" class="wall-back">${lang() === "en" ? "Back to the wall" : "Duvara dön"}</button>` +
            `<button type="button" class="wall-x" aria-label="${lang() === "en" ? "Close" : "Kapat"}">&times;</button>` +
            `<button type="button" class="wall-nav wall-nav--prev" aria-label="${lang() === "en" ? "Previous" : "Önceki"}">&larr;</button><button type="button" class="wall-nav wall-nav--next" aria-label="${lang() === "en" ? "Next" : "Sonraki"}">&rarr;</button>`;
        document.body.appendChild(det);
        document.documentElement.style.overflow = "hidden";
        if (window.__lenis) window.__lenis.stop();
        fill(a);
        if (push) history.pushState({ wall: i }, "", root.dataset.page + "?p=" + a.dataset.slug);
        det.querySelector(".wall-x").addEventListener("click", () => close(true));
        det.querySelector(".wall-back").addEventListener("click", () => close(true));
        // CSS 3D: fare/dokunmaya göre hafif eğilme ve kart çevirme (ön: çerçeveli eser, arka: bilgi)
        const card = det.querySelector(".wd-card"), flipper = det.querySelector(".wd-flipper"), flipBtn = det.querySelector(".wd-flip");
        let flipped = false;
        flipBtn.addEventListener("click", () => { flipped = !flipped; flipper.classList.toggle("is-flipped", flipped); flipBtn.setAttribute("aria-pressed", flipped); });
        if (!reduce()) {
            const tilt = (e) => {
                const r = card.getBoundingClientRect();
                const nx = Math.max(-1, Math.min(1, (e.clientX - (r.left + r.width / 2)) / (window.innerWidth / 2))), ny = Math.max(-1, Math.min(1, (e.clientY - (r.top + r.height / 2)) / (window.innerHeight / 2)));
                card.style.setProperty("--ty", (nx * 9).toFixed(2) + "deg"); card.style.setProperty("--tx", (-ny * 6).toFixed(2) + "deg");
            };
            det.addEventListener("pointermove", tilt);
            det.addEventListener("pointerleave", () => { card.style.setProperty("--ty", "0deg"); card.style.setProperty("--tx", "0deg"); });
        }
        det.querySelector(".wall-nav--prev").addEventListener("click", () => step(-1));
        det.querySelector(".wall-nav--next").addEventListener("click", () => step(1));
        const frame = det.querySelector(".wall-frame"), bg = det.querySelector(".wd-room"), info = det.querySelectorAll(".wd-fade");
        const src = a.querySelector(".wall-frame");
        const fin = () => { det.classList.add("is-ready"); det.querySelector(".wall-x").focus({ preventScroll: true }); };
        if (instant || reduce()) {
            bg.style.opacity = 1; info.forEach((e) => (e.style.opacity = 1)); fin();
        } else {
            const from = src.getBoundingClientRect();
            src.style.visibility = "hidden";
            requestAnimationFrame(() => {
                bg.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 700, easing: "ease", fill: "both" });
                flip(frame, from, 700);
                const anims = [...info].map((e) => { e.style.opacity = ""; return e.animate([{ opacity: 0, transform: "translateY(12px)" }, { opacity: 1, transform: "none" }], { duration: 500, delay: 450, easing: "ease-out", fill: "both" }); });
                Promise.all(anims.map((x) => x.finished)).then(fin, fin);
            });
        }
    }

    // Önceki / sonraki: görsel ve metin kısa bir solmayla değişir
    function step(d) {
        const n = cur + d; if (!det || n < 0 || n >= arts.length) return;
        arts[cur].querySelector(".wall-frame").style.visibility = "";
        cur = n; goTo(n, false);
        arts[n].querySelector(".wall-frame").style.visibility = "hidden";
        const body = det.querySelector(".wall-detail-in");
        const swap = () => { fill(arts[n]); history.replaceState({ wall: n }, "", root.dataset.page + "?p=" + arts[n].dataset.slug); };
        if (reduce()) { swap(); body.style.opacity = 1; return; }
        body.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 180, fill: "both" }).finished.then(() => { swap(); body.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 260, fill: "both" }); });
    }

    function close(fromUI) {
        if (!det) return;
        if (fromUI && pushed) { history.back(); return; }   // popstate kapatır
        if (fromUI && !pushed) history.replaceState({ pjax: true }, "", root.dataset.page);
        teardown(true);
    }
    function teardown(animate) {
        if (!det) return;
        const d = det, a = arts[cur]; det = null;
        restoreMeta();
        const done = () => {
            d.remove(); if (a) { a.querySelector(".wall-frame").style.visibility = ""; a.focus({ preventScroll: true }); }
            document.documentElement.style.overflow = "";
            if (window.__lenis) window.__lenis.start();
        };
        if (!animate || reduce() || !a) return done();
        const frame = d.querySelector(".wall-frame"), r = a.querySelector(".wall-frame").getBoundingClientRect();
        d.querySelectorAll(".wall-x,.wall-nav,.wall-back,.wd-fade").forEach((e) => (e.style.opacity = 0));
        flip(frame, r, 550, true);
        d.querySelector(".wd-room").animate([{ opacity: 1 }, { opacity: 0 }], { duration: 550, fill: "both" }).finished.then(done, done);
    }

    // Adres çubuğu / geri tuşu
    const fromURL = () => { const p = new URLSearchParams(location.search).get("p"); return p ? arts.findIndex((a) => a.dataset.slug === p) : -1; };
    function onPop() {
        const i = fromURL();
        if (i < 0) { if (det) { pushed = false; teardown(true); } return; }
        if (det) { if (i !== cur) { arts[cur].querySelector(".wall-frame").style.visibility = ""; cur = i; fill(arts[i]); goTo(i, false); arts[i].querySelector(".wall-frame").style.visibility = "hidden"; } } else open(i, false, true);
    }

    function destroy() {
        off.forEach((f) => f()); off = [];
        if (det) { det.remove(); det = null; document.documentElement.style.overflow = ""; if (window.__lenis) window.__lenis.start(); }
        orig = null; root = track = null; arts = [];
    }
    function init() {
        destroy();
        root = document.querySelector("[data-wall]");
        if (!root) return;
        track = root.querySelector(".wall-track");
        arts = [...root.querySelectorAll(".wall-art")];
        if (!track || !arts.length) return;
        bindTrack(); pad(); queue();
        on(window, "popstate", onPop);
        on(window, "keydown", (e) => {
            if (!det) return;
            if (e.key === "Escape") close(true);
            else if (e.key === "ArrowRight") step(1);
            else if (e.key === "ArrowLeft") step(-1);
            else if (e.key === "Tab") { // odak detayın içinde kalsın
                const f = [...det.querySelectorAll("button:not([hidden]), a[href]")]; if (!f.length) return;
                const first = f[0], last = f[f.length - 1];
                if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
                else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
            }
        });
        on(document, "langchange", () => { if (det) fill(arts[cur]); });
        const i = fromURL(); if (i >= 0) { goTo(i, false); open(i, false, true); }
    }

    document.addEventListener("router:navigated", init);
    init();
    return { init, destroy };
})();
