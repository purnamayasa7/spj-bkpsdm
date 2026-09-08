import React, { useState, useMemo } from 'react';
import { Head, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import TablePagination from '@/components/TablePagination';
import {
    Activity,
    Calendar,
    Filter,
    Download,
    FileText,
    FileSpreadsheet,
    Search,
    User,
    Building2,
    Clock,
    RefreshCw,
    Shield,
} from 'lucide-react';

export default function ActivityIndex({ activities = [], filters = {} }) {
    const [dateFrom, setDateFrom] = useState(filters.date_from || '');
    const [dateTo, setDateTo] = useState(filters.date_to || '');
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [showExportMenu, setShowExportMenu] = useState(false);

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        router.get(
            '/activity',
            { date_from: dateFrom, date_to: dateTo },
            { preserveState: true, preserveScroll: true }
        );
    };

    const handleReset = () => {
        setDateFrom('');
        setDateTo('');
        router.get('/activity', {}, { preserveState: true, preserveScroll: true });
    };

    const getExportUrl = (type) => {
        const params = new URLSearchParams();
        if (dateFrom) params.append('date_from', dateFrom);
        if (dateTo) params.append('date_to', dateTo);
        return `/activity/export/${type}?${params.toString()}`;
    };

    const getActionBadge = (action) => {
        const act = (action || '').toLowerCase();
        if (act.includes('tambah') || act.includes('create') || act.includes('simpan')) {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
                    {action}
                </span>
            );
        }
        if (act.includes('ubah') || act.includes('update') || act.includes('edit')) {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60">
                    {action}
                </span>
            );
        }
        if (act.includes('hapus') || act.includes('delete')) {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60">
                    {action}
                </span>
            );
        }
        if (act.includes('setuju') || act.includes('verifikasi')) {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60">
                    {action}
                </span>
            );
        }
        if (act.includes('tolak')) {
            return (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800/60">
                    {action}
                </span>
            );
        }
        return (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                {action || 'Aktivitas'}
            </span>
        );
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

    // Filtered data by client search
    const filteredActivities = useMemo(() => {
        if (!search) return activities;
        const q = search.toLowerCase();
        return activities.filter((a) => {
            const userName = (a.user?.name || '').toLowerCase();
            const bidang = (a.bidang || '').toLowerCase();
            const action = (a.action || '').toLowerCase();
            const desc = (a.description || '').toLowerCase();
            return (
                userName.includes(q) ||
                bidang.includes(q) ||
                action.includes(q) ||
                desc.includes(q)
            );
        });
    }, [activities, search]);

    const totalPages = Math.ceil(filteredActivities.length / pageSize) || 1;
    const paginatedActivities = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredActivities.slice(start, start + pageSize);
    }, [filteredActivities, currentPage, pageSize]);

    return (
        <AuthenticatedLayout title="Aktivitas User">
            <Head title="Log Aktivitas Pengguna - E-SPJ BKPSDM" />

            <div className="space-y-6">
                {/* Header Card */}
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xs border border-slate-200 dark:border-slate-700 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2a4574] to-[#4c6fc1] flex items-center justify-center text-white shadow-md shadow-blue-900/10">
                            <Activity className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                                Log Aktivitas Pengguna
                            </h1>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Catatan riwayat aktivitas operasional dan audit log dalam sistem E-SPJ
                            </p>
                        </div>
                    </div>

                    {/* Export Dropdown */}
                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setShowExportMenu(!showExportMenu)}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#2a4574] hover:bg-[#22385e] rounded-lg shadow-sm transition-colors"
                        >
                            <Download className="w-4 h-4" />
                            Export Log
                        </button>

                        {showExportMenu && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setShowExportMenu(false)}
                                />
                                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 py-1.5 z-20">
                                    <a
                                        href={getExportUrl('pdf')}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={() => setShowExportMenu(false)}
                                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:bg-slate-800 hover:text-rose-600 transition-colors"
                                    >
                                        <FileText className="w-4 h-4 text-rose-500" />
                                        Export ke PDF
                                    </a>
                                    <a
                                        href={getExportUrl('excel')}
                                        onClick={() => setShowExportMenu(false)}
                                        className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:bg-slate-800 hover:text-emerald-600 transition-colors"
                                    >
                                        <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                                        Export ke Excel
                                    </a>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Filter Form Card */}
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xs border border-slate-200 dark:border-slate-700 p-5">
                    <form onSubmit={handleFilterSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                        <div className="md:col-span-4">
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                                Dari Tanggal
                            </label>
                            <input
                                type="date"
                                value={dateFrom}
                                onChange={(e) => setDateFrom(e.target.value)}
                                className="w-full text-sm rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2 text-slate-700 dark:text-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#2a4574]/20 focus:border-[#2a4574]"
                            />
                        </div>

                        <div className="md:col-span-4">
                            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                                Sampai Tanggal
                            </label>
                            <input
                                type="date"
                                value={dateTo}
                                onChange={(e) => setDateTo(e.target.value)}
                                className="w-full text-sm rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2 text-slate-700 dark:text-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#2a4574]/20 focus:border-[#2a4574]"
                            />
                        </div>

                        <div className="md:col-span-4 flex items-center gap-2">
                            <button
                                type="submit"
                                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#2a4574] hover:bg-[#22385e] rounded-lg shadow-sm transition-colors"
                            >
                                <Filter className="w-4 h-4" />
                                Tampilkan
                            </button>
                            {(dateFrom || dateTo) && (
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="p-2 text-slate-500 hover:text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:bg-slate-700 rounded-lg transition-colors"
                                    title="Reset Filter"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Table Data Card */}
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xs border border-slate-200 dark:border-slate-700 overflow-hidden">
                    {/* Top Toolbar */}
                    <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800/50">
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-500 dark:text-slate-400">Tampilkan</span>
                            <select
                                value={pageSize}
                                onChange={(e) => {
                                    setPageSize(Number(e.target.value));
                                    setCurrentPage(1);
                                }}
                                className="text-xs rounded-md border border-slate-200 dark:border-slate-700 px-2 py-1 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:outline-hidden focus:ring-1 focus:ring-[#2a4574]"
                            >
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                                <option value={100}>100</option>
                            </select>
                            <span className="text-xs text-slate-500 dark:text-slate-400">baris</span>
                        </div>

                        <div className="relative w-full sm:w-72">
                            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400 dark:text-slate-500" />
                            <input
                                type="text"
                                placeholder="Cari aktivitas, user, deskripsi..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-700 pl-9 pr-3 py-2 text-slate-700 dark:text-slate-300 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#2a4574]/20 focus:border-[#2a4574] bg-white dark:bg-slate-900"
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-slate-600 dark:text-slate-300">
                            <thead className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                                <tr>
                                    <th scope="col" className="px-5 py-3 w-48">
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                                            Waktu
                                        </div>
                                    </th>
                                    <th scope="col" className="px-5 py-3 w-52">
                                        <div className="flex items-center gap-1.5">
                                            <User className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                                            Pengguna
                                        </div>
                                    </th>
                                    <th scope="col" className="px-5 py-3 w-36">
                                        <div className="flex items-center gap-1.5">
                                            <Building2 className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                                            Bidang
                                        </div>
                                    </th>
                                    <th scope="col" className="px-5 py-3 w-36">
                                        <div className="flex items-center gap-1.5">
                                            <Shield className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                                            Aksi
                                        </div>
                                    </th>
                                    <th scope="col" className="px-5 py-3">
                                        Deskripsi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                                {paginatedActivities.length > 0 ? (
                                    paginatedActivities.map((item) => (
                                        <tr key={item.id} className="hover:bg-slate-50 dark:bg-slate-800/75 transition-colors">
                                            <td className="px-5 py-3 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                                                {formatDateTime(item.created_at)}
                                            </td>
                                            <td className="px-5 py-3 font-medium text-slate-800 dark:text-slate-100">
                                                {item.user?.name || '-'}
                                            </td>
                                            <td className="px-5 py-3 text-xs text-slate-600 dark:text-slate-300">
                                                {item.bidang || '-'}
                                            </td>
                                            <td className="px-5 py-3">
                                                {getActionBadge(item.action)}
                                            </td>
                                            <td className="px-5 py-3 text-xs text-slate-700 dark:text-slate-300">
                                                {item.description}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-5 py-12 text-center text-slate-400 dark:text-slate-500">
                                            <div className="flex flex-col items-center justify-center">
                                                <Activity className="w-10 h-10 stroke-1 text-slate-300 mb-2" />
                                                <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                                                    {activities.length === 0
                                                        ? 'Silakan tentukan rentang tanggal dan klik Tampilkan'
                                                        : 'Tidak ada data aktivitas yang sesuai dengan pencarian'}
                                                </p>
                                                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                                                    Gunakan filter tanggal di atas untuk memuat catatan log sistem
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {filteredActivities.length > 0 && (
                        <div className="p-4 border-t border-slate-100 dark:border-slate-700">
                            <TablePagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                                totalItems={filteredActivities.length}
                                pageSize={pageSize}
                            />
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
