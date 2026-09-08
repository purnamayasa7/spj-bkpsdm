import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import {
    ArrowLeft,
    FileText,
    Upload,
    Printer,
    Save,
    AlertCircle,
    Check,
    X,
    Building2,
    User,
    Calendar,
    DollarSign,
    Trash2,
    Plus,
    Search,
    Lock,
    Coins,
    CalendarDays,
    FileCheck2,
} from 'lucide-react';

export default function Create({ previewId = '', bidangUser = '', auth }) {
    const pptkMap = {
        PKA: 'Ni Komang Sutrisni, S.Pd',
        PPI: 'Putu Ayu Willy Indah Sari, SE.,M.A.P',
        MP: 'Luh Putu Teni Wulandari, SE, MAP',
        PKAP: 'I Gusti Kade Ria Prisahatna, SH',
        Sekretariat: 'Made Herry Hermawan, S.STP., M.A.P',
    };

    const initialPptk = pptkMap[bidangUser] || '';

    const [form, setForm] = useState({
        bidang: bidangUser,
        jenis: '',
        pptk: initialPptk,
        kegiatan: '',
        belanja: '',
        nilai: '',
        sumber_dana: '',
        tanggal_spj: new Date().toISOString().split('T')[0],
        tanggal_terima_spj: new Date().toISOString().split('T')[0],
        kelengkapan_spk: '',
        keterangan: '',
        status: 'Dikirim',
    });

    const [files, setFiles] = useState({});
    const [fileErrors, setFileErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    // Master document list
    const masterDokumens = [
        'Kuitansi',
        'Daftar Penerimaan',
        'Bukti Pembelian',
        'BAST dan Lampiran',
        'BAP dan Lampiran',
        'Nota Permintaan Barang/Jasa',
        'Surat Permintaan Barang/Jasa',
        'Berita Acara Penyerahan Barang/Jasa',
        'Riwayat Negoisasi',
        'Surat Pesanan',
        'Invoice Beserta Lampiran',
        'Nota Dinas',
        'Dokumen Persiapan Pengadaan (DPP)',
        'Surat Perintah Pengiriman (SPP)/(SPMK)',
        'Surat Tugas',
        'SPD Lampiran',
        'Rincian Biaya',
        'Daftar Hadir',
        'Laporan + Dokumentasi',
        'Dokumentasi Pajak',
        'Lain-lain',
    ];

    // Modals
    const [kuitansiModalOpen, setKuitansiModalOpen] = useState(false);
    const [penerimaanModalOpen, setPenerimaanModalOpen] = useState(false);
    const [spdModalOpen, setSpdModalOpen] = useState(false);

    // Kuitansi Modal State
    const [kuitansiData, setKuitansiData] = useState({
        nomor_rekening: '',
        kode_rekening: '',
        untuk_pembayaran: '',
        penerima: '',
    });

    // Daftar Penerimaan State
    const [penerimaanData, setPenerimaanData] = useState({
        dalam_rangka: '',
        tanggal_mulai: '',
        tanggal_selesai: '',
        yang_menerima: '',
        nip_penerima: '',
        pegawai: [],
    });

    // Lampiran SPD State
    const [spdData, setSpdData] = useState({
        nomor_lampiran: '',
        tanggal_lampiran: new Date().toISOString().split('T')[0],
        daftar_peserta: '',
        tgl_penyelenggaraan: '',
        kota: '',
        satuan_kerja: '',
        no_surat_tugas: '',
        tgl_surat_tugas: '',
        tanggal_mulai: '',
        tanggal_selesai: '',
        lama_perjalanan: '',
        pegawai: [],
    });

    const [searchQuery, setSearchQuery] = useState('');

    const formatCurrency = (val) => {
        if (!val) return 'Rp 0';
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(val);
    };

    const handleRemoveFile = (docName) => {
        setFiles((prev) => {
            const next = { ...prev };
            delete next[docName];
            return next;
        });
        setFileErrors((prev) => {
            const next = { ...prev };
            delete next[docName];
            return next;
        });
    };

    const filteredDokumens = masterDokumens.filter((dok) =>
        dok.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const selectedFilesCount = Object.keys(files).filter((k) => files[k]).length;

    const handleFileChange = (docName, file) => {
        if (!file) {
            const nextFiles = { ...files };
            delete nextFiles[docName];
            setFiles(nextFiles);

            const nextErrors = { ...fileErrors };
            delete nextErrors[docName];
            setFileErrors(nextErrors);
            return;
        }

        const MAX_SIZE = 2 * 1024 * 1024; // 2MB
        if (file.size > MAX_SIZE) {
            setFileErrors((prev) => ({
                ...prev,
                [docName]: 'Ukuran berkas PDF melebihi 2 MB.',
            }));
        } else {
            setFileErrors((prev) => {
                const updated = { ...prev };
                delete updated[docName];
                return updated;
            });
            setFiles((prev) => ({ ...prev, [docName]: file }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Check if there are file size errors
        if (Object.keys(fileErrors).length > 0) {
            alert('Harap perbaiki berkas yang melebihi batas 2 MB sebelum menyimpan.');
            return;
        }

        setIsSubmitting(true);

        const formData = new FormData();
        Object.entries(form).forEach(([key, val]) => {
            if (val !== null && val !== undefined) {
                formData.append(key, val);
            }
        });

        // Append files
        Object.entries(files).forEach(([docName, file]) => {
            if (file) {
                formData.append(`dokumen[${docName}]`, file);
            }
        });

        router.post('/spj', formData, {
            onError: (errs) => {
                setErrors(errs);
                setIsSubmitting(false);
            },
            onFinish: () => setIsSubmitting(false),
        });
    };

    return (
        <AuthenticatedLayout title="Buat SPJ Baru">
            <Head title="Buat SPJ Baru" />

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/spj"
                            className="inline-flex items-center justify-center w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-100 transition-colors shadow-2xs"
                            title="Kembali ke Data SPJ"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2.5">
                                <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                                    Buat SPJ Baru
                                </h1>
                                <span className="text-xs font-bold font-mono px-2.5 py-0.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-[#2a4574] dark:text-blue-400 border border-blue-200 dark:border-blue-800/60">
                                    {previewId}
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                Masukkan rincian belanja dan unggah dokumen kelengkapan pertanggungjawaban
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <Link
                            href="/spj"
                            className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-colors shadow-2xs"
                        >
                            Batal
                        </Link>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-linear-to-r from-[#2a4574] via-[#3b5a97] to-[#4c6fc1] text-white hover:opacity-95 transition-opacity shadow-xs disabled:opacity-50"
                        >
                            <Save className="w-3.5 h-3.5" />
                            <span>{isSubmitting ? 'Menyimpan...' : 'Simpan SPJ'}</span>
                        </button>
                    </div>
                </div>

                {/* Form Errors Banner */}
                {Object.keys(errors).length > 0 && (
                    <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs space-y-1">
                        <div className="font-bold flex items-center gap-1.5">
                            <AlertCircle className="w-4 h-4" />
                            <span>Terdapat kesalahan pengisian formulir:</span>
                        </div>
                        <ul className="list-disc list-inside space-y-0.5 pl-5">
                            {Object.entries(errors).map(([key, msg]) => (
                                <li key={key}>{msg}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Primary Information Card */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
                        <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-800/60 flex items-center justify-center text-[#2a4574] dark:text-blue-400 shrink-0">
                                <FileText className="w-4 h-4" />
                            </div>
                            <div>
                                <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">Rincian Formulir SPJ</h2>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400">Lengkapi data pokok, pembebanan anggaran, dan jadwal pengajuan</p>
                            </div>
                        </div>
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-[#2a4574] dark:text-blue-400 border border-blue-200 dark:border-blue-800/60">
                            Status: Dikirim
                        </span>
                    </div>

                    <div className="p-5 space-y-6">
                        {/* Sub-section 1: Identitas Pengajuan */}
                        <div>
                            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                <Building2 className="w-3.5 h-3.5 text-[#2a4574] dark:text-blue-400" />
                                <span>1. Identitas Pengajuan</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {/* ID SPJ */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                                        <span>ID SPJ</span>
                                        <span className="text-[10px] font-normal text-slate-400 dark:text-slate-500">Otomatis</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={previewId}
                                            readOnly
                                            className="w-full pl-3 pr-8 py-2 bg-slate-100 dark:bg-slate-700/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-bold text-slate-700 dark:text-slate-300 cursor-not-allowed"
                                        />
                                        <Lock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2" />
                                    </div>
                                </div>

                                {/* Bidang */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                                        <span>Bidang</span>
                                        <span className="text-[10px] font-normal text-slate-400 dark:text-slate-500">Otomatis</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={form.bidang}
                                            readOnly
                                            className="w-full pl-3 pr-8 py-2 bg-slate-100 dark:bg-slate-700/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-not-allowed"
                                        />
                                        <Lock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2" />
                                    </div>
                                </div>

                                {/* PPTK */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                                        <span>PPTK</span>
                                        <span className="text-[10px] font-normal text-slate-400 dark:text-slate-500">Otomatis</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={form.pptk}
                                            readOnly
                                            className="w-full pl-3 pr-8 py-2 bg-slate-100 dark:bg-slate-700/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-300 cursor-not-allowed"
                                        />
                                        <Lock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2" />
                                    </div>
                                </div>

                                {/* Jenis SPJ */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Jenis SPJ <span className="text-rose-500">*</span>
                                    </label>
                                    <select
                                        required
                                        value={form.jenis}
                                        onChange={(e) => setForm({ ...form, jenis: e.target.value })}
                                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#2a4574]/20 focus:border-[#2a4574] transition-all"
                                    >
                                        <option value="">-- Pilih Jenis SPJ --</option>
                                        <option value="GU">GU</option>
                                        <option value="LS">LS</option>
                                        <option value="UP">UP</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Sub-section 2: Rincian Anggaran & Belanja */}
                        <div>
                            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                <Coins className="w-3.5 h-3.5 text-[#2a4574] dark:text-blue-400" />
                                <span>2. Rincian Anggaran & Rekening Belanja</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {/* Nilai SPJ dengan prefix terintegrasi */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Nilai Belanja <span className="text-rose-500">*</span>
                                    </label>
                                    <div className="relative flex rounded-xl shadow-2xs">
                                        <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 font-bold text-xs select-none">
                                            Rp
                                        </span>
                                        <input
                                            type="number"
                                            required
                                            min="0"
                                            value={form.nilai}
                                            onChange={(e) => setForm({ ...form, nilai: e.target.value })}
                                            placeholder="0"
                                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 dark:border-slate-700 rounded-r-xl text-xs font-bold text-slate-800 dark:text-slate-100 focus:bg-white dark:bg-slate-900 dark:focus:bg-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#2a4574]/20 focus:border-[#2a4574] transition-all"
                                        />
                                    </div>
                                    {form.nilai ? (
                                        <p className="text-[11px] font-semibold text-emerald-700 mt-1 flex items-center gap-1">
                                            <span>Terbilang:</span>
                                            <span className="underline decoration-emerald-300">{formatCurrency(form.nilai)}</span>
                                        </p>
                                    ) : (
                                        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">Masukkan nominal angka tanpa titik/koma</p>
                                    )}
                                </div>

                                {/* Sumber Dana */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Sumber Dana <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={form.sumber_dana}
                                        onChange={(e) => setForm({ ...form, sumber_dana: e.target.value })}
                                        placeholder="Contoh: DAU, PAD, APBD"
                                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#2a4574]/20 focus:border-[#2a4574] transition-all"
                                    />
                                </div>

                                {/* Rekening Belanja */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Rekening Belanja <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={form.belanja}
                                        onChange={(e) => setForm({ ...form, belanja: e.target.value })}
                                        placeholder="Contoh: Belanja Alat Tulis Kantor"
                                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#2a4574]/20 focus:border-[#2a4574] transition-all"
                                    />
                                </div>

                                {/* Kegiatan */}
                                <div className="md:col-span-2 lg:col-span-3">
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Nama Kegiatan / Sub Kegiatan <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={form.kegiatan}
                                        onChange={(e) => setForm({ ...form, kegiatan: e.target.value })}
                                        placeholder="Masukkan nama lengkap kegiatan belanja yang dibebankan..."
                                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#2a4574]/20 focus:border-[#2a4574] transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Sub-section 3: Jadwal & Catatan */}
                        <div>
                            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                <CalendarDays className="w-3.5 h-3.5 text-[#2a4574] dark:text-blue-400" />
                                <span>3. Jadwal & Dokumen Kontrak</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Tanggal SPJ */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Tanggal SPJ <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={form.tanggal_spj}
                                        onChange={(e) => setForm({ ...form, tanggal_spj: e.target.value })}
                                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#2a4574]/20 focus:border-[#2a4574] transition-all"
                                    />
                                </div>

                                {/* Tanggal Terima SPJ */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Tanggal Terima SPJ <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        value={form.tanggal_terima_spj}
                                        onChange={(e) =>
                                            setForm({ ...form, tanggal_terima_spj: e.target.value })
                                        }
                                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#2a4574]/20 focus:border-[#2a4574] transition-all"
                                    />
                                </div>

                                {/* Kelengkapan SPK */}
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Kelengkapan SPK / Surat Pesanan (Opsional)
                                    </label>
                                    <textarea
                                        rows={2}
                                        value={form.kelengkapan_spk}
                                        onChange={(e) =>
                                            setForm({ ...form, kelengkapan_spk: e.target.value })
                                        }
                                        placeholder="Daftar nomor SPK / rincian kontrak jika ada..."
                                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#2a4574]/20 focus:border-[#2a4574] transition-all"
                                    />
                                </div>

                                {/* Keterangan */}
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Keterangan Tambahan (Opsional)
                                    </label>
                                    <textarea
                                        rows={2}
                                        value={form.keterangan}
                                        onChange={(e) => setForm({ ...form, keterangan: e.target.value })}
                                        placeholder="Keterangan atau catatan umum untuk pengajuan ini..."
                                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#2a4574]/20 focus:border-[#2a4574] transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Upload Dokumen Kelengkapan Card */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800/50">
                        <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-800/60 flex items-center justify-center text-[#2a4574] dark:text-blue-400 shrink-0">
                                <Upload className="w-4 h-4" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                                        Berkas Kelengkapan Dokumen
                                    </h2>
                                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-[#2a4574] border border-blue-200">
                                        {selectedFilesCount} dari {masterDokumens.length} dipilih
                                    </span>
                                </div>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                    Format berkas yang didukung: <b>PDF</b> (Maksimal 2 MB per berkas)
                                </p>
                            </div>
                        </div>

                        {/* Search Filter Mini Box */}
                        <div className="relative w-full md:w-64">
                            <Search className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Cari nama dokumen..."
                                className="w-full pl-8 pr-7 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#2a4574]/20 focus:border-[#2a4574] transition-all shadow-2xs"
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-300 p-0.5"
                                >
                                    <X className="w-3 h-3" />
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                            <thead className="bg-slate-50/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase tracking-wider text-[11px] font-bold border-b border-slate-200 dark:border-slate-700">
                                <tr>
                                    <th className="px-4 py-3.5 w-12 text-center">No</th>
                                    <th className="px-4 py-3.5">Nama Dokumen</th>
                                    <th className="px-4 py-3.5 w-96">Upload Berkas PDF</th>
                                    <th className="px-4 py-3.5 w-36 text-center">Aksi Bantuan</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                                {filteredDokumens.length > 0 ? (
                                    filteredDokumens.map((dok) => {
                                        const originalIdx = masterDokumens.indexOf(dok);
                                        const hasError = !!fileErrors[dok];
                                        const isSelected = !!files[dok];

                                        return (
                                            <tr
                                                key={dok}
                                                className={`transition-colors ${isSelected
                                                    ? 'bg-emerald-50/30 hover:bg-emerald-50/50'
                                                    : 'hover:bg-slate-50 dark:bg-slate-800/60'
                                                    }`}
                                            >
                                                <td className="px-4 py-3 text-center text-slate-400 dark:text-slate-500 font-medium">
                                                    {originalIdx + 1}
                                                </td>
                                                <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-100">
                                                    <div className="flex items-center gap-2">
                                                        <FileText
                                                            className={`w-4 h-4 shrink-0 ${isSelected ? 'text-emerald-600' : 'text-[#2a4574]'
                                                                }`}
                                                        />
                                                        <span>{dok}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="space-y-1">
                                                        {!isSelected ? (
                                                            <input
                                                                type="file"
                                                                accept="application/pdf"
                                                                onChange={(e) =>
                                                                    handleFileChange(
                                                                        dok,
                                                                        e.target.files[0] || null
                                                                    )
                                                                }
                                                                className={`w-full text-xs file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 dark:file:bg-blue-950/50 file:text-[#2a4574] dark:file:text-blue-300 hover:file:bg-blue-100 dark:hover:file:bg-blue-900/50 cursor-pointer ${hasError ? 'text-rose-600' : 'text-slate-600 dark:text-slate-300'
                                                                    }`}
                                                            />
                                                        ) : (
                                                            <div className="flex items-center justify-between gap-2 p-1.5 px-2.5 rounded-lg bg-white dark:bg-slate-900 border border-emerald-200 text-xs shadow-2xs">
                                                                <div className="flex items-center gap-1.5 min-w-0">
                                                                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                                                                    <span className="font-semibold text-slate-800 dark:text-slate-100 truncate max-w-[180px]">
                                                                        {files[dok].name}
                                                                    </span>
                                                                    <span className="text-[10px] text-slate-400 dark:text-slate-500 shrink-0">
                                                                        ({(files[dok].size / 1024).toFixed(0)} KB)
                                                                    </span>
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleRemoveFile(dok)}
                                                                    className="p-1 rounded-md text-slate-400 dark:text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                                                                    title="Hapus berkas ini"
                                                                >
                                                                    <X className="w-3.5 h-3.5" />
                                                                </button>
                                                            </div>
                                                        )}
                                                        {hasError && (
                                                            <p className="text-[11px] font-medium text-rose-600">
                                                                {fileErrors[dok]}
                                                            </p>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    {dok === 'Kuitansi' && (
                                                        <button
                                                            type="button"
                                                            onClick={() => setKuitansiModalOpen(true)}
                                                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-[#2a4574] dark:text-blue-400 border border-blue-200 dark:border-blue-800/60 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors shadow-2xs"
                                                        >
                                                            <Printer className="w-3.5 h-3.5" />
                                                            <span>Cetak</span>
                                                        </button>
                                                    )}

                                                    {dok === 'Daftar Penerimaan' && (
                                                        <button
                                                            type="button"
                                                            onClick={() => setPenerimaanModalOpen(true)}
                                                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-[#2a4574] dark:text-blue-400 border border-blue-200 dark:border-blue-800/60 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors shadow-2xs"
                                                        >
                                                            <Printer className="w-3.5 h-3.5" />
                                                            <span>Cetak</span>
                                                        </button>
                                                    )}

                                                    {dok === 'SPD Lampiran' && (
                                                        <button
                                                            type="button"
                                                            onClick={() => setSpdModalOpen(true)}
                                                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-[#2a4574] dark:text-blue-400 border border-blue-200 dark:border-blue-800/60 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors shadow-2xs"
                                                        >
                                                            <Printer className="w-3.5 h-3.5" />
                                                            <span>Cetak</span>
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="py-8 text-center text-slate-400 dark:text-slate-500">
                                            <p className="text-xs">
                                                Tidak ada dokumen kelengkapan yang cocok dengan kata kunci "<b>{searchQuery}</b>"
                                            </p>
                                            <button
                                                type="button"
                                                onClick={() => setSearchQuery('')}
                                                className="mt-2 text-xs font-semibold text-[#2a4574] hover:underline"
                                            >
                                                Tampilkan Semua Dokumen
                                            </button>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Dual Action Bottom Bar */}
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/70 border-t border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="text-xs text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span>
                                <b>{selectedFilesCount}</b> berkas PDF siap diunggah bersama SPJ ini
                            </span>
                        </div>
                        <div className="flex items-center gap-2.5">
                            <Link
                                href="/spj"
                                className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-colors shadow-2xs"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-semibold bg-linear-to-r from-[#2a4574] via-[#3b5a97] to-[#4c6fc1] text-white hover:opacity-95 transition-opacity shadow-xs disabled:opacity-50"
                            >
                                <Save className="w-3.5 h-3.5" />
                                <span>{isSubmitting ? 'Menyimpan...' : 'Simpan SPJ'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            </form>

            {/* Modal Cetak Kuitansi */}
            {kuitansiModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-5 border border-slate-200 dark:border-slate-700 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
                            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                <Printer className="w-4 h-4 text-[#2a4574]" />
                                <span>Cetak Kuitansi</span>
                            </h3>
                            <button
                                type="button"
                                onClick={() => setKuitansiModalOpen(false)}
                                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:bg-slate-700 hover:text-slate-600 dark:text-slate-300 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form
                            action="/kuitansi/preview"
                            method="POST"
                            target="_blank"
                            className="space-y-3"
                        >
                            <input
                                type="hidden"
                                name="_token"
                                value={document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''}
                            />
                            <input type="hidden" name="jenis_spj" value={form.jenis} />
                            <input type="hidden" name="tanggal_spj" value={form.tanggal_spj} />
                            <input type="hidden" name="sumber_dana" value={form.sumber_dana} />
                            <input type="hidden" name="nilai" value={form.nilai} />
                            <input type="hidden" name="pptk" value={form.pptk} />

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Nomor Rekening
                                </label>
                                <input
                                    type="text"
                                    name="nomor_rekening"
                                    value={kuitansiData.nomor_rekening}
                                    onChange={(e) =>
                                        setKuitansiData({
                                            ...kuitansiData,
                                            nomor_rekening: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#2a4574]/20"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Kode Rekening (12 Digit) <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="kode_rekening"
                                    required
                                    value={kuitansiData.kode_rekening}
                                    onChange={(e) =>
                                        setKuitansiData({
                                            ...kuitansiData,
                                            kode_rekening: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#2a4574]/20"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Untuk Pembayaran <span className="text-rose-500">*</span>
                                </label>
                                <textarea
                                    name="untuk_pembayaran"
                                    required
                                    rows={4}
                                    value={kuitansiData.untuk_pembayaran}
                                    onChange={(e) =>
                                        setKuitansiData({
                                            ...kuitansiData,
                                            untuk_pembayaran: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#2a4574]/20"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Yang Menerima <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="penerima"
                                    required
                                    value={kuitansiData.penerima}
                                    onChange={(e) =>
                                        setKuitansiData({
                                            ...kuitansiData,
                                            penerima: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#2a4574]/20"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-700">
                                <button
                                    type="button"
                                    onClick={() => setKuitansiModalOpen(false)}
                                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:bg-slate-700 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#2a4574] text-white hover:bg-[#1f3357] transition-colors shadow-xs"
                                >
                                    <Printer className="w-3.5 h-3.5" />
                                    <span>Cetak PDF</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Cetak Daftar Penerimaan */}
            {penerimaanModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-5 border border-slate-200 dark:border-slate-700 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
                            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                <Printer className="w-4 h-4 text-[#2a4574]" />
                                <span>Cetak Daftar Penerimaan</span>
                            </h3>
                            <button
                                type="button"
                                onClick={() => setPenerimaanModalOpen(false)}
                                className="p-1 rounded-lg text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:bg-slate-700 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form
                            action="/daftar-penerimaan/preview"
                            method="POST"
                            target="_blank"
                            className="space-y-3"
                        >
                            <input
                                type="hidden"
                                name="_token"
                                value={document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''}
                            />
                            <input type="hidden" name="pptk" value={form.pptk} />

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Dalam Rangka <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="dalam_rangka"
                                    required
                                    value={penerimaanData.dalam_rangka}
                                    onChange={(e) =>
                                        setPenerimaanData({
                                            ...penerimaanData,
                                            dalam_rangka: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#2a4574]/20"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Tanggal Mulai <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        name="tanggal_mulai"
                                        required
                                        value={penerimaanData.tanggal_mulai}
                                        onChange={(e) =>
                                            setPenerimaanData({
                                                ...penerimaanData,
                                                tanggal_mulai: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#2a4574]/20"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Tanggal Selesai <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        name="tanggal_selesai"
                                        required
                                        value={penerimaanData.tanggal_selesai}
                                        onChange={(e) =>
                                            setPenerimaanData({
                                                ...penerimaanData,
                                                tanggal_selesai: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#2a4574]/20"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Yang Menerima <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="yang_menerima"
                                    required
                                    value={penerimaanData.yang_menerima}
                                    onChange={(e) =>
                                        setPenerimaanData({
                                            ...penerimaanData,
                                            yang_menerima: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#2a4574]/20"
                                />
                            </div>

                            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-700">
                                <button
                                    type="button"
                                    onClick={() => setPenerimaanModalOpen(false)}
                                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:bg-slate-700 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#2a4574] text-white hover:bg-[#1f3357] transition-colors shadow-xs"
                                >
                                    <Printer className="w-3.5 h-3.5" />
                                    <span>Cetak PDF</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Cetak Lampiran SPD */}
            {spdModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-2xl w-full p-5 border border-slate-200 dark:border-slate-700 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
                            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                <Printer className="w-4 h-4 text-[#2a4574]" />
                                <span>Cetak Lampiran SPD</span>
                            </h3>
                            <button
                                type="button"
                                onClick={() => setSpdModalOpen(false)}
                                className="p-1 rounded-lg text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:bg-slate-700 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        <form
                            action="/lampiran-spd/preview"
                            method="POST"
                            target="_blank"
                            className="space-y-3"
                        >
                            <input
                                type="hidden"
                                name="_token"
                                value={document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''}
                            />

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Nomor Lampiran <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="nomor_lampiran"
                                        required
                                        value={spdData.nomor_lampiran}
                                        onChange={(e) =>
                                            setSpdData({ ...spdData, nomor_lampiran: e.target.value })
                                        }
                                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#2a4574]/20"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Tanggal Lampiran <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        name="tanggal_lampiran"
                                        required
                                        value={spdData.tanggal_lampiran}
                                        onChange={(e) =>
                                            setSpdData({
                                                ...spdData,
                                                tanggal_lampiran: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#2a4574]/20"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Daftar Peserta <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="daftar_peserta"
                                        required
                                        value={spdData.daftar_peserta}
                                        onChange={(e) =>
                                            setSpdData({ ...spdData, daftar_peserta: e.target.value })
                                        }
                                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#2a4574]/20"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Kota Penyelenggaraan <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="kota"
                                        required
                                        value={spdData.kota}
                                        onChange={(e) =>
                                            setSpdData({ ...spdData, kota: e.target.value })
                                        }
                                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#2a4574]/20"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Nomor Surat Tugas <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="no_surat_tugas"
                                        required
                                        value={spdData.no_surat_tugas}
                                        onChange={(e) =>
                                            setSpdData({
                                                ...spdData,
                                                no_surat_tugas: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#2a4574]/20"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Tanggal Surat Tugas <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        name="tgl_surat_tugas"
                                        required
                                        value={spdData.tgl_surat_tugas}
                                        onChange={(e) =>
                                            setSpdData({
                                                ...spdData,
                                                tgl_surat_tugas: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#2a4574]/20"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-700">
                                <button
                                    type="button"
                                    onClick={() => setSpdModalOpen(false)}
                                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:bg-slate-700 transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-[#2a4574] text-white hover:bg-[#1f3357] transition-colors shadow-xs"
                                >
                                    <Printer className="w-3.5 h-3.5" />
                                    <span>Cetak PDF</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
