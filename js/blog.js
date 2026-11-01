/* ==========================================================================
   Blog sayfası (blog.html)
   - Okuma süresi: yazının sözcük sayısından hesaplanır (dakikada ~180 sözcük)
   - "Bu yazıda" listesi: okunan bölüm vurgulanır
   - Kod blokları: basit renklendirme + "Kopyala" düğmesi
   ========================================================================== */

window.BlogPage = (function () {
    let ac = null, io = null;

    function init() {
    destroy();
    const posts = document.querySelectorAll(".post");
    if (!posts.length) return;
    ac = new AbortController();

    /* ---------- Okuma süresi ---------- */
    const WPM = 180;
    const minutes = {};
    posts.forEach((p) => {
        const words = (p.querySelector(".post-lede").textContent + " " + p.querySelector(".post-text").textContent).trim().split(/\s+/).length;
        minutes[p.id] = Math.max(1, Math.round(words / WPM));
    });
    const paintRead = () => {
        const unit = typeof t === "function" ? t("blog.min") : "dk okuma";
        document.querySelectorAll("[data-read]").forEach((el) => (el.textContent = minutes[el.dataset.read] + " " + unit));
    };
    paintRead();
    document.addEventListener("langchange", paintRead, { signal: ac.signal });

    /* ---------- Okunan bölümü içindekiler listesinde işaretle ---------- */
    if ("IntersectionObserver" in window) {
        const links = new Map();
        document.querySelectorAll(".post-toc a").forEach((a) => links.set(a.getAttribute("href").slice(1), a));
        io = new IntersectionObserver((entries) => {
            entries.forEach((e) => {
                if (!e.isIntersecting) return;
                const a = links.get(e.target.id);
                if (!a) return;
                a.closest(".post-toc").querySelectorAll("a").forEach((x) => x.classList.toggle("is-active", x === a));
            });
        }, { rootMargin: "-25% 0px -65% 0px" });
        links.forEach((_, id) => { const s = document.getElementById(id); if (s) io.observe(s); });
    }

    /* ---------- Kod renklendirme (yorum, metin, anahtar sözcük, sayı, fonksiyon adı) ---------- */
    document.querySelectorAll("pre code.language-js").forEach((code) => {
        const raw = code.textContent;
        code.dataset.raw = raw;
        const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        const rx = /(\/\/[^\n]*)|("[^"\n]*"|'[^'\n]*')|\b(const|let|var|function|return|if|else|new)\b|\b(\d+(?:\.\d+)?)\b|\b([A-Za-zÇĞİÖŞÜçğıöşü_]\w*)(?=\()/g;
        code.innerHTML = esc(raw).replace(rx, (m, c, s, k, n, f) =>
            c ? `<span class="tk-c">${c}</span>` : s ? `<span class="tk-s">${s}</span>` : k ? `<span class="tk-k">${k}</span>` : n ? `<span class="tk-n">${n}</span>` : `<span class="tk-f">${f}</span>`);
    });

    /* ---------- Kodu panoya kopyala ---------- */
    document.querySelectorAll("[data-copy]").forEach((btn) => {
        btn.addEventListener("click", async () => {
            const code = btn.closest(".code-fig").querySelector("code");
            const text = code.dataset.raw || code.textContent;
            let ok = false;
            try { await navigator.clipboard.writeText(text); ok = true; } catch (e) {
                // pano erişimi yoksa metni seç
                const r = document.createRange(); r.selectNodeContents(code);
                const sel = getSelection(); sel.removeAllRanges(); sel.addRange(r);
            }
            const label = btn.querySelector("span");
            const old = label.textContent;
            btn.classList.toggle("is-done", ok);
            label.textContent = ok ? "Kopyalandı" : "Seçildi";
            setTimeout(() => { btn.classList.remove("is-done"); label.textContent = old; }, 1800);
        });
    });
    }

    function destroy() { if (ac) { ac.abort(); ac = null; } if (io) { io.disconnect(); io = null; } }

    return { init, destroy };
})();

BlogPage.init();
