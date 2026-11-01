/* ==========================================================================
   Dinlediklerim: plak rafı + vintage pikap (yalnızca ana sayfada)
   - Plak kılıfları iç bükey 3D bir yay üzerinde yavaşça döner; sürükleyerek
     (fare / parmak) çevrilir, imlecin yakınındaki kılıf öne çıkar.
   - Bir kılıfa tıkla ya da aşağı sürükleyip pikaba bırak: plak kılıftan çıkar,
     pikaba uçar, ton kolu iner, plak döner ve şarkı çalar.
   - Kontroller: çal / duraklat, baştan çal, çıkar, ilerleme çubuğu, ses.
   - Ses js/player.js içindeki KALICI oynatıcıdan gelir: başka sayfaya geçince
     müzik çalmaya devam eder, ana sayfaya dönünce plak pikapta çalmaya devam
     ederken bulunur. Bu dosya yalnızca arayüzdür.
   - js/router.js sayfayı değiştirirken MusicUI.destroy() / MusicUI.init() çağırır.
   ========================================================================== */

window.MusicUI = (function () {
    let ui = null; // etkin arayüz örneği

    function init() {
        destroy();
        const section = document.querySelector(".music");
        const P = window.Player;
        if (!section || !P) return;
        const list = P.list;
        const shelf = section.querySelector("[data-shelf]");
        const ring = section.querySelector("[data-ring]");
        if (!list.length) { section.hidden = true; return; }

        const ac = new AbortController(); // bu sayfadaki tüm dinleyiciler tek seferde kaldırılır
        const sig = { signal: ac.signal };
        const timers = new Set();
        const later = (fn, ms) => { const id = setTimeout(() => { timers.delete(id); fn(); }, ms); timers.add(id); return id; };
        let alive = true, raf = 0;

        const hasGSAP = typeof window.gsap !== "undefined";
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const $ = (s) => section.querySelector(s);
        const turntable = $("[data-turntable]");
        const platter = $(".tt-platter");
        const record = $("[data-record]");
        const arm = $("[data-arm]");
        const led = $("[data-led]");
        const npTitle = $("[data-np-title]");
        const npArtist = $("[data-np-artist]");
        const npCover = $("[data-np-cover]");
        const npCur = $("[data-np-cur]");
        const npDur = $("[data-np-dur]");
        const npBar = $("[data-np-bar]");
        const btnToggle = $('[data-act="toggle"]');
        const btnRestart = $('[data-act="restart"]');
        const btnEject = $('[data-act="eject"]');
        const vol = $("[data-vol]");
        vol.value = P.volume;

        const coverOf = P.coverOf;
        // Tam adres: CSS değişkenindeki göreli yol stil dosyasına göre çözülmesin
        const cssUrl = (u) => (u ? `url("${new URL(u, location.href).href.replace(/"/g, "%22")}")` : "none");

        /* ---------- Kılıfları oluştur ---------- */
        const sleeves = list.map((m, i) => {
            const el = document.createElement("div");
            el.className = "sleeve";
            el.setAttribute("role", "option");
            el.dataset.i = i;
            const cover = cssUrl(coverOf(m));
            const disc = document.createElement("div");
            disc.className = "sleeve-disc vinyl";
            disc.style.setProperty("--cover", cover);
            const face = document.createElement("div");
            face.className = "sleeve-face";
            face.style.backgroundImage = cover;
            const spine = document.createElement("div");
            spine.className = "sleeve-spine";
            spine.append(m.title || "", Object.assign(document.createElement("small"), { textContent: m.artist || "" }));
            const back = document.createElement("div");
            back.className = "sleeve-back";
            const title = document.createElement("div");
            title.className = "sleeve-title";
            title.append(m.title || "", Object.assign(document.createElement("small"), { textContent: m.artist || "" }));
            el.append(disc, face, spine, back, title);
            el.setAttribute("aria-label", `${m.title || ""} — ${m.artist || ""}`);
            ring.appendChild(el);
            return { el, disc, pop: 0 };
        });

        /* ---------- Yay düzeni ---------- */
        const N = sleeves.length;
        let pos = 0, vel = 0, size = 200;
        let hovering = false, mouseX = -1e4;
        const STEP = 15; // derece
        const VIS = Math.min(N / 2, 6);
        const measure = () => (size = sleeves[0].el.offsetWidth || 200);
        measure();
        window.addEventListener("resize", measure, sig);

        const wrap = (d) => {
            d = ((d % N) + N) % N;
            return d > N / 2 ? d - N : d;
        };
        function layout() {
            const R = size * 3.1;
            let front = -1, best = 9;
            sleeves.forEach((s, i) => {
                const d = wrap(i - pos);
                const a = -d * STEP;
                const vis = Math.abs(d) <= VIS;
                // imlece yakın kılıf öne çıkar
                let target = 0;
                if (hovering && vis) {
                    const r = s.el.getBoundingClientRect();
                    const dx = Math.abs(r.left + r.width / 2 - mouseX);
                    target = Math.max(0, 1 - dx / (size * 0.85));
                }
                s.pop += (target - s.pop) * 0.12;
                s.el.style.transform = `translateZ(${R}px) rotateY(${a}deg) translateZ(${-R + s.pop * 70}px) translateY(${-s.pop * 14}px)`;
                s.el.style.opacity = vis ? Math.min(1, VIS + 0.6 - Math.abs(d)) : 0;
                s.el.style.visibility = vis ? "" : "hidden";
                s.el.classList.toggle("is-near", s.pop > 0.55);
                if (Math.abs(d) < best) { best = Math.abs(d); front = i; }
            });
            sleeves.forEach((s, i) => s.el.classList.toggle("is-front", i === front && best < 0.35));
        }

        /* ---------- Sürükleme: çevir ya da plağı pikaba taşı ---------- */
        let drag = null;
        const pxPerItem = () => size * 0.9;
        shelf.addEventListener("pointerdown", (e) => {
            if (e.button !== 0) return;
            const sl = e.target.closest(".sleeve");
            drag = { x: e.clientX, y: e.clientY, pos, lastX: e.clientX, lastT: performance.now(), mode: null, i: sl ? +sl.dataset.i : -1, type: e.pointerType, id: e.pointerId };
            vel = 0;
        }, sig);
        window.addEventListener("pointermove", (e) => {
            if (shelf.contains(e.target) || e.target === shelf) { hovering = e.pointerType === "mouse"; mouseX = e.clientX; }
            if (!drag || e.pointerId !== drag.id) return;
            const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
            if (!drag.mode) {
                if (Math.abs(dx) > 6 && Math.abs(dx) > Math.abs(dy)) {
                    drag.mode = "spin";
                    shelf.classList.add("is-dragging");
                    try { shelf.setPointerCapture(e.pointerId); } catch (err) { /* yoksay */ }
                } else if (drag.type === "mouse" && dy > 14 && dy > Math.abs(dx) && drag.i >= 0 && !busy) {
                    drag.mode = "carry";
                    startCarry(drag.i, e);
                }
            }
            if (drag.mode === "spin") {
                pos = drag.pos - dx / pxPerItem();
                const nt = performance.now();
                vel = (-(e.clientX - drag.lastX) / pxPerItem()) / Math.max(1, nt - drag.lastT) * 1000;
                drag.lastX = e.clientX; drag.lastT = nt;
            } else if (drag.mode === "carry") {
                moveCarry(e);
            }
        }, sig);
        window.addEventListener("pointerup", (e) => {
            if (!drag || e.pointerId !== drag.id) return;
            const d = drag;
            drag = null;
            shelf.classList.remove("is-dragging");
            if (d.mode === "spin") return; // atalet devam eder
            if (d.mode === "carry") { endCarry(e); return; }
            if (d.i >= 0) {
                // tıklandı: kılıfı öne getir ve pikaba koy
                glideTo(d.i);
                load(d.i);
            }
        }, sig);
        window.addEventListener("pointercancel", () => {
            if (drag && drag.mode === "carry") cancelCarry();
            drag = null;
            shelf.classList.remove("is-dragging");
        }, sig);
        shelf.addEventListener("mouseleave", () => (hovering = false), sig);
        shelf.addEventListener("keydown", (e) => {
            if (e.key === "ArrowRight") { e.preventDefault(); glideTo(Math.round(pos) + 1); }
            else if (e.key === "ArrowLeft") { e.preventDefault(); glideTo(Math.round(pos) - 1); }
            else if (e.key === "Enter" || e.key === " ") { e.preventDefault(); load(((Math.round(pos) % N) + N) % N); }
        }, sig);

        let glide = null;
        function glideTo(i) {
            // en kısa yoldan dön
            const target = pos + wrap(i - pos);
            glide = { from: pos, to: target, t: 0 };
            vel = 0;
        }

        /* ---------- Taşıma (fareyle aşağı sürükle → pikaba bırak) ---------- */
        let ghost = null;
        function makeDisc(cover, rect) {
            const d = document.createElement("div");
            d.className = "vinyl vinyl-fly";
            d.style.setProperty("--cover", cover);
            d.style.width = d.style.height = rect.width + "px";
            d.style.transform = `translate(${rect.left}px, ${rect.top}px)`;
            document.body.appendChild(d);
            return d;
        }
        function startCarry(i, e) {
            const s = sleeves[i];
            s.el.classList.add("is-empty");
            ghost = { i, el: makeDisc(cssUrl(coverOf(list[i])), { left: e.clientX - 80, top: e.clientY - 80, width: 160 }) };
            turntable.classList.add("is-target");
            moveCarry(e);
        }
        const overDeck = (e) => {
            const r = platter.getBoundingClientRect();
            const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
            return Math.hypot(e.clientX - cx, e.clientY - cy) < r.width * 0.75;
        };
        function moveCarry(e) {
            if (!ghost) return;
            ghost.el.style.transform = `translate(${e.clientX - 80}px, ${e.clientY - 80}px) rotate(${(e.clientX + e.clientY) * 0.4}deg)`;
            turntable.classList.toggle("is-hot", overDeck(e));
        }
        function endCarry(e) {
            if (!ghost) return;
            const g = ghost;
            ghost = null;
            turntable.classList.remove("is-target", "is-hot");
            if (overDeck(e)) { load(g.i, g.el); return; }
            cancelCarry(g);
        }
        function cancelCarry(g = ghost) {
            if (!g) return;
            ghost = null;
            turntable.classList.remove("is-target", "is-hot");
            const back = () => { g.el.remove(); if (loaded !== g.i) sleeves[g.i].el.classList.remove("is-empty"); };
            if (!hasGSAP) { back(); return; }
            const r = sleeves[g.i].disc.getBoundingClientRect();
            gsap.to(g.el, { x: r.left, y: r.top, width: r.width, height: r.height, rotation: 0, duration: 0.6, ease: "power3.inOut", onComplete: back });
        }

        /* ---------- Pikap durumu (kaynak: Player.state) ---------- */
        let loaded = -1, playing = false, busy = false, angle = 0, speed = 0;
        const RPM = 33.3 * 6; // derece / sn
        const ARM_START = 27, ARM_TRAVEL = 17; // iğne: dış kenardan iç oluğa
        const setArm = (deg, dur) => {
            arm.style.transition = `transform ${dur == null ? 0.9 : dur}s cubic-bezier(.45, 0, .2, 1)`;
            arm.style.setProperty("--arm", deg + "deg");
        };
        const fmt = (s) => {
            s = Math.max(0, Math.floor(s || 0));
            return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");
        };
        function setButtons() {
            const on = loaded >= 0 && !busy;
            btnToggle.disabled = btnRestart.disabled = btnEject.disabled = !on;
            btnToggle.innerHTML = `<i class="bi bi-${playing ? "pause" : "play"}-fill"></i>`;
            btnToggle.setAttribute("aria-label", t(playing ? "music.pause" : "music.play"));
            led.classList.toggle("is-on", playing);
            sleeves.forEach((s, i) => s.el.classList.toggle("is-playing", i === loaded));
        }
        function setNowPlaying(i, status) {
            if (i < 0) {
                npTitle.textContent = t("music.idle");
                npTitle.dataset.i18n = "music.idle";
                npArtist.textContent = "";
                npCover.style.backgroundImage = "";
                npCur.textContent = npDur.textContent = "0:00";
                npBar.style.setProperty("--p", "0%");
                return;
            }
            delete npTitle.dataset.i18n;
            npTitle.textContent = list[i].title || "";
            npArtist.textContent = status || list[i].artist || "";
            npArtist.classList.toggle("np-error", status === t("music.error"));
            npCover.style.backgroundImage = cssUrl(coverOf(list[i]));
        }
        const progressFrac = () => P.progress().frac;

        // Plağı kılıftan pikaba taşı
        function load(i, flyEl) {
            if (busy) { if (flyEl) cancelCarry({ i, el: flyEl }); return; }
            if (i === loaded) {
                if (flyEl) flyEl.remove();
                sleeves[i].el.classList.add("is-empty");
                if (!playing) P.play();
                return;
            }
            busy = true;
            setButtons();
            P.ensure();
            const go = () => {
                busy = true;
                const s = sleeves[i];
                const cover = cssUrl(coverOf(list[i]));
                const finish = () => {
                    if (!alive) return;
                    record.style.setProperty("--cover", cover);
                    record.classList.add("is-on");
                    platter.classList.add("has-record");
                    s.el.classList.remove("is-pulled");
                    loaded = i;
                    busy = false;
                    P.select(i);
                    setNowPlaying(i, t("music.loading"));
                    setButtons();
                    // ton kolu plağın kenarına iner, sonra müzik başlar
                    setArm(ARM_START, 1);
                    later(() => P.play(true), reduceMotion ? 0 : 900);
                };
                const toDeck = (el) => {
                    const r = record.getBoundingClientRect();
                    gsap.to(el, {
                        x: r.left, y: r.top, width: r.width, height: r.height, rotation: "+=540",
                        duration: 1, ease: "power3.inOut",
                        onComplete: () => { el.remove(); finish(); }
                    });
                };
                if (!hasGSAP || reduceMotion) {
                    if (flyEl) flyEl.remove();
                    s.el.classList.add("is-empty");
                    finish();
                    return;
                }
                if (flyEl) {
                    gsap.set(flyEl, { x: gsap.getProperty(flyEl, "x"), y: gsap.getProperty(flyEl, "y") });
                    toDeck(flyEl);
                    return;
                }
                // önce plak kılıftan kayar
                s.el.classList.add("is-pulled");
                later(() => {
                    const r = s.disc.getBoundingClientRect();
                    const el = makeDisc(cover, r);
                    el.style.transform = "";
                    gsap.set(el, { x: r.left, y: r.top });
                    s.el.classList.add("is-empty");
                    toDeck(el);
                }, 420);
            };
            if (loaded >= 0) eject(go, true); else go();
        }

        // Plağı pikaptan kaldırıp kılıfına geri koy (keepEngine: başka plak yüklenecek, ikon kaybolmasın)
        function eject(next, keepEngine) {
            if (loaded < 0) { if (next) next(); return; }
            const i = loaded;
            busy = true;
            P.pause(true);
            setArm(0, 0.7);
            const done = () => {
                if (!alive) return;
                sleeves[i].el.classList.remove("is-empty", "is-playing");
                loaded = -1;
                busy = false;
                if (!keepEngine) P.eject();
                setNowPlaying(-1);
                setButtons();
                if (next) next();
            };
            const lift = () => {
                record.classList.remove("is-on");
                platter.classList.remove("has-record");
                if (!hasGSAP || reduceMotion) { done(); return; }
                const from = record.getBoundingClientRect();
                const el = makeDisc(cssUrl(coverOf(list[i])), from);
                el.style.transform = "";
                gsap.set(el, { x: from.left, y: from.top, rotation: angle % 360 });
                const r = sleeves[i].disc.getBoundingClientRect();
                gsap.to(el, {
                    x: r.left, y: r.top, width: r.width, height: r.height, rotation: "-=360",
                    duration: 0.9, ease: "power3.inOut",
                    onComplete: () => { el.remove(); done(); }
                });
            };
            later(lift, reduceMotion ? 0 : 650);
        }

        /* ---------- Kontroller ---------- */
        btnToggle.addEventListener("click", () => { if (playing) P.pause(); else P.play(); }, sig);
        btnRestart.addEventListener("click", () => {
            if (loaded < 0) return;
            // kol kalkar, başa döner, yeniden iner
            setArm(6, 0.5);
            later(() => { setArm(ARM_START, 0.8); P.restart(); }, 550);
        }, sig);
        btnEject.addEventListener("click", () => eject(), sig);
        vol.addEventListener("input", () => P.setVolume(+vol.value), sig);
        npBar.addEventListener("click", (e) => {
            const r = npBar.getBoundingClientRect();
            P.seek((e.clientX - r.left) / r.width);
        }, sig);

        // Oynatıcı durumu (başka yerden de değişebilir: sağ alttaki ikon, tarayıcı tuşları)
        let prevPlaying = false;
        const offState = P.on((s) => {
            if (!alive) return;
            playing = s.playing;
            if (loaded >= 0 && s.index === loaded && !busy) {
                if (s.error) { setNowPlaying(loaded, t("music.error")); setArm(0); }
                else if (s.ended) setArm(0);
                else if (s.playing && !prevPlaying) { setNowPlaying(loaded); setArm(ARM_START + progressFrac() * ARM_TRAVEL, 0.8); }
                else if (!s.playing && prevPlaying) setArm(6, 0.7);
            }
            prevPlaying = s.playing;
            setButtons();
        });
        const tick = setInterval(() => {
            if (loaded < 0) return;
            const p = P.progress();
            if (!p.dur) return;
            npCur.textContent = fmt(p.cur);
            npDur.textContent = fmt(p.dur);
            npBar.style.setProperty("--p", p.frac * 100 + "%");
            // çalarken iğne yavaşça plağın ortasına ilerler
            if (playing && !busy) setArm(ARM_START + p.frac * ARM_TRAVEL, 0.5);
        }, 500);

        document.addEventListener("langchange", () => {
            if (loaded < 0) setNowPlaying(-1);
            setButtons();
        }, sig);

        /* ---------- Başka sayfadan dönülünce: çalan plağı pikapta bul ---------- */
        const s0 = P.state;
        if (s0.index >= 0 && s0.index < N) {
            loaded = s0.index; playing = s0.playing; prevPlaying = s0.playing;
            const cover = cssUrl(coverOf(list[loaded]));
            record.style.setProperty("--cover", cover);
            record.classList.add("is-on");
            platter.classList.add("has-record");
            sleeves[loaded].el.classList.add("is-empty");
            pos = loaded;                      // raf, çalan plağın kılıfına dönük başlar
            speed = playing ? RPM : 0;
            setNowPlaying(loaded, s0.error ? t("music.error") : undefined);
            setArm(playing ? ARM_START + progressFrac() * ARM_TRAVEL : s0.error || s0.ended ? 0 : 6, 0);
        } else {
            setNowPlaying(-1);
        }
        setButtons();

        // Bölüm yaklaşınca YouTube API'sini önceden yükle (tıklayınca beklemesin)
        if ("IntersectionObserver" in window) {
            const io = new IntersectionObserver((en) => {
                if (en.some((x) => x.isIntersecting)) { P.ensure(); io.disconnect(); }
            }, { rootMargin: "600px 0px" });
            io.observe(section);
            ac.signal.addEventListener("abort", () => io.disconnect());
        }

        /* ---------- Döngü: raf dönüşü + plak dönüşü ---------- */
        let last = performance.now();
        function frame(now) {
            if (!alive) return;
            raf = requestAnimationFrame(frame);
            const dt = Math.min(0.05, (now - last) / 1000);
            last = now;
            if (glide) {
                glide.t = Math.min(1, glide.t + dt / 0.7);
                const k = 1 - Math.pow(1 - glide.t, 3);
                pos = glide.from + (glide.to - glide.from) * k;
                if (glide.t >= 1) glide = null;
            } else if (!drag || drag.mode !== "spin") {
                pos += vel * dt;
                vel *= Math.pow(0.04, dt); // sürtünme
                // kendiliğinden yavaşça döner (fare raftayken durur)
                if (!hovering && !reduceMotion && Math.abs(vel) < 0.2) pos += dt * 0.14;
            }
            layout();
            // pikap: hızlanır / yavaşlayarak durur
            const target = playing ? RPM : 0;
            speed += (target - speed) * Math.min(1, dt * (playing ? 1.6 : 1.1));
            angle += speed * dt;
            record.style.transform = `rotate(${angle}deg)`;
        }
        raf = requestAnimationFrame(frame);

        ui = {
            destroy() {
                alive = false;
                cancelAnimationFrame(raf);
                clearInterval(tick);
                timers.forEach(clearTimeout);
                offState();
                ac.abort();
                if (ghost) { ghost.el.remove(); ghost = null; }
                document.querySelectorAll(".vinyl-fly").forEach((n) => n.remove()); // yarım kalan uçan plaklar
            }
        };
    }

    function destroy() { if (ui) { ui.destroy(); ui = null; } }

    return { init, destroy };
})();

// İlk yükleme
MusicUI.init();
