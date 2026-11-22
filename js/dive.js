/* ==========================================================================
   Tablonun içine dalış (Ana Sayfa)
   Kaydırdıkça kamera üç tablo boyunca kesintisiz ilerler:
     1) Giovanni Paolo Panini, "Galerie de vues de la Rome moderne" (Louvre, 1759; kamu malı)
        — galeride ilerlenir, sol alttaki Navona Meydanı tablosuna yaklaşılır.
     2) Hubert Robert, "Landscape with an Arch and the Dome of St Peter's" (Ermitaj; kamu malı)
        — Navona tablosu mürekkep gibi dağılarak bu tabloya dönüşür, kemerin açıklığına yaklaşılır.
     3) Thomas Cole, "Italian Coast Scene with Ruined Tower" (1838, NGA; CC0)
        — açıklıktaki manzara Cole'un kıyısına dönüşür, kamera kemerin içinden geçer.
   Her tablonun derinlik haritası (Depth Anything V2) fareyle ve kaydırmayla hafif 3D kayma verir.
   Yalnızca tek WebGL tuvali, yalnızca gerektiğinde çizim, DPR en fazla 1.5.
   Yakın duraklarda yüksek çözünürlüklü kesitler (Panini: Navona çevresi; Robert: kemer çevresi) kullanılır.
   ========================================================================== */

