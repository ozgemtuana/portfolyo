/* ==========================================================================
   Animasyonlar: Lenis (yumuşak kaydırma) + GSAP ScrollTrigger + Three.js
   Kütüphaneler CDN'den gelir; yüklenemezse site animasyonsuz çalışır.
   ========================================================================== */

(function () {
    const root = document.documentElement;
    const hasGSAP = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouch = window.matchMedia("(hover: none)").matches;
    const page = document.body.dataset.page;

    let lenis = null;

    /* ---------- Navbar: aktif sayfa, aşağı kayınca gizlen, yukarı kayınca göster ---------- */
    document.querySelectorAll(".navbar .nav-link").forEach((a) => {
        if (a.dataset.nav === page) {
            a.classList.add("active");
            a.setAttribute("aria-current", "page");
        }
    });
    const nav = document.querySelector(".navbar");
    let lastY = window.scrollY;
    const onScrollNav = () => {
        const y = window.scrollY;
        const menuOpen = document.querySelector(".navbar-collapse.show");
        nav.classList.toggle("scrolled", y > 20);
        nav.classList.toggle("nav-hidden", !menuOpen && y > lastY && y > 300);
        lastY = y;
    };
    window.addEventListener("scroll", onScrollNav, { passive: true });
    onScrollNav();

    // Mobil menüde bağlantıya tıklanınca menüyü kapat
    document.querySelectorAll(".navbar-collapse .nav-link").forEach((a) => {
        a.addEventListener("click", () => {
            const c = document.querySelector(".navbar-collapse.show");
            if (c && window.bootstrap) window.bootstrap.Collapse.getOrCreateInstance(c).hide();
        });
    });

    /* ---------- Yerel saat (hero) ---------- */
    const clockEls = document.querySelectorAll(".local-time");
    if (clockEls.length) {
        const fmt = new Intl.DateTimeFormat("tr-TR", { hour: "2-digit", minute: "2-digit", second: "2-digit", timeZone: "Europe/Istanbul" });
        const tickClock = () => clockEls.forEach((el) => (el.textContent = fmt.format(new Date())));
        tickClock();
        setInterval(tickClock, 1000);
    }

    /* ---------- Butonlar: dolgu imlecin girdiği noktadan başlar ---------- */
    document.querySelectorAll(".btn").forEach((btn) => {
        const setOrigin = (e) => {
            const r = btn.getBoundingClientRect();
            btn.style.setProperty("--x", ((e.clientX - r.left) / r.width) * 100 + "%");
            btn.style.setProperty("--y", ((e.clientY - r.top) / r.height) * 100 + "%");
        };
        btn.addEventListener("mouseenter", setOrigin);
        btn.addEventListener("mouseleave", setOrigin);
    });

    /* ---------- Metin karıştırma (hover) ---------- */
    const GLYPHS = "!<>-_\\/[]{}—=+*^?#ABCDEFXYZ0123456789";
    document.querySelectorAll("[data-scramble]").forEach((el) => {
        let running = false;
        el.addEventListener("mouseenter", () => {
            if (running || el.children.length) return;
            running = true;
            const original = el.textContent;
            let frame = 0;
            const total = 18;
            const step = () => {
                const reveal = Math.floor((frame / total) * original.length);
                el.textContent = original
                    .split("")
                    .map((c, i) => (i < reveal || c === " " ? c : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
                    .join("");
                if (frame++ < total) requestAnimationFrame(step);
                else { el.textContent = original; running = false; }
            };
            step();
        });
    });

    /* ---------- İletişim formu (mailto ile) ---------- */
    const form = document.getElementById("contactForm");
    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            const ok = document.getElementById("submitSuccessMessage");
            const err = document.getElementById("submitErrorMessage");
            ok.classList.add("d-none");
            err.classList.add("d-none");
            form.classList.add("was-validated");
            if (!form.checkValidity()) {
                err.classList.remove("d-none");
                if (hasGSAP) gsap.fromTo(form, { x: -10 }, { x: 0, duration: 0.6, ease: "elastic.out(1, 0.3)" });
                return;
            }
            const v = (id) => document.getElementById(id).value.trim();
            const body = `${v("message")}\n\n— ${v("name")}\n${v("email")}\n${v("phone")}`;
            window.location.href = "mailto:" + PROFILE.email +
                "?subject=" + encodeURIComponent("Portfolyo — " + v("name")) +
                "&body=" + encodeURIComponent(body);
            ok.classList.remove("d-none");
        });
    }

    // "visited" bayrağı ve perde/yükleme ekranı js/transition.js'de yönetilir
    initThree();

    if (!hasGSAP || reduceMotion) return;

    gsap.registerPlugin(ScrollTrigger);
    root.classList.add("js-anim");

    /* ---------- Lenis yumuşak kaydırma ---------- */
    if (typeof window.Lenis !== "undefined") {
        lenis = new Lenis({ duration: 1.2, smoothWheel: true });
        lenis.on("scroll", ScrollTrigger.update);
        gsap.ticker.add((time) => lenis.raf(time * 1000));
        gsap.ticker.lagSmoothing(0);
    }

    document.querySelectorAll('a[href="#top"]').forEach((a) => {
        a.addEventListener("click", (e) => {
            e.preventDefault();
            if (lenis) lenis.scrollTo(0, { duration: 2 });
            else window.scrollTo({ top: 0, behavior: "smooth" });
        });
    });

    /* ---------- Harflere bölme (iç içe <em> korunur) ---------- */
    function splitChars(el) {
        const walk = (node) => {
            [...node.childNodes].forEach((child) => {
                if (child.nodeType === 3) {
                    const frag = document.createDocumentFragment();
                    child.textContent.split(/(\s+)/).forEach((part) => {
                        if (!part) return;
                        if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
                        // Kelimeyi bir arada tut ki satır sonunda bölünmesin
                        const word = document.createElement("span");
                        word.style.display = "inline-block";
                        word.style.whiteSpace = "nowrap";
                        [...part].forEach((c) => {
                            const s = document.createElement("span");
                            s.className = "char";
                            s.textContent = c;
                            word.appendChild(s);
                        });
                        frag.appendChild(word);
                    });
                    child.replaceWith(frag);
                } else if (child.nodeType === 1 && !child.classList.contains("char")) {
                    walk(child);
                }
            });
        };
        walk(el);
        return el.querySelectorAll(".char");
    }

    const heroLines = document.querySelectorAll(".hero-title .line > span");
    let heroChars = [];
    heroLines.forEach((l) => heroChars.push(...splitChars(l)));

    /* ---------- Hero girişi (perde açıldıktan sonra çalışır) ---------- */
    const heroIntro = gsap.timeline({ paused: true, defaults: { ease: "expo.out" } });
    if (heroChars.length) {
        heroIntro.to(heroChars, { y: 0, rotate: 0, duration: 1.4, stagger: 0.03 }, 0);
    }
    const heroReveals = document.querySelectorAll(".hero [data-reveal]");
    if (heroReveals.length) {
        heroIntro.to(heroReveals, { opacity: 1, y: 0, duration: 1.2, stagger: 0.08 }, 0.35);
    }

    /* ---------- Sayfa geçişi (js/transition.js) ---------- */
    // Perde açılırken (bitmeden ~0.5 sn önce) hero girişi başlar
    const pt = window.PageTransition;
    if (pt && pt.ready) pt.ready.then(() => heroIntro.play());
    else heroIntro.play();
    // Geçiş başlayınca kaydırmayı durdur; geri tuşuyla dönülünce yeniden aç
    document.addEventListener("transition:start", () => lenis && lenis.stop());
    window.addEventListener("pageshow", (e) => {
        if (e.persisted && lenis) lenis.start();
    });

    /* ---------- Kaydırma ilerleme çubuğu ---------- */
    gsap.to(".scroll-progress", {
        scaleX: 1,
        ease: "none",
        scrollTrigger: { start: 0, end: "max", scrub: 0.3 }
    });

    // Hero başlığı kaydırınca dağılır
    if (document.querySelector(".hero")) {
        gsap.to(".hero-title .line:nth-child(1)", {
            xPercent: -15, ease: "none",
            scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
        });
        gsap.to(".hero-title .line:nth-child(2)", {
            xPercent: 15, ease: "none",
            scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
        });
        gsap.to(".hero .container", {
            opacity: 0, y: -100, filter: "blur(8px)", ease: "none",
            scrollTrigger: { trigger: ".hero", start: "35% top", end: "bottom top", scrub: true }
        });
    }

    /* ---------- Genel görünme animasyonları ---------- */
    gsap.utils.toArray("[data-reveal]").forEach((el) => {
        if (el.closest(".hero")) return;
        gsap.to(el, {
            opacity: 1, y: 0, duration: 1.2, ease: "expo.out",
            delay: parseFloat(el.dataset.delay || 0),
            scrollTrigger: { trigger: el, start: "top 88%" }
        });
    });

    // Sayfa başlıkları (alt sayfalar) harf harf gelir
    document.querySelectorAll(".page-offset h1").forEach((h) => {
        h.removeAttribute("data-reveal");
        gsap.set(h, { opacity: 1, y: 0 });
        h.style.overflow = "hidden";
        const chars = splitChars(h);
        gsap.from(chars, { yPercent: 110, rotate: 6, duration: 1.3, stagger: 0.025, ease: "expo.out", delay: 0.7 });
    });

    /* ---------- Çizgiler soldan çizilir ---------- */
    gsap.utils.toArray(".rule").forEach((r) => {
        gsap.fromTo(r, { scaleX: 0 }, {
            scaleX: 1, duration: 1.6, ease: "expo.out",
            scrollTrigger: { trigger: r, start: "top 92%" }
        });
    });

    /* ---------- Görseller perdeyle açılır ---------- */
    gsap.utils.toArray(".clip-reveal").forEach((el) => {
        gsap.to(el, {
            clipPath: "inset(0% 0 0 0)", duration: 1.5, ease: "expo.out",
            scrollTrigger: { trigger: el, start: "top 90%" }
        });
    });

    /* ---------- Kayan yazı bantları: kaydırma yönüne ve hızına tepki verir ---------- */
    document.querySelectorAll(".marquee-track").forEach((track) => {
        track.innerHTML += track.innerHTML; // kesintisiz döngü için kopya
        const rev = track.hasAttribute("data-reverse");
        const loop = gsap.fromTo(track, { xPercent: rev ? -50 : 0 }, { xPercent: rev ? 0 : -50, ease: "none", duration: 26, repeat: -1 });
        ScrollTrigger.create({
            trigger: track,
            start: "top bottom",
            end: "bottom top",
            onUpdate: (self) => {
                const v = Math.abs(self.getVelocity() / 250);
                gsap.to(loop, { timeScale: self.direction * Math.max(1, v), duration: 0.3, overwrite: true });
                gsap.to(loop, { timeScale: self.direction, duration: 1, delay: 0.3 });
            }
        });
    });
    gsap.to(".marquee .star", { rotation: 360, duration: 6, ease: "none", repeat: -1 });

    /* ---------- Açıklama metni: kelime kelime aydınlanır ---------- */
    let statementTriggers = [];
    function buildStatement() {
        statementTriggers.forEach((st) => st.kill());
        statementTriggers = [];
        document.querySelectorAll(".statement").forEach((el) => {
            const words = el.textContent.trim().split(/\s+/);
            el.innerHTML = words.map((w) => `<span class="w">${w}</span>`).join(" ");
            const tween = gsap.to(el.querySelectorAll(".w"), {
                color: "#e5d7c4", stagger: 0.1, ease: "none",
                scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 50%", scrub: true }
            });
            statementTriggers.push(tween.scrollTrigger);
        });
    }
    buildStatement();

    /* ---------- Sayaçlar ---------- */
    document.querySelectorAll("[data-count]").forEach((el) => {
        const obj = { v: 0 };
        const end = parseInt(el.dataset.count, 10);
        el.textContent = "0";
        gsap.to(obj, {
            v: end, duration: 2.2, ease: "expo.out",
            scrollTrigger: { trigger: el, start: "top 85%" },
            onUpdate: () => (el.textContent = Math.round(obj.v))
        });
    });

    /* ---------- Yatay kayan proje bölümü (sabitlenir) ---------- */
    const hTrack = document.querySelector(".h-track");
    if (hTrack) {
        const dist = () => hTrack.scrollWidth - window.innerWidth;
        const hTween = gsap.to(hTrack, {
            x: () => -dist(),
            ease: "none",
            scrollTrigger: {
                trigger: ".h-scroll",
                start: "top top",
                end: () => "+=" + dist(),
                pin: true,
                scrub: 1,
                invalidateOnRefresh: true
            }
        });
        hTrack.querySelectorAll(".h-card").forEach((card) => {
            // Görsel ters yönde kayar (paralaks)
            gsap.fromTo(card.querySelector(".thumb > div"), { xPercent: -8 }, {
                xPercent: 8, ease: "none",
                scrollTrigger: { trigger: card, containerAnimation: hTween, start: "left right", end: "right left", scrub: true }
            });
            // Kart ekrana girerken hafif döner ve büyür
            gsap.fromTo(card, { rotate: 4, scale: 0.9 }, {
                rotate: 0, scale: 1, ease: "none",
                scrollTrigger: { trigger: card, containerAnimation: hTween, start: "left right", end: "center center", scrub: true }
            });
        });
    }

    /* ---------- Hizmet satırları sırayla gelir ---------- */
    gsap.utils.toArray(".service-row").forEach((row) => {
        gsap.from(row.children, {
            yPercent: 100, opacity: 0, duration: 1.1, ease: "expo.out", stagger: 0.08,
            scrollTrigger: { trigger: row, start: "top 90%" }
        });
    });

    /* ---------- Kaydırma hızına göre bükülme ---------- */
    const skewTargets = gsap.utils.toArray(".project-tile, .service-row h3, .timeline .card");
    if (skewTargets.length) {
        const skewTo = gsap.quickTo(skewTargets, "skewY", { duration: 0.6, ease: "power3" });
        ScrollTrigger.create({
            onUpdate: (self) => skewTo(gsap.utils.clamp(-5, 5, self.getVelocity() / -350))
        });
    }

    /* ---------- Özgeçmiş: zaman çizelgesi dolar, beceri çubukları uzar ---------- */
    document.querySelectorAll(".timeline").forEach((tl) => {
        gsap.fromTo(tl.querySelector(".tl-fill"), { scaleY: 0 }, {
            scaleY: 1, ease: "none",
            scrollTrigger: { trigger: tl, start: "top 70%", end: "bottom 60%", scrub: true }
        });
    });
    document.querySelectorAll(".skill-bar > i").forEach((bar) => {
        gsap.to(bar, {
            width: getComputedStyle(bar).getPropertyValue("--w"),
            duration: 1.8, ease: "expo.out",
            scrollTrigger: { trigger: bar, start: "top 92%" }
        });
    });
    gsap.utils.toArray(".skill-tag").forEach((tag, i) => {
        gsap.from(tag, {
            scale: 0, rotate: gsap.utils.random(-20, 20), duration: 0.8, ease: "back.out(2)", delay: i * 0.04,
            scrollTrigger: { trigger: tag.parentElement, start: "top 88%" }
        });
    });

    /* ---------- Projeler sayfası: görsel paralaksı ---------- */
    document.querySelectorAll(".project-tile .thumb > div").forEach((img) => {
        gsap.fromTo(img, { yPercent: -8 }, {
            yPercent: 8, ease: "none",
            scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: true }
        });
    });

    /* ---------- Podyum: kâğıt kesimler deri dosyadan yükselir ---------- */
    gsap.utils.toArray("[data-folder]").forEach((folder) => {
        const st = { trigger: folder, start: "top 85%", end: "center 50%", scrub: 1 };
        const cuts = gsap.utils.toArray(folder.querySelectorAll(".cut"));
        const rot = (el) => parseFloat(el.style.getPropertyValue("--r")) || 0;
        const xp = (el) => (el.classList.contains("c-mid") ? -50 : 0);
        gsap.fromTo(cuts,
            { yPercent: 70, xPercent: (i, el) => xp(el), rotation: (i, el) => rot(el) + (i % 2 ? 9 : -9) },
            { yPercent: 0, xPercent: (i, el) => xp(el), rotation: (i, el) => rot(el), ease: "power2.out", stagger: 0.15, scrollTrigger: st });
        gsap.fromTo(folder.querySelector(".sheet"), { yPercent: 18 }, { yPercent: 0, ease: "power2.out", scrollTrigger: st });
    });

    /* ---------- Büyük CTA: kaydırınca büyür ---------- */
    document.querySelectorAll(".cta-big").forEach((el) => {
        gsap.fromTo(el, { scale: 0.75, opacity: 0.2 }, {
            scale: 1, opacity: 1, ease: "none",
            scrollTrigger: { trigger: el, start: "top bottom", end: "center 60%", scrub: true }
        });
    });

    /* ---------- Footer: dev isim ekrana sığar ve harf harf yükselir ---------- */
    const footerName = document.querySelector(".footer-name");
    let footerTween = null;
    function buildFooterName() {
        if (!footerName) return;
        footerName.style.overflow = "hidden";
        // Metnin gerçek genişliğini ölç, ekranın %96'sını dolduracak boyutu hesapla
        footerName.style.fontSize = "100px";
        footerName.style.width = "max-content";
        const ratio = (footerName.parentElement.clientWidth * 0.96) / footerName.offsetWidth;
        footerName.style.width = "";
        footerName.style.fontSize = Math.floor(100 * ratio) + "px";
        if (footerTween) footerTween.scrollTrigger.kill();
        const chars = splitChars(footerName);
        footerTween = gsap.from(chars, {
            yPercent: 100, duration: 1.2, ease: "expo.out", stagger: 0.035,
            scrollTrigger: { trigger: footerName, start: "top 95%" }
        });
    }
    (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => {
        buildFooterName();
        ScrollTrigger.refresh();
    });
    let lastW = window.innerWidth;
    window.addEventListener("resize", () => {
        // Mobilde adres çubuğu da resize tetikler; yalnızca genişlik değişince yeniden kur
        if (!footerName || window.innerWidth === lastW) return;
        lastW = window.innerWidth;
        footerName.textContent = PROFILE.name;
        buildFooterName();
    });

    /* ---------- Dil değişince bölünmüş metinleri yeniden kur ---------- */
    document.addEventListener("langchange", () => {
        heroChars = [];
        heroLines.forEach((l) => heroChars.push(...splitChars(l)));
        gsap.set(heroChars, { y: 0, rotate: 0 });
        document.querySelectorAll(".page-offset h1 .char").length === 0 &&
            document.querySelectorAll(".page-offset h1").forEach((h) => splitChars(h));
        buildStatement();
        buildFooterName();
        ScrollTrigger.refresh();
    });

    /* ---------- Masaüstü: imleç, mıknatıs, 3D eğilen kartlar ---------- */
    if (!isTouch) {
        const cursor = document.querySelector(".cursor");
        if (cursor) {
            const label = cursor.querySelector("span");
            const cx = gsap.quickTo(cursor, "x", { duration: 0.35, ease: "power3" });
            const cy = gsap.quickTo(cursor, "y", { duration: 0.35, ease: "power3" });
            window.addEventListener("mousemove", (e) => {
                document.body.classList.add("cursor-on");
                cx(e.clientX); cy(e.clientY);
            });
            document.addEventListener("mouseleave", () => document.body.classList.remove("cursor-on"));
            document.querySelectorAll("a, button, .service-row, input, textarea").forEach((el) => {
                el.addEventListener("mouseenter", () => {
                    if (el.dataset.cursor) {
                        label.textContent = t("cursor." + el.dataset.cursor);
                        cursor.classList.add("label");
                    } else {
                        cursor.classList.add("hover");
                    }
                });
                el.addEventListener("mouseleave", () => cursor.classList.remove("hover", "label"));
            });
        }

        document.querySelectorAll(".magnetic").forEach((el) => {
            const xTo = gsap.quickTo(el, "x", { duration: 0.8, ease: "elastic.out(1, 0.35)" });
            const yTo = gsap.quickTo(el, "y", { duration: 0.8, ease: "elastic.out(1, 0.35)" });
            el.addEventListener("mousemove", (e) => {
                const r = el.getBoundingClientRect();
                xTo((e.clientX - r.left - r.width / 2) * 0.35);
                yTo((e.clientY - r.top - r.height / 2) * 0.35);
            });
            el.addEventListener("mouseleave", () => { xTo(0); yTo(0); });
        });

        document.querySelectorAll(".tilt").forEach((el) => {
            el.addEventListener("mousemove", (e) => {
                const r = el.getBoundingClientRect();
                const px = (e.clientX - r.left) / r.width;
                const py = (e.clientY - r.top) / r.height;
                el.style.setProperty("--gx", px * 100 + "%");
                el.style.setProperty("--gy", py * 100 + "%");
                gsap.to(el, { rotateY: (px - 0.5) * 14, rotateX: (0.5 - py) * 12, transformPerspective: 900, duration: 0.6, ease: "power3" });
            });
            el.addEventListener("mouseleave", () => {
                gsap.to(el, { rotateY: 0, rotateX: 0, duration: 1, ease: "elastic.out(1, 0.4)" });
            });
        });
    }

    window.addEventListener("load", () => ScrollTrigger.refresh());

    /* ======================================================================
       Three.js: "nefes" sahnesi
       - Arka plan: kayan yaprak gölgeleri (kombu yeşilinden aşağı indikçe kahveye)
       - Hero: 8 sn döngüyle nefes alan damla + aura + genişleyen halkalar
       - Kaydırdıkça damla toprağa düşer, yerinden bir bitki filizlenip büyür;
         sayfanın sonunda tepesinde küçük bir ışık açar
       ====================================================================== */
    function initThree() {
        const canvas = document.getElementById("bg3d");
        if (!canvas || typeof window.THREE === "undefined") return;

        let renderer;
        try {
            renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
        } catch (e) {
            return; // WebGL desteklenmiyor
        }
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, isTouch ? 1.5 : 2));
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.autoClear = false;

        const BREATH = 8; // saniye: 4 al + 4 ver
        const now = () => performance.now() / 1000;
        // CSS nefes göstergesini aynı saate bağla
        document.documentElement.style.setProperty("--breath-delay", -(now() % BREATH) + "s");

        const C = (hex) => new THREE.Color(hex);
        const palette = {
            kombu: C("#191c12"), kombuLit: C("#5a603b"), ochre: C("#888658"),
            coffee: C("#231a12"), coffeeLit: C("#6b5636"),
            moss: C("#5a603b"), mossDeep: C("#2a3219"), sage: C("#a3a878"),
            tan: C("#cfbb99"), bone: C("#e5d7c4"), teak: C("#b8955a")
        };

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
        camera.position.z = 6;

        /* ---------- Arka plan: yaprak gölgeli ışık (tam ekran shader) ---------- */
        const bgScene = new THREE.Scene();
        const bgCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        const bgU = {
            uTime: { value: 0 }, uScroll: { value: 0 },
            uRes: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
            uMouse: { value: new THREE.Vector2() },
            uDeepA: { value: palette.kombu }, uLitA: { value: palette.kombuLit },
            uDeepB: { value: palette.coffee }, uLitB: { value: palette.coffeeLit }
        };
        bgScene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), new THREE.ShaderMaterial({
            uniforms: bgU,
            depthWrite: false,
            vertexShader: `void main() { gl_Position = vec4(position.xy, 0.0, 1.0); }`,
            fragmentShader: `
                uniform float uTime, uScroll;
                uniform vec2 uRes, uMouse;
                uniform vec3 uDeepA, uLitA, uDeepB, uLitB;
                float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
                float noise(vec2 p) {
                    vec2 i = floor(p), f = fract(p);
                    vec2 u = f * f * (3.0 - 2.0 * f);
                    return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
                }
                float fbm(vec2 p) {
                    float v = 0.0, a = 0.5;
                    for (int i = 0; i < 4; i++) { v += a * noise(p); p = p * 2.03 + 17.0; a *= 0.5; }
                    return v;
                }
                void main() {
                    vec2 uv = gl_FragCoord.xy / uRes;
                    vec2 p = (uv - 0.5) * vec2(uRes.x / uRes.y, 1.0);
                    float t = uTime;
                    // Rüzgârda sallanan yaprak gölgeleri: yavaşça bükülen gürültü
                    vec2 sway = vec2(sin(t * 0.35) * 0.08, cos(t * 0.27) * 0.06) + uMouse * 0.04;
                    vec2 q = p * 1.35 + sway + vec2(0.0, uScroll * 1.2);
                    float w = fbm(q * 1.4 - t * 0.04);
                    float n = fbm(q + vec2(w * 1.2, -w) + t * 0.025);
                    float light = smoothstep(0.48, 0.78, n);
                    // ince parlak kenarlar (su altı ışığı gibi)
                    float caustic = smoothstep(0.02, 0.0, abs(n - 0.62)) * 0.35;
                    float mixB = smoothstep(0.25, 1.0, uScroll);
                    vec3 deep = mix(uDeepA, uDeepB, mixB);
                    vec3 lit = mix(uLitA, uLitB, mixB);
                    vec3 col = mix(deep, lit, light * 0.42) + lit * caustic * 0.35;
                    // köşe kararması
                    col *= 1.0 - smoothstep(0.45, 1.25, length(p * vec2(0.8, 1.0)));
                    gl_FragColor = vec4(col, 1.0);
                }
            `
        })));

        /* ---------- Aura (yumuşak ışık halesi) ---------- */
        function makeAura(size, inner, outer) {
            const u = { uI: { value: 1 }, uIn: { value: inner }, uOut: { value: outer } };
            const m = new THREE.Mesh(new THREE.PlaneGeometry(size, size), new THREE.ShaderMaterial({
                uniforms: u, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
                vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
                fragmentShader: `
                    uniform float uI; uniform vec3 uIn, uOut; varying vec2 vUv;
                    void main() {
                        float d = length(vUv - 0.5) * 2.0;
                        float a = pow(max(1.0 - d, 0.0), 2.2);
                        gl_FragColor = vec4(mix(uOut, uIn, a) * a * 0.55 * uI, 1.0);
                    }
                `
            }));
            m.userData.u = u;
            return m;
        }

        /* ---------- Nefes alan damla ---------- */
        const dropRig = new THREE.Group();
        scene.add(dropRig);

        const dGeo = new THREE.SphereGeometry(1, isTouch ? 48 : 96, isTouch ? 48 : 96);
        {
            const pos = dGeo.attributes.position;
            for (let i = 0; i < pos.count; i++) {
                const x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
                // üst yarı sivrilir → su damlası
                const k = Math.pow(Math.max(0, Math.min(1, (y + 0.3) / 1.3)), 1.7);
                const s = 1 - 0.86 * k;
                pos.setXYZ(i, x * s, y * 1.12 + Math.max(0, y) * Math.max(0, y) * 0.35, z * s);
            }
            dGeo.computeVertexNormals();
        }
        const dropU = {
            uTime: { value: 0 }, uBreath: { value: 0 }, uHover: { value: 0 }, uFade: { value: 1 },
            uDeep: { value: palette.mossDeep }, uMoss: { value: palette.ochre },
            uTan: { value: palette.tan }, uBone: { value: palette.bone }
        };
        const drop = new THREE.Mesh(dGeo, new THREE.ShaderMaterial({
            uniforms: dropU, transparent: true,
            vertexShader: `
                uniform float uTime, uBreath, uHover;
                varying vec3 vN; varying vec3 vV; varying float vY;
                void main() {
                    vec3 p = position;
                    float wob = sin(p.y * 5.0 + uTime * 1.4) * sin(p.x * 4.0 + uTime * 1.1) * (0.015 + uHover * 0.05);
                    p += normal * wob;
                    vY = p.y;
                    vec4 mv = modelViewMatrix * vec4(p, 1.0);
                    vV = -mv.xyz;
                    vN = normalize(normalMatrix * normal);
                    gl_Position = projectionMatrix * mv;
                }
            `,
            fragmentShader: `
                uniform float uTime, uBreath, uFade;
                uniform vec3 uDeep, uMoss, uTan, uBone;
                varying vec3 vN; varying vec3 vV; varying float vY;
                void main() {
                    vec3 n = normalize(vN), v = normalize(vV);
                    float fr = pow(1.0 - max(dot(n, v), 0.0), 2.4);
                    vec3 col = mix(uDeep, uMoss, smoothstep(-1.2, 1.4, vY));
                    // içeride yavaşça dönen ışık bandı (kırılma hissi)
                    float band = smoothstep(0.75, 1.0, sin(vY * 3.2 - uTime * 0.6 + n.x * 2.0));
                    col += uTan * band * 0.12;
                    vec3 l = normalize(vec3(-0.45, 0.75, 0.6));
                    float spec = pow(max(dot(n, normalize(l + v)), 0.0), 70.0);
                    col += uTan * fr * (0.85 + uBreath * 0.5) + uBone * spec * 0.9;
                    gl_FragColor = vec4(col, (0.62 + fr * 0.38) * uFade);
                }
            `
        }));
        const dropAura = makeAura(6.5, palette.tan, palette.moss);
        dropAura.position.z = -0.6;
        dropRig.add(dropAura, drop);

        // Genişleyen nefes halkaları (ince çizgi)
        const ringPts = [];
        for (let i = 0; i < 128; i++) {
            const a = (i / 128) * Math.PI * 2;
            ringPts.push(new THREE.Vector3(Math.cos(a), Math.sin(a), 0));
        }
        const ringGeo = new THREE.BufferGeometry().setFromPoints(ringPts);
        const rings = [0, 1, 2].map(() => {
            const r = new THREE.LineLoop(ringGeo, new THREE.LineBasicMaterial({ color: palette.tan, transparent: true, opacity: 0, depthWrite: false }));
            dropRig.add(r);
            return r;
        });

        /* ---------- Bitki: kaydırdıkça büyüyen gövde + yapraklar ---------- */
        const plant = new THREE.Group();
        scene.add(plant);

        const stemCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, -3.8, 0), new THREE.Vector3(0.28, -2.6, 0.1),
            new THREE.Vector3(-0.18, -1.3, -0.1), new THREE.Vector3(0.22, 0, 0.15),
            new THREE.Vector3(-0.12, 1.15, 0), new THREE.Vector3(0.16, 2.1, -0.1),
            new THREE.Vector3(0.02, 2.75, 0)
        ]);
        const TUB = 220, RAD = 8;
        const stemGeo = new THREE.TubeGeometry(stemCurve, TUB, 0.045, RAD, false);
        {
            // gövde yukarı doğru incelir
            const pos = stemGeo.attributes.position;
            const c = new THREE.Vector3(), p = new THREE.Vector3();
            for (let i = 0; i <= TUB; i++) {
                stemCurve.getPointAt(i / TUB, c);
                const taper = 1 - (i / TUB) * 0.75;
                for (let j = 0; j <= RAD; j++) {
                    const k = i * (RAD + 1) + j;
                    p.fromBufferAttribute(pos, k).sub(c).multiplyScalar(taper).add(c);
                    pos.setXYZ(k, p.x, p.y, p.z);
                }
            }
        }
        const plantU = {
            uTime: { value: 0 }, uWind: { value: 0 },
            uBase: { value: palette.mossDeep }, uTip: { value: palette.sage }, uLight: { value: palette.tan }
        };
        const plantVert = `
            uniform float uTime, uWind;
            varying vec2 vUv; varying vec3 vN; varying vec3 vV;
            void main() {
                vUv = uv;
                vec4 wp = modelMatrix * vec4(position, 1.0);
                // rüzgâr: yükseldikçe daha çok sallanır
                float h = clamp(wp.y + 3.0, 0.0, 6.0);
                wp.x += (sin(uTime * 0.9 + wp.y * 0.8) * 0.025 + uWind * 0.05) * h;
                wp.z += cos(uTime * 0.7 + wp.y) * 0.015 * h;
                vec4 mv = viewMatrix * wp;
                vV = -mv.xyz;
                vN = normalize(normalMatrix * normal);
                gl_Position = projectionMatrix * mv;
            }
        `;
        const shadePlant = `
            vec3 shade(vec3 col, vec3 light) {
                vec3 n = normalize(vN), v = normalize(vV);
                if (!gl_FrontFacing) n = -n;
                float d = max(dot(n, normalize(vec3(-0.3, 0.8, 0.6))), 0.0) * 0.6 + 0.4;
                float rim = pow(1.0 - abs(dot(n, v)), 2.0);
                return col * d + light * rim * 0.3;
            }
        `;
        const stem = new THREE.Mesh(stemGeo, new THREE.ShaderMaterial({
            uniforms: plantU,
            vertexShader: plantVert,
            fragmentShader: `
                uniform vec3 uBase, uTip, uLight;
                varying vec2 vUv; varying vec3 vN; varying vec3 vV;
                ${shadePlant}
                void main() { gl_FragColor = vec4(shade(mix(uBase, uTip * 0.8, vUv.x), uLight), 1.0); }
            `
        }));
        stem.geometry.setDrawRange(0, 0);
        plant.add(stem);

        // Yaprak: uzunluğu 1 birim, ortadan katlanmış ve kıvrılmış ızgara
        function leafGeometry() {
            const SU = 22, SV = 8, pos = [], uv = [], idx = [];
            for (let i = 0; i <= SU; i++) {
                const u = i / SU;
                const w = Math.pow(Math.sin(Math.PI * Math.pow(u, 0.75)), 0.9) * 0.3;
                for (let j = 0; j <= SV; j++) {
                    const v = (j / SV) * 2 - 1;
                    pos.push(v * w, u, Math.abs(v) * w * 0.5 - u * u * 0.3);
                    uv.push(u, v);
                }
            }
            for (let i = 0; i < SU; i++) {
                for (let j = 0; j < SV; j++) {
                    const a = i * (SV + 1) + j, b = a + SV + 1;
                    idx.push(a, b, a + 1, b, b + 1, a + 1);
                }
            }
            const g = new THREE.BufferGeometry();
            g.setIndex(idx);
            g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
            g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
            g.computeVertexNormals();
            return g;
        }
        const leafGeo = leafGeometry();
        const leafMat = new THREE.ShaderMaterial({
            uniforms: plantU, side: THREE.DoubleSide,
            vertexShader: plantVert,
            fragmentShader: `
                uniform vec3 uBase, uTip, uLight;
                varying vec2 vUv; varying vec3 vN; varying vec3 vV;
                ${shadePlant}
                void main() {
                    float u = vUv.x, s = abs(vUv.y);
                    vec3 col = mix(uBase, uTip, smoothstep(0.0, 1.0, u));
                    float rib = smoothstep(0.06, 0.0, s) * smoothstep(1.0, 0.2, u);
                    float veins = smoothstep(0.9, 1.0, sin((u * 15.0 - s * 4.0) * 3.14159)) * smoothstep(0.05, 0.3, s);
                    col += uLight * (rib * 0.28 + veins * 0.08);
                    col *= mix(0.78, 1.0, smoothstep(1.0, 0.55, s));
                    gl_FragColor = vec4(shade(col, uLight), 1.0);
                }
            `
        });
        const leaves = [];
        const LEAVES = 15;
        for (let k = 0; k < LEAVES; k++) {
            const at = 0.1 + (k / LEAVES) * 0.84;
            const pivot = new THREE.Group();
            pivot.position.copy(stemCurve.getPointAt(at));
            pivot.rotation.y = k * 2.39996; // altın açı: yapraklar spiral dizilir
            const leaf = new THREE.Mesh(leafGeo, leafMat);
            leaf.rotation.z = -(1.05 - at * 0.45);
            leaf.rotation.x = 0.15;
            const len = (1.05 - at * 0.5) * (0.85 + ((k * 37) % 10) / 40);
            pivot.add(leaf);
            pivot.scale.setScalar(0);
            plant.add(pivot);
            leaves.push({ pivot, at, len, phase: k * 1.7 });
        }
        // Tepede açan ışık
        const bud = makeAura(1.6, palette.bone, palette.teak);
        bud.position.copy(stemCurve.getPointAt(1));
        bud.position.z = 0.1;
        plant.add(bud);

        /* ---------- Polen / spor parçacıkları (GPU'da yükselir) ---------- */
        const count = isTouch ? 160 : 380;
        const pPos = new Float32Array(count * 3), pSeed = new Float32Array(count);
        for (let i = 0; i < count; i++) {
            pPos[i * 3] = (Math.random() - 0.5) * 13;
            pPos[i * 3 + 1] = (Math.random() - 0.5) * 8;
            pPos[i * 3 + 2] = -Math.random() * 5 + 1.5;
            pSeed[i] = Math.random();
        }
        const pGeo = new THREE.BufferGeometry();
        pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
        pGeo.setAttribute("aSeed", new THREE.BufferAttribute(pSeed, 1));
        const pU = { uTime: { value: 0 }, uColor: { value: palette.tan }, uPR: { value: renderer.getPixelRatio() } };
        scene.add(new THREE.Points(pGeo, new THREE.ShaderMaterial({
            uniforms: pU, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
            vertexShader: `
                uniform float uTime, uPR; attribute float aSeed; varying float vA;
                void main() {
                    vec3 p = position;
                    p.y = mod(p.y + uTime * (0.05 + aSeed * 0.08) + 4.0, 8.0) - 4.0;
                    p.x += sin(uTime * 0.3 + aSeed * 12.0) * 0.3;
                    vec4 mv = modelViewMatrix * vec4(p, 1.0);
                    gl_PointSize = (1.5 + aSeed * 3.0) * uPR * (6.0 / -mv.z);
                    vA = (0.25 + 0.5 * aSeed) * (0.6 + 0.4 * sin(uTime * (0.8 + aSeed) + aSeed * 30.0));
                    gl_Position = projectionMatrix * mv;
                }
            `,
            fragmentShader: `
                uniform vec3 uColor; varying float vA;
                void main() {
                    float d = length(gl_PointCoord - 0.5);
                    gl_FragColor = vec4(uColor * smoothstep(0.5, 0.0, d) * vA, 1.0);
                }
            `
        })));

        /* ---------- Sayfaya göre yerleşim ---------- */
        const L = { dropX: 0, dropY: 0, dropS: 1, plantX: 0, plantS: 1 };
        const layout = () => {
            const wide = window.innerWidth > 992;
            const home = page === "home";
            // kameranın z=0 düzleminde gördüğü yarım genişlik
            const halfW = Math.tan(Math.PI / 8) * camera.position.z * camera.aspect;
            L.dropX = Math.min(2.5, halfW - (wide ? 1.4 : 0.55));
            L.dropY = home ? (wide ? 0.25 : 1.45) : (wide ? 0.9 : 1.7);
            L.dropS = (home ? 0.78 : 0.48) * (wide ? 1 : 0.55);
            L.plantX = Math.min(3.45, halfW - (wide ? 0.55 : 0.3));
            L.plantS = wide ? 0.85 : 0.6;
            plant.position.set(L.plantX, -0.15, -0.4);
            plant.scale.setScalar(L.plantS);
        };
        layout();

        const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
        window.addEventListener("mousemove", (e) => {
            mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
            mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
        });
        // Buton/bağlantı üzerindeyken damla daha çok dalgalanır
        let hoverTarget = 0;
        document.addEventListener("mouseover", (e) => (hoverTarget = e.target.closest("a, button") ? 1 : 0));

        let scrollP = 0, lastScrollY = window.scrollY, wind = 0;
        const readScroll = () => {
            const max = document.documentElement.scrollHeight - window.innerHeight;
            scrollP = max > 0 ? window.scrollY / max : 0;
            // kaydırma hızı bitkiye rüzgâr gibi çarpar
            wind = Math.max(-1, Math.min(1, wind + (window.scrollY - lastScrollY) * 0.004));
            lastScrollY = window.scrollY;
        };
        window.addEventListener("scroll", readScroll, { passive: true });
        readScroll();

        window.addEventListener("resize", () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            bgU.uRes.value.set(window.innerWidth, window.innerHeight);
            layout();
        });

        let visible = true;
        document.addEventListener("visibilitychange", () => (visible = !document.hidden));

        const clamp01 = (v) => Math.max(0, Math.min(1, v));
        const easeOutBack = (x) => 1 + 2.2 * Math.pow(x - 1, 3) + 1.2 * Math.pow(x - 1, 2);
        let sp = 0, intro = 0, grown = 0;
        const t0 = now();

        const tick = () => {
            requestAnimationFrame(tick);
            if (!visible) return;
            const t = reduceMotion ? 0 : now();
            mouse.x += (mouse.tx - mouse.x) * 0.05;
            mouse.y += (mouse.ty - mouse.y) * 0.05;
            sp += (scrollP - sp) * 0.08;
            wind *= 0.94;
            plantU.uWind.value += (wind - plantU.uWind.value) * 0.08;
            dropU.uHover.value += (hoverTarget - dropU.uHover.value) * 0.06;
            // açılışta damla yavaşça belirir
            intro = reduceMotion ? 1 : clamp01((now() - t0 - 0.4) / 2.2);

            bgU.uTime.value = t;
            bgU.uScroll.value = sp;
            bgU.uMouse.value.set(mouse.x, mouse.y);
            dropU.uTime.value = plantU.uTime.value = pU.uTime.value = t;

            // Nefes: 0 (verilmiş) → 1 (alınmış)
            const breath = 0.5 - 0.5 * Math.cos((t / BREATH) * Math.PI * 2);
            dropU.uBreath.value = breath;

            // Damla düşüşü: sayfanın ilk %18'inde toprağa iner
            const fall = clamp01(sp / 0.18);
            const fallE = fall * fall;
            const baseY = plant.position.y + stemCurve.points[0].y * L.plantS;
            dropRig.position.x = L.dropX + (L.plantX - L.dropX) * fallE + mouse.x * 0.08;
            dropRig.position.y = L.dropY + (baseY - L.dropY) * fallE - mouse.y * 0.08;
            const ds = L.dropS * (0.93 + breath * 0.1) * (1 - fall * 0.6) * (0.6 + 0.4 * intro);
            drop.scale.setScalar(ds);
            drop.rotation.y = t * 0.15 + mouse.x * 0.4;
            drop.rotation.z = Math.sin(t * 0.5) * 0.05 + (L.plantX - L.dropX) * fall * 0.08;
            const fade = intro * (1 - clamp01((fall - 0.8) / 0.2));
            dropU.uFade.value = fade;
            dropAura.scale.setScalar(ds * (0.85 + breath * 0.35));
            dropAura.userData.u.uI.value = fade * (0.55 + breath * 0.45);
            rings.forEach((r, i) => {
                const f = ((t / BREATH) * 2 + i / 3) % 1;
                r.scale.setScalar(ds * (1.35 + f * 1.9));
                r.material.opacity = fade * (1 - f) * Math.min(1, f * 6) * 0.45;
            });

            // Bitki: alt sayfalarda biraz büyümüş başlar
            const minGrow = page === "home" ? 0 : 0.28 * intro;
            const grow = Math.max(minGrow, clamp01((sp - 0.12) / 0.8));
            grown += (grow - grown) * 0.1;
            stem.geometry.setDrawRange(0, Math.floor(grown * TUB) * RAD * 6);
            leaves.forEach((l) => {
                const g = clamp01((grown - l.at) / 0.07);
                l.pivot.scale.setScalar(g > 0 ? l.len * easeOutBack(g) : 0);
                l.pivot.rotation.z = Math.sin(t * 1.1 + l.phase) * 0.05 * g;
            });
            const bloom = clamp01((grown - 0.94) / 0.06);
            bud.scale.setScalar(bloom * (0.8 + breath * 0.35));
            bud.userData.u.uI.value = bloom;
            plant.rotation.y = mouse.x * 0.25 + Math.sin(t * 0.2) * 0.1;

            camera.position.x = mouse.x * 0.25;
            camera.position.y = -mouse.y * 0.25;
            camera.lookAt(0, 0, 0);

            renderer.clear();
            renderer.render(bgScene, bgCam);
            renderer.render(scene, camera);
        };
        tick();
    }
})();
