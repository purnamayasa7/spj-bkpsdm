import React from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import {
    Bell,
    CheckCheck,
    Check,
    Clock,
    FileText,
    Send,
    RefreshCw,
    AlertCircle,
    CheckCircle2,
    XCircle,
    ExternalLink,
    Inbox,
} from 'lucide-react';

export default function NotificationsIndex({ notifications = [] }) {
    const { flash } = usePage().props;

    const handleMarkAllRead = (e) => {
        e.preventDefault();
        router.post('/notifications/read-all');
    };

    const handleMarkAsRead = (id, e) => {
        e.stopPropagation();
        router.post(`/notifications/${id}/read`);
    };

    const formatRelativeTime = (dateStr) => {
        if (!dateStr) return '-';
        try {
            const d = new Date(dateStr);
            const now = new Date();
            const diffMs = now - d;
            const diffSec = Math.floor(diffMs / 1000);
            const diffMin = Math.floor(diffSec / 60);
            const diffHours = Math.floor(diffMin / 60);
            const diffDays = Math.floor(diffHours / 24);

            if (diffSec < 60) return 'Baru saja';
            if (diffMin < 60) return `${diffMin} menit yang lalu`;
            if (diffHours < 24) return `${diffHours} jam yang lalu`;
            if (diffDays < 7) return `${diffDays} hari yang lalu`;

            return new Intl.DateTimeFormat('id-ID', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
            }).format(d);
        } catch {
            return dateStr;
        }
    };

    const getStatusIcon = (status = '', message = '') => {
        const rawStatus = (status || '').toLowerCase();
        const msg = (message || '').toLowerCase();

        // 1. Diperbaiki
        if (
            rawStatus === 'diperbaiki' ||
            (msg.includes('dikoreksi') && msg.includes('menjadi dikirim')) ||
            msg.includes('diperbaiki') ||
            msg.includes('revisi')
        ) {
            return {
                icon: <RefreshCw className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />,
                bg: 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800/60',
            };
        }

        // 2. Disetujui
        if (rawStatus === 'disetujui' || msg.includes('menjadi disetujui') || msg.includes('disetujui')) {
            return {
                icon: <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />,
                bg: 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60',
            };
        }

        // 3. Ditolak
        if (rawStatus === 'ditolak' || msg.includes('menjadi ditolak') || msg.includes('ditolak')) {
            return {
                icon: <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />,
                bg: 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/60',
            };
        }

        // 4. Dikoreksi
        if (rawStatus === 'dikoreksi' || msg.includes('menjadi dikoreksi') || msg.includes('dikoreksi')) {
            return {
                icon: <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400" />,
                bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/60',
            };
        }

        // 5. Dikirim
        if (rawStatus === 'dikirim' || msg.includes('mengirim spj') || msg.includes('dikirim')) {
            return {
                icon: <Send className="w-4 h-4 text-blue-600 dark:text-blue-400" />,
                bg: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800/60',
            };
        }

        return {
            icon: <Bell className="w-4 h-4 text-slate-500 dark:text-slate-400" />,
            bg: 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700',
        };
    };

    const unreadCount = notifications.filter((n) => !n.read_at).length;

    return (
        <AuthenticatedLayout title="Notifikasi">
            <Head title="Pusat Notifikasi" />

            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2.5">
                            <h1 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
                                Pusat Notifikasi
                            </h1>
                            {unreadCount > 0 && (
                                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                                    {unreadCount} baru
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                            Riwayat pembaruan status dan pengajuan SPJ terkini
                        </p>
                    </div>

                    {unreadCount > 0 && (
                        <button
                            type="button"
                            onClick={handleMarkAllRead}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 text-[#2a4574] dark:text-blue-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-2xs self-start sm:self-auto"
                        >
                            <CheckCheck className="w-3.5 h-3.5" />
                            <span>Tandai Semua Dibaca</span>
                        </button>
                    )}
                </div>

                {/* Notifications Container */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xs overflow-hidden">
                    <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-800/60 flex items-center justify-center text-[#2a4574] dark:text-blue-400 shrink-0">
                                <Bell className="w-4 h-4" />
                            </div>
                            <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                                Daftar Pemberitahuan
                            </h2>
                        </div>
                        <span className="text-xs text-slate-400 dark:text-slate-500">
                            Total: {notifications.length} notifikasi
                        </span>
                    </div>

                    {notifications.length > 0 ? (
                        <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
                            {notifications.map((n) => {
                                const isUnread = !n.read_at;
                                const data = n.data || {};
                                const { icon, bg } = getStatusIcon(data.status, data.message);

                                return (
                                    <div
                                        key={n.id}
                                        className={`p-4 flex items-start justify-between gap-4 transition-colors hover:bg-slate-50 dark:bg-slate-800/70 ${
                                            isUnread ? 'bg-blue-50/30 dark:bg-blue-950/20' : ''
                                        }`}
                                    >
                                        <div className="flex items-start gap-3 flex-1 min-w-0">
                                            <div
                                                className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 ${bg}`}
                                            >
                                                {icon}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-0.5">
                                                    <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                                                        {data.title || 'Pemberitahuan SPJ'}
                                                    </h3>
                                                    {isUnread && (
                                                        <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                                                    )}
                                                </div>

                                                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                                                    {data.message || '-'}
                                                </p>

                                                <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-400 dark:text-slate-500">
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        <span>{formatRelativeTime(n.created_at)}</span>
                                                    </span>

                                                    {data.spj_id && (
                                                        <a
                                                            href={`/notifications/${n.id}/open`}
                                                            className="font-semibold text-[#2a4574] hover:underline flex items-center gap-0.5"
                                                        >
                                                            <span>Buka SPJ</span>
                                                            <ExternalLink className="w-2.5 h-2.5" />
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {isUnread && (
                                            <button
                                                type="button"
                                                onClick={(e) => handleMarkAsRead(n.id, e)}
                                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 transition-colors shrink-0"
                                                title="Tandai telah dibaca"
                                            >
                                                <Check className="w-3 h-3" />
                                                <span>Tandai Dibaca</span>
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="p-12 text-center text-slate-400 dark:text-slate-500">
                            <Inbox className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Belum Ada Notifikasi</p>
                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                                Semua pemberitahuan pengajuan dan verifikasi SPJ akan muncul di sini.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
