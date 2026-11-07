#!/usr/bin/env node
/* =========================================================
   Venus Digital — generator halaman statis
   Membuat: halaman produk, artikel, kebijakan, dan sitemap.xml
   Jalankan dari folder proyek:   node tools/build.js
   ========================================================= */
"use strict";
const fs = require("fs");
const path = require("path");
const vm = require("vm");
const { articles, legal } = require("./content");

const ROOT = path.resolve(__dirname, "..");
const SITE = "https://haidarhafiz21.github.io/venusdigital/";
const WA = "6285184885472";
const BRAND = "Venus Digital";
const BUILD_DATE = new Date().toISOString().slice(0, 10);

/* ---------- Data produk dari assets/js/products.js ---------- */
const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(ROOT, "assets/js/products.js"), "utf8"), sandbox);
const { products, mockHTML } = sandbox.window.VENUS;

/* ---------- Ikon SVG diambil dari index.html (satu sumber) ---------- */
const indexHtml = fs.readFileSync(path.join(ROOT, "index.html"), "utf8");
const spriteStart = indexHtml.indexOf('<svg width="0" height="0"');
const spriteEnd = indexHtml.indexOf("</svg>", indexHtml.indexOf("</defs>", spriteStart)) + 6;
if (spriteStart < 0 || spriteEnd < 6) throw new Error("Sprite ikon tidak ditemukan di index.html");
const SPRITE = indexHtml.slice(spriteStart, spriteEnd);

/* ---------- Helpers ---------- */
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const rupiah = (n) => "Rp" + n.toLocaleString("id-ID");
const waLink = (t) => "https://wa.me/" + WA + "?text=" + encodeURIComponent(t);
const icon = (n) => `<svg class="i" aria-hidden="true"><use href="#i-${n}"/></svg>`;
const buyText = (p) => `Halo ${BRAND}, saya ingin membeli *${p.title}* (${rupiah(p.price)}). Bagaimana cara pembayarannya?`;
const isFile = (p) => p.format === "Source code" || p.format === "Android & Web";
const seoName = (p) => (/Excel/.test(p.title) || !/Excel/.test(p.format) ? p.title : p.title + " Excel");
const MONTHS = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
const fmtDate = (iso) => { const [y, m, d] = iso.split("-").map(Number); return `${d} ${MONTHS[m - 1]} ${y}`; };
const readMinutes = (html) => Math.max(3, Math.round(html.replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length / 200));
const jsonld = (obj) => `<script type="application/ld+json">\n${JSON.stringify(obj, null, 2)}\n</script>`;
const breadcrumb = (items) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it[0], item: it[1] }))
});
const compatText = (p) => isFile(p)
  ? `Format ${p.format}. File dikirim lewat link unduhan setelah pembayaran.`
  : `Format ${p.format}. Bisa dibuka di Microsoft Excel 2010 ke atas, Google Sheets, dan aplikasi Excel di HP.`;

