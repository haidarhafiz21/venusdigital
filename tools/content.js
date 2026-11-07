/* =========================================================
   Konten artikel & halaman kebijakan untuk tools/build.js
   {{root}} otomatis diganti dengan path relatif ke beranda.
   ========================================================= */
"use strict";

const articles = [
  {
    slug: "cara-membuat-catatan-pengeluaran-bulanan-di-excel",
    title: "Cara Membuat Catatan Pengeluaran Bulanan di Excel (Lengkap dengan Rumus)",
    description: "Panduan langkah demi langkah membuat catatan pengeluaran bulanan di Excel atau Google Sheets: kolom, dropdown kategori, rumus SUM & SUMIF, grafik, dan tips agar konsisten.",
    tag: "Keuangan Pribadi",
    date: "2026-11-07",
    product: "pengeluaran",
    cta: { title: "Mau langsung pakai tanpa menyusun dari nol?", text: "Template Pengeluaran Bulanan sudah berisi 12 sheet bulanan, rekap tahunan, dropdown kategori, dan grafik otomatis." },
    body: `
<p>Banyak orang merasa gajinya "cepat habis" tapi tidak tahu habisnya ke mana. Cara paling sederhana untuk menjawabnya adalah mencatat pengeluaran. Excel atau Google Sheets sudah cukup, dan Anda tidak perlu jago rumus.</p>
<p>Di panduan ini kita membuat catatan pengeluaran bulanan dari nol: menyiapkan kolom, membuat pilihan kategori, menghitung total otomatis, sampai menampilkan grafik.</p>

<h2>1. Siapkan kolom-kolom utama</h2>
<p>Buka file Excel baru, lalu isi baris pertama dengan judul kolom berikut:</p>
<div class="table-wrap"><table>
<thead><tr><th>Kolom</th><th>Judul</th><th>Contoh isi</th></tr></thead>
<tbody>
<tr><td>A</td><td>Tanggal</td><td>01/11/2026</td></tr>
<tr><td>B</td><td>Keterangan</td><td>Belanja sayur</td></tr>
<tr><td>C</td><td>Kategori</td><td>Makan</td></tr>
<tr><td>D</td><td>Pemasukan</td><td>(kosongkan jika tidak ada)</td></tr>
<tr><td>E</td><td>Pengeluaran</td><td>45000</td></tr>
</tbody></table></div>
<p>Pisahkan pemasukan dan pengeluaran di dua kolom berbeda. Dengan begitu, rumus totalnya jauh lebih sederhana.</p>

<h2>2. Buat daftar kategori dengan dropdown</h2>
<p>Kategori yang konsisten membuat rekap lebih akurat. Bagi Excel, "Makan" dan "makanan" adalah dua kategori berbeda, jadi lebih aman memakai dropdown.</p>
<ol>
<li>Buat sheet baru bernama <strong>Kategori</strong>, lalu tulis daftar kategori di kolom A, misalnya: Makan, Transportasi, Listrik &amp; Air, Pulsa &amp; Internet, Belanja, Cicilan, Lainnya.</li>
<li>Kembali ke sheet catatan, lalu blok kolom C (Kategori).</li>
<li>Buka menu <strong>Data → Validasi Data</strong>, pilih <strong>Daftar</strong> (List), lalu isi sumbernya dengan rentang daftar kategori, misalnya <code>=Kategori!$A$1:$A$7</code>.</li>
</ol>
<p>Sekarang setiap sel di kolom Kategori punya tombol panah untuk memilih kategori.</p>

<h2>3. Hitung total pemasukan, pengeluaran, dan sisa uang</h2>
<p>Di area kosong (misalnya kolom H), buat ringkasan berikut. Anggap data Anda ada di baris 2 sampai 200:</p>
<pre><code>Total pemasukan   =SUM(D2:D200)
Total pengeluaran =SUM(E2:E200)
Sisa uang         =SUM(D2:D200)-SUM(E2:E200)</code></pre>
<div class="callout"><strong>Pemisah rumus:</strong> jika pengaturan regional komputer Anda memakai format Indonesia, Excel biasanya memakai titik koma (<code>;</code>) sebagai pemisah argumen, bukan koma. Contoh: <code>=SUMIF(C2:C200;"Makan";E2:E200)</code>. Jika muncul pesan error rumus, coba ganti pemisahnya.</div>

<h2>4. Rekap pengeluaran per kategori dengan SUMIF</h2>
<p>Inilah bagian yang paling berguna: mengetahui berapa yang habis untuk tiap kategori. Buat tabel kecil berisi nama kategori di kolom H (mulai H2), lalu di kolom I tulis rumus:</p>
<pre><code>=SUMIF($C$2:$C$200;H2;$E$2:$E$200)</code></pre>
<p>Rumus ini menjumlahkan semua pengeluaran di kolom E yang kategorinya sama dengan isi sel H2. Salin rumus ke bawah untuk kategori lainnya. Tanda <code>$</code> membuat rentang data tidak bergeser saat rumus disalin. Hasilnya kira-kira seperti ini:</p>
<div class="table-wrap"><table>
<thead><tr><th>Kategori</th><th class="num">Total bulan ini</th></tr></thead>
<tbody>
<tr><td>Makan</td><td class="num">Rp1.250.000</td></tr>
<tr><td>Transportasi</td><td class="num">Rp400.000</td></tr>
<tr><td>Listrik &amp; Air</td><td class="num">Rp350.000</td></tr>
<tr><td>Pulsa &amp; Internet</td><td class="num">Rp150.000</td></tr>
<tr><td>Cicilan</td><td class="num">Rp850.000</td></tr>
<tr><td>Lainnya</td><td class="num">Rp300.000</td></tr>
<tr class="total"><td>Total</td><td class="num">Rp3.300.000</td></tr>
</tbody></table></div>

<h2>5. Tampilkan grafik agar mudah dibaca</h2>
<p>Blok tabel rekap kategori tadi, lalu pilih <strong>Sisipkan → Diagram → Pai</strong> (atau Donat). Grafik langsung menunjukkan kategori mana yang porsinya paling besar, dan ikut berubah otomatis saat data bertambah.</p>

<h2>6. Beri tanda jika melebihi anggaran</h2>
<p>Tambahkan kolom <strong>Anggaran</strong> di kolom J, di samping rekap kategori, lalu gunakan Pemformatan Bersyarat (Conditional Formatting) agar total yang melebihi anggaran berwarna merah:</p>
<ol>
<li>Blok sel total per kategori, misalnya <code>I2:I8</code>.</li>
<li>Pilih <strong>Beranda → Pemformatan Bersyarat → Aturan Baru → Gunakan rumus</strong>.</li>
<li>Isi rumus <code>=I2&gt;J2</code> (total lebih besar dari anggaran), lalu pilih warna merah.</li>
</ol>

<h2>Tips agar catatan tidak berhenti di tengah jalan</h2>
<ul>
<li><strong>Catat setiap hari</strong>, misalnya setiap malam sebelum tidur. Lima menit sudah cukup.</li>
<li><strong>Pakai Google Sheets jika ingin mencatat dari HP.</strong> File Excel bisa diunggah ke Google Drive lalu dibuka sebagai Google Sheets.</li>
<li><strong>Jangan terlalu banyak kategori.</strong> Enam sampai sepuluh kategori sudah cukup untuk melihat pola.</li>
<li><strong>Evaluasi di akhir bulan:</strong> kategori mana yang bisa dikurangi bulan depan? Untuk pembagian anggaran yang lebih terarah, coba <a href="{{root}}artikel/anggaran-rumah-tangga-bulanan-metode-50-30-20/">metode 50/30/20</a>.</li>
</ul>`
  },

  {
    slug: "cara-membuat-laporan-laba-rugi-umkm-di-excel",
    title: "Cara Membuat Laporan Laba Rugi Sederhana untuk UMKM di Excel",
    description: "Pelajari komponen laporan laba rugi, contoh perhitungan untuk usaha kecil, dan cara menyusunnya otomatis di Excel dengan rumus SUMIFS.",
    tag: "Bisnis & UMKM",
    date: "2026-11-07",
    product: "labarugi",
    cta: { title: "Laporan laba rugi otomatis, tanpa menyusun rumus sendiri", text: "Template Laporan Keuangan UMKM: jurnal harian, laba rugi, arus kas, dan neraca sederhana yang siap cetak." },
    body: `
<p>Omzet besar belum tentu untung besar. Laporan laba rugi membantu pemilik usaha melihat berapa keuntungan yang sebenarnya tersisa setelah semua biaya dibayar. Untuk usaha kecil, laporan ini bisa dibuat sendiri di Excel.</p>

<h2>Apa itu laporan laba rugi?</h2>
<p>Laporan laba rugi adalah ringkasan pendapatan dan biaya usaha dalam satu periode, misalnya satu bulan. Hasil akhirnya menunjukkan apakah usaha <strong>untung (laba)</strong> atau <strong>rugi</strong> pada periode tersebut.</p>

<h2>Komponen laporan laba rugi sederhana</h2>
<ul>
<li><strong>Pendapatan:</strong> total hasil penjualan barang atau jasa.</li>
<li><strong>Harga Pokok Penjualan (HPP):</strong> biaya langsung untuk barang yang terjual, misalnya bahan baku atau harga beli barang dagangan.</li>
<li><strong>Laba kotor:</strong> Pendapatan dikurangi HPP.</li>
<li><strong>Beban operasional:</strong> biaya menjalankan usaha, seperti sewa, gaji, listrik, air, internet, dan transportasi.</li>
<li><strong>Laba bersih:</strong> Laba kotor dikurangi beban operasional (sebelum pajak).</li>
</ul>

<h2>Contoh laporan laba rugi warung kopi</h2>
<p>Berikut contoh laporan untuk satu bulan:</p>
<div class="table-wrap"><table>
<thead><tr><th>Keterangan</th><th class="num">Jumlah</th></tr></thead>
<tbody>
<tr><td>Pendapatan penjualan</td><td class="num">Rp15.000.000</td></tr>
<tr><td>HPP (kopi, susu, gula, gelas)</td><td class="num">(Rp6.000.000)</td></tr>
<tr class="total"><td>Laba kotor</td><td class="num">Rp9.000.000</td></tr>
<tr><td>Sewa tempat</td><td class="num">(Rp1.500.000)</td></tr>
<tr><td>Gaji karyawan</td><td class="num">(Rp3.000.000)</td></tr>
<tr><td>Listrik &amp; air</td><td class="num">(Rp500.000)</td></tr>
<tr><td>Lain-lain</td><td class="num">(Rp300.000)</td></tr>
<tr><td>Total beban operasional</td><td class="num">(Rp5.300.000)</td></tr>
<tr class="total"><td>Laba bersih sebelum pajak</td><td class="num">Rp3.700.000</td></tr>
</tbody></table></div>
<p>Dari contoh ini, margin laba bersihnya adalah Rp3.700.000 ÷ Rp15.000.000 ≈ <strong>24,7%</strong>. Artinya, dari setiap Rp100.000 penjualan, sekitar Rp24.700 menjadi keuntungan.</p>

<h2>Langkah membuatnya di Excel</h2>
<h3>1. Buat sheet jurnal harian</h3>
<p>Buat sheet bernama <strong>Jurnal</strong> dengan kolom: A Tanggal, B Keterangan, C Akun, D Masuk, E Keluar. Isi kolom Akun dengan pilihan tetap memakai dropdown (menu <strong>Data → Validasi Data</strong>), misalnya: Penjualan, HPP, Sewa, Gaji, Listrik &amp; Air, Lain-lain.</p>

<h3>2. Buat sheet laporan</h3>
<p>Di sheet <strong>Laporan</strong>, tulis tanggal awal bulan di sel B1 (misalnya 01/11/2026) dan tanggal awal bulan berikutnya di sel B2 (01/12/2026). Lalu hitung pendapatan bulan itu dengan SUMIFS:</p>
<pre><code>=SUMIFS(Jurnal!D:D;Jurnal!C:C;"Penjualan";Jurnal!A:A;"&gt;="&amp;B1;Jurnal!A:A;"&lt;"&amp;B2)</code></pre>
<p>Untuk biaya, ganti kolom yang dijumlahkan menjadi <code>Jurnal!E:E</code> dan ganti nama akunnya, misalnya "HPP" atau "Sewa". Setelah semua angka terisi:</p>
<pre><code>Laba kotor  = Pendapatan - HPP
Laba bersih = Laba kotor - Total beban operasional
Margin      = Laba bersih / Pendapatan</code></pre>
<p>Cukup ganti tanggal di B1 dan B2, maka laporan bulan lain terhitung otomatis dari jurnal yang sama.</p>
<div class="callout">Gunakan pemisah <code>;</code> atau <code>,</code> sesuai pengaturan Excel Anda. Jika muncul pesan error rumus, coba ganti titik koma dengan koma.</div>

<h2>Tips agar laporan akurat</h2>
<ul>
<li><strong>Pisahkan uang pribadi dan uang usaha.</strong> Idealnya pakai rekening atau dompet terpisah.</li>
<li><strong>Catat HPP dengan benar.</strong> Banyak usaha merasa untung padahal biaya bahan belum dihitung.</li>
<li><strong>Jangan lupa biaya kecil</strong> seperti plastik, gas, atau ongkos kirim. Jumlahnya bisa besar dalam sebulan.</li>
<li><strong>Soal pajak:</strong> wajib pajak UMKM dengan omzet tertentu dapat dikenai PPh final dengan tarif 0,5% dari omzet. Aturannya bisa berubah, jadi cek informasi terbaru di situs resmi DJP (pajak.go.id) atau tanyakan ke konsultan pajak.</li>
</ul>`
  },

  {
    slug: "anggaran-rumah-tangga-bulanan-metode-50-30-20",
    title: "Contoh Anggaran Rumah Tangga Bulanan dengan Metode 50/30/20",
    description: "Cara membagi gaji bulanan dengan metode 50/30/20, contoh rincian untuk penghasilan Rp4 juta, penyesuaian untuk penghasilan pas-pasan, dan cara menghitungnya di Excel.",
    tag: "Keuangan Pribadi",
    date: "2026-11-07",
    product: "rumahtangga",
    cta: { title: "Template anggaran keluarga siap pakai", text: "Keuangan Rumah Tangga & Tabungan: metode amplop, pelacak dana darurat, dan target tabungan bertahap." },
    body: `
<p>Metode 50/30/20 adalah salah satu cara paling mudah untuk mulai mengatur keuangan rumah tangga. Anda tidak perlu mencatat ratusan pos; cukup bagi penghasilan bersih ke dalam tiga kelompok besar.</p>

<h2>Apa itu metode 50/30/20?</h2>
<ul>
<li><strong>50% untuk kebutuhan:</strong> hal yang wajib dibayar, seperti belanja dapur, listrik, air, transportasi kerja, dan biaya sekolah.</li>
<li><strong>30% untuk keinginan:</strong> hal yang menyenangkan tapi bisa dikurangi, seperti makan di luar, hiburan, langganan streaming, atau belanja pakaian.</li>
<li><strong>20% untuk tabungan dan masa depan:</strong> dana darurat, tabungan tujuan, investasi, atau pelunasan utang lebih cepat.</li>
</ul>
<p>Persentase dihitung dari <strong>penghasilan bersih</strong>, yaitu uang yang benar-benar diterima setelah potongan.</p>

<h2>Contoh untuk penghasilan Rp4.000.000 per bulan</h2>
<div class="table-wrap"><table>
<thead><tr><th>Kelompok</th><th class="num">Porsi</th><th class="num">Jumlah</th></tr></thead>
<tbody>
<tr><td>Kebutuhan</td><td class="num">50%</td><td class="num">Rp2.000.000</td></tr>
<tr><td>Keinginan</td><td class="num">30%</td><td class="num">Rp1.200.000</td></tr>
<tr><td>Tabungan</td><td class="num">20%</td><td class="num">Rp800.000</td></tr>
<tr class="total"><td>Total</td><td class="num">100%</td><td class="num">Rp4.000.000</td></tr>
</tbody></table></div>

<h3>Rincian kebutuhan (Rp2.000.000)</h3>
<div class="table-wrap"><table>
<tbody>
<tr><td>Belanja dapur</td><td class="num">Rp1.100.000</td></tr>
<tr><td>Listrik &amp; air</td><td class="num">Rp300.000</td></tr>
<tr><td>Transportasi</td><td class="num">Rp300.000</td></tr>
<tr><td>Pulsa &amp; internet</td><td class="num">Rp150.000</td></tr>
<tr><td>Kebutuhan sekolah anak</td><td class="num">Rp150.000</td></tr>
</tbody></table></div>

<h3>Rincian keinginan (Rp1.200.000)</h3>
<div class="table-wrap"><table>
<tbody>
<tr><td>Makan di luar</td><td class="num">Rp400.000</td></tr>
<tr><td>Hiburan &amp; langganan</td><td class="num">Rp200.000</td></tr>
<tr><td>Pakaian</td><td class="num">Rp300.000</td></tr>
<tr><td>Lain-lain</td><td class="num">Rp300.000</td></tr>
</tbody></table></div>

<h3>Rincian tabungan (Rp800.000)</h3>
<div class="table-wrap"><table>
<tbody>
<tr><td>Dana darurat</td><td class="num">Rp400.000</td></tr>
<tr><td>Tabungan tujuan (mudik, sekolah)</td><td class="num">Rp250.000</td></tr>
<tr><td>Investasi</td><td class="num">Rp150.000</td></tr>
</tbody></table></div>

<h2>Bagaimana jika penghasilan pas-pasan?</h2>
<p>Angka 50/30/20 adalah patokan, bukan aturan mati. Jika kebutuhan pokok sudah memakan lebih dari separuh penghasilan, sesuaikan porsinya, misalnya <strong>60/20/20</strong> atau <strong>70/20/10</strong>. Kurangi bagian keinginan lebih dulu, dan usahakan tetap ada bagian yang disisihkan untuk tabungan, sekecil apa pun.</p>

<h2>Prioritaskan dana darurat</h2>
<p>Dana darurat adalah tabungan untuk kejadian tak terduga, seperti sakit, kendaraan rusak, atau kehilangan penghasilan. Patokan yang umum dipakai adalah <strong>3–6 kali pengeluaran bulanan</strong>. Kumpulkan sedikit demi sedikit dari pos tabungan sampai targetnya tercapai.</p>

<h2>Cara menghitungnya di Excel</h2>
<p>Tulis penghasilan bersih di sel B1, lalu buat tiga baris:</p>
<pre><code>Kebutuhan (50%) =B1*50%
Keinginan (30%) =B1*30%
Tabungan  (20%) =B1*20%</code></pre>
<p>Di sebelahnya, buat kolom <strong>Terpakai</strong> yang menjumlahkan pengeluaran nyata per kelompok (bisa memakai <code>SUMIF</code> seperti di <a href="{{root}}artikel/cara-membuat-catatan-pengeluaran-bulanan-di-excel/">panduan catatan pengeluaran</a>), lalu kolom <strong>Sisa</strong> berisi anggaran dikurangi terpakai. Jika sisa bernilai minus, berarti pos tersebut sudah melewati batas.</p>`
  }
];

