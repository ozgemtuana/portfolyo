/* Mobil/tablet menüsü (<992px): Esc ve dışarı tıklama ile kapanır, odak hamburger düğmesine döner.
   aria-expanded'ı Bootstrap Collapse yönetir; menü router ile yeniden kurulduğu için olaylar document üzerinde dinlenir. */
(function () {
    const panel = () => document.querySelector(".navbar-collapse");
    const toggler = () => document.querySelector(".navbar-toggler");
    const isOpen = () => { const p = panel(); return !!p && p.classList.contains("show"); };
    function close(returnFocus) {
        const p = panel(); if (!p || !isOpen() || !window.bootstrap) return;
        const inst = window.bootstrap.Collapse.getOrCreateInstance(p, { toggle: false });
        inst.hide();
        if (returnFocus && toggler()) toggler().focus();
    }
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && isOpen()) close(true); });
    document.addEventListener("click", (e) => {
        if (!isOpen()) return;
        if (e.target.closest(".navbar-toggler")) return;
        // menü içinde bir bağlantıya basıldıysa ya da dışarı tıklandıysa kapat (dil düğmeleri açık kalır)
        if (e.target.closest(".navbar-collapse .nav-link") || !e.target.closest(".navbar-collapse")) close(false);
    });
    document.addEventListener("focusin", (e) => { if (isOpen() && !e.target.closest(".navbar")) close(false); });
})();
