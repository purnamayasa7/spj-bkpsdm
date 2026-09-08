import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import {
    ArrowLeft,
    KeyRound,
    Save,
    AlertCircle,
    CheckCircle2,
    Eye,
    EyeOff,
    Lock,
} from 'lucide-react';

export default function ChangePassword() {
    const { auth, flash, errors: pageErrors } = usePage().props;
    const user = auth?.user || {};

    const [form, setForm] = useState({
        old_password: '',
        new_password: '',
        confirm_password: '',
    });

    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState(pageErrors || {});

    const handleSubmit = (e) => {
        e.preventDefault();

        if (form.confirm_password && form.new_password !== form.confirm_password) {
            setErrors({ confirm_password: 'Konfirmasi password baru tidak cocok.' });
            return;
        }

        setIsSubmitting(true);

        router.post(
            `/change-password/${user.id}`,
            {
                old_password: form.old_password,
                new_password: form.new_password,
            },
            {
                onError: (errs) => {
                    setErrors(errs);
                    setIsSubmitting(false);
                },
                onSuccess: () => {
                    setForm({
                        old_password: '',
                        new_password: '',
                        confirm_password: '',
                    });
                },
                onFinish: () => setIsSubmitting(false),
            }
        );
    };

    return (
        <AuthenticatedLayout title="Ganti Password">
            <Head title="Ganti Password" />

            <div className="max-w-xl mx-auto space-y-6">
                {/* Header Section */}
                <div className="flex items-center gap-3">
                    <Link
                        href="/profile"
                        className="inline-flex items-center justify-center w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-100 transition-colors shadow-2xs"
                        title="Kembali ke Profil"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                            Ubah Password Akun
                        </h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            Perbarui password akun Anda secara berkala untuk menjaga keamanan
                        </p>
                    </div>
                </div>

                {/* Notifications */}
                {flash?.success && (
                    <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>{flash.success}</span>
                    </div>
                )}

                {flash?.error && (
                    <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        <span>{flash.error}</span>
                    </div>
                )}

                {Object.keys(errors).length > 0 && (
                    <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs space-y-1">
                        <div className="font-bold flex items-center gap-1.5">
                            <AlertCircle className="w-4 h-4" />
                            <span>Perhatian:</span>
                        </div>
                        <ul className="list-disc list-inside space-y-0.5 pl-5">
                            {Object.entries(errors).map(([k, msg]) => (
                                <li key={k}>{msg}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Card Form */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-800/60 flex items-center justify-center text-[#2a4574] dark:text-blue-400 shrink-0">
                            <KeyRound className="w-4 h-4" />
                        </div>
                        <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">Formulir Ganti Password</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        {/* Old Password */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                                <Lock className="w-3.5 h-3.5 text-[#2a4574]" />
                                <span>Password Lama <span className="text-rose-500">*</span></span>
                            </label>
                            <div className="relative">
                                <input
                                    type={showOld ? 'text' : 'password'}
                                    required
                                    value={form.old_password}
                                    onChange={(e) =>
                                        setForm({ ...form, old_password: e.target.value })
                                    }
                                    placeholder="Masukkan password saat ini"
                                    className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#2a4574]/20 focus:border-[#2a4574]"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowOld(!showOld)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:text-slate-300"
                                >
                                    {showOld ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* New Password */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                                <KeyRound className="w-3.5 h-3.5 text-[#2a4574]" />
                                <span>Password Baru <span className="text-rose-500">*</span></span>
                            </label>
                            <div className="relative">
                                <input
                                    type={showNew ? 'text' : 'password'}
                                    required
                                    value={form.new_password}
                                    onChange={(e) =>
                                        setForm({ ...form, new_password: e.target.value })
                                    }
                                    placeholder="Minimal 6 karakter"
                                    className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#2a4574]/20 focus:border-[#2a4574]"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNew(!showNew)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:text-slate-300"
                                >
                                    {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                                <KeyRound className="w-3.5 h-3.5 text-[#2a4574]" />
                                <span>Konfirmasi Password Baru</span>
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirm ? 'text' : 'password'}
                                    value={form.confirm_password}
                                    onChange={(e) =>
                                        setForm({ ...form, confirm_password: e.target.value })
                                    }
                                    placeholder="Ketik ulang password baru"
                                    className="w-full pl-3.5 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#2a4574]/20 focus:border-[#2a4574]"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:text-slate-300"
                                >
                                    {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-end gap-3">
                            <Link
                                href="/profile"
                                className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-colors shadow-2xs"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold bg-linear-to-r from-[#2a4574] via-[#3b5a97] to-[#4c6fc1] text-white hover:opacity-95 transition-opacity shadow-xs disabled:opacity-50"
                            >
                                <Save className="w-4 h-4" />
                                <span>{isSubmitting ? 'Menyimpan...' : 'Simpan Password'}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
