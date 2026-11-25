/* ==========================================================================
   Açılış (yalnızca ilk girişte, Ana Sayfa'da) — "Zaman tüneli"
   1) Siyahtan açılır: arkada zaman tüneli videosu (images/intro/time-tunnel.mp4 / .webm), üstünde kahve vinyet + gren.
   2) Ortaya cep saati iner (js/transition.js'teki PocketWatch bileşeni ortak) ve sönümsüz bir sarkaç gibi sallanır.
   3) "Gir": saat yukarı çekilir, video merkeze doğru büyür, altın ışığa dönüp Büyük Galeri'ye
      (Hubert Robert) çözülür; ardından sayfa (Panini dalışı, js/dive.js) açılır.
   "Atla" butonu ve Esc var. Yalnız transform/opacity (Web Animations API). Video yüklenemezse gradyan + saat kalır.
   Hareket azaltılmışsa tünel durağan, geçiş yalnız solma. Bitince video durdurulur ve DOM'dan kaldırılır.
   ========================================================================== */
(function () {
    const S = "images/scenes/";
    const TXT = {
        tr: { over: "Bir portfolyo", enter: "Gir", skip: "Atla" },
        en: { over: "A portfolio", enter: "Enter", skip: "Skip" }
    };
    const SINE = "cubic-bezier(.37,0,.63,1)";
    // Sönümsüz sarkaç: 0 → +26° → 0 → -26° → 0, her aralık sinüs benzeri yumuşak
    const PENDULUM = [0, 0.25, 0.5, 0.75, 1].map((o, i) => ({
        transform: `rotate(${[0, 26, 0, -26, 0][i]}deg)`, offset: o, easing: SINE
    }));
    const HANG = "translateX(-50%)";

    function build(reduce) {
        const t = TXT[document.documentElement.lang === "en" ? "en" : "tr"];
        const hall = Math.min(innerWidth, innerHeight) < 700 ? "hall-1400.webp" : "hall-2560.webp";
        const el = document.createElement("div");
        el.className = "intro";
        el.setAttribute("role", "dialog");
        el.setAttribute("aria-label", t.over + " — Tuana Davarcı");
        el.innerHTML =
            `<div class="intro-zoom"><video class="intro-video" muted loop playsinline preload="auto" aria-hidden="true">` +
                `<source src="images/intro/time-tunnel.webm" type="video/webm"><source src="images/intro/time-tunnel.mp4" type="video/mp4"></video></div>` +
            `<div class="intro-vignette"></div><div class="intro-grain"></div>` +
            `<div class="intro-hall" style="background-image:url(${S}${hall})"></div>` +
            `<div class="intro-light"></div>` +
            window.PocketWatch.html +
            `<div class="intro-copy"><p class="intro-over">${t.over}</p><p class="intro-name"><span>T</span>uana Davarcı</p>` +
            `<button type="button" class="intro-enter">${t.enter}</button></div>` +
            `<button type="button" class="intro-skip">${t.skip}</button>`;
        document.body.appendChild(el);
        const video = el.querySelector("video");
        video.muted = true; // autoplay için özellik olarak da gerekli
        if (reduce) video.removeAttribute("loop");
        return el;
    }

    function play() {
        return new Promise((resolve) => {
            if (!window.PocketWatch) return resolve();
            const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
            const el = build(reduce);
            const q = (s) => el.querySelector(s);
            const video = q("video"), zoom = q(".intro-zoom"), hang = q(".pw-hang"), swing = q(".pw-swing");
            const copy = q(".intro-copy"), hall = q(".intro-hall"), light = q(".intro-light");
            const root = document.documentElement;
            const anims = [];
            const A = (node, frames, opts) => { const a = node.animate(frames, Object.assign({ fill: "forwards" }, opts)); anims.push(a); return a; };
            const wait = (ms) => new Promise((r) => setTimeout(r, ms));
            let state = "idle", settled = false;

            if (window.__lenis) window.__lenis.stop();
            root.style.overflow = "hidden";

            // Video: yüklendikçe solarak görünür; yüklenemezse gradyan arka plan yeter. Donma olmaz (arka planda yüklenir).
            const showVideo = () => { video.classList.add("is-on"); if (reduce) video.pause(); };
            video.addEventListener("loadeddata", showVideo, { once: true });
            const p = video.play(); if (p && p.catch) p.catch(() => {});
            if (video.readyState >= 2) showVideo();

            // Saat iner, sonra sarkaç gibi sallanır
            const dropMs = reduce ? 0 : 1400;
            if (reduce) { hang.style.opacity = 1; hang.style.transform = HANG; }
            else {
                A(hang, [{ transform: HANG + " translateY(-105%)", opacity: 0 }, { transform: HANG, opacity: 1 }],
                    { duration: dropMs, easing: "cubic-bezier(.22,.61,.36,1)", delay: 350 });
                A(swing, PENDULUM, { duration: 7000, delay: 350 + dropMs, iterations: Infinity, fill: "none" });
            }
            A(copy, [{ opacity: 0, transform: "translateY(14px)" }, { opacity: 1, transform: "none" }],
                { duration: 1000, delay: reduce ? 0 : 900, easing: "cubic-bezier(.22,.61,.36,1)" });
            const enterBtn = q(".intro-enter");
            setTimeout(() => enterBtn.focus({ preventScroll: true }), reduce ? 50 : 1900);

            const cleanup = () => {
                if (settled) return; settled = true;
                removeEventListener("keydown", onKey);
                anims.forEach((a) => a.cancel());
                video.pause(); video.removeAttribute("src");
                video.querySelectorAll("source").forEach((s) => s.remove());
                video.load();
                el.remove();
                root.style.overflow = "";
                if (window.__lenis) window.__lenis.start();
            };
            // Çıkış: sayfa açılabilir; kısa solma, sonra DOM'dan kaldır
            const leave = async (fade) => {
                resolve();
                const a = A(el, [{ opacity: 1 }, { opacity: 0 }], { duration: fade, easing: "cubic-bezier(.45,0,.55,1)" });
                await a.finished.catch(() => {});
                cleanup();
            };

            const enter = async () => {
                if (state !== "idle") return; state = "going";
                enterBtn.disabled = true;
                A(copy, [{ opacity: 1 }, { opacity: 0 }], { duration: 400 });
                if (reduce) { await wait(200); state = "done"; return leave(600); }
                // 1) Saat yukarı çekilir (~0,9 sn)
                A(hang, [{ transform: HANG, opacity: 1 }, { transform: HANG + " translateY(-108%)", opacity: 0.9 }],
                    { duration: 900, easing: "cubic-bezier(.5,0,.75,0)" });
                // 2) Video merkeze doğru hızla büyür (1 → 7, ~2,2 sn)
                A(zoom, [{ transform: "scale(1)" }, { transform: "scale(7)" }], { duration: 2200, delay: 300, easing: "cubic-bezier(.55,0,.85,.35)" });
                // 3) Parlak altın ışık yükselir; arkasında Büyük Galeri hazırlanır; ışık sönünce tablo görünür
                A(light, [{ opacity: 0 }, { opacity: 1 }], { duration: 900, delay: 1500, easing: "ease-in" });
                A(hall, [{ opacity: 1, transform: "scale(1.12)" }, { opacity: 1, transform: "scale(1)" }],
                    { duration: 2600, delay: 2400, easing: "cubic-bezier(.22,.61,.36,1)" });
                A(light, [{ opacity: 1 }, { opacity: 0 }], { duration: 900, delay: 2500, easing: "ease-out" });
                await wait(4300); // ışık sönüp Büyük Galeri bir an görünsün
                if (state === "done") return;
                state = "done";
                // 4) Tablodan Panini dalışına: sayfa açılır
                return leave(1000);
            };

            const skip = () => { if (state === "done") return; state = "done"; leave(450); };
            const onKey = (e) => { if (e.key === "Escape") skip(); };
            enterBtn.addEventListener("click", enter);
            q(".intro-skip").addEventListener("click", skip);
            addEventListener("keydown", onKey);
        });
    }

    window.Intro = { play };
})();
