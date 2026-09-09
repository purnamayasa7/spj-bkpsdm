import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import {
    ArrowLeft,
    FileText,
    Save,
    AlertCircle,
    Building2,
    User,
    Calendar,
    Plus,
    Trash2,
    ExternalLink,
    CheckCircle2,
    UploadCloud,
    Search,
    Lock,
    Coins,
    CalendarDays,
    X,
    Check,
} from 'lucide-react';

export default function Edit({ spj, kelengkapan = [], dokumens = [] }) {
    const [docSearch, setDocSearch] = useState('');
    const filteredKelengkapan = kelengkapan.filter((doc) => {
        if (!docSearch) return true;
        const q = docSearch.toLowerCase();
        return (
            (doc.nama_dokumen || '').toLowerCase().includes(q) ||
            (doc.status || '').toLowerCase().includes(q) ||
            (doc.alasan || '').toLowerCase().includes(q)
        );
    });
    const [form, setForm] = useState({
        bidang: spj.bidang || '',
        jenis: spj.jenis || '',
        pptk: spj.pptk || '',
        kegiatan: spj.kegiatan || '',
        belanja: spj.belanja || '',
        nilai: spj.nilai || '',
        sumber_dana: spj.sumber_dana || '',
        tanggal_spj: spj.tanggal_spj || '',
        tanggal_terima_spj: spj.tanggal_terima_spj || '',
        kelengkapan_spk: spj.kelengkapan_spk || '',
        keterangan: spj.keterangan || '',
    });

    // Re-upload files for existing kelengkapan: { [docId]: File }
    const [replacementFiles, setReplacementFiles] = useState({});

    // New documents: [ { id, nama_dokumen, file } ]
    const [newDocs, setNewDocs] = useState([]);

    const [fileErrors, setFileErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

    const formatCurrency = (val) => {
        if (!val) return 'Rp 0';
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(val);
    };

    const docStatusBadge = (status) => {
        switch (status) {
            case 'Valid':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
                        Valid
                    </span>
                );
            case 'Tidak Valid':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60">
                        Tidak Valid
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {status || 'Belum Diverifikasi'}
                    </span>
                );
        }
    };

    const handleReplacementFileChange = (docId, file) => {
        if (!file) {
            const next = { ...replacementFiles };
            delete next[docId];
            setReplacementFiles(next);
            return;
        }

        const MAX_SIZE = 2 * 1024 * 1024;
        if (file.size > MAX_SIZE) {
            setFileErrors((prev) => ({
                ...prev,
                [`replace_${docId}`]: 'Ukuran berkas melebihi batas 2 MB.',
            }));
        } else {
            setFileErrors((prev) => {
                const updated = { ...prev };
                delete updated[`replace_${docId}`];
                return updated;
            });
            setReplacementFiles((prev) => ({ ...prev, [docId]: file }));
        }
    };

    const handleAddNewDocRow = () => {
        setNewDocs([
            ...newDocs,
            { id: Date.now(), nama_dokumen: '', file: null },
        ]);
    };

    const handleRemoveNewDocRow = (id) => {
        setNewDocs(newDocs.filter((d) => d.id !== id));
    };

    const handleNewDocChange = (id, field, value) => {
        setNewDocs(
            newDocs.map((d) => (d.id === id ? { ...d, [field]: value } : d))
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (Object.keys(fileErrors).length > 0) {
            alert('Harap perbaiki berkas yang melebihi batas 2 MB sebelum menyimpan.');
            return;
        }

        setIsSubmitting(true);

        const formData = new FormData();

        // SPJ meta fields
        Object.entries(form).forEach(([key, val]) => {
            if (val !== null && val !== undefined) {
                formData.append(key, val);
            }
        });

        // Replacement files
        Object.entries(replacementFiles).forEach(([docId, file]) => {
            if (file) {
                formData.append(`kelengkapan[${docId}][file_path]`, file);
            }
        });

        // New documents
        newDocs.forEach((d, idx) => {
            if (d.nama_dokumen && d.file) {
                formData.append(`nama_dokumen_baru[${idx}]`, d.nama_dokumen);
                formData.append(`dokumen_baru[${idx}]`, d.file);
            }
        });

        router.post(`/spj/${spj.id}/update`, formData, {
            onError: (errs) => {
                setErrors(errs);
                setIsSubmitting(false);
            },
            onFinish: () => setIsSubmitting(false),
        });
    };

    return (
        <AuthenticatedLayout title="Edit SPJ">
            <Head title={`Edit SPJ - ${spj.id}`} />

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
                                    Edit & Perbaiki SPJ
                                </h1>
                                <span className="text-xs font-bold font-mono px-2.5 py-0.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60">
                                    {spj.id}
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                Lakukan koreksi isian data atau perbarui berkas dokumen yang diminta
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
                            <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
                        </button>
                    </div>
                </div>

                {/* Form Errors Banner */}
                {Object.keys(errors).length > 0 && (
                    <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs space-y-1">
                        <div className="font-bold flex items-center gap-1.5">
                            <AlertCircle className="w-4 h-4" />
                            <span>Terdapat kesalahan validasi:</span>
                        </div>
                        <ul className="list-disc list-inside space-y-0.5 pl-5">
                            {Object.entries(errors).map(([key, msg]) => (
                                <li key={key}>{msg}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Primary Data Card */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
                        <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-800/60 flex items-center justify-center text-[#2a4574] dark:text-blue-400 shrink-0">
                                <FileText className="w-4 h-4" />
                            </div>
                            <div>
                                <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">Rincian Formulir SPJ</h2>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400">Perbarui rincian belanja dan dokumen kelengkapan SPJ</p>
                            </div>
                        </div>
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60">
                            Status SPJ: {spj.status}
                        </span>
                    </div>

                    <div className="p-5 space-y-6">
                        {/* Sub-section 1: Identitas Pengajuan */}
                        <div>
                            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                <Building2 className="w-3.5 h-3.5 text-[#2a4574] dark:text-blue-400" />
                                <span>1. Identitas Pengajuan</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                                {/* ID SPJ */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                                        <span>ID SPJ</span>
                                        <span className="text-[10px] font-normal text-slate-400 dark:text-slate-500">Terkunci</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={spj.id}
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
                                        <span className="text-[10px] font-normal text-slate-400 dark:text-slate-500">Terkunci</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={form.bidang}
                                            readOnly
                                            className="w-full pl-3 pr-8 py-2 bg-slate-100 dark:bg-slate-700/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 cursor-not-allowed"
                                        />
                                        <Lock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2" />
                                    </div>
                                </div>

                                {/* PPTK */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        PPTK <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={form.pptk}
                                        onChange={(e) => setForm({ ...form, pptk: e.target.value })}
                                        placeholder="Nama PPTK..."
                                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#2a4574]/20 focus:border-[#2a4574] transition-all"
                                    />
                                    {errors.pptk && (
                                        <p className="text-[11px] text-rose-500 mt-1">{errors.pptk}</p>
                                    )}
                                </div>

                                {/* Status SPJ */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                                        <span>Status</span>
                                        <span className="text-[10px] font-normal text-slate-400 dark:text-slate-500">Terkunci</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={spj.status}
                                            readOnly
                                            className="w-full pl-3 pr-8 py-2 bg-slate-100 dark:bg-slate-700/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 cursor-not-allowed"
                                        />
                                        <Lock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2" />
                                    </div>
                                </div>

                                {/* Jenis */}
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
                                        <option value="GU">GU</option>
                                        <option value="LS">LS</option>
                                        <option value="UP">UP</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Sub-section 2: Rincian Anggaran & Rekening Belanja */}
                        <div>
                            <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                <Coins className="w-3.5 h-3.5 text-[#2a4574] dark:text-blue-400" />
                                <span>2. Rincian Anggaran & Rekening Belanja</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {/* Nilai */}
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
                                            value={form.nilai}
                                            onChange={(e) => setForm({ ...form, nilai: e.target.value })}
                                            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 dark:border-slate-700 rounded-r-xl text-xs font-bold text-slate-800 dark:text-slate-100 focus:bg-white dark:bg-slate-900 dark:focus:bg-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#2a4574]/20 focus:border-[#2a4574] transition-all"
                                        />
                                    </div>
                                    {form.nilai && (
                                        <p className="text-[11px] font-semibold text-emerald-700 mt-1 flex items-center gap-1">
                                            <span>Terbilang:</span>
                                            <span className="underline decoration-emerald-300">{formatCurrency(form.nilai)}</span>
                                        </p>
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
                                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#2a4574]/20 focus:border-[#2a4574] transition-all"
                                    />
                                </div>

                                {/* Belanja */}
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Rekening Belanja <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={form.belanja}
                                        onChange={(e) => setForm({ ...form, belanja: e.target.value })}
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
                                        Kelengkapan SPK / Surat Pesanan
                                    </label>
                                    <textarea
                                        rows={2}
                                        value={form.kelengkapan_spk}
                                        onChange={(e) =>
                                            setForm({ ...form, kelengkapan_spk: e.target.value })
                                        }
                                        placeholder="Daftar nomor SPK / rincian kontrak..."
                                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#2a4574]/20 focus:border-[#2a4574] transition-all"
                                    />
                                </div>

                                {/* Keterangan */}
                                <div className="md:col-span-2">
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Keterangan Tambahan
                                    </label>
                                    <textarea
                                        rows={2}
                                        value={form.keterangan}
                                        onChange={(e) => setForm({ ...form, keterangan: e.target.value })}
                                        placeholder="Catatan perbaikan atau keterangan umum..."
                                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#2a4574]/20 focus:border-[#2a4574] transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Existing Kelengkapan Dokumen Table Card */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800/50">
                        <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-800/60 flex items-center justify-center text-[#2a4574] dark:text-blue-400 shrink-0">
                                <FileText className="w-4 h-4" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2">
                                    <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                                        Berkas Dokumen Terdaftar ({kelengkapan.length})
                                    </h2>
                                    {kelengkapan.some((d) => d.status === 'Tidak Valid') && (
                                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                                            Perlu Perbaikan
                                        </span>
                                    )}
                                </div>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                    Unggah ulang berkas PDF jika statusnya <b>Tidak Valid</b>
                                </p>
                            </div>
                        </div>

                        {/* Quick Search */}
                        <div className="relative w-full md:w-64">
                            <Search className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={docSearch}
                                onChange={(e) => setDocSearch(e.target.value)}
                                placeholder="Cari nama dokumen / status..."
                                className="w-full pl-8 pr-7 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#2a4574]/20 focus:border-[#2a4574] transition-all shadow-2xs"
                            />
                            {docSearch && (
                                <button
                                    type="button"
                                    onClick={() => setDocSearch('')}
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
                                    <th className="px-4 py-3.5 text-center">Status</th>
                                    <th className="px-4 py-3.5">Alasan Koreksi</th>
                                    <th className="px-4 py-3.5 text-center">Berkas Saat Ini</th>
                                    <th className="px-4 py-3.5 w-72">Unggah Perbaikan (PDF)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                                {filteredKelengkapan.length > 0 ? (
                                    filteredKelengkapan.map((doc, idx) => {
                                        const originalIdx = kelengkapan.indexOf(doc);
                                        const canReupload =
                                            doc.status === 'Tidak Valid' || spj.status === 'Disetujui';
                                        const isReplaced = !!replacementFiles[doc.id];

                                        return (
                                            <tr
                                                key={doc.id}
                                                className={`transition-colors ${doc.status === 'Tidak Valid'
                                                    ? 'bg-rose-50/20 hover:bg-rose-50/40'
                                                    : isReplaced
                                                        ? 'bg-emerald-50/30 hover:bg-emerald-50/50'
                                                        : 'hover:bg-slate-50 dark:bg-slate-800/60'
                                                    }`}
                                            >
                                                <td className="px-4 py-3 text-center text-slate-400 dark:text-slate-500 font-medium">
                                                    {originalIdx >= 0 ? originalIdx + 1 : idx + 1}
                                                </td>
                                                <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-100">
                                                    <div className="flex items-center gap-2">
                                                        <FileText className="w-4 h-4 text-[#2a4574] shrink-0" />
                                                        <span>{doc.nama_dokumen}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    {docStatusBadge(doc.status)}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {doc.alasan && doc.alasan !== '-' ? (
                                                        <span className="text-rose-600 font-medium">
                                                            {doc.alasan}
                                                        </span>
                                                    ) : (
                                                        <span className="text-slate-400 dark:text-slate-500 italic">-</span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    {doc.file_path ? (
                                                        <a
                                                            href={`/spj/file/${doc.id}`}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-white dark:bg-slate-900 text-[#2a4574] border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
                                                        >
                                                            <ExternalLink className="w-3.5 h-3.5" />
                                                            <span>Lihat PDF</span>
                                                        </a>
                                                    ) : (
                                                        <span className="text-slate-400 dark:text-slate-500 italic">
                                                            Tidak ada file
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-4 py-3">
                                                    {canReupload ? (
                                                        <div className="space-y-1">
                                                            <input
                                                                type="file"
                                                                accept="application/pdf"
                                                                onChange={(e) =>
                                                                    handleReplacementFileChange(
                                                                        doc.id,
                                                                        e.target.files[0] || null
                                                                    )
                                                                }
                                                                className="w-full text-xs file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100 cursor-pointer"
                                                            />
                                                            {isReplaced && (
                                                                <p className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                                                                    <Check className="w-3 h-3" />
                                                                    <span>
                                                                        Berkas pengganti: {replacementFiles[doc.id].name} (
                                                                        {(replacementFiles[doc.id].size / 1024).toFixed(0)} KB)
                                                                    </span>
                                                                </p>
                                                            )}
                                                            {fileErrors[`replace_${doc.id}`] && (
                                                                <p className="text-[11px] font-medium text-rose-600">
                                                                    {fileErrors[`replace_${doc.id}`]}
                                                                </p>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <span className="text-slate-400 dark:text-slate-500 text-xs italic">
                                                            Sudah valid (terkunci)
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="py-8 text-center text-slate-400 dark:text-slate-500">
                                            <p className="text-xs">
                                                Tidak ada berkas dokumen yang cocok dengan "<b>{docSearch}</b>"
                                            </p>
                                            <button
                                                type="button"
                                                onClick={() => setDocSearch('')}
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

                    {/* Bottom Info Bar inside Card */}
                    <div className="p-3.5 px-5 bg-slate-50 dark:bg-slate-800/70 border-t border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <span>Menampilkan {filteredKelengkapan.length} dari {kelengkapan.length} dokumen terdaftar</span>
                        {Object.keys(replacementFiles).length > 0 && (
                            <span className="font-semibold text-emerald-700 flex items-center gap-1">
                                <Check className="w-3.5 h-3.5" />
                                <span>{Object.keys(replacementFiles).length} berkas pengganti siap disimpan</span>
                            </span>
                        )}
                    </div>
                </div>



                {/* Section: Tambah Dokumen Baru (Jika status !== 'Disetujui') */}
                {spj.status !== 'Disetujui' && (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-xs space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                    <UploadCloud className="w-4 h-4 text-[#2a4574]" />
                                    <span>Tambah Dokumen Baru (Jika Dibutuhkan)</span>
                                </h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                    Pilih jenis dokumen pendukung tambahan dan unggah berkas PDF
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={handleAddNewDocRow}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors shadow-2xs"
                            >
                                <Plus className="w-3.5 h-3.5" />
                                <span>Tambah Baris Dokumen</span>
                            </button>
                        </div>

                        {newDocs.length > 0 ? (
                            <div className="space-y-3">
                                {newDocs.map((item, idx) => (
                                    <div
                                        key={item.id}
                                        className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                                    >
                                        <div className="w-full sm:w-1/2">
                                            <select
                                                value={item.nama_dokumen}
                                                onChange={(e) =>
                                                    handleNewDocChange(
                                                        item.id,
                                                        'nama_dokumen',
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-[#2a4574]/20"
                                            >
                                                <option value="">-- Pilih Jenis Dokumen --</option>
                                                {dokumens.map((d) => (
                                                    <option key={d} value={d}>
                                                        {d}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="w-full sm:w-1/2">
                                            <input
                                                type="file"
                                                accept="application/pdf"
                                                onChange={(e) =>
                                                    handleNewDocChange(
                                                        item.id,
                                                        'file',
                                                        e.target.files[0] || null
                                                    )
                                                }
                                                className="w-full text-xs file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 dark:file:bg-blue-950/50 file:text-[#2a4574] dark:file:text-blue-300 hover:file:bg-blue-100 dark:hover:file:bg-blue-900/50 cursor-pointer"
                                            />
                                        </div>
                                        <div>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveNewDocRow(item.id)}
                                                className="p-1.5 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                                                title="Hapus baris"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-xs text-slate-400 dark:text-slate-500 italic">
                                Belum ada dokumen baru yang ditambahkan. Klik tombol di atas jika ingin menyertakan dokumen lain.
                            </p>
                        )}
                    </div>
                )}

                {/* Footer Actions */}
                <div className="flex items-center justify-end gap-3 pt-2">
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
                        <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
                    </button>
                </div>
            </form>
        </AuthenticatedLayout>
    );
}
