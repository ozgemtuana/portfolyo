/* ==========================================================================
   Canlanan tablo (Ana Sayfa açılış sahnesi)
   - Arka plan: Thomas Cole, "Italian Coast Scene with Ruined Tower" (1838, NGA, CC0).
   - Ön plan: Hubert Robert'in taş kemeri (Hermitage, kamu malı); açıklığı şeffaf bırakıldı.
   - Derinlik haritası (Depth Anything V2 ile üretildi) tabloyu katmanlara ayırır:
     fare ve kaydırma, yakın ve uzak katmanları farklı hızda kaydırır (2.5D).
   - Tablonun ÜSTÜNE: denizde ışıltı, ufukta sis, güneşten ışık huzmeleri, havada toz.
   - Son işlem: tuval dokusu (ambientCG Fabric039, CC0), sıcak renk düzeni, gren, vinyet.
   Yalnızca ana sayfada çalışır; diğer sayfalarda world.js devam eder.
   ========================================================================== */

(function () {
    if (typeof THREE === "undefined") return;
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const SUN = [0.216, 1 - 0.579], HORIZON = 1 - 0.606;      // tablo üzerinde (doku koordinatı, v yukarı)
    const OPEN = [0.156, 1 - 0.758, 0.6, 1 - 0.216];          // kemer açıklığı (u0, v0, u1, v1)

    // WebGL bağlamı yalnızca ana sayfaya ilk girişte kurulur
    let started = false;
    function start() {
    if (started) return;
    started = true;

    const wrap = document.createElement("div");
    wrap.className = "paint-bg";
    wrap.setAttribute("aria-hidden", "true");
    const canvas = document.createElement("canvas");
    wrap.appendChild(canvas);
    document.body.insertBefore(wrap, document.body.firstChild);

    let renderer;
    try {
        renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: "high-performance" });
    } catch (e) { root.classList.add("paint-fallback"); return; }
    // GPU bağlamı kaybolursa sekme çökmesin: düz tablo görseline düş, geri gelirse yeniden çiz
    canvas.addEventListener("webglcontextlost", (e) => { e.preventDefault(); root.classList.add("paint-fallback"); }, false);
    canvas.addEventListener("webglcontextrestored", () => { root.classList.remove("paint-fallback"); dirty = true; }, false);
    const small = Math.min(window.innerWidth, window.innerHeight) < 700;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, small ? 1.25 : 1.5));

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const big = window.innerWidth * (window.devicePixelRatio || 1) > 1700;
    const loader = new THREE.TextureLoader();
    const tex = (src, repeat) => {
        const t = loader.load(src, () => { loaded++; dirty = true; if (loaded === 4) root.classList.add("paint-ready"); });
        t.minFilter = THREE.LinearFilter; t.generateMipmaps = false;
        if (repeat) { t.wrapS = t.wrapT = THREE.RepeatWrapping; }
        return t;
    };
    let loaded = 0;

    const uniforms = {
        uCole: { value: tex(big ? "images/scenes/cole-2560.webp" : "images/scenes/cole-1280.webp") },
        uMaps: { value: tex("images/scenes/cole-maps.png") },
        uArch: { value: tex(big ? "images/scenes/arch.webp" : "images/scenes/arch-sm.webp") },
        uWeave: { value: tex("images/scenes/canvas-weave.jpg", true) },
        uRes: { value: new THREE.Vector2(1, 1) },
        uTime: { value: 0 },
        uHero: { value: 0 },
        uDim: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uColeAspect: { value: 3840 / 2822 },
        uArchAspect: { value: 1920 / 3049 },
        uSun: { value: new THREE.Vector2(SUN[0], SUN[1]) },
        uHorizon: { value: HORIZON },
        uOpen: { value: new THREE.Vector4(OPEN[0], OPEN[1], OPEN[2], OPEN[3]) },
        uMotion: { value: reduce ? 0 : 1 }
    };

    const frag = `
precision highp float;
uniform sampler2D uCole, uMaps, uArch, uWeave;
uniform vec2 uRes, uMouse, uSun;
uniform vec4 uOpen;
uniform float uTime, uHero, uDim, uColeAspect, uArchAspect, uHorizon, uMotion;
varying vec2 vUv;

float hash(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p) { float v = 0.0, a = 0.5; for (int i = 0; i < 4; i++) { v += a * noise(p); p = p * 2.03 + 17.1; a *= 0.5; } return v; }

// Ekranı resmin içine "cover" yerleştir; zoom ve odak noktası ile
vec2 cover(vec2 uv, float imgAspect, float zoom, vec2 focus) {
    float sa = uRes.x / uRes.y;
    vec2 span = sa > imgAspect ? vec2(1.0, imgAspect / sa) : vec2(sa / imgAspect, 1.0);
    span /= zoom;
    vec2 lo = clamp(focus - span * 0.5, vec2(0.0), vec2(1.0) - span);
    return lo + uv * span;
}

void main() {
    vec2 uv = vUv;
    float sa = uRes.x / uRes.y;
    float t = uTime * uMotion;
    float hp = clamp(uHero, 0.0, 1.4);

    /* ---- Arka plan tablosu: derinliğe göre kayan katmanlar ---- */
    // Masaüstünde kule kemer açıklığının içine düşsün diye resim biraz yakınlaştırılıp sağa kaydırılır
    float zoom = (sa < 1.0 ? 1.0 : 1.32) + 0.14 * hp;
    vec2 focus = vec2(sa < 1.0 ? 0.66 : 0.72, sa < 1.0 ? 0.52 : 0.56 + 0.05 * hp);
    vec2 base = cover(uv, uColeAspect, zoom, focus);
    vec2 drift = (uMouse * vec2(-1.0, 1.0) * 0.011 + vec2(0.0, -0.022 * hp)) * uMotion;
    float d0 = texture2D(uMaps, base).r;
    vec2 cuv = base + drift * (d0 - 0.32);
    float d = texture2D(uMaps, cuv).r;                 // ikinci adım: kenarlarda yırtılmayı azaltır
    cuv = base + drift * (d - 0.32);
    vec3 maps = texture2D(uMaps, cuv).rgb;
    float water = maps.g, sky = maps.b;

    // Gökyüzü: bulutlar çok yavaş salınır
    cuv.x += sky * sin(t * 0.045) * 0.005;
    // Deniz: küçük dalga kırılması, öne yaklaştıkça güçlenir
    float nearW = smoothstep(uHorizon, uHorizon - 0.25, cuv.y);
    cuv.y += water * nearW * (sin(cuv.x * 260.0 + t * 1.7) * 0.0011 + sin(cuv.x * 97.0 - t * 1.15 + cuv.y * 50.0) * 0.0009);
    vec3 col = texture2D(uCole, cuv).rgb;

    // Güneşin denizdeki ışıltısı
    float column = exp(-abs((cuv.x - uSun.x) * uColeAspect) * 9.0);
    float glint = smoothstep(0.78, 1.0, noise(vec2(cuv.x * 420.0, cuv.y * 900.0 - t * 2.4))) * water * column * nearW;
    col += vec3(1.0, 0.93, 0.78) * glint * 0.55;

    // Ufukta sis
    float band = exp(-pow((cuv.y - uHorizon) / 0.085, 2.0));
    float mist = fbm(vec2(cuv.x * 3.2 + t * 0.012, cuv.y * 7.0 - t * 0.004));
    col = mix(col, vec3(0.93, 0.89, 0.8), band * (1.0 - d) * (0.18 + 0.22 * mist));
    // Alçak sis tülü (yakın kayalıkların dibinde)
    float low = smoothstep(0.42, 0.0, cuv.y) * fbm(vec2(cuv.x * 2.0 - t * 0.02, cuv.y * 4.0));
    col = mix(col, vec3(0.86, 0.82, 0.72), low * 0.16);

    // Güneşin çevresinde yumuşak, sıcak parıltı (huzme deseni yok; tablonun ışığını bozmaz)
    vec2 sd = (cuv - uSun) * vec2(uColeAspect, 1.0);
    col += vec3(1.0, 0.9, 0.72) * exp(-length(sd) * 5.0) * 0.1 * (1.0 - d);

    /* ---- Ön plan: taş kemer (kaydırınca kamera içinden geçer) ---- */
    float az = (sa < 1.0 ? 1.0 : 1.22) + hp * hp * 2.4;
    vec2 afocus = vec2((uOpen.x + uOpen.z) * 0.5, sa < 0.63 ? 0.5 : uOpen.w - 0.16);
    vec2 auv = cover(uv - uMouse * vec2(-1.0, 1.0) * 0.012 * uMotion, uArchAspect, az, afocus);
    vec4 arch = texture2D(uArch, auv);
    float inside = step(0.0, auv.x) * step(auv.x, 1.0) * step(0.0, auv.y) * step(auv.y, 1.0);
    float aA = arch.a * inside * (1.0 - smoothstep(0.7, 1.0, hp));
    // Kemerin iç kenarına sıcak gün ışığı
    vec3 archCol = arch.rgb * (0.9 + 0.18 * smoothstep(0.35, 0.0, abs(auv.x - uOpen.z)) * 0.6);
    col = mix(col, archCol, aA);

    /* ---- Havada süzülen toz ---- */
    vec2 p = vec2(uv.x * sa, uv.y);
    float dust = 0.0;
    for (int k = 0; k < 3; k++) {
        float fk = float(k);
        vec2 q = p * (9.0 + fk * 7.0) + vec2(t * (0.05 + fk * 0.02), -t * (0.08 + fk * 0.03));
        vec2 id = floor(q), f = fract(q) - 0.5;
        float h = hash(id + fk * 13.7);
        vec2 o = vec2(hash(id + 3.1), hash(id + 7.7)) - 0.5;
        float r = length(f - o * 0.7);
        float tw = 0.5 + 0.5 * sin(t * (1.0 + h * 2.0) + h * 6.28);
        dust += step(0.86, h) * smoothstep(0.06, 0.0, r) * tw * (0.5 - fk * 0.12);
    }
    float lightZone = exp(-length((uv - vec2(0.45, 0.62)) * vec2(sa, 1.0)) * 1.4);
    col += vec3(1.0, 0.88, 0.66) * dust * lightZone * 0.5 * uMotion;

    /* ---- Tablo dokusu ve renk düzeni ---- */
    float weave = texture2D(uWeave, gl_FragCoord.xy / 420.0).r;
    col *= 0.95 + 0.1 * weave;
    float lum = dot(col, vec3(0.299, 0.587, 0.114));
    col = mix(vec3(lum), col, 0.92);
    col = col * vec3(1.04, 1.0, 0.9) + vec3(0.02, 0.012, 0.0);
    col = pow(max(col, 0.0), vec3(0.97, 0.97, 1.02));
    col *= 1.0 - uDim;
    float vig = smoothstep(1.2, 0.3, length((uv - 0.5) * vec2(sa * 0.75, 1.0)));
    col *= mix(0.72, 1.0, vig);
    col += (hash(gl_FragCoord.xy + fract(t * 7.0) * 91.0) - 0.5) * 0.04;
    gl_FragColor = vec4(col, 1.0);
}`;
    const mat = new THREE.ShaderMaterial({
        uniforms,
        vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }",
        fragmentShader: frag,
        depthTest: false, depthWrite: false
    });
    scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat));

    /* ---------- Durum ---------- */
    let active = false, dirty = true, visible = true, last = performance.now();
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    let hero = 0, heroT = 0;

    const resize = () => {
        renderer.setSize(window.innerWidth, window.innerHeight, false);
        uniforms.uRes.value.set(canvas.width, canvas.height);
        dirty = true;
    };
    const readScroll = () => { heroT = window.scrollY / Math.max(1, window.innerHeight); dirty = true; };
    window.addEventListener("resize", resize);
    window.addEventListener("scroll", readScroll, { passive: true });
    window.addEventListener("mousemove", (e) => {
        mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
        mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    });
    // Dokunmatikte: cihaz eğimi (izin isteyen tarayıcılarda sessizce atlanır)
    window.addEventListener("deviceorientation", (e) => {
        if (e.gamma == null) return;
        mouse.tx = Math.max(-1, Math.min(1, e.gamma / 25));
        mouse.ty = Math.max(-1, Math.min(1, (e.beta - 45) / 25));
    });
    document.addEventListener("visibilitychange", () => { visible = !document.hidden; last = performance.now(); });
    resize(); readScroll();

    function frame(now) {
        requestAnimationFrame(frame);
        if (!active || !visible) return;
        const dt = Math.min(0.05, (now - last) / 1000); last = now;
        const k = 1 - Math.exp(-dt * 3.5);
        mouse.x += (mouse.tx - mouse.x) * k; mouse.y += (mouse.ty - mouse.y) * k;
        hero += (heroT - hero) * (1 - Math.exp(-dt * 5));
        if (reduce) { hero = heroT; if (!dirty) return; }
        uniforms.uTime.value += dt;
        uniforms.uMouse.value.set(mouse.x, mouse.y);
        uniforms.uHero.value = hero;
        uniforms.uDim.value = Math.min(0.5, Math.max(0, (hero - 0.85) * 0.6));
        renderer.render(scene, camera);
        dirty = false;
    }
    requestAnimationFrame(frame);

    // Sayfaya göre aç/kapat (js/router.js sayfa değiştirince olay yayar)
    const sync = () => {
        active = document.body.dataset.page === "home";
        root.classList.toggle("paint-on", active);
        if (window.World && window.World.pause) window.World.pause(active);
        last = performance.now(); readScroll(); dirty = true;
    };
    document.addEventListener("router:navigated", sync);
    sync();
    window.Painting = { sync, uniforms };
    }

    const maybeStart = () => { if (document.body.dataset.page === "home") start(); };
    document.addEventListener("router:navigated", maybeStart);
    maybeStart();
})();
