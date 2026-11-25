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
    const CROP = px(300, 4750, 1850, 2700);              // Panini yüksek çözünürlük kesiti (Navona çevresi)
    const CROP2 = px(2858, 5359, 4235, 2523);            // ikinci kesit: Musa heykeli ve koleksiyoncular
    const F = px(597, 5086, 1248, 2038);                 // Navona tablosunun çerçeve içi
    const RA = 7376 / 11712;                             // Robert en/boy
    const R = [F[0] + (F[2] - F[3] * RA) / 2, F[1], F[3] * RA, F[3]];
    const RHI = [0.0999, 0.18, 0.66 - 0.0999, 0.80 - 0.18]; // Robert yüksek çözünürlük kesiti (Robert koordinatı)
    const OPEN_N = [0.156, 0.216, 0.6, 0.758];           // kemer açıklığı (Robert koordinatı)
    const O = [R[0] + OPEN_N[0] * R[2], R[1] + OPEN_N[1] * R[3], (OPEN_N[2] - OPEN_N[0]) * R[2], (OPEN_N[3] - OPEN_N[1]) * R[3]];
    const COLE_A = 3840 / 2822;

    let started = false, flowTex = null;
    const brushPos = { x: -1, y: -1 };
    addEventListener("pointermove", (e) => { brushPos.x = e.clientX / innerWidth; brushPos.y = e.clientY / innerHeight; }, { passive: true });
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
            uPHi2: { value: small ? blank : tex(S + "panini-figures.webp", { mip: true }) },
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
            uColeFocus: { value: new THREE.Vector2(0.62, 0.42) },
            uDark: { value: 0 },
            // Fırça akış haritası (js/brush.js) ve canlanan figür bölgesi
            uFlow: { value: window.BrushFlow ? (flowTex = new THREE.CanvasTexture(window.BrushFlow.canvas)) : blank },
            uHot: { value: new THREE.Vector4(0.28, 0.2, 0.72, 0.8) }, uHotAmt: { value: 0 },
            uHi: { value: small ? 0 : 1 },
            uMouse: { value: new THREE.Vector2() },
            uTime: { value: 0 },
            uMotion: { value: reduce ? 0 : 1 },
            uDim: { value: 0 }
        };
        const v4 = (a) => `vec4(${a.map((n) => n.toFixed(7)).join(",")})`;
        const frag = `
precision highp float;
uniform sampler2D uPLo, uPHi, uPHi2, uPDepth, uRLo, uRHi, uRMaps, uCole, uCMaps, uWeave, uFlow;
uniform vec2 uRes, uCam, uMouse, uColeFocus;
uniform vec4 uHot;
uniform float uSpan, uB1, uB2, uArchFade, uColeZoom, uHi, uTime, uMotion, uDim, uDark, uHotAmt;
varying vec2 vUv;
const float HR = ${HR.toFixed(7)};
const vec4 CROP = ${v4(CROP)};
const vec4 CROP2 = ${v4(CROP2)};
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
    vec2 focus = uColeFocus;
    vec2 lo = clamp(focus - span * 0.5, vec2(0.0), vec2(1.0) - span);
    vec2 base = lo + vec2(suv.x, 1.0 - suv.y) * span;
    float d = img(uCMaps, base).r;
    vec2 cu = base + par * span * (d - 0.3) * 1.2;
    vec3 m = img(uCMaps, cu).rgb;
    float water = m.g, sky = m.b, t = uTime * uMotion;
    float nearW = smoothstep(HORIZON, HORIZON + 0.25, cu.y);
    cu.y += water * nearW * (sin(cu.x * 260.0 + t * 1.6) * 0.0009 + sin(cu.x * 97.0 - t * 1.1 + cu.y * 50.0) * 0.0007);
    vec3 c;
    if (sky > 0.5) {
        // Bulutlar: iki evreli akış haritası; yön gürültüyle değişir, böylece bulutlar kayarken hafifçe kabarır
        vec2 fl = (vec2(fbm(cu * vec2(3.0, 6.0) + 4.0), fbm(cu * vec2(3.0, 6.0) + 9.0)) - 0.5) * vec2(0.6, 0.25) + vec2(1.0, 0.05);
        float ph = fract(t * 0.035);
        vec2 o = fl * 0.0045;
        float wt = abs(1.0 - 2.0 * ph);
        c = mix(img(uCole, cu - o * ph).rgb, img(uCole, cu - o * fract(ph + 0.5)).rgb, 1.0 - wt);
        c *= 0.97 + 0.07 * fbm(vec2(cu.x * 4.0 - t * 0.02, cu.y * 9.0));   // gezinen bulut gölgesi
    } else c = img(uCole, cu).rgb;
    float column = exp(-abs((cu.x - SUN.x) * COLE_A) * 9.0);
    float glint = smoothstep(0.8, 1.0, noise(vec2(cu.x * 420.0, cu.y * 900.0 + t * 2.2)));
    float spark = smoothstep(0.93, 1.0, noise(vec2(cu.x * 700.0 + t * 0.6, cu.y * 1500.0 - t * 1.3)));
    c += vec3(1.0, 0.94, 0.8) * water * nearW * (glint * column * 0.5 + spark * 0.16);
    // Martılar: uzakta, gökte ağır ağır kanat çırparak süzülen küçük siluetler
    for (int i = 0; i < 3; i++) {
        float fi = float(i);
        vec2 gp = vec2(fract(t * (0.012 + fi * 0.004) + fi * 0.37) * 1.3 - 0.15, 0.82 - fi * 0.06 + 0.012 * sin(t * 0.3 + fi * 2.0));
        float gs = (0.021 - fi * 0.004) * min(uColeZoom, 1.5);
        vec2 q = (suv - gp) * vec2(sa, 1.0) / gs;
        float ax = abs(q.x);
        float flap = sin(t * (2.2 + fi * 0.5) + fi * 4.0);
        float wy = (0.25 + 0.3 * flap) * sin(3.1416 * min(ax, 1.0)) - 0.1 * ax;
        float wth = 0.16 * (1.0 - 0.7 * ax) + 0.03;
        float g = step(ax, 1.0) * smoothstep(wth, wth * 0.35, abs(q.y - wy));
        c = mix(c, vec3(0.2, 0.19, 0.18), g * sky * 0.85);
    }
    float band = exp(-pow((cu.y - HORIZON) / 0.08, 2.0));
    c = mix(c, vec3(0.93, 0.9, 0.82), band * (1.0 - d) * (0.12 + 0.16 * fbm(vec2(cu.x * 3.2 + t * 0.012, cu.y * 7.0))));
    return c;
}

void main() {
    float sa = uRes.x / uRes.y;
    // Islak boya (fırça akış haritası) + fırçanın üstündeki detayın hafifçe canlanması
    vec4 fl = texture2D(uFlow, vUv);
    vec2 off = (fl.rg - 0.5) * vec2(1.0, -1.0) * 0.05 * fl.b;
    vec2 hc = (uHot.xy + uHot.zw) * 0.5, hs = max(uHot.zw - uHot.xy, vec2(0.001));
    float hm = uHotAmt * smoothstep(1.0, 0.55, length((vUv - hc) / (hs * 0.5)));
    off += hm * vec2(sin(uTime * 2.1 + vUv.y * 9.0), cos(uTime * 1.7 + vUv.x * 7.0)) * 0.0035 * uMotion;
    vec2 uv0 = vUv - off;
    vec2 sp = vec2(uSpan, uSpan / sa);
    vec2 w = uCam + vec2(uv0.x - 0.5, 0.5 - uv0.y) * sp;          // dünya noktası
    vec2 par = uMouse * vec2(-1.0, -1.0) * 0.006 * uMotion;       // ekran oranında kayma

    /* ---- Panini galerisi ---- */
    vec2 pu = vec2(w.x, w.y / HR);
    float pd = img(uPDepth, pu).r;
    vec2 pw = w + par * sp * (pd - 0.25) * 1.4;
    pu = vec2(pw.x, pw.y / HR);
    vec3 col = img(uPLo, pu).rgb;
    vec2 cu = (pw - CROP.xy) / CROP.zw;
    col = mix(col, img(uPHi, cu).rgb, uHi * insideSoft(cu, 0.02) * smoothstep(0.42, 0.22, uSpan));
    vec2 cu2 = (pw - CROP2.xy) / CROP2.zw;
    col = mix(col, img(uPHi2, cu2).rgb, uHi * insideSoft(cu2, 0.015) * smoothstep(0.5, 0.3, uSpan));
    col *= mix(0.25, 1.0, inside(pu));                             // tablonun dışı: karanlık duvar

    /* ---- Galerinin üst penceresinden süzülen ışık huzmeleri (geniş görünümde) ---- */
    float tt = uTime * uMotion;
    vec2 bd = normalize(vec2(0.42, 1.0));
    vec2 bo = pu - vec2(0.18, -0.05);
    float along = dot(bo, bd), across = dot(bo, vec2(bd.y, -bd.x));
    float zone = smoothstep(0.0, 0.12, along) * smoothstep(1.1, 0.3, along) * smoothstep(0.42, 0.05, abs(across - 0.1));
    zone *= smoothstep(0.08, 0.3, uSpan) * (1.0 - uB1);
    float rays = smoothstep(0.5, 0.75, fbm(vec2(across * 16.0 + tt * 0.012, along * 0.6 + tt * 0.02)));
    float beams = zone * rays;
    col *= 1.0 - 0.08 * zone * (1.0 - rays);                                  // huzme aralarında hafif gölge
    col = 1.0 - (1.0 - col) * (1.0 - vec3(1.0, 0.84, 0.58) * beams * 0.42 * (0.85 + 0.15 * sin(tt * 0.4)));   // ekran karışımı: parlak yerler patlamaz

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
            vec3 cc = cole(uv0, par);
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
    // (toz parçacıkları kaldırıldı: ekranda rastgele beyaz noktalar gibi görünüyordu)

    /* ---- İnce son işlem: neredeyse fark edilmeyen tuval, hafif sıcaklık, gren, vinyet ---- */
    col *= 0.975 + 0.05 * texture2D(uWeave, gl_FragCoord.xy / 460.0).r;
    col = col * vec3(1.02, 1.0, 0.975);
    float wet = fl.b * (0.6 + 0.4 * noise(vUv * vec2(sa, 1.0) * 60.0));
    col += vec3(1.0, 0.95, 0.85) * wet * 0.07;
    col *= (1.0 - uDim) * (1.0 - uDark);   // sinematik karartma geçişi
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

        /* ---------- Kamera yolu: tablo tablo zoom durakları ---------- */
        const sa = () => window.innerWidth / window.innerHeight;
        const coverX = (w, h) => (sa() > w / h ? w : h * sa());     // dikdörtgen ekranı tamamen kaplar
        const containX = (w, h) => (sa() > w / h ? h * sa() : w);   // dikdörtgen ekrana tamamen sığar
        const center = (r) => [r[0] + r[2] / 2, r[1] + r[3] / 2];
        // Durak: tablo içi oransal merkez (u, v) ve ekrana sığacak kutu (w, h)
        const pan = (u, v, w, h) => ({ c: [u, v * HR], s: containX(w, h * HR) });
        const rob = (u, v, w, h) => ({ c: [R[0] + u * R[2], R[1] + v * R[3]], s: containX(w * R[2], h * R[3]) });
        /* ---------- Altın çerçeve vurgusu: 1–2 belli başlı durakta ayrıntının tam etrafı ----------
           Kutu: ayrıntının en dar anlamlı kısmı (merkez c ve boyut w, h; tablo oranı). Çerçevenin iç boşluğu kutuyu
           pay bırakarak (dikdörtgende %20, ovalde %48) tamamen içine alır; zoom çerçeveye ve kutuya göre ayarlanır. */
        const FR = {
            1: { shape: "portrait", sp: "pan", c: [0.5795, 0.7268], w: 0.044, h: 0.056 },   // Musa: yüz ve omuzlar
            2: { shape: "oval", sp: "pan", c: [0.439, 0.7973], w: 0.0676, h: 0.0481 },      // Koleksiyoncular: yüzler
            3: { shape: "portrait", sp: "rob", c: [0.2504, 0.6444], w: 0.1207, h: 0.109, k: 0.85 },  // Aziz Petrus kubbesi
            6: { shape: "portrait", sp: "cole", c: [0.706, 0.28], w: 0.152, h: 0.24 }        // Yıkık kule: tepe ve gövdenin üstü
        };
        let FJ = null;
        const frameFit = (d) => {
            const m = FJ && FJ[d.shape]; if (!m) return null;
            const sw = window.innerWidth, sh = window.innerHeight;
            const A = (m.inner.w * m.width) / (m.inner.h * m.height);
            let iw = sw * (sw < 600 ? 0.44 : 0.24) * (d.k || 1), ih = iw / A;
            if (ih > sh * 0.42 * (d.k || 1)) { ih = sh * 0.42 * (d.k || 1); iw = ih * A; }
            let fw = iw / m.inner.w;
            if (fw > m.width * 1.5) { fw = m.width * 1.5; iw = fw * m.inner.w; ih = iw / A; }
            return { m, iw, ih, fw, mg: m.shape === "ellipse" ? 1.48 : 1.2, sw, sh };
        };
        // Çerçeveli durağın görünümü (pan/rob) ya da Cole yakınlığı
        const framedView = (d) => {
            const f = frameFit(d); if (!f) return null;
            if (d.sp === "cole") {
                const A = COLE_A, r = sa(), base = r > A ? [1, A / r] : [r / A, 1];
                const sp0 = Math.max(d.w * f.mg * f.sw / f.iw, (d.h * f.mg * f.sh / f.ih) * (base[0] / base[1]));
                return { z: Math.max(1, base[0] / sp0) };
            }
            const bw = d.sp === "pan" ? d.w : d.w * R[2], bh = d.sp === "pan" ? d.h * HR : d.h * R[3];
            const z = Math.min(f.iw / (bw * f.mg), f.ih / (bh * f.mg));
            const c = d.sp === "pan" ? [d.c[0], d.c[1] * HR] : [R[0] + d.c[0] * R[2], R[1] + d.c[1] * R[3]];
            return { c, s: f.sw / z };
        };
        // P (0–1) → görünüm. Aynı görünüm iki kez yazılınca kamera o detayda bekler.
        let K = [];
        const buildKeys = () => {
            const K0 = { c: [0.5, HR / 2], s: coverX(1, HR) };
            const S1 = pan(0.43, 0.40, 0.30, 0.30); let S2 = pan(0.575, 0.77, 0.13, 0.17), S3 = pan(0.44, 0.86, 0.22, 0.22);
            const K1 = { c: center(F), s: containX(F[2], F[3]) * 1.75 }, K2 = { c: center(F), s: coverX(F[2], F[3]) };
            let R1 = rob(0.26, 0.67, 0.35, 0.16); const R2 = rob(0.70, 0.56, 0.30, 0.20), R3 = rob(0.55, 0.82, 0.60, 0.20);
            const fv = (i, v) => { const f = FR[i] && framedView(FR[i]); return f && f.s ? f : v; };
            S2 = fv(1, S2); S3 = fv(2, S3); R1 = fv(3, R1);
            const K3 = { c: center(O), s: coverX(O[2], O[3]) * 1.04 };
            const fc = FR[6] && framedView(FR[6]);
            if (fc) { CK[2][1] = CK[3][1] = FR[6].c; CK[2][2] = CK[3][2] = fc.z; }
            K = [[0, K0], [0.04, K0], [0.10, S1], [0.14, S1], [0.20, S2], [0.24, S2], [0.30, S3], [0.34, S3],
                [0.41, K1], [0.49, K2], [0.57, R1], [0.61, R1], [0.66, R2], [0.69, R2], [0.74, R3], [0.77, R3], [0.83, K3]];
        };
        // Cole (ekran uzayı katmanı): odak ve yakınlık
        const CK = [[0.83, [0.55, 0.45], 1.12], [0.86, [0.55, 0.45], 1.12], [0.89, [0.70, 0.36], 2.0], [0.91, [0.70, 0.36], 2.0],
            [0.94, [0.69, 0.76], 2.8], [0.955, [0.69, 0.76], 2.8], [0.975, [0.22, 0.62], 2.4], [0.985, [0.22, 0.62], 2.4], [1.0, [0.55, 0.45], 1.08]];
        // Başlıklı duraklar (cap.N): tutma aralığı
        const STOPS = [[0.10, 0.14], [0.20, 0.24], [0.30, 0.34], [0.57, 0.61], [0.66, 0.69], [0.74, 0.77], [0.89, 0.91], [0.94, 0.955], [0.975, 0.985]];
        const SWITCH = 0.832;                                         // karanlığın en koyu anı: Robert → Cole
        const lerpView = (a, b, t) => {
            const s = Math.exp(Math.log(a.s) * (1 - t) + Math.log(b.s) * t);
            const k = Math.abs(a.s - b.s) < 1e-9 ? t : (s - b.s) / (a.s - b.s);
            const kk = Math.abs(a.s - b.s) < 1e-9 ? 1 - t : k;
            return { c: [b.c[0] + (a.c[0] - b.c[0]) * kk, b.c[1] + (a.c[1] - b.c[1]) * kk], s };
        };
        const ss = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
        const seg = (list, P) => {
            for (let i = 0; i < list.length - 1; i++) if (P < list[i + 1][0]) return [i, ss(list[i][0], list[i + 1][0], P)];
            return [list.length - 2, 1];
        };
        function viewAt(P) {
            const [i, t] = P <= K[0][0] ? [0, 0] : seg(K, P);
            const v = lerpView(K[i][1], K[i + 1][1], t);
            // Görünüm tablonun dışına taşmasın (yalnızca geniş görünümlerde etkili)
            const sx = v.s, sy = v.s / sa();
            const cx = sx < 1 ? Math.min(1 - sx / 2, Math.max(sx / 2, v.c[0])) : 0.5;
            const cy = sy < HR ? Math.min(HR - sy / 2, Math.max(sy / 2, v.c[1])) : HR / 2;
            return { c: [cx, cy], s: v.s };
        }
        function coleAt(P) {
            if (P <= CK[0][0]) return { f: CK[0][1], z: CK[0][2] };
            const [i, t] = seg(CK, P), a = CK[i], b = CK[i + 1];
            return { f: [a[1][0] + (b[1][0] - a[1][0]) * t, a[1][1] + (b[1][1] - a[1][1]) * t], z: Math.exp(Math.log(a[2]) * (1 - t) + Math.log(b[2]) * t) };
        }
        const coleRect = (c) => {
            const A = COLE_A, r = sa();
            const sp = (r > A ? [1, A / r] : [r / A, 1]).map((x) => x / c.z);
            const lo = [0, 1].map((k) => Math.min(1 - sp[k], Math.max(0, c.f[k] - sp[k] / 2)));
            return [lo[0], lo[1], sp[0], sp[1]];
        };

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
        const MAPS = [S + "panini-2048.webp", S + "robert-2048.webp", S + "cole-1280.webp"];
        /* ---------- Çerçeve katmanı: tablonun üstünde, yazıların altında; yalnız transform/opacity ---------- */
        const fEl = document.createElement("div");
        fEl.className = "dive-frame";
        fEl.innerHTML = '<img alt="" decoding="async">';
        wrap.appendChild(fEl);
        const fImg = fEl.querySelector("img");
        let fIdx = -1, fTok = 0, lastV = null, lastC = null;
        // Kutunun ekrandaki merkezine, iç boşluğun merkezi oturacak biçimde yerleştir
        const placeFrame = () => {
            const d = FR[fIdx], f = d && frameFit(d); if (!f || !lastV) return;
            const sw = f.sw, sh = f.sh; let X, Y;
            if (d.sp === "cole") {
                const r = coleRect(lastC);
                X = (d.c[0] - r[0]) / r[2] * sw; Y = (d.c[1] - r[1]) / r[3] * sh;
            } else {
                const bc = d.sp === "pan" ? [d.c[0], d.c[1] * HR] : [R[0] + d.c[0] * R[2], R[1] + d.c[1] * R[3]];
                const hh = lastV.s / sa();
                X = (bc[0] - (lastV.c[0] - lastV.s / 2)) / lastV.s * sw; Y = (bc[1] - (lastV.c[1] - hh / 2)) / hh * sh;
            }
            const fh = f.fw * f.m.height / f.m.width;
            fImg.style.width = f.fw.toFixed(1) + "px";
            const x = X - (f.m.inner.x + f.m.inner.w / 2) * f.fw, y = Y - (f.m.inner.y + f.m.inner.h / 2) * fh;
            fEl.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
        };
        const setFrame = (ci) => {
            const tok = ++fTok;
            fEl.classList.remove("is-on"); fIdx = -1;
            if (!FR[ci] || !FJ) return;
            setTimeout(() => {   // önceki çerçeve solarken (≈400 ms) kamera yeni ayrıntıya kayar; yenisi sonra gelir
                if (tok !== fTok) return;
                fIdx = ci; fImg.src = "images/frames/" + FJ[FR[ci].shape].file; placeFrame();
                requestAnimationFrame(() => fEl.classList.add("is-on"));
            }, 420);
        };
        // Çerçeve görselleri: sayfa hazır olunca, boştayken yüklenir
        const loadFrames = () => fetch("images/frames/frames.json").then((r) => r.json()).then((j) => {
            FJ = j; new Set(Object.values(FR).map((d) => d.shape)).forEach((k) => { new Image().src = "images/frames/" + j[k].file; });
            buildKeys(); dirty = true;
        }).catch(() => {});
        setTimeout(() => (window.requestIdleCallback ? requestIdleCallback(loadFrames) : loadFrames()), 1500);

        let cap = -2;
        function applyStage(P, v, c) {
            lastV = v; lastC = c; if (fIdx >= 0) placeFrame();
            // Etiket, mürekkep geçişi tablonun yarısını kapladığı anda ya da karanlığın en koyu anında değişir
            const s = uniforms.uB1.value < 0.5 ? 0 : P < SWITCH ? 1 : 2;
            const map = document.querySelector("[data-dive-map]");
            if (s !== stage) {
                stage = s;
                labels().forEach((el) => el.classList.toggle("is-on", +el.dataset.diveLabel === s));
                if (map) { map.querySelector("img").src = MAPS[s]; map.dataset.stage = s; }
            }
            // Durak başlığı: tutma aralığına girerken belirir, çıkarken kaybolur
            const ci = STOPS.findIndex(([a, b]) => P > a - 0.012 && P < b + 0.012);
            if (ci !== cap) {
                cap = ci; setFrame(ci);
                document.querySelectorAll("[data-cap]").forEach((el) => el.classList.toggle("is-on", +el.dataset.cap === ci));
            }
            // İlerleme göstergesi "II / IX": geçilen durak sayısı
            const prog = document.querySelector("[data-dive-prog]");
            if (prog) {
                const R = ["", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
                const done = Math.max(1, STOPS.filter(([a]) => P >= a - 0.012).length);
                const txt = R[done] + " / " + R[STOPS.length];
                if (prog.textContent !== txt) prog.textContent = txt;
                prog.classList.toggle("is-on", P > 0.03 && P < 0.995);
            }
            // Mini harita: tablonun küçük önizlemesinde şu an bakılan bölge
            if (map) {
                let r;
                if (s === 2) r = coleRect(c);
                else {
                    const w = v.s, h = v.s / sa(), x = v.c[0] - w / 2, y = v.c[1] - h / 2;
                    r = s === 0 ? [x, y / HR, w, h / HR] : [(x - R[0]) / R[2], (y - R[1]) / R[3], w / R[2], h / R[3]];
                }
                const x0 = Math.max(0, r[0]), y0 = Math.max(0, r[1]), x1 = Math.min(1, r[0] + r[2]), y1 = Math.min(1, r[1] + r[3]);
                const box = map.querySelector("i").style;
                box.left = (x0 * 100).toFixed(2) + "%"; box.top = (y0 * 100).toFixed(2) + "%";
                box.width = (Math.max(0.02, x1 - x0) * 100).toFixed(2) + "%"; box.height = (Math.max(0.02, y1 - y0) * 100).toFixed(2) + "%";
                map.classList.toggle("is-on", P > 0.03 && P < 0.999);
            }
            const hc = heroCopy();
            if (hc) {
                const f = 1 - ss(0.03, 0.12, P);
                hc.style.opacity = f.toFixed(3);
                hc.style.transform = `translate3d(0, ${(-40 * (1 - f)).toFixed(1)}px, 0)`;
                hc.style.visibility = f < 0.01 ? "hidden" : "";
                hc.parentNode.style.setProperty("--hero-f", f.toFixed(3));
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
            const v = viewAt(P), c = coleAt(P);
            uniforms.uCam.value.set(v.c[0], v.c[1]);
            uniforms.uSpan.value = v.s;
            // Panini → Robert: mürekkep dağılması. Robert → Cole: sinematik karartma (dönüşümlü)
            uniforms.uB1.value = ss(0.455, 0.52, P);
            const cole = P >= SWITCH ? 1 : 0;
            uniforms.uB2.value = cole; uniforms.uArchFade.value = cole;
            uniforms.uDark.value = ss(0.795, 0.828, P) * (1 - ss(0.836, 0.875, P));
            uniforms.uColeZoom.value = c.z;
            uniforms.uColeFocus.value.set(c.f[0], c.f[1]);
            const after = journey ? Math.max(0, -journey.getBoundingClientRect().bottom + window.innerHeight) / window.innerHeight : 0;
            uniforms.uDim.value = Math.min(0.2, after * 0.3);
            uniforms.uTime.value += dt;
            uniforms.uMouse.value.set(mouse.x, mouse.y);
            if (flowTex && window.BrushFlow && window.BrushFlow.dirty) { flowTex.needsUpdate = true; window.BrushFlow.dirty = false; }
            // Bir zoom durağındayken fırça ekranın ortasındaki detayın üstündeyse: detay canlanır, yanında müze etiketi
            {
                const ci = STOPS.findIndex(([a, b]) => P > a - 0.012 && P < b + 0.012);
                const over = ci >= 0 && brushPos.x > 0.28 && brushPos.x < 0.72 && brushPos.y > 0.2 && brushPos.y < 0.8;
                uniforms.uHotAmt.value += ((over ? 1 : 0) - uniforms.uHotAmt.value) * 0.08;
                if (window.BrushFlow) {
                    const el = over ? document.querySelector(`[data-cap="${ci}"] .dive-cap-t`) : null;
                    window.BrushFlow.hover = el ? { text: el.textContent } : null;
                }
            }
            applyStage(P, v, c);
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
        window.Dive = { sync, uniforms, viewAt: (p) => viewAt(p), stops: STOPS, progress: () => P };
    }

    const maybeStart = () => { if (document.body.dataset.page === "home") start(); };
    document.addEventListener("router:navigated", maybeStart);
    maybeStart();
})();
