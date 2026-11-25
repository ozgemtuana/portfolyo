/* ==========================================================================
   Gerçek 3D altın cep saati (yalnızca Ana Sayfa; mevcut dive.js'e dokunmaz)
   Three.js, PERSPEKTİF kamera, prosedürel geometri: silindir gövde, torus kenar/halka, kadran (canvas dokusu),
   akrep/yelkovan/saniye (BoxGeometry), taç ve zincir halkaları. MeshStandardMaterial altın + PMREM çevre ışığı.
   Fare/dokunmatik sürükleme yavaşça döndürür, boştayken hafifçe salınır, saat gerçek zamanı gösterir.
   Güvenlik ağı: WebGL yok / hareket azaltılmış → statik pocket-watch.png. DPR ≤ 2 (mobilde 1.5).
   Sekme gizliyken ya da sayfa değişince döngü durur; her şey dispose edilir.
   ========================================================================== */
window.Watch3D = (function () {
    let box = null, raf = 0, renderer = null, disposables = [], off = [], api = {};
    const reduce = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
    const track = (o) => { disposables.push(o); return o; };

    function dialTexture() {
        const c = document.createElement("canvas"); c.width = c.height = 512;
        const g = c.getContext("2d"), R = 256;
        const bg = g.createRadialGradient(R, R * 0.9, 20, R, R, R);
        bg.addColorStop(0, "#fffaf0"); bg.addColorStop(1, "#e9dcc0");
        g.fillStyle = bg; g.fillRect(0, 0, 512, 512);
        g.strokeStyle = "#2b1d10"; g.fillStyle = "#2b1d10"; g.textAlign = "center"; g.textBaseline = "middle";
        for (let i = 0; i < 60; i++) {
            const a = (i / 60) * Math.PI * 2, big = i % 5 === 0;
            g.lineWidth = big ? 5 : 2;
            g.beginPath(); g.moveTo(R + Math.sin(a) * (R - 14), R - Math.cos(a) * (R - 14)); g.lineTo(R + Math.sin(a) * (R - (big ? 38 : 26)), R - Math.cos(a) * (R - (big ? 38 : 26))); g.stroke();
        }
        g.font = "600 46px 'Cormorant Garamond', Georgia, serif";
        ["XII", "I", "II", "III", "IIII", "V", "VI", "VII", "VIII", "IX", "X", "XI"].forEach((n, i) => {
            const a = (i / 12) * Math.PI * 2; g.fillText(n, R + Math.sin(a) * (R - 78), R - Math.cos(a) * (R - 78));
        });
        g.font = "italic 26px 'Playfair Display', Georgia, serif"; g.fillText("T · D", R, R + 90);
        const t = new THREE.CanvasTexture(c); t.anisotropy = 4; return t;
    }

    function build() {
        const T = THREE;
        const gold = track(new T.MeshStandardMaterial({ color: 0xd9b25a, metalness: 0.9, roughness: 0.3 }));
        const goldDark = track(new T.MeshStandardMaterial({ color: 0xb98c33, metalness: 0.9, roughness: 0.38 }));
        const mesh = (geo, mat) => new T.Mesh(track(geo), mat);
        const watch = new T.Group();
        const body = mesh(new T.CylinderGeometry(1, 1, 0.36, 64), gold); body.rotation.x = Math.PI / 2; watch.add(body);
        [0.19, -0.19].forEach((z) => { const r = mesh(new T.TorusGeometry(0.97, 0.075, 20, 80), goldDark); r.position.z = z; watch.add(r); });
        const dial = mesh(new T.CircleGeometry(0.9, 64), track(new T.MeshStandardMaterial({ map: track(dialTexture()), roughness: 0.55, metalness: 0.05 }))); dial.position.z = 0.185; watch.add(dial);
        const glass = mesh(new T.CircleGeometry(0.9, 48), track(new T.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.07, metalness: 0, roughness: 0.05 }))); glass.position.z = 0.215; watch.add(glass);
        // Taç, halka ve zincir
        const crown = mesh(new T.CylinderGeometry(0.13, 0.15, 0.2, 24), gold); crown.position.y = 1.12; watch.add(crown);
        const neck = mesh(new T.CylinderGeometry(0.08, 0.08, 0.16, 16), goldDark); neck.position.y = 1.02; watch.add(neck);
        const bow = mesh(new T.TorusGeometry(0.2, 0.045, 14, 36), gold); bow.position.y = 1.4; watch.add(bow);
        for (let i = 0; i < 7; i++) {
            const l = mesh(new T.TorusGeometry(0.11, 0.028, 10, 24), goldDark);
            l.scale.y = 1.5; l.position.y = 1.78 + i * 0.2; l.rotation.y = i % 2 ? Math.PI / 2 : 0; watch.add(l);
        }
        // İbreler (merkezden döner)
        const hand = (w, len, mat, z) => { const g = new T.BoxGeometry(w, len, 0.03); g.translate(0, len / 2 - len * 0.12, 0); const m = mesh(g, mat); m.position.z = z; watch.add(m); return m; };
        const ink = track(new T.MeshStandardMaterial({ color: 0x1d130a, roughness: 0.5, metalness: 0.2 }));
        const red = track(new T.MeshStandardMaterial({ color: 0x8a1c2a, roughness: 0.5, metalness: 0.2 }));
        const hH = hand(0.07, 0.5, ink, 0.205), hM = hand(0.05, 0.76, ink, 0.215), hS = hand(0.018, 0.82, red, 0.225);
        const cap = mesh(new T.CylinderGeometry(0.05, 0.05, 0.05, 16), gold); cap.rotation.x = Math.PI / 2; cap.position.z = 0.23; watch.add(cap);
        return { watch, hH, hM, hS };
    }

    function destroy() {
        cancelAnimationFrame(raf); raf = 0;
        off.forEach((f) => f()); off = [];
        disposables.forEach((d) => d && d.dispose && d.dispose()); disposables = [];
        if (renderer) { renderer.dispose(); if (renderer.forceContextLoss) renderer.forceContextLoss(); renderer = null; }
        if (box) { box.remove(); box = null; }
        api = {};
    }

    function init() {
        destroy();
        if (document.body.dataset.page !== "home") return;
        box = document.createElement("div");
        box.className = "watch3d"; box.setAttribute("aria-hidden", "true");
        document.body.appendChild(box);
        const still = () => { box.innerHTML = '<img src="images/transition/pocket-watch.png" alt="" loading="lazy" decoding="async">'; box.classList.add("is-on"); };
        if (reduce() || typeof THREE === "undefined") return still();
        const canvas = document.createElement("canvas");
        try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "low-power" }); } catch (e) { renderer = null; return still(); }
        box.appendChild(canvas);
        const mobile = Math.min(innerWidth, innerHeight) < 700;
        renderer.setPixelRatio(Math.min(devicePixelRatio || 1, mobile ? 1.5 : 2));
        renderer.outputEncoding = THREE.sRGBEncoding;
        renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 50);
        camera.position.set(0, 0.85, 7.4); camera.lookAt(0, 0.85, 0);
        // Çevre ışığı: ışıklı odanın PMREM'i (harici dosya yok)
        const envScene = new THREE.Scene();
        const room = new THREE.Mesh(new THREE.BoxGeometry(20, 20, 20), new THREE.MeshBasicMaterial({ color: 0x3a2a1b, side: THREE.BackSide }));
        envScene.add(room);
        [[0, 9, 0, 0xfff1cf, 9], [-9, 2, 4, 0xffe2a8, 6], [9, 0, 5, 0xcfd8ff, 4], [0, -2, 9, 0xffffff, 5]].forEach(([x, y, z, c, s]) => {
            const p = new THREE.Mesh(new THREE.PlaneGeometry(s, s), new THREE.MeshBasicMaterial({ color: c, side: THREE.DoubleSide })); p.position.set(x, y, z); p.lookAt(0, 0, 0); envScene.add(p);
        });
        const pm = new THREE.PMREMGenerator(renderer);
        scene.environment = pm.fromScene(envScene, 0.04).texture;
        pm.dispose(); room.geometry.dispose(); room.material.dispose();
        scene.add(new THREE.AmbientLight(0xffffff, 0.25));
        const key = new THREE.DirectionalLight(0xfff0d0, 1.1); key.position.set(3, 5, 6); scene.add(key);
        const { watch, hH, hM, hS } = build();
        scene.add(watch);

        const size = () => { const w = box.clientWidth, h = box.clientHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); };
        size();
        const on = (t, e, f, o) => { t.addEventListener(e, f, o); off.push(() => t.removeEventListener(e, f, o)); };
        on(window, "resize", size);
        // Döndürme: fare konumu + sürükleme (dokunmatikte yalnız yatay sürükleme; dikey kaydırma serbest)
        let tgtY = 0, tgtX = 0, dragY = 0, dragging = false, lastX = 0, visible = true;
        on(window, "pointermove", (e) => { if (e.pointerType === "mouse" && !dragging) { tgtY = (e.clientX / innerWidth - 0.5) * 0.9; tgtX = (e.clientY / innerHeight - 0.5) * 0.35; } });
        on(canvas, "pointerdown", (e) => { dragging = true; lastX = e.clientX; });
        on(window, "pointermove", (e) => { if (dragging) { dragY += (e.clientX - lastX) * 0.012; lastX = e.clientX; } });
        on(window, "pointerup", () => { dragging = false; });
        on(document, "visibilitychange", () => { visible = !document.hidden; });
        if ("IntersectionObserver" in window) { const io = new IntersectionObserver((en) => { visible = en[0].isIntersecting && !document.hidden; }); io.observe(box); off.push(() => io.disconnect()); }
        const lost = () => still();
        on(canvas, "webglcontextlost", (e) => { e.preventDefault(); cancelAnimationFrame(raf); canvas.remove(); lost(); });

        let ry = 0, rx = 0, t0 = performance.now(), override = null;
        const draw = (now) => {
            raf = requestAnimationFrame(draw);
            if (!visible) return;
            const t = (now - t0) / 1000;
            const idle = Math.sin(t * 0.6) * 0.25;
            const wantY = override !== null ? override : tgtY + dragY + idle, wantX = tgtX + Math.sin(t * 0.45) * 0.06;
            ry += (wantY - ry) * 0.06; rx += (wantX - rx) * 0.06;
            watch.rotation.y = ry; watch.rotation.x = rx;
            const d = new Date(), s = d.getSeconds() + d.getMilliseconds() / 1000, m = d.getMinutes() + s / 60, h = (d.getHours() % 12) + m / 60;
            hS.rotation.z = -s / 60 * Math.PI * 2; hM.rotation.z = -m / 60 * Math.PI * 2; hH.rotation.z = -h / 12 * Math.PI * 2;
            renderer.render(scene, camera);
        };
        raf = requestAnimationFrame(draw);
        api.setRot = (y) => { override = y; };
        box.classList.add("is-on");
    }

    document.addEventListener("router:navigated", init);
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
    return { init, destroy, setRot: (y) => api.setRot && api.setRot(y) };
})();
