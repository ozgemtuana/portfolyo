/* ==========================================================================
   Deri dosyalar
   - Sayfadaki dosyalar havada süzülür, imlece doğru 3D eğilir.
   - "Tıkla · Aç" mühürüne (ya da dosyanın kendisine) basınca pencere açılır:
     kapak kalkar, içindeki kareler kâğıt gibi dışarı süzülüp yelpaze olur.
   - Oklar / kaydırma / klavye (← → Esc) ile kareler arasında gezilir.
   ========================================================================== */

window.Folders = (function () {
    let ac = null; // bu sayfadaki genel dinleyiciler tek seferde kaldırılır (js/router.js sayfa değiştirir)

    function init() {
    destroy();
    const folders = document.querySelectorAll("[data-folder]");
    const modal = document.querySelector("[data-fmodal]");
    if (!folders.length || !modal) return;
    ac = new AbortController();
    const sig = { signal: ac.signal };

    const hasGSAP = typeof window.gsap !== "undefined";
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouch = window.matchMedia("(hover: none)").matches;
    const animate = hasGSAP && !reduceMotion;

    /* ---------- Mühür yazısı (iki dilli) ---------- */
    const setSealText = () => {
        document.querySelectorAll("[data-seal-text]").forEach((el) => (el.textContent = t("runway.click").repeat(2)));
    };
    setSealText();
    document.addEventListener("langchange", setSealText, sig);

    /* ---------- Süzülme + imlece eğilme ---------- */
    folders.forEach((folder, i) => {
        folder.setAttribute("tabindex", "0");
        folder.setAttribute("role", "button");
        folder.addEventListener("click", (e) => {
            e.preventDefault();
            open(folder);
        });
        folder.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                open(folder);
            }
        });
        if (!animate) return;
        gsap.to(folder, { y: -14, duration: 2.6 + i * 0.35, ease: "sine.inOut", yoyo: true, repeat: -1, delay: i * 0.4 });
        gsap.set(folder, { transformPerspective: 1100 });
        if (isTouch) return;
        const rx = gsap.quickTo(folder, "rotationX", { duration: 0.8, ease: "power3" });
        const ry = gsap.quickTo(folder, "rotationY", { duration: 0.8, ease: "power3" });
        folder.addEventListener("mousemove", (e) => {
            const r = folder.getBoundingClientRect();
            ry(((e.clientX - r.left) / r.width - 0.5) * 16);
            rx((0.5 - (e.clientY - r.top) / r.height) * 12);
        });
        folder.addEventListener("mouseleave", () => { rx(0); ry(0); });
    });

    /* ---------- Pencere ---------- */
    const stage = modal.querySelector("[data-fstage]");
    const papersBox = modal.querySelector("[data-fpapers]");
    const fmFolder = modal.querySelector("[data-ffolder]");
    const cover = modal.querySelector(".fm-cover");
    const bg = modal.querySelector(".fmodal-bg");
    const chrome = modal.querySelectorAll(".fmodal-head, .fmodal-foot");
    let papers = [], focus = 0, current = null, busy = false;

    function open(folder) {
        if (busy || current) return;
        current = folder;
        const items = [...folder.querySelectorAll(".cut img")].map((img) => ({
            src: img.currentSrc || img.src,
            alt: img.alt,
            print: img.closest(".cut").classList.contains("print")
        }));
        // Dosyanın ortasındaki (en büyük) kare yelpazenin ortasına ve öne gelsin.
        // 3'ten fazla görselde sıra bozulmaz; albüm ortadaki karede (yoksa ilkinde) açılır.
        const midIdx = [...folder.querySelectorAll(".cut")].findIndex((c) => c.classList.contains("c-mid"));
        if (items.length <= 3) {
            focus = Math.floor((items.length - 1) / 2);
            if (midIdx >= 0) items.splice(focus, 0, items.splice(midIdx, 1)[0]);
        } else {
            focus = Math.max(0, midIdx);
        }

        const title = folder.querySelector(".folder-title");
        modal.querySelector("[data-fmodal-title]").innerHTML = title ? title.innerHTML : "";
        modal.querySelector("[data-fcover-title]").innerHTML = title ? title.innerHTML : "";
        const meta = folder.querySelector(".folder-meta");
        modal.querySelector("[data-fmodal-meta]").textContent = meta ? meta.textContent : "";
        // Deri rengi sayfadaki dosyayla aynı
        const cs = getComputedStyle(folder);
        ["--leather-a", "--leather-b", "--leather-c"].forEach((v) => fmFolder.style.setProperty(v, cs.getPropertyValue(v)));

        papersBox.innerHTML = "";
        papers = items.map((it, i) => {
            const fig = document.createElement("figure");
            fig.className = "fm-paper" + (it.print ? " print" : "");
            const img = document.createElement("img");
            img.src = it.src;
            img.alt = it.alt;
            img.draggable = false;
            const cap = document.createElement("figcaption");
            cap.textContent = it.alt;
            fig.append(img, cap);
            fig.addEventListener("click", (e) => {
                e.stopPropagation();
                if (i !== focus) go(i);
            });
            papersBox.appendChild(fig);
            return fig;
        });

        modal.hidden = false;
        document.documentElement.style.overflow = "hidden";
        modal.querySelector(".fmodal-x").focus({ preventScroll: true });

        if (!animate) { layout(false); return; }
        busy = true;
        const from = { xPercent: -50, yPercent: -50, x: 0, y: () => window.innerHeight * 0.32, scale: 0.28, rotation: () => gsap.utils.random(-25, 25), opacity: 0 };
        gsap.set(papers, from);
        const tl = gsap.timeline({ onComplete: () => (busy = false) });
        tl.fromTo(bg, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: "power2.out" }, 0)
            .fromTo(chrome, { opacity: 0, y: (i) => (i ? 30 : -30) }, { opacity: 1, y: 0, duration: 0.8, ease: "expo.out" }, 0.25)
            .fromTo(fmFolder, { y: 320, rotationX: 75, scale: 0.8 }, { y: 0, rotationX: 52, scale: 1, duration: 1, ease: "expo.out" }, 0)
            .fromTo(cover, { rotationX: 0 }, { rotationX: 172, duration: 0.9, ease: "power3.inOut" }, 0.55)
            .add(() => layout(true, 0.12), 0.95);
    }

    // Kareleri yelpaze gibi diz: odaktaki önde ve büyük, diğerleri yanlarda
    function layout(withAnim, stagger) {
        const spacing = Math.min(window.innerWidth * 0.26, 320);
        papers.forEach((p, i) => {
            const d = i - focus;
            p.classList.toggle("is-focus", d === 0);
            p.style.zIndex = 100 - Math.abs(d);
            const to = {
                xPercent: -50, yPercent: -50,
                x: d * spacing, y: Math.abs(d) * 26,
                scale: d === 0 ? 1 : 0.66,
                rotation: d * 6,
                opacity: Math.abs(d) > 2 ? 0 : d === 0 ? 1 : 0.88
            };
            if (hasGSAP && withAnim) gsap.to(p, Object.assign({ duration: 1.1, ease: "expo.out", delay: stagger ? Math.abs(d) * stagger : 0, overwrite: true }, to));
            else if (hasGSAP) gsap.set(p, to);
            else p.style.transform = `translate(calc(-50% + ${to.x}px), calc(-50% + ${to.y}px)) rotate(${to.rotation}deg) scale(${to.scale})`;
        });
    }

    function go(i) {
        if (!papers.length) return;
        focus = (i + papers.length) % papers.length;
        layout(true);
    }

    function close() {
        if (!current || busy) return;
        const back = current;
        const done = () => {
            modal.hidden = true;
            papersBox.innerHTML = "";
            papers = [];
            current = null;
            busy = false;
            document.documentElement.style.overflow = "";
            back.focus({ preventScroll: true });
        };
        if (!animate) { done(); return; }
        busy = true;
        gsap.timeline({ onComplete: done })
            .to(papers, { y: window.innerHeight * 0.32, scale: 0.28, x: 0, rotation: () => gsap.utils.random(-20, 20), opacity: 0, duration: 0.6, ease: "power3.in", stagger: 0.05, overwrite: true }, 0)
            .to(cover, { rotationX: 0, duration: 0.6, ease: "power3.inOut" }, 0.35)
            .to(fmFolder, { y: 320, rotationX: 75, scale: 0.8, duration: 0.6, ease: "power3.in" }, 0.75)
            .to(chrome, { opacity: 0, duration: 0.4 }, 0.6)
            .to(bg, { opacity: 0, duration: 0.5 }, 0.85);
    }

    modal.querySelectorAll("[data-fclose]").forEach((b) => b.addEventListener("click", close));
    modal.querySelector("[data-fprev]").addEventListener("click", () => go(focus - 1));
    modal.querySelector("[data-fnext]").addEventListener("click", () => go(focus + 1));
    stage.addEventListener("click", (e) => { if (e.target === stage || e.target === papersBox) close(); });

    document.addEventListener("keydown", (e) => {
        if (!current) return;
        if (e.key === "Escape") close();
        else if (e.key === "ArrowRight") go(focus + 1);
        else if (e.key === "ArrowLeft") go(focus - 1);
        else if (e.key === "Tab") {
            // odağı pencerenin içinde tut
            const f = [...modal.querySelectorAll("button")];
            const idx = f.indexOf(document.activeElement);
            if (e.shiftKey && idx <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
            else if (!e.shiftKey && idx === f.length - 1) { e.preventDefault(); f[0].focus(); }
        }
    }, sig);

    // Dokunmatik: sola / sağa kaydırarak gezin
    let sx = null;
    stage.addEventListener("pointerdown", (e) => (sx = e.clientX));
    stage.addEventListener("pointerup", (e) => {
        if (sx === null) return;
        const dx = e.clientX - sx;
        sx = null;
        if (Math.abs(dx) > 50) go(focus + (dx < 0 ? 1 : -1));
    });

    window.addEventListener("resize", () => current && !busy && layout(false), sig);
    // Pencere açıkken sayfa değişirse kaydırma kilidini kaldır
    ac.signal.addEventListener("abort", () => { document.documentElement.style.overflow = ""; });
    }

    function destroy() { if (ac) { ac.abort(); ac = null; } }

    return { init, destroy };
})();

Folders.init();