/* ---------- Layout bersama ---------- */
function layout(o) {
  const depth = o.path.split("/").filter(Boolean).length;
  const r = "../".repeat(depth);
  const url = SITE + o.path;
  const og = o.ogImage || SITE + "assets/img/og-image.png";
  const generalWa = waLink(`Halo ${BRAND}, saya ingin bertanya tentang produk digital Anda.`);
  const nav = [
    ["Beranda", r + "#beranda", ""],
    ["Produk", r + "#produk", "produk"],
    ["Cara Beli", r + "#cara-beli", ""],
    ["Request Custom", r + "#custom", ""],
    ["Artikel", r + "artikel/", "artikel"],
    ["FAQ", r + "#faq", ""]
  ];
  const navHtml = nav.map(([t, h, k]) => `<li><a href="${h}" class="nav__link${k && k === o.active ? " is-active" : ""}"${k && k === o.active ? ' aria-current="page"' : ""}>${t}</a></li>`).join("\n            ");
  const drawerHtml = nav.map(([t, h], i) => `<a href="${h}" style="--i:${i}">${t}</a>`).join("\n      ");

  return `<!doctype html>
<html lang="id">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(o.title)}</title>
  <meta name="description" content="${esc(o.description)}">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="${url}">
  <meta property="og:type" content="${o.ogType || "website"}">
  <meta property="og:locale" content="id_ID">
  <meta property="og:site_name" content="${BRAND}">
  <meta property="og:title" content="${esc(o.title)}">
  <meta property="og:description" content="${esc(o.description)}">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${og}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="theme-color" content="#0f3d33">
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='14' fill='%230f3d33'/%3E%3Ctext x='32' y='44' font-family='Arial,sans-serif' font-size='34' font-weight='700' text-anchor='middle' fill='%23fff'%3EVD%3C/text%3E%3C/svg%3E">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="${r}assets/css/style.css">
  <script>document.documentElement.classList.add("js");setTimeout(function(){if(!window.__venusReady)document.documentElement.classList.remove("js")},4000);</script>
  ${(o.jsonld || []).map(jsonld).join("\n  ")}
</head>
<body>
  <!-- Halaman ini dibuat otomatis oleh tools/build.js — edit sumbernya, bukan file ini. -->
  ${SPRITE}

  <a class="skip-link" href="#main">Lewati ke konten</a>
  <div class="progress" id="progress" aria-hidden="true"></div>

  <div class="topbar">
    <div class="container topbar__inner">
      <div class="topbar__track">
        <span class="topbar__item">${icon("download")}File dikirim via WhatsApp setelah pembayaran</span>
        <span class="topbar__item">${icon("shield")}Garansi 7 hari uang kembali</span>
        <span class="topbar__item">${icon("lock")}Pembayaran aman via QRIS & transfer bank</span>
      </div>
    </div>
  </div>

  <header class="header" id="header">
    <div class="container">
      <div class="header__bar">
        <a href="${r}" class="logo" aria-label="${BRAND} - Beranda">
          <span class="logo__word">Venus<span>Digital</span></span>
          <span class="logo__tag">Produk Digital Siap Pakai</span>
        </a>
        <nav class="nav" aria-label="Navigasi utama">
          <ul class="nav__list">
            ${navHtml}
          </ul>
        </nav>
        <div class="header__actions">
          <a href="${generalWa}" target="_blank" rel="noopener" class="btn btn--primary header__cta btn--shine">Hubungi Kami</a>
          <button type="button" class="burger" id="burger" aria-label="Buka menu" aria-expanded="false" aria-controls="drawer">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </div>
  </header>

  <div class="drawer-backdrop" id="drawerBackdrop"></div>
  <aside class="drawer" id="drawer" aria-label="Menu">
    <div class="drawer__head">
      <span class="logo__word">Venus<span>Digital</span></span>
      <button type="button" class="drawer__close" id="drawerClose" aria-label="Tutup menu">${icon("x")}</button>
    </div>
    <nav class="drawer__nav" aria-label="Navigasi mobile">
      ${drawerHtml}
    </nav>
    <div class="drawer__foot">
      <a href="${generalWa}" target="_blank" rel="noopener" class="btn btn--primary btn--block">Hubungi Kami</a>
      <p>${icon("clock")}Setiap hari, 08.00–21.00 WIB</p>
    </div>
  </aside>

  <main id="main">
${o.body}
  </main>

  <footer class="footer">
    <div class="container footer__grid">
      <div class="footer__brand">
        <a href="${r}" class="logo logo--light">
          <span class="logo__word">Venus<span>Digital</span></span>
          <span class="logo__tag">Produk Digital Siap Pakai</span>
        </a>
        <p>Template Excel, Google Sheets, website, dan aplikasi siap pakai untuk keluarga, UMKM, dan sekolah.</p>
      </div>
      <div>
        <h4>Produk</h4>
        ${products.slice(0, 5).map((p) => `<a href="${r}produk/${p.slug}/">${esc(p.title)}</a>`).join("")}
      </div>
      <div>
        <h4>Bantuan</h4>
        <a href="${r}#cara-beli">Cara Beli</a><a href="${r}artikel/">Artikel & Tips</a><a href="${r}#custom">Request Custom</a><a href="${r}kebijakan-refund/">Garansi & Refund</a><a href="${r}#faq">FAQ</a>
      </div>
      <div>
        <h4>Kontak</h4>
        <p>${icon("pin")}Pamekasan, Madura, Jawa Timur</p>
        <p>${icon("phone")}<a href="https://wa.me/${WA}" target="_blank" rel="noopener">0851-8488-5472 (WhatsApp)</a></p>
        <p>${icon("clock")}Setiap hari, 08.00–21.00 WIB</p>
      </div>
    </div>
    <div class="container footer__bottom">
      <span>© <span id="year">${BUILD_DATE.slice(0, 4)}</span> ${BRAND}. Semua hak dilindungi.</span>
      <span class="footer__legal"><a href="${r}kebijakan-privasi/">Kebijakan Privasi</a><a href="${r}syarat-ketentuan/">Syarat & Ketentuan</a><a href="${r}kebijakan-refund/">Kebijakan Refund</a></span>
    </div>
  </footer>

${o.extra || ""}
  <button type="button" class="totop" id="toTop" aria-label="Kembali ke atas">
    <svg class="totop__ring" viewBox="0 0 48 48" aria-hidden="true"><circle class="totop__track" cx="24" cy="24" r="21"/><circle class="totop__bar" id="toTopBar" cx="24" cy="24" r="21"/></svg>
    ${icon("arrow-up")}
  </button>

  <a class="wa-float" href="${generalWa}" target="_blank" rel="noopener" aria-label="Chat WhatsApp">
    <svg viewBox="0 0 32 32" aria-hidden="true"><path fill="currentColor" d="M16 3a13 13 0 0 0-11.2 19.6L3 29l6.6-1.7A13 13 0 1 0 16 3zm0 23.6c-2 0-3.9-.5-5.6-1.5l-.4-.2-3.9 1 1-3.8-.3-.4A10.6 10.6 0 1 1 16 26.6zm5.8-7.9c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2l-1 1.2c-.2.2-.4.2-.7.1a8.7 8.7 0 0 1-4.3-3.8c-.3-.6.3-.5 1-1.7.1-.2 0-.4 0-.5l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.1 1.1-1.1 2.7s1.2 3.2 1.3 3.4c.2.2 2.3 3.5 5.6 4.9 2.1.9 2.9 1 4 .8.6-.1 1.9-.8 2.2-1.5.3-.8.3-1.4.2-1.5-.1-.2-.3-.3-.6-.4z"/></svg>
  </a>

  <script src="${r}assets/js/page.js" defer></script>
</body>
</html>
`;
}

