import React, { useState, useMemo } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import TablePagination from '@/components/TablePagination';
import {
    Users,
    UserPlus,
    UserCheck,
    UserX,
    Search,
    Edit,
    Trash2,
    Building2,
    Shield,
    BadgeCheck,
    X,
    AlertCircle,
    CheckCircle2,
    Briefcase,
} from 'lucide-react';

export default function PegawaiIndex({ pegawais = [], unassignedUsers = [] }) {
    const [search, setSearch] = useState('');
    const [bidangFilter, setBidangFilter] = useState('Semua');
    const [statusFilter, setStatusFilter] = useState('Semua');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // Modal state for Assign User
    const [assignModal, setAssignModal] = useState({
        isOpen: false,
        pegawai: null,
        userId: '',
        loading: false,
    });

    // Modal state for Unassign User
    const [unassignModal, setUnassignModal] = useState({
        isOpen: false,
        pegawai: null,
        loading: false,
    });

    // Modal state for Delete Pegawai
    const [deleteModal, setDeleteModal] = useState({
        isOpen: false,
        pegawai: null,
        loading: false,
    });

    // Filter logic
    const filteredPegawais = useMemo(() => {
        return pegawais.filter((item) => {
            const matchBidang =
                bidangFilter === 'Semua' || item.bidang === bidangFilter;

            const matchStatus =
                statusFilter === 'Semua' ||
                (statusFilter === 'Terhubung' && item.user) ||
                (statusFilter === 'Belum' && !item.user);

            const q = search.toLowerCase();
            const matchSearch =
                !search ||
                (item.nama && item.nama.toLowerCase().includes(q)) ||
                (item.nip && item.nip.toLowerCase().includes(q)) ||
                (item.jabatan && item.jabatan.toLowerCase().includes(q)) ||
                (item.golongan && item.golongan.toLowerCase().includes(q)) ||
                (item.pangkat && item.pangkat.toLowerCase().includes(q)) ||
                (item.bidang && item.bidang.toLowerCase().includes(q));

            return matchBidang && matchStatus && matchSearch;
        });
    }, [pegawais, search, bidangFilter, statusFilter]);

    const totalPages = Math.ceil(filteredPegawais.length / pageSize) || 1;
    const paginatedPegawais = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredPegawais.slice(start, start + pageSize);
    }, [filteredPegawais, currentPage, pageSize]);

    // Handle Assign Submit
    const handleAssignSubmit = (e) => {
        e.preventDefault();
        if (!assignModal.userId) return;

        setAssignModal((prev) => ({ ...prev, loading: true }));
        router.post(
            '/keuangan/pegawai/assign-user',
            {
                pegawai_id: assignModal.pegawai.id,
                user_id: assignModal.userId,
            },
            {
                onSuccess: () => {
                    setAssignModal({
                        isOpen: false,
                        pegawai: null,
                        userId: '',
                        loading: false,
                    });
                },
                onError: () => {
                    setAssignModal((prev) => ({ ...prev, loading: false }));
                },
            }
        );
    };

    // Handle Unassign Submit
    const handleUnassignSubmit = (e) => {
        e.preventDefault();
        setUnassignModal((prev) => ({ ...prev, loading: true }));
        router.post(
            '/keuangan/pegawai/unassign-user',
            {
                pegawai_id: unassignModal.pegawai.id,
            },
            {
                onSuccess: () => {
                    setUnassignModal({
                        isOpen: false,
                        pegawai: null,
                        loading: false,
                    });
                },
                onError: () => {
                    setUnassignModal((prev) => ({ ...prev, loading: false }));
                },
            }
        );
    };

    // Handle Delete Submit
    const handleDeleteSubmit = (e) => {
        e.preventDefault();
        setDeleteModal((prev) => ({ ...prev, loading: true }));
        router.delete(`/keuangan/pegawai/${deleteModal.pegawai.id}`, {
            onSuccess: () => {
                setDeleteModal({
                    isOpen: false,
                    pegawai: null,
                    loading: false,
                });
            },
            onError: () => {
                setDeleteModal((prev) => ({ ...prev, loading: false }));
            },
        });
    };

    return (
        <AuthenticatedLayout title="Data Pegawai">
            <Head title="Master Data Pegawai - E-SPJ BKPSDM" />

            <div className="space-y-6">
                {/* Header Card */}
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xs border border-slate-200 dark:border-slate-700 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2a4574] to-[#4c6fc1] flex items-center justify-center text-white shadow-md shadow-blue-900/10">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                                Master Data Pegawai
                            </h1>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Kelola daftar data aparatur sipil negara & integrasi akun pengguna BKPSDM
                            </p>
                        </div>
                    </div>

                    <Link
                        href="/keuangan/pegawai/create"
                        className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-[#2a4574] hover:bg-[#22385e] rounded-lg shadow-sm transition-colors self-start md:self-auto"
                    >
                        <UserPlus className="w-4 h-4" />
                        Tambah Pegawai
                    </Link>
                </div>

                {/* Filter Toolbar */}
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xs border border-slate-200 dark:border-slate-700 p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-3 items-center">
                        <div className="md:col-span-5 relative">
                            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400 dark:text-slate-500" />
                            <input
                                type="text"
                                placeholder="Cari NIP, Nama, Jabatan, Golongan..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-700 pl-9 pr-3 py-2 text-slate-700 dark:text-slate-300 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#2a4574]/20 focus:border-[#2a4574] bg-white dark:bg-slate-900"
                            />
                        </div>

                        <div className="md:col-span-4">
                            <select
                                value={bidangFilter}
                                onChange={(e) => {
                                    setBidangFilter(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2 text-slate-700 dark:text-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#2a4574]/20 focus:border-[#2a4574] bg-white dark:bg-slate-900"
                            >
                                <option value="Semua">Semua Bidang</option>
                                <option value="PKA">PKA</option>
                                <option value="PKAP">PKAP</option>
                                <option value="PPI">PPI</option>
                                <option value="MP">MP</option>
                                <option value="Sekretariat">Sekretariat</option>
                            </select>
                        </div>

                        <div className="md:col-span-3">
                            <select
                                value={statusFilter}
                                onChange={(e) => {
                                    setStatusFilter(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-full text-xs rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2 text-slate-700 dark:text-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#2a4574]/20 focus:border-[#2a4574] bg-white dark:bg-slate-900"
                            >
                                <option value="Semua">Semua Status Akun</option>
                                <option value="Terhubung">Akun Terhubung</option>
                                <option value="Belum">Belum Terhubung</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Table Card */}
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xs border border-slate-200 dark:border-slate-700 overflow-hidden">
                    {/* Top Toolbar */}
                    <div className="p-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800/50">
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

                        <div className="text-xs text-slate-500 dark:text-slate-400">
                            Total: <strong className="text-slate-700 dark:text-slate-300">{filteredPegawais.length}</strong> pegawai
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-slate-600 dark:text-slate-300">
                            <thead className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                                <tr>
                                    <th scope="col" className="px-5 py-3 w-48">
                                        NIP
                                    </th>
                                    <th scope="col" className="px-5 py-3">
                                        Nama Pegawai & Jabatan
                                    </th>
                                    <th scope="col" className="px-5 py-3 w-48">
                                        Pangkat / Gol.
                                    </th>
                                    <th scope="col" className="px-5 py-3 w-36">
                                        Bidang
                                    </th>
                                    <th scope="col" className="px-5 py-3 w-40 text-center">
                                        Status Akun
                                    </th>
                                    <th scope="col" className="px-5 py-3 w-36 text-center">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                                {paginatedPegawais.length > 0 ? (
                                    paginatedPegawais.map((p) => (
                                        <tr key={p.id} className="hover:bg-slate-50 dark:bg-slate-800/75 transition-colors">
                                            <td className="px-5 py-3.5 font-mono text-xs font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap">
                                                {p.nip}
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <div className="font-semibold text-slate-900 dark:text-slate-100">
                                                    {p.nama}
                                                </div>
                                                <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                                                    <Briefcase className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                                                    {p.jabatan}
                                                </div>
                                            </td>
                                            <td className="px-5 py-3.5 text-xs text-slate-700 dark:text-slate-300">
                                                <div className="font-medium text-slate-800 dark:text-slate-100">
                                                    {p.pangkat || '-'}
                                                </div>
                                                <div className="text-slate-500 dark:text-slate-400 mt-0.5">
                                                    Gol. {p.golongan || '-'}
                                                </div>
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                                    <Building2 className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                                                    {p.bidang}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3.5 text-center">
                                                {p.user ? (
                                                    <div className="inline-flex flex-col items-center">
                                                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                            <BadgeCheck className="w-3 h-3" />
                                                            Terhubung
                                                        </span>
                                                        <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 max-w-[120px] truncate" title={p.user.email}>
                                                            {p.user.name}
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                                                        Belum Terhubung
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-5 py-3.5 text-center">
                                                <div className="flex items-center justify-center gap-1.5">
                                                    <Link
                                                        href={`/keuangan/pegawai/${p.id}/edit`}
                                                        className="p-1.5 text-amber-600 hover:text-amber-800 hover:bg-amber-50 rounded-lg transition-colors"
                                                        title="Edit Data Pegawai"
                                                    >
                                                        <Edit className="w-4 h-4" />
                                                    </Link>

                                                    {!p.user ? (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setAssignModal({
                                                                    isOpen: true,
                                                                    pegawai: p,
                                                                    userId: '',
                                                                    loading: false,
                                                                })
                                                            }
                                                            className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                                                            title="Hubungkan User ke Pegawai"
                                                        >
                                                            <UserCheck className="w-4 h-4" />
                                                        </button>
                                                    ) : (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                setUnassignModal({
                                                                    isOpen: true,
                                                                    pegawai: p,
                                                                    loading: false,
                                                                })
                                                            }
                                                            className="p-1.5 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded-lg transition-colors"
                                                            title="Lepas Hubungan Akun User"
                                                        >
                                                            <UserX className="w-4 h-4" />
                                                        </button>
                                                    )}

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setDeleteModal({
                                                                isOpen: true,
                                                                pegawai: p,
                                                                loading: false,
                                                            })
                                                        }
                                                        className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                                        title="Hapus Pegawai"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-5 py-12 text-center text-slate-400 dark:text-slate-500">
                                            <div className="flex flex-col items-center justify-center">
                                                <Users className="w-10 h-10 stroke-1 text-slate-300 mb-2" />
                                                <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
                                                    Tidak ada data pegawai yang sesuai kriteria
                                                </p>
                                                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                                                    Coba ubah kata kunci pencarian atau reset filter di atas
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {filteredPegawais.length > 0 && (
                        <div className="p-4 border-t border-slate-100 dark:border-slate-700">
                            <TablePagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                                totalItems={filteredPegawais.length}
                                pageSize={pageSize}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Modal Assign User */}
            {assignModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700 mb-4">
                            <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                <UserCheck className="w-5 h-5 text-blue-600" />
                                Hubungkan User ke Pegawai
                            </h3>
                            <button
                                type="button"
                                onClick={() =>
                                    setAssignModal({
                                        isOpen: false,
                                        pegawai: null,
                                        userId: '',
                                        loading: false,
                                    })
                                }
                                className="text-slate-400 hover:text-slate-600 dark:text-slate-300 p-1"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3.5 mb-4 text-xs space-y-1.5 border border-slate-200 dark:border-slate-700/60">
                            <div>
                                <span className="text-slate-400 dark:text-slate-500">Nama Pegawai:</span>{' '}
                                <strong className="text-slate-800 dark:text-slate-100">{assignModal.pegawai?.nama}</strong>
                            </div>
                            <div>
                                <span className="text-slate-400 dark:text-slate-500">NIP:</span>{' '}
                                <strong className="text-slate-800 dark:text-slate-100">{assignModal.pegawai?.nip}</strong>
                            </div>
                            <div>
                                <span className="text-slate-400 dark:text-slate-500">Bidang:</span>{' '}
                                <strong className="text-slate-800 dark:text-slate-100">{assignModal.pegawai?.bidang}</strong>
                            </div>
                        </div>

                        <form onSubmit={handleAssignSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
                                    Pilih Akun Pengguna (User)
                                </label>
                                <select
                                    value={assignModal.userId}
                                    onChange={(e) =>
                                        setAssignModal((prev) => ({
                                            ...prev,
                                            userId: e.target.value,
                                        }))
                                    }
                                    required
                                    className="w-full text-sm rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2 text-slate-700 dark:text-slate-300 focus:outline-hidden focus:ring-2 focus:ring-[#2a4574]/20 focus:border-[#2a4574]"
                                >
                                    <option value="">-- Pilih User Akun --</option>
                                    {unassignedUsers.map((u) => (
                                        <option key={u.id} value={u.id}>
                                            {u.name} ({u.email}) {u.nip ? `- NIP: ${u.nip}` : ''}
                                        </option>
                                    ))}
                                </select>
                                {unassignedUsers.length === 0 && (
                                    <p className="text-[11px] text-amber-600 mt-1">
                                        Tidak ada akun user bebas yang belum terhubung dengan pegawai.
                                    </p>
                                )}
                            </div>

                            <div className="flex items-center justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() =>
                                        setAssignModal({
                                            isOpen: false,
                                            pegawai: null,
                                            userId: '',
                                            loading: false,
                                        })
                                    }
                                    className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:bg-slate-700 rounded-lg transition-colors"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={!assignModal.userId || assignModal.loading}
                                    className="px-4 py-2 text-xs font-medium text-white bg-[#2a4574] hover:bg-[#22385e] rounded-lg shadow-sm transition-colors disabled:opacity-50"
                                >
                                    {assignModal.loading ? 'Menyimpan...' : 'Hubungkan User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Unassign User */}
            {unassignModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-6 shadow-2xl text-center animate-in fade-in zoom-in duration-200">
                        <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-3">
                            <UserX className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base mb-1">
                            Lepas Hubungan Akun?
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                            Apakah Anda yakin ingin melepas akun pengguna dari pegawai{' '}
                            <strong>{unassignModal.pegawai?.nama}</strong>?
                        </p>

                        <div className="flex items-center justify-center gap-3">
                            <button
                                type="button"
                                onClick={() =>
                                    setUnassignModal({
                                        isOpen: false,
                                        pegawai: null,
                                        loading: false,
                                    })
                                }
                                className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:bg-slate-700 rounded-lg transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={handleUnassignSubmit}
                                disabled={unassignModal.loading}
                                className="px-4 py-2 text-xs font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm transition-colors disabled:opacity-50"
                            >
                                {unassignModal.loading ? 'Memproses...' : 'Ya, Lepas Akun'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal Delete Pegawai */}
            {deleteModal.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-6 shadow-2xl text-center animate-in fade-in zoom-in duration-200">
                        <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto mb-3">
                            <Trash2 className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base mb-1">
                            Hapus Data Pegawai?
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                            Data pegawai <strong>{deleteModal.pegawai?.nama}</strong> (NIP: {deleteModal.pegawai?.nip}) akan dihapus secara permanen dari sistem.
                        </p>

                        <div className="flex items-center justify-center gap-3">
                            <button
                                type="button"
                                onClick={() =>
                                    setDeleteModal({
                                        isOpen: false,
                                        pegawai: null,
                                        loading: false,
                                    })
                                }
                                className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:bg-slate-700 rounded-lg transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={handleDeleteSubmit}
                                disabled={deleteModal.loading}
                                className="px-4 py-2 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-colors disabled:opacity-50"
                            >
                                {deleteModal.loading ? 'Menghapus...' : 'Ya, Hapus'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
