/* ==========================================================================
   Kalıcı müzik motoru + her sayfada görünen küçük müzik ikonu
   - Site sayfalar arasında gezinirken tarayıcı sayfayı baştan yüklemez
     (js/router.js yalnızca içeriği değiştirir); bu dosyadaki YouTube oynatıcısı
     sayfa değişse de yerinde kalır, bu yüzden müzik kesilmez.
   - Plak rafı / pikap arayüzü (js/music.js) yalnızca ana sayfadadır ve bu
     motoru yönetir. Motor çalarken her sayfanın sol altında bir "duraklat /
     başlat" ikonu belirir (kapat düğmesi çalmayı bitirir).
   - Şarkılar js/content.js > music listesinden gelir (admin panelinde "Müzik").
   ========================================================================== */

window.Player = (function () {
    // SITE: js/i18n.js'teki birleştirilmiş içerik (admin kaydı + dosyadaki varsayılan)
    const list = ((typeof SITE !== "undefined" && SITE.music) || (window.SITE_CONTENT && window.SITE_CONTENT.music) || []).filter((m) => m && (m.title || m.youtube));
    const state = { index: -1, playing: false, error: false, ended: false };
    const subs = new Set();
    let yt = null, ready = false, pendingPlay = false, apiAsked = false, lastCued = "", volume = 70, host = null;

    const ytId = (v) => {
        const s = String(v || "").trim();
        const m = s.match(/(?:v=|youtu\.be\/|embed\/|shorts\/|live\/)([\w-]{11})/);
        return m ? m[1] : /^[\w-]{11}$/.test(s) ? s : "";
    };
    const coverOf = (m) => (m && (m.cover || (ytId(m.youtube) ? `https://i.ytimg.com/vi/${ytId(m.youtube)}/hqdefault.jpg` : ""))) || "";
    const tr = (key, fb) => { try { if (typeof window.t === "function") { const v = window.t(key); if (v && v !== key) return v; } } catch (e) { /* i18n hazır değil */ } return fb; };

    /* ---------- Durum yayını ---------- */
    const snapshot = () => ({ index: state.index, playing: state.playing, error: state.error, ended: state.ended, track: list[state.index] || null });
    function emit() {
        const s = snapshot();
        subs.forEach((fn) => { try { fn(s); } catch (e) { /* bir abone hata verse de diğerleri çalışsın */ } });
        paintDock();
        mediaSession();
    }
    const on = (fn) => { subs.add(fn); return () => subs.delete(fn); };

    /* ---------- YouTube oynatıcı (görünmez, kalıcı) ---------- */
    function ensure() {
        if (apiAsked) return;
        apiAsked = true;
        host = document.createElement("div");
        host.className = "yt-host";
        host.setAttribute("aria-hidden", "true");
        host.innerHTML = '<div id="ytPlayer"></div>';
        document.body.appendChild(host);
        const prev = window.onYouTubeIframeAPIReady;
        window.onYouTubeIframeAPIReady = () => {
            if (typeof prev === "function") prev();
            yt = new window.YT.Player("ytPlayer", {
                width: 200, height: 200,
                playerVars: { controls: 0, disablekb: 1, playsinline: 1, rel: 0, fs: 0, iv_load_policy: 3, origin: location.origin },
                events: {
                    onReady: () => { ready = true; yt.setVolume(volume); if (pendingPlay) play(); },
                    onStateChange: (e) => {
                        const S = window.YT.PlayerState;
                        if (e.data === S.PLAYING) { state.playing = true; state.error = false; state.ended = false; }
                        else if (e.data === S.PAUSED) { state.playing = false; }
                        else if (e.data === S.ENDED) { state.playing = false; state.ended = true; }
                        emit();
                    },
                    onError: () => { state.playing = false; state.error = true; emit(); }
                }
            });
        };
        const s = document.createElement("script");
        s.src = "https://www.youtube.com/iframe_api";
        s.async = true;
        document.head.appendChild(s);
    }

    /* ---------- Kontroller ---------- */
    // Plağı yükle (çalmadan): arayüz plağı pikaba koyar, ardından play() çağrılır
    function select(i) {
        if (i < 0 || i >= list.length) return;
        state.index = i; state.error = false; state.ended = false; state.playing = false; lastCued = "";
        ensure();
        emit();
    }
    function play(fromStart) {
        if (state.index < 0) return;
        const id = ytId(list[state.index].youtube);
        if (!id) { state.error = true; emit(); return; }
        if (!ready) { pendingPlay = true; ensure(); return; }
        pendingPlay = false;
        const wasEnded = state.ended;
        state.error = false; state.ended = false;
        if (lastCued !== id) { lastCued = id; yt.loadVideoById(id); }
        else { if (fromStart || wasEnded) yt.seekTo(0, true); yt.playVideo(); }
        state.playing = true;
        emit();
    }
    function pause(stop) {
        pendingPlay = false;
        if (yt && ready) { if (stop) { yt.stopVideo(); lastCued = ""; } else yt.pauseVideo(); }
        state.playing = false;
        emit();
    }
    const toggle = () => (state.playing ? pause() : play());
    function restart() {
        if (state.index < 0) return;
        if (ready && lastCued) { yt.seekTo(0, true); yt.playVideo(); state.playing = true; state.ended = false; emit(); }
        else play(true);
    }
    // Plağı tamamen kaldır (ikon da kaybolur)
    function eject() {
        pause(true);
        state.index = -1; state.error = false; state.ended = false;
        emit();
    }
    function seek(frac) { if (yt && ready && state.index >= 0 && yt.getDuration) { const d = yt.getDuration(); if (d) yt.seekTo(clamp(frac) * d, true); } }
    function setVolume(v) { volume = Math.max(0, Math.min(100, +v || 0)); if (yt && ready) yt.setVolume(volume); }
    const clamp = (v) => Math.max(0, Math.min(1, v));
    function progress() {
        if (!yt || !ready || !yt.getDuration) return { cur: 0, dur: 0, frac: 0 };
        const d = yt.getDuration() || 0, c = yt.getCurrentTime() || 0;
        return { cur: c, dur: d, frac: d ? clamp(c / d) : 0 };
    }

    /* ---------- Her sayfada görünen küçük müzik ikonu ---------- */
    let dock = null, dockToggle = null, dockInfo = null, dockTimer = null;
    function buildDock() {
        dock = document.createElement("div");
        dock.className = "music-dock";
        dock.hidden = true;
        dock.innerHTML =
            '<button type="button" class="dock-toggle" data-dock="toggle">' +
                '<span class="dock-eq" aria-hidden="true"><i></i><i></i><i></i><i></i></span>' +
                '<i class="bi bi-pause-fill dock-ico" aria-hidden="true"></i>' +
            '</button>' +
            '<div class="dock-info" aria-live="polite"><small></small><b></b></div>' +
            '<button type="button" class="dock-close" data-dock="close"><i class="bi bi-x-lg" aria-hidden="true"></i></button>';
        document.body.appendChild(dock);
        dockToggle = dock.querySelector(".dock-toggle");
        dockInfo = dock.querySelector(".dock-info");
        dock.addEventListener("click", (e) => {
            const b = e.target.closest("[data-dock]");
            if (!b) return;
            if (b.dataset.dock === "toggle") toggle(); else eject();
        });
        // çalmaya başlarken bir süre açık kalır, sonra yalnızca ikon görünür
        dock.addEventListener("mouseenter", () => dock.classList.add("is-open"));
        dock.addEventListener("mouseleave", () => dock.classList.remove("is-open"));
        dock.addEventListener("focusin", () => dock.classList.add("is-open"));
        dock.addEventListener("focusout", () => dock.classList.remove("is-open"));
    }
    let lastIndex = -2, lastPlaying = null;
    function paintDock() {
        if (!dock) return;
        const has = state.index >= 0;
        dock.hidden = !has;
        if (!has) { lastIndex = -1; lastPlaying = null; return; }
        const m = list[state.index] || {};
        dock.classList.toggle("is-playing", state.playing);
        dock.classList.toggle("has-error", state.error);
        dockToggle.querySelector(".dock-ico").className = "bi bi-" + (state.playing ? "pause" : "play") + "-fill dock-ico";
        const label = state.error ? tr("music.error", "Bu şarkı çalınamıyor") : tr(state.playing ? "music.dock.pause" : "music.dock.play", state.playing ? "Müziği duraklat" : "Müziği başlat");
        dockToggle.setAttribute("aria-label", label);
        dockToggle.title = label;
        dock.querySelector(".dock-close").setAttribute("aria-label", tr("music.dock.close", "Müziği kapat"));
        dock.querySelector(".dock-close").title = tr("music.dock.close", "Müziği kapat");
        dockInfo.querySelector("small").textContent = state.error ? tr("music.error", "Bu şarkı çalınamıyor") : tr(state.playing ? "music.dock.now" : "music.dock.paused", state.playing ? "Çalıyor" : "Duraklatıldı");
        dockInfo.querySelector("b").textContent = [m.title, m.artist].filter(Boolean).join(" · ");
        // yeni şarkıda kısa süre açılıp dikkat çeker
        if (state.index !== lastIndex || (state.playing && lastPlaying === false)) {
            dock.classList.add("is-open");
            clearTimeout(dockTimer);
            dockTimer = setTimeout(() => { if (!dock.matches(":hover, :focus-within")) dock.classList.remove("is-open"); }, 3200);
        }
        lastIndex = state.index; lastPlaying = state.playing;
    }

    /* ---------- Tarayıcı medya denetimleri (kilit ekranı, klavye tuşları) ---------- */
    let msBound = false;
    function mediaSession() {
        if (!("mediaSession" in navigator)) return;
        const m = list[state.index];
        if (!m) { navigator.mediaSession.metadata = null; return; }
        try {
            const art = coverOf(m);
            navigator.mediaSession.metadata = new window.MediaMetadata({ title: m.title || "", artist: m.artist || "", album: m.album || "", artwork: art ? [{ src: new URL(art, location.href).href, sizes: "500x500" }] : [] });
            navigator.mediaSession.playbackState = state.playing ? "playing" : "paused";
            if (!msBound) {
                msBound = true;
                navigator.mediaSession.setActionHandler("play", () => play());
                navigator.mediaSession.setActionHandler("pause", () => pause());
            }
        } catch (e) { /* desteklenmeyen tarayıcı */ }
    }

    document.addEventListener("langchange", paintDock);
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", buildDock); else buildDock();
    // Sekme kapanırken sesi kes
    window.addEventListener("pagehide", () => { try { if (yt && ready) yt.stopVideo(); } catch (e) { /* yoksay */ } });

    return {
        list, state, ytId, coverOf, on, ensure, select, play, pause, toggle, restart, eject, seek, setVolume, progress,
        get volume() { return volume; }
    };
})();
