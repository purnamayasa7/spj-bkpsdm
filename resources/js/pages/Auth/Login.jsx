import React, { useState } from 'react';
import { useForm, Head } from '@inertiajs/react';
import GuestLayout from '@/layouts/GuestLayout';
import { User, Lock, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';

export default function Login() {
    const { data, setData, post, processing, errors, reset } = useForm({
        nip: '',
        password: '',
    });

    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/login', {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout
            title="Masuk ke Aplikasi"

        >
            <Head title="Login E-SPJ" />

            {/* General Error Banner */}
            {errors.nip && (
                <div className="mb-5 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
                    <span>{errors.nip}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Field NIP */}
                <div>
                    <label
                        htmlFor="nip"
                        className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
                    >
                        Nomor Induk Pegawai (NIP)
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                            <User className="w-4 h-4 text-[#2a4574]" />
                        </div>
                        <input
                            id="nip"
                            type="text"
                            name="nip"
                            value={data.nip}
                            maxLength={18}
                            onChange={(e) => setData('nip', e.target.value)}
                            placeholder="Contoh: 198501012010011001"
                            className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#2a4574]/20 focus:border-[#2a4574] transition-all"
                            required
                            autoFocus
                        />
                    </div>
                </div>

                {/* Field Password */}
                <div>
                    <div className="flex items-center justify-between mb-1.5">
                        <label
                            htmlFor="password"
                            className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                        >
                            Kata Sandi
                        </label>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
                            <Lock className="w-4 h-4 text-[#2a4574]" />
                        </div>
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            placeholder="Masukkan kata sandi..."
                            className="w-full pl-10 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:bg-white dark:focus:bg-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#2a4574]/20 focus:border-[#2a4574] transition-all"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 dark:text-slate-300"
                        >
                            {showPassword ? (
                                <EyeOff className="w-4 h-4" />
                            ) : (
                                <Eye className="w-4 h-4" />
                            )}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="text-xs text-rose-600 mt-1">{errors.password}</p>
                    )}
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full py-2.5 px-4 bg-linear-to-r from-[#2a4574] via-[#3b5a97] to-[#4c6fc1] hover:opacity-95 active:scale-98 text-white text-sm font-semibold rounded-xl shadow-md shadow-[#2a4574]/25 flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                    >
                        {processing ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Memverifikasi...</span>
                            </>
                        ) : (
                            <span>Masuk ke Akun</span>
                        )}
                    </button>
                </div>
            </form>
        </GuestLayout>
    );
}