const UPDATED = "7 November 2026";
const WA_LINK = '<a href="https://wa.me/6285184885472" target="_blank" rel="noopener">0851-8488-5472</a>';

const legal = [
  {
    slug: "kebijakan-privasi",
    title: "Kebijakan Privasi",
    description: "Kebijakan privasi Venus Digital: data apa yang dikumpulkan, bagaimana data digunakan, dan hak Anda.",
    body: `
<p><em>Terakhir diperbarui: ${UPDATED}</em></p>
<p>Kebijakan ini menjelaskan data apa yang kami kumpulkan saat Anda menggunakan website Venus Digital dan bagaimana data tersebut digunakan.</p>
<h2>Data yang kami kumpulkan</h2>
<ul>
<li><strong>Data yang Anda kirim sendiri</strong>, seperti nama, nomor WhatsApp, dan isi pesan saat mengisi form request atau menghubungi kami lewat WhatsApp.</li>
<li><strong>Data pembelian</strong>, seperti produk yang dibeli dan bukti pembayaran yang Anda kirimkan.</li>
</ul>
<p>Website ini tidak memiliki sistem akun dan tidak menyimpan isian form di server. Form request hanya menyusun pesan WhatsApp yang kemudian Anda kirim sendiri.</p>
<h2>Penggunaan data</h2>
<ul>
<li>Memproses pesanan dan mengirim file produk.</li>
<li>Memberikan bantuan pemakaian dan menjawab pertanyaan.</li>
<li>Menyiapkan penawaran untuk request custom.</li>
</ul>
<p>Kami tidak menjual atau menyewakan data Anda kepada pihak lain.</p>
<h2>Layanan pihak ketiga</h2>
<p>Website ini memakai layanan pihak ketiga yang dapat menerima data teknis, seperti alamat IP, sesuai kebijakan privasi masing-masing:</p>
<ul>
<li><strong>GitHub Pages</strong> untuk hosting website.</li>
<li><strong>Google Fonts</strong> untuk menampilkan huruf.</li>
<li><strong>WhatsApp</strong> untuk komunikasi dan pemesanan.</li>
</ul>
<h2>Hak Anda</h2>
<p>Anda dapat meminta kami menghapus data percakapan dan pesanan Anda kapan saja dengan menghubungi kami lewat WhatsApp.</p>
<h2>Kontak</h2>
<p>Pertanyaan tentang kebijakan ini dapat dikirim lewat WhatsApp ke ${WA_LINK}.</p>`
  },
  {
    slug: "syarat-ketentuan",
    title: "Syarat & Ketentuan",
    description: "Syarat dan ketentuan pembelian serta penggunaan produk digital Venus Digital: pembayaran, pengiriman, lisensi, dan batasan tanggung jawab.",
    body: `
<p><em>Terakhir diperbarui: ${UPDATED}</em></p>
<p>Dengan membeli atau menggunakan produk Venus Digital, Anda menyetujui ketentuan berikut.</p>
<h2>1. Produk</h2>
<p>Venus Digital menjual produk digital berupa template Excel dan Google Sheets, template website, dan aplikasi. Produk dikirim dalam bentuk file atau link unduhan, bukan barang fisik.</p>
<h2>2. Harga dan pembayaran</h2>
<p>Harga yang tercantum di website dalam Rupiah. Pembayaran dilakukan melalui metode yang kami informasikan saat pemesanan via WhatsApp, seperti QRIS, transfer bank, atau e-wallet. Pesanan diproses setelah pembayaran dikonfirmasi.</p>
<h2>3. Pengiriman</h2>
<p>File atau link unduhan dikirim melalui WhatsApp dan/atau email setelah pembayaran dikonfirmasi, pada jam layanan 08.00–21.00 WIB.</p>
<h2>4. Lisensi penggunaan</h2>
<ul>
<li>Lisensi standar berlaku untuk pemakaian pribadi atau satu usaha.</li>
<li>Dilarang menjual kembali, membagikan, atau mengunggah ulang file produk tanpa izin tertulis dari kami.</li>
<li>Untuk aplikasi kasir, lisensi berlaku untuk satu toko sesuai keterangan produk.</li>
</ul>
<h2>5. Kompatibilitas</h2>
<p>Template Excel dirancang untuk Microsoft Excel 2010 ke atas dan Google Sheets. Beberapa fitur dapat tampil berbeda di aplikasi spreadsheet lain.</p>
<h2>6. Batasan tanggung jawab</h2>
<p>Template adalah alat bantu pencatatan. Keakuratan hasil bergantung pada data yang dimasukkan pengguna. Produk kami bukan pengganti nasihat profesional di bidang keuangan, akuntansi, atau perpajakan.</p>
<h2>7. Garansi dan refund</h2>
<p>Ketentuan garansi dan pengembalian dana dijelaskan di halaman <a href="{{root}}kebijakan-refund/">Kebijakan Refund</a>.</p>
<h2>8. Perubahan ketentuan</h2>
<p>Kami dapat memperbarui ketentuan ini sewaktu-waktu. Versi terbaru selalu tersedia di halaman ini.</p>
<h2>9. Kontak</h2>
<p>Hubungi kami lewat WhatsApp ke ${WA_LINK}.</p>`
  },
  {
    slug: "kebijakan-refund",
    title: "Kebijakan Refund & Garansi",
    description: "Garansi 7 hari Venus Digital: kapan Anda bisa mengajukan perbaikan atau pengembalian dana, dan bagaimana caranya.",
    body: `
<p><em>Terakhir diperbarui: ${UPDATED}</em></p>
<p>Kami ingin Anda puas dengan produk yang dibeli. Karena itu setiap produk dilengkapi garansi 7 hari.</p>
<h2>Garansi 7 hari</h2>
<p>Dalam 7 hari sejak file diterima, Anda dapat mengajukan klaim jika:</p>
<ul>
<li>File rusak atau tidak bisa dibuka di aplikasi yang sesuai keterangan produk.</li>
<li>Isi produk tidak sesuai dengan deskripsi di website.</li>
</ul>
<p>Kami akan memperbaiki atau mengganti file terlebih dahulu. Jika masalah tidak dapat diselesaikan, dana Anda dikembalikan penuh.</p>
<h2>Yang tidak termasuk garansi</h2>
<ul>
<li>Berubah pikiran setelah file diterima, karena produk digital tidak bisa dikembalikan seperti barang fisik.</li>
<li>Produk sudah sesuai deskripsi tetapi tidak sesuai selera pribadi.</li>
<li>Masalah akibat perubahan rumus atau struktur file yang dilakukan sendiri oleh pembeli. Untuk kasus ini kami tetap berusaha membantu, tetapi tidak berlaku pengembalian dana.</li>
<li>Request custom, yang mengikuti kesepakatan tertulis saat pemesanan.</li>
</ul>
<h2>Cara mengajukan klaim</h2>
<ol>
<li>Hubungi kami lewat WhatsApp ke ${WA_LINK}.</li>
<li>Sertakan nama produk, bukti pembayaran, dan screenshot masalah.</li>
<li>Kami menanggapi pada jam layanan (08.00–21.00 WIB) dan berusaha menyelesaikannya dalam 1–3 hari kerja.</li>
</ol>
<h2>Pengembalian dana</h2>
<p>Jika refund disetujui, dana dikembalikan ke rekening bank atau e-wallet yang Anda gunakan saat membayar.</p>`
  }
];

module.exports = { articles, legal };
