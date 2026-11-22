/* ==========================================================================
   Zarf: açılış davetiyesi ve sayfa geçişleri (references/26)
   - Açılış (ilk giriş): ekranı dolduran zeytin yeşili kadife zarf, kapakta krem dantel şerit,
     ortada krem oval kabartma mühür (zambak + TD). "Davetiyeyi aç"a tıklayınca / kaydırınca:
     mühür çatlar ve kırıntılar saçılır → kapak 3D açılır → dantel kenarlı kart kayarak çıkar →
     kart büyüyüp ekranı doldurur → sayfa (Panini galerisi) belirir. Yükleme arkada sessizce sürer.
   - Sayfa geçişi (≤1,2 sn): küçük zarf kayarak gelir, kapak kapanır, mühür basılır (leave);
     yeni sayfada mühür çatlar, kapak açılır, kart büyüyüp sayfa çıkar (reveal).
     Sayfaya göre zarf: yeşil kadife (genel), krem dantelli (Hakkımda), kahve (Projeler), beyaz dalgalı (İletişim).
   - Gerçek görseller (public/assets/real/envelope-green-velvet.jpg, wax-seal-cream-oval.png) varsa onlar kullanılır;
     yoksa kadife dokusu ve mühür kodla üretilir.
   ========================================================================== */
