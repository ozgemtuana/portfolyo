/* ==========================================================================
   Fiziksel objeler: kaydırmaya bağlı mürekkep yazısı ve çerçevelerin fareyle eğilmesi
   - [data-ink] şeridindeki kelimeler, şerit ekrana girdikçe soldan sağa sırayla yazılır;
     yukarı kaydırınca geri silinir. Yazılan kelime bir süre ıslak (koyu, parlak) kalır.
   - .gp-item çerçeveleri fareye göre hafifçe döner, ışık çerçevede kayar.
   ========================================================================== */
(function () {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let strips = [], ticking = false;

    function measure() {
        const vh = window.innerHeight;
        strips.forEach((s) => {
            const r = s.el.getBoundingClientRect();
            // şeridin üstü ekranın %92'sinden %38'ine gelene kadar yazılır
            const p = Math.min(1, Math.max(0, (vh * 0.92 - r.top) / (vh * 0.54)));
            const n = s.words.length;
            s.words.forEach((w, i) => {
                const v = reduce ? 1 : Math.min(1, Math.max(0, p * n - i));
                if (v === w._v) return;
                w.style.setProperty("--w", v.toFixed(3));
                if (w._v !== undefined && v > w._v && v < 1) {
                    w.classList.add("is-wet");
                    clearTimeout(w._t);
                    w._t = setTimeout(() => w.classList.remove("is-wet"), 900);
                }
                w._v = v;
                const dot = w.nextElementSibling;
                if (dot && dot.classList.contains("ink-dot")) dot.style.setProperty("--w", v === 1 ? 1 : 0);
            });
        });
        ticking = false;
    }
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(measure); } };

    function tilt(e) {
        const el = e.currentTarget, r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        el.style.setProperty("--ty", ((x - 0.5) * 8).toFixed(2) + "deg");
        el.style.setProperty("--tx", ((0.5 - y) * 6).toFixed(2) + "deg");
        el.style.setProperty("--lx", (x * 100).toFixed(1) + "%");
        el.style.setProperty("--ly", (y * 100).toFixed(1) + "%");
    }
    const untilt = (e) => { ["--tx", "--ty"].forEach((k) => e.currentTarget.style.setProperty(k, "0deg")); };

    function init() {
        strips = [...document.querySelectorAll("[data-ink]")].map((el) => ({ el, words: [...el.querySelectorAll(".ink-word")] }));
        if (!reduce && window.matchMedia("(hover: hover)").matches) {
            // galeri önizlemesi i18n tarafından basıldıktan sonra bağlanır
            requestAnimationFrame(() => document.querySelectorAll(".gp-item").forEach((el) => {
                if (el._tilt) return;
                el._tilt = true;
                el.addEventListener("mousemove", tilt);
                el.addEventListener("mouseleave", untilt);
            }));
        }
        measure();
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    document.addEventListener("router:navigated", init);
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
