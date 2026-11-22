/* ==========================================================================
   Açılış (yalnızca ilk girişte, Ana Sayfa'da)
   Mühürlü sayaç 100'e ulaşınca "Gir" butonu çıkar (js/transition.js). Basınca:
     1) Met Müzesi'nin çift kanatlı kapısı (Paris, 18. yy; CC0) ortadan iki yana açılır,
     2) arkasında Hubert Robert'in "Büyük Galeri" tablosu (Louvre, 1796; kamu malı) görünür,
     3) kamera kapıdan geçip salonun derinliğine ilerler, Panini galerisine (js/dive.js) karışır.
   Süre ~4.5 sn, "Atla" butonu var. Hareket azaltılmışsa hiç oynamaz.
   ========================================================================== */
(function () {
    const S = "images/scenes/";
    const VP = [0.355, 0.72];                         // salon tablosunda kaybolma noktası
    const OPEN = [210 / 1989, 230 / 3630, 1580 / 1989, 3270 / 3630]; // kapı kasasındaki açıklık (x, y, w, h)
    const L = { tr: { skip: "Atla" }, en: { skip: "Skip" } };

    function build() {
        const small = Math.min(innerWidth, innerHeight) < 700;
        const el = document.createElement("div");
        el.className = "intro";
        el.setAttribute("aria-hidden", "true");
        el.innerHTML =
            `<div class="intro-hall" style="background-image:url(${S}${small ? "hall-1400.webp" : "hall-2560.webp"})"></div>` +
            `<div class="intro-front">` +
                `<div class="intro-wall"></div>` +
                `<div class="intro-door">` +
                    `<div class="intro-leaf intro-leaf--l"><img src="${S}door-left.webp" alt=""></div>` +
                    `<div class="intro-leaf intro-leaf--r"><img src="${S}door-right.webp" alt=""></div>` +
                    `<img class="intro-frame" src="${S}door-frame.webp" alt="">` +
                `</div>` +
            `</div>` +
            `<button type="button" class="intro-skip">${L[document.documentElement.lang === "en" ? "en" : "tr"].skip}</button>`;
        document.body.appendChild(el);
        return el;
    }

    // Salon tablosunu, kaybolma noktası kapı açıklığının ortasına gelecek biçimde yerleştir
    function placeHall(el) {
        const hall = el.querySelector(".intro-hall");
        const A = 3840 / 2998, vw = innerWidth, vh = innerHeight;
        let w = Math.max(vw, vh * A) * 1.25, h = w / A;
        const door = el.querySelector(".intro-door").getBoundingClientRect();
        // Duvarda kapı açıklığı kadar delik (evenodd): salon yalnızca kapıdan görünür
        const ox = door.left + door.width * OPEN[0], oy = door.top + door.height * OPEN[1];
        const ow = door.width * OPEN[2], oh = door.height * OPEN[3];
        el.querySelector(".intro-wall").style.clipPath =
            `polygon(evenodd, 0 0, ${vw}px 0, ${vw}px ${vh}px, 0 ${vh}px, 0 0, ${ox}px ${oy}px, ${ox + ow}px ${oy}px, ${ox + ow}px ${oy + oh}px, ${ox}px ${oy + oh}px, ${ox}px ${oy}px)`;
        const cx = door.left + door.width * (OPEN[0] + OPEN[2] / 2), cy = door.top + door.height * (OPEN[1] + OPEN[3] * 0.62);
        let left = cx - VP[0] * w, top = cy - VP[1] * h;
        // tablonun kenarı görünmesin
        left = Math.min(0, Math.max(vw - w, left)); top = Math.min(0, Math.max(vh - h, top));
        Object.assign(hall.style, { width: w + "px", height: h + "px", left: left + "px", top: top + "px",
            transformOrigin: `${cx - left}px ${cy - top}px` });
        return [cx, cy];
    }

    function play() {
        return new Promise((resolve) => {
            if (typeof gsap === "undefined" || matchMedia("(prefers-reduced-motion: reduce)").matches) return resolve();
            const el = build();
            const imgs = [...el.querySelectorAll("img")];
            const go = () => {
                const [cx, cy] = placeHall(el);
                const front = el.querySelector(".intro-front");
                front.style.transformOrigin = `${cx}px ${cy}px`;
                let done = false;
                const finish = () => { if (done) return; done = true; tl.kill(); gsap.to(el, { opacity: 0, duration: 0.5, onComplete: () => el.remove() }); resolve(); };
                const tl = gsap.timeline({ onComplete: () => { done = true; el.remove(); } });
                window.Intro.tl = tl;
                tl.from(el, { opacity: 0, duration: 0.5, ease: "power2.out" })
                    // Kanatlar menteşelerinden açılır; açıldıkça gölgede kalır
                    .to(".intro-leaf--l", { rotateY: -108, duration: 2.0, ease: "power2.inOut" }, 0.45)
                    .to(".intro-leaf--r", { rotateY: 108, duration: 2.0, ease: "power2.inOut" }, 0.5)
                    .fromTo(".intro-leaf img", { filter: "brightness(1)" }, { filter: "brightness(.45)", duration: 2.0, ease: "power1.in" }, 0.5)
                    // Kamera kapıdan geçer, salonda ilerler
                    .to(front, { scale: 7, duration: 2.1, ease: "power3.in" }, 1.75)
                    .to(front, { opacity: 0, duration: 0.5, ease: "none" }, 3.3)
                    .to(".intro-hall", { scale: 2.1, duration: 3.0, ease: "power1.inOut" }, 1.6)
                    .call(resolve, null, 3.9)
                    .to(el, { opacity: 0, duration: 0.9, ease: "power2.inOut" }, 3.9);
                el.querySelector(".intro-skip").addEventListener("click", finish);
                addEventListener("keydown", (e) => { if (e.key === "Escape") finish(); }, { once: true });
            };
            Promise.all(imgs.map((i) => i.complete ? 1 : new Promise((r) => { i.onload = i.onerror = r; }))).then(go);
        });
    }

    window.Intro = { play };
})();
