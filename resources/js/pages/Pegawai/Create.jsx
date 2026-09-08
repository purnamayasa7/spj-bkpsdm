import React, { useState } from 'react';
import { Head, Link, useForm, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import {
    UserPlus,
    ArrowLeft,
    Save,
    CreditCard,
    User,
    Briefcase,
    Award,
    Building2,
    AlertCircle,
    CheckCircle2,
    HelpCircle,
    X,
} from 'lucide-react';

const PANGKAT_MAP = {
    'I/a': 'Juru Muda',
    'I/b': 'Juru Muda Tingkat I',
    'I/c': 'Juru',
    'I/d': 'Juru Tingkat I',
    'II/a': 'Pengatur Muda',
    'II/b': 'Pengatur Muda Tingkat I',
    'II/c': 'Pengatur',
    'II/d': 'Pengatur Tingkat I',
    'III/a': 'Penata Muda',
    'III/b': 'Penata Muda Tingkat I',
    'III/c': 'Penata',
    'III/d': 'Penata Tingkat I',
    'IV/a': 'Pembina',
    'IV/b': 'Pembina Tingkat I',
    'IV/c': 'Pembina Utama Muda',
    'IV/d': 'Pembina Utama Madya',
    'IV/e': 'Pembina Utama',
};

export default function PegawaiCreate() {
    const { data, setData, post, processing, errors } = useForm({
        nip: '',
        nama: '',
        jabatan: '',
        golongan: '',
        pangkat: '',
        bidang: '',
    });

    const [isCheckingNip, setIsCheckingNip] = useState(false);
    const [nipPrompt, setNipPrompt] = useState({
        isOpen: false,
        userData: null,
    });
    const [confirmModal, setConfirmModal] = useState(false);

    const handleGolonganChange = (val) => {
        setData((prev) => ({
            ...prev,
            golongan: val,
            pangkat: PANGKAT_MAP[val] || '',
        }));
    };

    const handlePreSubmit = async (e) => {
        e.preventDefault();
        const nip = (data.nip || '').trim();
        if (!nip) return;

        setIsCheckingNip(true);
        try {
            // Get CSRF token
            const csrfToken =
                document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '';

            const res = await fetch('/keuangan/pegawai/check-nip-user', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken,
                    Accept: 'application/json',
                },
                body: JSON.stringify({ nip }),
            });

            const result = await res.json();
            setIsCheckingNip(false);

            if (result.exists) {
                setNipPrompt({
                    isOpen: true,
                    userData: result.data,
                });
            } else {
                setConfirmModal(true);
            }
        } catch (err) {
            setIsCheckingNip(false);
            setConfirmModal(true);
        }
    };

    const doSubmit = () => {
        post('/keuangan/pegawai', {
            onFinish: () => {
                setNipPrompt({ isOpen: false, userData: null });
                setConfirmModal(false);
            },
        });
    };

    return (
        <AuthenticatedLayout title="Tambah Pegawai">
            <Head title="Tambah Pegawai Baru - E-SPJ BKPSDM" />

            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header Card */}
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xs border border-slate-200 dark:border-slate-700 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2a4574] to-[#4c6fc1] flex items-center justify-center text-white shadow-md shadow-blue-900/10">
                            <UserPlus className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                                Tambah Pegawai Baru
                            </h1>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                Input data aparatur sipil negara ke dalam master pegawai BKPSDM
                            </p>
                        </div>
                    </div>

                    <Link
                        href="/keuangan/pegawai"
                        className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors shadow-2xs self-start sm:self-auto"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Kembali
                    </Link>
                </div>

                {/* Form Card */}
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xs border border-slate-200 dark:border-slate-700 p-6 sm:p-8">
                    <form onSubmit={handlePreSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* NIP */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                                    <CreditCard className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                                    NIP Pegawai <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    maxLength={18}
                                    required
                                    placeholder="Contoh: 198501012010011001"
                                    value={data.nip}
                                    onChange={(e) => setData('nip', e.target.value)}
                                    className={`w-full text-sm rounded-lg border px-3.5 py-2.5 font-mono text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-[#2a4574]/20 focus:border-[#2a4574] ${
                                        errors.nip ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 dark:border-slate-700'
                                    }`}
                                />
                                {errors.nip && (
                                    <p className="text-xs text-rose-500">{errors.nip}</p>
                                )}
                            </div>

                            {/* Nama */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                                    <User className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                                    Nama Lengkap Beserta Gelar <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Masukkan nama lengkap beserta gelar"
                                    value={data.nama}
                                    onChange={(e) => setData('nama', e.target.value)}
                                    className={`w-full text-sm rounded-lg border px-3.5 py-2.5 text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-[#2a4574]/20 focus:border-[#2a4574] ${
                                        errors.nama ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 dark:border-slate-700'
                                    }`}
                                />
                                {errors.nama && (
                                    <p className="text-xs text-rose-500">{errors.nama}</p>
                                )}
                            </div>

                            {/* Jabatan */}
                            <div className="md:col-span-2 space-y-1.5">
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                                    <Briefcase className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                                    Jabatan <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Masukkan jabatan lengkap"
                                    value={data.jabatan}
                                    onChange={(e) => setData('jabatan', e.target.value)}
                                    className={`w-full text-sm rounded-lg border px-3.5 py-2.5 text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-[#2a4574]/20 focus:border-[#2a4574] ${
                                        errors.jabatan ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 dark:border-slate-700'
                                    }`}
                                />
                                {errors.jabatan && (
                                    <p className="text-xs text-rose-500">{errors.jabatan}</p>
                                )}
                            </div>

                            {/* Golongan */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                                    <Award className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                                    Golongan <span className="text-rose-500">*</span>
                                </label>
                                <select
                                    required
                                    value={data.golongan}
                                    onChange={(e) => handleGolonganChange(e.target.value)}
                                    className={`w-full text-sm rounded-lg border px-3.5 py-2.5 text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-[#2a4574]/20 focus:border-[#2a4574] ${
                                        errors.golongan ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 dark:border-slate-700'
                                    }`}
                                >
                                    <option value="">-- Pilih Golongan --</option>
                                    {Object.keys(PANGKAT_MAP).map((gol) => (
                                        <option key={gol} value={gol}>
                                            {gol}
                                        </option>
                                    ))}
                                </select>
                                {errors.golongan && (
                                    <p className="text-xs text-rose-500">{errors.golongan}</p>
                                )}
                            </div>

                            {/* Pangkat (Auto) */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                                    <Award className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                                    Pangkat (Otomatis dari Golongan)
                                </label>
                                <input
                                    type="text"
                                    readOnly
                                    placeholder="Pangkat terisi otomatis"
                                    value={data.pangkat}
                                    className="w-full text-sm rounded-lg border border-slate-200 dark:border-slate-700 px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 cursor-not-allowed"
                                />
                            </div>

                            {/* Bidang */}
                            <div className="md:col-span-2 space-y-1.5">
                                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                                    <Building2 className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                                    Bidang Penempatan <span className="text-rose-500">*</span>
                                </label>
                                <select
                                    required
                                    value={data.bidang}
                                    onChange={(e) => setData('bidang', e.target.value)}
                                    className={`w-full text-sm rounded-lg border px-3.5 py-2.5 text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-[#2a4574]/20 focus:border-[#2a4574] ${
                                        errors.bidang ? 'border-rose-400 bg-rose-50/20' : 'border-slate-200 dark:border-slate-700'
                                    }`}
                                >
                                    <option value="">-- Pilih Bidang --</option>
                                    <option value="PKA">PKA</option>
                                    <option value="PKAP">PKAP</option>
                                    <option value="PPI">PPI</option>
                                    <option value="MP">MP</option>
                                    <option value="Sekretariat">Sekretariat</option>
                                </select>
                                {errors.bidang && (
                                    <p className="text-xs text-rose-500">{errors.bidang}</p>
                                )}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
                            <Link
                                href="/keuangan/pegawai"
                                className="px-5 py-2.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:bg-slate-700 rounded-lg transition-colors"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={processing || isCheckingNip}
                                className="inline-flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-[#2a4574] hover:bg-[#22385e] rounded-lg shadow-sm transition-colors disabled:opacity-50"
                            >
                                <Save className="w-4 h-4" />
                                {isCheckingNip
                                    ? 'Memeriksa NIP...'
                                    : processing
                                    ? 'Menyimpan...'
                                    : 'Daftar Pegawai'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Modal: NIP User Ditemukan */}
            {nipPrompt.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
                        <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3">
                            <AlertCircle className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-center text-base mb-1">
                            NIP Sudah Terdaftar pada Data User!
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 text-center mb-4">
                            User dengan NIP ini sudah ada di sistem. Sistem akan otomatis menghubungkan akun user tersebut dengan data pegawai baru ini.
                        </p>

                        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3.5 mb-5 text-xs space-y-1.5 border border-slate-200 dark:border-slate-700/60">
                            <div>
                                <span className="text-slate-400 dark:text-slate-500">NIP:</span>{' '}
                                <strong className="text-slate-800 dark:text-slate-100 font-mono">{nipPrompt.userData?.nip}</strong>
                            </div>
                            <div>
                                <span className="text-slate-400 dark:text-slate-500">Nama Akun:</span>{' '}
                                <strong className="text-slate-800 dark:text-slate-100">{nipPrompt.userData?.nama}</strong>
                            </div>
                            <div>
                                <span className="text-slate-400 dark:text-slate-500">Bidang Akun:</span>{' '}
                                <strong className="text-slate-800 dark:text-slate-100">{nipPrompt.userData?.bidang}</strong>
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setNipPrompt({ isOpen: false, userData: null })}
                                className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:bg-slate-700 rounded-lg transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                type="button"
                                onClick={doSubmit}
                                disabled={processing}
                                className="px-4 py-2 text-xs font-medium text-white bg-[#2a4574] hover:bg-[#22385e] rounded-lg shadow-sm transition-colors"
                            >
                                {processing ? 'Menyimpan...' : 'Lanjutkan Simpan'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal: Konfirmasi Simpan Normal */}
            {confirmModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-sm w-full p-6 shadow-2xl text-center animate-in fade-in zoom-in duration-200">
                        <div className="w-12 h-12 rounded-full bg-blue-50 text-[#2a4574] flex items-center justify-center mx-auto mb-3">
                            <HelpCircle className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-base mb-1">
                            Simpan Data Pegawai?
                        </h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-5">
                            Pastikan data pegawai <strong>{data.nama}</strong> sudah sesuai sebelum disimpan ke sistem.
                        </p>

                        <div className="flex items-center justify-center gap-3">
                            <button
                                type="button"
                                onClick={() => setConfirmModal(false)}
                                className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:bg-slate-700 rounded-lg transition-colors"
                            >
                                Periksa Kembali
                            </button>
                            <button
                                type="button"
                                onClick={doSubmit}
                                disabled={processing}
                                className="px-4 py-2 text-xs font-medium text-white bg-[#2a4574] hover:bg-[#22385e] rounded-lg shadow-sm transition-colors"
                            >
                                {processing ? 'Menyimpan...' : 'Ya, Simpan'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
