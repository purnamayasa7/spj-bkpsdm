import React from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import {
    Send,
    FileEdit,
    CheckCircle2,
    XCircle,
    Calendar,
    ArrowUpRight,
    TrendingUp,
    Building2,
    Clock,
    Wallet,
    Coins,
    PlusCircle,
    FileText,
    HelpCircle,
    AlertCircle,
} from 'lucide-react';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function Dashboard({
    totalDikirim = 0,
    totalDikoreksi = 0,
    totalDisetujui = 0,
    totalDitolak = 0,
    totalNominalDisetujui = 0,
    totalNominalDikirim = 0,
    rekapBidang = [],
    rekapData = [],
    bulanLabels = [],
    roleLabel = '',
    recentActivities = [],
    antreanReview = [],
    perluPerbaikan = [],
    pengajuanTerbaruBidang = [],
    year = '2025',
}) {
    const { auth } = usePage().props;
    const isKeuangan = roleLabel === 'Keuangan' || auth?.user?.role === 'Keuangan' || auth?.user?.role_id === 1;

    const formatRupiah = (val) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(val || 0);
    };

    const handleYearChange = (e) => {
        const selectedYear = e.target.value;
        router.get(
            '/dashboard',
            { year: selectedYear },
            { preserveState: true, preserveScroll: true }
        );
    };

    // Formatted current date
    const todayFormatted = new Intl.DateTimeFormat('id-ID', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    }).format(new Date());

    // Cards configuration
    const cards = [
        {
            id: 'card-dikirim',
            label: 'SPJ Dikirim',
            value: totalDikirim,
            icon: Send,
            color: 'emerald',
            borderColor: '!border-l-emerald-500 dark:!border-l-emerald-400',
            textColor: 'text-emerald-600 dark:text-emerald-400',
            bgColor: 'bg-emerald-50',
        },
        {
            id: 'card-dikoreksi',
            label: 'SPJ Dikoreksi',
            value: totalDikoreksi,
            icon: FileEdit,
            color: 'amber',
            borderColor: '!border-l-amber-500 dark:!border-l-amber-400',
            textColor: 'text-amber-600 dark:text-amber-400',
            bgColor: 'bg-amber-50',
        },
        {
            id: 'card-disetujui',
            label: 'SPJ Disetujui',
            value: totalDisetujui,
            icon: CheckCircle2,
            color: 'blue',
            borderColor: '!border-l-blue-600 dark:!border-l-blue-400',
            textColor: 'text-[#2a4574] dark:text-blue-400',
            bgColor: 'bg-blue-50',
        },
        {
            id: 'card-ditolak',
            label: 'SPJ Ditolak',
            value: totalDitolak,
            icon: XCircle,
            color: 'rose',
            borderColor: '!border-l-rose-500 dark:!border-l-rose-400',
            textColor: 'text-rose-600 dark:text-rose-400',
            bgColor: 'bg-rose-50',
        },
    ];

    // Data for Line Chart (Tren Bulanan)
    const lineChartData = {
        labels: bulanLabels,
        datasets: [
            {
                label: 'Total SPJ',
                data: rekapData,
                borderColor: '#2a4574',
                backgroundColor: 'rgba(42, 69, 116, 0.08)',
                pointBackgroundColor: '#2a4574',
                pointBorderColor: '#ffffff',
                pointHoverBackgroundColor: '#ffffff',
                pointHoverBorderColor: '#2a4574',
                pointRadius: 4,
                pointHoverRadius: 6,
                fill: true,
                tension: 0.35,
            },
        ],
    };

    const lineChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: '#1e293b',
                padding: 10,
                cornerRadius: 8,
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: '#94a3b8',
                    font: { size: 11 },
                },
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(148, 163, 184, 0.15)',
                },
                ticks: {
                    color: '#94a3b8',
                    font: { size: 11 },
                    precision: 0,
                },
            },
        },
    };

    // Data for Bar Chart (Rekap Bidang)
    const bidangLabels = rekapBidang.map((b) => b.bidang || 'Lainnya');
    const bidangTotals = rekapBidang.map((b) => b.total || 0);

    const barChartData = {
        labels: bidangLabels,
        datasets: [
            {
                label: 'Jumlah SPJ',
                data: bidangTotals,
                backgroundColor: [
                    '#2a4574',
                    '#3b5a97',
                    '#4c6fc1',
                    '#0ea5e9',
                    '#06b6d4',
                    '#6366f1',
                ],
                borderRadius: 6,
            },
        ],
    };

    const barChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                backgroundColor: '#1e293b',
                padding: 10,
                cornerRadius: 8,
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: '#94a3b8',
                    font: { size: 10 },
                    maxRotation: 45,
                    minRotation: 0,
                },
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(148, 163, 184, 0.15)',
                },
                ticks: {
                    color: '#94a3b8',
                    font: { size: 11 },
                    precision: 0,
                },
            },
        },
    };

    return (
        <AuthenticatedLayout title="Dashboard">
            <Head title="Dashboard" />

            <div className="space-y-6">
                {/* Header / Filter Row */}
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors">
                    <div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 dark:text-slate-100 tracking-tight">
                                Selamat Datang, {auth?.user?.name || 'Pengguna'}!
                            </h2>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-[#2a4574] dark:text-blue-400 border border-blue-200 dark:border-blue-900/40">
                                {roleLabel || (isKeuangan ? 'Keuangan' : auth?.user?.bidang || 'Bidang')}
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                            {todayFormatted}
                        </p>
                    </div>

                    {/* Year Selector */}
                    <div className="flex items-center gap-2.5 self-end sm:self-auto bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-1.5">
                        <label
                            htmlFor="year-select"
                            className="text-xs font-semibold text-slate-600 dark:text-slate-400 whitespace-nowrap"
                        >
                            Periode Tahun:
                        </label>
                        <select
                            id="year-select"
                            value={year}
                            onChange={handleYearChange}
                            className="bg-transparent text-xs font-bold text-[#2a4574] dark:text-blue-400 border-none focus:outline-hidden cursor-pointer [&>option]:bg-white [&>option]:dark:bg-slate-800 [&>option]:text-slate-800 [&>option]:dark:text-slate-100"
                        >
                            <option value="2025">2025</option>
                            <option value="2026">2026</option>
                        </select>
                    </div>
                </div>

                {/* 4 Status Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {cards.map((c) => {
                        const IconComponent = c.icon;
                        return (
                            <div
                                key={c.id}
                                className={`bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs border-l-4 ${c.borderColor} hover:shadow-md transition-all`}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className={`text-xs font-bold tracking-wider uppercase mb-1 ${c.textColor}`}>
                                            {c.label}
                                        </p>
                                        <h3 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">
                                            {c.value.toLocaleString('id-ID')}
                                        </h3>
                                    </div>
                                    <div className={`w-12 h-12 rounded-xl ${c.bgColor} dark:bg-opacity-20 flex items-center justify-center shrink-0`}>
                                        <IconComponent className={`w-6 h-6 ${c.textColor}`} />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* 2 Financial Stat Cards / Action Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Realisasi Anggaran Disetujui */}
                    <div className="bg-linear-to-r from-[#2a4574] via-[#32528a] to-[#3b5a97] text-white p-5 rounded-2xl shadow-xs flex items-center justify-between border border-blue-900/10">
                        <div>
                            <div className="flex items-center gap-2">
                                <p className="text-xs font-semibold text-blue-100 uppercase tracking-wider">
                                    Total Realisasi SPJ Disetujui ({year})
                                </p>
                            </div>
                            <h3 className="text-2xl sm:text-3xl font-black mt-1.5 tracking-tight">
                                {formatRupiah(totalNominalDisetujui)}
                            </h3>
                            <p className="text-[11px] text-blue-200 mt-1">
                                {isKeuangan ? 'Akumulasi total seluruh bidang' : `Khusus pengajuan Bidang ${auth?.user?.bidang || ''}`}
                            </p>
                        </div>
                        <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-xs flex items-center justify-center shrink-0 border border-white/20">
                            <Wallet className="w-6 h-6 text-white" />
                        </div>
                    </div>

                    {/* Sisi Kanan: Keuangan (Antrean Nominal) vs Bidang (Pintasan Aksi) */}
                    {isKeuangan ? (
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-xs flex items-center justify-between transition-colors">
                            <div>
                                <div className="flex items-center gap-2">
                                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                        Nilai SPJ Menunggu Review ({year})
                                    </p>
                                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50">
                                        {totalDikirim} Berkas
                                    </span>
                                </div>
                                <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-slate-100 mt-1.5 tracking-tight">
                                    {formatRupiah(totalNominalDikirim)}
                                </h3>
                                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">
                                    Estimasi anggaran yang saat ini dalam proses verifikasi
                                </p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900/40 flex items-center justify-center shrink-0">
                                <Coins className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-xs flex flex-col justify-between transition-colors">
                            <div className="flex items-center justify-between">
                                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                    Pusat Pintasan Aksi Bidang
                                </p>
                                <span className="text-[11px] text-[#2a4574] dark:text-blue-400 font-semibold">Akses Cepat</span>
                            </div>
                            <div className="grid grid-cols-3 gap-2 mt-2">
                                <Link
                                    href="/spj/create"
                                    className="flex flex-col items-center justify-center text-center p-2.5 rounded-xl bg-[#2a4574] text-white hover:bg-[#3b5a97] transition-all shadow-2xs group"
                                >
                                    <PlusCircle className="w-4 h-4 mb-1 group-hover:scale-110 transition-transform" />
                                    <span className="text-[11px] font-bold leading-tight">Buat SPJ Baru</span>
                                </Link>
                                <Link
                                    href="/generator"
                                    className="flex flex-col items-center justify-center text-center p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 hover:bg-blue-50/50 dark:hover:bg-slate-800 hover:border-blue-200 text-slate-700 dark:text-slate-300 hover:text-[#2a4574] dark:hover:text-blue-400 transition-all group"
                                >
                                    <FileText className="w-4 h-4 mb-1 text-slate-500 dark:text-slate-400 group-hover:text-[#2a4574] dark:group-hover:text-blue-400 group-hover:scale-110 transition-transform" />
                                    <span className="text-[11px] font-semibold leading-tight">Generator Doc</span>
                                </Link>
                                <Link
                                    href="/panduan/checklist"
                                    className="flex flex-col items-center justify-center text-center p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 hover:bg-blue-50/50 dark:hover:bg-slate-800 hover:border-blue-200 text-slate-700 dark:text-slate-300 hover:text-[#2a4574] dark:hover:text-blue-400 transition-all group"
                                >
                                    <HelpCircle className="w-4 h-4 mb-1 text-slate-500 dark:text-slate-400 group-hover:text-[#2a4574] dark:group-hover:text-blue-400 group-hover:scale-110 transition-transform" />
                                    <span className="text-[11px] font-semibold leading-tight">Panduan SPJ</span>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>

                {/* Role Keuangan Rows: Antrean Review Prioritas & Rekap Bidang & Aktivitas */}
                {isKeuangan ? (
                    <>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Antrean Review Prioritas (5 Berkas Terlama) */}
                            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-5 flex flex-col">
                                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                                            <Clock className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-800 dark:text-slate-100 dark:text-slate-100 text-sm">
                                                Antrean Review Prioritas
                                            </h4>
                                            <p className="text-[11px] text-slate-400 dark:text-slate-500">Berkas SPJ terlama yang menunggu verifikasi</p>
                                        </div>
                                    </div>
                                    <Link
                                        href="/keuangan/spj"
                                        className="text-xs font-semibold text-[#2a4574] dark:text-blue-400 hover:underline flex items-center gap-1"
                                    >
                                        Review Semua
                                        <ArrowUpRight className="w-3.5 h-3.5" />
                                    </Link>
                                </div>

                                <div className="flex-1 space-y-2.5 overflow-y-auto max-h-72 pr-1">
                                    {antreanReview && antreanReview.length > 0 ? (
                                        antreanReview.map((item) => (
                                            <div
                                                key={item.id}
                                                className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-700 hover:bg-blue-50/20 dark:hover:bg-slate-800/40 transition-all flex items-center justify-between gap-3"
                                            >
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                                            {item.bidang}
                                                        </span>
                                                        <span className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                                                            {item.id}
                                                        </span>
                                                        <span className="text-[10px] text-slate-400 dark:text-slate-500 whitespace-nowrap">
                                                            • {item.time_ago}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-slate-600 dark:text-slate-300 truncate font-medium">
                                                        {item.kegiatan}
                                                    </p>
                                                    <p className="text-xs font-extrabold text-[#2a4574] dark:text-blue-400 mt-0.5">
                                                        {formatRupiah(item.nilai)}
                                                    </p>
                                                </div>
                                                <Link
                                                    href={`/keuangan/spj/${item.id}/review`}
                                                    className="shrink-0 px-3 py-1.5 rounded-lg bg-[#2a4574] hover:bg-[#3b5a97] text-white text-xs font-bold transition-colors shadow-2xs"
                                                >
                                                    Review
                                                </Link>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="h-full min-h-[160px] flex flex-col items-center justify-center text-center p-4">
                                            <CheckCircle2 className="w-9 h-9 text-emerald-500 mb-2" />
                                            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Semua SPJ Telah Direview</p>
                                            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">Tidak ada antrean SPJ yang tertunda saat ini.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Rekap Bidang Chart */}
                            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-5">
                                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center gap-2">
                                        <Building2 className="w-4 h-4 text-[#2a4574] dark:text-blue-400" />
                                        <h4 className="font-bold text-slate-800 dark:text-slate-100 dark:text-slate-100 text-sm">
                                            Rekap Jumlah SPJ per Bidang ({year})
                                        </h4>
                                    </div>
                                </div>
                                <div className="h-64">
                                    {bidangLabels.length > 0 ? (
                                        <Bar data={barChartData} options={barChartOptions} />
                                    ) : (
                                        <div className="h-full flex items-center justify-center text-xs text-slate-400 dark:text-slate-500">
                                            Belum ada data SPJ pada periode ini.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Baris Kiri & Kanan: Tren Jumlah SPJ per Bulan & Aktivitas Terkini */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Tren Jumlah SPJ per Bulan */}
                            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-5 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                                        <div className="flex items-center gap-2">
                                            <TrendingUp className="w-4 h-4 text-[#2a4574] dark:text-blue-400" />
                                            <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                                                Tren Jumlah SPJ per Bulan — Tahun {year}
                                            </h4>
                                        </div>
                                    </div>

                                    <div className="h-64 sm:h-72">
                                        <Line data={lineChartData} options={lineChartOptions} />
                                    </div>
                                </div>

                                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
                                    <span>Akumulasi grafik bulanan {year}.</span>
                                    <span className="font-medium text-[#2a4574] dark:text-blue-400">Total: {rekapData.reduce((a, b) => a + b, 0)} SPJ</span>
                                </div>
                            </div>

                            {/* Recent Activities Timeline */}
                            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-5 flex flex-col">
                                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-4 h-4 text-[#2a4574] dark:text-blue-400" />
                                        <h4 className="font-bold text-slate-800 dark:text-slate-100 dark:text-slate-100 text-sm">
                                            Aktivitas Terkini
                                        </h4>
                                    </div>
                                    <Link
                                        href="/activity"
                                        className="text-xs font-semibold text-[#2a4574] dark:text-blue-400 hover:underline flex items-center gap-1"
                                    >
                                        Lihat Semua
                                        <ArrowUpRight className="w-3.5 h-3.5" />
                                    </Link>
                                </div>

                                <div className="overflow-y-auto space-y-3 max-h-72 sm:max-h-[300px] flex-1 pr-1">
                                    {recentActivities.length > 0 ? (
                                        recentActivities.map((act) => {
                                            const actionLower = (act.action || '').toLowerCase();
                                            let dotColor = 'bg-slate-400';
                                            if (actionLower.includes('approve') || actionLower.includes('setuju')) {
                                                dotColor = 'bg-[#2a4574] dark:bg-blue-500';
                                            } else if (actionLower.includes('update') || actionLower.includes('edit')) {
                                                dotColor = 'bg-amber-500';
                                            } else if (actionLower.includes('create') || actionLower.includes('tambah')) {
                                                dotColor = 'bg-emerald-500';
                                            } else if (actionLower.includes('tolak') || actionLower.includes('delete')) {
                                                dotColor = 'bg-rose-500';
                                            }

                                            return (
                                                <div
                                                    key={act.id}
                                                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-800/60 transition-colors"
                                                >
                                                    <span className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${dotColor}`} />
                                                    <div className="flex-1 min-w-0 text-xs">
                                                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                                                            <span className="font-semibold text-slate-900 dark:text-slate-100">
                                                                {act.user_name}
                                                            </span>{' '}
                                                            {act.bidang ? (
                                                                <span className="text-slate-500 dark:text-slate-400">
                                                                    (Bidang {act.bidang}):
                                                                </span>
                                                            ) : null}{' '}
                                                            <span>{act.description}</span>
                                                        </p>
                                                        <span className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 block">
                                                            {act.time_ago}
                                                        </span>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <div className="h-full flex items-center justify-center text-xs text-slate-400 dark:text-slate-500 py-8">
                                            Belum ada aktivitas tercatat.
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    /* Role Bidang Rows: Perlu Perbaikan & Pengajuan Terakhir */
                    <>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Widget Perlu Perbaikan Segera */}
                            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-5 flex flex-col">
                                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-lg bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                                            <AlertCircle className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-800 dark:text-slate-100 dark:text-slate-100 text-sm">
                                                Perlu Perbaikan Segera
                                            </h4>
                                            <p className="text-[11px] text-slate-400 dark:text-slate-500">Catatan revisi dari tim verifikator keuangan</p>
                                        </div>
                                    </div>
                                    <Link
                                        href="/spj?status=Dikoreksi"
                                        className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
                                    >
                                        Lihat Semua
                                        <ArrowUpRight className="w-3.5 h-3.5" />
                                    </Link>
                                </div>

                                <div className="flex-1 space-y-2.5 overflow-y-auto max-h-72 pr-1">
                                    {perluPerbaikan && perluPerbaikan.length > 0 ? (
                                        perluPerbaikan.map((item) => (
                                            <div
                                                key={item.id}
                                                className="p-3.5 rounded-xl border border-rose-100 dark:border-rose-900/40 bg-rose-50/30 dark:bg-rose-950/20 hover:bg-rose-50/60 dark:hover:bg-rose-950/40 transition-all space-y-2"
                                            >
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="min-w-0 flex-1">
                                                        <span className="text-xs font-bold text-slate-800 dark:text-slate-100 block truncate">
                                                            {item.kegiatan}
                                                        </span>
                                                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                                                            <span className="font-semibold text-rose-600 dark:text-rose-400">{item.id}</span>
                                                            <span>•</span>
                                                            <span className="font-bold text-slate-700 dark:text-slate-200">{formatRupiah(item.nilai)}</span>
                                                            <span>•</span>
                                                            <span>{item.time_ago}</span>
                                                        </div>
                                                    </div>
                                                    <Link
                                                        href={`/spj/${item.id}/edit`}
                                                        className="shrink-0 px-3 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors shadow-2xs"
                                                    >
                                                        Perbaiki
                                                    </Link>
                                                </div>
                                                <div className="bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-rose-100/80 dark:border-rose-900/50 text-xs text-rose-900 dark:text-rose-200 leading-relaxed">
                                                    <p className="font-semibold text-[11px] text-rose-700 dark:text-rose-400 mb-0.5 flex items-center gap-1">
                                                        <FileEdit className="w-3 h-3" /> Catatan Koreksi Keuangan:
                                                    </p>
                                                    <p className="italic">{item.keterangan}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="h-full min-h-[160px] flex flex-col items-center justify-center text-center p-4">
                                            <CheckCircle2 className="w-9 h-9 text-emerald-500 mb-2" />
                                            <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Semua Berkas Aman!</p>
                                            <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">Tidak ada SPJ yang perlu perbaikan saat ini.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Widget Pengajuan Terakhir Bidang */}
                            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-5 flex flex-col">
                                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center gap-2">
                                        <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/50 text-[#2a4574] dark:text-blue-400 flex items-center justify-center">
                                            <Clock className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-800 dark:text-slate-100 dark:text-slate-100 text-sm">
                                                Pengajuan Terakhir Bidang
                                            </h4>
                                            <p className="text-[11px] text-slate-400 dark:text-slate-500">Pantau progres SPJ yang telah Anda kirimkan</p>
                                        </div>
                                    </div>
                                    <Link
                                        href="/spj"
                                        className="text-xs font-semibold text-[#2a4574] dark:text-blue-400 hover:underline flex items-center gap-1"
                                    >
                                        Daftar SPJ
                                        <ArrowUpRight className="w-3.5 h-3.5" />
                                    </Link>
                                </div>

                                <div className="flex-1 space-y-2.5 overflow-y-auto max-h-72 pr-1">
                                    {pengajuanTerbaruBidang && pengajuanTerbaruBidang.length > 0 ? (
                                        pengajuanTerbaruBidang.map((item) => {
                                            let statusBadgeClass = 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
                                            if (item.status === 'Dikirim') statusBadgeClass = 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800';
                                            else if (item.status === 'Dikoreksi') statusBadgeClass = 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800';
                                            else if (item.status === 'Disetujui') statusBadgeClass = 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
                                            else if (item.status === 'Ditolak') statusBadgeClass = 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800';

                                            return (
                                                <Link
                                                    key={item.id}
                                                    href={`/spj/${item.id}`}
                                                    className="p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-700 hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-800/50 transition-all flex items-center justify-between gap-3 block"
                                                >
                                                    <div className="min-w-0 flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <span className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                                                                {item.id}
                                                            </span>
                                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${statusBadgeClass}`}>
                                                                {item.status}
                                                            </span>
                                                            <span className="text-[10px] text-slate-400 dark:text-slate-500 whitespace-nowrap">
                                                                • {item.time_ago}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-slate-600 dark:text-slate-300 truncate font-medium">
                                                            {item.kegiatan}
                                                        </p>
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-700 dark:text-slate-200 whitespace-nowrap">
                                                        {formatRupiah(item.nilai)}
                                                    </span>
                                                </Link>
                                            );
                                        })
                                    ) : (
                                        <div className="h-full min-h-[160px] flex flex-col items-center justify-center text-center p-4">
                                            <p className="text-xs text-slate-400 dark:text-slate-500">Belum ada pengajuan SPJ pada tahun {year}.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Full Width Line Chart: Tren Bulanan (Khusus Bidang) */}
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs p-5">
                            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-[#2a4574] dark:text-blue-400" />
                                    <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                                        Tren Jumlah SPJ per Bulan — Tahun {year}
                                    </h4>
                                </div>
                            </div>

                            <div className="h-72">
                                <Line data={lineChartData} options={lineChartOptions} />
                            </div>

                            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
                                <span>Menampilkan grafik total akumulasi SPJ per bulan selama tahun {year}.</span>
                                <span className="font-medium text-[#2a4574] dark:text-blue-400">Total: {rekapData.reduce((a, b) => a + b, 0)} SPJ</span>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
