import React, { useState, useMemo, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import ExportModal from '@/components/ExportModal';
import TablePagination from '@/components/TablePagination';
import {
    Download,
    Search,
    Eye,
    CheckSquare,
    FileArchive,
    FileText,
    Calendar,
    CheckCircle2,
    Clock,
    FileCheck2,
} from 'lucide-react';

export default function KeuanganIndex({
    spj = [],
    year = '2026',
    isDisetujui = false,
    isDikoreksi = false,
}) {
    const [search, setSearch] = useState('');
    const [exportOpen, setExportOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const handleYearChange = (e) => {
        const targetPath = isDisetujui
            ? '/keuangan/spj/disetujui'
            : (isDikoreksi ? '/keuangan/spj/dikoreksi' : '/keuangan/spj');

        router.get(
            targetPath,
            { year: e.target.value },
            { preserveState: true, preserveScroll: true }
        );
    };

    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    // Filter data client-side
    const filteredSpj = useMemo(() => {
        return spj.filter((item) => {
            const q = search.toLowerCase();
            return (
                !search ||
                (item.id && item.id.toLowerCase().includes(q)) ||
                (item.bidang && item.bidang.toLowerCase().includes(q)) ||
                (item.pptk && item.pptk.toLowerCase().includes(q)) ||
                (item.kegiatan && item.kegiatan.toLowerCase().includes(q)) ||
                (item.belanja && item.belanja.toLowerCase().includes(q))
            );
        });
    }, [spj, search]);

    // Paginate data
    const paginatedSpj = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredSpj.slice(start, start + pageSize);
    }, [filteredSpj, currentPage, pageSize]);

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
                month: 'short',
                year: 'numeric',
            }).format(d);
        } catch {
            return dateStr;
        }
    };

    const pageTitle = isDisetujui
        ? 'Laporan SPJ Disetujui'
        : (isDikoreksi ? 'SPJ Sedang Dikoreksi' : 'Antrean Review SPJ');

    return (
        <AuthenticatedLayout title={pageTitle}>
            <Head title={pageTitle} />

            <div className="space-y-5">
                {/* Top Action Bar */}
                <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 dark:text-slate-100 tracking-tight">
                                {pageTitle}
                            </h2>
                            <span
                                className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                    isDisetujui
                                        ? 'bg-blue-50 text-[#2a4574] border border-blue-200'
                                        : (isDikoreksi
                                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200')
                                }`}
                            >
                                {isDisetujui ? 'Arsip Disetujui' : (isDikoreksi ? 'Menunggu Perbaikan Bidang' : 'Antrean Masuk')}
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            {isDisetujui
                                ? 'Daftar seluruh SPJ yang telah diverifikasi dan disetujui'
                                : (isDikoreksi
                                    ? 'Daftar SPJ yang sedang dalam proses perbaikan/revisi oleh bidang terkait'
                                    : 'Daftar SPJ yang diajukan bidang dan siap untuk diverifikasi')}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 self-stretch md:self-auto">
                        {/* Year Selector */}
                        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Tahun:</span>
                            <select
                                value={year}
                                onChange={handleYearChange}
                                className="bg-transparent text-xs font-bold text-[#2a4574] dark:text-blue-400 border-none focus:outline-hidden cursor-pointer"
                            >
                                <option value="2026">2026</option>
                                <option value="2025">2025</option>
                            </select>
                        </div>

                        {/* Export Button */}
                        <button
                            type="button"
                            onClick={() => setExportOpen(true)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors shadow-xs"
                        >
                            <Download className="w-3.5 h-3.5" />
                            <span>Export</span>
                        </button>
                    </div>
                </div>

                {/* Search Bar & Page Size */}
                <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        {/* Page Size Selector */}
                        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-600 dark:text-slate-300">
                            <span className="font-medium">Tampilkan:</span>
                            <select
                                value={pageSize}
                                onChange={(e) => {
                                    setPageSize(Number(e.target.value));
                                    setCurrentPage(1);
                                }}
                                className="bg-transparent font-bold text-[#2a4574] dark:text-blue-400 border-none focus:outline-hidden cursor-pointer"
                            >
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </select>
                            <span className="font-medium">baris</span>
                        </div>

                        {/* Search Input */}
                        <div className="relative w-full sm:w-80">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                                <Search className="w-4 h-4" />
                            </div>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari ID, Bidang, PPTK, Kegiatan..."
                                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#2a4574]/20 focus:border-[#2a4574]"
                            />
                        </div>
                    </div>

                    <div className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                        Total: <b>{filteredSpj.length}</b> data
                    </div>
                </div>

                {/* Table Card */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                            <thead className="bg-slate-50/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase tracking-wider text-[11px] font-bold border-b border-slate-200 dark:border-slate-700">
                                <tr>
                                    <th className="px-4 py-3.5">ID SPJ</th>
                                    <th className="px-4 py-3.5">Bidang</th>
                                    <th className="px-4 py-3.5">Jenis</th>
                                    <th className="px-4 py-3.5">PPTK</th>
                                    <th className="px-4 py-3.5">Kegiatan</th>
                                    <th className="px-4 py-3.5">Nilai (Rp)</th>
                                    <th className="px-4 py-3.5">Tgl SPJ</th>
                                    <th className="px-4 py-3.5 text-center">Status</th>
                                    <th className="px-4 py-3.5 text-center">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                                {paginatedSpj.length > 0 ? (
                                    paginatedSpj.map((item) => (
                                        <tr
                                            key={item.id}
                                            className="hover:bg-slate-50 dark:bg-slate-800/80 dark:hover:bg-slate-800/60 transition-colors"
                                        >
                                            <td className="px-4 py-3 font-semibold text-[#2a4574] dark:text-blue-400 whitespace-nowrap">
                                                {item.id}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-700 font-semibold text-slate-700 dark:text-slate-200 text-[11px]">
                                                    {item.bidang || '-'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap">
                                                {item.jenis || '-'}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap font-medium text-slate-900 dark:text-slate-100">
                                                {item.pptk || '-'}
                                            </td>
                                            <td className="px-4 py-3 max-w-xs truncate" title={item.kegiatan}>
                                                {item.kegiatan || '-'}
                                            </td>
                                            <td className="px-4 py-3 font-semibold text-slate-900 dark:text-slate-100 whitespace-nowrap">
                                                {formatCurrency(item.nilai)}
                                            </td>
                                            <td className="px-4 py-3 whitespace-nowrap text-slate-500 dark:text-slate-400">
                                                {formatDate(item.tanggal_spj)}
                                            </td>
                                            <td className="px-4 py-3 text-center whitespace-nowrap">
                                                <span
                                                    className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                                                        item.status === 'Disetujui'
                                                            ? 'bg-blue-50 text-[#2a4574] border-blue-200'
                                                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                                    }`}
                                                >
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-center whitespace-nowrap">
                                                <div className="inline-flex items-center gap-1.5">
                                                    {isDisetujui ? (
                                                        <>
                                                            {/* Lihat */}
                                                            <Link
                                                                href={`/spj/${item.id}`}
                                                                className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                                                                title="Lihat Detail"
                                                            >
                                                                <Eye className="w-4 h-4" />
                                                            </Link>

                                                            {/* Checklist PDF */}
                                                            <a
                                                                href={`/keuangan/spj/${item.id}/checklist-pdf`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-colors"
                                                                title="Unduh Checklist Verifikasi PDF"
                                                            >
                                                                <FileCheck2 className="w-4 h-4" />
                                                            </a>
                                                        </>
                                                    ) : (
                                                        /* Review Button */
                                                        <Link
                                                            href={`/keuangan/spj/${item.id}/review`}
                                                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-linear-to-r from-[#2a4574] via-[#3b5a97] to-[#4c6fc1] text-white hover:opacity-95 transition-opacity shadow-xs"
                                                            title="Verifikasi SPJ"
                                                        >
                                                            <CheckSquare className="w-3.5 h-3.5" />
                                                            <span>Review</span>
                                                        </Link>
                                                    )}

                                                    {/* Download ZIP */}
                                                    <a
                                                        href={`/spj/${item.id}/download-zip`}
                                                        className="p-1.5 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 transition-colors"
                                                        title="Unduh Berkas ZIP"
                                                    >
                                                        <FileArchive className="w-4 h-4" />
                                                    </a>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={9}
                                            className="px-4 py-12 text-center text-slate-400 dark:text-slate-500"
                                        >
                                            <FileText className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                                            <p className="font-semibold text-slate-600 dark:text-slate-400 text-sm">
                                                {isDisetujui
                                                    ? 'Belum ada data SPJ yang disetujui pada periode ini'
                                                    : 'Tidak ada pengajuan SPJ yang menunggu review saat ini'}
                                            </p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Table Pagination Controls */}
                    <TablePagination
                        currentPage={currentPage}
                        totalItems={filteredSpj.length}
                        pageSize={pageSize}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </div>

            {/* Export Modal */}
            <ExportModal
                isOpen={exportOpen}
                onClose={() => setExportOpen(false)}
                isKeuangan={true}
            />
        </AuthenticatedLayout>
    );
}
