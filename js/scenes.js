/* ==========================================================================
   Proje sahneleri (Projeler sayfası)
   - Anahtar deliği: kaydırdıkça delik büyür, kamera içinden geçer.
   - Deri portfolyo: kapak açılır, kartlar sırayla öne çıkar; ayraçlar bölümler arasında gezdirir.
   - Diğer projeler: her biri kendi sahnesiyle açılır (kubbe, çerçeve, mektup, mücevher kutusu, albüm).
   Varsayılan CSS durumu "açılmış" hâldir; animasyon yalnızca başlangıç durumunu geriye kurar.
   Hareket azaltılmışsa ya da GSAP yoksa her şey açık ve durağan kalır.
   js/router.js sayfa değişince init/destroy çağırır.
   ========================================================================== */

window.Scenes = (function () {
    let mm = null;

    function destroy() {
        if (mm) { mm.revert(); mm = null; }
    }

    function init() {
        destroy();
        const root = document.querySelector("[data-scenes]");
        if (!root) return;
        // Gerçek obje görselleri (public/assets/real) gelene kadar CSS taklidi objeler gösterilmez: yalnızca kart + görsel + yazı
        if (!document.documentElement.classList.contains("real-objects")) { root.classList.add("is-static"); return; }
        if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        gsap.registerPlugin(ScrollTrigger);

        mm = gsap.matchMedia();
        mm.add({ wide: "(min-width: 768px)", narrow: "(max-width: 767.98px)" }, (ctx) => {
            const wide = ctx.conditions.wide;
            root.classList.add("is-live");
            root.classList.toggle("is-narrow", !wide);

            /* ---------- Anahtar deliği + portfolyo ---------- */
            const pfSection = root.querySelector(".scene--portfolio");
            if (pfSection) {
                const q = (s) => pfSection.querySelector(s);
                const cover = q(".kh-cover"), hint = q(".kh-hint"), book = q(".pf-book"), flap = q(".pf-cover");
                const intro = q(".pf-intro");
                const cards = [...pfSection.querySelectorAll(".pf-card")];
                const tabs = [...pfSection.querySelectorAll(".pf-tab")];
                const OPEN_AT = 3, STEP = 1.1, FIRST = 4.4, TOTAL = FIRST + cards.length * STEP + 0.6;

                const tl = gsap.timeline({
                    defaults: { ease: "none" },
                    scrollTrigger: {
                        trigger: pfSection, start: "top top", end: "bottom bottom", scrub: 0.6,
                        onUpdate: () => {
                            const k = Math.min(cards.length - 1, Math.max(-1, Math.floor((tl.time() - FIRST + 0.2) / STEP)));
                            tabs.forEach((t, i) => { t.classList.toggle("is-on", i === k); t.setAttribute("aria-current", i === k ? "true" : "false"); });
                        }
                    }
                });
                tl.fromTo(cover, { scale: 1, opacity: 1, transformOrigin: "50% 46%" }, { scale: 46, duration: 3, ease: "power2.in" }, 0)
                    .fromTo(cover, { opacity: 1 }, { opacity: 0, duration: 0.4 }, 2.7)
                    .fromTo(hint, { opacity: 1 }, { opacity: 0, duration: 0.5 }, 0.2)
                    .fromTo(book, { scale: 0.78, y: 50 }, { scale: 1, y: 0, duration: 3, ease: "power1.out" }, 0)
                    .fromTo(intro, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8 }, 2.4)
                    .fromTo(flap, { rotateY: 0 }, { rotateY: -156, duration: 1.4, ease: "power1.inOut" }, OPEN_AT);
                tl.fromTo(flap, { opacity: 1 }, { opacity: 0, duration: 0.45 }, OPEN_AT + 0.95);
                cards.forEach((c, i) => {
                    tl.fromTo(c, { yPercent: 70, opacity: 0, rotate: i % 2 ? 5 : -5, scale: 0.9 },
                        { yPercent: 0, opacity: 1, rotate: (i - (cards.length - 1) / 2) * 1.6, scale: 1, duration: 1, ease: "power2.out" }, FIRST + i * STEP);
                });
                tl.to({}, { duration: 0.6 }, TOTAL - 0.6);

                tabs.forEach((t, i) => t.addEventListener("click", () => {
                    const st = tl.scrollTrigger;
                    const y = st.start + ((FIRST + i * STEP + 0.8) / TOTAL) * (st.end - st.start);
                    if (window.Site) window.Site.scrollTo(y, { duration: 1.1 }); else window.scrollTo({ top: y, behavior: "smooth" });
                }));
            }

            /* ---------- Diğer sahneler ---------- */
            const build = {
                cloche(s) {
                    const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });
                    tl.fromTo(s.q(".pc-dome"), { yPercent: 0, rotate: 0, opacity: 1 }, { yPercent: -125, rotate: -10, opacity: 0.92, duration: 1.6 }, 0.2)
                        .fromTo(s.q(".pc-glow"), { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 1.4 }, 0.5)
                        .fromTo(s.q(".scene-art"), { scale: 0.86, opacity: 0.2 }, { scale: 1, opacity: 1, duration: 1.2 }, 0.6);
                    return tl;
                },
                frame(s) {
                    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
                    tl.fromTo(s.q(".pfr-frame"), { yPercent: -60, rotateX: -22, opacity: 0, transformOrigin: "50% 0%", transformPerspective: 900 }, { yPercent: 0, rotateX: 0, opacity: 1, duration: 1.3 }, 0)
                        .fromTo(s.q(".pfr-frame"), { rotate: -3 }, { rotate: 0, duration: 1.6, ease: "elastic.out(1,.45)" }, 0.9)
                        .fromTo(s.q(".scene-art img"), { filter: "grayscale(1) brightness(.8)" }, { filter: "grayscale(0) brightness(1)", duration: 1.4, ease: "power1.inOut" }, 0.9);
                    return tl;
                },
                letter(s) {
                    const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });
                    tl.fromTo(s.q(".pl-seal .l"), { x: 0, rotate: 0, opacity: 1 }, { x: -26, y: 8, rotate: -22, opacity: 0, duration: 0.9 }, 0.15)
                        .fromTo(s.q(".pl-seal .r"), { x: 0, rotate: 0, opacity: 1 }, { x: 26, y: 8, rotate: 22, opacity: 0, duration: 0.9 }, 0.15)
                        .fromTo(s.q(".pl-flap"), { rotateX: 0, zIndex: 4 }, { rotateX: 178, zIndex: 0, duration: 1.1, transformOrigin: "50% 0%", transformPerspective: 900 }, 0.6)
                        .fromTo(s.q(".pl-paper"), { yPercent: 18, scale: 0.92 }, { yPercent: -24, scale: 1, duration: 1.4 }, 1.1);
                    return tl;
                },
                jewel(s) {
                    const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });
                    tl.fromTo(s.q(".pj-lid"), { rotateX: 0, opacity: 1 }, { rotateX: -112, opacity: 0.0, duration: 1.3, transformOrigin: "50% 100%", transformPerspective: 900 }, 0.2)
                        .fromTo(s.q(".pj-glow"), { opacity: 0 }, { opacity: 1, duration: 1.2 }, 0.5)
                        .fromTo(s.q(".scene-art"), { yPercent: 38, scale: 0.7, opacity: 0.1 }, { yPercent: -8, scale: 1, opacity: 1, duration: 1.4 }, 0.8);
                    return tl;
                },
                album(s) {
                    const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });
                    tl.fromTo(s.q(".pa-cover"), { rotateY: 0 }, { rotateY: -158, duration: 1.5, transformOrigin: "0% 50%", transformPerspective: 1400 }, 0.2)
                        .fromTo(s.q(".scene-art"), { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 1 }, 0.9);
                    return tl;
                }
            };

            root.querySelectorAll(".scene").forEach((sec) => {
                const type = sec.dataset.scene;
                const label = sec.querySelector(".sc-label");
                const s = { q: (sel) => sec.querySelector(sel) };
                if (type === "portfolio") return;
                const tl = gsap.timeline({ paused: wide ? false : true });
                if (build[type]) tl.add(build[type](s), 0);
                if (label) tl.fromTo(label, { opacity: 0, y: 36 }, { opacity: 1, y: 0, duration: 0.9, ease: "power2.out" }, type === "card" ? 0 : 1.1);
                if (wide && build[type]) {
                    // Sahne ekranda sabit durur, ilerleme kaydırmaya bağlıdır
                    tl.pause();
                    ScrollTrigger.create({
                        trigger: sec, start: "top top", end: "bottom bottom", scrub: 0.6,
                        onUpdate: (self) => tl.progress(self.progress)
                    });
                } else {
                    // Dar ekran / düz kart: görününce bir kez oynat
                    tl.pause();
                    ScrollTrigger.create({ trigger: sec, start: "top 78%", once: true, onEnter: () => tl.play() });
                }
            });

            ScrollTrigger.refresh();
            return () => root.classList.remove("is-live", "is-narrow");
        });
    }

    return { init, destroy };
})();

Scenes.init();
