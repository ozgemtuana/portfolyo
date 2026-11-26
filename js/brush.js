/* ==========================================================================
   Boya fırçası imleç ve "ıslak boya" akış haritası
   - Masaüstü: imleç antika bir ressam fırçası (public/assets/real/brush.png; yoksa geçici SVG çizim).
     Fareyi hafif gecikmeyle ve hareket yönüne eğilerek izler; ucu imlecin tam noktasıdır.
   - Fırçanın geçtiği yerde tablo hareket yönünde biraz kayar ve ıslak boya gibi parlar,
     birkaç saniyede eski hâline döner. Bunun için küçük bir akış haritası (canvas) tutulur:
     R/G = hareket yönü, B = ıslaklık. js/dive.js ve js/pagedive.js bu dokuyu shader'da okur.
   - Fırça bir zoom durağının (figürün) üstüne gelince yanında küçük bir müze etiketi belirir
     (js/pagedive.js / js/dive.js window.BrushFlow.hover() ile bildirir).
   - Telefon: imleç yok; dokunulan yerde aynı boya dalgası, daha hafif.
   - Hareket azaltılmışsa: normal imleç, efekt yok.
   ========================================================================== */
(function () {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const N = 128;
    const cv = document.createElement("canvas");
    cv.width = cv.height = N;
    const ctx = cv.getContext("2d");
    ctx.fillStyle = "rgb(128,128,0)"; ctx.fillRect(0, 0, N, N);
    const flow = { canvas: cv, dirty: true, strength: fine ? 1 : 0.6, hover: null };
    window.BrushFlow = flow;

    let mx = -1, my = -1, px = -1, py = -1, last = performance.now();
    function stamp(x, y, vx, vy, amt) {
        // Akış haritasına yumuşak bir fırça izi bırak (görüntü koordinatı → 0..N)
        const u = x / innerWidth * N, v = y / innerHeight * N;
        const r = Math.max(6, Math.min(16, 7 + Math.hypot(vx, vy) * 0.02)) * (N / 128);
        const g = ctx.createRadialGradient(u, v, 0, u, v, r);
        const R = Math.max(0, Math.min(255, 128 + vx * 0.9)), G = Math.max(0, Math.min(255, 128 + vy * 0.9)), B = Math.min(255, 255 * amt);
        g.addColorStop(0, `rgba(${R | 0},${G | 0},${B | 0},.55)`);
        g.addColorStop(1, `rgba(${R | 0},${G | 0},${B | 0},0)`);
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(u, v, r, 0, Math.PI * 2); ctx.fill();
        flow.dirty = true;
    }
    function fade(dt) {
        // Boya birkaç saniyede eski hâline döner: haritayı nötre doğru karıştır
        ctx.fillStyle = `rgba(128,128,0,${Math.min(0.5, dt * 0.9).toFixed(3)})`;
        ctx.fillRect(0, 0, N, N);
        flow.dirty = true;
    }

    /* ---------- Fırça imleç (masaüstü) ---------- */
    let cur = null, cx = -100, cy = -100, ang = -35, label = null;
    if (fine) {
        cur = document.createElement("div");
        cur.className = "brush-cursor";
        cur.setAttribute("aria-hidden", "true");
        cur.innerHTML =
            // Geçici fırça: ahşap sap, pirinç bilezik, kıl uç (uç sol altta = imleç noktası)
            `<svg viewBox="0 0 120 120"><defs><linearGradient id="bw" x1="0" x2="1"><stop offset="0" stop-color="#5a3a1e"/><stop offset=".5" stop-color="#8a5a30"/><stop offset="1" stop-color="#4a2e16"/></linearGradient>` +
            `<linearGradient id="bf" x1="0" x2="1"><stop offset="0" stop-color="#8d7448"/><stop offset=".5" stop-color="#e9d39b"/><stop offset="1" stop-color="#7a6238"/></linearGradient></defs>` +
            `<g transform="rotate(45 60 60)"><rect x="55" y="-6" width="10" height="70" rx="4" fill="url(#bw)"/><rect x="53.5" y="60" width="13" height="16" rx="2" fill="url(#bf)"/>` +
            `<path d="M54 76 C52 92 56 104 60 112 C64 104 68 92 66 76 Z" fill="#2c2015"/><path d="M57 78 C56 92 58 102 60 110" stroke="#5c4632" stroke-width="1" fill="none"/></g></svg>`;
        document.body.appendChild(cur);
        label = document.createElement("div");
        label.className = "brush-label";
        label.setAttribute("aria-hidden", "true");
        document.body.appendChild(label);
        document.documentElement.classList.add("brush-on");
    }
    addEventListener("pointermove", (e) => {
        if (e.pointerType === "touch") return;
        mx = e.clientX; my = e.clientY;
    }, { passive: true });
    addEventListener("pointerdown", (e) => {
        if (e.pointerType !== "touch") return;
        stamp(e.clientX, e.clientY, 0, 0, 0.7);
        mx = px = e.clientX; my = py = e.clientY;
    }, { passive: true });
    addEventListener("touchmove", (e) => {
        const t = e.touches[0]; if (!t) return;
        stamp(t.clientX, t.clientY, (t.clientX - (px < 0 ? t.clientX : px)) * 4, (t.clientY - (py < 0 ? t.clientY : py)) * 4, 0.45);
        px = t.clientX; py = t.clientY;
    }, { passive: true });
    document.addEventListener("mouseleave", () => { mx = my = -1; if (cur) cur.style.opacity = "0"; });

    function tick(now) {
        requestAnimationFrame(tick);
        const dt = Math.min(0.05, (now - last) / 1000); last = now;
        fade(dt);
        if (mx >= 0) {
            const vx = px < 0 ? 0 : (mx - px) / Math.max(dt, 0.008), vy = py < 0 ? 0 : (my - py) / Math.max(dt, 0.008);
            const sp = Math.hypot(vx, vy);
            if (sp > 30) stamp(mx, my, vx * 0.06, vy * 0.06, Math.min(1, sp / 1400) * flow.strength);
            px = mx; py = my;
            if (cur) {
                // Hafif gecikme + harekete göre eğilme
                const k = 1 - Math.exp(-dt * 18);
                cx += (mx - cx) * k; cy += (my - cy) * k;
                const target = -35 + Math.max(-18, Math.min(18, vx * 0.012));
                ang += (target - ang) * (1 - Math.exp(-dt * 8));
                cur.style.opacity = "1";
                cur.style.transform = `translate3d(${cx.toFixed(1)}px, ${cy.toFixed(1)}px, 0) rotate(${(ang + 35).toFixed(1)}deg)`;
                const h = flow.hover;
                if (h && h.text) {
                    label.textContent = h.text; label.classList.add("is-on");
                    label.style.transform = `translate3d(${(cx + 26).toFixed(0)}px, ${(cy + 18).toFixed(0)}px, 0)`;
                } else label.classList.remove("is-on");
            }
        }
    }
    requestAnimationFrame(tick);
})();
