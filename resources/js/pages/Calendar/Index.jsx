import React, { useState, useMemo } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import {
    Calendar as CalendarIcon,
    ChevronLeft,
    ChevronRight,
    FileText,
    Building2,
    CalendarDays,
    Eye,
    Tag,
    Clock,
    CheckCircle2,
    AlertCircle,
    X,
    Wallet,
} from 'lucide-react';

const MONTH_NAMES = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const DAY_NAMES = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

export default function CalendarIndex({ events = [] }) {
    const { auth } = usePage().props;
    const isKeuangan = auth?.user?.role === 'Keuangan' || auth?.user?.role_id === 1;
    const userBidang = auth?.user?.bidang;

    const today = new Date();
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [viewMode, setViewMode] = useState('grid');
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [filterBidang, setFilterBidang] = useState('Semua');

    const filteredEvents = useMemo(() => {
        if (!isKeuangan && userBidang) return events.filter((e) => e.bidang === userBidang);
        if (filterBidang === 'Semua') return events;
        return events.filter((e) => e.bidang === filterBidang);
    }, [events, filterBidang, isKeuangan, userBidang]);

    const handlePrevMonth = () => {
        if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear((p) => p - 1); }
        else setCurrentMonth((p) => p - 1);
    };
    const handleNextMonth = () => {
        if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear((p) => p + 1); }
        else setCurrentMonth((p) => p + 1);
    };
    const handleToday = () => { setCurrentYear(today.getFullYear()); setCurrentMonth(today.getMonth()); };

    const calendarDays = useMemo(() => {
        const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
        const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
        const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();
        const days = [];

        for (let i = firstDayOfMonth - 1; i >= 0; i--) {
            const dayNum = daysInPrevMonth - i;
            const dateStr = `${currentMonth === 0 ? currentYear - 1 : currentYear}-${String(currentMonth === 0 ? 12 : currentMonth).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
            days.push({ dayNumber: dayNum, dateStr, isCurrentMonth: false, isToday: false });
        }
        for (let d = 1; d <= daysInMonth; d++) {
            const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            const isToday = today.getFullYear() === currentYear && today.getMonth() === currentMonth && today.getDate() === d;
            days.push({ dayNumber: d, dateStr, isCurrentMonth: true, isToday });
        }
        const totalCells = days.length > 35 ? 42 : 35;
        const remaining = totalCells - days.length;
        for (let d = 1; d <= remaining; d++) {
            const dateStr = `${currentMonth === 11 ? currentYear + 1 : currentYear}-${String(currentMonth === 11 ? 1 : currentMonth + 2).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            days.push({ dayNumber: d, dateStr, isCurrentMonth: false, isToday: false });
        }
        return days;
    }, [currentYear, currentMonth]);

    const eventsByDate = useMemo(() => {
        const map = {};
        filteredEvents.forEach((evt) => {
            const d = (evt.start || evt.tanggal_spj || '').slice(0, 10);
            if (d) { if (!map[d]) map[d] = []; map[d].push(evt); }
        });
        return map;
    }, [filteredEvents]);

    const currentMonthEvents = useMemo(() => {
        return filteredEvents
            .filter((e) => {
                const d = (e.start || e.tanggal_spj || '').slice(0, 10);
                if (!d) return false;
                const dt = new Date(d);
                return dt.getFullYear() === currentYear && dt.getMonth() === currentMonth;
            })
            .sort((a, b) => new Date(a.start || a.tanggal_spj) - new Date(b.start || b.tanggal_spj));
    }, [filteredEvents, currentYear, currentMonth]);

    const formatCurrency = (val) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(val || 0);

    const formatDisplayDate = (dateStr) => {
        if (!dateStr) return '-';
        try {
            return new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(dateStr));
        } catch { return dateStr; }
    };

    // Dark-mode aware badge colors for bidang
    const getBidangColor = (bidang) => {
        switch (bidang) {
            case 'PKA':       return 'bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-950/60';
            case 'PKAP':      return 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-950/60';
            case 'PPI':       return 'bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-400 border-violet-200 dark:border-violet-800 hover:bg-violet-100 dark:hover:bg-violet-950/60';
            case 'MP':        return 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-950/60';
            case 'Sekretariat': return 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800 hover:bg-amber-100 dark:hover:bg-amber-950/60';
            default:          return 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700';
        }
    };

    return (
        <AuthenticatedLayout title="Kalender SPJ">
            <Head title="Kalender SPJ - E-SPJ BKPSDM" />

            <div className="space-y-6">
                {/* Header Card */}
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xs border border-slate-200 dark:border-slate-700 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#2a4574] to-[#4c6fc1] flex items-center justify-center text-white shadow-md shadow-blue-900/10">
                            <CalendarIcon className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                                Kalender Agenda SPJ
                            </h1>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                                {isKeuangan
                                    ? 'Monitoring jadwal SPJ seluruh bidang'
                                    : `Monitoring jadwal SPJ Bidang ${userBidang || ''}`}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                        {isKeuangan ? (
                            <select
                                value={filterBidang}
                                onChange={(e) => setFilterBidang(e.target.value)}
                                className="text-xs rounded-lg border border-slate-200 dark:border-slate-700 px-3 py-2 text-slate-700 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-[#2a4574]/20 focus:border-[#2a4574] bg-white dark:bg-slate-800"
                            >
                                <option value="Semua">Semua Bidang</option>
                                <option value="PKA">PKA</option>
                                <option value="PKAP">PKAP</option>
                                <option value="PPI">PPI</option>
                                <option value="MP">MP</option>
                                <option value="Sekretariat">Sekretariat</option>
                            </select>
                        ) : (
                            <div className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#2a4574] dark:text-blue-400 bg-blue-50/80 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 rounded-lg">
                                <Building2 className="w-3.5 h-3.5" />
                                <span>Bidang {userBidang || '-'}</span>
                            </div>
                        )}

                        <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 bg-slate-50 dark:bg-slate-800">
                            <button
                                type="button"
                                onClick={() => setViewMode('grid')}
                                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${viewMode === 'grid'
                                    ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-2xs'
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100'
                                }`}
                            >
                                Kalender Grid
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode('list')}
                                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${viewMode === 'list'
                                    ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-100 shadow-2xs'
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100'
                                }`}
                            >
                                Agenda Bulan Ini ({currentMonthEvents.length})
                            </button>
                        </div>
                    </div>
                </div>

                {/* Calendar Navigation Bar */}
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xs border border-slate-200 dark:border-slate-700 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                            {MONTH_NAMES[currentMonth]} {currentYear}
                        </h2>
                        <span className="text-xs px-2.5 py-0.5 rounded-full font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            {filteredEvents.length} total kegiatan
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={handleToday}
                            className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors shadow-2xs"
                        >
                            Hari Ini
                        </button>
                        <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden shadow-2xs">
                            <button
                                type="button"
                                onClick={handlePrevMonth}
                                className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors border-r border-slate-200 dark:border-slate-700"
                                title="Bulan Sebelumnya"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                                type="button"
                                onClick={handleNextMonth}
                                className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
                                title="Bulan Selanjutnya"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                {viewMode === 'grid' ? (
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xs border border-slate-200 dark:border-slate-700 overflow-hidden">
                        {/* Day Headers */}
                        <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-center py-2.5 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            {DAY_NAMES.map((name, idx) => (
                                <div key={name} className={idx === 0 ? 'text-rose-500 dark:text-rose-400' : ''}>
                                    {name}
                                </div>
                            ))}
                        </div>

                        {/* Days Grid */}
                        <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-100 dark:divide-slate-700/50 bg-slate-100/50 dark:bg-slate-800/30">
                            {calendarDays.map((d, index) => {
                                const dayEvents = eventsByDate[d.dateStr] || [];
                                return (
                                    <div
                                        key={index}
                                        className={`min-h-[115px] p-2 flex flex-col justify-between transition-colors ${
                                            d.isCurrentMonth
                                                ? 'bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100'
                                                : 'bg-slate-50/60 dark:bg-slate-900/40 text-slate-400 dark:text-slate-600'
                                        } ${d.isToday ? 'ring-2 ring-inset ring-[#2a4574]' : ''}`}
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <span
                                                className={`text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full ${
                                                    d.isToday
                                                        ? 'bg-[#2a4574] text-white font-bold'
                                                        : !d.isCurrentMonth
                                                            ? 'text-slate-400 dark:text-slate-600'
                                                            : 'text-slate-700 dark:text-slate-200'
                                                }`}
                                            >
                                                {d.dayNumber}
                                            </span>
                                            {dayEvents.length > 0 && (
                                                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                                                    {dayEvents.length} SPJ
                                                </span>
                                            )}
                                        </div>

                                        <div className="space-y-1 overflow-y-auto max-h-[85px] pr-0.5">
                                            {dayEvents.map((evt) => (
                                                <button
                                                    key={evt.id}
                                                    type="button"
                                                    onClick={() => setSelectedEvent(evt)}
                                                    className={`w-full text-left px-2 py-1 rounded-md text-[11px] font-medium border truncate transition-colors block ${getBidangColor(evt.bidang)}`}
                                                    title={`${evt.title || evt.kegiatan} (${evt.bidang})`}
                                                >
                                                    {evt.title || evt.kegiatan}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    /* Agenda List View */
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xs border border-slate-200 dark:border-slate-700 overflow-hidden">
                        <div className="p-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-between">
                            <h3 className="font-semibold text-slate-800 dark:text-slate-100 text-sm flex items-center gap-2">
                                <CalendarDays className="w-4 h-4 text-[#2a4574] dark:text-blue-400" />
                                Agenda SPJ Bulan {MONTH_NAMES[currentMonth]} {currentYear}
                            </h3>
                            <span className="text-xs text-slate-500 dark:text-slate-400">
                                {currentMonthEvents.length} berkas SPJ
                            </span>
                        </div>

                        {currentMonthEvents.length > 0 ? (
                            <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
                                {currentMonthEvents.map((item) => (
                                    <div
                                        key={item.id}
                                        className="p-4 hover:bg-slate-50 dark:bg-slate-800/75 dark:hover:bg-slate-800/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-[#2a4574] dark:text-blue-400 flex flex-col items-center justify-center shrink-0 border border-blue-100 dark:border-blue-900">
                                                <span className="text-xs font-bold leading-none">
                                                    {new Date(item.start || item.tanggal_spj).getDate()}
                                                </span>
                                                <span className="text-[9px] uppercase font-semibold leading-none mt-0.5">
                                                    {MONTH_NAMES[currentMonth].slice(0, 3)}
                                                </span>
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">
                                                    {item.title || item.kegiatan}
                                                </h4>
                                                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                                                    <span className="flex items-center gap-1">
                                                        <Building2 className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                                                        Bidang {item.bidang}
                                                    </span>
                                                    {item.nominal && (
                                                        <span className="flex items-center gap-1">
                                                            <Wallet className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                                                            {formatCurrency(item.nominal)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 self-end sm:self-center">
                                            <button
                                                type="button"
                                                onClick={() => setSelectedEvent(item)}
                                                className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                            >
                                                Preview
                                            </button>
                                            <Link
                                                href={`/spj/${item.id}`}
                                                className="px-3 py-1.5 text-xs font-medium text-white bg-[#2a4574] hover:bg-[#22385e] rounded-lg shadow-2xs transition-colors"
                                            >
                                                Lihat SPJ
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-12 text-center">
                                <CalendarIcon className="w-10 h-10 stroke-1 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
                                    {!isKeuangan && userBidang
                                        ? `Tidak ada agenda berkas SPJ untuk Bidang ${userBidang} pada bulan ini`
                                        : 'Tidak ada agenda berkas SPJ pada bulan ini'}
                                </p>
                                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                                    Gunakan tombol navigasi di atas untuk melihat bulan lain
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Event Detail Modal */}
            {selectedEvent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-700 animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700 mb-4">
                            <h3 className="font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-[#2a4574] dark:text-blue-400" />
                                Detail Agenda SPJ
                            </h3>
                            <button
                                type="button"
                                onClick={() => setSelectedEvent(null)}
                                className="text-slate-400 hover:text-slate-600 dark:text-slate-300 dark:hover:text-slate-200 p-1 rounded-lg hover:bg-slate-100 dark:bg-slate-700 dark:hover:bg-slate-800 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-3.5 text-xs">
                            <div>
                                <span className="text-slate-400 dark:text-slate-500 block mb-1">Nama Kegiatan:</span>
                                <p className="font-semibold text-slate-800 dark:text-slate-100 text-sm leading-relaxed bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
                                    {selectedEvent.title || selectedEvent.kegiatan}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <span className="text-slate-400 dark:text-slate-500 block mb-1">Tanggal SPJ:</span>
                                    <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-200">
                                        <Clock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                                        {formatDisplayDate(selectedEvent.start || selectedEvent.tanggal_spj)}
                                    </div>
                                </div>
                                <div>
                                    <span className="text-slate-400 dark:text-slate-500 block mb-1">Bidang:</span>
                                    <div className="flex items-center gap-1.5 font-medium text-slate-700 dark:text-slate-200">
                                        <Building2 className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                                        {selectedEvent.bidang || '-'}
                                    </div>
                                </div>
                            </div>

                            {selectedEvent.nominal && (
                                <div>
                                    <span className="text-slate-400 dark:text-slate-500 block mb-1">Nominal:</span>
                                    <div className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                                        {formatCurrency(selectedEvent.nominal)}
                                    </div>
                                </div>
                            )}

                            {selectedEvent.status && (
                                <div>
                                    <span className="text-slate-400 dark:text-slate-500 block mb-1">Status:</span>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                                        {selectedEvent.status}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-end gap-2.5 pt-5 mt-4 border-t border-slate-100 dark:border-slate-700">
                            <button
                                type="button"
                                onClick={() => setSelectedEvent(null)}
                                className="px-4 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:bg-slate-700 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            >
                                Tutup
                            </button>
                            <Link
                                href={`/spj/${selectedEvent.id}`}
                                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-white bg-[#2a4574] hover:bg-[#22385e] rounded-lg shadow-sm transition-colors"
                            >
                                <Eye className="w-3.5 h-3.5" />
                                Buka Berkas SPJ
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
