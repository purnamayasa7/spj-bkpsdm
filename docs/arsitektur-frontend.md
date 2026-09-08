# Arsitektur Frontend: React, Inertia.js & Tailwind CSS
**Aplikasi:** E-SPJ BKPSDM Kabupaten Buleleng

Dokumen ini menjelaskan struktur, alur kerja, perbedaan dengan Blade konvensional, serta mekanisme navigasi tanpa reload (*Single Page Application*) yang diterapkan pada sistem ini.

---

## 1. Teknologi & Framework yang Digunakan

Frontend aplikasi ini dibangun menggunakan ekosistem modern yang sering disebut sebagai **"The Modern Monolith"** (Laravel + Inertia.js + React):

| Teknologi | Versi | Peran / Fungsi |
|---|---|---|
| **React** | `^18.3` | Library UI utama berbasis komponen (*component-driven*) untuk reaktivitas antarmuka. |
| **Inertia.js** | `^2.0` | Jembatan (adapter) yang menghubungkan Controller Laravel langsung ke komponen React tanpa perlu membuat REST API terpisah. |
| **Tailwind CSS** | `^4.0` | Framework CSS utilitas modern untuk tata letak (*layout*), warna, tipografi, dan responsivitas. |
| **Vite** | `^7.0` | Build tool & bundler modern generasi terbaru dengan *Hot Module Replacement* (HMR) super cepat. |
| **Lucide React** | `^0.475` | Koleksi ikon SVG modern dan ringan. |
| **Chart.js & React-Chartjs-2** | `^4.5` / `^5.3` | Library untuk visualisasi data diagram tren dan rekap SPJ (grafik garis & batang). |
| **SweetAlert2** | `^11.26` | Dialog popup modal konfirmasi dan notifikasi interaktif. |

---

## 2. Struktur Folder dan Sistem Kerjanya

Semua kode antarmuka frontend berada di dalam direktori `resources/js/` dan `resources/css/`:

```text
c:/laragon/www/spj/
├── resources/
│   ├── css/
│   │   └── app.css                 # File konfigurasi dan utilitas kustom Tailwind CSS v4
│   ├── js/
│   │   ├── app.jsx                 # Entrypoint utama aplikasi React & inisialisasi Inertia.js
│   │   ├── bootstrap.js            # Inisialisasi Axios / CSRF header
│   │   ├── layouts/                # Master Layout (pembungkus halaman)
│   │   │   ├── AuthenticatedLayout.jsx  # Layout utama (Sidebar, Topbar, Notifikasi, Dropdown Profil)
│   │   │   └── GuestLayout.jsx          # Layout untuk halaman tamu (Login, Register)
│   │   ├── pages/                  # Halaman aplikasi (dipanggil langsung oleh Controller Laravel)
│   │   │   ├── Dashboard/          # Index.jsx (Metrik statistik, grafik, antrean review)
│   │   │   ├── Spj/                # Index.jsx, Create.jsx, Edit.jsx, Show.jsx, KeuanganIndex.jsx
│   │   │   ├── Generator/          # Index.jsx (Generator Dokumen Kuitansi, Lampiran, SPD)
│   │   │   ├── Calendar/           # Index.jsx (Kalender Kegiatan SPJ per Bidang)
│   │   │   ├── Pegawai/            # Index.jsx, Create.jsx, Edit.jsx (Manajemen data pegawai)
│   │   │   ├── User/               # Index.jsx (Manajemen akun pengguna & hak akses)
│   │   │   ├── History/            # Index.jsx, Show.jsx (Audit trail / log riwayat SPJ)
│   │   │   ├── Activity/           # Index.jsx (Log seluruh aktivitas sistem)
│   │   │   ├── Profile/            # Index.jsx (Pengaturan profil pengguna)
│   │   │   └── Panduan/            # Checklist.jsx (Kelengkapan berkas & panduan SPJ)
│   │   ├── components/             # Komponen modular yang dapat dipakai berulang
│   │   │   ├── TablePagination.jsx # Komponen navigasi pagination tabel
│   │   │   └── ExportModal.jsx     # Modal popup pilihan ekspor dokumen
│   │   └── lib/                    # Fungsi pembantu (utility functions)
│   │       └── utils.js            # Fungsi 'cn' (Tailwind merge) & 'getInitials' (avatar inisial)
│   └── views/
│       ├── app.blade.php           # Template HTML tunggal pembungkus Inertia (Root View)
│       └── pages/spj/export/       # Khusus template Blade untuk cetak dokumen PDF (DomPDF)
```

### Bagaimana Sistem Bekerja:
1. **Routing & Controller**: Pengguna membuka URL (misal `/dashboard`). Laravel memproses route di `routes/web.php` dan masuk ke `DashboardController.php`.
2. **Inertia Response**: Alih-alih merender Blade (`view('dashboard')`), Controller mengembalikan:
   ```php
   return Inertia::render('Dashboard/Index', [
       'totalDikirim' => $totalDikirim,
       'rekapBidang'  => $rekapBidang,
       // ... data lainnya
   ]);
   ```
3. **Penerimaan di React**: File `resources/js/pages/Dashboard/Index.jsx` menerima data tersebut sebagai **Props** komponen:
   ```jsx
   export default function Dashboard({ totalDikirim, rekapBidang }) {
       return (
           <AuthenticatedLayout>
               {/* Komponen & Tampilan Dashboard */}
           </AuthenticatedLayout>
       );
   }
   ```

---

## 3. Perbedaan Arsitektur: Blade Laravel vs. React + Inertia

