/* =========================================================
   Venus Digital — main.js (tanpa backend, tanpa library)
   ========================================================= */
(function () {
  "use strict";

  /* ---------- KONFIGURASI: ganti di sini ---------- */
  var CONFIG = {
    waNumber: "6285184885472", // format internasional, tanpa "+" atau "0" di depan
    brand: "Venus Digital",
    showRatings: false         // ubah ke true HANYA jika rating & jumlah ulasan di data produk sudah asli

  };

  /* ---------- DATA PRODUK (nanti diganti dari backend/database) ----------
     mock: sheet | chart | dash | web | app | bundle  (gaya thumbnail)
     tags: keuangan | bisnis | pendidikan | web | bundle                    */
  var PRODUCTS = window.VENUS.products; // data ada di assets/js/products.js

  var FILTER_LABEL = { all: "Semua", keuangan: "Keuangan", bisnis: "Bisnis & UMKM", pendidikan: "Pendidikan", web: "Website & Aplikasi", bundle: "Paket Bundle" };

  /* ---------- Helpers ---------- */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $all(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function rupiah(n) { return "Rp" + n.toLocaleString("id-ID"); }
  function waLink(text) { return "https://wa.me/" + CONFIG.waNumber + "?text=" + encodeURIComponent(text); }
  function icon(name) { return '<svg class="i" aria-hidden="true"><use href="#i-' + name + '"/></svg>'; }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function findProduct(id) {
    for (var i = 0; i < PRODUCTS.length; i++) if (PRODUCTS[i].id === id) return PRODUCTS[i];
    return null;
  }
  function buyText(p) {
    return "Halo " + CONFIG.brand + ", saya ingin membeli *" + p.title + "* (" + rupiah(p.price) + "). Bagaimana cara pembayarannya?";
  }
  function matchQuery(p, q) {
    if (!q) return true;
    var hay = (p.title + " " + p.desc + " " + p.cat + " " + p.format + " " + p.tags.join(" ")).toLowerCase();
    return q.toLowerCase().split(/\s+/).every(function (w) { return hay.indexOf(w) !== -1; });
  }

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  var toastTimer;
  function toast(msg) {
    var t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("show"); }, 2600);
  }

  /* Kunci scroll: dipakai drawer, modal, dan pencarian tanpa saling menimpa */
  var locks = {};
  function setLock(key, on) {
    if (on) locks[key] = true; else delete locks[key];
    document.body.classList.toggle("no-scroll", Object.keys(locks).length > 0);
  }

  /* =========================================================
     ANIMASI SCROLL (arah-sadar: dari bawah saat scroll turun,
     dari atas saat scroll naik)
     ========================================================= */
  var revealIO = ("IntersectionObserver" in window && !reduceMotion)
    ? new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          var el = en.target;
          var visible = en.intersectionRatio >= 0.12 || en.intersectionRect.height > window.innerHeight * 0.2;
          if (visible) {
            el.classList.add("in");
            if (el.hasAttribute("data-count")) countUp(el);
          } else if (!en.isIntersecting) {
            el.classList.remove("in");
            el.classList.toggle("from-top", en.boundingClientRect.top < 0);
          }
        });
      }, { threshold: [0, 0.12] })
    : null;

  function addReveal(el, delay, variant) {
    el.classList.add("reveal");
    if (variant) el.classList.add("reveal--" + variant);
    el.style.setProperty("--d", (delay || 0) + "ms");
    if (revealIO) revealIO.observe(el);
    else { el.classList.add("in"); if (el.hasAttribute("data-count")) countUp(el); }
  }

  function revealAll(sel, step, variant) {
    var perParent = [];
    $all(sel).forEach(function (el) {
      var rec = null;
      for (var i = 0; i < perParent.length; i++) if (perParent[i].p === el.parentNode) rec = perParent[i];
      if (!rec) { rec = { p: el.parentNode, n: 0 }; perParent.push(rec); }
      addReveal(el, Math.min(rec.n * (step || 0), 480), variant);
      rec.n++;
    });
  }

  function countUp(el) {
    if (el.getAttribute("data-counted")) return;
    el.setAttribute("data-counted", "1");
    var b = $("b", el);
    var target = parseFloat(el.getAttribute("data-count"));
    var dec = parseInt(el.getAttribute("data-dec") || "0", 10);
    var suffix = el.getAttribute("data-suffix") || "";
    function fmt(v) { return (dec ? v.toFixed(dec).replace(".", ",") : Math.round(v).toLocaleString("id-ID")) + suffix; }
    if (reduceMotion) { b.textContent = fmt(target); return; }
    var start = null, dur = 1600;
    function step(ts) {
      if (start === null) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      b.textContent = fmt(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ---------- Thumbnail produk (CSS, tidak ada gambar yang bisa rusak) ---------- */
  var mockHTML = window.VENUS.mockHTML;
  function productIcon(p) {
    return p.mock === "web" || p.mock === "app" ? "code" : p.mock === "bundle" ? "package" : "sheet";
  }

  /* =========================================================
     KATALOG PRODUK
     ========================================================= */
  var state = { filter: "all", query: "" };
  var grid = $("#products");
  var info = $("#resultInfo");
  var empty = $("#emptyState");
  var heroInput = $("#heroSearchInput");

  function render() {
    if (revealIO) $all(".product", grid).forEach(function (el) { revealIO.unobserve(el); });

    var list = PRODUCTS.filter(function (p) {
      return (state.filter === "all" || p.tags.indexOf(state.filter) !== -1) && matchQuery(p, state.query);
    });

    grid.innerHTML = list.map(function (p) {
      var badge = p.badge ? '<span class="product__badge' + (p.badge.indexOf("Hemat") === 0 ? "" : " product__badge--soft") + '">' + esc(p.badge) + "</span>" : "";
      return '<article class="product"><div class="product__card">' +
        '<button class="product__thumb" data-open="' + p.id + '" aria-label="Lihat detail ' + esc(p.title) + '">' + badge +
          '<span class="product__format">' + esc(p.format) + "</span>" + mockHTML(p) + "</button>" +
        '<div class="product__body">' +
          '<span class="product__cat">' + esc(p.cat) + "</span>" +
          '<h3 class="product__title"><a href="produk/' + p.slug + '/">' + esc(p.title) + "</a></h3>" +
          '<p class="product__desc">' + esc(p.desc) + "</p>" +
          (CONFIG.showRatings ? '<div class="product__rating">' + icon("star") + p.rating.toFixed(1).replace(".", ",") + " <span>(" + p.reviews + " ulasan)</span></div>" : "") +
          '<div class="product__foot">' +
            '<div class="price"><strong>' + rupiah(p.price) + "</strong>" + (p.old ? "<del>" + rupiah(p.old) + "</del>" : "") + "</div>" +
            '<a class="icon-btn" href="' + waLink(buyText(p)) + '" target="_blank" rel="noopener" aria-label="Beli ' + esc(p.title) + '">' + icon("cart") + "</a>" +
          "</div>" +
        "</div>" +
      "</div></article>";
    }).join("");

    $all(".product", grid).forEach(function (el, i) { addReveal(el, (i % 4) * 80); });
    empty.hidden = list.length > 0;

    info.textContent = "";
    if (state.filter !== "all" || state.query) {
      var parts = [];
      if (state.filter !== "all") parts.push("kategori “" + FILTER_LABEL[state.filter] + "”");
      if (state.query) parts.push("pencarian “" + state.query + "”");
      info.appendChild(document.createTextNode(list.length + " produk untuk " + parts.join(" dan ")));
      var reset = document.createElement("button");
      reset.type = "button";
      reset.textContent = "Tampilkan semua";
      reset.addEventListener("click", function () { state.query = ""; heroInput.value = ""; setFilter("all"); });
      info.appendChild(reset);
    }
  }

  function setFilter(f) {
    state.filter = FILTER_LABEL[f] ? f : "all";
    $all(".tab").forEach(function (t) {
      var on = t.getAttribute("data-filter") === state.filter;
      t.classList.toggle("is-active", on);
      t.setAttribute("aria-selected", on ? "true" : "false");
    });
    $all(".cat[data-filter]").forEach(function (c) {
      c.classList.toggle("is-active", c.getAttribute("data-filter") === state.filter);
    });
    render();
  }

  function scrollToProducts() { $("#produk").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" }); }

  $all(".tab").forEach(function (t) {
    t.addEventListener("click", function () { setFilter(t.getAttribute("data-filter")); });
  });
  $all(".cat[data-filter]").forEach(function (c) {
    c.addEventListener("click", function () {
      var f = c.getAttribute("data-filter");
      setFilter(state.filter === f ? "all" : f);
      scrollToProducts();
    });
  });

  $("#heroSearch").addEventListener("submit", function (e) {
    e.preventDefault();
    state.query = heroInput.value.trim();
    setFilter("all");
    scrollToProducts();
  });
  heroInput.addEventListener("search", function () {
    if (!this.value && state.query) { state.query = ""; render(); }
  });

  /* Kartu produk: efek miring 3D + kilau mengikuti kursor */
  if (finePointer && !reduceMotion) {
    var tiltCard = null;
    var resetTilt = function (c) { if (c) { c.style.setProperty("--rx", "0deg"); c.style.setProperty("--ry", "0deg"); } };
    grid.addEventListener("pointermove", function (e) {
      if (e.pointerType !== "mouse") return;
      var card = e.target.closest(".product__card");
      if (card !== tiltCard) { resetTilt(tiltCard); tiltCard = card; }
      if (!card) return;
      var r = card.parentNode.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      card.style.setProperty("--ry", ((x - 0.5) * 12).toFixed(2) + "deg");
      card.style.setProperty("--rx", ((0.5 - y) * 10).toFixed(2) + "deg");
      card.style.setProperty("--gx", (x * 100).toFixed(1) + "%");
      card.style.setProperty("--gy", (y * 100).toFixed(1) + "%");
    });
    grid.addEventListener("pointerleave", function () { resetTilt(tiltCard); tiltCard = null; });
  }

  /* =========================================================
     MODAL DETAIL PRODUK
     ========================================================= */
  var modal = $("#modal");
  var lastFocus = null;

  function openModal(id, returnTo) {
    var p = findProduct(id);
    if (!p) return;
    $("#modalThumb").innerHTML = mockHTML(p);
    $("#modalCat").textContent = p.cat;
    $("#modalTitle").textContent = p.title;
    $("#modalDesc").textContent = p.desc;
    $("#modalFeatures").innerHTML = p.features.map(function (f) { return "<li>" + icon("check") + "<span>" + esc(f) + "</span></li>"; }).join("");
    $("#modalCompat").textContent = p.format === "Source code" || p.format === "Android & Web"
      ? "Format: " + p.format + ". File dikirim via link unduhan setelah pembayaran."
      : "Format: " + p.format + ". Kompatibel dengan Microsoft Excel 2010+, Google Sheets, dan Excel di HP.";
    $("#modalPrice").textContent = rupiah(p.price);
    $("#modalOld").textContent = p.old ? rupiah(p.old) : "";
    $("#modalBuy").href = waLink(buyText(p));
    $("#modalPage").href = "produk/" + p.slug + "/";
    lastFocus = returnTo || document.activeElement;
    modal.hidden = false;
    $(".modal__box", modal).scrollTop = 0;
    setLock("modal", true);
    $(".modal__close", modal).focus();
  }

  function closeModal() {
    if (modal.hidden) return false;
    modal.hidden = true;
    setLock("modal", false);
    if (lastFocus && lastFocus.focus) lastFocus.focus();
    return true;
  }

  modal.addEventListener("click", function (e) { if (e.target.closest("[data-close]")) closeModal(); });
  modal.addEventListener("keydown", function (e) {
    if (e.key !== "Tab") return;
    var f = $all("a[href], button:not([disabled])", modal);
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  /* =========================================================
     NAVBAR: sembunyi saat scroll turun, muncul saat scroll naik,
     progress bar, indikator yang meluncur, mega menu
     ========================================================= */
  var header = $("#header");
  var progress = $("#progress");
  var lastY = window.scrollY;
  var scrollTicking = false;

  function onScroll() {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(function () {
      scrollTicking = false;
      var y = window.scrollY;
      header.classList.toggle("is-scrolled", y > 10);
      var max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = "scaleX(" + (max > 0 ? Math.min(y / max, 1) : 0) + ")";
      var dy = y - lastY;
      if (Math.abs(dy) > 8) {
        header.classList.toggle("is-hidden", dy > 0 && y > 320 && !megaOpen && !drawerOpen);
        lastY = y;
      }
    });
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  header.addEventListener("focusin", function () { header.classList.remove("is-hidden"); });
  onScroll();

  // Indikator yang meluncur di bawah menu
  var navEl = $("#nav");
  var indicator = $("#navIndicator");
  var navHover = false;
  function activeNavLink() { return $(".nav__list .nav__link.is-active"); }
  function moveIndicator(el) {
    if (!el || !navEl.offsetWidth) { indicator.style.opacity = "0"; return; }
    indicator.style.width = el.offsetWidth + "px";
    indicator.style.transform = "translateX(" + el.offsetLeft + "px)";
    indicator.style.opacity = "1";
  }
  navEl.addEventListener("mouseover", function (e) {
    var l = e.target.closest(".nav__link");
    if (l) { navHover = true; moveIndicator(l); }
  });
  navEl.addEventListener("mouseleave", function () { navHover = false; moveIndicator(activeNavLink()); });

  // Menu aktif sesuai bagian yang sedang dilihat
  if ("IntersectionObserver" in window) {
    var navLinks = $all(".nav__list .nav__link");
    var sectionIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        navLinks.forEach(function (l) { l.classList.toggle("is-active", l.getAttribute("data-target") === en.target.id); });
        if (!navHover) moveIndicator(activeNavLink());
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    navLinks.forEach(function (l) {
      var s = document.getElementById(l.getAttribute("data-target"));
      if (s) sectionIO.observe(s);
    });
  }

  // Mega menu "Produk"
  var megaItem = $("#megaItem");
  var megaBtn = $("#megaBtn");
  var mega = $("#mega");
  var megaOpen = false, megaTimer = null, megaOpenedAt = 0;

  function openMega() {
    clearTimeout(megaTimer);
    if (megaOpen) return;
    megaOpen = true;
    megaOpenedAt = Date.now();
    mega.classList.add("is-open");
    megaBtn.setAttribute("aria-expanded", "true");
  }
  function closeMega() {
    clearTimeout(megaTimer);
    if (!megaOpen) return false;
    megaOpen = false;
    mega.classList.remove("is-open");
    megaBtn.setAttribute("aria-expanded", "false");
    return true;
  }
  if (finePointer) {
    megaItem.addEventListener("mouseenter", openMega);
    megaItem.addEventListener("mouseleave", function () { megaTimer = setTimeout(closeMega, 180); });
  }
  megaBtn.addEventListener("click", function () {
    if (!megaOpen) openMega();
    else if (Date.now() - megaOpenedAt > 400) closeMega(); // cegah tertutup tepat setelah dibuka oleh hover
  });
  megaItem.addEventListener("focusout", function (e) {
    if (e.relatedTarget && !megaItem.contains(e.relatedTarget)) closeMega();
  });
  document.addEventListener("click", function (e) {
    if (megaOpen && !megaItem.contains(e.target)) closeMega();
  });

  /* ---------- Drawer (menu mobile) ---------- */
  var burger = $("#burger");
  var drawer = $("#drawer");
  var drawerBackdrop = $("#drawerBackdrop");
  var drawerOpen = false;

  function setDrawer(open) {
    if (open === drawerOpen) return false;
    drawerOpen = open;
    drawer.classList.toggle("is-open", open);
    drawerBackdrop.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", open ? "true" : "false");
    setLock("drawer", open);
    if (open) { header.classList.remove("is-hidden"); setTimeout(function () { $("#drawerClose").focus(); }, 50); }
    else burger.focus({ preventScroll: true });
    return true;
  }
  burger.addEventListener("click", function () { setDrawer(!drawerOpen); });
  $("#drawerClose").addEventListener("click", function () { setDrawer(false); });
  drawerBackdrop.addEventListener("click", function () { setDrawer(false); });
  drawer.addEventListener("click", function (e) { if (e.target.closest("a")) setDrawer(false); });

  /* ---------- Link kategori dari mega menu / drawer ---------- */
  document.addEventListener("click", function (e) {
    var fl = e.target.closest("[data-filter-link]");
    if (fl) {
      state.query = "";
      heroInput.value = "";
      setFilter(fl.getAttribute("data-filter-link"));
      closeMega();
    }
    var op = e.target.closest("[data-open]");
    if (op) { closeMega(); openModal(op.getAttribute("data-open")); }
  });

  /* =========================================================
     PENCARIAN CEPAT (Ctrl + K)
     ========================================================= */
  var palette = $("#palette");
  var pInput = $("#paletteInput");
  var pList = $("#paletteList");
  var pResults = [], pIndex = 0;
  var searchBtn = $("#searchOpen");

  function openPalette() {
    closeMega();
    setDrawer(false);
    palette.hidden = false;
    setLock("palette", true);
    pInput.value = "";
    renderPalette();
    setTimeout(function () { pInput.focus(); }, 30);
  }
  function closePalette() {
    if (palette.hidden) return false;
    palette.hidden = true;
    setLock("palette", false);
    return true;
  }
  function renderPalette() {
    var q = pInput.value.trim();
    pResults = q
      ? PRODUCTS.filter(function (p) { return matchQuery(p, q); })
      : PRODUCTS.slice().sort(function (a, b) { return b.reviews - a.reviews; }).slice(0, 6);
    pIndex = 0;
    if (!pResults.length) {
      pList.innerHTML = '<li class="palette__empty">Tidak ada produk untuk “' + esc(q) + '”. <a href="#custom" data-palette-close>Request custom</a></li>';
      return;
    }
    pList.innerHTML = '<li class="palette__label" role="presentation">' + (q ? "Hasil pencarian" : "Produk pilihan") + "</li>" +
      pResults.map(function (p, i) {
        return '<li role="option" aria-selected="' + (i === 0) + '"><button type="button" class="palette__item' + (i === 0 ? " is-active" : "") + '" data-pi="' + i + '" tabindex="-1">' +
          '<span class="palette__thumb" style="--bg-c:' + p.bg + ";--ac:" + p.ac + '">' + icon(productIcon(p)) + "</span>" +
          '<span class="palette__text"><b>' + esc(p.title) + "</b><small>" + esc(p.cat) + " · " + esc(p.format) + "</small></span>" +
          '<span class="palette__price">' + rupiah(p.price) + "</span></button></li>";
      }).join("");
  }
  function setPaletteIndex(i) {
    if (!pResults.length) return;
    pIndex = (i + pResults.length) % pResults.length;
    $all(".palette__item", pList).forEach(function (b, n) {
      b.classList.toggle("is-active", n === pIndex);
      b.parentNode.setAttribute("aria-selected", n === pIndex ? "true" : "false");
      if (n === pIndex) b.scrollIntoView({ block: "nearest" });
    });
  }
  function choosePalette(i) {
    var p = pResults[i];
    if (!p) return;
    closePalette();
    openModal(p.id, searchBtn);
  }

  searchBtn.addEventListener("click", openPalette);
  pInput.addEventListener("input", renderPalette);
  pInput.addEventListener("keydown", function (e) {
    if (e.key === "ArrowDown") { e.preventDefault(); setPaletteIndex(pIndex + 1); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setPaletteIndex(pIndex - 1); }
    else if (e.key === "Enter") { e.preventDefault(); choosePalette(pIndex); }
    else if (e.key === "Tab") { e.preventDefault(); } // fokus tetap di kolom pencarian
  });
  pList.addEventListener("mousemove", function (e) {
    var b = e.target.closest(".palette__item");
    if (b) { var i = +b.getAttribute("data-pi"); if (i !== pIndex) setPaletteIndex(i); }
  });
  pList.addEventListener("click", function (e) {
    var b = e.target.closest(".palette__item");
    if (b) choosePalette(+b.getAttribute("data-pi"));
  });
  palette.addEventListener("click", function (e) {
    if (e.target.closest("[data-palette-close]")) closePalette();
  });

  /* ---------- Keyboard global ---------- */
  document.addEventListener("keydown", function (e) {
    if ((e.ctrlKey || e.metaKey) && (e.key === "k" || e.key === "K")) {
      e.preventDefault();
      if (palette.hidden) openPalette(); else closePalette();
      return;
    }
    if (e.key !== "Escape") return;
    if (closePalette()) return;
    if (closeModal()) return;
    if (setDrawer(false)) return;
    if (closeMega()) megaBtn.focus();
  });

  /* =========================================================
     HERO 3D: panggung miring mengikuti kursor & scroll,
     sorotan cahaya, dan gelombang titik 3D di latar belakang
     ========================================================= */
  var hero = $("#beranda");
  var stage = $("#stage");
  var heroVisible = true;
  var pointer = { nx: 0, ny: 0, x: -9999, y: -9999, inside: false, last: 0 };

  if (finePointer) {
    hero.addEventListener("pointermove", function (e) {
      var r = hero.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
      pointer.nx = pointer.x / r.width * 2 - 1;
      pointer.ny = pointer.y / r.height * 2 - 1;
      pointer.inside = true;
      pointer.last = performance.now();
      hero.style.setProperty("--mx", pointer.x.toFixed(0) + "px");
      hero.style.setProperty("--my", pointer.y.toFixed(0) + "px");
    });
    hero.addEventListener("pointerleave", function () { pointer.inside = false; pointer.nx = 0; pointer.ny = 0; });
  }

  if (!reduceMotion) {
    var cur = { rx: 8, ry: -10 };
    var stageRunning = false;
    var stageLoop = function (t) {
      if (!heroVisible || document.hidden) { stageRunning = false; return; }
      var idle = !pointer.inside || (t - pointer.last > 2500);
      var tx, ty;
      if (idle) { tx = 6 + Math.sin(t / 2400) * 4; ty = -8 + Math.sin(t / 3100) * 7; }
      else { tx = -pointer.ny * 11; ty = pointer.nx * 15; }
      cur.rx += (tx - cur.rx) * 0.06;
      cur.ry += (ty - cur.ry) * 0.06;
      var sp = Math.min(window.scrollY / Math.max(hero.offsetHeight, 1), 1);
      stage.style.transform = "rotateX(" + (cur.rx + sp * 16).toFixed(2) + "deg) rotateY(" + cur.ry.toFixed(2) + "deg) translateY(" + (-sp * 40).toFixed(1) + "px)";
      stage.style.setProperty("--gx", (50 + cur.ry * 3).toFixed(1) + "%");
      stage.style.setProperty("--gy", (30 - cur.rx * 3).toFixed(1) + "%");
      requestAnimationFrame(stageLoop);
    };
    var startStage = function () { if (!stageRunning) { stageRunning = true; requestAnimationFrame(stageLoop); } };
    startStage();
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        heroVisible = entries[0].isIntersecting;
        if (heroVisible) { startStage(); startWave(); }
      }).observe(hero);
    }
    document.addEventListener("visibilitychange", function () {
      if (!document.hidden) { startStage(); startWave(); }
    });
  }

  // Gelombang titik 3D (canvas, tanpa library)
  var canvas = $("#heroCanvas");
  var ctx = canvas.getContext && canvas.getContext("2d");
  var W = 0, H = 0, cols = 0, rows = 0, waveRunning = false;
  var mouseC = { x: -9999, y: -9999, s: 0 };

  function sizeWave() {
    if (!ctx) return;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = hero.clientWidth; H = hero.clientHeight;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cols = W < 700 ? 34 : 60;
    rows = W < 700 ? 18 : 28;
  }

  function drawWave(t) {
    ctx.clearRect(0, 0, W, H);
    var horizon = H * 0.6, cx = W / 2, sx = W * 0.17, sy = H * 0.7;
    var targetS = pointer.inside ? 1 : 0;
    mouseC.s += (targetS - mouseC.s) * 0.06;
    if (pointer.inside) {
      if (mouseC.x < -1000) { mouseC.x = pointer.x; mouseC.y = pointer.y; }
      mouseC.x += (pointer.x - mouseC.x) * 0.12;
      mouseC.y += (pointer.y - mouseC.y) * 0.12;
    }
    var sigma2 = 2 * 140 * 140;
    for (var j = 0; j < rows; j++) {
      var v = j / (rows - 1);
      var s = 1 / (1 + v * 4);
      for (var i = 0; i < cols; i++) {
        var u = i / (cols - 1) * 2 - 1;
        var px = cx + u * 6 * s * sx;
        if (px < -10 || px > W + 10) continue;
        var y = Math.sin(u * 3 + t * 0.0009) * 0.11 + Math.cos(v * 7 - t * 0.0012) * 0.09 + Math.sin((u + v) * 5 + t * 0.0006) * 0.05;
        var py = horizon + (0.62 - y) * s * sy;
        var lift = 0;
        if (mouseC.s > 0.01) {
          var dx = px - mouseC.x, dy = py - mouseC.y;
          lift = Math.exp(-(dx * dx + dy * dy) / sigma2) * mouseC.s;
          py -= lift * 60 * (0.4 + s);
        }
        var k = Math.min(lift * 1.5, 1);
        var r = Math.round(29 + 197 * k), g = Math.round(110 + 2 * k), b = Math.round(85 - 27 * k);
        var a = (0.06 + 0.34 * s) * (1 - v * 0.5) + lift * 0.5;
        ctx.fillStyle = "rgba(" + r + "," + g + "," + b + "," + a.toFixed(3) + ")";
        ctx.beginPath();
        ctx.arc(px, py, 0.7 + 2.3 * s + lift * 1.5, 0, 6.2832);
        ctx.fill();
      }
    }
  }

  function waveLoop(t) {
    if (!heroVisible || document.hidden) { waveRunning = false; return; }
    drawWave(t);
    requestAnimationFrame(waveLoop);
  }
  function startWave() {
    if (!ctx || reduceMotion || waveRunning) return;
    waveRunning = true;
    requestAnimationFrame(waveLoop);
  }
  if (ctx) {
    sizeWave();
    if (reduceMotion) drawWave(0); else startWave();
  }

  /* ---------- Resize ---------- */
  var resizeTimer;
  window.addEventListener("resize", function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (ctx) { sizeWave(); if (reduceMotion) drawWave(0); }
      if (window.innerWidth > 1024) setDrawer(false);
      moveIndicator(activeNavLink());
    }, 150);
  });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { moveIndicator(activeNavLink()); });
  moveIndicator(activeNavLink());

  /* =========================================================
     KURSOR KUSTOM (hanya di komputer dengan mouse)
     ========================================================= */
  if (finePointer && !reduceMotion) {
    var cursor = $("#cursor");
    var cx = -100, cy = -100, tx = -100, ty = -100, shown = false;
    document.addEventListener("mousemove", function (e) {
      tx = e.clientX; ty = e.clientY;
      if (!shown) { shown = true; cx = tx; cy = ty; cursor.classList.add("is-visible"); }
    });
    document.documentElement.addEventListener("mouseleave", function () { shown = false; cursor.classList.remove("is-visible"); });
    document.addEventListener("mouseover", function (e) {
      var t = e.target;
      var isText = !!t.closest("input, textarea");
      cursor.classList.toggle("is-text", isText);
      cursor.classList.toggle("is-hover", !isText && !!t.closest("a, button, summary, select, label, .product__card"));
    });
    document.addEventListener("mousedown", function () { cursor.classList.add("is-down"); });
    document.addEventListener("mouseup", function () { cursor.classList.remove("is-down"); });
    (function cursorLoop() {
      cx += (tx - cx) * 0.2;
      cy += (ty - cy) * 0.2;
      cursor.style.transform = "translate3d(" + cx.toFixed(1) + "px," + cy.toFixed(1) + "px,0)";
      requestAnimationFrame(cursorLoop);
    })();
  }

  /* =========================================================
     FORM REQUEST CUSTOM -> WHATSAPP
     ========================================================= */
  var form = $("#requestForm");

  function setErr(input, msg) {
    var field = input.closest(".field");
    field.classList.toggle("has-error", !!msg);
    $(".err", field).textContent = msg || "";
  }
  function validate() {
    var ok = true;
    var digits = form.wa.value.replace(/\D/g, "");
    if (form.nama.value.trim().length < 2) { setErr(form.nama, "Nama wajib diisi."); ok = false; } else setErr(form.nama);
    if (!/^(08|628)\d{7,12}$/.test(digits)) { setErr(form.wa, "Nomor WhatsApp tidak valid (contoh: 081234567890)."); ok = false; } else setErr(form.wa);
    if (!form.jenis.value) { setErr(form.jenis, "Pilih jenis produk."); ok = false; } else setErr(form.jenis);
    if (form.deskripsi.value.trim().length < 10) { setErr(form.deskripsi, "Ceritakan kebutuhan minimal 10 karakter."); ok = false; } else setErr(form.deskripsi);
    return ok;
  }
  $all("input, select, textarea", form).forEach(function (el) {
    var evt = el.tagName === "SELECT" ? "change" : "input";
    el.addEventListener(evt, function () { if (el.closest(".field").classList.contains("has-error")) setErr(el); });
  });
  form.wa.addEventListener("input", function () {
    var clean = this.value.replace(/[^\d+\s-]/g, "");
    if (clean !== this.value) this.value = clean;
  });
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!validate()) {
      var firstErr = $(".has-error input, .has-error select, .has-error textarea", form);
      if (firstErr) firstErr.focus();
      return;
    }
    var msg =
      "Halo " + CONFIG.brand + ", saya ingin request custom:\n\n" +
      "*Nama:* " + form.nama.value.trim() + "\n" +
      "*WA:* " + form.wa.value.trim() + "\n" +
      "*Jenis:* " + form.jenis.value + "\n" +
      "*Budget:* " + form.budget.value + "\n\n" +
      "*Kebutuhan:*\n" + form.deskripsi.value.trim();
    var w = window.open(waLink(msg), "_blank");
    if (w) w.opener = null;                       // keamanan tab baru
    else window.location.href = waLink(msg);      // jika popup diblokir
    toast("Membuka WhatsApp. Terima kasih!");
    form.reset();
  });

  /* ---------- Link WhatsApp umum ---------- */
  var generalWa = waLink("Halo " + CONFIG.brand + ", saya ingin bertanya tentang produk digital Anda.");
  $("#waFloat").href = generalWa;
  $("#ctaWa").href = generalWa;
  $("#year").textContent = new Date().getFullYear();

  /* ---------- Pasang animasi scroll ---------- */
  revealAll(".section__head", 0);
  revealAll(".trustbar .stat, .trustbar .pay", 90);
  revealAll(".cat", 70);
  revealAll(".bundle", 0, "zoom");
  revealAll(".howto li", 110);
  revealAll(".feature", 110);
  revealAll(".custom__text", 0, "left");
  revealAll(".custom .form", 120, "right");
  revealAll(".testi", 110);
  revealAll(".area-wrap > div", 0, "left");
  revealAll(".areas li", 80);
  revealAll(".faq details", 70);
  revealAll(".cta", 0, "zoom");
  revealAll(".footer__grid > div", 90);

  render();
  window.__venusReady = true;
})();
