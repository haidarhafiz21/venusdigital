/* =========================================================
   Venus Digital — DATA PRODUK (satu sumber untuk seluruh website)
   Dipakai oleh halaman utama (main.js) dan generator halaman produk
   (tools/build.js). Setelah mengubah file ini, jalankan:
       node tools/build.js
   ---------------------------------------------------------
   mock : sheet | chart | dash | web | app | bundle (gaya gambar)
   tags : keuangan | bisnis | pendidikan | web | bundle
   rating & reviews: HANYA ditampilkan jika CONFIG.showRatings = true
   ========================================================= */
(function (root) {
  "use strict";

  var products = [
    { id: "pengeluaran", slug: "template-excel-pengeluaran-bulanan", title: "Template Pengeluaran Bulanan", cat: "Keuangan Pribadi", tags: ["keuangan"], format: "Excel & Sheets",
      price: 35000, old: 59000, rating: 4.9, reviews: 312, badge: "Rekomendasi", mock: "chart", bg: "#e6f1ea", ac: "#1d7a46",
      desc: "Catat pemasukan & pengeluaran harian, lihat sisa uang dan grafik per kategori secara otomatis.",
      long: ["Template ini dibuat untuk Anda yang ingin tahu ke mana saja uang gaji pergi setiap bulan. Cukup catat pemasukan dan pengeluaran harian; total per kategori, sisa uang, dan grafik akan terhitung sendiri tanpa perlu menulis rumus.",
             "Tersedia 12 sheet bulanan dari Januari sampai Desember serta satu sheet rekap tahunan, sehingga Anda bisa membandingkan pengeluaran antarbulan dan melihat pos mana yang paling boros."],
      audience: ["Karyawan yang ingin mengatur gaji bulanan", "Mahasiswa dan anak kos", "Pasangan muda yang baru mulai mengatur keuangan"],
      features: ["12 sheet bulanan + rekap tahunan", "Grafik pengeluaran per kategori", "Target tabungan & sisa anggaran", "Lembar panduan pemakaian"] },

    { id: "rumahtangga", slug: "template-excel-keuangan-rumah-tangga", title: "Keuangan Rumah Tangga & Tabungan", cat: "Keuangan Pribadi", tags: ["keuangan"], format: "Excel & Sheets",
      price: 49000, rating: 4.9, reviews: 128, mock: "dash", bg: "#e8eef8", ac: "#2f5fa8",
      desc: "Anggaran keluarga dengan amplop digital, dana darurat, dan target menabung untuk tujuan tertentu.",
      long: ["Mengatur keuangan keluarga lebih mudah dengan metode amplop: setiap pos anggaran seperti belanja dapur, listrik, sekolah anak, dan cicilan punya batasnya sendiri, dan template menunjukkan sisa tiap pos secara otomatis.",
             "Dilengkapi pelacak dana darurat dan target tabungan bertahap, misalnya untuk biaya sekolah, mudik, atau membeli kendaraan."],
      audience: ["Ibu rumah tangga yang mengelola uang belanja", "Keluarga yang ingin mulai punya dana darurat", "Siapa pun yang ingin menerapkan metode 50/30/20"],
      features: ["Metode amplop (budgeting)", "Pelacak dana darurat", "Target tabungan bertahap", "Dashboard ringkasan"],
      shots: [{ src: "assets/img/produk/keuangan-rumah-tangga-dashboard.webp", small: "assets/img/produk/keuangan-rumah-tangga-dashboard-900.webp",
                w: 1562, h: 768, alt: "Tampilan dashboard tahunan template Keuangan Rumah Tangga: tabel pendapatan, pengeluaran dan tabungan per bulan, grafik batang, dan grafik donat komposisi",
                caption: "Dashboard tahunan: pendapatan, pengeluaran & tabungan per bulan, lengkap dengan grafik." }] },

    { id: "labarugi", slug: "template-excel-laporan-laba-rugi-umkm", title: "Laporan Keuangan UMKM (Laba Rugi)", cat: "Bisnis & UMKM", tags: ["bisnis"], format: "Excel",
      price: 79000, old: 99000, rating: 4.8, reviews: 96, mock: "dash", bg: "#fbeee3", ac: "#c95d2a",
      desc: "Jurnal harian otomatis menjadi laporan laba rugi, arus kas, dan neraca sederhana setiap bulan.",
      long: ["Catat setiap uang masuk dan keluar usaha di jurnal harian, lalu laporan laba rugi, arus kas, dan neraca sederhana tersusun otomatis setiap bulan.",
             "Format laporannya rapi dan siap dicetak, sehingga membantu saat evaluasi usaha di akhir bulan maupun saat menyiapkan dokumen pengajuan pinjaman modal seperti KUR."],
      audience: ["Pemilik warung, toko kelontong, dan usaha kuliner", "UMKM yang belum punya laporan keuangan", "Pelaku usaha yang ingin mengajukan pinjaman modal"],
      features: ["Jurnal kas masuk & keluar", "Laba rugi bulanan otomatis", "Laporan arus kas", "Siap cetak untuk pengajuan KUR"] },

    { id: "stok", slug: "template-excel-stok-barang-penjualan", title: "Stok Barang & Penjualan", cat: "Bisnis & UMKM", tags: ["bisnis"], format: "Excel",
      price: 69000, rating: 4.8, reviews: 84, mock: "sheet", bg: "#e6f1ea", ac: "#1d7a46",
      desc: "Kelola barang masuk, keluar, dan sisa stok. Peringatan otomatis saat stok menipis.",
      long: ["Kelola data barang, barang masuk, dan barang keluar dalam satu file. Sisa stok setiap barang terhitung otomatis dan ditandai ketika mendekati batas minimum.",
             "Laporan penjualan per produk membantu Anda melihat barang mana yang paling laku dan mana yang perlu dikurangi pembeliannya."],
      audience: ["Toko kelontong dan toko bangunan", "Penjual online yang menyimpan stok sendiri", "Gudang kecil dan distributor lokal"],
      features: ["Master data barang", "Barang masuk & keluar", "Peringatan stok minimum", "Laporan penjualan per produk"] },

    { id: "gaji", slug: "template-excel-absensi-gaji-karyawan", title: "Absensi & Gaji Karyawan", cat: "Bisnis & UMKM", tags: ["bisnis"], format: "Excel",
      price: 59000, rating: 4.7, reviews: 61, mock: "sheet", bg: "#efe8f7", ac: "#6a48a6",
      desc: "Rekap kehadiran, lembur, potongan, dan slip gaji yang bisa dicetak per karyawan.",
      long: ["Rekap kehadiran karyawan setiap bulan, hitung lembur dan potongan, lalu cetak slip gaji untuk tiap karyawan tanpa menghitung manual.",
             "Rekap tahunan memudahkan Anda melihat total biaya gaji dan kehadiran setiap karyawan sepanjang tahun."],
      audience: ["Usaha dengan 2–50 karyawan", "Toko, bengkel, dan rumah makan", "Admin atau bagian keuangan usaha kecil"],
      features: ["Absensi bulanan", "Hitung lembur & potongan", "Slip gaji siap cetak", "Rekap tahunan"] },

    { id: "rapor", slug: "template-excel-rapor-kurikulum-merdeka", title: "Rapor & Nilai Kurikulum Merdeka", cat: "Pendidikan", tags: ["pendidikan"], format: "Excel",
      price: 45000, rating: 4.9, reviews: 143, badge: "Baru", mock: "sheet", bg: "#e8eef8", ac: "#2f5fa8",
      desc: "Input nilai sekali, rapor dan deskripsi capaian terisi otomatis. Untuk SD, SMP, dan MTs.",
      long: ["Guru cukup memasukkan nilai sekali; rapor, leger nilai, dan deskripsi capaian siswa terisi otomatis sesuai format Kurikulum Merdeka.",
             "Membantu menghemat waktu di akhir semester, terutama bagi wali kelas yang harus menyiapkan rapor untuk banyak siswa sekaligus."],
      audience: ["Wali kelas SD, SMP, dan MTs", "Operator sekolah", "Guru yang ingin rekap nilai lebih rapi"],
      features: ["Deskripsi capaian otomatis", "Rapor siap cetak", "Rekap nilai per kelas", "Leger nilai"] },

    { id: "absensi-sekolah", slug: "template-excel-absensi-siswa-jurnal-guru", title: "Absensi Siswa & Jurnal Guru", cat: "Pendidikan", tags: ["pendidikan"], format: "Excel & Sheets",
      price: 29000, rating: 4.8, reviews: 52, mock: "chart", bg: "#f3efe6", ac: "#8a6a2b",
      desc: "Absensi harian siswa dengan rekap persentase kehadiran dan jurnal mengajar guru.",
      long: ["Catat kehadiran siswa setiap hari dan dapatkan rekap bulanan beserta persentase kehadiran tiap siswa secara otomatis.",
             "Ada juga lembar jurnal mengajar untuk mencatat materi dan kegiatan kelas setiap pertemuan. Bisa diisi dari HP lewat Google Sheets."],
      audience: ["Guru kelas dan guru mata pelajaran", "Madrasah dan pesantren", "Bimbel dan TPQ"],
      features: ["Absensi harian & bulanan", "Persentase kehadiran otomatis", "Jurnal mengajar", "Bisa dipakai di HP"] },

    { id: "hutang", slug: "template-excel-hutang-piutang-cicilan", title: "Hutang Piutang & Cicilan", cat: "Keuangan Pribadi", tags: ["keuangan", "bisnis"], format: "Excel & Sheets",
      price: 29000, rating: 4.7, reviews: 77, mock: "sheet", bg: "#fbeee3", ac: "#c95d2a",
      desc: "Pantau siapa berhutang, jatuh tempo, dan sisa cicilan. Cocok untuk pribadi maupun toko.",
      long: ["Catat siapa yang berhutang kepada Anda dan kepada siapa Anda berhutang, lengkap dengan tanggal jatuh tempo dan riwayat pembayaran.",
             "Ringkasan per orang menunjukkan sisa hutang atau piutang secara otomatis, sehingga tidak ada lagi catatan yang tercecer."],
      audience: ["Pemilik warung yang melayani pembelian bon", "Siapa pun yang punya lebih dari satu cicilan", "Usaha yang memberi tempo pembayaran ke pelanggan"],
      features: ["Daftar hutang & piutang", "Pengingat jatuh tempo", "Riwayat pembayaran", "Ringkasan per orang"] },

    { id: "nikah", slug: "template-excel-anggaran-pernikahan", title: "Perencana Anggaran Pernikahan", cat: "Keuangan Pribadi", tags: ["keuangan"], format: "Excel & Sheets",
      price: 39000, rating: 5.0, reviews: 38, mock: "chart", bg: "#f6e8ea", ac: "#a34a5a",
      desc: "Rencanakan biaya pernikahan, daftar vendor, tamu undangan, dan tabungan menuju hari H.",
      long: ["Susun anggaran pernikahan per pos, mulai dari gedung, katering, dekorasi, busana, hingga seserahan, lalu pantau pembayaran ke setiap vendor.",
             "Dilengkapi daftar tamu undangan serta target tabungan dengan hitung mundur menuju hari H."],
      audience: ["Calon pengantin", "Keluarga yang menyiapkan walimah", "Wedding organizer skala kecil"],
      features: ["Rincian anggaran per pos", "Daftar vendor & pembayaran", "Daftar tamu", "Hitung mundur & target tabungan"] },

    { id: "web-toko", slug: "template-website-toko-online", title: "Template Website Toko Online", cat: "Website & Aplikasi", tags: ["web"], format: "Source code",
      price: 249000, old: 399000, rating: 4.8, reviews: 29, mock: "web", bg: "#e6f1ea", ac: "#0f3d33",
      desc: "Website katalog toko dengan keranjang dan checkout ke WhatsApp. Responsif dan mudah diedit.",
      long: ["Website katalog toko yang ringan dan responsif. Pengunjung bisa melihat produk, memasukkan ke keranjang, lalu mengirim pesanan langsung ke WhatsApp Anda.",
             "Dibuat dengan HTML, CSS, dan JavaScript murni sehingga bisa dipasang di hosting gratis seperti GitHub Pages tanpa biaya bulanan. Panduan pemasangan disertakan."],
      audience: ["UMKM yang ingin punya website sendiri", "Penjual yang ingin mengurangi ketergantungan pada marketplace", "Pemula yang ingin belajar membuat website toko"],
      features: ["HTML, CSS, JS (tanpa biaya bulanan)", "Checkout ke WhatsApp", "Panduan upload ke hosting", "Gratis 1x bantuan instalasi"] },

    { id: "app-kasir", slug: "aplikasi-kasir-toko", title: "Aplikasi Kasir (Lisensi)", cat: "Website & Aplikasi", tags: ["web", "bisnis"], format: "Android & Web",
      price: 499000, rating: 4.9, reviews: 34, mock: "app", bg: "#fbeee3", ac: "#c95d2a",
      desc: "Aplikasi kasir untuk toko dan warung: transaksi, stok, laporan, dan cetak struk Bluetooth.",
      long: ["Aplikasi kasir untuk mencatat transaksi, mengelola stok, dan melihat laporan penjualan harian maupun bulanan. Mendukung cetak struk lewat printer Bluetooth.",
             "Lisensi berlaku untuk satu toko tanpa biaya langganan, dan tetap bisa dipakai saat internet mati."],
      audience: ["Warung dan toko kelontong", "Kedai kopi dan rumah makan", "Toko yang ingin beralih dari nota manual"],
      features: ["Lisensi 1 toko seumur hidup", "Cetak struk Bluetooth", "Laporan harian & bulanan", "Bisa offline"] },

    { id: "bundle20", slug: "bundle-20-template-excel-bisnis", title: "Bundle 20 Template Excel Bisnis", cat: "Paket Bundle", tags: ["bundle", "bisnis"], format: "Excel",
      price: 149000, old: 499000, rating: 4.9, reviews: 118, badge: "Hemat 70%", mock: "bundle", bg: "#e6f1ea", ac: "#0f3d33",
      desc: "Paket lengkap 20 template untuk menjalankan usaha: keuangan, stok, kasir, gaji, invoice, dan lainnya.",
      long: ["Paket berisi 20 template Excel untuk menjalankan usaha sehari-hari: laporan keuangan, stok barang, kasir sederhana, gaji karyawan, invoice, kuitansi, hutang-piutang, dan lainnya.",
             "Jauh lebih hemat dibanding membeli satuan, dan setiap pembaruan template diberikan gratis."],
      audience: ["UMKM yang butuh banyak template sekaligus", "Admin usaha dan bagian keuangan", "Pelaku usaha yang baru merapikan administrasi"],
      features: ["20 template Excel siap pakai", "Laporan keuangan, stok, kasir, gaji", "Invoice & kuitansi otomatis", "Update gratis selamanya"] }
  ];

  /* Gambar produk dari CSS (tidak ada file gambar yang bisa rusak) */
  function rep(str, n) { var out = ""; for (var i = 0; i < n; i++) out += str; return out; }
  // Potongan asli dari file Excel produk ("bocoran" isi template) untuk kartu & gambar produk
  var PEEK = {
    pengeluaran: ["pengeluaran", "Pengeluaran Bulanan.xlsx"], rumahtangga: ["rumahtangga", "Keuangan Rumah Tangga.xlsx"],
    labarugi: ["labarugi", "Laporan Laba Rugi UMKM.xlsx"], stok: ["stok", "Stok Barang & Penjualan.xlsx"],
    gaji: ["gaji", "Absensi & Gaji Karyawan.xlsx"], rapor: ["rapor", "Rapor Kurikulum Merdeka.xlsx"],
    "absensi-sekolah": ["absensi-sekolah", "Absensi Siswa.xlsx"], hutang: ["hutang", "Hutang Piutang & Cicilan.xlsx"],
    nikah: ["nikah", "Anggaran Pernikahan.xlsx"]
  };

  function mockHTML(p, root) {
    var style = 'style="--bg-c:' + p.bg + ';--ac:' + p.ac + '"';
    var pk = PEEK[p.id];
    if (pk) {
      return '<div class="mock mock--peek" ' + style + '><div class="peek"><div class="peek__bar"><i></i><i></i><i></i><span>' + pk[1] +
        '</span></div><img src="' + (root || "") + "assets/img/peek/" + pk[0] + '.webp" alt="" loading="lazy" decoding="async"></div></div>';
    }
    var bar = '<div class="mbar"><i></i><i></i><i></i></div>';
    var inner = "";
    switch (p.mock) {
      case "sheet":
        inner = '<div class="mwin">' + bar + '<div class="mbody">' + rep('<i class="b h"></i>', 3) +
          rep('<i class="b"></i><i class="b a2"></i><i class="b"></i>', 6) + "</div></div>";
        break;
      case "chart":
        inner = '<div class="mwin">' + bar + '<div class="mbody"><div class="rows"><i class="b a"></i>' + rep('<i class="b"></i>', 6) +
          '</div><div class="bars"><i style="height:45%"></i><i style="height:70%"></i><i style="height:35%"></i><i style="height:85%"></i><i style="height:55%"></i></div></div></div>';
        break;
      case "dash":
        inner = '<div class="mwin">' + bar + '<div class="mbody"><i class="k"></i><i class="k"></i><i class="k"></i><i class="big"></i></div></div>';
        break;
      case "web":
        inner = '<div class="mwin">' + bar + '<div class="mbody"><i class="b h"></i><i class="b"></i><i class="b o"></i><i class="b"></i></div></div>';
        break;
      case "app":
        var ph = '<div class="ph"><div><i class="b a"></i><i class="b"></i><i class="b"></i><i class="b"></i><i class="b o"></i></div></div>';
        inner = ph + ph;
        break;
      case "bundle":
        inner = '<div class="stack"><i></i><i></i><i>20</i></div>';
        break;
    }
    return '<div class="mock mock--' + p.mock + '" ' + style + ">" + inner + "</div>";
  }

  // Tangkapan layar asli dari file produk (halaman "Tampilan asli"). Isi angka adalah data contoh.
  function shot(name, w, h, caption, alt) {
    return { src: "assets/img/produk/" + name + ".webp", small: "assets/img/produk/" + name + "-900.webp", w: w, h: h, caption: caption, alt: alt };
  }
  var SHOTS = {
    pengeluaran: [shot("pengeluaran-1", 1600, 1021, "Lembar bulan: catatan harian di kiri, ringkasan & pemakaian anggaran per kategori di kanan.", "Lembar Januari berisi catatan pemasukan dan pengeluaran harian, ringkasan sisa uang, dan grafik anggaran per kategori"),
                  shot("pengeluaran-2", 1600, 895, "Rekap tahunan: semua bulan dibandingkan, lengkap dengan grafik.", "Rekap tahunan pemasukan, pengeluaran per kategori, grafik batang dan grafik donat")],
    rumahtangga: [shot("rumahtangga-2", 1600, 499, "Amplop anggaran: sisa setiap pos dan statusnya untuk bulan yang dipilih.", "Tabel amplop anggaran berisi batas, terpakai, sisa, dan status tiap pos, beserta grafik")],
    labarugi: [shot("labarugi-1", 1600, 526, "Laporan laba rugi bulanan & sejak Januari, plus tren per bulan.", "Laporan laba rugi dengan pendapatan, HPP, beban, laba bersih, dan grafik per bulan"),
               shot("labarugi-2", 1600, 689, "Arus kas: kas masuk, kas keluar, dan saldo akhir tiap bulan.", "Tabel arus kas per bulan dan grafik kas masuk, kas keluar, serta saldo")],
    stok: [shot("stok-1", 1558, 502, "Master barang: sisa stok dan status Aman / Menipis / Habis otomatis.", "Daftar barang dengan stok masuk, keluar, sisa, status, dan nilai stok"),
           shot("stok-2", 1280, 952, "Laporan penjualan: omzet & laba per bulan serta barang terlaris.", "Laporan omzet dan laba kotor per bulan, lima barang terlaris, dan grafik")],
    gaji: [shot("gaji-1", 1315, 320, "Penggajian: hadir, alpa, lembur, potongan, sampai gaji bersih.", "Tabel penggajian karyawan berisi kehadiran, lembur, potongan, dan gaji bersih"),
           shot("gaji-2", 883, 701, "Slip gaji siap cetak, cukup pilih ID karyawan.", "Slip gaji karyawan berisi rincian pendapatan, potongan, dan gaji bersih")],
    rapor: [shot("rapor-1", 1018, 1353, "Rapor siap cetak dengan deskripsi capaian kompetensi otomatis.", "Rapor siswa berisi nilai akhir dan deskripsi capaian kompetensi setiap mata pelajaran"),
            shot("rapor-2", 1270, 479, "Leger nilai: nilai akhir semua mapel, rata-rata, dan peringkat.", "Leger nilai kelas berisi nilai tiap mapel, jumlah, rata-rata, dan peringkat")],
    "absensi-sekolah": [shot("absensi-sekolah-1", 1475, 447, "Absensi harian dengan persentase kehadiran otomatis.", "Absensi siswa bulan Juli dengan kode hadir, sakit, izin, alpa, dan persentase kehadiran"),
                        shot("absensi-sekolah-2", 1576, 289, "Jurnal mengajar untuk setiap pertemuan.", "Jurnal mengajar berisi tanggal, hari, mapel, materi, dan kegiatan pembelajaran")],
    hutang: [shot("hutang-1", 1531, 405, "Daftar hutang & piutang dengan status jatuh tempo otomatis.", "Daftar hutang dan piutang berisi jumlah, terbayar, sisa, status, dan sisa hari"),
             shot("hutang-2", 1600, 279, "Cicilan bulanan: sisa tenor dan jatuh tempo berikutnya.", "Tabel cicilan berisi cicilan per bulan, tenor, sisa, dan tanggal jatuh tempo berikutnya")],
    nikah: [shot("nikah-1", 901, 434, "Ringkasan: hitung mundur, kebutuhan dana, dan target tabungan per bulan.", "Ringkasan anggaran pernikahan berisi hitung mundur, dana, dan data tamu"),
            shot("nikah-2", 1600, 893, "Anggaran per pos dibandingkan kontrak & pembayaran vendor.", "Tabel anggaran per pos pernikahan beserta grafik anggaran dan porsi biaya")]
  };
  products.forEach(function (p) {
    if (SHOTS[p.id]) p.shots = (p.shots || []).concat(SHOTS[p.id]);
  });

  root.VENUS = { products: products, mockHTML: mockHTML };
})(typeof window !== "undefined" ? window : this);
