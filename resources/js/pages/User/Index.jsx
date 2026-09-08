import React, { useState, useMemo } from 'react';
import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import TablePagination from '@/components/TablePagination';
import {
    Users,
    UserPlus,
    Search,
    Shield,
    Building2,
    Calendar,
    Mail,
    IdCard,
} from 'lucide-react';
import { getInitials } from '@/lib/utils';

export default function UserIndex({ user = [] }) {
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const filteredUsers = useMemo(() => {
        return user.filter((u) => {
            const q = search.toLowerCase();
            return (
                !search ||
                (u.name && u.name.toLowerCase().includes(q)) ||
                (u.email && u.email.toLowerCase().includes(q)) ||
                (u.nip && u.nip.toLowerCase().includes(q)) ||
                (u.bidang && u.bidang.toLowerCase().includes(q))
            );
        });
    }, [user, search]);

    const paginatedUsers = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredUsers.slice(start, start + pageSize);
    }, [filteredUsers, currentPage, pageSize]);

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

    return (
        <AuthenticatedLayout title="Manajemen User">
            <Head title="Manajemen User" />

            <div className="space-y-5">
                {/* Header */}
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                            Manajemen Akun Pengguna
                        </h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            Daftar seluruh pengguna sistem E-SPJ BKPSDM Buleleng
                        </p>
                    </div>

                    <Link
                        href="/register"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-linear-to-r from-[#2a4574] via-[#3b5a97] to-[#4c6fc1] text-white hover:opacity-95 transition-opacity shadow-xs self-start sm:self-auto"
                    >
                        <UserPlus className="w-3.5 h-3.5" />
                        <span>Tambah User Baru</span>
                    </Link>
                </div>

                {/* Search & Page Size Toolbar */}
                <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
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
                                placeholder="Cari nama, NIP, email, bidang..."
                                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#2a4574]/20 focus:border-[#2a4574]"
                            />
                        </div>
                    </div>

                    <div className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block">
                        Total: <b>{filteredUsers.length}</b> user
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
                            <thead className="bg-slate-50/80 dark:bg-slate-800 text-slate-600 dark:text-slate-400 uppercase tracking-wider text-[11px] font-bold border-b border-slate-200 dark:border-slate-700">
                                <tr>
                                    <th className="px-4 py-3.5 w-12 text-center">No</th>
                                    <th className="px-4 py-3.5">NIP</th>
                                    <th className="px-4 py-3.5">Nama Pengguna</th>
                                    <th className="px-4 py-3.5">Email</th>
                                    <th className="px-4 py-3.5">Bidang</th>
                                    <th className="px-4 py-3.5 text-center">Peran (Role)</th>
                                    <th className="px-4 py-3.5">Terdaftar</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                                {paginatedUsers.length > 0 ? (
                                    paginatedUsers.map((u, idx) => {
                                        const roleName =
                                            u.role ||
                                            (u.role_id === 1 ? 'Keuangan' : 'Bidang');

                                        return (
                                            <tr
                                                key={u.id || idx}
                                                className="hover:bg-slate-50 dark:bg-slate-800/60 dark:hover:bg-slate-800/60 transition-colors"
                                            >
                                                <td className="px-4 py-3 text-center text-slate-400 dark:text-slate-500 font-medium">
                                                    {(currentPage - 1) * pageSize + idx + 1}
                                                </td>
                                                <td className="px-4 py-3 font-mono font-semibold text-slate-700 dark:text-slate-300">
                                                    {u.nip || '-'}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2.5">
                                                        <div className="w-7 h-7 rounded-full bg-[#2a4574]/10 dark:bg-[#2a4574]/30 text-[#2a4574] dark:text-blue-300 font-bold flex items-center justify-center text-[11px] shrink-0">
                                                            {getInitials(u.name)}
                                                        </div>
                                                        <span className="font-semibold text-slate-900 dark:text-slate-100">
                                                            {u.name}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-slate-600 dark:text-slate-300">
                                                    {u.email}
                                                </td>
                                                <td className="px-4 py-3 font-medium text-slate-700 dark:text-slate-200">
                                                    {u.bidang || '-'}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <span
                                                        className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                                                            roleName === 'Keuangan'
                                                                ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                                                                : 'bg-blue-50 dark:bg-blue-950/40 text-[#2a4574] dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                                                        }`}
                                                    >
                                                        {roleName}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-slate-500 dark:text-slate-400">
                                                    {formatDate(u.created_at)}
                                                </td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td
                                            colSpan={7}
                                            className="px-4 py-8 text-center text-slate-400 dark:text-slate-500"
                                        >
                                            Tidak ada data pengguna ditemukan.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <TablePagination
                        currentPage={currentPage}
                        totalItems={filteredUsers.length}
                        pageSize={pageSize}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
