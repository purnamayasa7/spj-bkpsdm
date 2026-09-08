import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import {
    Database,
    Download,
    Clock,
    HardDrive,
    ShieldCheck,
    AlertCircle,
    CheckCircle2,
    Server,
    FileArchive,
} from 'lucide-react';

export default function BackupIndex({ lastBackup, lastSize, flash = {} }) {
    const [isBackingUp, setIsBackingUp] = useState(false);

    const handleBackupClick = () => {
        setIsBackingUp(true);
        // Trigger download directly via standard browser navigation
        window.location.href = '/keuangan/backup/run';
        setTimeout(() => {
            setIsBackingUp(false);
        }, 3000);
    };

    return (
        <AuthenticatedLayout title="Backup Database">
            <Head title="Backup Basis Data - E-SPJ BKPSDM" />

            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header Card */}
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xs border border-slate-200 dark:border-slate-700 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2a4574] to-[#4c6fc1] flex items-center justify-center text-white shadow-md shadow-blue-900/10">
                            <Database className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                                Backup Database Sistem
                            </h1>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Pemeliharaan rutin dan pencadangan basis data MySQL aplikasi E-SPJ
                            </p>
                        </div>
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 self-start sm:self-auto">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        Sistem Aman
                    </div>
                </div>

                {/* Flash Messages */}
                {flash?.success && (
                    <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-sm flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                        {flash.success}
                    </div>
                )}
                {flash?.error && (
                    <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-sm flex items-center gap-3">
                        <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                        {flash.error}
                    </div>
                )}

                {/* Status & Info Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xs border border-slate-200 dark:border-slate-700 p-5 flex items-center gap-4">
                        <div className="w-11 h-11 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-[#2a4574] dark:text-blue-400 flex items-center justify-center border border-blue-100 dark:border-blue-800/60 shrink-0">
                            <Clock className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">
                                Terakhir Dicadangkan
                            </span>
                            <span className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-0.5 block">
                                {lastBackup || 'Belum Pernah Dicadangkan'}
                            </span>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xs border border-slate-200 dark:border-slate-700 p-5 flex items-center gap-4">
                        <div className="w-11 h-11 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-400 flex items-center justify-center border border-indigo-100 dark:border-indigo-800/60 shrink-0">
                            <HardDrive className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">
                                Ukuran File Terakhir
                            </span>
                            <span className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-0.5 block">
                                {lastSize ? `${lastSize} KB` : '-'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Main Action Card */}
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xs border border-slate-200 dark:border-slate-700 p-6 sm:p-8">
                    <div className="flex items-start gap-4 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0">
                            <FileArchive className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                                Buat & Unduh Berkas Cadangan (.ZIP / .SQL)
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                                Proses ini akan mengekspor seluruh basis data MySQL yang mencakup data SPJ,
                                riwayat verifikasi, berkas lampiran metadata, daftar pegawai, dan akun pengguna
                                ke dalam format berkas terkompresi ZIP.
                            </p>
                        </div>
                    </div>

                    <div className="bg-blue-50/60 rounded-xl p-4 border border-blue-100 text-xs text-slate-600 dark:text-slate-300 mb-6 space-y-1.5">
                        <div className="font-semibold text-[#2a4574] flex items-center gap-1.5">
                            <Server className="w-4 h-4" />
                            Petunjuk Pemeliharaan:
                        </div>
                        <p>
                            1. Disarankan melakukan pencadangan data secara periodik (misalnya mingguan atau setiap akhir bulan).
                        </p>
                        <p>
                            2. Simpan arsip berkas hasil backup di penyimpanan lokal atau cloud yang aman.
                        </p>
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={handleBackupClick}
                            disabled={isBackingUp}
                            className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-[#2a4574] hover:bg-[#22385e] rounded-xl shadow-md shadow-blue-950/10 transition-all disabled:opacity-60 active:scale-98"
                        >
                            <Download className="w-4 h-4" />
                            {isBackingUp ? 'Menyiapkan Arsip Backup...' : 'Mulai Backup Database'}
                        </button>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
