/* =========================================================
   Venus Digital - page.js
   Skrip ringan untuk halaman produk, artikel, dan kebijakan.
   ========================================================= */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function $(s) { return document.querySelector(s); }
  function $all(s) { return Array.prototype.slice.call(document.querySelectorAll(s)); }

  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }

  /* ---------- Navbar: bayangan, sembunyi/muncul, garis progres, kembali ke atas ---------- */
  var header = $("#header");
  var progress = $("#progress");
  var toTop = $("#toTop"), toTopBar = $("#toTopBar"), RING = 131.95;
  var lastY = window.scrollY, ticking = false, drawerOpen = false;
  // Efek yang mengikuti posisi scroll hanya di komputer; di HP membuat scroll tersendat
  var scrollFx = finePointer && !reduceMotion;

  var lastProg = -1;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      var y = window.scrollY, prog = 0;
      if (scrollFx) {
        var max = document.documentElement.scrollHeight - window.innerHeight;
        prog = max > 0 ? Math.min(y / max, 1) : 0;
      }
      header.classList.toggle("is-scrolled", y > 10);
      if (scrollFx && Math.abs(prog - lastProg) > 0.0005) {
        lastProg = prog;
        if (progress) progress.style.transform = "scaleX(" + prog.toFixed(4) + ")";
        if (toTopBar && y > 600) toTopBar.style.strokeDashoffset = (RING * (1 - prog)).toFixed(2);
      }
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

  /* ---------- Judul bagian muncul per kata (sekali) ---------- */
  if (!reduceMotion) $all(".section__head h2, .cta h2").forEach(function (el) {
    if (el.children.length) return;
    var text = el.textContent.trim().replace(/\s+/g, " ");
    el.setAttribute("aria-label", text);
    el.classList.add("split");
    el.innerHTML = text.split(" ").map(function (w, i) {
      return '<span class="w" aria-hidden="true"><span style="--wi:' + i + '">' + esc(w) + "</span></span>";
    }).join(" ");
  });

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