| Aspek | Blade Laravel Tradisional | React + Inertia.js (Sistem Ini) |
|---|---|---|
| **Pola Rendering** | *Server-Side Rendering (SSR)* murni. Server merakit seluruh teks HTML lalu mengirimkannya ke browser. | *Client-Side Rendering (CSR)* rasa Monolith. Server hanya mengirim data mentah (JSON props), browser merender antarmukanya. |
| **Perpindahan Halaman** | **Full Page Reload** (layar berkedip putih, seluruh script, stylesheet, dan DOM di-*download* ulang setiap klik menu). | **Tanpa Reload (SPA)**. Hanya data JSON dari halaman tujuan yang dimuat, lalu React mengganti komponen secara instan. |
| **State Aplikasi** | State Javascript di browser langsung hilang setiap kali pindah halaman. | State terjaga mulus di memori browser (Sidebar tidak mereset posisi, form interaktif tetap hidup). |
| **Interaktivitas Form** | Memerlukan manipulasi manual jQuery/Vanilla JS atau submit form yang me-refresh halaman. | *Reactive Form State* (`useState`). Menambah/menghapus baris dinamis (seperti tabel pada Generator Dokumen) terjadi seketika tanpa request ke server. |
| **Peran Blade Sekarang** | Mengatur seluruh halaman aplikasi. | **Hanya digunakan untuk 2 hal:**<br>1. `resources/views/app.blade.php`: sebagai satu-satunya *HTML shell* awal.<br>2. `resources/views/pages/spj/export/*.blade.php`: khusus untuk keperluan generate file PDF cetak (DomPDF). |

---

## 4. Mengapa Pindah Halaman Tidak Perlu Reload? (Mekanisme Kerja Inertia.js)

Fenomena halaman yang berpindah mulus tanpa reload terjadi berkat mekanisme **Single Page Application (SPA)** yang dijalankan oleh **Inertia.js**:

```mermaid
sequenceDiagram
    autonumber
    actor User as Pengguna
    participant Link as <Link href="/spj"> (React)
    participant Inertia as Inertia.js Client Engine
    participant Server as Laravel Controller
    participant React as React DOM

    User->>Link: Klik menu "Daftar SPJ"
    Link->>Inertia: Cegah default browser reload (e.preventDefault)
    Inertia->>Server: Kirim request XHR/Fetch (Header: X-Inertia: true)
    Note over Server: Controller mengenali header X-Inertia
    Server-->>Inertia: Return JSON Props: { component: 'Spj/Index', props: {...} }
    Inertia->>React: Muat file 'Spj/Index.jsx' + Suntikkan Props baru
    React-->>User: Tampilan berganti secara instan (Zero Reload!)
    Note over Inertia: Update URL di browser via window.history.pushState
```

### Tahapan Detail Prosesnya:
1. **Intersepsi Klik Link**:
   Ketika Anda mengklik link menu navigasi yang menggunakan `<Link href="/spj">`, Inertia mencegat peristiwa klik bawaan browser (*intercept click event*) sehingga browser tidak melakukan request HTTP standar yang memicu reload.
2. **Request XHR / AJAX Khusus**:
   Inertia secara otomatis mengirimkan request AJAX (XHR) ke server dengan menyertakan HTTP header khusus:
   `X-Inertia: true`.
3. **Respon JSON dari Laravel**:
   Laravel membaca header `X-Inertia` tersebut. Laravel tidak mengirimkan kembali dokumen HTML utuh beserta CSS dan JS-nya, melainkan hanya mengirim payload JSON ramping berisi nama komponen tujuan dan datanya:
   ```json
   {
       "component": "Spj/Index",
       "props": {
           "spjs": [ ... ],
           "auth": { ... }
       },
       "url": "/spj"
   }
   ```
4. **Pergantian Komponen oleh React**:
   Inertia di browser menerima JSON tersebut, memanggil file komponen halaman `Spj/Index.jsx` yang sudah disiapkan Vite, lalu React memperbarui (*re-render*) elemen yang ada di layar.
5. **Sinkronisasi Alamat URL**:
   Inertia memperbarui alamat URL pada bilah alamat browser menggunakan fitur bawaan browser **HTML5 History API** (`window.history.pushState`). Tombol *Back* dan *Forward* di browser tetap bekerja normal layaknya website biasa.
6. **Progress Bar**:
   Garis biru tipis di bagian atas layar diatur oleh konfigurasi Inertia di `app.jsx`:
   ```javascript
   progress: {
       color: '#2563eb',
       showSpinner: true,
   }
   ```
   Garis ini memberikan umpan balik visual instan kepada pengguna saat data sedang diambil dari server.

---

## 5. Ringkasan Keuntungan Bagi Pengguna & Pengembang

1. **Performa Terasa Seperti Aplikasi Desktop/Mobile**:
   Perpindahan menu dan filtering data terasa instan (*snappy*) tanpa ada jeda layar putih (*blank screen/flicker*).
2. **Efisiensi Bandwidth & Server**:
   Hanya data JSON berukuran beberapa kilobyte yang dikirimkan saat berpindah halaman, bukan seluruh template HTML berulang-ulang.
3. **Kemudahan Pengembangan (Developer Experience)**:
   Tetap menikmati kemudahan ekosistem Laravel (Eloquent ORM, Middleware autentikasi, Validasi Form, Routing) dipadukan dengan kenyamanan komponen reaktif modern dari React dan kemudahan penataan gaya visual dari Tailwind CSS v4.