(function () {
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hasGSAP = typeof window.gsap !== "undefined";
    const lang = () => (root.lang === "en" ? "en" : "tr");
    const TXT = {
        tr: { over: "Bir portfolyo", open: "Davetiyeyi aç" },
        en: { over: "A portfolio", open: "Open the invitation" }
    };
    const VARIANT = { about: "cream", projects: "kraft", contact: "white" };
    const variantOf = (key) => VARIANT[key] || "green";

    /* ---------- Mühür (SVG): düzensiz mum kenarı, kabartma oval halka, zambak ve TD ---------- */
    let sid = 0;
    function sealSVG() {
        const id = "es" + (++sid);
        // Mum kenarı: oval + yumuşak dalgalanma (tohumlu, her seferinde aynı)
        let d = "";
        for (let i = 0; i <= 120; i++) {
            const a = (i / 120) * Math.PI * 2;
            const n = 1 + 0.035 * Math.sin(a * 7 + 1.3) + 0.025 * Math.sin(a * 13 + 0.4) + 0.015 * Math.sin(a * 23);
            d += (i ? "L" : "M") + (96 * n * Math.cos(a)).toFixed(2) + " " + (122 * n * Math.sin(a)).toFixed(2);
        }
        const lily = "M0 46V-2M0 -2C-9 -16 -9 -34 0 -50 9 -34 9 -16 0 -2zM0 -2C-16 -10 -27 -22 -30 -38 -12 -34 -3 -22 0 -2zM0 -2C16 -10 27 -22 30 -38 12 -34 3 -22 0 -2zM0 18C-10 14 -18 8 -22 0M0 18C10 14 18 8 22 0";
        const emb = (inner) => `<g transform="translate(1.6 2.2)" stroke="rgba(110,98,74,.42)">${inner}</g><g transform="translate(-1.1 -1.3)" stroke="rgba(255,255,255,.85)">${inner}</g><g stroke="rgba(176,164,138,.55)">${inner}</g>`;
        const motif = `<ellipse rx="70" ry="94" fill="none" stroke-width="3"/><path d="${lily}" fill="none" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" transform="translate(0 -14)"/>`;
        return `<svg viewBox="-120 -150 240 300" aria-hidden="true" focusable="false"><defs>` +
            `<radialGradient id="${id}g" cx="40%" cy="34%" r="75%"><stop offset="0" stop-color="#fffdf7"/><stop offset=".55" stop-color="#f1ece0"/><stop offset="1" stop-color="#d9d1bf"/></radialGradient>` +
            `<filter id="${id}s" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur in="SourceAlpha" stdDeviation="6"/><feOffset dx="3" dy="8"/><feComponentTransfer><feFuncA type="linear" slope=".45"/></feComponentTransfer><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>` +
            `</defs><g filter="url(#${id}s)"><path d="${d}Z" fill="url(#${id}g)"/>` +
            `<path d="${d}Z" fill="none" stroke="rgba(255,255,255,.7)" stroke-width="2" transform="scale(.97)"/>${emb(motif)}` +
            `<g font-family="Cormorant Garamond, serif" font-size="30" text-anchor="middle">` +
            `<text x="1.4" y="72" fill="rgba(110,98,74,.45)">T · D</text><text x="-1" y="69" fill="rgba(255,255,255,.9)">T · D</text><text y="70" fill="rgba(176,164,138,.75)">T · D</text></g></g></svg>`;
    }

    /* ---------- Zarf DOM'u ---------- */
    function buildEnvelope(variant, full) {
        const env = document.createElement("div");
        env.className = `env env--${variant} ${full ? "env--full" : "env--mini"}`;
        env.setAttribute("aria-hidden", "true");
        const seal = sealSVG();
        env.innerHTML =
            `<div class="env-liner"></div>` +
            `<div class="env-card"><div class="env-card-in"></div></div>` +
            `<div class="env-pocket"><i class="env-folds"></i></div>` +
            `<div class="env-flap"><div class="env-flap-front"></div><div class="env-flap-back"></div><i class="env-lace l"></i><i class="env-lace r"></i></div>` +
            `<div class="env-seal"><img class="env-seal-real" src="public/assets/real/wax-seal-cream-oval.png" alt="" onerror="this.remove()">` +
                `<div class="env-half l">${seal}</div><div class="env-half r">${seal}</div><div class="env-crumbs"></div></div>`;
        return env;
    }
    // Dantel şeritleri kapağın iki alt kenarına yerleştir (kenar uzunluğu ve açısı ekrana göre)
    function layout(env) {
        const r = env.getBoundingClientRect();
        const apex = parseFloat(getComputedStyle(env).getPropertyValue("--apex")) / 100 * r.height;
        const half = r.width / 2, L = Math.hypot(half, apex), a = Math.atan2(apex, half) * 180 / Math.PI;
        env.querySelectorAll(".env-lace").forEach((el) => {
            el.style.width = L + "px";
            el.style.transform = el.classList.contains("l") ? `rotate(${a}deg)` : `rotate(${-a}deg)`;
        });
        const folds = env.querySelector(".env-folds");
        const ay = (apex / r.height * 100).toFixed(1);
        folds.style.backgroundImage = `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' preserveAspectRatio='none'><path d='M0 100L50 ${+ay + 8}L100 100' fill='none' stroke='rgba(0,0,0,.22)' stroke-width='.35' vector-effect='non-scaling-stroke'/><path d='M0 100.6L50 ${+ay + 8.6}L100 100.6' fill='none' stroke='rgba(255,255,255,.12)' stroke-width='.35' vector-effect='non-scaling-stroke'/></svg>`)}")`;
    }
    function crumbs(env, n) {
        const box = env.querySelector(".env-crumbs");
        box.innerHTML = "";
        for (let i = 0; i < n; i++) {
            const c = document.createElement("i");
            const s = 3 + Math.random() * 7;
            Object.assign(c.style, { width: s + "px", height: s * (0.6 + Math.random() * 0.6) + "px" });
            box.appendChild(c);
        }
        return [...box.children];
    }

    /* ---------- Açılış ---------- */
    let introEl = null;
    function intro() {
        return new Promise((resolve) => {
            if (reduce || !hasGSAP) return resolve();
            const wrap = document.createElement("div");
            wrap.className = "env-stage env-stage--intro";
            const env = buildEnvelope("green", true);
            const t = TXT[lang()];
            wrap.appendChild(env);
            const copy = document.createElement("div");
            copy.className = "env-copy";
            copy.innerHTML = `<p class="env-over">${t.over}</p><p class="env-name"><span>T</span>uana Davarcı</p>`;
            const btn = document.createElement("button");
            btn.type = "button"; btn.className = "env-open";
            btn.innerHTML = `<span>${t.open}</span><svg viewBox="0 0 200 12" preserveAspectRatio="none" aria-hidden="true"><path d="M3 7c30-4 62-5 96-3s66 2 98-2" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>`;
            wrap.appendChild(copy); wrap.appendChild(btn);
            document.body.appendChild(wrap);
            introEl = wrap;
            layout(env);
            const onResize = () => layout(env);
            addEventListener("resize", onResize);
            gsap.fromTo([copy, btn, env.querySelector(".env-seal")], { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 1.1, ease: "power2.out", stagger: 0.18, delay: 0.15 });

            let opened = false;
            const open = () => {
                if (opened) return; opened = true;
                ["wheel", "touchmove", "keydown"].forEach((e) => removeEventListener(e, onGesture));
                btn.disabled = true;
                const q = (s) => env.querySelector(s);
                const bits = crumbs(env, 14);
                const tl = gsap.timeline({ onComplete: () => { removeEventListener("resize", onResize); wrap.remove(); introEl = null; } });
                window.__envTL = tl;
                tl.to([copy, btn], { opacity: 0, y: -10, duration: 0.45, ease: "power2.in" }, 0)
                    // Mühür çatlar: iki yarım ayrılıp düşer, kırıntılar saçılır
                if (q(".env-seal-real")) tl.to(q(".env-seal-real"), { opacity: 0, duration: 0.2 }, 0);
                tl.to(q(".env-half.l"), { x: -34, y: 26, rotate: -24, duration: 0.75, ease: "power2.in" }, 0.08)
                    .to(q(".env-half.r"), { x: 34, y: 30, rotate: 22, duration: 0.75, ease: "power2.in" }, 0.08)
                    .to(q(".env-seal"), { opacity: 0, duration: 0.3 }, 0.6);
                bits.forEach((b, i) => {
                    const ang = (i / bits.length) * Math.PI * 2 + Math.random() * 0.5, dist = 60 + Math.random() * 110;
                    tl.fromTo(b, { x: 0, y: 0, opacity: 1, rotate: 0 }, { x: Math.cos(ang) * dist, y: Math.sin(ang) * dist * 0.7 + 90, rotate: Math.random() * 360, opacity: 0, duration: 0.9 + Math.random() * 0.4, ease: "power2.out" }, 0.1);
                });
                // Kapak 3D olarak açılır, kart kayarak çıkar, büyür ve ekranı doldurur
                // Kamera geri çekilir: zarf ekranda bir objeye dönüşür, kartın çıkacağı boşluk açılır
                tl.to(env, { scale: 0.58, y: "12vh", duration: 1.1, ease: "power2.inOut" }, 0.3)
                    .to(q(".env-flap"), { rotateX: 178, duration: 0.95, ease: "power2.inOut" }, 0.38)
                    .set(q(".env-flap"), { zIndex: 1 }, 0.86)
                    .to(q(".env-card"), { yPercent: -62, duration: 0.85, ease: "power2.out" }, 1.05)
                    .set(q(".env-card"), { zIndex: 6 }, 1.75)
                    .to(q(".env-card"), { yPercent: -40, scale: 3.4, duration: 0.9, ease: "power3.inOut" }, 1.8)
                    .to([q(".env-pocket"), q(".env-flap"), q(".env-liner")], { opacity: 0, duration: 0.5 }, 1.95)
                    .call(resolve, null, 2.45)
                    .to(wrap, { opacity: 0, duration: 0.7, ease: "power2.inOut" }, 2.45);
            };
            const onGesture = (e) => {
                if (e.type === "keydown" && !["Enter", " ", "ArrowDown", "PageDown"].includes(e.key)) return;
                if (e.type === "wheel" && Math.abs(e.deltaY) < 4) return;
                open();
            };
            btn.addEventListener("click", open);
            env.addEventListener("click", open);
            ["wheel", "touchmove", "keydown"].forEach((e) => addEventListener(e, onGesture, { passive: true }));
            // Sayfa arkada kaymasın
            if (window.__lenis) window.__lenis.stop();
            const unlock = () => { if (window.__lenis) window.__lenis.start(); };
            const done = resolve; resolve = () => { unlock(); done(); };
        });
    }

    /* ---------- Sayfa geçişi ---------- */
    let stage = null;
    function stageFor(key) {
        if (stage) stage.remove();
        stage = document.createElement("div");
        stage.className = "env-stage env-stage--tx";
        const env = buildEnvelope(variantOf(key), false);
        stage.appendChild(env);
        document.body.appendChild(stage);
        layout(env);
        return env;
    }
    // Ayrılış: arka plan kararır, küçük zarf (kapağı açık, içinde kart) kayarak gelir, kapak kapanır, mühür basılır
    function leave(key) {
        return new Promise((resolve) => {
            if (reduce || !hasGSAP) return resolve();
            const env = stageFor(key), q = (s) => env.querySelector(s);
            gsap.set(q(".env-flap"), { rotateX: 178, zIndex: 1 });
            gsap.set(q(".env-seal"), { opacity: 0, scale: 1.8 });
            gsap.set(q(".env-card"), { yPercent: -18 });
            const tl = gsap.timeline();
            tl.fromTo(stage, { opacity: 0 }, { opacity: 1, duration: 0.22, ease: "power1.out" }, 0)
                .fromTo(env, { yPercent: 70, rotate: -6, opacity: 0 }, { yPercent: 0, rotate: -1.5, opacity: 1, duration: 0.32, ease: "power3.out" }, 0)
                .to(q(".env-card"), { yPercent: 0, duration: 0.18, ease: "power2.in" }, 0.2)
                .set(q(".env-flap"), { zIndex: 4 }, 0.3)
                .to(q(".env-flap"), { rotateX: 0, duration: 0.2, ease: "power2.in" }, 0.24)
                .to(q(".env-seal"), { opacity: 1, scale: 1, duration: 0.12, ease: "back.out(3)" }, 0.44)
                .call(resolve, null, 0.56);
        });
    }
    // Varış: mühür çatlar, kapak açılır, kart çıkıp ekranı doldurur, yeni sayfa görünür
    function reveal(key) {
        return new Promise((resolve) => {
            if (reduce || !hasGSAP) { if (stage) stage.remove(); return resolve(); }
            const env = stage && stage.querySelector(".env") ? stage.querySelector(".env") : stageFor(key);
            if (!stage.style.opacity) gsap.set(stage, { opacity: 1 });
            const q = (s) => env.querySelector(s);
            if (!q(".env-seal").style.opacity) { gsap.set(q(".env-flap"), { rotateX: 0, zIndex: 4 }); gsap.set(q(".env-seal"), { opacity: 1 }); }
            const bits = crumbs(env, 6);
            const tl = gsap.timeline({ onComplete: () => { if (stage) { stage.remove(); stage = null; } } });
            tl.to(q(".env-half.l"), { x: -10, y: 8, rotate: -20, opacity: 0, duration: 0.22, ease: "power2.in" }, 0)
                .to(q(".env-half.r"), { x: 10, y: 9, rotate: 18, opacity: 0, duration: 0.22, ease: "power2.in" }, 0);
            bits.forEach((b, i) => tl.fromTo(b, { opacity: 1 }, { x: (i - 2.5) * 14, y: 26 + Math.random() * 20, opacity: 0, duration: 0.35 }, 0.02));
            tl.to(q(".env-flap"), { rotateX: 178, duration: 0.22, ease: "power2.out" }, 0.12)
                .set(q(".env-flap"), { zIndex: 1 }, 0.22)
                .to(q(".env-card"), { yPercent: -55, duration: 0.18, ease: "power2.out" }, 0.28)
                .set(q(".env-card"), { zIndex: 6 }, 0.44)
                .to(q(".env-card"), { scale: 5, yPercent: -30, duration: 0.24, ease: "power2.in" }, 0.44)
                .call(resolve, null, 0.5)
                .to(stage, { opacity: 0, duration: 0.18 }, 0.56);
        });
    }

    window.Envelope = { intro, leave, reveal, variantOf };
})();