/* ---------- Kartu produk statis ---------- */
function productCard(q, r, i) {
  const href = `${r}produk/${q.slug}/`;
  const badge = q.badge ? `<span class="product__badge${q.badge.indexOf("Hemat") === 0 ? "" : " product__badge--soft"}">${esc(q.badge)}</span>` : "";
  return `<article class="product" data-reveal="${i % 3}"><div class="product__card">
          <a class="product__thumb" href="${href}" aria-label="Lihat ${esc(q.title)}">${badge}<span class="product__format">${esc(q.format)}</span>${mockHTML(q)}</a>
          <div class="product__body">
            <span class="product__cat">${esc(q.cat)}</span>
            <h3 class="product__title"><a href="${href}">${esc(q.title)}</a></h3>
            <p class="product__desc">${esc(q.desc)}</p>
            <div class="product__foot">
              <div class="price"><strong>${rupiah(q.price)}</strong>${q.old ? `<del>${rupiah(q.old)}</del>` : ""}</div>
              <a class="icon-btn" href="${waLink(buyText(q))}" target="_blank" rel="noopener" aria-label="Beli ${esc(q.title)}">${icon("cart")}</a>
            </div>
          </div>
        </div></article>`;
}

function articleCard(a, r, i, Tag) {
  const H = Tag || "h3";
  return `<a class="acard" href="${r}artikel/${a.slug}/" data-reveal="${i % 3}">
          <span class="acard__tag">${esc(a.tag)}</span>
          <${H}>${esc(a.title)}</${H}>
          <p>${esc(a.description)}</p>
          <span class="acard__more">Baca panduan ${icon("arrow")}</span>
        </a>`;
}

