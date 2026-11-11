/* =========================================================
   Venus Digital - main.js (tanpa backend, tanpa library)
   ========================================================= */
(function () {
  "use strict";

  /* ---------- KONFIGURASI: ganti di sini ---------- */
  var CONFIG = {
    waNumber: "6285184885472", // format internasional, tanpa "+" atau "0" di depan
    brand: "Venus Digital"
  };

  /* ---------- DATA PRODUK ---------- */
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
     ANIMASI SCROLL: elemen muncul sekali saat pertama terlihat
     ========================================================= */
  var revealIO = ("IntersectionObserver" in window && !reduceMotion)
    ? new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          en.target.classList.add("in");
          revealIO.unobserve(en.target);
        });
      }, { rootMargin: "0px 0px -8% 0px" })
    : null;

  function addReveal(el, delay) {
    el.classList.add("reveal");
    el.style.setProperty("--d", (delay || 0) + "ms");
    if (revealIO) revealIO.observe(el);
    else el.classList.add("in");
  }

  function revealAll(sel, step) {
    var perParent = [];
    $all(sel).forEach(function (el) {
      var rec = null;
      for (var i = 0; i < perParent.length; i++) if (perParent[i].p === el.parentNode) rec = perParent[i];
      if (!rec) { rec = { p: el.parentNode, n: 0 }; perParent.push(rec); }
      addReveal(el, Math.min(rec.n * (step || 0), 240));
      rec.n++;
    });
  }

  /* ---------- Gambar produk ---------- */
  var mockHTML = window.VENUS.mockHTML;
  function productIcon(p) {
    return p.tags.indexOf("web") !== -1 ? "code" : p.tags.indexOf("bundle") !== -1 ? "package" : "sheet";
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
          '<div class="product__foot">' +
            '<div class="price"><strong>' + rupiah(p.price) + "</strong>" + (p.old ? "<del>" + rupiah(p.old) + "</del>" : "") + "</div>" +
            '<a class="buy-btn" href="' + waLink(buyText(p)) + '" target="_blank" rel="noopener" aria-label="Beli ' + esc(p.title) + ' lewat WhatsApp">Beli</a>' +
          "</div>" +
        "</div>" +
      "</div></article>";
    }).join("");

    $all(".product", grid).forEach(function (el, i) { addReveal(el, (i % 4) * 60); });
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
     indikator menu, mega menu
     ========================================================= */
  var header = $("#header");
  var lastY = window.scrollY;
  var scrollTicking = false;
  var toTop = $("#toTop");

  function onScroll() {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(function () {
      scrollTicking = false;
      var y = window.scrollY;
      header.classList.toggle("is-scrolled", y > 10);
      if (toTop) toTop.classList.toggle("is-visible", y > 600);
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
  if (toTop) toTop.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  });

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
      : PRODUCTS.slice(0, 6);
    pIndex = 0;
    if (!pResults.length) {
      pList.innerHTML = '<li class="palette__empty">Tidak ada produk untuk “' + esc(q) + '”. <a href="#custom" data-palette-close>Request custom</a></li>';
      return;
    }
    pList.innerHTML = '<li class="palette__label" role="presentation">' + (q ? "Hasil pencarian" : "Produk") + "</li>" +
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

  /* ---------- Resize ---------- */
  var resizeTimer, lastW = window.innerWidth;
  window.addEventListener("resize", function () {
    // iPhone memicu "resize" setiap bilah alamat muncul/hilang saat scroll
    // (hanya tingginya yang berubah): abaikan supaya tidak tersendat.
    if (window.innerWidth === lastW) return;
    lastW = window.innerWidth;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (window.innerWidth > 1024) setDrawer(false);
      moveIndicator(activeNavLink());
    }, 150);
  });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { moveIndicator(activeNavLink()); });
  moveIndicator(activeNavLink());

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

  /* ---------- FAQ: buka-tutup dengan tinggi yang halus ---------- */
  if (!reduceMotion && Element.prototype.animate) {
    $all(".faq details").forEach(function (d) {
      var summary = $("summary", d), anim = null, closing = false;
      summary.addEventListener("click", function (e) {
        e.preventDefault();
        var start = d.offsetHeight;
        var border = d.offsetHeight - d.clientHeight;
        var willOpen = !d.open || closing;
        if (anim) { anim.onfinish = null; anim.cancel(); }
        closing = !willOpen;
        d.open = true;
        var end = willOpen ? d.scrollHeight + border : summary.offsetHeight + border;
        anim = d.animate({ height: [start + "px", end + "px"] }, { duration: willOpen ? 320 : 260, easing: "cubic-bezier(.2,.75,.2,1)" });
        anim.onfinish = function () { if (!willOpen) d.open = false; closing = false; anim = null; };
      });
    });
  }

  /* ---------- Pasang animasi scroll ---------- */
  revealAll(".section__head", 0);
  revealAll(".cat", 50);
  revealAll(".bundle", 0);
  revealAll(".howto li", 70);
  revealAll(".feature", 70);
  revealAll(".custom__text", 0);
  revealAll(".custom .form", 80);
  revealAll(".area-wrap > div", 0);
  revealAll(".areas", 0);
  revealAll(".faq", 0);
  revealAll(".compare", 0);
  revealAll(".platforms", 0);
  revealAll(".cta", 0);

  render();
  window.__venusReady = true;
})();
