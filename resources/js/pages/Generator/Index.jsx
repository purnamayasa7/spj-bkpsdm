import React, { useState, useEffect, useRef } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import {
    Printer,
    FileText,
    Receipt,
    Users,
    Compass,
    Plus,
    Trash2,
    Search,
    Building2,
    Calendar,
    Wallet,
    CheckCircle2,
    X,
    UserCheck,
    Briefcase,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Helper autocomplete input component for Pegawai
function PegawaiSearchInput({
    label,
    placeholder = 'Cari nama atau NIP pegawai...',
    value,
    nipValue,
    required = false,
    onSelect,
    onChangeText,
    inputName = '',
    inputNipName = '',
}) {
    const [query, setQuery] = useState(value || '');
    const [results, setResults] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        setQuery(value || '');
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = async (val) => {
        setQuery(val);
        if (onChangeText) onChangeText(val);

        if (!val || val.length < 2) {
            setResults([]);
            setIsOpen(false);
            return;
        }

        setLoading(true);
        try {
            const res = await fetch(`/pegawai/search?q=${encodeURIComponent(val)}`);
            if (res.ok) {
                const data = await res.json();
                setResults(data || []);
                setIsOpen(true);
            }
        } catch (err) {
            console.error('Search pegawai error:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (item) => {
        setQuery(item.nama);
        setIsOpen(false);
        if (onSelect) {
            onSelect(item);
        }
    };

    return (
        <div ref={containerRef} className="relative w-full">
            {label && (
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {label} {required && <span className="text-rose-500">*</span>}
                </label>
            )}
            <div className="relative">
                <input
                    type="text"
                    name={inputName}
                    value={query}
                    required={required}
                    onChange={(e) => handleSearch(e.target.value)}
                    onFocus={() => {
                        if (results.length > 0) setIsOpen(true);
                    }}
                    placeholder={placeholder}
                    className="w-full pl-8 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#2a4574]/20 focus:border-[#2a4574] transition-all"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
                {loading && (
                    <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
                        <div className="w-3.5 h-3.5 border-2 border-[#2a4574] border-t-transparent rounded-full animate-spin" />
                    </div>
                )}
            </div>

            {inputNipName && <input type="hidden" name={inputNipName} value={nipValue || ''} />}

            {/* Dropdown Suggestions */}
            {isOpen && results.length > 0 && (
                <div className="absolute z-50 mt-1 w-full bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-1 max-h-56 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/50 animate-in fade-in zoom-in-95 duration-100">
                    {results.map((p) => (
                        <button
                            key={p.id}
                            type="button"
                            onClick={() => handleSelect(p)}
                            className="w-full px-3 py-2 text-left hover:bg-blue-50/70 transition-colors flex items-center justify-between gap-2"
                        >
                            <div>
                                <div className="text-xs font-semibold text-slate-800 dark:text-slate-100">{p.nama}</div>
                                <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-2 mt-0.5">
                                    <span>NIP. {p.nip || '-'}</span>
                                    <span>•</span>
                                    <span>{p.jabatan || '-'}</span>
                                </div>
                            </div>
                            <span className="text-[10px] font-semibold px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-md shrink-0">
                                {p.golongan || p.pangkat || '-'}
                            </span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function GeneratorIndex() {
    const { csrf_token } = usePage().props;
    const [activeTab, setActiveTab] = useState('kuitansi');

    // CSRF Token resolution
    const csrf = csrf_token || (typeof document !== 'undefined' ? document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') : '') || '';

    // ==========================================
    // 1. STATE KUITANSI
    // ==========================================
    const [kuitansi, setKuitansi] = useState({
        nomor_rekening: '',
        kode_rekening: '5 1 02 01 01 0024',
        jenis_spj: 'GU',
        tanggal_spj: new Date().toISOString().split('T')[0],
        sumber_dana: 'DAU',
        nilai: '',
        pptk: '',
        penerima: '',
        untuk_pembayaran: '',
    });

    // ==========================================
    // 2. STATE LAMPIRAN SPD
    // ==========================================
    const todayStr = new Date().toISOString().split('T')[0];
    const [spdHeader, setSpdHeader] = useState({
        nomor_lampiran: '090/01/SPD/BKPSDM',
        tanggal_lampiran: todayStr,
        daftar_peserta: 'Kegiatan Perjalanan Dinas Koordinasi dan Konsultasi',
        tgl_penyelenggaraan: todayStr,
        kota: 'Denpasar',
        satuan_kerja: 'BKPSDM Kab. Buleleng',
        no_surat_tugas: '094/01/ST/BKPSDM/2026',
        tgl_surat_tugas: todayStr,
        tanggal_mulai: todayStr,
        tanggal_selesai: todayStr,
        lama_perjalanan: 1,
    });

    // Calculate duration in days
    useEffect(() => {
        if (spdHeader.tanggal_mulai && spdHeader.tanggal_selesai) {
            const start = new Date(spdHeader.tanggal_mulai);
            const end = new Date(spdHeader.tanggal_selesai);
            if (!isNaN(start) && !isNaN(end) && end >= start) {
                const diffTime = Math.abs(end - start);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                setSpdHeader((prev) => ({ ...prev, lama_perjalanan: diffDays }));
            }
        }
    }, [spdHeader.tanggal_mulai, spdHeader.tanggal_selesai]);

    const [spdRows, setSpdRows] = useState([
        {
            id: 1,
            nama: '',
            nip: '',
            jabatan: '',
            pangkat: '',
            tempat_kedudukan: 'Singaraja',
            tingkat_biaya: 350000,
            alat_angkut: 'Kendaraan Dinas / Umum',
            lama_hari: 1,
            keterangan: '-',
        },
    ]);

    const addSpdRow = () => {
        setSpdRows((prev) => [
            ...prev,
            {
                id: Date.now(),
                nama: '',
                nip: '',
                jabatan: '',
                pangkat: '',
                tempat_kedudukan: 'Singaraja',
                tingkat_biaya: 350000,
                alat_angkut: 'Kendaraan Dinas / Umum',
                lama_hari: spdHeader.lama_perjalanan || 1,
                keterangan: '-',
            },
        ]);
    };

    const removeSpdRow = (id) => {
        if (spdRows.length <= 1) return;
        setSpdRows((prev) => prev.filter((r) => r.id !== id));
    };

    const updateSpdRow = (id, field, val) => {
        setSpdRows((prev) =>
            prev.map((r) => (r.id === id ? { ...r, [field]: val } : r))
        );
    };

    // ==========================================
    // 3. STATE DAFTAR PENERIMAAN
    // ==========================================
    const [penerimaanHeader, setPenerimaanHeader] = useState({
        dalam_rangka: 'Perjalanan Dinas Dalam Daerah BKPSDM Buleleng',
        tanggal_mulai: todayStr,
        tanggal_selesai: todayStr,
        pptk: '',
        nip_pptk: '',
        yang_menerima: '',
        nip_penerima: '',
    });

    const [penerimaanRows, setPenerimaanRows] = useState([
        {
            id: 1,
            nama: '',
            nip: '',
            jabatan: '',
            pangkat: '',
            lama_hari: 1,
            penginapan: 0,
            uang_harian: 250000,
            uang_representasi: 0,
            transportasi: 150000,
            tiket: 0,
        },
    ]);

    const addPenerimaanRow = () => {
        setPenerimaanRows((prev) => [
            ...prev,
            {
                id: Date.now(),
                nama: '',
                nip: '',
                jabatan: '',
                pangkat: '',
                lama_hari: 1,
                penginapan: 0,
                uang_harian: 250000,
                uang_representasi: 0,
                transportasi: 150000,
                tiket: 0,
            },
        ]);
    };

    const removePenerimaanRow = (id) => {
        if (penerimaanRows.length <= 1) return;
        setPenerimaanRows((prev) => prev.filter((r) => r.id !== id));
    };

    const updatePenerimaanRow = (id, field, val) => {
        setPenerimaanRows((prev) =>
            prev.map((r) => (r.id === id ? { ...r, [field]: val } : r))
        );
    };

    // Total accumulator for Penerimaan
    const totalPenerimaan = penerimaanRows.reduce((acc, row) => {
        const sub =
            (parseInt(row.penginapan) || 0) +
            (parseInt(row.uang_harian) || 0) +
            (parseInt(row.uang_representasi) || 0) +
            (parseInt(row.transportasi) || 0) +
            (parseInt(row.tiket) || 0);
        return acc + sub;
    }, 0);

    const formatCurrency = (val) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(val || 0);
    };

    return (
        <AuthenticatedLayout title="Generator Dokumen SPJ">
            <Head title="Generator Dokumen SPJ - E-SPJ BKPSDM" />

            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header Banner */}
                <div className="bg-linear-to-r from-[#2a4574] via-[#375a98] to-[#476eb8] rounded-2xl p-6 text-white shadow-sm">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white dark:bg-slate-900/15 text-white backdrop-blur-xs mb-2">
                                <Receipt className="w-3.5 h-3.5" />
                                <span>Template Resmi BKPSDM Kabupaten Buleleng</span>
                            </span>
                            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
                                Generator Dokumen SPJ
                            </h1>
                            <p className="text-xs sm:text-sm text-blue-100 mt-1 max-w-2xl leading-relaxed">
                                Buat dan cetak langsung dokumen kelengkapan SPJ resmi format PDF.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Tabs Navigation */}
                <div className="flex border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 pt-2 rounded-xl shadow-2xs gap-2 overflow-x-auto">
                    <button
                        type="button"
                        onClick={() => setActiveTab('kuitansi')}
                        className={cn(
                            'flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer',
                            activeTab === 'kuitansi'
                                ? 'border-[#2a4574] text-[#2a4574]'
                                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-100'
                        )}
                    >
                        <Receipt className="w-4 h-4" />
                        <span>1. Kuitansi Pembayaran</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('spd')}
                        className={cn(
                            'flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer',
                            activeTab === 'spd'
                                ? 'border-[#2a4574] text-[#2a4574]'
                                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-100'
                        )}
                    >
                        <Compass className="w-4 h-4" />
                        <span>2. Lampiran SPD (Perjadin)</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('penerimaan')}
                        className={cn(
                            'flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap cursor-pointer',
                            activeTab === 'penerimaan'
                                ? 'border-[#2a4574] text-[#2a4574]'
                                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-100'
                        )}
                    >
                        <Users className="w-4 h-4" />
                        <span>3. Daftar Penerimaan</span>
                    </button>
                </div>

                {/* ========================================================= */}
                {/* TAB 1: KUITANSI PEMBAYARAN                                 */}
                {/* ========================================================= */}
                {activeTab === 'kuitansi' && (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs p-5 sm:p-6">
                        <div className="border-b border-slate-100 dark:border-slate-700 pb-4 mb-5 flex items-center justify-between">
                            <div>
                                <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                    <Receipt className="w-4 h-4 text-[#2a4574] dark:text-blue-400" />
                                    <span>Formulir Kuitansi Pembayaran</span>
                                </h2>
                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                    Masukkan rincian pembayaran untuk mencetak lembar kuitansi resmi BKPSDM Kabupaten Buleleng.
                                </p>
                            </div>
                        </div>

                        <form action="/kuitansi/preview" method="POST" target="_blank" className="space-y-4">
                            <input type="hidden" name="_token" value={csrf} />

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Jenis SPJ <span className="text-rose-500">*</span>
                                    </label>
                                    <select
                                        name="jenis_spj"
                                        value={kuitansi.jenis_spj}
                                        onChange={(e) => setKuitansi({ ...kuitansi, jenis_spj: e.target.value })}
                                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#2a4574]/20"
                                    >
                                        <option value="GU">GU</option>
                                        <option value="LS">LS</option>
                                        <option value="UP">UP</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Sumber Dana <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="sumber_dana"
                                        required
                                        placeholder="Contoh: DAU / PAD"
                                        value={kuitansi.sumber_dana}
                                        onChange={(e) => setKuitansi({ ...kuitansi, sumber_dana: e.target.value })}
                                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#2a4574]/20"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Tanggal Kuitansi <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        name="tanggal_spj"
                                        required
                                        value={kuitansi.tanggal_spj}
                                        onChange={(e) => setKuitansi({ ...kuitansi, tanggal_spj: e.target.value })}
                                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#2a4574]/20"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Nomor Rekening / Bukti
                                    </label>
                                    <input
                                        type="text"
                                        name="nomor_rekening"
                                        placeholder="Opsional, misal nomor rekening penerima"
                                        value={kuitansi.nomor_rekening}
                                        onChange={(e) => setKuitansi({ ...kuitansi, nomor_rekening: e.target.value })}
                                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#2a4574]/20"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Kode Rekening (Pisahkan Spasi) <span className="text-rose-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="kode_rekening"
                                        required
                                        placeholder="Contoh: 5 1 02 01 01 0024"
                                        value={kuitansi.kode_rekening}
                                        onChange={(e) => setKuitansi({ ...kuitansi, kode_rekening: e.target.value })}
                                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 font-mono focus:bg-white dark:focus:bg-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#2a4574]/20"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                        Jumlah Nominal (Rp) <span className="text-rose-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 dark:text-slate-500">
                                            Rp
                                        </span>
                                        <input
                                            type="number"
                                            name="nilai"
                                            required
                                            min="0"
                                            placeholder="Contoh: 1500000"
                                            value={kuitansi.nilai}
                                            onChange={(e) => setKuitansi({ ...kuitansi, nilai: e.target.value })}
                                            className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 font-medium focus:bg-white dark:focus:bg-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#2a4574]/20"
                                        />
                                    </div>
                                    {kuitansi.nilai > 0 && (
                                        <span className="text-[11px] text-blue-700 font-semibold mt-1 block">
                                            {formatCurrency(kuitansi.nilai)}
                                        </span>
                                    )}
                                </div>

                                <div>
                                    <PegawaiSearchInput
                                        label="PPTK"
                                        required={true}
                                        value={kuitansi.pptk}
                                        placeholder="Ketik nama atau pilih pegawai PPTK..."
                                        inputName="pptk"
                                        onChangeText={(txt) => setKuitansi({ ...kuitansi, pptk: txt })}
                                        onSelect={(item) => setKuitansi({ ...kuitansi, pptk: item.nama })}
                                    />
                                </div>

                                <div>
                                    <PegawaiSearchInput
                                        label="Yang Menerima / Rekanan"
                                        required={true}
                                        value={kuitansi.penerima}
                                        placeholder="Nama penerima / rekanan / pegawai..."
                                        inputName="penerima"
                                        onChangeText={(txt) => setKuitansi({ ...kuitansi, penerima: txt })}
                                        onSelect={(item) => setKuitansi({ ...kuitansi, penerima: item.nama })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                    Untuk Pembayaran <span className="text-rose-500">*</span>
                                </label>
                                <textarea
                                    name="untuk_pembayaran"
                                    required
                                    rows={3}
                                    placeholder="Uraian lengkap keperluan belanja atau pembayaran..."
                                    value={kuitansi.untuk_pembayaran}
                                    onChange={(e) => setKuitansi({ ...kuitansi, untuk_pembayaran: e.target.value })}
                                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#2a4574]/20 leading-relaxed"
                                />
                            </div>

                            <div className="flex items-center justify-end pt-4 border-t border-slate-100 dark:border-slate-700">
                                <button
                                    type="submit"
                                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-[#2a4574] text-white hover:bg-[#1f3357] transition-all shadow-sm cursor-pointer"
                                >
                                    <Printer className="w-4 h-4" />
                                    <span>Cetak Kuitansi (PDF)</span>
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* ========================================================= */}
                {/* TAB 2: LAMPIRAN SPD (PERJALANAN DINAS)                     */}
                {/* ========================================================= */}
                {activeTab === 'spd' && (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs p-5 sm:p-6 space-y-6">
                        <div className="border-b border-slate-100 dark:border-slate-700 pb-4">
                            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                <Compass className="w-4 h-4 text-[#2a4574] dark:text-blue-400" />
                                <span>Formulir Lampiran Surat Perjalanan Dinas (SPD)</span>
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                Format lampiran resmi Surat Perjalanan Dinas BKPSDM Kabupaten Buleleng lengkap dengan daftar pelaksana SPD.
                            </p>
                        </div>

                        <form action="/lampiran-spd/preview" method="POST" target="_blank" className="space-y-6">
                            <input type="hidden" name="_token" value={csrf} />

                            {/* SPD Header Data */}
                            <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4">
                                <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                                    Informasi Surat & Kegiatan
                                </h3>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                            Nomor Lampiran <span className="text-rose-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="nomor_lampiran"
                                            required
                                            value={spdHeader.nomor_lampiran}
                                            onChange={(e) => setSpdHeader({ ...spdHeader, nomor_lampiran: e.target.value })}
                                            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-[#2a4574]/20"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                            Tanggal Lampiran <span className="text-rose-500">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            name="tanggal_lampiran"
                                            required
                                            value={spdHeader.tanggal_lampiran}
                                            onChange={(e) => setSpdHeader({ ...spdHeader, tanggal_lampiran: e.target.value })}
                                            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-[#2a4574]/20"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                            Satuan Kerja <span className="text-rose-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="satuan_kerja"
                                            required
                                            value={spdHeader.satuan_kerja}
                                            onChange={(e) => setSpdHeader({ ...spdHeader, satuan_kerja: e.target.value })}
                                            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-[#2a4574]/20"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                            Daftar Peserta / Maksud Kegiatan <span className="text-rose-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="daftar_peserta"
                                            required
                                            placeholder="Nama kegiatan..."
                                            value={spdHeader.daftar_peserta}
                                            onChange={(e) => setSpdHeader({ ...spdHeader, daftar_peserta: e.target.value })}
                                            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-[#2a4574]/20"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                            Tanggal Penyelenggaraan <span className="text-rose-500">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            name="tgl_penyelenggaraan"
                                            required
                                            value={spdHeader.tgl_penyelenggaraan}
                                            onChange={(e) => setSpdHeader({ ...spdHeader, tgl_penyelenggaraan: e.target.value })}
                                            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-[#2a4574]/20"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                            Kota Tempat Penyelenggaraan <span className="text-rose-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="kota"
                                            required
                                            value={spdHeader.kota}
                                            onChange={(e) => setSpdHeader({ ...spdHeader, kota: e.target.value })}
                                            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-[#2a4574]/20"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-1">
                                    <div className="sm:col-span-2">
                                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                            Nomor Surat Tugas <span className="text-rose-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="no_surat_tugas"
                                            required
                                            value={spdHeader.no_surat_tugas}
                                            onChange={(e) => setSpdHeader({ ...spdHeader, no_surat_tugas: e.target.value })}
                                            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-[#2a4574]/20"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                            Tanggal Surat Tugas <span className="text-rose-500">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            name="tgl_surat_tugas"
                                            required
                                            value={spdHeader.tgl_surat_tugas}
                                            onChange={(e) => setSpdHeader({ ...spdHeader, tgl_surat_tugas: e.target.value })}
                                            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-[#2a4574]/20"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                            Tgl Berangkat <span className="text-rose-500">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            name="tanggal_mulai"
                                            required
                                            value={spdHeader.tanggal_mulai}
                                            onChange={(e) => setSpdHeader({ ...spdHeader, tanggal_mulai: e.target.value })}
                                            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-[#2a4574]/20"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                            Tgl Kembali <span className="text-rose-500">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            name="tanggal_selesai"
                                            required
                                            value={spdHeader.tanggal_selesai}
                                            onChange={(e) => setSpdHeader({ ...spdHeader, tanggal_selesai: e.target.value })}
                                            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-[#2a4574]/20"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Pegawai Pelaksana SPD Table */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                            <Users className="w-4 h-4 text-[#2a4574] dark:text-blue-400" />
                                            <span>Daftar Pelaksana SPD ({spdRows.length} Orang)</span>
                                        </h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            Gunakan kolom cari pegawai untuk pengisian otomatis Nama, NIP, Jabatan, dan Pangkat.
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={addSpdRow}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer"
                                    >
                                        <Plus className="w-3.5 h-3.5" />
                                        <span>Tambah Pegawai</span>
                                    </button>
                                </div>

                                <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-x-auto shadow-2xs">
                                    <table className="w-full text-left text-xs border-collapse">
                                        <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold">
                                            <tr>
                                                <th className="p-3 w-10 text-center">No</th>
                                                <th className="p-3 min-w-[220px]">Nama & NIP Pegawai</th>
                                                <th className="p-3 min-w-[180px]">Jabatan & Pangkat</th>
                                                <th className="p-3 min-w-[130px]">Kedudukan Asal</th>
                                                <th className="p-3 min-w-[130px]">Biaya (Rp)</th>
                                                <th className="p-3 min-w-[140px]">Alat Angkutan</th>
                                                <th className="p-3 w-12 text-center">Aksi</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50 bg-white dark:bg-slate-900">
                                            {spdRows.map((row, idx) => (
                                                <tr key={row.id} className="hover:bg-slate-50 dark:bg-slate-800/50">
                                                    <td className="p-3 text-center font-medium text-slate-500 dark:text-slate-400">
                                                        {idx + 1}
                                                    </td>
                                                    <td className="p-3">
                                                        <PegawaiSearchInput
                                                            value={row.nama}
                                                            placeholder="Cari / isi nama pegawai..."
                                                            onChangeText={(val) => updateSpdRow(row.id, 'nama', val)}
                                                            onSelect={(item) => {
                                                                updateSpdRow(row.id, 'nama', item.nama);
                                                                updateSpdRow(row.id, 'nip', item.nip || '');
                                                                updateSpdRow(row.id, 'jabatan', item.jabatan || '');
                                                                updateSpdRow(row.id, 'pangkat', item.golongan || item.pangkat || '');
                                                            }}
                                                        />
                                                        <input
                                                            type="text"
                                                            placeholder="NIP Pegawai"
                                                            value={row.nip}
                                                            onChange={(e) => updateSpdRow(row.id, 'nip', e.target.value)}
                                                            className="w-full mt-1 px-2.5 py-1 text-[11px] bg-slate-50 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 focus:bg-white dark:bg-slate-900"
                                                        />
                                                        {/* Hidden inputs submitted with the form */}
                                                        <input type="hidden" name="nama[]" value={row.nama} />
                                                        <input type="hidden" name="nip[]" value={row.nip} />
                                                    </td>
                                                    <td className="p-3">
                                                        <input
                                                            type="text"
                                                            name="jabatan[]"
                                                            placeholder="Jabatan"
                                                            value={row.jabatan}
                                                            onChange={(e) => updateSpdRow(row.id, 'jabatan', e.target.value)}
                                                            className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 focus:bg-white dark:bg-slate-900 mb-1"
                                                        />
                                                        <input
                                                            type="text"
                                                            name="pangkat[]"
                                                            placeholder="Pangkat / Golongan"
                                                            value={row.pangkat}
                                                            onChange={(e) => updateSpdRow(row.id, 'pangkat', e.target.value)}
                                                            className="w-full px-2.5 py-1 text-[11px] bg-slate-50 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 focus:bg-white dark:bg-slate-900"
                                                        />
                                                    </td>
                                                    <td className="p-3">
                                                        <input
                                                            type="text"
                                                            name="tempat_kedudukan[]"
                                                            value={row.tempat_kedudukan}
                                                            onChange={(e) => updateSpdRow(row.id, 'tempat_kedudukan', e.target.value)}
                                                            className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 focus:bg-white dark:bg-slate-900"
                                                        />
                                                    </td>
                                                    <td className="p-3">
                                                        <input
                                                            type="number"
                                                            name="tingkat_biaya[]"
                                                            min="0"
                                                            value={row.tingkat_biaya}
                                                            onChange={(e) => updateSpdRow(row.id, 'tingkat_biaya', e.target.value)}
                                                            className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 focus:bg-white dark:bg-slate-900"
                                                        />
                                                    </td>
                                                    <td className="p-3">
                                                        <input
                                                            type="text"
                                                            name="alat_angkut[]"
                                                            value={row.alat_angkut}
                                                            onChange={(e) => updateSpdRow(row.id, 'alat_angkut', e.target.value)}
                                                            className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 focus:bg-white dark:bg-slate-900 mb-1"
                                                        />
                                                        <input
                                                            type="hidden"
                                                            name="lama_hari[]"
                                                            value={spdHeader.lama_perjalanan || 1}
                                                        />
                                                        <input
                                                            type="hidden"
                                                            name="keterangan[]"
                                                            value={row.keterangan || '-'}
                                                        />
                                                    </td>
                                                    <td className="p-3 text-center">
                                                        <button
                                                            type="button"
                                                            disabled={spdRows.length <= 1}
                                                            onClick={() => removeSpdRow(row.id)}
                                                            className="p-1 text-slate-400 dark:text-slate-500 hover:text-rose-600 disabled:opacity-30 transition-colors"
                                                            title="Hapus baris"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="flex items-center justify-end pt-4 border-t border-slate-100 dark:border-slate-700">
                                <button
                                    type="submit"
                                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-[#2a4574] text-white hover:bg-[#1f3357] transition-all shadow-sm cursor-pointer"
                                >
                                    <Printer className="w-4 h-4" />
                                    <span>Cetak Lampiran SPD (PDF)</span>
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* ========================================================= */}
                {/* TAB 3: DAFTAR PENERIMAAN                                   */}
                {/* ========================================================= */}
                {activeTab === 'penerimaan' && (
                    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs p-5 sm:p-6 space-y-6">
                        <div className="border-b border-slate-100 dark:border-slate-700 pb-4">
                            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                <Users className="w-4 h-4 text-[#2a4574] dark:text-blue-400" />
                                <span>Formulir Daftar Penerimaan Perjalanan Dinas</span>
                            </h2>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                                Formulir tanda bukti penerimaan.
                            </p>
                        </div>

                        <form action="/daftar-penerimaan/preview" method="POST" target="_blank" className="space-y-6">
                            <input type="hidden" name="_token" value={csrf} />

                            {/* Penerimaan Header Data */}
                            <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="sm:col-span-3">
                                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                            Dalam Rangka Kegiatan <span className="text-rose-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="dalam_rangka"
                                            required
                                            placeholder="Contoh: Rapat Koordinasi Teknis Penyusunan Kinerja ASN"
                                            value={penerimaanHeader.dalam_rangka}
                                            onChange={(e) => setPenerimaanHeader({ ...penerimaanHeader, dalam_rangka: e.target.value })}
                                            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-[#2a4574]/20"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                            Tanggal Mulai <span className="text-rose-500">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            name="tanggal_mulai"
                                            required
                                            value={penerimaanHeader.tanggal_mulai}
                                            onChange={(e) => setPenerimaanHeader({ ...penerimaanHeader, tanggal_mulai: e.target.value })}
                                            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-[#2a4574]/20"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                            Tanggal Selesai <span className="text-rose-500">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            name="tanggal_selesai"
                                            required
                                            value={penerimaanHeader.tanggal_selesai}
                                            onChange={(e) => setPenerimaanHeader({ ...penerimaanHeader, tanggal_selesai: e.target.value })}
                                            className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-[#2a4574]/20"
                                        />
                                    </div>
                                    <div>
                                        <PegawaiSearchInput
                                            label="PPTK"
                                            required={true}
                                            value={penerimaanHeader.pptk}
                                            placeholder="Cari nama PPTK..."
                                            inputName="pptk"
                                            onChangeText={(txt) => setPenerimaanHeader({ ...penerimaanHeader, pptk: txt })}
                                            onSelect={(item) => setPenerimaanHeader({ ...penerimaanHeader, pptk: item.nama, nip_pptk: item.nip })}
                                        />
                                        <input type="hidden" name="nip_pptk" value={penerimaanHeader.nip_pptk || ''} />
                                    </div>
                                    <div>
                                        <PegawaiSearchInput
                                            label="Yang Menerima / Perwakilan"
                                            required={true}
                                            value={penerimaanHeader.yang_menerima}
                                            placeholder="Cari penerima..."
                                            inputName="yang_menerima"
                                            onChangeText={(txt) => setPenerimaanHeader({ ...penerimaanHeader, yang_menerima: txt })}
                                            onSelect={(item) => setPenerimaanHeader({ ...penerimaanHeader, yang_menerima: item.nama, nip_penerima: item.nip })}
                                        />
                                        <input type="hidden" name="nip_penerima" value={penerimaanHeader.nip_penerima || ''} />
                                    </div>
                                </div>
                            </div>

                            {/* Daftar Penerima Table */}
                            <div className="space-y-3">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div>
                                        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                            <Users className="w-4 h-4 text-[#2a4574] dark:text-blue-400" />
                                            <span>Rincian Komponen Biaya per Pegawai ({penerimaanRows.length} Orang)</span>
                                        </h3>
                                        <p className="text-xs text-slate-500 dark:text-slate-400">
                                            Rincian nominal uang harian, penginapan, transportasi, dan tiket per penerima.
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="text-right">
                                            <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block">
                                                Total Penerimaan
                                            </span>
                                            <span className="text-sm font-extrabold text-[#2a4574]">
                                                {formatCurrency(totalPenerimaan)}
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={addPenerimaanRow}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer"
                                        >
                                            <Plus className="w-3.5 h-3.5" />
                                            <span>Tambah Penerima</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-x-auto shadow-2xs">
                                    <table className="w-full text-left text-xs border-collapse">
                                        <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold">
                                            <tr>
                                                <th className="p-2.5 w-10 text-center">No</th>
                                                <th className="p-2.5 min-w-[200px]">Nama & NIP Pegawai</th>
                                                <th className="p-2.5 min-w-[150px]">Jabatan & Pangkat</th>
                                                <th className="p-2.5 w-16 text-center">Hari</th>
                                                <th className="p-2.5 min-w-[105px]">Penginapan</th>
                                                <th className="p-2.5 min-w-[105px]">Uang Harian</th>
                                                <th className="p-2.5 min-w-[105px]">Representasi</th>
                                                <th className="p-2.5 min-w-[105px]">Transportasi</th>
                                                <th className="p-2.5 min-w-[105px]">Tiket</th>
                                                <th className="p-2.5 min-w-[110px] text-right">Subtotal</th>
                                                <th className="p-2.5 w-10 text-center"></th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50 bg-white dark:bg-slate-900">
                                            {penerimaanRows.map((row, idx) => {
                                                const subtotal =
                                                    (parseInt(row.penginapan) || 0) +
                                                    (parseInt(row.uang_harian) || 0) +
                                                    (parseInt(row.uang_representasi) || 0) +
                                                    (parseInt(row.transportasi) || 0) +
                                                    (parseInt(row.tiket) || 0);

                                                return (
                                                    <tr key={row.id} className="hover:bg-slate-50 dark:bg-slate-800/50">
                                                        <td className="p-2.5 text-center font-medium text-slate-500 dark:text-slate-400">
                                                            {idx + 1}
                                                        </td>
                                                        <td className="p-2.5">
                                                            <PegawaiSearchInput
                                                                value={row.nama}
                                                                placeholder="Cari / ketik nama..."
                                                                onChangeText={(val) => updatePenerimaanRow(row.id, 'nama', val)}
                                                                onSelect={(item) => {
                                                                    updatePenerimaanRow(row.id, 'nama', item.nama);
                                                                    updatePenerimaanRow(row.id, 'nip', item.nip || '');
                                                                    updatePenerimaanRow(row.id, 'jabatan', item.jabatan || '');
                                                                    updatePenerimaanRow(row.id, 'pangkat', item.golongan || item.pangkat || '');
                                                                }}
                                                            />
                                                            <input
                                                                type="text"
                                                                placeholder="NIP"
                                                                value={row.nip}
                                                                onChange={(e) => updatePenerimaanRow(row.id, 'nip', e.target.value)}
                                                                className="w-full mt-1 px-2.5 py-0.5 text-[11px] bg-slate-50 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 focus:bg-white dark:bg-slate-900"
                                                            />
                                                            <input type="hidden" name="nama[]" value={row.nama} />
                                                            <input type="hidden" name="nip[]" value={row.nip} />
                                                        </td>
                                                        <td className="p-2.5">
                                                            <input
                                                                type="text"
                                                                name="jabatan[]"
                                                                placeholder="Jabatan"
                                                                value={row.jabatan}
                                                                onChange={(e) => updatePenerimaanRow(row.id, 'jabatan', e.target.value)}
                                                                className="w-full px-2 py-1 text-xs bg-slate-50 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 focus:bg-white dark:bg-slate-900 mb-1"
                                                            />
                                                            <input
                                                                type="text"
                                                                name="pangkat[]"
                                                                placeholder="Pangkat"
                                                                value={row.pangkat}
                                                                onChange={(e) => updatePenerimaanRow(row.id, 'pangkat', e.target.value)}
                                                                className="w-full px-2 py-0.5 text-[11px] bg-slate-50 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-600 dark:text-slate-300 focus:bg-white dark:bg-slate-900"
                                                            />
                                                        </td>
                                                        <td className="p-2.5 text-center">
                                                            <input
                                                                type="number"
                                                                name="lama_hari[]"
                                                                min="1"
                                                                value={row.lama_hari}
                                                                onChange={(e) => updatePenerimaanRow(row.id, 'lama_hari', e.target.value)}
                                                                className="w-14 px-1.5 py-1 text-center text-xs bg-slate-50 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 focus:bg-white dark:bg-slate-900"
                                                            />
                                                        </td>
                                                        <td className="p-2.5">
                                                            <input
                                                                type="number"
                                                                name="penginapan[]"
                                                                min="0"
                                                                value={row.penginapan}
                                                                onChange={(e) => updatePenerimaanRow(row.id, 'penginapan', e.target.value)}
                                                                className="w-full px-2 py-1 text-xs bg-slate-50 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 focus:bg-white dark:bg-slate-900"
                                                            />
                                                        </td>
                                                        <td className="p-2.5">
                                                            <input
                                                                type="number"
                                                                name="uang_harian[]"
                                                                min="0"
                                                                value={row.uang_harian}
                                                                onChange={(e) => updatePenerimaanRow(row.id, 'uang_harian', e.target.value)}
                                                                className="w-full px-2 py-1 text-xs bg-slate-50 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 focus:bg-white dark:bg-slate-900"
                                                            />
                                                        </td>
                                                        <td className="p-2.5">
                                                            <input
                                                                type="number"
                                                                name="uang_representasi[]"
                                                                min="0"
                                                                value={row.uang_representasi}
                                                                onChange={(e) => updatePenerimaanRow(row.id, 'uang_representasi', e.target.value)}
                                                                className="w-full px-2 py-1 text-xs bg-slate-50 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 focus:bg-white dark:bg-slate-900"
                                                            />
                                                        </td>
                                                        <td className="p-2.5">
                                                            <input
                                                                type="number"
                                                                name="transportasi[]"
                                                                min="0"
                                                                value={row.transportasi}
                                                                onChange={(e) => updatePenerimaanRow(row.id, 'transportasi', e.target.value)}
                                                                className="w-full px-2 py-1 text-xs bg-slate-50 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 focus:bg-white dark:bg-slate-900"
                                                            />
                                                        </td>
                                                        <td className="p-2.5">
                                                            <input
                                                                type="number"
                                                                name="tiket[]"
                                                                min="0"
                                                                value={row.tiket}
                                                                onChange={(e) => updatePenerimaanRow(row.id, 'tiket', e.target.value)}
                                                                className="w-full px-2 py-1 text-xs bg-slate-50 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 focus:bg-white dark:bg-slate-900"
                                                            />
                                                        </td>
                                                        <td className="p-2.5 text-right font-bold text-slate-800 dark:text-slate-100">
                                                            {formatCurrency(subtotal)}
                                                        </td>
                                                        <td className="p-2.5 text-center">
                                                            <button
                                                                type="button"
                                                                disabled={penerimaanRows.length <= 1}
                                                                onClick={() => removePenerimaanRow(row.id)}
                                                                className="p-1 text-slate-400 dark:text-slate-500 hover:text-rose-600 disabled:opacity-30 transition-colors"
                                                                title="Hapus baris"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                        <tfoot className="bg-slate-50 dark:bg-slate-800/90 border-t border-slate-200 dark:border-slate-700 font-bold text-xs text-slate-800 dark:text-slate-100">
                                            <tr>
                                                <td colSpan={9} className="p-3 text-right">
                                                    TOTAL KESELURUHAN:
                                                </td>
                                                <td className="p-3 text-right text-sm text-[#2a4574]">
                                                    {formatCurrency(totalPenerimaan)}
                                                </td>
                                                <td></td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>

                            <div className="flex items-center justify-end pt-4 border-t border-slate-100 dark:border-slate-700">
                                <button
                                    type="submit"
                                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold bg-[#2a4574] text-white hover:bg-[#1f3357] transition-all shadow-sm cursor-pointer"
                                >
                                    <Printer className="w-4 h-4" />
                                    <span>Cetak Daftar Penerimaan (PDF)</span>
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
