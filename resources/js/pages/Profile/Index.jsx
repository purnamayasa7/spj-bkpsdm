import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import {
    User,
    Mail,
    Building2,
    Save,
    KeyRound,
    AlertCircle,
    CheckCircle2,
    IdCard,
} from 'lucide-react';
import { getInitials } from '@/lib/utils';

export default function ProfileIndex() {
    const { auth, flash, errors: pageErrors } = usePage().props;
    const user = auth?.user || {};

    const [form, setForm] = useState({
        name: user.name || '',
        email: user.email || '',
        bidang: user.bidang || 'PKA',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState(pageErrors || {});

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        router.post(`/profile/${user.id}`, form, {
            onError: (errs) => {
                setErrors(errs);
                setIsSubmitting(false);
            },
            onFinish: () => setIsSubmitting(false),
        });
    };

    return (
        <AuthenticatedLayout title="Profil Pengguna">
            <Head title="Profil Pengguna" />

            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                            Profil Akun Saya
                        </h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            Kelola informasi data diri dan pengaturan akun Anda
                        </p>
                    </div>

                    <Link
                        href="/change-password"
                        className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 text-[#2a4574] dark:text-blue-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-2xs self-start sm:self-auto"
                    >
                        <KeyRound className="w-3.5 h-3.5" />
                        <span>Ganti Password</span>
                    </Link>
                </div>

                {/* Notification Flash */}
                {flash?.success && (
                    <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{flash.success}</span>
                    </div>
                )}

                {/* Form Errors */}
                {Object.keys(errors).length > 0 && (
                    <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs space-y-1">
                        <div className="font-bold flex items-center gap-1.5">
                            <AlertCircle className="w-4 h-4" />
                            <span>Terdapat kesalahan pengisian formulir:</span>
                        </div>
                        <ul className="list-disc list-inside space-y-0.5 pl-5">
                            {Object.entries(errors).map(([k, msg]) => (
                                <li key={k}>{msg}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Profile Card */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden">
                    {/* User Identity Banner */}
                    <div className="p-6 bg-slate-50 dark:bg-slate-800/70 border-b border-slate-100 dark:border-slate-700 flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-[#2a4574] text-white flex items-center justify-center font-bold text-lg shadow-sm">
                            {getInitials(user.name)}
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">{user.name || 'Pengguna'}</h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{user.email || '-'}</p>
                            <div className="flex items-center gap-2 mt-1.5">
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-blue-50 text-[#2a4574] border border-blue-100">
                                    <Building2 className="w-3 h-3" />
                                    Bidang: {user.bidang || '-'}
                                </span>
                                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-200 text-slate-700 dark:text-slate-300">
                                    Role: {user.role || (user.role_id === 1 ? 'Keuangan' : 'Bidang')}
                                </span>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* NIP (Readonly) */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                                    <IdCard className="w-3.5 h-3.5 text-[#2a4574]" />
                                    <span>NIP (Nomor Induk Pegawai)</span>
                                </label>
                                <input
                                    type="text"
                                    value={user.nip || '-'}
                                    readOnly
                                    className="w-full px-3.5 py-2.5 bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-semibold text-slate-600 dark:text-slate-300 cursor-not-allowed"
                                />
                                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">NIP tidak dapat diubah langsung.</p>
                            </div>

                            {/* Nama Lengkap */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                                    <User className="w-3.5 h-3.5 text-[#2a4574]" />
                                    <span>Nama Lengkap <span className="text-rose-500">*</span></span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#2a4574]/20 focus:border-[#2a4574]"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                                    <Mail className="w-3.5 h-3.5 text-[#2a4574]" />
                                    <span>Alamat Email <span className="text-rose-500">*</span></span>
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#2a4574]/20 focus:border-[#2a4574]"
                                />
                            </div>

                            {/* Bidang */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                                    <Building2 className="w-3.5 h-3.5 text-[#2a4574]" />
                                    <span>Bidang / Bagian <span className="text-rose-500">*</span></span>
                                </label>
                                <select
                                    value={form.bidang}
                                    onChange={(e) => setForm({ ...form, bidang: e.target.value })}
                                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#2a4574]/20 focus:border-[#2a4574]"
                                >
                                    <option value="PKA">PKA</option>
                                    <option value="PKAP">PKAP</option>
                                    <option value="MP">MP</option>
                                    <option value="PPI">PPI</option>
                                    <option value="Sekretariat">Sekretariat</option>
                                </select>
                            </div>
                        </div>

                        <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-end">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-linear-to-r from-[#2a4574] via-[#3b5a97] to-[#4c6fc1] text-white hover:opacity-95 transition-opacity shadow-xs disabled:opacity-50"
                            >
                                <Save className="w-4 h-4" />
                                <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