(function () {
    if (typeof THREE === "undefined") return;
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ---------- Sahne geometrisi (dünya birimi = Panini pikseli / genişlik; Y aşağı) ---------- */
    const PW = 10587, PH = 7882, HR = PH / PW;
    const px = (x, y, w, h) => [x / PW, y / PW, w / PW, h / PW];
    const CROP = px(300, 4750, 1850, 2700);              // Panini yüksek çözünürlük kesiti
    const F = px(597, 5086, 1248, 2038);                 // Navona tablosunun çerçeve içi
    const RA = 7376 / 11712;                             // Robert en/boy
    const R = [F[0] + (F[2] - F[3] * RA) / 2, F[1], F[3] * RA, F[3]];
    const RHI = [0.0999, 0.18, 0.66 - 0.0999, 0.80 - 0.18]; // Robert yüksek çözünürlük kesiti (Robert koordinatı)
    const OPEN_N = [0.156, 0.216, 0.6, 0.758];           // kemer açıklığı (Robert koordinatı)
    const O = [R[0] + OPEN_N[0] * R[2], R[1] + OPEN_N[1] * R[3], (OPEN_N[2] - OPEN_N[0]) * R[2], (OPEN_N[3] - OPEN_N[1]) * R[3]];
    const COLE_A = 3840 / 2822;

    let started = false;
    function start() {
        if (started) return;
        started = true;

        const wrap = document.createElement("div");
        wrap.className = "dive-bg";
        wrap.setAttribute("aria-hidden", "true");
        const canvas = document.createElement("canvas");
        wrap.appendChild(canvas);
        document.body.insertBefore(wrap, document.body.firstChild);

        let renderer;
        try {
            renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: "high-performance" });
        } catch (e) { root.classList.add("dive-fallback"); return; }
        const gl = renderer.getContext();
        const maxTex = gl.getParameter(gl.MAX_TEXTURE_SIZE);
        const small = Math.min(window.innerWidth, window.innerHeight) < 700 || maxTex < 8192;
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, small ? 1.25 : 1.5));
        // GPU bağlamı kaybolursa sekme çökmesin: düz görsele düş, geri gelince yeniden çiz
        canvas.addEventListener("webglcontextlost", (e) => { e.preventDefault(); root.classList.add("dive-fallback"); }, false);
        canvas.addEventListener("webglcontextrestored", () => { root.classList.remove("dive-fallback"); dirty = true; }, false);

        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        const loader = new THREE.TextureLoader();
        let toLoad = 0;
        const tex = (src, opts = {}) => {
            toLoad++;
            const t = loader.load(src, () => { toLoad--; dirty = true; if (!toLoad) root.classList.add("dive-ready"); });
            t.generateMipmaps = !!opts.mip;
            t.minFilter = opts.mip ? THREE.LinearMipmapLinearFilter : THREE.LinearFilter;
            t.anisotropy = opts.mip ? Math.min(4, renderer.capabilities.getMaxAnisotropy()) : 1;
            if (opts.repeat) t.wrapS = t.wrapT = THREE.RepeatWrapping;
            return t;
        };
        const S = "images/scenes/";
        const blank = new THREE.DataTexture(new Uint8Array([0, 0, 0, 255]), 1, 1, THREE.RGBAFormat); blank.needsUpdate = true;
        const uniforms = {
            uPLo: { value: tex(S + (small ? "panini-2048.webp" : "panini-4096.webp"), { mip: true }) },
            uPHi: { value: small ? blank : tex(S + "panini-navona.webp", { mip: true }) },
            uPDepth: { value: tex(S + "panini-depth.png") },
            uRLo: { value: tex(S + "robert-2048.webp", { mip: true }) },
            uRHi: { value: small ? blank : tex(S + "robert-arch-hi.webp", { mip: true }) },
            uRMaps: { value: tex(S + "robert-maps.png") },
            uCole: { value: tex(S + (small ? "cole-2560.webp" : "cole-3840.webp"), { mip: true }) },
            uCMaps: { value: tex(S + "cole-maps.png") },
            uWeave: { value: tex(S + "canvas-weave.jpg", { repeat: true }) },
            uRes: { value: new THREE.Vector2(1, 1) },
            uCam: { value: new THREE.Vector2(0.5, HR / 2) },
            uSpan: { value: 1 },
            uB1: { value: 0 }, uB2: { value: 0 }, uArchFade: { value: 0 },
            uColeZoom: { value: 1.2 },
            uHi: { value: small ? 0 : 1 },
            uMouse: { value: new THREE.Vector2() },
            uTime: { value: 0 },
            uMotion: { value: reduce ? 0 : 1 },
            uDim: { value: 0 }
        };
        const v4 = (a) => `vec4(${a.map((n) => n.toFixed(7)).join(",")})`;
        const frag = `
precision highp float;
uniform sampler2D uPLo, uPHi, uPDepth, uRLo, uRHi, uRMaps, uCole, uCMaps, uWeave;
uniform vec2 uRes, uCam, uMouse;
uniform float uSpan, uB1, uB2, uArchFade, uColeZoom, uHi, uTime, uMotion, uDim;
varying vec2 vUv;
const float HR = ${HR.toFixed(7)};
const vec4 CROP = ${v4(CROP)};
const vec4 F = ${v4(F)};
const vec4 R = ${v4(R)};
const vec4 RHI = ${v4(RHI)};
const float COLE_A = ${COLE_A.toFixed(6)};
const vec2 SUN = vec2(0.216, 0.579);
const float HORIZON = 0.606;

// Resim koordinatı (Y aşağı) ile doku örnekle
vec4 img(sampler2D t, vec2 p) { return texture2D(t, vec2(p.x, 1.0 - p.y)); }
float inside(vec2 p) { return step(0.0, p.x) * step(p.x, 1.0) * step(0.0, p.y) * step(p.y, 1.0); }
float insideSoft(vec2 p, float e) { vec2 a = smoothstep(vec2(0.0), vec2(e), p) * smoothstep(vec2(0.0), vec2(e), 1.0 - p); return a.x * a.y; }
float hash(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p) { vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y); }
float fbm(vec2 p) { float v = 0.0, a = 0.5; for (int i = 0; i < 5; i++) { v += a * noise(p); p = p * 2.02 + 11.7; a *= 0.5; } return v; }
// Mürekkep gibi dağılan geçiş maskesi
float ink(float b, vec2 p, out float edge) {
    float n = fbm(p);
    float m = smoothstep(n - 0.06, n + 0.06, b * 1.16 - 0.08);
    edge = m * (1.0 - m) * 4.0;
    return m;
}

// Cole: ekran uzayında (uzak katman, yavaş yakınlaşır), canlı deniz, gök ve sis
vec3 cole(vec2 suv, vec2 par) {
    float sa = uRes.x / uRes.y;
    vec2 span = (sa > COLE_A ? vec2(1.0, COLE_A / sa) : vec2(sa / COLE_A, 1.0)) / uColeZoom;
    vec2 focus = vec2(sa < 1.0 ? 0.68 : 0.62, 0.42);
    vec2 lo = clamp(focus - span * 0.5, vec2(0.0), vec2(1.0) - span);
    vec2 base = lo + vec2(suv.x, 1.0 - suv.y) * span;
    float d = img(uCMaps, base).r;
    vec2 cu = base + par * span * (d - 0.3) * 1.2;
    vec3 m = img(uCMaps, cu).rgb;
    float water = m.g, sky = m.b, t = uTime * uMotion;
    cu.x += sky * sin(t * 0.045) * 0.004;
    float nearW = smoothstep(HORIZON, HORIZON + 0.25, cu.y);
    cu.y += water * nearW * (sin(cu.x * 260.0 + t * 1.6) * 0.0009 + sin(cu.x * 97.0 - t * 1.1 + cu.y * 50.0) * 0.0007);
    vec3 c = img(uCole, cu).rgb;
    float column = exp(-abs((cu.x - SUN.x) * COLE_A) * 9.0);
    c += vec3(1.0, 0.94, 0.8) * smoothstep(0.8, 1.0, noise(vec2(cu.x * 420.0, cu.y * 900.0 + t * 2.2))) * water * column * nearW * 0.45;
    float band = exp(-pow((cu.y - HORIZON) / 0.08, 2.0));
    c = mix(c, vec3(0.93, 0.9, 0.82), band * (1.0 - d) * (0.12 + 0.16 * fbm(vec2(cu.x * 3.2 + t * 0.012, cu.y * 7.0))));
    return c;
}

void main() {
    float sa = uRes.x / uRes.y;
    vec2 sp = vec2(uSpan, uSpan / sa);
    vec2 w = uCam + vec2(vUv.x - 0.5, 0.5 - vUv.y) * sp;          // dünya noktası
    vec2 par = uMouse * vec2(-1.0, -1.0) * 0.006 * uMotion;       // ekran oranında kayma

    /* ---- Panini galerisi ---- */
    vec2 pu = vec2(w.x, w.y / HR);
    float pd = img(uPDepth, pu).r;
    vec2 pw = w + par * sp * (pd - 0.25) * 1.4;
    pu = vec2(pw.x, pw.y / HR);
    vec3 col = img(uPLo, pu).rgb;
    vec2 cu = (pw - CROP.xy) / CROP.zw;
    col = mix(col, img(uPHi, cu).rgb, uHi * insideSoft(cu, 0.02) * smoothstep(0.42, 0.22, uSpan));
    col *= mix(0.25, 1.0, inside(pu));                             // tablonun dışı: karanlık duvar

    /* ---- Robert (Navona çerçevesinin içinde) ---- */
    if (uB1 > 0.001) {
        vec2 fu = (w - F.xy) / F.zw;
        float occl = smoothstep(0.205, 0.235, pd);                 // önündeki kitap / çerçeve korunur
        vec2 ru = (w - R.xy) / R.zw;
        vec4 rm = img(uRMaps, ru);
        ru += par * sp / R.zw * (rm.r - 0.35) * 1.4;
        rm = img(uRMaps, ru);
        vec3 rc = img(uRLo, ru).rgb;
        vec2 hu = (ru - RHI.xy) / RHI.zw;
        rc = mix(rc, img(uRHi, hu).rgb, uHi * insideSoft(hu, 0.01));
        if (uB2 > 0.001) {
            vec3 cc = cole(vUv, par);
            float e2; float m2 = ink(uB2, ru * vec2(5.0, 7.9), e2);
            float open = 1.0 - rm.g;
            rc = mix(rc, cc * (1.0 - 0.18 * e2), open * m2);
            rc = mix(rc, cc, uArchFade);
        }
        float e1; float m1 = ink(uB1, fu * vec2(3.0, 4.9), e1);
        float k = insideSoft(fu, 0.004) * (1.0 - occl);
        col = mix(col, rc * (1.0 - 0.18 * e1 * (1.0 - uArchFade)), m1 * k);
    }

    /* ---- Havada süzülen toz ---- */
    vec2 q0 = vec2(vUv.x * sa, vUv.y);
    float t = uTime * uMotion, dust = 0.0;
    for (int k = 0; k < 2; k++) {
        float fk = float(k);
        vec2 q = q0 * (10.0 + fk * 8.0) + vec2(t * (0.05 + fk * 0.02), -t * (0.07 + fk * 0.03));
        vec2 id = floor(q), f = fract(q) - 0.5;
        float h = hash(id + fk * 13.7);
        vec2 o = vec2(hash(id + 3.1), hash(id + 7.7)) - 0.5;
        dust += step(0.9, h) * smoothstep(0.05, 0.0, length(f - o * 0.7)) * (0.5 + 0.5 * sin(t * (1.0 + h * 2.0) + h * 6.28)) * (0.5 - fk * 0.15);
    }
    col += vec3(1.0, 0.92, 0.75) * dust * 0.28 * uMotion;

    /* ---- İnce son işlem: neredeyse fark edilmeyen tuval, hafif sıcaklık, gren, vinyet ---- */
    col *= 0.975 + 0.05 * texture2D(uWeave, gl_FragCoord.xy / 460.0).r;
    col = col * vec3(1.02, 1.0, 0.975);
    col *= 1.0 - uDim;
    float vig = smoothstep(1.25, 0.35, length((vUv - 0.5) * vec2(sa * 0.75, 1.0)));
    col *= mix(0.8, 1.0, vig);
    col += (hash(gl_FragCoord.xy + fract(t * 7.0) * 91.0) - 0.5) * 0.018;
    gl_FragColor = vec4(col, 1.0);
}`;
        const mat = new THREE.ShaderMaterial({
            uniforms, fragmentShader: frag, depthTest: false, depthWrite: false,
            vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }"
        });
        scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat));

        /* ---------- Kamera yolu ---------- */
        const sa = () => window.innerWidth / window.innerHeight;
        const coverX = (w, h) => (sa() > w / h ? w : h * sa());     // dikdörtgen ekranı tamamen kaplar
        const containX = (w, h) => (sa() > w / h ? h * sa() : w);   // dikdörtgen ekrana tamamen sığar
        const center = (r) => [r[0] + r[2] / 2, r[1] + r[3] / 2];
        let K = [];
        const buildKeys = () => {
            K = [
                { c: [0.5, HR / 2], s: coverX(1, HR) },              // K0: galerinin tamamı
                { c: center(F), s: containX(F[2], F[3]) * 1.75 },    // K1: Navona tablosu ekranın ~%57'si
                { c: center(F), s: coverX(F[2], F[3]) },             // K2: tablo ekranı doldurur
                { c: center(O), s: coverX(O[2], O[3]) * 1.04 },      // K3: kemer açıklığı ekranı doldurur
                { c: center(O), s: coverX(O[2], O[3]) * 0.5 }        // K4: kemerin içinden geçildi
            ];
        };
        const lerpView = (a, b, t) => {
            const s = Math.exp(Math.log(a.s) * (1 - t) + Math.log(b.s) * t);
            const k = Math.abs(a.s - b.s) < 1e-9 ? t : (s - b.s) / (a.s - b.s);
            const kk = Math.abs(a.s - b.s) < 1e-9 ? 1 - t : k;
            return { c: [b.c[0] + (a.c[0] - b.c[0]) * kk, b.c[1] + (a.c[1] - b.c[1]) * kk], s };
        };
        const ss = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
        const SEG = [[0.06, 0.40], [0.40, 0.54], [0.54, 0.74], [0.74, 0.92]];
        function viewAt(P) {
            let v = K[0];
            for (let i = 0; i < SEG.length; i++) {
                const [a, b] = SEG[i];
                if (P >= b) v = K[i + 1];
                else if (P > a) { v = lerpView(K[i], K[i + 1], ss(a, b, P)); break; }
                else break;
            }
            // Görünüm tablonun dışına taşmasın (yalnızca geniş görünümlerde etkili)
            const sx = v.s, sy = v.s / sa();
            const cx = sx < 1 ? Math.min(1 - sx / 2, Math.max(sx / 2, v.c[0])) : 0.5;
            const cy = sy < HR ? Math.min(HR - sy / 2, Math.max(sy / 2, v.c[1])) : HR / 2;
            return { c: [cx, cy], s: v.s };
        }

        /* ---------- Durum ve olaylar ---------- */
        let active = false, dirty = true, visible = true, last = performance.now();
        const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
        let P = 0, PT = 0, journey = null, stage = -1;
        const readScroll = () => {
            if (!journey) return;
            const r = journey.getBoundingClientRect();
            const run = Math.max(1, r.height - window.innerHeight);
            PT = Math.min(1, Math.max(0, -r.top / run));
            dirty = true;
        };
        const resize = () => {
            renderer.setSize(window.innerWidth, window.innerHeight, false);
            uniforms.uRes.value.set(canvas.width, canvas.height);
            buildKeys(); readScroll(); dirty = true;
        };
        window.addEventListener("resize", resize);
        window.addEventListener("scroll", readScroll, { passive: true });
        window.addEventListener("mousemove", (e) => {
            mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
            mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
            dirty = true;
        });
        document.addEventListener("visibilitychange", () => { visible = !document.hidden; last = performance.now(); });

        const labels = () => document.querySelectorAll("[data-dive-label]");
        const heroCopy = () => document.querySelector(".hero .container");
        function applyStage(P) {
            const s = P < 0.45 ? 0 : P < 0.7 ? 1 : 2;
            if (s !== stage) {
                stage = s;
                labels().forEach((el) => el.classList.toggle("is-on", +el.dataset.diveLabel === s));
            }
            const hc = heroCopy();
            if (hc) {
                const f = 1 - ss(0.03, 0.12, P);
                hc.style.opacity = f.toFixed(3);
                hc.style.transform = `translate3d(0, ${(-40 * (1 - f)).toFixed(1)}px, 0)`;
                hc.style.visibility = f < 0.01 ? "hidden" : "";
            }
        }

        let fpsAcc = 0, fpsN = 0;
        window.__diveStats = () => ({ fps: fpsN ? Math.round(fpsN / fpsAcc) : 0, P: +P.toFixed(3), stage, maxTex, small });
        function frame(now) {
            requestAnimationFrame(frame);
            if (!active || !visible) return;
            const dt = Math.min(0.05, (now - last) / 1000); last = now;
            fpsAcc += dt; fpsN++; if (fpsAcc > 2) { fpsAcc /= 2; fpsN /= 2; }
            const k = 1 - Math.exp(-dt * 4);
            mouse.x += (mouse.tx - mouse.x) * k; mouse.y += (mouse.ty - mouse.y) * k;
            P += (PT - P) * (reduce ? 1 : 1 - Math.exp(-dt * 6));
            if (Math.abs(PT - P) < 1e-4) P = PT;
            // Canlı efektler (deniz, toz) sürekli çizer; hareket azaltılmışsa yalnızca değişince
            if (reduce && !dirty) return;
            const v = viewAt(P);
            uniforms.uCam.value.set(v.c[0], v.c[1]);
            uniforms.uSpan.value = v.s;
            uniforms.uB1.value = ss(0.36, 0.50, P);
            uniforms.uB2.value = ss(0.58, 0.72, P);
            uniforms.uArchFade.value = ss(0.84, 0.93, P);
            uniforms.uColeZoom.value = 1.22 - 0.16 * ss(0.6, 1.0, P);
            const after = journey ? Math.max(0, -journey.getBoundingClientRect().bottom + window.innerHeight) / window.innerHeight : 0;
            uniforms.uDim.value = Math.min(0.45, after * 0.5);
            uniforms.uTime.value += dt;
            uniforms.uMouse.value.set(mouse.x, mouse.y);
            applyStage(P);
            renderer.render(scene, camera);
            dirty = false;
        }
        requestAnimationFrame(frame);

        const sync = () => {
            active = document.body.dataset.page === "home";
            root.classList.toggle("dive-on", active);
            journey = document.querySelector("[data-journey]");
            stage = -1;
            last = performance.now(); resize();
        };
        document.addEventListener("router:navigated", sync);
        sync();
        window.Dive = { sync, uniforms, viewAt: (p) => viewAt(p) };
    }

    const maybeStart = () => { if (document.body.dataset.page === "home") start(); };
    document.addEventListener("router:navigated", maybeStart);
    maybeStart();
})();
