import React, { useState, useMemo } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import TablePagination from '@/components/TablePagination';
import {
    History,
    Calendar,
    Search,
    Eye,
    CheckCircle2,
    Clock,
    AlertCircle,
    XCircle,
    Building2,
    Tag,
} from 'lucide-react';

export default function HistoryIndex({ spj = [], year = '2025' }) {
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [statusFilter, setStatusFilter] = useState('Semua');

    const handleYearChange = (e) => {
        router.get(
            '/spj-history',
            { year: e.target.value },
            { preserveState: true, preserveScroll: true }
        );
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

    const filteredSpj = useMemo(() => {
        return spj.filter((item) => {
            const matchesStatus =
                statusFilter === 'Semua' || item.status === statusFilter;

            const q = search.toLowerCase();
            const matchesSearch =
                !search ||
                (item.id && item.id.toLowerCase().includes(q)) ||
                (item.bidang && item.bidang.toLowerCase().includes(q)) ||
                (item.pptk && item.pptk.toLowerCase().includes(q)) ||
                (item.kegiatan && item.kegiatan.toLowerCase().includes(q)) ||
                (item.belanja && item.belanja.toLowerCase().includes(q));

            return matchesStatus && matchesSearch;
        });
    }, [spj, search, statusFilter]);

    const paginatedSpj = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredSpj.slice(start, start + pageSize);
    }, [filteredSpj, currentPage, pageSize]);

    return (
        <AuthenticatedLayout title="Riwayat SPJ">
            <Head title="Riwayat SPJ" />

            <div className="space-y-5">
                {/* Header Section */}
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                            Riwayat Pengajuan SPJ
                        </h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            Telusuri jejak rekam status dan kronologi seluruh pengajuan SPJ
                        </p>
                    </div>

                    <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 self-start md:self-auto">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                        <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">Tahun:</span>
                        <select
                            value={year}
                            onChange={handleYearChange}
                            className="bg-transparent text-xs font-bold text-[#2a4574] border-none focus:outline-hidden cursor-pointer"
                        >
                            <option value="2025">2025</option>
                            <option value="2026">2026</option>
                        </select>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5 text-xs text-slate-600 dark:text-slate-300">
                            <span className="font-medium">Tampilkan:</span>
                            <select
                                value={pageSize}
                                onChange={(e) => {
                                    setPageSize(Number(e.target.value));
                                    setCurrentPage(1);
                                }}
                                className="bg-transparent font-bold text-[#2a4574] border-none focus:outline-hidden cursor-pointer"
                            >
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </select>
                            <span className="font-medium">baris</span>
                        </div>

                        <div className="relative w-full sm:w-80">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                                <Search className="w-4 h-4" />
                            </div>
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setCurrentPage(1);
                                }}
                                placeholder="Cari ID, Bidang, PPTK, Kegiatan..."
                                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#2a4574]/20 focus:border-[#2a4574]"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                        {['Semua', 'Dikirim', 'Dikoreksi', 'Disetujui', 'Ditolak'].map((st) => (
                            <button
                                key={st}
                                onClick={() => {
                                    setStatusFilter(st);
                                    setCurrentPage(1);
                                }}
                                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                                    statusFilter === st
                                        ? 'bg-[#2a4574] text-white shadow-xs font-semibold'
                                        : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                                }`}
                            >
                                {st}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Table */}
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
                                            className="hover:bg-slate-50 dark:bg-slate-800/60 transition-colors"
                                        >
                                            <td className="px-4 py-3 font-mono font-bold text-[#2a4574]">
                                                {item.id}
                                            </td>
                                            <td className="px-4 py-3 font-medium text-slate-800 dark:text-slate-100">
                                                {item.bidang || '-'}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-blue-50 text-[#2a4574] border border-blue-100">
                                                    {item.jenis || '-'}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-slate-700 dark:text-slate-300 max-w-44 truncate" title={item.pptk}>
                                                {item.pptk || '-'}
                                            </td>
                                            <td className="px-4 py-3 text-slate-700 dark:text-slate-300 max-w-52 truncate" title={item.kegiatan}>
                                                {item.kegiatan || '-'}
                                            </td>
                                            <td className="px-4 py-3 font-semibold text-emerald-700 whitespace-nowrap">
                                                {formatCurrency(item.nilai)}
                                            </td>
                                            <td className="px-4 py-3 text-slate-500 dark:text-slate-400 whitespace-nowrap">
                                                {formatDate(item.tanggal_spj)}
                                            </td>
                                            <td className="px-4 py-3 text-center whitespace-nowrap">
                                                {statusBadge(item.status)}
                                            </td>
                                            <td className="px-4 py-3 text-center whitespace-nowrap">
                                                <Link
                                                    href={`/spj/${item.id}/history`}
                                                    className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-blue-50 text-[#2a4574] border border-blue-200 hover:bg-blue-100 transition-colors shadow-2xs"
                                                    title="Lihat Riwayat & Kronologi"
                                                >
                                                    <History className="w-3.5 h-3.5" />
                                                    <span>Detail Riwayat</span>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={9}
                                            className="px-4 py-8 text-center text-slate-400 dark:text-slate-500"
                                        >
                                            Tidak ada riwayat SPJ ditemukan pada periode ini.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <TablePagination
                        currentPage={currentPage}
                        totalItems={filteredSpj.length}
                        pageSize={pageSize}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
