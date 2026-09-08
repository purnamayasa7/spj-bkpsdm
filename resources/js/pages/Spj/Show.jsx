import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import {
    ArrowLeft,
    FileText,
    Printer,
    Edit,
    CheckCircle2,
    Clock,
    AlertCircle,
    XCircle,
    Calendar,
    Building2,
    DollarSign,
    User,
    Tag,
    FileCheck,
    Wallet,
    Coins,
    FolderKanban,
    Receipt,
    FileSpreadsheet,
    MessageSquare,
    ExternalLink,
} from 'lucide-react';

export default function Show({ spj, kelengkapan = [], auth }) {
    const isKeuangan = auth?.user?.role_id === 1;
    const isBidang = auth?.user?.role_id === 2;

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

    const statusBadge = (status) => {
        switch (status) {
            case 'Disetujui':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Disetujui
                    </span>
                );
            case 'Dikoreksi':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60">
                        <AlertCircle className="w-3.5 h-3.5" />
                        Dikoreksi
                    </span>
                );
            case 'Ditolak':
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60">
                        <XCircle className="w-3.5 h-3.5" />
                        Ditolak
                    </span>
                );
            case 'Dikirim':
            default:
                return (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-[#2a4574] dark:text-blue-400 border border-blue-200 dark:border-blue-800/60">
                        <Clock className="w-3.5 h-3.5" />
                        {status || 'Dikirim'}
                    </span>
                );
        }
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

    const backUrl = isKeuangan ? '/keuangan/spj' : '/spj';

    return (
        <AuthenticatedLayout title="Detail SPJ">
            <Head title={`Detail SPJ - ${spj.id}`} />

            <div className="space-y-6">
                {/* Header Section */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3">
                            <Link
                                href={backUrl}
                                className="inline-flex items-center justify-center w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-100 transition-colors shadow-2xs"
                                title="Kembali"
                            >
                                <ArrowLeft className="w-4 h-4" />
                            </Link>
                            <div>
                                <div className="flex items-center gap-2.5">
                                    <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                                        Detail Data SPJ
                                    </h1>
                                    <span className="text-xs font-bold font-mono px-2.5 py-0.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-[#2a4574] dark:text-blue-400 border border-blue-200 dark:border-blue-800/60">
                                        {spj.id}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                    Informasi lengkap pengajuan dan berkas kelengkapan dokumen SPJ
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2.5">
                        {isKeuangan && (
                            <a
                                href={`/keuangan/spj/${spj.id}/checklist-pdf`}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
                            >
                                <Printer className="w-3.5 h-3.5 text-[#2a4574] dark:text-blue-400" />
                                <span>Cetak Checklist</span>
                            </a>
                        )}

                        {isBidang && spj.status === 'Dikoreksi' && (
                            <Link
                                href={`/spj/${spj.id}/edit`}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-amber-500 text-white hover:bg-amber-600 transition-colors shadow-2xs"
                            >
                                <Edit className="w-3.5 h-3.5" />
                                <span>Koreksi SPJ</span>
                            </Link>
                        )}

                        {isKeuangan && spj.status === 'Dikirim' && (
                            <Link
                                href={`/keuangan/spj/${spj.id}/review`}
                                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-linear-to-r from-[#2a4574] via-[#3b5a97] to-[#4c6fc1] text-white hover:opacity-95 transition-opacity shadow-xs"
                            >
                                <FileCheck className="w-3.5 h-3.5" />
                                <span>Review SPJ</span>
                            </Link>
                        )}
                    </div>
                </div>

                {/* Primary Data Card */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-800/60 flex items-center justify-center text-[#2a4574] dark:text-blue-400 shrink-0">
                                <FileText className="w-4 h-4" />
                            </div>
                            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">Informasi Pengajuan SPJ</h2>
                        </div>
                        <div>{statusBadge(spj.status)}</div>
                    </div>

                    <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Bidang */}
                        <div className="bg-slate-50 dark:bg-slate-800/70 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                <Building2 className="w-3.5 h-3.5 text-[#2a4574] dark:text-blue-400" />
                                <span>Bidang Pengaju</span>
                            </div>
                            <div className="text-xs font-bold text-slate-800 dark:text-slate-100">
                                {spj.bidang || '-'}
                            </div>
                        </div>

                        {/* Jenis SPJ */}
                        <div className="bg-slate-50 dark:bg-slate-800/70 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                <Tag className="w-3.5 h-3.5 text-[#2a4574] dark:text-blue-400" />
                                <span>Jenis SPJ</span>
                            </div>
                            <div className="text-xs font-bold text-[#2a4574] dark:text-blue-400 inline-block px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-800/60">
                                {spj.jenis || '-'}
                            </div>
                        </div>

                        {/* PPTK */}
                        <div className="bg-slate-50 dark:bg-slate-800/70 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                <User className="w-3.5 h-3.5 text-[#2a4574] dark:text-blue-400" />
                                <span>PPTK</span>
                            </div>
                            <div className="text-xs font-semibold text-slate-800 dark:text-slate-100 truncate" title={spj.pptk}>
                                {spj.pptk || '-'}
                            </div>
                        </div>

                        {/* Nilai SPJ */}
                        <div className="bg-slate-50 dark:bg-slate-800/70 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                <Wallet className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Nilai Belanja</span>
                            </div>
                            <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                                {formatCurrency(spj.nilai)}
                            </div>
                        </div>

                        {/* Sumber Dana */}
                        <div className="bg-slate-50 dark:bg-slate-800/70 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                <Coins className="w-3.5 h-3.5 text-[#2a4574] dark:text-blue-400" />
                                <span>Sumber Dana</span>
                            </div>
                            <div className="text-xs font-semibold text-slate-800 dark:text-slate-100">
                                {spj.sumber_dana || '-'}
                            </div>
                        </div>

                        {/* Tanggal SPJ */}
                        <div className="bg-slate-50 dark:bg-slate-800/70 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-[#2a4574] dark:text-blue-400" />
                                <span>Tanggal SPJ</span>
                            </div>
                            <div className="text-xs font-semibold text-slate-800 dark:text-slate-100">
                                {formatDate(spj.tanggal_spj)}
                            </div>
                        </div>

                        {/* Tanggal Terima SPJ */}
                        <div className="bg-slate-50 dark:bg-slate-800/70 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-[#2a4574] dark:text-blue-400" />
                                <span>Tanggal Terima SPJ</span>
                            </div>
                            <div className="text-xs font-semibold text-slate-800 dark:text-slate-100">
                                {formatDate(spj.tanggal_terima_spj)}
                            </div>
                        </div>

                        {/* ID SPJ Box */}
                        <div className="bg-slate-50 dark:bg-slate-800/70 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                <FileText className="w-3.5 h-3.5 text-[#2a4574] dark:text-blue-400" />
                                <span>ID SPJ</span>
                            </div>
                            <div className="text-xs font-bold font-mono text-slate-700 dark:text-slate-300">
                                {spj.id}
                            </div>
                        </div>

                        {/* Kegiatan */}
                        <div className="bg-slate-50 dark:bg-slate-800/70 p-3 rounded-xl border border-slate-100 dark:border-slate-700 sm:col-span-2">
                            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                <FolderKanban className="w-3.5 h-3.5 text-[#2a4574] dark:text-blue-400" />
                                <span>Kegiatan</span>
                            </div>
                            <div className="text-xs font-medium text-slate-800 dark:text-slate-100">
                                {spj.kegiatan || '-'}
                            </div>
                        </div>

                        {/* Belanja */}
                        <div className="bg-slate-50 dark:bg-slate-800/70 p-3 rounded-xl border border-slate-100 dark:border-slate-700 sm:col-span-2">
                            <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                <Receipt className="w-3.5 h-3.5 text-[#2a4574] dark:text-blue-400" />
                                <span>Rekening Belanja</span>
                            </div>
                            <div className="text-xs font-medium text-slate-800 dark:text-slate-100">
                                {spj.belanja || '-'}
                            </div>
                        </div>

                        {/* Kelengkapan SPK */}
                        {spj.kelengkapan_spk && (
                            <div className="bg-slate-50 dark:bg-slate-800/70 p-3 rounded-xl border border-slate-100 dark:border-slate-700 sm:col-span-2 lg:col-span-4">
                                <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                    <FileSpreadsheet className="w-3.5 h-3.5 text-[#2a4574] dark:text-blue-400" />
                                    <span>Kelengkapan SPK</span>
                                </div>
                                <div className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                                    {spj.kelengkapan_spk}
                                </div>
                            </div>
                        )}

                        {/* Keterangan */}
                        {spj.keterangan && (
                            <div className="bg-slate-50 dark:bg-slate-800/70 p-3 rounded-xl border border-slate-100 dark:border-slate-700 sm:col-span-2 lg:col-span-4">
                                <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                                    <MessageSquare className="w-3.5 h-3.5 text-[#2a4574] dark:text-blue-400" />
                                    <span>Catatan / Keterangan</span>
                                </div>
                                <div className="text-xs text-slate-700 dark:text-slate-300 whitespace-pre-wrap">
                                    {spj.keterangan}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Documents Table Card */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-800/60 flex items-center justify-center text-[#2a4574] dark:text-blue-400 shrink-0">
                                <FileCheck className="w-4 h-4" />
                            </div>
                            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                                Berkas Kelengkapan Dokumen ({kelengkapan.length})
                            </h2>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                            <thead className="bg-slate-50/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase tracking-wider text-[11px] font-bold border-b border-slate-200 dark:border-slate-700">
                                <tr>
                                    <th className="px-4 py-3.5 w-12 text-center">No</th>
                                    <th className="px-4 py-3.5">Nama Dokumen</th>
                                    <th className="px-4 py-3.5 text-center">Status Verifikasi</th>
                                    <th className="px-4 py-3.5">Catatan / Alasan Koreksi</th>
                                    <th className="px-4 py-3.5 text-center">Aksi Berkas</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                                {kelengkapan.length > 0 ? (
                                    kelengkapan.map((doc, idx) => (
                                        <tr key={doc.id || idx} className="hover:bg-slate-50 dark:bg-slate-800/60 transition-colors">
                                            <td className="px-4 py-3 text-center text-slate-400 dark:text-slate-500 font-medium">
                                                {idx + 1}
                                            </td>
                                            <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-100">
                                                <div className="flex items-center gap-2">
                                                    <FileText className="w-4 h-4 text-[#2a4574] dark:text-blue-400 shrink-0" />
                                                    <span>{doc.nama_dokumen}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                {docStatusBadge(doc.status)}
                                            </td>
                                            <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
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
                                                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
                                                    >
                                                        <ExternalLink className="w-3.5 h-3.5" />
                                                        <span>Lihat PDF</span>
                                                    </a>
                                                ) : (
                                                    <span className="text-slate-400 dark:text-slate-500 text-xs italic">
                                                        Belum ada file
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-4 py-8 text-center text-slate-400 dark:text-slate-500">
                                            Belum ada dokumen kelengkapan yang diunggah.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
