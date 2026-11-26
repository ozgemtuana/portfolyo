/* ==========================================================================
   Blog görselleri için lightbox: .shot içindeki görsele tıklayınca tam görsel açılır.
   Esc / kapat / arka plana dokunma ile kapanır; ←/→ ve oklarla aynı yazıdaki görseller arasında gezinir.
   aria-modal, odak içeride tutulur ve kapanınca tıklanan görsele döner. Mobilde aşağı kaydırınca kapanır.
   ========================================================================== */
(function () {
    let box = null, list = [], i = 0, opener = null;
    const en = () => document.documentElement.lang === "en";
    const reduce = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

    function show() {
        const img = list[i];
        const big = box.querySelector("img");
        big.src = img.currentSrc || img.src; big.alt = img.alt;
        const cap = img.closest("figure") && img.closest("figure").querySelector("figcaption");
        box.querySelector(".lb-cap").textContent = cap ? cap.textContent.trim() : "";
        box.querySelector(".lb-prev").hidden = i <= 0;
        box.querySelector(".lb-next").hidden = i >= list.length - 1;
    }
    function close() {
        if (!box) return;
        box.remove(); box = null;
        document.documentElement.style.overflow = "";
        if (window.__lenis) window.__lenis.start();
        if (opener) opener.focus({ preventScroll: true });
    }
    function open(img) {
        const post = img.closest("article") || document;
        list = [...post.querySelectorAll(".shot img")]; i = Math.max(0, list.indexOf(img));
        opener = img.closest("a") || img;
        box = document.createElement("div");
        box.className = "lb"; box.setAttribute("role", "dialog"); box.setAttribute("aria-modal", "true");
        box.setAttribute("aria-label", en() ? "Image viewer" : "Görsel görüntüleyici");
        box.innerHTML = `<figure class="lb-fig"><img alt=""><figcaption class="lb-cap"></figcaption></figure>` +
            `<button type="button" class="lb-x" aria-label="${en() ? "Close" : "Kapat"}">×</button>` +
            `<button type="button" class="lb-prev" aria-label="${en() ? "Previous image" : "Önceki görsel"}">←</button>` +
            `<button type="button" class="lb-next" aria-label="${en() ? "Next image" : "Sonraki görsel"}">→</button>`;
        document.body.appendChild(box);
        document.documentElement.style.overflow = "hidden";
        if (window.__lenis) window.__lenis.stop();
        show();
        if (!reduce()) box.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 220, easing: "ease-out" });
        box.querySelector(".lb-x").focus();
        box.addEventListener("click", (e) => {
            if (e.target.closest(".lb-x") || e.target === box) return close();
            if (e.target.closest(".lb-prev")) { i--; show(); }
            if (e.target.closest(".lb-next")) { i++; show(); }
        });
        let y0 = null;
        box.addEventListener("touchstart", (e) => { y0 = e.touches[0].clientY; }, { passive: true });
        box.addEventListener("touchend", (e) => { if (y0 !== null && e.changedTouches[0].clientY - y0 > 90) close(); y0 = null; });
    }
    document.addEventListener("click", (e) => {
        const img = e.target.closest(".shot img");
        if (!img || e.metaKey || e.ctrlKey) return;
        e.preventDefault(); open(img);
    });
    document.addEventListener("keydown", (e) => {
        if (!box) return;
        if (e.key === "Escape") close();
        else if (e.key === "ArrowRight" && i < list.length - 1) { i++; show(); }
        else if (e.key === "ArrowLeft" && i > 0) { i--; show(); }
        else if (e.key === "Tab") {
            const f = [...box.querySelectorAll("button:not([hidden])")];
            const k = f.indexOf(document.activeElement);
            e.preventDefault(); f[(k + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
        }
    });
    document.addEventListener("router:navigated", close);
})();
