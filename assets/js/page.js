/* =========================================================
   Venus Digital — page.js
   Skrip ringan untuk halaman produk, artikel, dan kebijakan.
   ========================================================= */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function $(s) { return document.querySelector(s); }
  function $all(s) { return Array.prototype.slice.call(document.querySelectorAll(s)); }

  /* ---------- Navbar: bayangan, sembunyi/muncul, progress ---------- */
  var header = $("#header");
  var progress = $("#progress");
  var lastY = window.scrollY, ticking = false, drawerOpen = false;

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      var y = window.scrollY;
      header.classList.toggle("is-scrolled", y > 10);
      var max = document.documentElement.scrollHeight - window.innerHeight;
      if (progress) progress.style.transform = "scaleX(" + (max > 0 ? Math.min(y / max, 1) : 0) + ")";
      if (Math.abs(y - lastY) > 8) {
        header.classList.toggle("is-hidden", y > lastY && y > 320 && !drawerOpen);
        lastY = y;
      }
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  header.addEventListener("focusin", function () { header.classList.remove("is-hidden"); });
  onScroll();

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

  /* ---------- Animasi muncul saat scroll (dua arah) ---------- */
  var targets = $all("[data-reveal]");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        var el = en.target;
        if (en.intersectionRatio >= 0.12 || en.intersectionRect.height > window.innerHeight * 0.2) el.classList.add("in");
        else if (!en.isIntersecting) { el.classList.remove("in"); el.classList.toggle("from-top", en.boundingClientRect.top < 0); }
      });
    }, { threshold: [0, 0.12] });
    targets.forEach(function (el, i) {
      el.classList.add("reveal");
      el.style.setProperty("--d", ((+el.getAttribute("data-reveal") || 0) * 90) + "ms");
      io.observe(el);
    });
  }

  var year = $("#year");
  if (year) year.textContent = new Date().getFullYear();
  window.__venusReady = true;
})();
