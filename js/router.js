/* ==========================================================================
   Sayfa yenilemeden gezinme
   İç bir sayfa bağlantısına (ana sayfa, hakkımda, özgeçmiş, projeler, blog,
   iletişim) tıklanınca tarayıcı sayfayı baştan yüklemez:
     1. Geçiş perdesi kapanır (js/transition.js),
     2. hedef sayfanın HTML'i alınır ve yalnızca <main>, alt bilgi ve dosya
        penceresi değiştirilir,
     3. sayfaya özel kodlar yeniden kurulur, perde açılır.
   Kalıcı olanlar hiç yeniden başlamaz: 3D dünya (js/world.js), müzik motoru
   ve müzik ikonu (js/player.js), imleç, kaydırma. Böylece müzik sayfalar
   arasında kesintisiz çalar ve kamera bir sayfadan diğerine süzülür.
   Geri / ileri tuşları, adres çubuğu ve #bağlantılar çalışmaya devam eder.
   Bir sorun olursa (ağ hatası vb.) normal sayfa yüklemesine düşer.
   file:// ile açılınca devre dışıdır (tarayıcı fetch'e izin vermez).
   ========================================================================== */

window.Router = (function () {
    if (location.protocol === "file:" || !window.fetch || !window.DOMParser || !window.history || !history.pushState) return null;

    const FILES = { "index.html": "home", "hakkimda.html": "about", "resume.html": "resume", "projects.html": "projects", "blog.html": "blog", "contact.html": "contact" };
    const cache = new Map();   // adres → HTML metni (üzerine gelince önceden alınır)
    let busy = false;
    let lastURL = new URL(location.href);

    const fileOf = (url) => url.pathname.split("/").pop() || "index.html";
    const keyOf = (url) => FILES[fileOf(url)] || null;
    const samePath = (a, b) => a.pathname.replace(/\/index\.html$/, "/") === b.pathname.replace(/\/index\.html$/, "/");

    // Bu bağlantı sayfa yenilemeden açılabilir mi?
    function target(a, e) {
        if (!a || a.target === "_blank" || a.hasAttribute("download") || a.hasAttribute("data-no-pjax")) return null;
        if (e && (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button > 0)) return null;
        let url;
        try { url = new URL(a.href, location.href); } catch (err) { return null; }
        if (url.origin !== location.origin || !keyOf(url)) return null;
        return url;
    }

    async function fetchHTML(url) {
        const k = url.pathname + url.search;
        if (cache.has(k)) return cache.get(k);
        const r = await fetch(k, { credentials: "same-origin" });
        if (!r.ok) throw new Error("HTTP " + r.status);
        const text = await r.text();
        cache.set(k, text);
        return text;
    }

    // Eski içerik kaldırılır, yenisi yerleştirilir (kalıcı öğelere dokunulmaz)
    function swapContent(doc) {
        const body = document.body;
        const incoming = [doc.querySelector("main"), doc.querySelector("[data-fmodal]"), doc.querySelector("footer.site-footer")].filter(Boolean);
        document.querySelectorAll("main, [data-fmodal], footer.site-footer").forEach((n) => n.remove());
        const anchor = [...body.children].find((n) => n.tagName === "SCRIPT" && n.src);
        incoming.forEach((n) => body.insertBefore(document.importNode(n, true), anchor || null));
        body.dataset.page = doc.body.dataset.page || "";
        body.dataset.title = doc.body.dataset.title || "";
        const md = doc.querySelector('meta[name="description"]'), cur = document.querySelector('meta[name="description"]');
        if (md && cur) cur.setAttribute("content", md.getAttribute("content"));
        document.title = doc.title;
    }

    // Hedef bölüme kaydır; sayfa uzunluğu sonradan değişirse (sabitlenen bölümler, görseller) hedefi tekrar ölç
    function seek(hash, delay, tries = 4) {
        setTimeout(() => {
            let el = null;
            try { el = document.querySelector(hash); } catch (err) { return; }
            if (!el || !window.Site) return;
            if (window.ScrollTrigger) window.ScrollTrigger.refresh();
            window.Site.scrollTo(el, { offset: -80, duration: 1.3 });
            if (tries > 1) setTimeout(() => {
                const top = el.getBoundingClientRect().top;
                if (Math.abs(top - 80) > 60) seek(hash, 0, tries - 1);
            }, 1700);
        }, delay);
    }

    async function go(url, opts = {}) {
        const key = keyOf(url);
        const name = opts.name || "";
        busy = true;
        try {
            const leaving = window.Transition ? window.Transition.leave(key, name) : Promise.resolve();
            const [html] = await Promise.all([fetchHTML(url), leaving]);
            const doc = new DOMParser().parseFromString(html, "text/html");
            if (!doc.querySelector("main")) throw new Error("içerik yok");

            // 1) eski sayfanın kayıtlarını temizle
            if (window.Site) window.Site.destroyPage();
            if (window.MusicUI) window.MusicUI.destroy();
            if (window.Folders) window.Folders.destroy();
            if (window.BlogPage) window.BlogPage.destroy();

            // 2) içeriği değiştir, adresi güncelle, en üste dön
            swapContent(doc);
            if (opts.push !== false) history.pushState({ pjax: true }, "", url.pathname + url.search + url.hash);
            lastURL = new URL(location.href);
            if (!url.hash && window.Site) window.Site.jump(0);

            // 3) yeni içeriği kur
            if (window.I18N_refresh) window.I18N_refresh();      // listeleri bas, dili uygula
            if (window.Folders) window.Folders.init();
            if (window.MusicUI) window.MusicUI.init();            // çalan plak varsa pikapta bulunur
            if (window.BlogPage) window.BlogPage.init();
            if (window.World) window.World.setPage(document.body.dataset.page);
            const ready = window.Transition ? window.Transition.reveal(key, name) : Promise.resolve();
            if (window.Site) window.Site.initPage(ready);
            if (!url.hash && window.Site) window.Site.jump(0); // yeni sayfa en üstten başlar (Lenis yeniden başladıktan sonra tekrar)
            document.dispatchEvent(new CustomEvent("router:navigated", { detail: { page: document.body.dataset.page, url: url.href } }));

            // #bağlantı varsa perde açıldıktan sonra o bölüme kaydır
            if (url.hash) seek(url.hash, 1100);
        } catch (err) {
            // Beklenmeyen durum: normal sayfa yüklemesi (müzik bu durumda kesilir ama site açılır)
            window.location.href = url.href;
            return;
        } finally {
            busy = false;
        }
    }

    document.addEventListener("click", (e) => {
        const a = e.target.closest("a[href]");
        const url = target(a, e);
        if (!url) return;
        if (busy) { e.preventDefault(); return; }
        if (samePath(url, location)) {
            // aynı sayfa: yalnızca #bölüm varsa tarayıcıya bırak, yoksa en üste kaydır
            if (url.hash) return;
            e.preventDefault();
            if (window.Site) window.Site.scrollTo(0, { duration: 1.4 });
            return;
        }
        e.preventDefault();
        go(url, { name: (a.textContent || "").trim() });
    });

    // Üzerine gelince hedef sayfayı önceden al: tıklayınca anında gelsin
    let hoverT = 0;
    document.addEventListener("mouseover", (e) => {
        const a = e.target.closest && e.target.closest("a[href]");
        const url = target(a, null);
        if (!url || samePath(url, location)) return;
        clearTimeout(hoverT);
        hoverT = setTimeout(() => fetchHTML(url).catch(() => {}), 80);
    });
    document.addEventListener("touchstart", (e) => {
        const a = e.target.closest && e.target.closest("a[href]");
        const url = target(a, null);
        if (url && !samePath(url, location)) fetchHTML(url).catch(() => {});
    }, { passive: true });

    // Tarayıcı eski kaydırma konumunu kendi başına geri yüklemesin (içerik değişirken konum yanlış olur)
    try { history.scrollRestoration = "manual"; } catch (err) { /* yoksay */ }

    // Geri / ileri tuşları
    history.replaceState({ pjax: true }, "", location.href);
    window.addEventListener("popstate", () => {
        const url = new URL(location.href);
        if (samePath(url, lastURL)) { lastURL = url; return; } // yalnızca #bölüm değişti
        if (!keyOf(url)) { location.reload(); return; }
        if (busy) { location.reload(); return; }
        go(url, { push: false, name: "" });
    });

    return { go };
})();
