/* ==========================================================================
   Sayfa dalışları (Ana Sayfa dışındaki sayfalar)
   Her sayfanın tablo zinciri js/pagedive-data.js'te. Kaydırdıkça kamera tablonun
   belirli detaylarına sırayla zoom yapar; her durakta sol altta başlık + italik açıklama,
   sağ üstte mini harita, sağ altta müze etiketi. Tablolar arası geçiş dönüşümlü:
   mürekkep dağılması / sinematik karartma.
   Sayfa başlığı (h1'in kutusu) tablonun üstündeki yapışkan sahneye taşınır; belge sırası
   değişmez, metin gerçek HTML olarak kalır. Tek WebGL tuvali, DPR en fazla 1.5.
   ========================================================================== */
(function () {
    if (typeof THREE === "undefined" || !window.PAGE_DIVES) return;
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const P_DIR = "images/paintings/";
    const U_HOLD = 1, U_MOVE = 1.2, U_TRANS = 1.6, U_START = 1, VH_PER_UNIT = 48;

    let renderer = null, scene, camera, uniforms, canvas, wrap, small = false;
    let cfg = null, plan = null, journey = null, hero = null, copy = null, active = false, dirty = true, visible = true;
    let P = 0, PT = 0, last = performance.now(), stage = -1, cap = -1;
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    const loader = new THREE.TextureLoader();
    const cache = {};                                   // key -> { lo, hi }

    const lang = () => (root.lang === "en" ? "en" : "tr");
    const sa = () => window.innerWidth / window.innerHeight;
    const ss = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

    /* ---------- Doku önbelleği: düşük çözünürlük hemen, yüksek çözünürlük yalnızca yakındaki tablolar için ---------- */
    function texOf(i) {
        const p = cfg[i], c = cache[p.key] || (cache[p.key] = {});
        const mk = (src) => {
            const t = loader.load(src, () => { dirty = true; });
            t.generateMipmaps = true; t.minFilter = THREE.LinearMipmapLinearFilter;
            t.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
            return t;
        };
        if (!c.lo) c.lo = mk(P_DIR + p.key + "-2048.webp");
        if (!small && !c.hi) c.hi = mk(P_DIR + p.key + "-hi.webp");
        return c.hi && c.hi.image && c.hi.image.complete && c.hi.image.naturalWidth ? c.hi : c.lo;
    }
    function trimCache(cur) {
        Object.keys(cache).forEach((k) => {
            const i = cfg ? cfg.findIndex((p) => p.key === k) : -1;
            if (i === -1 || Math.abs(i - cur) > 1) {
                if (cache[k].hi) { cache[k].hi.dispose(); delete cache[k].hi; }
                if (i === -1 && cache[k].lo) { cache[k].lo.dispose(); delete cache[k]; }
            }
        });
    }

    /* ---------- Görünüm: merkez (u, v) ve görünen genişlik oranı s ---------- */
    const coverS = (a) => Math.min(1, sa() / a);
    function fit(a, b) {                                   // b: { u, v, w, h } kutusu
        let s = Math.min(coverS(a), Math.max(b.w, b.h * sa() / a));
        return clampV(a, { c: [b.u, b.v], s });
    }
    function clampV(a, v) {
        const w = v.s, h = v.s * a / sa();
        return { c: [Math.min(1 - w / 2, Math.max(w / 2, v.c[0])), Math.min(1 - h / 2, Math.max(h / 2, v.c[1]))], s: v.s };
    }
    const lerpView = (a, b, t) => {
        const s = Math.exp(Math.log(a.s) * (1 - t) + Math.log(b.s) * t);
        const k = Math.abs(a.s - b.s) < 1e-6 ? 1 - t : (s - b.s) / (a.s - b.s);
        return { c: [b.c[0] + (a.c[0] - b.c[0]) * k, b.c[1] + (a.c[1] - b.c[1]) * k], s };
    };
    const zoomed = (a, v, f) => clampV(a, { c: v.c, s: v.s * f });
    const rectOf = (a, v) => { const w = v.s, h = v.s * a / sa(); return [v.c[0] - w / 2, v.c[1] - h / 2, w, h]; };

    /* ---------- Plan: durakları birim zamana diz ---------- */
    function buildPlan() {
        let u = 0;
        const paints = [], trans = [], holds = [];
        cfg.forEach((p, i) => {
            const startV = p.start ? fit(p.a, p.start) : { c: [0.5, 0.5], s: coverS(p.a) };
            const keys = [];
            if (i === 0) { keys.push([0, startV]); u = U_START; keys.push([u, startV]); }
            else {
                const prev = paints[i - 1];
                trans.push({ ua: u, ub: u + U_TRANS, from: i - 1, to: i, type: i % 2 ? 0 : 1, a0: prev.keys[prev.keys.length - 1][1], b1: startV });
                u += U_TRANS; keys.push([u, startV]);
            }
            p.stops.forEach((s, k) => {
                const v = fit(p.a, s);
                u += U_MOVE; keys.push([u, v]);
                holds.push({ ua: u, ub: u + U_HOLD, cap: holds.length, i, k });
                u += U_HOLD; keys.push([u, v]);
            });
            if (i === cfg.length - 1) {
                const endV = p.end ? fit(p.a, p.end) : { c: [0.5, 0.5], s: coverS(p.a) };
                u += U_MOVE; keys.push([u, endV]);
            }
            paints.push({ keys });
        });
        return { paints, trans, holds, total: u };
    }
    function viewIn(i, u) {
        const k = plan.paints[i].keys;
        if (u <= k[0][0]) return k[0][1];
        for (let j = 0; j < k.length - 1; j++) if (u < k[j + 1][0]) return lerpView(k[j][1], k[j + 1][1], ss(k[j][0], k[j + 1][0], u));
        return k[k.length - 1][1];
    }
    // u anında: hangi tablo(lar), hangi görünüm, geçiş miktarı
    function stateAt(u) {
        const t = plan.trans.find((x) => u >= x.ua && u < x.ub);
        if (t) {
            const m = (u - t.ua) / (t.ub - t.ua), a = cfg[t.from].a, b = cfg[t.to].a;
            return { A: t.from, vA: lerpView(t.a0, zoomed(a, t.a0, 0.55), ss(0, 1, m)), B: t.to, vB: lerpView(zoomed(b, t.b1, Math.min(1.25, coverS(b) / t.b1.s)), t.b1, ss(0, 1, m)), mix: m, type: t.type };
        }
        let i = 0;
        plan.trans.forEach((x) => { if (u >= x.ub) i = x.to; });
        return { A: i, vA: viewIn(i, u), B: i, vB: null, mix: 0, type: 0 };
    }

    /* ---------- WebGL ---------- */
    function setupGL() {
        wrap = document.createElement("div");
        wrap.className = "pdive-bg";
        wrap.setAttribute("aria-hidden", "true");
        canvas = document.createElement("canvas");
        wrap.appendChild(canvas);
        document.body.insertBefore(wrap, document.body.firstChild);
        try { renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, powerPreference: "high-performance" }); }
        catch (e) { renderer = null; return false; }
        const gl = renderer.getContext();
        small = Math.min(window.innerWidth, window.innerHeight) < 700 || gl.getParameter(gl.MAX_TEXTURE_SIZE) < 8192;
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, small ? 1.25 : 1.5));
        canvas.addEventListener("webglcontextlost", (e) => { e.preventDefault(); root.classList.add("pdive-fallback"); }, false);
        canvas.addEventListener("webglcontextrestored", () => { root.classList.remove("pdive-fallback"); dirty = true; }, false);
        scene = new THREE.Scene();
        camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        const weave = loader.load("images/scenes/canvas-weave.jpg");
        weave.wrapS = weave.wrapT = THREE.RepeatWrapping;
        const blank = new THREE.DataTexture(new Uint8Array([20, 16, 12, 255]), 1, 1, THREE.RGBAFormat); blank.needsUpdate = true;
        uniforms = {
            uA: { value: blank }, uB: { value: blank }, uWeave: { value: weave },
            uRA: { value: new THREE.Vector4(0, 0, 1, 1) }, uRB: { value: new THREE.Vector4(0, 0, 1, 1) },
            uMix: { value: 0 }, uType: { value: 0 }, uRes: { value: new THREE.Vector2(1, 1) }, uMouse: { value: new THREE.Vector2() },
            uTime: { value: 0 }, uMotion: { value: reduce ? 0 : 1 }, uDim: { value: 0 }
        };
        const frag = `
precision highp float;
uniform sampler2D uA, uB, uWeave;
uniform vec4 uRA, uRB;
uniform vec2 uRes, uMouse;
uniform float uMix, uType, uTime, uMotion, uDim;
varying vec2 vUv;
float hash(vec2 p) { p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float noise(vec2 p) { vec2 i = floor(p), f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y); }
float fbm(vec2 p) { float v = 0.0, a = 0.5; for (int i = 0; i < 5; i++) { v += a * noise(p); p = p * 2.02 + 11.7; a *= 0.5; } return v; }
vec3 paint(sampler2D t, vec4 r, vec2 uv) {
    vec2 p = r.xy + vec2(uv.x, 1.0 - uv.y) * r.zw - uMouse * 0.004 * r.zw * uMotion;
    return texture2D(t, vec2(p.x, 1.0 - p.y)).rgb;
}
void main() {
    float sa = uRes.x / uRes.y, t = uTime * uMotion;
    vec3 col = paint(uA, uRA, vUv);
    if (uMix > 0.0001) {
        vec3 b = paint(uB, uRB, vUv);
        if (uType < 0.5) {                                  // mürekkep dağılması
            float n = fbm(vUv * vec2(sa, 1.0) * 3.2);
            float m = smoothstep(n - 0.06, n + 0.06, uMix * 1.16 - 0.08);
            float edge = m * (1.0 - m) * 4.0;
            col = mix(col, b, m) * (1.0 - 0.2 * edge);
        } else {                                            // sinematik karartma
            float d = 1.0 - abs(uMix * 2.0 - 1.0);
            col = mix(col, b, step(0.5, uMix)) * (1.0 - smoothstep(0.15, 0.95, d));
        }
    }
    // Yumuşak, çapraz bir ışık huzmesi ve havada süzülen toz
    vec2 q = vec2(vUv.x * sa, vUv.y);
    float beam = smoothstep(0.5, 0.78, fbm(vec2(dot(q, vec2(0.92, 0.39)) * 5.0 + t * 0.012, t * 0.02))) * smoothstep(0.0, 0.8, vUv.y);
    col = 1.0 - (1.0 - col) * (1.0 - vec3(1.0, 0.86, 0.62) * beam * 0.1);
    float dust = 0.0;
    for (int k = 0; k < 2; k++) {
        float fk = float(k);
        vec2 g = q * (10.0 + fk * 8.0) + vec2(t * (0.05 + fk * 0.02), -t * (0.07 + fk * 0.03));
        vec2 id = floor(g), f = fract(g) - 0.5;
        float h = hash(id + fk * 13.7);
        vec2 o = vec2(hash(id + 3.1), hash(id + 7.7)) - 0.5;
        dust += step(0.9, h) * smoothstep(0.05, 0.0, length(f - o * 0.7)) * (0.5 + 0.5 * sin(t * (1.0 + h * 2.0) + h * 6.28)) * (0.5 - fk * 0.15);
    }
    col += vec3(1.0, 0.92, 0.75) * dust * (0.22 + beam) * uMotion;
    col *= 0.975 + 0.05 * texture2D(uWeave, gl_FragCoord.xy / 460.0).r;
    col *= vec3(1.02, 1.0, 0.975) * (1.0 - uDim);
    col *= mix(0.8, 1.0, smoothstep(1.25, 0.35, length((vUv - 0.5) * vec2(sa * 0.75, 1.0))));
    col += (hash(gl_FragCoord.xy + fract(t * 7.0) * 91.0) - 0.5) * 0.018;
    gl_FragColor = vec4(col, 1.0);
}`;
        const mat = new THREE.ShaderMaterial({ uniforms, fragmentShader: frag, depthTest: false, depthWrite: false,
            vertexShader: "varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }" });
        scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), mat));
        window.addEventListener("resize", () => { if (active) { resize(); } });
        window.addEventListener("scroll", readScroll, { passive: true });
        window.addEventListener("mousemove", (e) => { mouse.tx = (e.clientX / innerWidth - 0.5) * 2; mouse.ty = (e.clientY / innerHeight - 0.5) * 2; });
        document.addEventListener("visibilitychange", () => { visible = !document.hidden; last = performance.now(); });
        requestAnimationFrame(frame);
        return true;
    }
    function resize() {
        renderer.setSize(innerWidth, innerHeight, false);
        uniforms.uRes.value.set(canvas.width, canvas.height);
        if (cfg) plan = buildPlan();
        readScroll(); dirty = true;
    }
    function readScroll() {
        if (!journey) return;
        const r = journey.getBoundingClientRect();
        PT = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height - innerHeight)));
        dirty = true;
    }

    /* ---------- Sahne DOM'u: başlık, durak başlıkları, mini harita, etiketler ---------- */
    const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
    function fillText() {
        if (!hero) return;
        const L = lang();
        let n = 0;
        cfg.forEach((p) => p.stops.forEach((s) => {
            const el = hero.querySelector(`[data-pcap="${n++}"]`);
            if (el) el.innerHTML = `<p class="dive-cap-t">${esc(s.t[L])}</p><p class="dive-cap-q">${esc(s.q[L])}</p>`;
        }));
        cfg.forEach((p, i) => {
            const el = hero.querySelector(`[data-plabel="${i}"]`);
            if (el) el.innerHTML = `<b>${esc(p.label[L][0])}</b><span>${esc(p.label[L][1])}</span><small>${esc(p.label[L][2])}</small>`;
        });
    }
    function buildDOM() {
        const main = document.querySelector("main");
        const h1 = main && main.querySelector("h1");
        if (!h1) return false;
        const head = h1.parentElement;
        let top = head;
        while (top.parentElement && top.parentElement !== main) top = top.parentElement;
        const units = plan.total;
        journey = document.createElement("div");
        journey.className = "journey pjourney";
        journey.style.height = Math.round(units * VH_PER_UNIT + 100) + "vh";
        let caps = "", n = 0;
        cfg.forEach((p) => p.stops.forEach(() => { caps += `<div class="dive-cap" data-pcap="${n}" data-cap-i="${n}"></div>`; n++; }));
        journey.innerHTML =
            `<div class="hero pj-hero"><div class="container px-5 pj-copy"></div>` +
            `<div class="dive-caps">${caps}</div>` +
            `<figure class="dive-map" data-pmap aria-hidden="true"><img alt="" decoding="async"><i></i></figure>` +
            `<div class="dive-labels" aria-live="polite">${cfg.map((p, i) => `<p class="dive-label" data-plabel="${i}"></p>`).join("")}</div>` +
            `</div>`;
        main.insertBefore(journey, top);
        hero = journey.querySelector(".pj-hero");
        copy = journey.querySelector(".pj-copy");
        copy.appendChild(head);
        fillText();
        stage = -1; cap = -2;
        return true;
    }

    /* ---------- Kare ---------- */
    function frame(now) {
        requestAnimationFrame(frame);
        if (!active || !visible || !plan) return;
        const dt = Math.min(0.05, (now - last) / 1000); last = now;
        const k = 1 - Math.exp(-dt * 4);
        mouse.x += (mouse.tx - mouse.x) * k; mouse.y += (mouse.ty - mouse.y) * k;
        P += (PT - P) * (reduce ? 1 : 1 - Math.exp(-dt * 6));
        if (Math.abs(PT - P) < 1e-4) P = PT;
        if (reduce && !dirty) return;
        const u = P * plan.total, st = stateAt(u);
        uniforms.uA.value = texOf(st.A);
        const rA = rectOf(cfg[st.A].a, st.vA);
        uniforms.uRA.value.set(rA[0], rA[1], rA[2], rA[3]);
        if (st.vB) {
            uniforms.uB.value = texOf(st.B);
            const rB = rectOf(cfg[st.B].a, st.vB);
            uniforms.uRB.value.set(rB[0], rB[1], rB[2], rB[3]);
        } else if (st.A + 1 < cfg.length) texOf(st.A + 1);          // sıradaki tabloyu önceden yükle
        uniforms.uMix.value = st.mix; uniforms.uType.value = st.type;
        const after = Math.max(0, innerHeight - journey.getBoundingClientRect().bottom) / innerHeight;
        uniforms.uDim.value = Math.min(0.5, after * 0.55);
        uniforms.uTime.value += dt;
        uniforms.uMouse.value.set(mouse.x, mouse.y);
        applyUI(u, st);
        renderer.render(scene, camera);
        dirty = false;
    }
    function applyUI(u, st) {
        // Etiket ve mini harita: geçişin yarısında yeni tabloya geçer
        const s = st.vB && st.mix >= 0.5 ? st.B : st.A;
        const map = hero.querySelector("[data-pmap]");
        if (s !== stage) {
            stage = s; trimCache(s);
            hero.querySelectorAll("[data-plabel]").forEach((el) => el.classList.toggle("is-on", +el.dataset.plabel === s));
            map.querySelector("img").src = P_DIR + cfg[s].key + "-2048.webp";
            map.classList.toggle("is-tall", cfg[s].a < 1);
        }
        const h = plan.holds.find((x) => u > x.ua - 0.25 && u < x.ub + 0.25);
        const ci = h ? h.cap : -1;
        if (ci !== cap) { cap = ci; hero.querySelectorAll("[data-pcap]").forEach((el) => el.classList.toggle("is-on", +el.dataset.pcap === ci)); }
        const v = s === st.A ? st.vA : st.vB, r = rectOf(cfg[s].a, v);
        const box = map.querySelector("i").style;
        box.left = (Math.max(0, r[0]) * 100).toFixed(2) + "%"; box.top = (Math.max(0, r[1]) * 100).toFixed(2) + "%";
        box.width = (Math.min(1, r[2]) * 100).toFixed(2) + "%"; box.height = (Math.min(1, r[3]) * 100).toFixed(2) + "%";
        map.classList.toggle("is-on", u > 0.6 && P < 0.999);
        // Başlık metni ilk durakta kaybolur
        const f = 1 - ss(0.45, 1.15, u);
        copy.style.opacity = f.toFixed(3);
        copy.style.transform = `translate3d(0, ${(-40 * (1 - f)).toFixed(1)}px, 0)`;
        copy.style.visibility = f < 0.01 ? "hidden" : "";
        hero.style.setProperty("--hero-f", f.toFixed(3));
    }

    /* ---------- Sayfa değişince ---------- */
    function sync() {
        const page = document.body.dataset.page;
        const next = window.PAGE_DIVES[page] || null;
        active = false;
        root.classList.remove("pdive-on");
        journey = hero = copy = null; plan = null;
        if (!next) { cfg = null; return; }
        if (!renderer && !setupGL()) { root.classList.add("pdive-fallback"); return; }
        cfg = next;
        renderer.setSize(innerWidth, innerHeight, false);
        uniforms.uRes.value.set(canvas.width, canvas.height);
        plan = buildPlan();
        if (!buildDOM()) { cfg = null; plan = null; return; }
        trimCache(0);
        active = true; P = PT = 0; last = performance.now();
        root.classList.add("pdive-on");
        readScroll(); P = PT;
        window.PageDive.stops = plan.holds.map((x) => [x.ua / plan.total, x.ub / plan.total]);
    }
    new MutationObserver(() => { if (cfg) fillText(); }).observe(root, { attributes: true, attributeFilter: ["lang"] });
    window.PageDive = { sync, progress: () => P, stops: [] };
    document.addEventListener("router:navigated", sync);
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", sync); else sync();
})();
