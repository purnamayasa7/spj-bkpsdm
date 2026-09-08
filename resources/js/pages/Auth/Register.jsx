import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import {
    ArrowLeft,
    UserPlus,
    User,
    Mail,
    Lock,
    Building2,
    Shield,
    IdCard,
    Save,
    AlertCircle,
    Eye,
    EyeOff,
} from 'lucide-react';

export default function Register() {
    const { errors: pageErrors } = usePage().props;

    const [form, setForm] = useState({
        nip: '',
        name: '',
        email: '',
        password: '',
        vpassword: '',
        bidang: '',
        role_id: '',
    });

    const [showPass, setShowPass] = useState(false);
    const [showVpass, setShowVpass] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState(pageErrors || {});

    const handleSubmit = (e) => {
        e.preventDefault();

        if (form.password !== form.vpassword) {
            setErrors({ vpassword: 'Verifikasi kata sandi tidak cocok.' });
            return;
        }

        setIsSubmitting(true);

        router.post('/register', form, {
            onError: (errs) => {
                setErrors(errs);
                setIsSubmitting(false);
            },
            onFinish: () => setIsSubmitting(false),
        });
    };

    return (
        <AuthenticatedLayout title="Registrasi User">
            <Head title="Registrasi User Baru" />

            <div className="max-w-2xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center gap-3">
                    <Link
                        href="/user"
                        className="inline-flex items-center justify-center w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-100 transition-colors shadow-2xs"
                        title="Kembali ke Manajemen User"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                            Registrasi Akun User Baru
                        </h1>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            Tambahkan pengguna baru untuk akses sistem E-SPJ BKPSDM
                        </p>
                    </div>
                </div>

                {/* Form Errors */}
                {Object.keys(errors).length > 0 && (
                    <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs space-y-1">
                        <div className="font-bold flex items-center gap-1.5">
                            <AlertCircle className="w-4 h-4" />
                            <span>Terdapat kesalahan pendaftaran:</span>
                        </div>
                        <ul className="list-disc list-inside space-y-0.5 pl-5">
                            {Object.entries(errors).map(([k, msg]) => (
                                <li key={k}>{msg}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Form Card */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2a4574] shrink-0">
                            <UserPlus className="w-4 h-4" />
                        </div>
                        <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">Formulir Data Pengguna</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* NIP */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                                    <IdCard className="w-3.5 h-3.5 text-[#2a4574]" />
                                    <span>NIP <span className="text-rose-500">*</span></span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    maxLength={18}
                                    value={form.nip}
                                    onChange={(e) => setForm({ ...form, nip: e.target.value })}
                                    placeholder="Masukkan 18 digit NIP"
                                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-mono font-semibold text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#2a4574]/20 focus:border-[#2a4574]"
                                />
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
                                    placeholder="Nama lengkap beserta gelar"
                                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#2a4574]/20 focus:border-[#2a4574]"
                                />
                            </div>

                            {/* Email */}
                            <div className="sm:col-span-2">
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                                    <Mail className="w-3.5 h-3.5 text-[#2a4574]" />
                                    <span>Alamat Email <span className="text-rose-500">*</span></span>
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    placeholder="contoh@bulelengkab.go.id"
                                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#2a4574]/20 focus:border-[#2a4574]"
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                                    <Lock className="w-3.5 h-3.5 text-[#2a4574]" />
                                    <span>Kata Sandi <span className="text-rose-500">*</span></span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPass ? 'text' : 'password'}
                                        required
                                        value={form.password}
                                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                                        placeholder="Minimal 6 karakter"
                                        className="w-full pl-3.5 pr-10 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#2a4574]/20 focus:border-[#2a4574]"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPass(!showPass)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:text-slate-300"
                                    >
                                        {showPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Verifikasi Password */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                                    <Lock className="w-3.5 h-3.5 text-[#2a4574]" />
                                    <span>Verifikasi Sandi <span className="text-rose-500">*</span></span>
                                </label>
                                <div className="relative">
                                    <input
                                        type={showVpass ? 'text' : 'password'}
                                        required
                                        value={form.vpassword}
                                        onChange={(e) => setForm({ ...form, vpassword: e.target.value })}
                                        placeholder="Ketik ulang password"
                                        className="w-full pl-3.5 pr-10 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#2a4574]/20 focus:border-[#2a4574]"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowVpass(!showVpass)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:text-slate-300"
                                    >
                                        {showVpass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Bidang */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                                    <Building2 className="w-3.5 h-3.5 text-[#2a4574]" />
                                    <span>Bidang / Bagian <span className="text-rose-500">*</span></span>
                                </label>
                                <select
                                    required
                                    value={form.bidang}
                                    onChange={(e) => setForm({ ...form, bidang: e.target.value })}
                                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#2a4574]/20 focus:border-[#2a4574]"
                                >
                                    <option value="">-- Pilih Bidang --</option>
                                    <option value="PKA">PKA</option>
                                    <option value="PKAP">PKAP</option>
                                    <option value="MP">MP</option>
                                    <option value="PPI">PPI</option>
                                    <option value="Sekretariat">Sekretariat</option>
                                </select>
                            </div>

                            {/* Role */}
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                                    <Shield className="w-3.5 h-3.5 text-[#2a4574]" />
                                    <span>Peran (Role) <span className="text-rose-500">*</span></span>
                                </label>
                                <select
                                    required
                                    value={form.role_id}
                                    onChange={(e) => setForm({ ...form, role_id: e.target.value })}
                                    className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#2a4574]/20 focus:border-[#2a4574]"
                                >
                                    <option value="">-- Pilih Role --</option>
                                    <option value="Keuangan">Keuangan</option>
                                    <option value="Bidang">Bidang</option>
                                </select>
                            </div>
                        </div>

                        <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-end gap-3">
                            <Link
                                href="/user"
                                className="px-4 py-2 rounded-xl text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 transition-colors shadow-2xs"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-semibold bg-linear-to-r from-[#2a4574] via-[#3b5a97] to-[#4c6fc1] text-white hover:opacity-95 transition-opacity shadow-xs disabled:opacity-50"
                            >
                                <Save className="w-3.5 h-3.5" />
                                <span>{isSubmitting ? 'Mendaftarkan...' : 'Daftarkan User'}</span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
