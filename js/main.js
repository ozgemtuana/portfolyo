/* ==========================================================================
   Animasyonlar: Lenis (yumuşak kaydırma) + GSAP ScrollTrigger
   Kütüphaneler CDN'den gelir; yüklenemezse site animasyonsuz çalışır.

   Yapı (js/router.js sayfayı yenilemeden içerik değiştirir):
   - initGlobal(): bir kez çalışır (Lenis, imleç, genel dinleyiciler).
   - initPage(): her sayfa (ve her sayfa geçişi) için içeriğe özel animasyonları kurar.
   - destroyPage(): geçişte eski sayfanın ScrollTrigger / tween kayıtlarını temizler.
   3D dünya js/world.js, müzik js/player.js + js/music.js içindedir.
   ========================================================================== */

(function () {
    const root = document.documentElement;
    const hasGSAP = typeof window.gsap !== "undefined" && typeof window.ScrollTrigger !== "undefined";
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouch = window.matchMedia("(hover: none)").matches;

    let lenis = null;
    let ctx = null;            // etkin sayfanın bağlamı (dil değişince yeniden kurmak için)
    let globalDone = false;

    const GLYPHS = "!<>-_\\/[]{}—=+*^?#ABCDEFXYZ0123456789";

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


    /* ======================================================================
       GENEL (bir kez)
       ====================================================================== */
    function initGlobal() {
        if (globalDone) return;
        globalDone = true;

        // Menü: aşağı kayınca gizlen, yukarı kayınca göster (menü sayfayla birlikte değişir; her seferinde bulunur)
        let lastY = window.scrollY;
        const onScrollNav = () => {
            const nav = document.querySelector(".navbar");
            if (!nav) return;
            const y = window.scrollY;
            const menuOpen = document.querySelector(".navbar-collapse.show");
            nav.classList.toggle("scrolled", y > 20);
            nav.classList.toggle("nav-hidden", !menuOpen && y > lastY && y > 300);
            lastY = y;
        };
        window.addEventListener("scroll", onScrollNav, { passive: true });
        window.__navScroll = onScrollNav;

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
        // Geçiş başlayınca kaydırmayı durdur; yeni sayfa kurulunca initPage yeniden açar
        document.addEventListener("transition:start", () => lenis && lenis.stop());

        /* ---------- Dil değişince bölünmüş metinleri yeniden kur ---------- */
        document.addEventListener("langchange", () => { if (ctx && ctx.rebuild) ctx.rebuild(); });

        /* ---------- Masaüstü: imleç (genel fare dinleyicisi) ---------- */
        if (!isTouch) {
            const cursor = document.querySelector(".cursor");
            if (cursor) {
                const cx = gsap.quickTo(cursor, "x", { duration: 0.35, ease: "power3" });
                const cy = gsap.quickTo(cursor, "y", { duration: 0.35, ease: "power3" });
                window.addEventListener("mousemove", (e) => {
                    document.body.classList.add("cursor-on");
                    cx(e.clientX); cy(e.clientY);
                });
                document.addEventListener("mouseleave", () => document.body.classList.remove("cursor-on"));
            }
        }

        // Mobilde adres çubuğu da resize tetikler; yalnızca genişlik değişince alt isim yeniden kurulur
        let lastW = window.innerWidth;
        window.addEventListener("resize", () => {
            if (!ctx || !ctx.footerName || window.innerWidth === lastW) return;
            lastW = window.innerWidth;
            ctx.footerName.textContent = PROFILE.name;
            ctx.buildFooterName();
        });
        window.addEventListener("load", () => ScrollTrigger.refresh());
    }

    /* ======================================================================
       SAYFA (her sayfa ve her geçiş)
       readyPromise: perde açılırken (bitmeden ~0.5 sn önce) çözülür; hero girişi o an başlar
       ====================================================================== */
    function initPage(readyPromise) {
        const page = document.body.dataset.page;
        const myCtx = (ctx = { page, timers: [] });

        /* ---------- Menü: aktif sayfa ---------- */
        document.querySelectorAll(".navbar .nav-link").forEach((a) => {
            if (a.dataset.nav === page) {
                a.classList.add("active");
                a.setAttribute("aria-current", "page");
            }
        });
        if (window.__navScroll) window.__navScroll();
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
            myCtx.timers.push(setInterval(tickClock, 1000));
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

        if (!hasGSAP || reduceMotion) return;
        if (lenis) lenis.start();

        document.querySelectorAll('a[href="#top"]').forEach((a) => {
            a.addEventListener("click", (e) => {
                e.preventDefault();
                if (lenis) lenis.scrollTo(0, { duration: 2 });
                else window.scrollTo({ top: 0, behavior: "smooth" });
            });
        });

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
        // Perde açılırken (bitmeden ~0.5 sn önce) hero girişi başlar
        if (readyPromise && readyPromise.then) readyPromise.then(() => heroIntro.play());
        else heroIntro.play();

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
                    color: getComputedStyle(el).getPropertyValue("--statement-lit").trim() || "#e5d7c4", stagger: 0.1, ease: "none",
                    scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 50%", scrub: true }
                });
                statementTriggers.push(tween.scrollTrigger);
            });
        }
        buildStatement();

        /* ---------- Güzel sözler: kart yükselir, kelimeler sisten çıkar ---------- */
        let quoteTweens = [];
        function buildQuotes() {
            quoteTweens.forEach((tw) => tw.scrollTrigger && tw.scrollTrigger.kill());
            quoteTweens = [];
            document.querySelectorAll(".quote").forEach((q) => {
                const txt = q.querySelector(".quote-text");
                const words = txt.textContent.trim().split(/\s+/);
                txt.textContent = "";
                words.forEach((w, i) => {
                    const s = document.createElement("span");
                    s.className = "qw";
                    s.textContent = w;
                    txt.append(s, i < words.length - 1 ? " " : "");
                });
                quoteTweens.push(gsap.fromTo(txt.querySelectorAll(".qw"), { opacity: 0, y: 26, filter: "blur(10px)" }, {
                    opacity: 1, y: 0, filter: "blur(0px)", duration: 1.2, ease: "expo.out", stagger: 0.07,
                    scrollTrigger: { trigger: q, start: "top 72%" }
                }));
            });
        }
        gsap.utils.toArray(".quote").forEach((q) => {
            gsap.fromTo(q, { rotateX: 16, y: 90, scale: 0.9, opacity: 0.3, transformPerspective: 1200 }, {
                rotateX: 0, y: 0, scale: 1, opacity: 1, ease: "none",
                scrollTrigger: { trigger: q, start: "top bottom", end: "top 40%", scrub: true }
            });
            gsap.fromTo(q.querySelector(".quote-lily"), { scale: 0.4, rotate: -40, opacity: 0 }, {
                scale: 1, rotate: 0, opacity: 0.75, duration: 1.6, ease: "elastic.out(1, 0.5)",
                scrollTrigger: { trigger: q, start: "top 70%" }
            });
            // içerideki ışık imleci izler
            q.addEventListener("mousemove", (e) => {
                const r = q.getBoundingClientRect();
                q.style.setProperty("--qx", ((e.clientX - r.left) / r.width) * 100 - 25 + "%");
                q.style.setProperty("--qy", ((e.clientY - r.top) / r.height) * 100 - 40 + "%");
            });
        });
        buildQuotes();

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
            if (ctx !== myCtx) return; // bu sırada başka sayfaya geçildiyse
            buildFooterName();
            ScrollTrigger.refresh();
        });


        // Dil değişince bölünmüş metinleri yeniden kur
        myCtx.footerName = footerName;
        myCtx.buildFooterName = buildFooterName;
        myCtx.rebuild = () => {
            heroChars = [];
            heroLines.forEach((l) => heroChars.push(...splitChars(l)));
            gsap.set(heroChars, { y: 0, rotate: 0 });
            document.querySelectorAll(".page-offset h1 .char").length === 0 &&
                document.querySelectorAll(".page-offset h1").forEach((h) => splitChars(h));
            buildStatement();
            buildQuotes();
            buildFooterName();
            ScrollTrigger.refresh();
        };

        /* ---------- Masaüstü: imleç etiketleri, mıknatıs, 3D eğilen kartlar (sayfadaki öğeler) ---------- */
        if (!isTouch) {
            const cursor = document.querySelector(".cursor");
            if (cursor) {
                const label = cursor.querySelector("span");
                cursor.classList.remove("hover", "label");
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

        // Sayfa geçişinden sonra ölçüleri yenile
        requestAnimationFrame(() => ScrollTrigger.refresh());
    }

    /* ======================================================================
       Eski sayfanın animasyon kayıtlarını temizle (içerik değişmeden hemen önce)
       ====================================================================== */
    function destroyPage() {
        if (ctx) ctx.timers.forEach(clearInterval);
        ctx = null;
        if (hasGSAP && !reduceMotion) {
            ScrollTrigger.getAll().forEach((st) => st.kill());
            gsap.globalTimeline.clear(); // eski öğelere bağlı tüm tween'ler (süzülen dosyalar, kayan bantlar...)
        }
    }

    // Belirli bir öğeye / konuma yumuşakça kaydır
    function scrollTo(target, opts) {
        if (lenis) lenis.scrollTo(target, Object.assign({ duration: 1.2 }, opts));
        else if (typeof target === "number") window.scrollTo({ top: target, behavior: "smooth" });
        else if (target && target.scrollIntoView) target.scrollIntoView({ behavior: "smooth" });
    }
    // Anında (animasyonsuz) konum değiştir. html'deki "scroll-behavior: smooth" ve Lenis'in
    // eski konumu geri yüklemesi yüzünden ikisi de elle sıfırlanır.
    function jump(y) {
        const h = document.documentElement;
        h.style.scrollBehavior = "auto";
        window.scrollTo(0, y);
        if (lenis) {
            lenis.resize();
            lenis.start();
            lenis.scrollTo(y, { immediate: true, force: true });
        }
        requestAnimationFrame(() => { window.scrollTo(0, y); h.style.scrollBehavior = ""; });
    }

    window.Site = { initPage, destroyPage, scrollTo, jump };

    initGlobal();
    initPage(window.PageTransition && window.PageTransition.ready);
})();