/* ---------- Halaman produk ---------- */
function productPage(p) {
  const pagePath = `produk/${p.slug}/`;
  const r = "../../";
  const name = seoName(p);
  const buy = waLink(buyText(p));
  const ask = waLink(`Halo ${BRAND}, saya ingin bertanya dulu tentang *${p.title}*.`);
  const save = p.old ? Math.round((1 - p.price / p.old) * 100) : 0;
  const badge = p.badge ? `<span class="product__badge${p.badge.indexOf("Hemat") === 0 ? "" : " product__badge--soft"}">${esc(p.badge)}</span>` : "";

  let related = products.filter((q) => q.id !== p.id && q.tags.some((t) => p.tags.includes(t)));
  for (const q of products) { if (related.length >= 3) break; if (q.id !== p.id && !related.includes(q)) related.push(q); }
  related = related.slice(0, 3);
  const guides = articles.filter((a) => a.product === p.id);

  const body = `    <section class="subhero">
      <div class="container">
        <ol class="crumbs"><li><a href="${r}">Beranda</a></li><li><a href="${r}#produk">Produk</a></li><li aria-current="page">${esc(p.title)}</li></ol>
        <div class="pd">
          <div class="pd__media" data-reveal="0">${badge}<span class="product__format">${esc(p.format)}</span>${mockHTML(p)}</div>
          <div class="pd__info" data-reveal="1">
            <span class="chip">${esc(p.cat)}</span>
            <h1>${esc(name)}</h1>
            <p class="subhero__lead">${esc(p.desc)}</p>
            <div class="pd__price"><strong>${rupiah(p.price)}</strong>${p.old ? `<del>${rupiah(p.old)}</del><span class="pd__save">Hemat ${save}%</span>` : ""}</div>
            <div class="pd__actions">
              <a class="btn btn--accent btn--shine" href="${buy}" target="_blank" rel="noopener">${icon("cart")}Beli via WhatsApp</a>
              <a class="btn btn--outline" href="${ask}" target="_blank" rel="noopener">Tanya Dulu</a>
            </div>
            <ul class="pd__trust">
              <li>${icon("download")}File dikirim via WhatsApp setelah pembayaran</li>
              <li>${icon("shield")}Garansi 7 hari uang kembali</li>
              <li>${icon(isFile(p) ? "code" : "sheet")}${isFile(p) ? esc(p.format) : "Excel 2010+ & Google Sheets"}</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container content-grid">
        <div>
          <div class="panel" data-reveal="0">
            <h2>Tentang produk ini</h2>
            ${p.long.map((t) => `<p>${esc(t)}</p>`).join("\n            ")}
          </div>
          <div class="panel" data-reveal="0">
            <h2>Yang Anda dapatkan</h2>
            <ul class="checklist">${p.features.map((f) => `<li>${icon("check")}<span>${esc(f)}</span></li>`).join("")}</ul>
            <p class="modal__compat" style="margin:18px 0 0">${esc(compatText(p))}</p>
          </div>
          <div class="panel" data-reveal="0">
            <h2>Cocok untuk</h2>
            <ul class="dotlist">${p.audience.map((a) => `<li>${esc(a)}</li>`).join("")}</ul>
          </div>${guides.length ? `
          <div class="panel" data-reveal="0">
            <h2>Panduan terkait</h2>
            ${guides.map((a) => `<p><a class="acard__more" href="${r}artikel/${a.slug}/">${esc(a.title)} ${icon("arrow")}</a></p>`).join("")}
          </div>` : ""}
        </div>
        <aside>
          <div class="panel sticky-buy" data-reveal="1">
            <h2>Cara membeli</h2>
            <ol class="steps-mini">
              <li><div><b>Klik "Beli via WhatsApp"</b><span>Pesan berisi nama produk terisi otomatis.</span></div></li>
              <li><div><b>Bayar</b><span>QRIS, transfer bank, atau e-wallet.</span></div></li>
              <li><div><b>Terima file</b><span>Link unduhan dikirim ke WhatsApp Anda.</span></div></li>
            </ol>
            <div class="pd__price" style="margin:22px 0 16px"><div class="price"><small>Harga</small><strong>${rupiah(p.price)}</strong>${p.old ? `<del>${rupiah(p.old)}</del>` : ""}</div></div>
            <a class="btn btn--accent btn--block" href="${buy}" target="_blank" rel="noopener">${icon("cart")}Beli Sekarang</a>
            <p class="form__note">${icon("shield")}Garansi 7 hari. <a href="${r}kebijakan-refund/" style="text-decoration:underline">Lihat ketentuan</a></p>
          </div>
        </aside>
      </div>
    </section>

    <section class="section section--cream">
      <div class="container">
        <div class="section__head" data-reveal="0">
          <div><p class="eyebrow">Produk lainnya</p><h2>Mungkin Anda juga butuh</h2></div>
          <a class="btn btn--outline" href="${r}#produk">Lihat semua produk</a>
        </div>
        <div class="products products--3">
        ${related.map((q, i) => productCard(q, r, i)).join("\n        ")}
        </div>
      </div>
    </section>

    <section class="section section--tight">
      <div class="container">
        <div class="cta" data-reveal="0">
          <div class="cta__text">
            <h2>Butuh versi yang disesuaikan?</h2>
            <p>Kami bisa membuat template sesuai alur kerja usaha atau sekolah Anda. Penawaran gratis tanpa kewajiban.</p>
          </div>
          <a class="btn btn--light" href="${r}#custom">Request Custom ${icon("arrow")}</a>
        </div>
      </div>
    </section>`;

  return layout({
    path: pagePath,
    title: `${name} — ${rupiah(p.price)} | ${BRAND}`,
    description: `${p.desc} Harga ${rupiah(p.price)}. ${compatText(p)}`,
    ogImage: SITE + `assets/img/og/${p.slug}.png`,
    active: "produk",
    extra: `
  <div class="buybar" id="buybar" aria-hidden="true">
    <div class="buybar__info"><b>${esc(p.title)}</b><span>${rupiah(p.price)}</span></div>
    <a class="btn btn--accent" href="${buy}" target="_blank" rel="noopener">${icon("cart")}Beli</a>
  </div>`,
    jsonld: [
      {
        "@context": "https://schema.org",
        "@type": "Product",
        name,
        description: [p.desc].concat(p.long).join(" "),
        image: [SITE + `assets/img/og/${p.slug}.png`],
        sku: p.id,
        category: p.cat,
        brand: { "@type": "Brand", name: BRAND },
        offers: {
          "@type": "Offer",
          url: SITE + pagePath,
          priceCurrency: "IDR",
          price: String(p.price),
          availability: "https://schema.org/InStock",
          itemCondition: "https://schema.org/NewCondition",
          seller: { "@type": "Organization", name: BRAND }
        }
      },
      breadcrumb([["Beranda", SITE], ["Produk", SITE + "#produk"], [p.title, SITE + pagePath]])
    ],
    body
  });
}

