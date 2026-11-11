/* =========================================================
   Venus Digital - page.js
   Skrip ringan untuk halaman produk, artikel, dan kebijakan.
   ========================================================= */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function $(s) { return document.querySelector(s); }
  function $all(s) { return Array.prototype.slice.call(document.querySelectorAll(s)); }

  /* ---------- Navbar: bayangan, sembunyi/muncul, kembali ke atas ---------- */
  var header = $("#header");
  var toTop = $("#toTop");
  var lastY = window.scrollY, ticking = false, drawerOpen = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      var y = window.scrollY;
      header.classList.toggle("is-scrolled", y > 10);
      if (toTop) toTop.classList.toggle("is-visible", y > 600);
      if (Math.abs(y - lastY) > 8) {
        header.classList.toggle("is-hidden", y > lastY && y > 320 && !drawerOpen);
        lastY = y;
      }
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  header.addEventListener("focusin", function () { header.classList.remove("is-hidden"); });
  onScroll();
  if (toTop) toTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  });

  /* ---------- Bar beli di bawah layar (halaman produk) ----------
     Dicek dari posisi tombol beli setiap scroll (bukan IntersectionObserver),
     supaya tetap muncul walau halaman digulir sangat cepat. */
  var buybar = $("#buybar"), buyAnchor = $(".pd__actions"), buybarOn = null;
  function updateBuybar() {
    if (!buybar || !buyAnchor) return;
    var show = buyAnchor.getBoundingClientRect().bottom < 0;
    if (show === buybarOn) return;
    buybarOn = show;
    buybar.classList.toggle("is-visible", show);
    buybar.setAttribute("aria-hidden", show ? "false" : "true");
    document.body.classList.toggle("buybar-on", show);
  }
  window.addEventListener("scroll", updateBuybar, { passive: true });
  window.addEventListener("resize", updateBuybar);
  updateBuybar();

  /* ---------- Drawer (menu mobile) ---------- */
  var burger = $("#burger"), drawer = $("#drawer"), backdrop = $("#drawerBackdrop");
  function setDrawer(open) {
    if (open === drawerOpen) return;
    drawerOpen = open;
    drawer.classList.toggle("is-open", open);
    backdrop.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.classList.toggle("no-scroll", open);
    if (open) { header.classList.remove("is-hidden"); setTimeout(function () { $("#drawerClose").focus(); }, 50); }
    else burger.focus({ preventScroll: true });
  }
  burger.addEventListener("click", function () { setDrawer(!drawerOpen); });
  $("#drawerClose").addEventListener("click", function () { setDrawer(false); });
  backdrop.addEventListener("click", function () { setDrawer(false); });
  drawer.addEventListener("click", function (e) { if (e.target.closest("a")) setDrawer(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") setDrawer(false); });
  window.addEventListener("resize", function () { if (window.innerWidth > 1024) setDrawer(false); });

  /* ---------- Elemen muncul sekali saat pertama terlihat ---------- */
  var targets = $all("[data-reveal]");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add("in");
        io.unobserve(en.target);
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    targets.forEach(function (el) {
      el.classList.add("reveal");
      el.style.setProperty("--d", ((+el.getAttribute("data-reveal") || 0) * 60) + "ms");
      io.observe(el);
    });
  }

  var year = $("#year");
  if (year) year.textContent = new Date().getFullYear();
  window.__venusReady = true;
})();
