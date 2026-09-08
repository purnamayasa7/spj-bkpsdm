import React from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import {
    ArrowLeft,
    History,
    FileText,
    Building2,
    User,
    Calendar,
    CheckCircle2,
    Clock,
    AlertCircle,
    XCircle,
    MessageSquare,
    Wallet,
    ArrowRight,
} from 'lucide-react';

export default function HistoryShow({ spj, histories = [] }) {
    const formatCurrency = (val) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(val || 0);
    };

    const formatDateTime = (dateStr) => {
        if (!dateStr) return '-';
        try {
            const d = new Date(dateStr);
            return new Intl.DateTimeFormat('id-ID', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            }).format(d);
        } catch {
            return dateStr;
        }
    };

    const statusBadge = (status) => {
        switch (status) {
            case 'Disetujui':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3" />
                        Disetujui
                    </span>
                );
            case 'Dikoreksi':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                        <AlertCircle className="w-3 h-3" />
                        Dikoreksi
                    </span>
                );
            case 'Ditolak':
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                        <XCircle className="w-3 h-3" />
                        Ditolak
                    </span>
                );
            case 'Dikirim':
            default:
                return (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-[#2a4574] border border-blue-200">
                        <Clock className="w-3 h-3" />
                        {status || 'Dikirim'}
                    </span>
                );
        }
    };

    const getActionBadgeColor = (action) => {
        switch (action) {
            case 'Create':
                return 'bg-emerald-500 text-white';
            case 'Update':
                return 'bg-amber-500 text-white';
            case 'Approve':
                return 'bg-[#2a4574] text-white';
            case 'Reject':
                return 'bg-rose-500 text-white';
            default:
                return 'bg-blue-600 text-white';
        }
    };

    return (
        <AuthenticatedLayout title="Detail Riwayat SPJ">
            <Head title={`Riwayat SPJ - ${spj.id}`} />

            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center gap-3">
                    <Link
                        href="/spj-history"
                        className="inline-flex items-center justify-center w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-100 transition-colors shadow-2xs"
                        title="Kembali ke Riwayat SPJ"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Link>
                    <div>
                        <div className="flex items-center gap-2.5">
                            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                                Kronologi & Riwayat SPJ
                            </h1>
                            <span className="text-xs font-bold font-mono px-2.5 py-0.5 rounded-lg bg-blue-50 text-[#2a4574] border border-blue-200">
                                {spj.id}
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            Rekam jejak setiap perubahan status dan aksi yang dilakukan pengguna
                        </p>
                    </div>
                </div>

                {/* Summary Info Card */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 shadow-xs">
                    <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3 mb-4">
                        <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-[#2a4574]" />
                            <span>Informasi SPJ</span>
                        </h2>
                        <div>{statusBadge(spj.status)}</div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="bg-slate-50 dark:bg-slate-800/70 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                            <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                                Bidang
                            </span>
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                                <Building2 className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                                {spj.bidang || '-'}
                            </span>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-800/70 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                            <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                                PPTK
                            </span>
                            <span className="text-xs font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-1.5 truncate">
                                <User className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                                {spj.pptk || '-'}
                            </span>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-800/70 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                            <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                                Nilai Belanja
                            </span>
                            <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                                <Wallet className="w-3.5 h-3.5 text-emerald-600" />
                                {formatCurrency(spj.nilai)}
                            </span>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-800/70 p-3 rounded-xl border border-slate-100 dark:border-slate-700 sm:col-span-2 lg:col-span-3">
                            <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
                                Kegiatan Belanja
                            </span>
                            <span className="text-xs font-medium text-slate-800 dark:text-slate-100">
                                {spj.kegiatan || '-'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Timeline Card */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2a4574] shrink-0">
                            <History className="w-4 h-4" />
                        </div>
                        <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                            Riwayat ({histories.length} Aktivitas)
                        </h2>
                    </div>

                    <div className="p-6">
                        {histories.length > 0 ? (
                            <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-2.5 sm:before:left-3.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                                {histories.map((h, idx) => (
                                    <div key={h.id || idx} className="relative group">
                                        {/* Dot / Number Pill */}
                                        <div
                                            className={`absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shadow-xs ${getActionBadgeColor(
                                                h.aksi
                                            )}`}
                                        >
                                            {idx + 1}
                                        </div>

                                        {/* Timeline Content Box */}
                                        <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 dark:border-slate-700/80 hover:bg-white dark:bg-slate-900 hover:border-slate-300 transition-all">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs font-bold text-slate-800 dark:text-slate-100">
                                                        {h.aksi}
                                                    </span>
                                                    <span className="text-slate-400 dark:text-slate-500">•</span>
                                                    <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                                                        {h.actor?.name || 'Sistem'}
                                                    </span>
                                                    <span className="px-1.5 py-0.2 rounded text-[10px] font-semibold bg-slate-200 text-slate-700 dark:text-slate-300">
                                                        {h.actor_role}
                                                    </span>
                                                </div>

                                                <span className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1">
                                                    <Clock className="w-3 h-3" />
                                                    <span>{formatDateTime(h.created_at)}</span>
                                                </span>
                                            </div>

                                            {/* Status Transition */}
                                            <div className="flex items-center gap-2 my-2 text-xs">
                                                <span className="px-2 py-0.5 rounded-md font-semibold bg-slate-200 text-slate-700 dark:text-slate-300">
                                                    {h.status_sebelum || '-'}
                                                </span>
                                                <ArrowRight className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                                                <span className="px-2 py-0.5 rounded-md font-semibold bg-blue-50 text-[#2a4574] border border-blue-200">
                                                    {h.status_sesudah || '-'}
                                                </span>
                                            </div>

                                            {/* Keterangan */}
                                            {h.keterangan && (
                                                <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-slate-700/60 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-1.5">
                                                    <MessageSquare className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0 mt-0.5" />
                                                    <span>{h.keterangan}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-8 text-center text-slate-400 dark:text-slate-500 text-xs">
                                Belum ada riwayat aktivitas tercatat untuk SPJ ini.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
