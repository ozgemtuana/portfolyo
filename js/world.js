/* ==========================================================================
   3D dünya: "Ormanda kemer"
   Referans görseldeki atmosferi gerçek 3D geometri, malzeme, ışık ve kamerayla kurar:
   ahşap kemerler ve halka, ağaç, sarkan asmalar, lilyumlar, taş ve kayalar, göl,
   uzak kaya sütunları, ay, ışık huzmeleri, rüzgârda dalgalanan perde.
   Sayfa kaydırıldıkça kamera bu dünyanın içinde ilerler (kaydırma asla engellenmez).
   Three.js r128 (projedeki mevcut altyapı). Harici model / doku dosyası yok:
   her şey kodla üretilir.

   Performans: dokunmatik / düşük çekirdekli cihazlarda yaprak, zambak ve parçacık
   sayıları azalır, piksel oranı sınırlanır. prefers-reduced-motion: zaman durur,
   yalnızca kaydırmayla kamera hareket eder (rüzgâr, parçacık, sallanma yok).
   ========================================================================== */

(function () {
    "use strict";

    const canvas = document.getElementById("bg3d");
    const root = document.documentElement;
    if (!canvas || typeof window.THREE === "undefined") { root.classList.add("no-webgl"); return; }
    const THREE = window.THREE;

    const page = document.body.dataset.page || "home";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const touch = window.matchMedia("(hover: none)").matches;
    const LOW = touch || (navigator.hardwareConcurrency || 8) <= 4;
    const Q = LOW ? 0.45 : 1; // örnek sayısı çarpanı

    let renderer;
    try {
        renderer = new THREE.WebGLRenderer({ canvas, antialias: !LOW, alpha: false, powerPreference: "high-performance" });
    } catch (e) { root.classList.add("no-webgl"); return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, LOW ? 1.25 : 1.75));
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Okunabilirlik örtüsü (CSS ile boyanır) ve sağdaki sahne göstergesi (01 / 02 / 03)
    const veil = document.createElement("div");
    veil.className = "world-veil"; veil.setAttribute("aria-hidden", "true");
    canvas.insertAdjacentElement("afterend", veil);
    const sceneNav = document.createElement("div");
    sceneNav.className = "scene-nav"; sceneNav.setAttribute("aria-hidden", "true");
    sceneNav.innerHTML = '<span class="on">01</span><i><b></b></i><span>02</span><span>03</span>';
    document.body.appendChild(sceneNav);
    const sceneItems = sceneNav.querySelectorAll("span");

    /* ---------- Yardımcılar ---------- */
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    const clamp01 = (v) => clamp(v, 0, 1);
    const lerp = (a, b, k) => a + (b - a) * k;
    const smooth = (a, b, x) => { const k = clamp01((x - a) / (b - a)); return k * k * (3 - 2 * k); };
    const Col = (h) => new THREE.Color(h);
    const V3 = (x, y, z) => new THREE.Vector3(x, y, z);

    // Tekrarlanabilir rastgelelik: her açılışta aynı dünya
    let seed = 1337;
    const rnd = () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
    const rr = (a, b) => a + (b - a) * rnd();

    // 3 boyutlu değer gürültüsü (taş, kabuk, zemin kabartması)
    const hash3 = (x, y, z) => { const s = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453; return s - Math.floor(s); };
    function noise3(x, y, z) {
        const ix = Math.floor(x), iy = Math.floor(y), iz = Math.floor(z);
        const fx = x - ix, fy = y - iy, fz = z - iz;
        const ux = fx * fx * (3 - 2 * fx), uy = fy * fy * (3 - 2 * fy), uz = fz * fz * (3 - 2 * fz);
        const L = (a, b, t) => a + (b - a) * t;
        return L(
            L(L(hash3(ix, iy, iz), hash3(ix + 1, iy, iz), ux), L(hash3(ix, iy + 1, iz), hash3(ix + 1, iy + 1, iz), ux), uy),
            L(L(hash3(ix, iy, iz + 1), hash3(ix + 1, iy, iz + 1), ux), L(hash3(ix, iy + 1, iz + 1), hash3(ix + 1, iy + 1, iz + 1), ux), uy), uz);
    }
    const fbm3 = (x, y, z, o = 4) => { let v = 0, a = 0.5; for (let i = 0; i < o; i++) { v += a * noise3(x, y, z); x = x * 2.03 + 11; y = y * 2.03 + 7; z = z * 2.03 + 3; a *= 0.5; } return v; };

    /* ---------- Canvas ile üretilen dokular ---------- */
    function canvasTex(w, h, draw, repeat) {
        const c = document.createElement("canvas");
        c.width = w; c.height = h;
        draw(c.getContext("2d"), w, h);
        const t = new THREE.CanvasTexture(c);
        t.wrapS = t.wrapT = THREE.RepeatWrapping;
        t.anisotropy = LOW ? 2 : 4;
        if (repeat) t.repeat.set(repeat[0], repeat[1]);
        return t;
    }
    // Ahşap: uzunlamasına damarlar (u ekseni boyunca)
    const woodTex = (base, dark, repeat) => canvasTex(1024, 512, (x, w, h) => {
        x.fillStyle = base; x.fillRect(0, 0, w, h);
        for (let i = 0; i < 520; i++) {
            const y0 = rnd() * h, a = rr(2, 11), f = rr(.01, .04), ph = rnd() * 6.28;
            x.strokeStyle = `rgba(${dark},${rr(.05, .22)})`; x.lineWidth = rr(.6, 3.2);
            x.beginPath();
            for (let xx = 0; xx <= w; xx += 10) { const yy = y0 + Math.sin(xx * f + ph) * a + Math.sin(xx * f * 3.1 + ph) * a * .35; xx ? x.lineTo(xx, yy) : x.moveTo(xx, yy); }
            x.stroke();
        }
        for (let i = 0; i < 5; i++) { // budak halkaları
            const cx = rnd() * w, cy = rnd() * h;
            for (let k = 5; k > 0; k--) { x.strokeStyle = `rgba(${dark},${.07 + (6 - k) * .02})`; x.lineWidth = 1.4; x.beginPath(); x.ellipse(cx, cy, k * 16, k * 5.5, 0, 0, 6.28); x.stroke(); }
        }
        for (let i = 0; i < 2400; i++) { x.fillStyle = `rgba(255,235,200,${rr(.01, .04)})`; x.fillRect(rnd() * w, rnd() * h, rr(8, 70), rr(1, 1.6)); }
    }, repeat);
    // Taş: lekeli, kumlu yüzey
    const stoneTex = (repeat) => canvasTex(256, 256, (x, w, h) => {
        x.fillStyle = "#b3a68c"; x.fillRect(0, 0, w, h);
        for (let i = 0; i < 360; i++) { const g = rr(150, 215) | 0; x.fillStyle = `rgba(${g},${g - 9},${g - 28},${rr(.04, .13)})`; x.beginPath(); x.arc(rnd() * w, rnd() * h, rr(6, 46), 0, 6.28); x.fill(); }
        for (let i = 0; i < 2600; i++) { const g = rr(90, 230) | 0; x.fillStyle = `rgba(${g},${g - 6},${g - 20},${rr(.03, .1)})`; x.fillRect(rnd() * w, rnd() * h, rr(1, 2.4), rr(1, 2.4)); }
        for (let i = 0; i < 14; i++) { x.strokeStyle = `rgba(70,60,44,${rr(.04, .09)})`; x.lineWidth = rr(.6, 1.2); x.beginPath(); const sx = rnd() * w, sy = rnd() * h; x.moveTo(sx, sy); x.quadraticCurveTo(sx + rr(-30, 30), sy + rr(10, 40), sx + rr(-40, 40), sy + rr(30, 80)); x.stroke(); }
    }, repeat);
    // Yosunlu zemin
    const mossTex = (repeat) => canvasTex(256, 256, (x, w, h) => {
        x.fillStyle = "#7d8a56"; x.fillRect(0, 0, w, h);
        for (let i = 0; i < 1800; i++) { const k = rnd(); x.fillStyle = k < .45 ? `rgba(58,76,36,${rr(.03, .11)})` : k < .8 ? `rgba(160,172,112,${rr(.03, .1)})` : `rgba(130,108,66,${rr(.03, .09)})`; x.beginPath(); x.arc(rnd() * w, rnd() * h, rr(1, 6), 0, 6.28); x.fill(); }
        for (let i = 0; i < 500; i++) { x.strokeStyle = `rgba(52,70,32,${rr(.05, .16)})`; x.lineWidth = rr(.5, 1.1); const sx = rnd() * w, sy = rnd() * h; x.beginPath(); x.moveTo(sx, sy); x.lineTo(sx + rr(-3, 3), sy - rr(3, 9)); x.stroke(); }
    }, repeat);
    // Yaprak: ana damar ve yan damarlar (renk instanceColor ile çarpılır)
    const leafTex = () => canvasTex(128, 256, (x, w, h) => {
        const g = x.createLinearGradient(0, 0, 0, h); g.addColorStop(0, "#ffffff"); g.addColorStop(1, "#d8dcd0");
        x.fillStyle = g; x.fillRect(0, 0, w, h);
        x.strokeStyle = "rgba(255,255,255,.55)"; x.lineWidth = 3; x.beginPath(); x.moveTo(w / 2, h); x.lineTo(w / 2, 6); x.stroke();
        x.lineWidth = 1.2; x.strokeStyle = "rgba(255,255,255,.28)";
        for (let i = 1; i < 14; i++) { const y = h - i * (h / 15); x.beginPath(); x.moveTo(w / 2, y); x.lineTo(w * .06, y - 34); x.moveTo(w / 2, y); x.lineTo(w * .94, y - 34); x.stroke(); }
        x.fillStyle = "rgba(60,80,40,.08)"; for (let i = 0; i < 80; i++) x.fillRect(rnd() * w, rnd() * h, rr(2, 10), rr(2, 10));
    });
    // Yumuşak daire / ışık / bulanık yaprak dokuları
    const softTex = () => canvasTex(128, 128, (x, w, h) => {
        const g = x.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
        g.addColorStop(0, "rgba(255,255,255,1)"); g.addColorStop(.35, "rgba(255,255,255,.55)"); g.addColorStop(1, "rgba(255,255,255,0)");
        x.fillStyle = g; x.fillRect(0, 0, w, h);
    });
    const shaftTex = () => canvasTex(64, 256, (x, w, h) => {
        const g = x.createLinearGradient(0, 0, 0, h);
        g.addColorStop(0, "rgba(255,255,255,0)"); g.addColorStop(.18, "rgba(255,255,255,.7)"); g.addColorStop(.6, "rgba(255,255,255,.35)"); g.addColorStop(1, "rgba(255,255,255,0)");
        x.fillStyle = g; x.fillRect(0, 0, w, h);
        const m = x.createLinearGradient(0, 0, w, 0);
        m.addColorStop(0, "rgba(0,0,0,1)"); m.addColorStop(.5, "rgba(0,0,0,0)"); m.addColorStop(1, "rgba(0,0,0,1)");
        x.globalCompositeOperation = "destination-out"; x.fillStyle = m; x.fillRect(0, 0, w, h);
    });
    const blurLeafTex = () => canvasTex(128, 256, (x, w, h) => {
        x.save(); x.translate(w / 2, h * 0.52); x.scale(1, 2.35);
        const g = x.createRadialGradient(0, 0, 0, 0, 0, w * 0.46);
        g.addColorStop(0, "rgba(255,255,255,.92)"); g.addColorStop(.5, "rgba(255,255,255,.55)"); g.addColorStop(1, "rgba(255,255,255,0)");
        x.fillStyle = g; x.beginPath(); x.arc(0, 0, w * 0.46, 0, 6.283); x.fill(); x.restore();
    });
    const fabricTex = () => canvasTex(128, 128, (x, w, h) => {
        x.fillStyle = "#efe4cc"; x.fillRect(0, 0, w, h);
        for (let i = 0; i < w; i += 2) { x.fillStyle = `rgba(120,100,70,${i % 4 ? .05 : .11})`; x.fillRect(i, 0, 1, h); x.fillRect(0, i, w, 1); }
    }, [3, 3]);

    /* ---------- Geometri yardımcıları ---------- */
    // Birden çok geometriyi tek geometride birleştir (çizim çağrısını azaltır)
    function merge(list) {
        let vc = 0, ic = 0;
        list.forEach((g) => { vc += g.attributes.position.count; ic += g.index ? g.index.count : g.attributes.position.count; });
        const pos = new Float32Array(vc * 3), nor = new Float32Array(vc * 3), uv = new Float32Array(vc * 2), idx = new Uint32Array(ic);
        let vo = 0, io = 0;
        list.forEach((g) => {
            const n = g.attributes.position.count;
            pos.set(g.attributes.position.array, vo * 3);
            nor.set(g.attributes.normal.array, vo * 3);
            if (g.attributes.uv) uv.set(g.attributes.uv.array, vo * 2);
            if (g.index) { for (let i = 0; i < g.index.count; i++) idx[io + i] = g.index.array[i] + vo; io += g.index.count; }
            else { for (let i = 0; i < n; i++) idx[io + i] = vo + i; io += n; }
            vo += n; g.dispose();
        });
        const out = new THREE.BufferGeometry();
        out.setAttribute("position", new THREE.BufferAttribute(pos, 3));
        out.setAttribute("normal", new THREE.BufferAttribute(nor, 3));
        out.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
        out.setIndex(new THREE.BufferAttribute(idx, 1));
        return out;
    }

    // Eğri boyunca değişken yarıçaplı, yüzeyi gürültüyle kabartılmış boru (gövde, dal, kemer)
    function taperTube(curve, segs, radial, radiusFn, opt = {}) {
        const frames = curve.computeFrenetFrames(segs, false);
        const pos = [], uv = [], idx = [];
        const nAmp = opt.noise || 0, nFreq = opt.freq || 1.4, uScale = opt.uScale || 1;
        for (let i = 0; i <= segs; i++) {
            const u = i / segs, P = curve.getPointAt(u), N = frames.normals[Math.min(i, segs)], B = frames.binormals[Math.min(i, segs)];
            const r = radiusFn(u);
            for (let j = 0; j <= radial; j++) {
                const v = (j / radial) * Math.PI * 2, c = Math.cos(v), s = Math.sin(v);
                const dx = N.x * c + B.x * s, dy = N.y * c + B.y * s, dz = N.z * c + B.z * s;
                const px = P.x + dx * r, py = P.y + dy * r, pz = P.z + dz * r;
                const bump = nAmp ? (fbm3(px * nFreq, py * nFreq, pz * nFreq, 3) - 0.5) * 2 * nAmp * r : 0;
                // gövde boyunca uzanan oluklar
                const ridge = opt.ridges ? Math.sin(v * opt.ridges + u * 6) * opt.ridgeAmp * r : 0;
                pos.push(px + dx * (bump + ridge), py + dy * (bump + ridge), pz + dz * (bump + ridge));
                uv.push(u * uScale * (opt.len || 1), j / radial);
            }
        }
        for (let i = 0; i < segs; i++) for (let j = 0; j < radial; j++) {
            const a = i * (radial + 1) + j, b = a + radial + 1;
            idx.push(a, b, a + 1, b, b + 1, a + 1);
        }
        const g = new THREE.BufferGeometry();
        g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
        g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
        g.setIndex(idx);
        g.computeVertexNormals();
        // dikişi yumuşat: ilk ve son halkanın normallerini ortala
        const nn = g.attributes.normal;
        for (let i = 0; i <= segs; i++) {
            const a = i * (radial + 1), b = a + radial;
            const x = nn.getX(a) + nn.getX(b), y = nn.getY(a) + nn.getY(b), z = nn.getZ(a) + nn.getZ(b), l = Math.hypot(x, y, z) || 1;
            nn.setXYZ(a, x / l, y / l, z / l); nn.setXYZ(b, x / l, y / l, z / l);
        }
        return g;
    }

    // Gürültüyle şekillendirilmiş kaya / dağ (küre tabanlı)
    function rockGeo(radius, detail, rough, squash = [1, 1, 1], seedOff = 0) {
        const g = new THREE.IcosahedronGeometry(radius, detail);
        const p = g.attributes.position;
        for (let i = 0; i < p.count; i++) {
            const x = p.getX(i), y = p.getY(i), z = p.getZ(i), l = Math.hypot(x, y, z) || 1;
            const n = fbm3(x / radius * 1.6 + seedOff, y / radius * 1.6, z / radius * 1.6, 4);
            const k = 1 + (n - 0.5) * rough;
            p.setXYZ(i, x * k * squash[0], y * k * squash[1], z * k * squash[2]);
        }
        g.computeVertexNormals();
        return g;
    }

    // Yaprak şekli: sivri uçlu, orta damarından hafif katlı, ucu aşağı kıvrık
    function leafGeometry() {
        const SU = 5, SV = 2, pos = [], uv = [], idx = [];
        for (let i = 0; i <= SU; i++) {
            const u = i / SU, w = Math.pow(Math.sin(Math.PI * Math.pow(u, 0.72)), 0.85) * 0.34;
            for (let j = 0; j <= SV; j++) {
                const v = (j / SV) * 2 - 1;
                pos.push(v * w, u, Math.abs(v) * w * 0.55 - u * u * 0.34);
                uv.push(v * 0.5 + 0.5, u);
            }
        }
        for (let i = 0; i < SU; i++) for (let j = 0; j < SV; j++) { const a = i * (SV + 1) + j, b = a + SV + 1; idx.push(a, b, a + 1, b, b + 1, a + 1); }
        const g = new THREE.BufferGeometry();
        g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
        g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
        g.setIndex(idx);
        g.computeVertexNormals();
        return g;
    }

    /* ======================================================================
       SAHNE, KAMERA, IŞIK
       ====================================================================== */
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0xc7b894, 0.028);
    const camera = new THREE.PerspectiveCamera(46, window.innerWidth / window.innerHeight, 0.1, 520);
    scene.add(camera);

    const sunDir = V3(0.55, 0.62, 0.55).normalize(); // güneş, sahnenin sağ-önünden (arkadan aydınlatma)
    const hemi = new THREE.HemisphereLight(0xe6dcc0, 0x4a5a2c, 0.62);
    const sun = new THREE.DirectionalLight(0xffe2b0, 0.95);
    sun.position.copy(sunDir).multiplyScalar(60);
    const amb = new THREE.AmbientLight(0xdcd2b4, 0.18);
    scene.add(hemi, sun, amb);
    const candleLight = new THREE.PointLight(0xffb561, 0.0, 14, 2);
    scene.add(candleLight);

    // Paylaşılan zaman / rüzgâr değerleri (shader'lar aynı nesneyi okur)
    const U = { uTime: { value: 0 }, uWind: { value: 0 }, uSunDir: { value: sunDir } };

    /* ---------- Gökyüzü: sıcak puslu gradyan, bulutlar, güneş parıltısı ---------- */
    const skyMat = new THREE.ShaderMaterial({
        uniforms: {
            uTop: { value: Col("#a9b59a") }, uMid: { value: Col("#e4d8b8") }, uBot: { value: Col("#d9cba6") },
            uSunCol: { value: Col("#ffe3b0") }, uTime: U.uTime, uSunDir: U.uSunDir
        },
        side: THREE.BackSide, depthWrite: false, depthTest: false, fog: false,
        vertexShader: `varying vec3 vDir; void main(){ vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
        fragmentShader: `
            uniform vec3 uTop, uMid, uBot, uSunCol, uSunDir; uniform float uTime; varying vec3 vDir;
            float h2(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
            float n2(vec2 p){ vec2 i=floor(p), f=fract(p); vec2 u=f*f*(3.-2.*f); return mix(mix(h2(i),h2(i+vec2(1,0)),u.x), mix(h2(i+vec2(0,1)),h2(i+vec2(1,1)),u.x), u.y); }
            float fbm(vec2 p){ float v=0., a=.5; for(int i=0;i<${LOW ? 3 : 5};i++){ v+=a*n2(p); p=p*2.03+17.; a*=.5; } return v; }
            void main(){
                vec3 d = normalize(vDir); float h = d.y;
                vec3 col = mix(uBot, uMid, smoothstep(-0.12, 0.16, h));
                col = mix(col, uTop, smoothstep(0.14, 0.85, h));
                vec2 cp = d.xz / (max(h, 0.0) + 0.42) * 1.25 + vec2(uTime * 0.004, 0.0);
                float cl = smoothstep(0.52, 0.86, fbm(cp * 1.7));
                col = mix(col, uMid * 1.07 + 0.05, cl * smoothstep(0.0, 0.3, h) * 0.5);
                float s = max(dot(d, normalize(uSunDir)), 0.0);
                col += uSunCol * (pow(s, 6.0) * 0.28 + pow(s, 90.0) * 0.7);
                gl_FragColor = vec4(col, 1.0);
            }`
    });
    const sky = new THREE.Mesh(new THREE.SphereGeometry(300, 24, 16), skyMat);
    sky.frustumCulled = false; sky.renderOrder = -10;
    scene.add(sky);

    // Ay: uzakta, soluk ve geniş bir hale ile
    const moonGroup = new THREE.Group();
    moonGroup.position.set(-14, 36, -205);
    const moon = new THREE.Mesh(new THREE.SphereGeometry(11, 32, 20), new THREE.MeshBasicMaterial({ color: 0xf6efdc, fog: false }));
    const moonGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: softTex(), color: 0xfff3d8, transparent: true, opacity: 0.55, depthWrite: false, fog: false, blending: THREE.AdditiveBlending }));
    moonGlow.scale.set(64, 64, 1);
    moonGroup.add(moon, moonGlow);
    scene.add(moonGroup);

    /* ---------- Zamana (kaydırmaya) bağlı atmosfer anahtarları ---------- */
    const ENV = [
        { t: 0.00, fog: "#c9b78f", dens: 0.027, top: "#a3b095", mid: "#e6d8b6", bot: "#d8c8a0", sun: "#ffe0ae", sunI: 0.95, hs: "#e7dcc0", hg: "#4b5b2d", hI: 0.78, moon: 0.0 },
        { t: 0.30, fog: "#aab08c", dens: 0.034, top: "#92a688", mid: "#d3d0aa", bot: "#bfc09a", sun: "#ffe8bf", sunI: 0.8, hs: "#d9dcbc", hg: "#3e5028", hI: 0.72, moon: 0.1 },
        { t: 0.55, fog: "#d4cdb0", dens: 0.020, top: "#b4bfa6", mid: "#eee3c6", bot: "#e4d6b4", sun: "#fff0d2", sunI: 0.9, hs: "#f0e8cc", hg: "#58663a", hI: 0.82, moon: 0.9 },
        { t: 0.80, fog: "#c9b58a", dens: 0.022, top: "#9da98b", mid: "#e8cf9c", bot: "#dcb982", sun: "#ffcf8c", sunI: 1.0, hs: "#eed5a2", hg: "#4d4a2a", hI: 0.76, moon: 0.8 },
        { t: 1.00, fog: "#8f6c47", dens: 0.030, top: "#667250", mid: "#c99a5c", bot: "#a9784a", sun: "#ffb867", sunI: 1.05, hs: "#d9a766", hg: "#3a3320", hI: 0.66, moon: 0.4 }
    ].map((k) => ({ ...k, fogC: Col(k.fog), topC: Col(k.top), midC: Col(k.mid), botC: Col(k.bot), sunC: Col(k.sun), hsC: Col(k.hs), hgC: Col(k.hg) }));
    const tmpA = new THREE.Color();
    function applyEnv(t) {
        let i = 0; while (i < ENV.length - 2 && t > ENV[i + 1].t) i++;
        const a = ENV[i], b = ENV[i + 1], k = smooth(0, 1, (t - a.t) / (b.t - a.t));
        scene.fog.color.copy(a.fogC).lerp(b.fogC, k); scene.fog.density = lerp(a.dens, b.dens, k);
        skyMat.uniforms.uTop.value.copy(a.topC).lerp(b.topC, k);
        skyMat.uniforms.uMid.value.copy(a.midC).lerp(b.midC, k);
        skyMat.uniforms.uBot.value.copy(a.botC).lerp(b.botC, k);
        skyMat.uniforms.uSunCol.value.copy(a.sunC).lerp(b.sunC, k);
        sun.color.copy(a.sunC).lerp(b.sunC, k); sun.intensity = lerp(a.sunI, b.sunI, k);
        hemi.color.copy(a.hsC).lerp(b.hsC, k); hemi.groundColor.copy(a.hgC).lerp(b.hgC, k); hemi.intensity = lerp(a.hI, b.hI, k);
        const m = lerp(a.moon, b.moon, k);
        moon.material.color.setRGB(0.96, 0.94, 0.86); moonGlow.material.opacity = 0.18 + 0.5 * m; moonGroup.visible = m > 0.02;
        moon.material.opacity = 1;
        return { fog: scene.fog.color, k };
    }

    /* ======================================================================
       MALZEMELER
       ====================================================================== */
    const woodMap = woodTex("#8a5d38", "42,24,10", [1, 1]);
    const woodMapPlank = woodTex("#a37a4e", "50,30,14", [2, 2]);
    const barkMap = woodTex("#6b4a2e", "30,18,8", [1, 1]);
    const stoneMap = stoneTex([2, 2]);
    const mossMap = mossTex([46, 46]);
    const leafMap = leafTex();
    const std = (o) => new THREE.MeshStandardMaterial(Object.assign({ roughness: 0.88, metalness: 0 }, o));
    const woodMat = std({ map: woodMap, bumpMap: woodMap, bumpScale: 1.4, color: 0xf0e0cc });
    const barkMat = std({ map: barkMap, bumpMap: barkMap, bumpScale: 2.2, color: 0xe8d6c0 });
    const plankMat = std({ map: woodMapPlank, bumpMap: woodMapPlank, bumpScale: 1.0, color: 0xf6ead8 });
    const stoneMat = std({ map: stoneMap, bumpMap: stoneMap, bumpScale: 0.9, color: 0xe8dcc8, roughness: 0.97 });
    const groundMat = std({ map: mossMap, vertexColors: true, roughness: 1 });
    const fabricMat = std({ map: fabricTex(), color: 0xfff6e2, roughness: 0.95 });
    const stemMat = std({ color: 0x4d6a2c, roughness: 0.7 });
    const clothMat = std({ color: 0xf6ecd6, roughness: 0.92, transparent: true, opacity: 0.84, side: THREE.DoubleSide });

    // Rüzgârda sallanan yapraklar: instancing + köşe kaydırma
    const leafMat = std({ map: leafMap, side: THREE.DoubleSide, roughness: 0.75 });
    leafMat.onBeforeCompile = (sh) => {
        sh.uniforms.uTime = U.uTime; sh.uniforms.uWind = U.uWind;
        sh.vertexShader = "uniform float uTime; uniform float uWind;\n" + sh.vertexShader.replace("#include <begin_vertex>", `
            vec3 transformed = vec3(position);
            #ifdef USE_INSTANCING
                float ph = instanceMatrix[3].x * 0.7 + instanceMatrix[3].z * 0.5 + instanceMatrix[3].y * 0.3;
            #else
                float ph = 0.0;
            #endif
            float tip = position.y * position.y;
            transformed.z += (sin(uTime * 1.25 + ph) * 0.11 + uWind * 0.12) * tip;
            transformed.x += sin(uTime * 0.9 + ph * 1.7) * 0.07 * tip;`);
    };

    /* ======================================================================
       NESNELER
       ====================================================================== */
    const world = new THREE.Group();
    scene.add(world);
    const leafGeo = leafGeometry();
    const DUMMY = new THREE.Object3D(), QY = new THREE.Quaternion(), QT = new THREE.Quaternion(), UP = V3(0, 1, 0);
    // Yaprak kümeleri: instanced mesh (tek çizim çağrısı)
    function leafCluster(items) {
        const m = new THREE.InstancedMesh(leafGeo, leafMat, items.length);
        const c = new THREE.Color();
        items.forEach((it, i) => {
            QY.setFromUnitVectors(UP, it.dir.clone().normalize());
            QT.setFromAxisAngle(it.dir.clone().normalize(), rnd() * 6.283);
            DUMMY.position.copy(it.p); DUMMY.quaternion.copy(QT).multiply(QY);
            DUMMY.scale.set(it.s * (it.w || 1), it.s, it.s * (it.w || 1));
            DUMMY.updateMatrix(); m.setMatrixAt(i, DUMMY.matrix);
            c.copy(it.c); m.setColorAt(i, c);
        });
        m.instanceMatrix.needsUpdate = true; if (m.instanceColor) m.instanceColor.needsUpdate = true;
        m.frustumCulled = false;
        world.add(m);
        return m;
    }
    // Yeşil tonları: derin orman, zeytin, adaçayı, nadiren sararmış
    const GREENS = ["#33432a", "#415230", "#52623a", "#64733f", "#788548", "#8d9560", "#a6a97a"].map(Col);
    const leafColor = (bright = 0) => { const c = GREENS[(rnd() * GREENS.length) | 0].clone(); c.multiplyScalar(0.8 + rnd() * 0.45 + bright); if (rnd() < 0.07) c.lerp(Col("#c9b25a"), 0.45); return c; };

    // Eğri boyunca sarkan asmalar: ince sap + yapraklar
    function vines(points, count, opt = {}) {
        const stems = [], items = [];
        for (let k = 0; k < count; k++) {
            const u = rnd(), base = points.getPointAt(u);
            const len = rr(opt.minLen || 1.6, opt.maxLen || 5.5), seg = 7;
            const pts = [], sway = V3(rr(-0.6, 0.6), 0, rr(-0.6, 0.6));
            for (let i = 0; i <= seg; i++) { const f = i / seg; pts.push(V3(base.x + sway.x * f * f + Math.sin(f * 3 + k) * 0.12, base.y - len * f, base.z + sway.z * f * f)); }
            const cv = new THREE.CatmullRomCurve3(pts);
            stems.push(taperTube(cv, 8, 4, (t) => 0.035 * (1 - t * 0.6)));
            const nl = Math.round(len * 3.2);
            for (let i = 0; i < nl; i++) {
                const f = (i + 0.5) / nl, p = cv.getPointAt(f), side = rnd() < 0.5 ? -1 : 1;
                items.push({ p, dir: V3(side * rr(0.5, 1.2), rr(-0.9, 0.2), rr(-0.6, 0.6)), s: rr(0.38, 0.85) * (1 - f * 0.3), c: leafColor(0.05) });
            }
        }
        if (stems.length) world.add(new THREE.Mesh(merge(stems), stemMat));
        if (items.length) leafCluster(items);
    }

    /* ---------- Zemin: yosunlu ada + kıyı eğimi ---------- */
    const GROUND = { cx: 0, cz: -10, w: 150, d: 120 };
    const heightAt = (x, z) => {
        const n = fbm3(x * 0.045, 0, z * 0.045, 4);
        const shore = smooth(-40, -58, z);              // z = -40 sonrası göle doğru alçalır
        const edge = smooth(46, 78, Math.abs(x));       // yanlarda yükselen yamaçlar
        const isle = smooth(11, 3, Math.hypot(x + 2.8, z + 55)) * 3.4; // felsefe sahnesindeki küçük yosunlu ada
        return (n - 0.45) * 2.2 * (1 - shore) - shore * 3.4 + edge * 7 * n + isle;
    };
    (function ground() {
        const SX = LOW ? 60 : 96, SZ = LOW ? 48 : 76;
        const g = new THREE.PlaneGeometry(GROUND.w, GROUND.d, SX, SZ);
        g.rotateX(-Math.PI / 2);
        const p = g.attributes.position, colors = new Float32Array(p.count * 3), c = new THREE.Color();
        for (let i = 0; i < p.count; i++) {
            const x = p.getX(i) + GROUND.cx, z = p.getZ(i) + GROUND.cz, h = heightAt(x, z);
            p.setXYZ(i, p.getX(i), h, p.getZ(i));
            const dirt = smooth(0.0, 1.0, fbm3(x * 0.08 + 9, 0, z * 0.08, 3) * 1.3 - 0.2 + smooth(-42, -58, z) * 0.9);
            c.setRGB(0.60, 0.66, 0.42).lerp(Col("#7a6340"), dirt * 0.85).multiplyScalar(0.78 + fbm3(x * 0.3, 0, z * 0.3, 2) * 0.32);
            colors.set([c.r, c.g, c.b], i * 3);
        }
        g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
        g.computeVertexNormals();
        const m = new THREE.Mesh(g, groundMat);
        m.position.set(GROUND.cx, 0, GROUND.cz);
        world.add(m);
    })();

    /* ---------- Göl: fresnel yansıması, dalgacıklar, güneş parıltısı ---------- */
    const WATER_Y = -1.15;
    const waterU = THREE.UniformsUtils.merge([THREE.UniformsLib.fog, {}]);
    waterU.uTime = U.uTime; waterU.uSunDir = U.uSunDir;
    waterU.uDeep = { value: Col("#31402c") }; waterU.uSkyMid = { value: skyMat.uniforms.uMid.value }; waterU.uSkyTop = { value: skyMat.uniforms.uTop.value };
    waterU.uSunCol = { value: skyMat.uniforms.uSunCol.value };
    const waterMat = new THREE.ShaderMaterial({
        uniforms: waterU, fog: true,
        vertexShader: `
            varying vec3 vWorld;
            #include <fog_pars_vertex>
            void main(){ vec4 wp = modelMatrix * vec4(position, 1.0); vWorld = wp.xyz; vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
            #include <fog_vertex>
            }`,
        fragmentShader: `
            uniform float uTime; uniform vec3 uSunDir, uDeep, uSkyMid, uSkyTop, uSunCol; varying vec3 vWorld;
            #include <fog_pars_fragment>
            float h2(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
            float n2(vec2 p){ vec2 i=floor(p), f=fract(p); vec2 u=f*f*(3.-2.*f); return mix(mix(h2(i),h2(i+vec2(1,0)),u.x), mix(h2(i+vec2(0,1)),h2(i+vec2(1,1)),u.x), u.y); }
            void main(){
                vec3 V = normalize(cameraPosition - vWorld);
                vec2 p = vWorld.xz * 0.16; float t = uTime * 0.22;
                vec3 n = normalize(vec3((n2(p*3.+t)-.5)*.30 + (n2(p*9.-t*1.3)-.5)*.10, 1.0, (n2(p*3.7-t)-.5)*.30 + (n2(p*11.+t)-.5)*.09));
                float f = pow(1.0 - max(dot(n, V), 0.0), 3.0);
                vec3 R = reflect(-V, n);
                vec3 sk = mix(uSkyMid, uSkyTop, clamp(R.y * 1.6, 0.0, 1.0));
                vec3 col = mix(uDeep, sk, clamp(f * 0.95 + 0.22, 0.0, 1.0));
                col += uSunCol * pow(max(dot(R, normalize(uSunDir)), 0.0), 140.0) * 1.3;
                gl_FragColor = vec4(col, 1.0);
            #include <fog_fragment>
            }`
    });
    const water = new THREE.Mesh(new THREE.PlaneGeometry(900, 700, 1, 1), waterMat);
    water.rotation.x = -Math.PI / 2; water.position.set(0, WATER_Y, -230);
    world.add(water);

    /* ---------- Kayalar (yosunlu, taş dokulu) ---------- */
    const rocks = [];
    function rock(x, z, r, sq, sy = 0, seedOff = 0, rough = 0.55) {
        const m = new THREE.Mesh(rockGeo(r, LOW ? 3 : 4, rough, sq, seedOff), stoneMat);
        const y = Math.max(heightAt(x, z), WATER_Y + 0.1) + r * sq[1] * 0.35 + sy;
        m.position.set(x, y, z); m.rotation.y = rnd() * 6.28;
        world.add(m); rocks.push(m);
        // üstüne yosun tepeleri (yaprak cıvıl cıvıl)
        const items = [];
        for (let i = 0; i < Math.round(r * 10 * Q); i++) {
            const a = rnd() * 6.283, rad = r * rr(0.2, 0.9);
            items.push({ p: V3(x + Math.cos(a) * rad, y + r * sq[1] * rr(0.55, 0.95), z + Math.sin(a) * rad), dir: V3(rr(-0.7, 0.7), 1, rr(-0.7, 0.7)), s: rr(0.3, 0.7), c: leafColor(0.12) });
        }
        if (items.length) leafCluster(items);
        return m;
    }
    // Sağ ön plan: yosunlu kaya öbeği (referansın sağ alt köşesi)
    rock(7.4, -5.2, 1.9, [1.1, 0.8, 1.0], 0, 1.3);
    rock(9.2, -3.6, 1.2, [1, 0.9, 1], 0, 4.1);
    rock(6.3, -2.6, 0.8, [1.2, 0.7, 1], 0, 7.7);
    rock(-5.5, -4.5, 1.4, [1.2, 0.8, 1], 0, 2.2);
    // Halka çevresi, göl kıyısı ve iskele sonu
    rock(10.8, -33, 2.6, [1.2, 0.8, 1.1], 0, 9.9); rock(-3.4, -32.2, 1.8, [1, 0.8, 1], 0, 3.7);
    rock(9.8, -64, 1.9, [1.1, 0.8, 1], 0, 6.1); rock(2.4, -67.5, 1.2, [1, 0.7, 1], 0, 8.8); rock(-4.8, -50, 2.2, [1.2, 0.8, 1], 0, 5.2);

    // Uzak kaya sütunları: sisle silikleşen sürreal siluetler
    function spire(x, z, h, r, seedOff) {
        const g = new THREE.CylinderGeometry(r * 0.35, r, h, 44, 26, false);
        const p = g.attributes.position;
        for (let i = 0; i < p.count; i++) {
            const px = p.getX(i), py = p.getY(i), pz = p.getZ(i), a = Math.atan2(pz, px);
            const k = 1 + (fbm3(Math.cos(a) * 1.3 + seedOff, py * 0.08, Math.sin(a) * 1.3, 4) - 0.5) * 0.75 + Math.sin(py * 0.3 + seedOff) * 0.06;
            p.setXYZ(i, px * k, py, pz * k);
        }
        g.computeVertexNormals();
        const m = new THREE.Mesh(g, stoneMat);
        m.position.set(x, h / 2 - 3, z);
        world.add(m);
        // tepesinde yeşillik
        const items = [];
        for (let i = 0; i < Math.round(60 * Q); i++) { const a = rnd() * 6.28, d = rnd() * r * 0.5; items.push({ p: V3(x + Math.cos(a) * d, h - 3 + rr(-1, 1.5), z + Math.sin(a) * d), dir: V3(rr(-1, 1), 1, rr(-1, 1)), s: rr(1.4, 3), c: leafColor(0.1) }); }
        leafCluster(items);
    }
    spire(26, -112, 46, 9, 1.0);   // hero'daki büyük kaya yüzü
    spire(-38, -118, 38, 7, 2.6); spire(58, -138, 54, 10, 4.2);
    spire(-18, -150, 56, 9, 6.6); spire(24, -168, 62, 11, 8.1); spire(-62, -140, 40, 8, 9.4);

    // Çok uzaktaki sisli tepeler: ufku doldurur, derinlik verir (yumuşak, yuvarlak silüetler)
    [[-120, -300, 70, 110], [-20, -330, 96, 120], [90, -310, 80, 105], [175, -285, 62, 90], [-195, -285, 64, 90]].forEach(([x, z, h, r], i) => {
        const g = new THREE.SphereGeometry(r, 40, 22), p = g.attributes.position;
        for (let k = 0; k < p.count; k++) { const px = p.getX(k), py = p.getY(k), pz = p.getZ(k); const n = fbm3(px * 0.02 + i * 5, py * 0.02, pz * 0.02, 4); const f = 1 + (n - 0.5) * 0.5; p.setXYZ(k, px * f * 1.5, py * f * (h / r) * 0.9, pz * f); }
        g.computeVertexNormals();
        const m = new THREE.Mesh(g, stoneMat); m.position.set(x, -h * 0.35, z); world.add(m);
    });

    /* ---------- Ahşap kemerler ---------- */
    const archFns = [];
    function woodArch(points, rBase, rTop, noiseAmp = 0.12, rot = 0) {
        const cv = new THREE.CatmullRomCurve3(points.map((p) => V3(p[0], p[1], p[2])), false, "catmullrom", 0.5);
        const g = taperTube(cv, 110, 22, (u) => { const m = Math.sin(Math.PI * u); return lerp(rBase, rTop, m) * (1 + 0.18 * Math.sin(u * 17)); }, { noise: noiseAmp, freq: 0.9, ridges: 5, ridgeAmp: 0.08, uScale: 1, len: 6 });
        const m = new THREE.Mesh(g, barkMat);
        world.add(m);
        return cv;
    }
    // Kemer 1: ilk geçiş (hero çerçevesi)
    const arch1 = woodArch([[-4.8, -1.5, 0], [-5.6, 2.6, 0.3], [-4.4, 6.4, 0], [-1, 9.4, -0.3], [3, 9.9, -0.5], [6.6, 8.2, -0.8], [8.9, 4.4, -1], [9.5, -1.5, -1.1]], 1.15, 0.5);
    // Kemer 2: sinematik derinlik için ikinci kemer
    const arch2 = woodArch([[-3.4, -1.5, -16], [-4, 3.5, -16.2], [-1.4, 8.2, -16.6], [2.8, 9.6, -17], [6.2, 6.6, -17], [7.4, -1.5, -16.5]], 0.95, 0.4);
    // Arka plandaki ince kemer
    woodArch([[-14, -1.5, -10], [-15.2, 4, -10.5], [-11.4, 10, -11], [-6.4, 11.6, -11.5], [-2.8, 8.4, -12], [-1.6, -1.5, -11.6]], 0.7, 0.32, 0.1);
    vines(arch1, Math.round(26 * Q), { minLen: 2, maxLen: 6.5 });
    vines(arch2, Math.round(20 * Q), { minLen: 1.6, maxLen: 5 });

    // Sol ön plan gövdeler (referanstaki iri ağaç gövdeleri) + kök kıvrımları
    function trunk(x, z, r, h, twist, seedOff) {
        const pts = []; for (let i = 0; i <= 8; i++) { const f = i / 8; pts.push(V3(x + Math.sin(f * 3 + seedOff) * twist * f, f * h - 1.5, z + Math.cos(f * 2.2 + seedOff) * twist * 0.6 * f)); }
        const cv = new THREE.CatmullRomCurve3(pts);
        const g = taperTube(cv, 60, 20, (u) => r * (1.55 - 0.9 * smooth(0, 0.35, u) + 0.4 * (1 - u) * 0.0) * (0.78 + 0.22 * (1 - u)), { noise: 0.16, freq: 0.7, ridges: 6, ridgeAmp: 0.1, len: 4 });
        world.add(new THREE.Mesh(g, barkMat));
        return cv;
    }
    const tr1 = trunk(-7.6, 6.5, 1.3, 15, 1.2, 0.4);
    const tr2 = trunk(-10.8, 0.5, 1.7, 18, 1.8, 2.7);
    const tr3 = trunk(12.6, 5.5, 1.1, 14, -1.1, 4.4);
    vines(tr1, Math.round(10 * Q), { minLen: 3, maxLen: 8 }); vines(tr2, Math.round(10 * Q), { minLen: 3, maxLen: 9 }); vines(tr3, Math.round(8 * Q), { minLen: 3, maxLen: 7 });

    /* ---------- Büyük ahşap halka + içinde ağaç (hakkımda sahnesi) ---------- */
    const RING = { x: 4.5, y: 5.3, z: -34, r: 7.2 };
    (function ring() {
        const pts = [];
        for (let i = 0; i <= 28; i++) { const a = (i / 28) * Math.PI * 2; pts.push(V3(RING.x + Math.cos(a) * RING.r, RING.y + Math.sin(a) * RING.r, RING.z + Math.sin(a * 2.0) * 0.7 + Math.cos(a * 3) * 0.25)); }
        const cv = new THREE.CatmullRomCurve3(pts, true, "catmullrom", 0.5);
        const g = taperTube(cv, 200, 24, (u) => 0.62 + 0.42 * Math.sin(u * Math.PI * 2 + 0.6) + 0.14 * Math.sin(u * Math.PI * 6), { noise: 0.1, freq: 0.7, ridges: 4, ridgeAmp: 0.1, len: 10 });
        world.add(new THREE.Mesh(g, woodMat));
        vines(cv, Math.round(22 * Q), { minLen: 2.4, maxLen: 8 });
    })();

    // Ağaç: bonsai gibi bükülen gövde, dallar, yaprak kümeleri
    (function tree() {
        const base = V3(1.2, -0.2, -33.4), branches = [], items = [];
        function grow(start, dir, len, r0, depth) {
            const pts = [start.clone()]; let p = start.clone(), d = dir.clone();
            const steps = 5;
            for (let i = 1; i <= steps; i++) { d.x += rr(-0.35, 0.35); d.z += rr(-0.35, 0.35); d.y += rr(-0.08, 0.2); d.normalize(); p = p.clone().addScaledVector(d, len / steps); pts.push(p.clone()); }
            const cv = new THREE.CatmullRomCurve3(pts);
            branches.push(taperTube(cv, 10, 7, (u) => r0 * (1 - u * 0.62), { noise: 0.1, freq: 1.2, len: 1 }));
            if (depth <= 0 || len < 0.9) {
                const n = Math.round(46 * Q);
                for (let i = 0; i < n; i++) { const a = rnd() * 6.283, e = rr(-0.2, 1) * 1.2, rad = rr(0.4, 1.7); items.push({ p: p.clone().add(V3(Math.cos(a) * rad, e * 1.0, Math.sin(a) * rad)), dir: V3(Math.cos(a) * rr(0.3, 1), rr(0.2, 1.4), Math.sin(a) * rr(0.3, 1)), s: rr(0.45, 0.95), c: leafColor(0.14) }); }
                return;
            }
            const kids = depth === 3 ? 3 : 2;
            for (let k = 0; k < kids; k++) {
                const nd = V3(d.x + rr(-0.9, 0.9), d.y * 0.6 + rr(0.0, 0.5), d.z + rr(-0.9, 0.9)).normalize();
                grow(p.clone(), nd, len * rr(0.6, 0.78), r0 * 0.58, depth - 1);
            }
        }
        grow(base, V3(0.18, 1, 0.1), 3.6, 0.5, 3);
        grow(base.clone().add(V3(0.2, 1.1, 0)), V3(-0.8, 0.9, 0.3), 2.8, 0.34, 2);
        world.add(new THREE.Mesh(merge(branches), barkMat));
        leafCluster(items);
        // ağacın dibinde yosun ve eğreltiler
    })();


    /* ======================================================================
       ZAMBAK (beyaz lilyum): taç yaprağı geometrisi her karede yeniden şekillenir
       (kapalı tomurcuktan açık çiçeğe). Işık: dünyadaki güneş yönü + sis.
       ====================================================================== */
    const fogU = (o) => Object.assign(THREE.UniformsUtils.merge([THREE.UniformsLib.fog]), o, { uTime: U.uTime, uWind: U.uWind, uSunDir: U.uSunDir });
    const LIGHT = `
        uniform vec3 uSunDir;
        vec3 lightIt(vec3 base, vec3 n, vec3 v, float trans, vec3 rimCol) {
            vec3 l = normalize(uSunDir);
            float nd = dot(n, l);
            float wrap = max((nd + 0.25) / 1.25, 0.0);
            wrap = wrap * wrap * (3.0 - 2.0 * wrap);
            vec3 hemi = mix(vec3(0.24, 0.27, 0.18), vec3(0.86, 0.84, 0.78), n.y * 0.5 + 0.5);
            vec3 col = base * (hemi * 0.42 + vec3(1.0, 0.95, 0.86) * wrap * 0.80);
            float back = pow(max(-nd, 0.0), 1.5) * trans;
            col += base * vec3(1.0, 0.93, 0.78) * back * 0.40;
            col += vec3(1.0, 0.97, 0.9) * pow(max(dot(n, normalize(l + v)), 0.0), 12.0) * 0.07;
            col += rimCol * pow(1.0 - abs(dot(n, v)), 4.0) * 0.07;
            return col;
        }
    `;
    const lilyVert = `
        varying vec2 vUv; varying vec3 vN; varying vec3 vV;
        #include <fog_pars_vertex>
        void main() {
            vUv = uv;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            vV = -mvPosition.xyz;
            vN = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * mvPosition;
            #include <fog_vertex>
        }
    `;
    const palette = { white: Col("#fffdf6"), cream: Col("#f6efdc"), throat: Col("#c9d28c"), anther: Col("#7a3f22"), stem: Col("#4d6a2c"), stemLit: Col("#a3b56a") };
    const stemMatL = std({ color: 0x547232, roughness: 0.7 });

    /* ---------- Taç yaprağı: her karede yeniden şekillenen ızgara ---------- */
    const PU = LOW ? 24 : 40, PV = LOW ? 9 : 16; // düşük kalitede daha az çokgen
    function petalGeometry() {
        const pos = new Float32Array((PU + 1) * (PV + 1) * 3), uv = [], idx = [];
        for (let i = 0; i <= PU; i++) for (let j = 0; j <= PV; j++) uv.push(i / PU, (j / PV) * 2 - 1);
        for (let i = 0; i < PU; i++) for (let j = 0; j < PV; j++) {
            const a = i * (PV + 1) + j, b = a + PV + 1;
            idx.push(a, b, a + 1, b, b + 1, a + 1);
        }
        const g = new THREE.BufferGeometry();
        g.setIndex(idx);
        g.setAttribute("position", new THREE.BufferAttribute(pos, 3).setUsage(THREE.DynamicDrawUsage));
        g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
        return g;
    }
    /* bloom: 0 = uçları birleşmiş kapalı tomurcuk, 1 = tam açık.
       Taç yaprağının orta çizgisi eksenle yaptığı açıdan (r, y) düzleminde çizilir:
       - tomurcuk: tabandan hafif dışa, sonra uca doğru eksene kapanır (topuz)
       - açık: tabanda dar bir boru (trompet), ortada açılır, uçta geriye kıvrılır
       Yaprağın genişliği eksen etrafında yay olarak sarılır: tabanda yapraklar
       birbirine sarılıp boru olur, dışarıda düzleşir. */
    function shapePetal(g, o, bloom) {
        const pos = g.attributes.position.array;
        const e = bloom;
        const len = o.len * (0.8 + 0.2 * e);
        const ds = len / PU;
        let r = o.r0, y = 0;
        for (let i = 0; i <= PU; i++) {
            const u = i / PU;
            const aBud = 0.36 - 1.1 * Math.pow(u, 1.7);
            const aOpen = 0.2 + 0.85 * smooth(0.06, 0.45, u) + o.curl * Math.pow(smooth(0.55, 1, u), 1.4);
            const a = aBud + (aOpen - aBud) * e;
            const ca = Math.cos(a), sa = Math.sin(a);
            // dar taban, %55 civarında en geniş, sivri ama yumuşak uç
            const w = o.wid * Math.pow(Math.sin(Math.PI * Math.pow(u, 0.8)), 0.62) * (1 - 0.18 * u * u);
            const twist = o.twist * e * u * u;
            const lift = o.layer * (1 - 0.6 * e);
            for (let j = 0; j <= PV; j++) {
                const v = (j / PV) * 2 - 1;
                const av = Math.abs(v);
                // kesit: tabanda içe dönük oluk + orta damar çukuru; açık yaprağın kenarı uca doğru hafif geri kıvrılır, iç yapraklarda dalgalanır
                const cup = w * (o.cup * (1 - u) * v * v - 0.05 * e * smooth(0.45, 1, u) * av * av * av)
                    - 0.04 * w * Math.exp(-v * v * 30) * (1 - 0.5 * u) * (0.4 + 0.6 * e)
                    + o.ruffle * e * smooth(0.35, 1, u) * Math.sin(u * 24 + o.seed + v) * av * av * av * w;
                const rr = Math.max(0.004, r - ca * cup + lift);
                const yy = y + sa * cup;
                // genişliği eksen etrafında yay olarak sar
                const th = Math.max(-1.25, Math.min(1.25, (v * w) / Math.max(rr, 0.03)));
                const ang = o.phi + th + twist;
                const k = (i * (PV + 1) + j) * 3;
                pos[k] = rr * Math.cos(ang);
                pos[k + 1] = yy;
                pos[k + 2] = rr * Math.sin(ang);
            }
            r += sa * ds;
            y += ca * ds;
        }
        g.attributes.position.needsUpdate = true;
        g.computeVertexNormals();
    }
    const petalMaterial = () => new THREE.ShaderMaterial({
        uniforms: fogU({
            uWhite: { value: palette.white }, uCream: { value: palette.cream },
            uThroat: { value: Col("#d3dca6") }, uBud: { value: Col("#93a552") },
            uBloom: { value: 0 }, uGlow: { value: 0 }
        }),
        fog: true, side: THREE.DoubleSide,
        vertexShader: lilyVert,
        fragmentShader: `
            uniform vec3 uWhite, uCream, uThroat, uBud; uniform float uBloom, uGlow;
            varying vec2 vUv; varying vec3 vN; varying vec3 vV;
            #include <fog_pars_fragment>
            ${LIGHT}
            void main() {
                vec3 n = normalize(vN), v = normalize(vV);
                bool inner = gl_FrontFacing;
                if (!inner) n = -n;
                float u = vUv.x, s = abs(vUv.y);
                // krem tabandan saf beyaz uca
                vec3 col = mix(uCream, uWhite, smoothstep(0.3, 0.85, u));
                // boğaz: içte yeşil-sarı, dışta daha soluk
                float throat = 1.0 - smoothstep(0.03, 0.3, u);
                col = mix(col, uThroat, throat * (inner ? 0.85 : 0.5));
                // orta damar: dış yüzde yeşil çizgi (tomurcukta belirgin), içte nektar oluğu
                float rib = exp(-s * s * 55.0);
                float ribAmt = inner ? 0.28 * (1.0 - u) : mix(0.75, 0.32, uBloom) * (1.0 - 0.6 * smoothstep(0.5, 1.0, u));
                col = mix(col, inner ? uThroat : uBud, rib * ribAmt);
                // tomurcuk genel olarak yeşilimsi krem
                col = mix(col, mix(uBud, uCream, 0.18), (1.0 - smoothstep(0.0, 0.35, uBloom)) * 0.95 * (1.0 - 0.25 * u));
                // paralel ince damarlar
                float veins = smoothstep(0.6, 1.0, sin(s * 75.0 + sin(u * 7.0) * 1.6)) * (0.03 + 0.03 * (1.0 - u));
                col *= 1.0 - veins;
                // trompetin derinliği gölgede
                col *= mix(inner ? 0.58 : 0.78, 1.0, smoothstep(0.0, 0.45, u));
                vec3 c = lightIt(col, n, v, 1.0, uCream);
                c += uCream * uGlow * 0.04;
                gl_FragColor = vec4(c, 1.0);
            #include <fog_fragment>
            }
        `
    });

    /* ---------- Zambak: 3 dış + 3 iç taç yaprağı, 6 başçık, dişicik ---------- */
    const solidMat = (color, lit, trans = 0.3) => new THREE.ShaderMaterial({
        uniforms: fogU({ uCol: { value: color }, uLit: { value: lit } }),
        fog: true, vertexShader: lilyVert,
        fragmentShader: `
            uniform vec3 uCol, uLit; varying vec2 vUv; varying vec3 vN; varying vec3 vV;
            #include <fog_pars_fragment>
            ${LIGHT}
            void main() {
                vec3 n = normalize(vN), v = normalize(vV);
                if (!gl_FrontFacing) n = -n;
                gl_FragColor = vec4(lightIt(uCol, n, v, ${trans.toFixed(2)}, uLit), 1.0);
            #include <fog_fragment>
            }
        `
    });
    const filamentMat = solidMat(Col("#cfdba0"), palette.cream, 0.6);
    const antherMat = solidMat(Col("#5e2516"), Col("#a8583a"), 0.1);
    const pistilMat = solidMat(Col("#b5c46e"), palette.cream, 0.5);
    const lilyStemMat = solidMat(palette.stem, palette.stemLit);

    // Hafif kavisli ince sap (başçık / dişicik): taban → uç, dışa doğru eğilir
    function stalkGeometry(r0, r1, bend) {
        const curve = new THREE.QuadraticBezierCurve3(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0.55, bend * 0.15), new THREE.Vector3(0, 1, bend));
        const g = new THREE.TubeGeometry(curve, 16, 1, 6, false);
        // yarıçapı uca doğru incelt
        const p = g.attributes.position, c = new THREE.Vector3(), q = new THREE.Vector3();
        for (let i = 0; i <= 16; i++) {
            curve.getPointAt(i / 16, c);
            const rad = r0 + (r1 - r0) * (i / 16);
            for (let j = 0; j <= 6; j++) {
                const k = i * 7 + j;
                q.fromBufferAttribute(p, k).sub(c).multiplyScalar(rad).add(c);
                p.setXYZ(k, q.x, q.y, q.z);
            }
        }
        g.computeVertexNormals();
        return { g, tip: curve.getPointAt(1) };
    }

    function createLily(size) {
        const head = new THREE.Group();
        const petalMat = petalMaterial();
        const petals = [];
        for (let k = 0; k < 6; k++) {
            const outer = k % 2 === 0;
            const g = petalGeometry();
            head.add(new THREE.Mesh(g, petalMat));
            petals.push({
                g, phi: (k / 6) * Math.PI * 2,
                len: (outer ? 1.5 : 1.45) * size, wid: (outer ? 0.4 : 0.5) * size,
                r0: (outer ? 0.062 : 0.05) * size, layer: (outer ? 0.014 : -0.004) * size,
                curl: outer ? 0.6 : 0.45, cup: outer ? 0.22 : 0.3,
                ruffle: outer ? 0.012 : 0.035, twist: (k % 3 - 1) * 0.08, seed: k * 1.9
            });
        }
        const stamens = [];
        const fil = stalkGeometry(0.011 * size, 0.006 * size, 0.18);
        // başçık: uca dik oturan uzun kapsül (T biçimi)
        const antGeo = new THREE.SphereGeometry(0.038 * size, 12, 8);
        antGeo.scale(0.55, 0.55, 2.1);
        for (let k = 0; k < 6; k++) {
            const pivot = new THREE.Group();
            pivot.rotation.y = -(k / 6) * Math.PI * 2 + Math.PI / 2 + 0.3;
            const tilt = new THREE.Group();
            const f = new THREE.Mesh(fil.g, filamentMat);
            const ant = new THREE.Mesh(antGeo, antherMat);
            ant.rotation.y = Math.PI / 2;
            tilt.add(f, ant);
            pivot.add(tilt);
            head.add(pivot);
            stamens.push({ tilt, f, ant, len: (0.95 + (k % 3) * 0.06) * size });
        }
        const sty = stalkGeometry(0.016 * size, 0.012 * size, -0.08);
        const pistil = new THREE.Mesh(sty.g, pistilMat);
        // üç loblu tepecik
        const stigma = new THREE.Group();
        const lobeGeo = new THREE.SphereGeometry(0.03 * size, 10, 8);
        for (let k = 0; k < 3; k++) {
            const lobe = new THREE.Mesh(lobeGeo, pistilMat);
            const a = (k / 3) * Math.PI * 2;
            lobe.position.set(Math.cos(a) * 0.022 * size, 0, Math.sin(a) * 0.022 * size);
            stigma.add(lobe);
        }
        head.add(pistil, stigma);
        // yeşil boyun (çiçek sapına bağlanır)
        const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.075 * size, 0.045 * size, 0.4 * size, 14), lilyStemMat);
        neck.position.y = -0.15 * size;
        head.add(neck);

        let last = -1;
        return {
            head,
            material: petalMat,
            update(bloom) {
                if (Math.abs(bloom - last) < 0.0008) return;
                last = bloom;
                petalMat.uniforms.uBloom.value = bloom;
                petals.forEach((p) => shapePetal(p.g, p, bloom));
                const open = smooth(0.15, 1, bloom);
                const show = bloom > 0.2;
                stamens.forEach((s, i) => {
                    const L = s.len * 0.8 * (0.5 + 0.5 * open);
                    s.tilt.rotation.x = 0.05 + open * (0.42 + (i % 2) * 0.08);
                    s.f.scale.setScalar(L);
                    s.ant.position.set(0, L, 0.18 * L);
                    s.f.visible = s.ant.visible = show;
                });
                const pl = size * (0.5 + 0.48 * open);
                pistil.scale.setScalar(pl);
                stigma.position.set(0, pl, -0.08 * pl);
                pistil.visible = stigma.visible = show;
            }
        };
    }



    /* ======================================================================
       SAHNE KOMPOZİSYONU: zambaklar, platform, iskele, minder, vazolar, mum
       ====================================================================== */
    const groundY = (x, z) => Math.max(heightAt(x, z), WATER_Y + 0.05);
    const lilies = [];
    function lilyPlant(x, z, o = {}) {
        const height = o.height || 3, size = o.size || 1, lean = o.lean || [0.3, 0.1], y0 = o.y != null ? o.y : groundY(x, z);
        const g = new THREE.Group(); g.position.set(x, y0, z);
        const cv = new THREE.CatmullRomCurve3([V3(0, -0.4, 0), V3(lean[0] * 0.15, height * 0.35, lean[1] * 0.15), V3(lean[0] * 0.55, height * 0.72, lean[1] * 0.55), V3(lean[0], height, lean[1])]);
        g.add(new THREE.Mesh(taperTube(cv, 28, 6, (u) => 0.055 * size * (1 - u * 0.45)), stemMatL));
        // dar, uzun lilyum yaprakları gövde boyunca spiral dizilir
        const items = [], nb = Math.round((7 + height * 2) * (LOW ? 0.7 : 1));
        for (let i = 0; i < nb; i++) {
            const f = 0.06 + (i / nb) * 0.66, a = i * 2.4, p = cv.getPointAt(f);
            items.push({ p: p.clone().add(g.position), dir: V3(Math.cos(a), 0.55 + f * 0.4, Math.sin(a)), s: size * rr(1.5, 2.3) * (1 - f * 0.45), w: 0.5, c: leafColor(-0.06) });
        }
        leafCluster(items);
        const tip = cv.getPointAt(1);
        const main = createLily(size);
        const holder = new THREE.Group(); holder.position.copy(tip); holder.rotation.set(o.tilt != null ? o.tilt : 1.32, o.yaw || 0, o.roll || -0.12); holder.add(main.head); g.add(holder);
        const entry = { lily: main, holder, pos: new THREE.Vector3(x, y0 + height, z), cur: -1, base: o.base != null ? o.base : 0 };
        lilies.push(entry);
        // yan dalda tomurcuk(lar) ve ikinci çiçek
        for (let k = 0; k < Math.min(o.buds != null ? o.buds : 2, LOW ? 1 : 9); k++) {
            const f = 0.55 + k * 0.17, bp = cv.getPointAt(f), dirx = (k % 2 ? -1 : 1) * (0.55 + 0.2 * k);
            const bc = new THREE.CatmullRomCurve3([bp, bp.clone().add(V3(dirx * 0.25, 0.1 * size, 0.05)), bp.clone().add(V3(dirx * 0.55, 0.32 * size, 0.1))]);
            g.add(new THREE.Mesh(taperTube(bc, 8, 5, () => 0.03 * size), stemMatL));
            const bud = createLily(size * (k ? 0.58 : 0.72));
            const bh = new THREE.Group(); bh.position.copy(bc.getPointAt(1)); bh.rotation.set(0.5, 0, -dirx * 0.8); bh.add(bud.head); g.add(bh);
            const e2 = { lily: bud, holder: bh, pos: new THREE.Vector3(x + dirx * 0.55, y0 + height * f + 0.3, z), cur: -1, base: k ? 0 : 0.0, onlyNear: true, cap: k ? 0.0 : 0.55 };
            lilies.push(e2);
        }
        world.add(g);
        return entry;
    }
    // Hero: arka plandaki platformun sağındaki büyük lilyumlar
    lilyPlant(5.2, -3.6, { height: 4.4, size: 1.3, lean: [0.7, 0.3], buds: 2 });
    lilyPlant(7.0, -1.9, { height: 2.6, size: 0.8, lean: [-0.3, 0.4], buds: 1, tilt: 1.15 });
    lilyPlant(3.3, -2.0, { height: 1.7, size: 0.62, lean: [0.2, 0.1], buds: 0, tilt: 1.05 });
    // Halka sahnesi
    lilyPlant(9.4, -29.5, { height: 3.0, size: 1.0, lean: [-0.4, 0.4], buds: 2 });
    lilyPlant(-0.4, -30.2, { height: 2.3, size: 0.75, lean: [0.3, 0.3], buds: 1 });
    // Felsefe sahnesi: sol ön planda iri lilyum
    lilyPlant(-1.6, -56.2, { height: 4.9, size: 2.0, lean: [0.7, -0.4], buds: 2, tilt: 1.22 });
    lilyPlant(-4.4, -53.4, { height: 3.4, size: 1.4, lean: [0.8, 0.0], buds: 1 });
    lilyPlant(0.9, -59.8, { height: 2.4, size: 1.0, lean: [0.2, 0.0], buds: 1 });
    lilyPlant(8.9, -66.2, { height: 2.2, size: 0.9, lean: [-0.3, 0.2], buds: 1, y: 0.1 });
    lilies.forEach((l) => l.lily.update(0));

    /* ---------- Malzemeler: seramik, kumaş, kitap, balmumu ---------- */
    const clayMat = std({ map: stoneMap, color: 0xf0dcb4, roughness: 0.92 });
    const waxMat = std({ color: 0xf3e6c8, roughness: 0.6 });
    const flameTex = softTex();
    function lathe(profile, seg = 28) { return new THREE.LatheGeometry(profile.map((p) => new THREE.Vector2(p[0], p[1])), seg); }
    function vase(x, y, z, s, kind = 0) {
        const prof = kind ? [[0.001, 0], [0.5, 0.02], [0.78, 0.35], [0.82, 0.8], [0.58, 1.25], [0.34, 1.55], [0.4, 1.78], [0.46, 1.85], [0.4, 1.9]] : [[0.001, 0], [0.55, 0.02], [0.92, 0.4], [1.0, 0.85], [0.74, 1.35], [0.5, 1.6], [0.52, 1.75], [0.44, 1.8]];
        const m = new THREE.Mesh(lathe(prof), clayMat); m.position.set(x, y, z); m.scale.setScalar(s); world.add(m); return m;
    }
    function cushion(x, y, z, sx, sy, sz, rot = 0) {
        const g = new THREE.SphereGeometry(1, 32, 20), p = g.attributes.position;
        for (let i = 0; i < p.count; i++) {
            const px = p.getX(i), py = p.getY(i), pz = p.getZ(i), edge = 1 - Math.abs(py);
            const pinch = 1 - 0.10 * Math.pow(edge, 3) - 0.16 * Math.pow(Math.max(0, Math.abs(py) - 0.78), 2) * 8;
            p.setXYZ(i, px * sx * pinch, py * sy, pz * sz * pinch);
        }
        g.computeVertexNormals();
        const m = new THREE.Mesh(g, fabricMat); m.position.set(x, y, z); m.rotation.y = rot; world.add(m); return m;
    }
    function book(x, y, z, w, h, d, color, rot) {
        const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), std({ color, roughness: 0.8 })); m.position.set(x, y, z); m.rotation.y = rot; world.add(m);
        const pages = new THREE.Mesh(new THREE.BoxGeometry(w * 0.96, h * 0.82, d * 0.97), std({ color: 0xefe3c8, roughness: 0.95 })); pages.position.set(x, y, z + d * 0.02); pages.rotation.y = rot; world.add(pages);
    }
    function flame(x, y, z, scale = 1) {
        const f = new THREE.Sprite(new THREE.SpriteMaterial({ map: flameTex, color: 0xffb35c, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }));
        f.position.set(x, y, z); f.scale.set(0.5 * scale, 0.75 * scale, 1); world.add(f);
        const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: flameTex, color: 0xff9a40, transparent: true, opacity: 0.4, depthWrite: false, blending: THREE.AdditiveBlending, fog: false }));
        glow.position.set(x, y, z); glow.scale.set(2.6 * scale, 2.6 * scale, 1); world.add(glow);
        return [f, glow];
    }
    function candle(x, y, z, h = 0.55) {
        const m = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.15, h, 18), waxMat); m.position.set(x, y + h / 2, z); world.add(m);
        return flame(x, y + h + 0.12, z);
    }

    /* ---------- Hero platformu: ahşap kürsü, minder, mum, kitaplar ---------- */
    const heroFlames = [], endFlames = [];
    const PF = { x: -0.6, z: -9.5, y: groundY(-0.6, -9.5) };
    (function heroDais() {
        const slab = new THREE.Mesh(new THREE.BoxGeometry(9.4, 0.7, 5.6), plankMat); slab.position.set(PF.x, PF.y + 0.18, PF.z); slab.rotation.y = 0.07; world.add(slab);
        const step = new THREE.Mesh(new THREE.BoxGeometry(10.2, 0.4, 6.3), plankMat); step.position.set(PF.x, PF.y - 0.05, PF.z); step.rotation.y = 0.07; world.add(step);
        const top = PF.y + 0.55;
        cushion(PF.x + 0.9, top + 0.42, PF.z - 0.2, 1.55, 0.5, 1.25, 0.3);
        cushion(PF.x - 1.2, top + 0.22, PF.z + 0.5, 1.2, 0.26, 1.7, -0.25);
        // uzun oturma kanepesi (referanstaki yuvarlak köşeli yastıklı bank)
        const sofa = new THREE.Mesh(new THREE.BoxGeometry(5.6, 0.5, 1.7), fabricMat); sofa.position.set(PF.x - 0.8, top + 0.28, PF.z - 1.3); world.add(sofa);
        const back = new THREE.Mesh(new THREE.BoxGeometry(5.6, 0.7, 0.35), fabricMat); back.position.set(PF.x - 0.8, top + 0.78, PF.z - 2.0); world.add(back);
        book(PF.x + 2.6, top + 0.07, PF.z + 0.9, 0.9, 0.14, 0.62, 0x6b4a2e, 0.4);
        book(PF.x + 2.64, top + 0.21, PF.z + 0.95, 0.82, 0.14, 0.58, 0x8a9a5a, 0.1);
        book(PF.x + 2.58, top + 0.35, PF.z + 0.9, 0.74, 0.12, 0.54, 0xcdb68a, 0.55);
        const fl = candle(PF.x + 2.6, top + 0.42, PF.z + 0.9, 0.5);
        candleLight.position.set(PF.x + 2.6, top + 1.2, PF.z + 0.9);
        heroFlames.push(...fl);
        vase(PF.x - 3.6, top, PF.z + 0.4, 0.55, 1);
    })();

    /* ---------- İskele (göl kenarı): ahşap kaplamalar ve kazıklar ---------- */
    const DOCK = { x0: 4.4, x1: 7.0, z0: -41, z1: -67, y: 0.12 };
    (function dock() {
        const planks = [], posts = [];
        const n = Math.round((DOCK.z0 - DOCK.z1) / 0.56);
        for (let i = 0; i < n; i++) {
            const z = DOCK.z0 - i * 0.56, x = lerp(DOCK.x0, DOCK.x1, i / n);
            const g = new THREE.BoxGeometry(3.6 + rr(-0.15, 0.15), 0.14, 0.5); g.rotateY(rr(-0.025, 0.025)); g.translate(x, DOCK.y + rr(-0.01, 0.02), z);
            planks.push(g);
            if (i % 7 === 0) { [-1.7, 1.7].forEach((sx) => { const p = new THREE.CylinderGeometry(0.17, 0.2, 3.4, 8); p.translate(x + sx, DOCK.y - 1.5, z); posts.push(p); }); }
        }
        world.add(new THREE.Mesh(merge(planks), plankMat));
        world.add(new THREE.Mesh(merge(posts), woodMat));
        // iskele sonundaki geniş teras: minder, vazolar, mum
        const tx = 7.0, tz = -65.2, ty = DOCK.y + 0.08;
        const terrace = new THREE.Mesh(new THREE.BoxGeometry(6.2, 0.2, 4.6), plankMat); terrace.position.set(tx + 0.4, DOCK.y - 0.04, tz); terrace.rotation.y = -0.12; world.add(terrace);
        cushion(tx + 0.2, ty + 0.4, tz + 0.4, 1.6, 0.48, 1.3, 0.2);
        cushion(tx - 1.7, ty + 0.24, tz - 0.4, 1.1, 0.3, 1.5, -0.3);
        vase(tx + 2.4, ty, tz - 0.9, 0.95, 0); vase(tx + 1.4, ty, tz - 1.7, 0.6, 1); vase(tx - 2.6, ty, tz + 1.4, 0.5, 1);
        book(tx - 0.6, ty + 0.07, tz + 1.5, 0.9, 0.14, 0.62, 0x6b4a2e, -0.3); book(tx - 0.62, ty + 0.21, tz + 1.5, 0.8, 0.14, 0.56, 0xcdb68a, 0.2);
        endFlames.push(...candle(tx - 0.5, ty + 0.36, tz + 1.5, 0.45));
    })();

    /* ---------- Zemin bitkileri: eğreltiler, otlar, çalılar (yol boyunca ve kenarlarda) ---------- */
    (function undergrowth() {
        const items = [];
        const clump = (cx, cz, n, big) => {
            const y = groundY(cx, cz);
            for (let i = 0; i < n; i++) {
                const a = rnd() * 6.283, d = rnd() * big * 0.7;
                items.push({ p: V3(cx + Math.cos(a) * d, y - 0.05, cz + Math.sin(a) * d), dir: V3(Math.cos(a) * rr(0.35, 1.1), rr(0.9, 1.7), Math.sin(a) * rr(0.35, 1.1)), s: rr(0.8, 1.5) * big, w: rr(0.45, 0.9), c: leafColor(rr(-0.05, 0.2)) });
            }
        };
        const clumps = Math.round(62 * Q);
        for (let i = 0; i < clumps; i++) {
            // yolun iki yanı: kamera koridorundan uzak dur
            const side = rnd() < 0.5 ? -1 : 1, z = rr(15, -40), px = 1.5 + Math.sin(z * 0.08) * 2 + (z < -10 ? 1.5 : 0);
            const x = px + side * (rr(3.2, 22) + (rnd() < 0.3 ? rr(0, 14) : 0));
            clump(x, z, Math.round(rr(9, 16) * (LOW ? 0.8 : 1)), rr(0.8, 1.9));
        }
        // iskele ve göl kıyısı: sazlıklar
        for (let i = 0; i < Math.round(26 * Q); i++) { const z = rr(-40, -58), x = rr(-8, 4) - (rnd() < 0.4 ? rr(0, 12) : 0); clump(x, z, 8, 1.3); }
        // ince, uzun otlar (hero platformunun çevresi)
        for (let i = 0; i < Math.round(220 * Q); i++) { const a = rnd() * 6.283, d = rr(2, 15), x = PF.x + Math.cos(a) * d * 1.6, z = PF.z + Math.sin(a) * d; if (Math.abs(x - 1.6) < 3.4 && z > PF.z - 6) continue; items.push({ p: V3(x, groundY(x, z) - 0.05, z), dir: V3(rr(-0.35, 0.35), 1, rr(-0.35, 0.35)), s: rr(0.9, 2.2), w: 0.18, c: leafColor(rr(0.0, 0.3)) }); }
        leafCluster(items);
    })();

    /* ---------- Rüzgârda dalgalanan perde (kemerin sağ kolundan sarkar) ---------- */
    const cloths = [];
    function curtain(x, topY, z, w, h, op) {
        const SXs = LOW ? 12 : 22, SYs = LOW ? 22 : 40;
        const g = new THREE.PlaneGeometry(w, h, SXs, SYs);
        const base = g.attributes.position.array.slice();
        const mat = clothMat.clone(); mat.opacity = op;
        const m = new THREE.Mesh(g, mat); m.position.set(x, topY - h / 2, z);
        world.add(m); cloths.push({ g, base, h, w, m, SX: SXs, SY: SYs });
    }
    curtain(10.2, 9.0, -1.4, 3.0, 10.2, 0.55);
    curtain(6.6, 9.2, -16.6, 2.6, 10.0, 0.5);
    function updateCloth(time, wind) {
        cloths.forEach((c, ci) => {
            const p = c.g.attributes.position;
            for (let i = 0; i < p.count; i++) {
                const bx = c.base[i * 3], by = c.base[i * 3 + 1], f = clamp01((c.h / 2 - by) / c.h);
                const w1 = Math.sin(time * 0.9 + bx * 0.9 + f * 3.2 + ci) * 0.45 * f;
                const w2 = Math.sin(time * 1.7 + f * 7 + bx * 2) * 0.08 * f;
                const pleat = Math.sin(bx * 5.6 + f * 0.7) * 0.2 * Math.sqrt(f) + Math.sin(bx * 2.3 + time * 0.5) * 0.25 * f * f;
                p.setXYZ(i, bx + Math.sin(time * 0.6 + f * 2.4) * 0.3 * f - f * 0.3 + wind * 0.4 * f, by, c.base[i * 3 + 2] + w1 + w2 + pleat + wind * 0.5 * f);
            }
            p.needsUpdate = true; c.g.computeVertexNormals();
        });
    }

    /* ---------- Işık huzmeleri: sağ üstten süzülen sıcak ışık sütunları ---------- */
    const shafts = new THREE.Group();
    scene.add(shafts);
    const shaftTexture = shaftTex();
    const shaftList = [];
    for (let i = 0; i < (LOW ? 4 : 7); i++) {
        const m = new THREE.Mesh(new THREE.PlaneGeometry(rr(2.2, 5.4), 52), new THREE.MeshBasicMaterial({ map: shaftTexture, color: 0xffe2b0, transparent: true, opacity: 0.14, depthWrite: false, blending: THREE.AdditiveBlending, fog: false, side: THREE.DoubleSide }));
        m.position.set(rr(-6, 14), rr(6, 12), rr(-30, -8));
        m.rotation.set(0, rr(-0.6, 0.6), -0.62 + rr(-0.12, 0.12)); m.renderOrder = 9;
        shafts.add(m); shaftList.push({ m, base: rr(0.08, 0.2), ph: rnd() * 6 });
    }

    /* ---------- Toz ve polen: sahneye sabitlenmiş, kendi kendine süzülen parçacıklar ---------- */
    const dustCount = Math.round(1100 * Q);
    const dustPos = new Float32Array(dustCount * 3), dustSeed = new Float32Array(dustCount);
    for (let i = 0; i < dustCount; i++) { dustPos.set([rr(-26, 30), rr(-0.5, 16), rr(18, -86)], i * 3); dustSeed[i] = rnd(); }
    const dustGeo = new THREE.BufferGeometry();
    dustGeo.setAttribute("position", new THREE.BufferAttribute(dustPos, 3));
    dustGeo.setAttribute("aSeed", new THREE.BufferAttribute(dustSeed, 1));
    const dustMat = new THREE.ShaderMaterial({
        uniforms: { uTime: U.uTime, uPR: { value: renderer.getPixelRatio() }, uCol: { value: Col("#ffe6b8") } },
        transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false,
        vertexShader: `
            uniform float uTime, uPR; attribute float aSeed; varying float vA;
            void main(){
                vec3 p = position;
                p.x += sin(uTime * (0.10 + aSeed * 0.12) + aSeed * 40.0) * 1.6;
                p.y += sin(uTime * (0.14 + aSeed * 0.1) + aSeed * 17.0) * 1.1 + mod(uTime * (0.05 + aSeed * 0.07), 3.0);
                p.z += cos(uTime * 0.09 + aSeed * 23.0) * 1.4;
                vec4 mv = modelViewMatrix * vec4(p, 1.0);
                float d = -mv.z;
                gl_PointSize = (2.0 + aSeed * 4.5) * uPR * (22.0 / max(d, 1.0));
                vA = (0.22 + 0.5 * aSeed) * smoothstep(1.0, 5.0, d) * (1.0 - smoothstep(30.0, 60.0, d)) * (0.55 + 0.45 * sin(uTime * (0.7 + aSeed) + aSeed * 30.0));
                gl_Position = projectionMatrix * mv;
            }`,
        fragmentShader: `uniform vec3 uCol; varying float vA; void main(){ float d = length(gl_PointCoord - 0.5); gl_FragColor = vec4(uCol * smoothstep(0.5, 0.0, d) * vA, 1.0); }`
    });
    scene.add(new THREE.Points(dustGeo, dustMat));

    /* ---------- Ön plan: kameraya bağlı bulanık yapraklar ve bokeh (referanstaki sol kenar) ---------- */
    const fg = new THREE.Group();
    camera.add(fg);
    const blurTex = blurLeafTex();
    const fgLeaves = [];
    [[-1.02, 0.35, -1.5, 0.35, 1.35, 0.62], [-0.95, -0.55, -1.25, 0.9, 1.15, 0.58], [-1.08, 1.0, -1.9, 0.0, 1.5, 0.6], [-0.78, 0.0, -2.2, 0.55, 1.2, 0.5], [-0.25, -1.18, -1.6, -2.5, 1.2, 0.6], [0.7, -1.22, -1.8, -2.7, 1.25, 0.6]].forEach(([fx, fy, fz, rz, sc, ar], i) => {
        const m = new THREE.Mesh(new THREE.PlaneGeometry(1.0 * ar, 2.0), new THREE.MeshBasicMaterial({ map: blurTex, color: i % 2 ? 0x1b2b13 : 0x28391b, transparent: true, opacity: 0.62, depthWrite: false, fog: false }));
        m.userData = { fx, fy, fz, rz, sc, ph: rnd() * 6 };
        fg.add(m); fgLeaves.push(m);
    });
    const bokeh = [];
    for (let i = 0; i < (LOW ? 5 : 10); i++) {
        const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: softTex(), color: i % 3 ? 0xf3e2a8 : 0xb9c98a, transparent: true, opacity: rr(0.1, 0.26), depthWrite: false, blending: THREE.AdditiveBlending, fog: false }));
        const sc = rr(0.35, 1.0); s.scale.set(sc, sc, 1); s.userData = { x: rr(-1, 1), y: rr(-1, 0.2), z: rr(-4.6, -2.6), ph: rnd() * 6 };
        fg.add(s); bokeh.push(s);
    }

    /* ======================================================================
       KAMERA YOLU: kaydırdıkça sahnenin içinde ilerler
       ====================================================================== */
    const posCurve = new THREE.CatmullRomCurve3([
        [-1.0, 1.9, 13], [0.5, 2.0, 6.5], [1.8, 2.3, 0.5], [2.8, 2.5, -8], [3.6, 2.8, -17], [4.4, 3.4, -26],
        [4.8, 4.4, -34.5], [4.4, 3.4, -44], [2.4, 2.6, -52], [1.6, 2.4, -58.5], [1.2, 2.4, -66], [1.0, 2.7, -74]
    ].map((a) => V3(a[0], a[1], a[2])), false, "catmullrom", 0.5);
    const lookCurve = new THREE.CatmullRomCurve3([
        [2.2, 2.7, -6], [2.6, 2.9, -12], [3.0, 3.2, -20], [3.6, 3.6, -30], [4.0, 4.2, -40], [4.2, 4.8, -50],
        [4.0, 4.6, -60], [3.0, 3.8, -70], [4.2, 3.5, -78], [5.2, 3.5, -86], [4.5, 3.7, -96], [4.2, 5.0, -106]
    ].map((a) => V3(a[0], a[1], a[2])), false, "catmullrom", 0.5);
    // Her sayfa dünyanın farklı bir bölümünden girer
    const RANGES = { home: [0, 1], about: [0.12, 0.5], resume: [0.3, 0.62], projects: [0.44, 0.76], blog: [0.06, 0.9], contact: [0.68, 1] };
    let RANGE = RANGES[page] || [0, 1];
    // Sayfa değişince (js/router.js) kamera yeni bölgeye kesmeden süzülür
    let glideFrom = null, glideT0 = 0, lastTT = 0;

    let sp = 0, target = 0, time = 0, wind = 0, lastScrollY = window.scrollY, dirty = true, visible = true, last = performance.now(), firstDone = false;
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const readScroll = () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        target = max > 0 ? clamp01(window.scrollY / max) : 0;
        wind = clamp(wind + (window.scrollY - lastScrollY) * 0.004, -1, 1);
        lastScrollY = window.scrollY; dirty = true;
    };
    window.addEventListener("scroll", readScroll, { passive: true });
    window.addEventListener("mousemove", (e) => { mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2; mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2; });
    document.addEventListener("visibilitychange", () => { visible = !document.hidden; last = performance.now(); });
    canvas.addEventListener("webglcontextlost", (e) => { e.preventDefault(); root.classList.add("no-webgl"); });
    window.addEventListener("resize", () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.fov = camera.aspect < 1 ? Math.min(78, 46 + (1 / camera.aspect - 1) * 24) : 46; // dikey ekranda daha geniş açı
        camera.updateProjectionMatrix(); dirty = true;
    });
    window.dispatchEvent(new Event("resize"));
    readScroll();

    const camPos = new THREE.Vector3(), camLook = new THREE.Vector3();
    function frame(now) {
        requestAnimationFrame(frame);
        if (!visible) return;
        const dt = Math.min(0.05, (now - last) / 1000); last = now;
        if (!reduce) time += dt;
        sp += (target - sp) * (1 - Math.exp(-dt * 3.2));
        const settled = Math.abs(target - sp) < 1e-4;
        if (settled) sp = target;
        if (reduce && settled && !dirty && firstDone) return;
        dirty = false;
        wind *= Math.pow(0.12, dt);
        U.uTime.value = time; U.uWind.value += (wind - U.uWind.value) * Math.min(1, dt * 4);
        mouse.x += (mouse.tx - mouse.x) * Math.min(1, dt * 2.4); mouse.y += (mouse.ty - mouse.y) * Math.min(1, dt * 2.4);

        let tt = lerp(RANGE[0], RANGE[1], sp);
        if (glideFrom !== null) {
            const gk = smooth(0, 1, (performance.now() / 1000 - glideT0) / 2.6);
            tt = lerp(glideFrom, tt, gk);
            if (gk >= 1) glideFrom = null;
        }
        if (typeof window.__worldT === "number") tt = window.__worldT; // test / hata ayıklama
        lastTT = tt;
        posCurve.getPoint(clamp01(tt), camPos); lookCurve.getPoint(clamp01(tt), camLook);
        if (!reduce) { camPos.x += Math.sin(time * 0.31) * 0.1; camPos.y += Math.sin(time * 0.43) * 0.06; }
        camPos.x += mouse.x * 0.32; camPos.y -= mouse.y * 0.16;
        camLook.x += mouse.x * 0.55; camLook.y -= mouse.y * 0.3;
        camera.position.copy(camPos); camera.lookAt(camLook);

        const env = applyEnv(clamp01(tt));
        sceneNav.style.setProperty("--p", sp.toFixed(3));
        const scene3 = Math.min(2, Math.floor(sp * 3 + 0.0001));
        sceneItems.forEach((el, i) => el.classList.toggle("on", i === scene3));
        sky.position.copy(camera.position); shafts.position.copy(camera.position);
        shaftList.forEach((s) => { s.m.material.opacity = s.base * (0.7 + 0.3 * Math.sin(time * 0.35 + s.ph)) * (0.55 + 0.45 * smooth(0.0, 0.2, 1 - Math.abs(tt - 0.55) * 1.2)); });

        // mum alevi: titreşir, ışığı kameraya yaklaşınca belirir
        const dCandle = camera.position.distanceTo(candleLight.position);
        candleLight.intensity = (1.0 + Math.sin(time * 9.3) * 0.12 + Math.sin(time * 5.1) * 0.08) * (1 - smooth(10, 26, dCandle)) * 1.5;
        [heroFlames, endFlames].forEach((fl, gi) => fl.forEach((sp2, i) => { const f = 1 + Math.sin(time * (8 + i * 3 + gi) + i) * 0.07; if (i === 0) sp2.scale.set(0.5 * f, 0.75 * (f + 0.02), 1); }));

        // zambaklar: kamera yaklaştıkça açılır, hafif nefes alır
        lilies.forEach((e) => {
            const d = camera.position.distanceTo(e.pos);
            let b = e.onlyNear ? (e.cap || 0) * smooth(30, 8, d) : 0.12 + 0.88 * smooth(42, 13, d);
            b += Math.sin(time * 0.78 + e.pos.x) * 0.015 * b;
            e.cur = e.cur < 0 ? b : lerp(e.cur, b, 1 - Math.exp(-dt * 2));
            if (e.last === undefined || Math.abs(e.cur - e.last) > 0.004) { e.lily.update(clamp01(e.cur)); e.last = e.cur; }
        });
        if (!reduce) updateCloth(time, U.uWind.value);

        // ön plan: bulanık yapraklar ve bokeh kameraya sabit kalır
        const halfT = Math.tan((camera.fov * Math.PI) / 360);
        fgLeaves.forEach((m) => {
            const u = m.userData, hh = halfT * Math.abs(u.fz), hw = hh * camera.aspect;
            m.position.set(u.fx * hw * 0.92 + Math.sin(time * 0.35 + u.ph) * 0.03, u.fy * hh + Math.cos(time * 0.3 + u.ph) * 0.02, u.fz);
            m.rotation.z = u.rz + Math.sin(time * 0.4 + u.ph) * 0.05;
            const sc = u.sc * 0.8 * (Math.abs(u.fz) / 1.5) * (camera.aspect < 1 ? 0.7 : 1);
            m.scale.set(sc, sc, 1);
            m.material.opacity = (LOW ? 0.5 : 0.62) * (0.8 + 0.2 * Math.sin(time * 0.2 + u.ph));
        });
        bokeh.forEach((s) => { const u = s.userData; s.position.set((u.x + Math.sin(time * 0.12 + u.ph) * 0.1) * halfT * Math.abs(u.z) * camera.aspect, (u.y + Math.cos(time * 0.1 + u.ph) * 0.08) * halfT * Math.abs(u.z), u.z); });

        renderer.render(scene, camera);
        if (!firstDone) { firstDone = true; root.classList.add("world-ready"); }
    }
    requestAnimationFrame(frame);
    // Yeni sayfa: kaydırma konumu sıfırlanır, kamera o sayfanın bölgesine süzülür
    window.World = {
        setPage(p) {
            glideFrom = lastTT; glideT0 = performance.now() / 1000;
            RANGE = RANGES[p] || [0, 1];
            sp = 0; target = 0; wind = 0; lastScrollY = window.scrollY;
            readScroll(); dirty = true;
        }
    };
    window.__world = { setT: (t) => { window.__worldT = t; dirty = true; }, scene, camera, renderer, stats: () => renderer.info.render };
})();