/* ---------- Halaman artikel ---------- */
function articlePage(a) {
  const pagePath = `artikel/${a.slug}/`;
  const r = "../../";
  const product = products.find((p) => p.id === a.product);
  const others = articles.filter((x) => x.slug !== a.slug);
  const html = a.body.replace(/\{\{root\}\}/g, r);
  const cta = product ? `
          <div class="cta-box">
            <div><b>${esc(a.cta.title)}</b><p>${esc(a.cta.text)}</p></div>
            <a class="btn btn--accent" href="${r}produk/${product.slug}/">Lihat Template ${icon("arrow")}</a>
          </div>` : "";

  const body = `    <section class="subhero subhero--compact">
      <div class="container container--narrow">
        <ol class="crumbs"><li><a href="${r}">Beranda</a></li><li><a href="${r}artikel/">Artikel</a></li><li aria-current="page">${esc(a.tag)}</li></ol>
        <span class="chip">${esc(a.tag)}</span>
        <h1>${esc(a.title)}</h1>
        <div class="article-meta">
          <span>${icon("clock")}${readMinutes(a.body)} menit baca</span>
          <span>Diterbitkan ${fmtDate(a.date)}</span>
          <span>Oleh Tim ${BRAND}</span>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <article class="prose">
${html}
${cta}
        </article>
      </div>
    </section>

    <section class="section section--cream">
      <div class="container">
        <div class="section__head" data-reveal="0"><div><p class="eyebrow">Artikel lainnya</p><h2>Baca juga</h2></div></div>
        <div class="acards">
        ${others.map((x, i) => articleCard(x, r, i)).join("\n        ")}
        </div>
      </div>
    </section>`;

  return layout({
    path: pagePath,
    title: `${a.title} | ${BRAND}`,
    description: a.description,
    ogType: "article",
    ogImage: product ? SITE + `assets/img/og/${product.slug}.png` : undefined,
    active: "artikel",
    jsonld: [
      {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: a.title,
        description: a.description,
        image: [product ? SITE + `assets/img/og/${product.slug}.png` : SITE + "assets/img/og-image.png"],
        datePublished: a.date,
        dateModified: a.updated || a.date,
        inLanguage: "id-ID",
        mainEntityOfPage: SITE + pagePath,
        author: { "@type": "Organization", name: BRAND, url: SITE },
        publisher: { "@type": "Organization", name: BRAND, url: SITE }
      },
      breadcrumb([["Beranda", SITE], ["Artikel", SITE + "artikel/"], [a.title, SITE + pagePath]])
    ],
    body
  });
}

