/* ==========================================================================
   Otomatik oynatma (sunum için): sağ altta "Oynat / Duraklat"
   Basınca sayfa film gibi yavaşça kendiliğinden kayar; ana sayfadaki zoom duraklarında
   biraz daha yavaşlar ki başlıklar okunabilsin. Kullanıcı tekerlek, dokunma ya da
   klavyeyle kaydırırsa durur. Sayfa sonunda kendiliğinden durur.
   ========================================================================== */
(function () {
    const root = document.documentElement;
    let btn = null, playing = false, last = 0, y = 0;
    const t = (k, fb) => { try { const v = window.t && window.t(k, root.lang === "en" ? "en" : "tr"); return v && v !== k ? v : fb; } catch (e) { return fb; } };
    const label = () => {
        if (!btn) return;
        const txt = playing ? t("ui.pause", root.lang === "en" ? "Pause" : "Duraklat") : t("ui.play", root.lang === "en" ? "Play" : "Oynat");
        btn.querySelector("span").textContent = txt;
        btn.setAttribute("aria-pressed", playing ? "true" : "false");
        btn.classList.toggle("is-playing", playing);
    };
    function speed() {
        // ekran yüksekliğinin saniyede ~%9'u; durakta yarı hız
        let f = 1;
        const D = document.body.dataset.page === "home" ? window.Dive : window.PageDive;
        if (D && D.stops && D.stops.length) {
            const P = D.progress();
            if (D.stops.some(([a, b]) => P > a - 0.01 && P < b + 0.01)) f = 0.4;
        }
        return innerHeight * 0.09 * f;
    }
    function tick(now) {
        if (!playing) return;
        const dt = Math.min(0.05, (now - last) / 1000); last = now;
        const max = document.documentElement.scrollHeight - innerHeight;
        y = Math.min(max, y + speed() * dt);
        if (window.__lenis) window.__lenis.scrollTo(y, { immediate: true, force: true }); else window.scrollTo(0, y);
        if (y >= max - 1) return stop();
        requestAnimationFrame(tick);
    }
    function play() {
        playing = true; y = window.scrollY; last = performance.now();
        label(); requestAnimationFrame(tick);
    }
    function stop() { playing = false; label(); }
    const userStop = () => { if (playing) stop(); };
    ["wheel", "touchstart"].forEach((e) => addEventListener(e, userStop, { passive: true }));
    addEventListener("keydown", (e) => { if (["ArrowDown", "ArrowUp", "PageDown", "PageUp", " ", "Home", "End"].includes(e.key) && e.target !== btn) userStop(); });

    function mount() {
        if (btn && document.body.contains(btn)) { label(); return; }
        btn = document.createElement("button");
        btn.type = "button";
        btn.className = "autoplay";
        btn.innerHTML = '<i aria-hidden="true"></i><span></span>';
        btn.addEventListener("click", () => (playing ? stop() : play()));
        document.body.appendChild(btn);
        label();
    }
    document.addEventListener("router:navigated", () => { stop(); mount(); });
    document.addEventListener("transition:start", stop);
    document.addEventListener("i18n:changed", label);
    new MutationObserver(label).observe(root, { attributes: true, attributeFilter: ["lang"] });
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount); else mount();
})();
