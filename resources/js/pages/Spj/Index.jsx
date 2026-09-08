import React, { useState, useMemo, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import ExportModal from '@/components/ExportModal';
import TablePagination from '@/components/TablePagination';
import {
    Plus,
    Download,
    Search,
    Eye,
    Edit3,
    FileArchive,
    FileText,
    Calendar,
    Filter,
} from 'lucide-react';

export default function SpjIndex({ spj = [], year = '2025' }) {
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            const s = params.get('status');
            if (s) {
                const match = ['Dikirim', 'Dikoreksi', 'Disetujui', 'Ditolak'].find(
                    (st) => st.toLowerCase() === s.toLowerCase()
                );
                if (match) return match;
            }
        }
        return 'Semua';
    });
    const [exportOpen, setExportOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const handleYearChange = (e) => {
        router.get(
            '/spj',
            { year: e.target.value },
            { preserveState: true, preserveScroll: true }
        );
    };

    const statusBadges = {
        Dikirim: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        Dikoreksi: 'bg-amber-50 text-amber-700 border-amber-200',
        Disetujui: 'bg-blue-50 text-[#2a4574] border-blue-200',
        Ditolak: 'bg-rose-50 text-rose-700 border-rose-200',
    };

    // Reset ke halaman 1 jika filter berubah
    useEffect(() => {
        setCurrentPage(1);
    }, [search, statusFilter]);

    // Filter data client-side
    const filteredSpj = useMemo(() => {
        return spj.filter((item) => {
            const matchesStatus =
                statusFilter === 'Semua' || item.status === statusFilter;

            const q = search.toLowerCase();
            const matchesSearch =
                !search ||
                (item.id && item.id.toLowerCase().includes(q)) ||
                (item.pptk && item.pptk.toLowerCase().includes(q)) ||
                (item.kegiatan && item.kegiatan.toLowerCase().includes(q)) ||
                (item.belanja && item.belanja.toLowerCase().includes(q)) ||
                (item.jenis && item.jenis.toLowerCase().includes(q));

            return matchesStatus && matchesSearch;
        });
    }, [spj, search, statusFilter]);

    // Paginate filtered data
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

    const statusCounts = useMemo(() => {
        return {
            Semua: spj.length,
            Dikirim: spj.filter((s) => s.status === 'Dikirim').length,
            Dikoreksi: spj.filter((s) => s.status === 'Dikoreksi').length,
            Disetujui: spj.filter((s) => s.status === 'Disetujui').length,
            Ditolak: spj.filter((s) => s.status === 'Ditolak').length,
        };
    }, [spj]);

    return (
        <AuthenticatedLayout title="Data SPJ">
            <Head title="Data SPJ" />

            <div className="space-y-5">
                {/* Top Action Bar */}
                <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                            Data SPJ Saya
                        </h2>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            Kelola seluruh pengajuan dan riwayat SPJ
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
                                <option value="2025">2025</option>
                                <option value="2026">2026</option>
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

                        {/* Buat SPJ Button */}
                        <Link
                            href="/spj/create"
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-linear-to-r from-[#2a4574] via-[#3b5a97] to-[#4c6fc1] text-white shadow-xs hover:opacity-95 transition-opacity"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Buat SPJ</span>
                        </Link>
                    </div>
                </div>

                {/* Search, Page Size, & Status Filter Pills */}
                <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs space-y-3">
                    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
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
                            <div className="relative w-full sm:w-72">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                                    <Search className="w-4 h-4" />
                                </div>
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Cari ID, PPTK, Kegiatan..."
                                    className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#2a4574]/20 focus:border-[#2a4574]"
                                />
                            </div>
                        </div>

                        {/* Status Tabs */}
                        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
                            {['Semua', 'Dikirim', 'Dikoreksi', 'Disetujui', 'Ditolak'].map(
                                (st) => (
                                    <button
                                        key={st}
                                        onClick={() => setStatusFilter(st)}
                                        className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${statusFilter === st
                                                ? 'bg-[#2a4574] text-white shadow-xs'
                                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                                            }`}
                                    >
                                        <span>{st}</span>
                                        <span
                                            className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${statusFilter === st
                                                    ? 'bg-white/20 text-white'
                                                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                                                }`}
                                        >
                                            {statusCounts[st] || 0}
                                        </span>
                                    </button>
                                )
                            )}
                        </div>
                    </div>
                </div>

                {/* Table Card */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                            <thead className="bg-slate-50/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase tracking-wider text-[11px] font-bold border-b border-slate-200 dark:border-slate-700">
                                <tr>
                                    <th className="px-4 py-3.5">ID SPJ</th>
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
                                    paginatedSpj.map((item) => {
                                        const canEdit = ['Dikoreksi', 'Disetujui'].includes(
                                            item.status
                                        );

                                        return (
                                            <tr
                                                key={item.id}
                                                className="hover:bg-slate-50 dark:bg-slate-800/80 dark:hover:bg-slate-800/60 transition-colors"
                                            >
                                                <td className="px-4 py-3 font-semibold text-[#2a4574] dark:text-blue-400">
                                                    {item.id}
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
                                                        className={`inline-block px-2.5 py-1 rounded-full text-[11px] font-bold border ${statusBadges[item.status] ||
                                                            'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                                                            }`}
                                                    >
                                                        {item.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-center whitespace-nowrap">
                                                    <div className="inline-flex items-center gap-1.5">
                                                        {/* Detail */}
                                                        <Link
                                                            href={`/spj/${item.id}`}
                                                            className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                                                            title="Lihat Detail SPJ"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </Link>

                                                        {/* Edit */}
                                                        {canEdit ? (
                                                            <Link
                                                                href={`/spj/${item.id}/edit`}
                                                                className="p-1.5 rounded-lg text-amber-600 hover:bg-amber-50 transition-colors"
                                                                title="Edit SPJ"
                                                            >
                                                                <Edit3 className="w-4 h-4" />
                                                            </Link>
                                                        ) : (
                                                            <span
                                                                className="p-1.5 rounded-lg text-slate-300 cursor-not-allowed"
                                                                title="SPJ belum bisa diedit"
                                                            >
                                                                <Edit3 className="w-4 h-4" />
                                                            </span>
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
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={8}
                                            className="px-4 py-12 text-center text-slate-400 dark:text-slate-500"
                                        >
                                            <FileText className="w-8 h-8 mx-auto mb-2 text-slate-300 dark:text-slate-600" />
                                            <p className="font-semibold text-slate-600 dark:text-slate-400 text-sm">
                                                Tidak ada data SPJ ditemukan
                                            </p>
                                            <p className="text-xs mt-1 text-slate-500 dark:text-slate-500">
                                                Coba ubah filter status atau kata kunci pencarian Anda.
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
                        onPageSizeChange={setPageSize}
                    />
                </div>
            </div>

            {/* Export Modal */}
            <ExportModal
                isOpen={exportOpen}
                onClose={() => setExportOpen(false)}
                isKeuangan={false}
            />
        </AuthenticatedLayout>
    );
}