/* ---------- Daftar artikel ---------- */
function articleIndex() {
  const r = "../";
  const body = `    <section class="subhero subhero--compact">
      <div class="container">
        <ol class="crumbs"><li><a href="${r}">Beranda</a></li><li aria-current="page">Artikel</li></ol>
        <h1>Artikel & Tips Excel untuk Keuangan dan Usaha</h1>
        <p class="subhero__lead">Panduan praktis mengatur keuangan pribadi, rumah tangga, dan usaha kecil dengan Excel dan Google Sheets, lengkap dengan contoh rumus.</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="acards">
        ${articles.map((a, i) => articleCard(a, r, i, "h2")).join("\n        ")}
        </div>
      </div>
    </section>`;
  return layout({
    path: "artikel/",
    title: `Artikel & Tips Excel Keuangan dan UMKM | ${BRAND}`,
    description: "Kumpulan panduan Excel dan Google Sheets: catatan pengeluaran bulanan, laporan laba rugi UMKM, anggaran rumah tangga, dan lainnya.",
    active: "artikel",
    jsonld: [breadcrumb([["Beranda", SITE], ["Artikel", SITE + "artikel/"]])],
    body
  });
}

/* ---------- Halaman kebijakan ---------- */
function legalPage(l) {
  const r = "../";
  const body = `    <section class="subhero subhero--compact">
      <div class="container container--narrow">
        <ol class="crumbs"><li><a href="${r}">Beranda</a></li><li aria-current="page">${esc(l.title)}</li></ol>
        <h1>${esc(l.title)}</h1>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <article class="prose">
${l.body.replace(/\{\{root\}\}/g, r)}
        </article>
      </div>
    </section>`;
  return layout({
    path: l.slug + "/",
    title: `${l.title} | ${BRAND}`,
    description: l.description,
    jsonld: [breadcrumb([["Beranda", SITE], [l.title, SITE + l.slug + "/"]])],
    body
  });
}

/* ---------- Tulis semua file ---------- */
const written = [];
function write(rel, html) {
  const file = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
  written.push(rel);
}

for (const p of products) write(`produk/${p.slug}/index.html`, productPage(p));
write("artikel/index.html", articleIndex());
for (const a of articles) write(`artikel/${a.slug}/index.html`, articlePage(a));
for (const l of legal) write(`${l.slug}/index.html`, legalPage(l));

/* ---------- sitemap.xml ---------- */
const urls = [
  [SITE, "1.0"],
  ...products.map((p) => [SITE + `produk/${p.slug}/`, "0.8"]),
  [SITE + "artikel/", "0.7"],
  ...articles.map((a) => [SITE + `artikel/${a.slug}/`, "0.7"]),
  ...legal.map((l) => [SITE + `${l.slug}/`, "0.3"])
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(([u, pr]) => `  <url><loc>${u}</loc><lastmod>${BUILD_DATE}</lastmod><priority>${pr}</priority></url>`).join("\n")}
</urlset>
`;
fs.writeFileSync(path.join(ROOT, "sitemap.xml"), sitemap);
fs.writeFileSync(path.join(ROOT, "tools", "urls.txt"), urls.map((u) => u[0]).join("\n") + "\n");

console.log(`Selesai: ${written.length} halaman + sitemap.xml (${urls.length} URL)`);
written.forEach((w) => console.log("  " + w));
