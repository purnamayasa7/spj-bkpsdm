import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import {
    ArrowLeft,
    FileText,
    CheckCircle2,
    XCircle,
    Building2,
    User,
    Calendar,
    AlertCircle,
    Save,
    Ban,
    ExternalLink,
    CheckSquare,
    MessageSquare,
    Clock,
    Tag,
    Wallet,
    Coins,
    FolderKanban,
    Receipt,
    FileSpreadsheet,
} from 'lucide-react';

export default function Review({ spj, kelengkapan = [] }) {
    const [docStatuses, setDocStatuses] = useState(() => {
        const initial = {};
        kelengkapan.forEach((doc) => {
            initial[doc.id] = doc.status === 'Valid' ? 'Valid' : 'Tidak Valid';
        });
        return initial;
    });

    const [docReasons, setDocReasons] = useState(() => {
        const initial = {};
        kelengkapan.forEach((doc) => {
            initial[doc.id] = doc.alasan || '';
        });
        return initial;
    });

    const [keterangan, setKeterangan] = useState(spj.keterangan || '');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [rejectError, setRejectError] = useState('');

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(val || 0);
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        try {
            const d = new Date(dateStr);
            return new Intl.DateTimeFormat('id-ID', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
            }).format(d);
        } catch {
            return dateStr;
        }
    };

    const handleStatusChange = (id, newStatus) => {
        setDocStatuses((prev) => ({ ...prev, [id]: newStatus }));
        if (newStatus === 'Valid') {
            setDocReasons((prev) => ({ ...prev, [id]: '-' }));
        }
    };

    const handleReasonChange = (id, text) => {
        setDocReasons((prev) => ({ ...prev, [id]: text }));
    };

    const handleSaveReview = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const payload = { keterangan, status: docStatuses };
        kelengkapan.forEach((doc) => {
            payload[`alasan_${doc.id}`] = docReasons[doc.id] || '-';
        });

        router.post(`/keuangan/spj/${spj.id}/review`, payload, {
            onFinish: () => setIsSubmitting(false),
        });
    };

    const handleReject = (e) => {
        e.preventDefault();
        if (!rejectReason.trim()) {
            setRejectError('Alasan penolakan wajib diisi!');
            return;
        }
        setIsSubmitting(true);
        router.post(
            `/keuangan/spj/${spj.id}/review`,
            { action_type: 'tolak', alasan_penolakan: rejectReason, keterangan },
            {
                onFinish: () => {
                    setIsSubmitting(false);
                    setRejectModalOpen(false);
                },
            }
        );
    };

    return (
        <AuthenticatedLayout title="Review SPJ">
            <Head title={`Review SPJ - ${spj.id}`} />

            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <Link
                            href="/keuangan/spj"
                            className="inline-flex items-center justify-center w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors shadow-2xs"
                            title="Kembali ke Review SPJ"
                        >
                            <ArrowLeft className="w-4 h-4" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-2.5">
                                <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                                    Verifikasi &amp; Review SPJ
                                </h1>
                                <span className="text-xs font-bold font-mono px-2.5 py-0.5 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-[#2a4574] dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                                    {spj.id}
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                Periksa keabsahan berkas fisik dan kelengkapan dokumen pendukung SPJ
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                        <button
                            type="button"
                            onClick={() => setRejectModalOpen(true)}
                            disabled={isSubmitting}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 dark:hover:bg-rose-950/60 transition-colors shadow-2xs disabled:opacity-50"
                        >
                            <Ban className="w-3.5 h-3.5" />
                            <span>Tolak SPJ</span>
                        </button>

                        <button
                            type="button"
                            onClick={handleSaveReview}
                            disabled={isSubmitting}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-linear-to-r from-[#2a4574] via-[#3b5a97] to-[#4c6fc1] text-white hover:opacity-95 transition-opacity shadow-xs disabled:opacity-50"
                        >
                            <Save className="w-3.5 h-3.5" />
                            <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Review'}</span>
                        </button>
                    </div>
                </div>

                {/* SPJ Meta Summary Card */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900 flex items-center justify-center text-[#2a4574] dark:text-blue-400 shrink-0">
                                <FileText className="w-4 h-4" />
                            </div>
                            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">Ringkasan SPJ</h2>
                        </div>
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/50 text-[#2a4574] dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                            Status Saat Ini: {spj.status}
                        </span>
                    </div>

                    <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Reusable meta cell style */}
                        {[
                            {
                                icon: <Building2 className="w-3.5 h-3.5 text-[#2a4574] dark:text-blue-400" />,
                                label: 'Bidang Pengaju',
                                value: spj.bidang || '-',
                            },
                            {
                                icon: <User className="w-3.5 h-3.5 text-[#2a4574] dark:text-blue-400" />,
                                label: 'PPTK',
                                value: spj.pptk || '-',
                                truncate: true,
                                title: spj.pptk,
                            },
                            {
                                icon: <Wallet className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />,
                                label: 'Nilai Belanja',
                                value: formatCurrency(spj.nilai),
                                valueClass: 'text-emerald-700 dark:text-emerald-400',
                            },
                            {
                                icon: <Coins className="w-3.5 h-3.5 text-[#2a4574] dark:text-blue-400" />,
                                label: 'Sumber Dana',
                                value: spj.sumber_dana || '-',
                            },
                            {
                                icon: <Calendar className="w-3.5 h-3.5 text-[#2a4574] dark:text-blue-400" />,
                                label: 'Tanggal SPJ',
                                value: formatDate(spj.tanggal_spj),
                            },
                            {
                                icon: <Clock className="w-3.5 h-3.5 text-[#2a4574] dark:text-blue-400" />,
                                label: 'Tanggal Terima SPJ',
                                value: formatDate(spj.tanggal_terima_spj),
                            },
                            {
                                icon: <FileText className="w-3.5 h-3.5 text-[#2a4574] dark:text-blue-400" />,
                                label: 'ID SPJ',
                                value: spj.id,
                                mono: true,
                            },
                        ].map(({ icon, label, value, valueClass, truncate, title, mono }) => (
                            <div key={label} className="bg-slate-50/70 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                                <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                    {icon}
                                    <span>{label}</span>
                                </div>
                                <div
                                    className={`text-xs font-bold ${valueClass || 'text-slate-800 dark:text-slate-100'} ${truncate ? 'truncate' : ''} ${mono ? 'font-mono' : ''}`}
                                    title={title}
                                >
                                    {value}
                                </div>
                            </div>
                        ))}

                        {/* Jenis SPJ — badge style */}
                        <div className="bg-slate-50/70 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                <Tag className="w-3.5 h-3.5 text-[#2a4574] dark:text-blue-400" />
                                <span>Jenis SPJ</span>
                            </div>
                            <div className="text-xs font-bold text-[#2a4574] dark:text-blue-400 inline-block px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900">
                                {spj.jenis || '-'}
                            </div>
                        </div>

                        {/* Kegiatan */}
                        <div className="bg-slate-50/70 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-700 sm:col-span-2">
                            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                <FolderKanban className="w-3.5 h-3.5 text-[#2a4574] dark:text-blue-400" />
                                <span>Kegiatan</span>
                            </div>
                            <div className="text-xs font-medium text-slate-700 dark:text-slate-200">
                                {spj.kegiatan || '-'}
                            </div>
                        </div>

                        {/* Belanja */}
                        <div className="bg-slate-50/70 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-700 sm:col-span-2">
                            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                <Receipt className="w-3.5 h-3.5 text-[#2a4574] dark:text-blue-400" />
                                <span>Rekening Belanja</span>
                            </div>
                            <div className="text-xs font-medium text-slate-700 dark:text-slate-200">
                                {spj.belanja || '-'}
                            </div>
                        </div>

                        {/* Kelengkapan SPK */}
                        {spj.kelengkapan_spk && (
                            <div className="bg-slate-50/70 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-700 sm:col-span-2 lg:col-span-4">
                                <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                    <FileSpreadsheet className="w-3.5 h-3.5 text-[#2a4574] dark:text-blue-400" />
                                    <span>Kelengkapan SPK</span>
                                </div>
                                <div className="text-xs text-slate-700 dark:text-slate-200 whitespace-pre-wrap">
                                    {spj.kelengkapan_spk}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Checklist Dokumen Card */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900 flex items-center justify-center text-[#2a4574] dark:text-blue-400 shrink-0">
                                <CheckSquare className="w-4 h-4" />
                            </div>
                            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                                Verifikasi Kelengkapan Dokumen ({kelengkapan.length})
                            </h2>
                        </div>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                            Tandai status <b>Valid</b> atau <b>Tidak Valid</b> beserta catatan koreksinya
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                            <thead className="bg-slate-50/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase tracking-wider text-[11px] font-bold border-b border-slate-200 dark:border-slate-700">
                                <tr>
                                    <th className="px-4 py-3.5 w-12 text-center">No</th>
                                    <th className="px-4 py-3.5 w-1/4">Nama Dokumen</th>
                                    <th className="px-4 py-3.5 w-36 text-center">Status Berkas</th>
                                    <th className="px-4 py-3.5">Catatan Koreksi (Jika Tidak Valid)</th>
                                    <th className="px-4 py-3.5 w-32 text-center">Berkas PDF</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                                {kelengkapan.length > 0 ? (
                                    kelengkapan.map((doc, idx) => {
                                        const currentStatus = docStatuses[doc.id] || 'Tidak Valid';
                                        const isValid = currentStatus === 'Valid';

                                        return (
                                            <tr
                                                key={doc.id || idx}
                                                className={`transition-colors ${
                                                    isValid
                                                        ? 'hover:bg-slate-50 dark:bg-slate-800/50 dark:hover:bg-slate-800/40'
                                                        : 'bg-rose-50/30 dark:bg-rose-950/10 hover:bg-rose-50/50 dark:hover:bg-rose-950/20'
                                                }`}
                                            >
                                                <td className="px-4 py-3 text-center text-slate-400 dark:text-slate-500 font-medium">
                                                    {idx + 1}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <FileText className="w-4 h-4 text-[#2a4574] dark:text-blue-400 shrink-0" />
                                                        <span className="font-semibold text-slate-800 dark:text-slate-100">
                                                            {doc.nama_dokumen}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <select
                                                        value={currentStatus}
                                                        onChange={(e) =>
                                                            handleStatusChange(doc.id, e.target.value)
                                                        }
                                                        className={`w-full text-xs font-bold py-1.5 px-2.5 rounded-lg border cursor-pointer focus:outline-hidden transition-colors ${
                                                            isValid
                                                                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800 focus:ring-2 focus:ring-emerald-200'
                                                                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-300 dark:border-rose-800 focus:ring-2 focus:ring-rose-200'
                                                        }`}
                                                    >
                                                        <option value="Valid">Valid</option>
                                                        <option value="Tidak Valid">Tidak Valid</option>
                                                    </select>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <input
                                                        type="text"
                                                        value={docReasons[doc.id] || ''}
                                                        onChange={(e) =>
                                                            handleReasonChange(doc.id, e.target.value)
                                                        }
                                                        placeholder={
                                                            isValid
                                                                ? 'Berkas sudah valid'
                                                                : 'Tuliskan catatan perbaikan berkas ini...'
                                                        }
                                                        disabled={isValid}
                                                        className={`w-full px-3 py-1.5 rounded-lg text-xs border focus:outline-hidden transition-colors ${
                                                            isValid
                                                                ? 'bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-700 cursor-not-allowed'
                                                                : 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border-rose-300 dark:border-rose-700 focus:border-rose-500 focus:ring-2 focus:ring-rose-100 dark:focus:ring-rose-900/30 placeholder:text-rose-300 dark:placeholder:text-rose-700'
                                                        }`}
                                                    />
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    {doc.file_path ? (
                                                        <a
                                                            href={`/spj/file/${doc.id}`}
                                                            target="_blank"
                                                            rel="noreferrer"
                                                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-800 text-[#2a4574] dark:text-blue-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-2xs"
                                                        >
                                                            <ExternalLink className="w-3.5 h-3.5" />
                                                            <span>Lihat PDF</span>
                                                        </a>
                                                    ) : (
                                                        <span className="text-slate-400 dark:text-slate-500 text-xs italic">
                                                            Tidak ada file
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-8 text-center text-slate-400 dark:text-slate-500">
                                            Tidak ada dokumen terdaftar untuk diverifikasi.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Keterangan & Catatan Tambahan */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-xs space-y-3">
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900 flex items-center justify-center text-[#2a4574] dark:text-blue-400 shrink-0">
                            <MessageSquare className="w-4 h-4" />
                        </div>
                        <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">Catatan Tambahan Reviewer</h2>
                    </div>
                    <textarea
                        value={keterangan}
                        onChange={(e) => setKeterangan(e.target.value)}
                        rows={3}
                        placeholder="Tuliskan catatan umum untuk SPJ ini bila diperlukan..."
                        className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#2a4574]/20 focus:border-[#2a4574]"
                    />
                    <div className="flex items-center justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => setRejectModalOpen(true)}
                            disabled={isSubmitting}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 dark:hover:bg-rose-950/60 transition-colors shadow-2xs"
                        >
                            <Ban className="w-3.5 h-3.5" />
                            <span>Tolak SPJ</span>
                        </button>
                        <button
                            type="button"
                            onClick={handleSaveReview}
                            disabled={isSubmitting}
                            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-semibold bg-linear-to-r from-[#2a4574] via-[#3b5a97] to-[#4c6fc1] text-white hover:opacity-95 transition-opacity shadow-xs"
                        >
                            <Save className="w-3.5 h-3.5" />
                            <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Review'}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal Tolak SPJ */}
            {rejectModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-5 border border-slate-200 dark:border-slate-700 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 flex items-center justify-center text-rose-600 dark:text-rose-400">
                                <AlertCircle className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Tolak Pengajuan SPJ</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">
                                    SPJ ini akan ditolak dan Bidang terkait akan mendapatkan notifikasi penolakan.
                                </p>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                Alasan Penolakan <span className="text-rose-500">*</span>
                            </label>
                            <textarea
                                value={rejectReason}
                                onChange={(e) => {
                                    setRejectReason(e.target.value);
                                    if (rejectError) setRejectError('');
                                }}
                                rows={4}
                                placeholder="Jelaskan alasan penolakan secara jelas..."
                                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-hidden focus:ring-2 focus:ring-rose-300 focus:border-rose-500"
                            />
                            {rejectError && (
                                <p className="text-xs text-rose-600 dark:text-rose-400 mt-1 font-medium">{rejectError}</p>
                            )}
                        </div>

                        <div className="flex items-center justify-end gap-2.5 pt-2">
                            <button
                                type="button"
                                onClick={() => setRejectModalOpen(false)}
                                disabled={isSubmitting}
                                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:bg-slate-700 dark:hover:bg-slate-800 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={handleReject}
                                disabled={isSubmitting}
                                className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 text-white hover:bg-rose-700 transition-colors shadow-xs disabled:opacity-50"
                            >
                                {isSubmitting ? 'Memproses...' : 'Konfirmasi Tolak'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
