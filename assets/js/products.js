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
      features: ["12 sheet bulanan + rekap tahunan", "Grafik pengeluaran per kategori", "Target tabungan & sisa anggaran", "Video panduan pemakaian"] },

    { id: "rumahtangga", slug: "template-excel-keuangan-rumah-tangga", title: "Keuangan Rumah Tangga & Tabungan", cat: "Keuangan Pribadi", tags: ["keuangan"], format: "Excel & Sheets",
      price: 49000, rating: 4.9, reviews: 128, mock: "dash", bg: "#e8eef8", ac: "#2f5fa8",
      desc: "Anggaran keluarga dengan amplop digital, dana darurat, dan target menabung untuk tujuan tertentu.",
      long: ["Mengatur keuangan keluarga lebih mudah dengan metode amplop: setiap pos anggaran seperti belanja dapur, listrik, sekolah anak, dan cicilan punya batasnya sendiri, dan template menunjukkan sisa tiap pos secara otomatis.",
             "Dilengkapi pelacak dana darurat dan target tabungan bertahap, misalnya untuk biaya sekolah, mudik, atau membeli kendaraan."],
      audience: ["Ibu rumah tangga yang mengelola uang belanja", "Keluarga yang ingin mulai punya dana darurat", "Siapa pun yang ingin menerapkan metode 50/30/20"],
      features: ["Metode amplop (budgeting)", "Pelacak dana darurat", "Target tabungan bertahap", "Dashboard ringkasan"] },

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
  function mockHTML(p) {
    var style = 'style="--bg-c:' + p.bg + ';--ac:' + p.ac + '"';
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

  root.VENUS = { products: products, mockHTML: mockHTML };
})(typeof window !== "undefined" ? window : this);
