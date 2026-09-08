import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import {
    FileCheck2,
    CheckCircle2,
    AlertCircle,
    Info,
    FileText,
    Receipt,
    Calendar,
    ArrowRight,
    Sparkles,
    ShieldAlert,
    HelpCircle,
} from 'lucide-react';

export default function ChecklistPanduan() {
    const categories = [
        {
            title: '1. Dokumen Dasar & Transaksi',
            description: 'Dokumen utama bukti kesepakatan dan pertanggungjawaban belanja.',
            items: [
                {
                    name: 'Kuitansi Resmi Pembayaran',
                    rule: 'Wajib untuk semua SPJ. Ditandatangani oleh Bendahara Pengeluaran, PPTK, dan Penerima Pembayaran.',
                    badge: 'Wajib Semua SPJ',
                },
                {
                    name: 'Surat Pesanan / SPK (Surat Perintah Kerja)',
                    rule: 'Wajib untuk pengadaan barang/jasa dengan nilai tertentu sesuai ketentuan pengadaan.',
                    badge: 'Pengadaan Barang/Jasa',
                },
                {
                    name: 'Nota Dinas / Surat Pengantar / Permohonan',
                    rule: 'Surat pengantar resmi dari pimpinan bidang pengaju.',
                    badge: 'Kelengkapan Administrasi',
                },
                {
                    name: 'Nota Pembelian / Bon Kontan',
                    rule: 'Bukti fisik pembelian dari toko/rekanan berstempel basah.',
                    badge: 'Belanja Barang',
                },
            ],
        },
        {
            title: '2. Pajak & Bukti Pembayaran Keuangan',
            description: 'Kelengkapan bukti pemotongan, penyetoran pajak, dan transaksi perbankan.',
            items: [
                {
                    name: 'Faktur Pajak Standar',
                    rule: 'Wajib jika belanja kena PPN/PPh dari Pengusaha Kena Pajak (PKP).',
                    badge: 'Transaksi Kena Pajak',
                },
                {
                    name: 'e-Billing & Bukti Setor Pajak (BPN)',
                    rule: 'Bukti valid penerimaan negara atas penyetoran pajak terkait.',
                    badge: 'Pajak Daerah/Pusat',
                },
                {
                    name: 'Bukti Transfer Bank / Rekening Koran / Slip',
                    rule: 'Bukti transfer non-tunai kepada pihak rekanan atau penerima honor.',
                    badge: 'Transaksi Non-Tunai',
                },
            ],
        },
        {
            title: '3. Berita Acara & Penerimaan',
            description: 'Legitimasi serah terima barang/jasa dan pemeriksaan fisik.',
            items: [
                {
                    name: 'BAST (Berita Acara Serah Terima)',
                    rule: 'Membuktikan bahwa barang/jasa telah diterima dalam keadaan baik dan lengkap.',
                    badge: 'Pengadaan Barang/Jasa',
                },
                {
                    name: 'Berita Acara Pemeriksaan Barang/Jasa (BAP)',
                    rule: 'Dibuat oleh Tim Pemeriksa Barang/Jasa.',
                    badge: 'Pemeriksaan Hasil',
                },
                {
                    name: 'Berita Acara Pembayaran (BAPay)',
                    rule: 'Menyatakan bahwa pekerjaan telah selesai dan berhak dibayarkan.',
                    badge: 'Pencairan Dana',
                },
            ],
        },
        {
            title: '4. Kegiatan, Rapat, & Sosialisasi',
            description: 'Bukti riil keterlaksanaan kegiatan yang didanai.',
            items: [
                {
                    name: 'Daftar Hadir Peserta / Undangan',
                    rule: 'Daftar hadir bertandatangan asli atau barcode resmi.',
                    badge: 'Rapat/Sosialisasi',
                },
                {
                    name: 'Notulen Rapat / Resume Hasil Kegiatan',
                    rule: 'Catatan jalannya rapat/kegiatan bertanda tangan notulis dan pimpinan.',
                    badge: 'Dokumentasi Substantif',
                },
                {
                    name: 'Foto Dokumentasi Kegiatan Berwarna',
                    rule: 'Foto pelaksanaan acara dengan timestamp/tanggal yang jelas.',
                    badge: 'Bukti Fisik',
                },
                {
                    name: 'Laporan Pelaksanaan Kegiatan',
                    rule: 'Laporan ringkas pelaksanaan dan output yang dicapai.',
                    badge: 'Laporan Akhir',
                },
            ],
        },
        {
            title: '5. Perjalanan Dinas (SPD)',
            description: 'Kelengkapan khusus perjalanan dinas dalam/luar daerah.',
            items: [
                {
                    name: 'Surat Tugas (SPT)',
                    rule: 'Diterbitkan dan ditandatangani oleh Kepala BKPSDM.',
                    badge: 'Perjalanan Dinas',
                },
                {
                    name: 'Surat Perjalanan Dinas (SPD) Asli',
                    rule: 'Lembar SPD yang telah dicap dan ditandatangani oleh instansi tempat tujuan.',
                    badge: 'Perjalanan Dinas',
                },
                {
                    name: 'Tiket Perjalanan & Boarding Pass',
                    rule: 'Bukti tiket transportasi resmi (pesawat, kapal, travel) atas nama pejabat bersangkutan.',
                    badge: 'Transportasi',
                },
                {
                    name: 'Bill / Kuitansi Hotel / Penginapan',
                    rule: 'Bukti pembayaran penginapan resmi dari hotel tempat menginap.',
                    badge: 'Akomodasi',
                },
                {
                    name: 'Laporan Hasil Perjalanan Dinas (LHPD)',
                    rule: 'Laporan tertulis hasil pelaksanaan tugas perjalanan dinas.',
                    badge: 'Laporan Akhir',
                },
            ],
        },
    ];

    return (
        <AuthenticatedLayout title="Panduan & Checklist SPJ">
            <Head title="Panduan & Checklist SPJ" />

            <div className="max-w-5xl mx-auto space-y-6">
                {/* Banner */}
                <div className="bg-linear-to-r from-[#2a4574] via-[#375a98] to-[#476eb8] rounded-2xl p-6 text-white shadow-sm">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/15 text-white backdrop-blur-xs mb-2">
                                <FileCheck2 className="w-3.5 h-3.5" />
                                <span>Standar Operasional Prosedur (SOP)</span>
                            </span>
                            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                                Panduan & 21 Checklist Berkas SPJ
                            </h1>
                            <p className="text-xs sm:text-sm text-blue-100 mt-1 max-w-2xl">
                                Pedoman kelengkapan administrasi SPJ BKPSDM Kabupaten Buleleng agar proses review dan verifikasi keuangan berjalan cepat dan lancar tanpa koreksi.
                            </p>
                        </div>
                        <Link
                            href="/spj/create"
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-white text-[#2a4574] hover:bg-blue-50 transition-all shadow-sm shrink-0"
                        >
                            <span>Buat SPJ Sekarang</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>
                </div>

                {/* Tips Box */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/60 rounded-2xl p-4 space-y-2">
                        <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>Scan PDF yang Jelas</span>
                        </div>
                        <p className="text-xs text-emerald-700 dark:text-emerald-400 leading-relaxed">
                            Pastikan berkas PDF yang diunggah terbaca jelas, tidak terpotong, orientasi tegak, dan stempel/tanda tangan terlihat tajam.
                        </p>
                    </div>

                    <div className="bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60 rounded-2xl p-4 space-y-2">
                        <div className="flex items-center gap-2 text-[#2a4574] dark:text-blue-400 font-bold text-xs">
                            <Info className="w-4 h-4 text-[#2a4574] dark:text-blue-400" />
                            <span>Kesesuaian Kode Rekening</span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                            Pastikan kode rekening 12 digit, nama kegiatan, dan uraian belanja sama persis antara kuitansi dengan DPA bidang.
                        </p>
                    </div>

                    <div className="bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 rounded-2xl p-4 space-y-2">
                        <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-xs">
                            <AlertCircle className="w-4 h-4 text-amber-600" />
                            <span>Segera Cek Notifikasi Koreksi</span>
                        </div>
                        <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                            Jika Keuangan memberikan catatan koreksi, segera perbaiki dan klik Simpan & Kirim Ulang agar proses pencairan tidak tertunda.
                        </p>
                    </div>
                </div>

                {/* Checklist Categories */}
                <div className="space-y-6">
                    {categories.map((cat, idx) => (
                        <div
                            key={idx}
                            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden"
                        >
                            <div className="bg-slate-50 dark:bg-slate-800/80 px-5 py-3.5 border-b border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-[#2a4574] dark:text-blue-400" />
                                    <span>{cat.title}</span>
                                </h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400">{cat.description}</p>
                            </div>

                            <div className="p-5 divide-y divide-slate-100 dark:divide-slate-700/50 space-y-3">
                                {cat.items.map((item, itemIdx) => (
                                    <div
                                        key={itemIdx}
                                        className="pt-3 first:pt-0 flex flex-col sm:flex-row sm:items-start justify-between gap-3"
                                    >
                                        <div className="space-y-1">
                                            <p className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                                <span className="w-2 h-2 rounded-full bg-[#2a4574] dark:bg-blue-400" />
                                                <span>{item.name}</span>
                                            </p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 pl-4">
                                                {item.rule}
                                            </p>
                                        </div>
                                        <span className="self-start px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 shrink-0">
                                            {item.badge}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
