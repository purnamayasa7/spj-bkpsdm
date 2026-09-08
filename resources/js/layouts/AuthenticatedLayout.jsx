import React, { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import {
    LayoutDashboard,
    FileText,
    History,
    Calendar,
    Users,
    UserCheck,
    Database,
    ChevronDown,
    ChevronRight,
    Menu,
    X,
    Bell,
    LogOut,
    User,
    KeyRound,
    CheckCircle2,
    AlertCircle,
    FileCheck2,
    CheckCheck,
    Send,
    RefreshCw,
    XCircle,
    PlusCircle,
    Clock,
    Receipt,
    HelpCircle,
    Activity,
    Sun,
    Moon,
} from 'lucide-react';
import { cn, getInitials } from '@/lib/utils';

const getNotificationItemMeta = (notif) => {
    const rawStatus = (notif?.data?.status || '').toLowerCase();
    const msg = (notif?.data?.message || '').toLowerCase();

    // 1. Diperbaiki (Revisi SPJ dari Bidang)
    if (
        rawStatus === 'diperbaiki' ||
        (msg.includes('dikoreksi') && msg.includes('menjadi dikirim')) ||
        msg.includes('diperbaiki') ||
        msg.includes('revisi')
    ) {
        return {
            bg: 'bg-indigo-600',
            icon: RefreshCw,
        };
    }

    // 2. Disetujui
    if (
        rawStatus === 'disetujui' ||
        msg.includes('menjadi disetujui') ||
        msg.includes('disetujui')
    ) {
        return {
            bg: 'bg-emerald-600',
            icon: CheckCircle2,
        };
    }

    // 3. Ditolak
    if (
        rawStatus === 'ditolak' ||
        msg.includes('menjadi ditolak') ||
        msg.includes('ditolak')
    ) {
        return {
            bg: 'bg-rose-600',
            icon: XCircle,
        };
    }

    // 4. Dikoreksi
    if (
        rawStatus === 'dikoreksi' ||
        msg.includes('menjadi dikoreksi') ||
        msg.includes('dikoreksi')
    ) {
        return {
            bg: 'bg-amber-500',
            icon: AlertCircle,
        };
    }

    // 5. Dikirim (Pengiriman SPJ baru)
    if (
        rawStatus === 'dikirim' ||
        msg.includes('mengirim spj') ||
        msg.includes('dikirim')
    ) {
        return {
            bg: 'bg-blue-600',
            icon: Send,
        };
    }

    return {
        bg: 'bg-[#2a4574]',
        icon: FileText,
    };
};

export default function AuthenticatedLayout({ children, title }) {
    const page = usePage();
    const { auth, flash, unread_notifications_count = 0, recent_notifications = [], sidebar_counts = {} } = page.props || {};
    const url = page.url || window?.location?.pathname || '';
    const user = auth?.user || {};
    const isKeuangan = user.role === 'Keuangan' || user.role_id === 1;

    const pendingReviewCount = sidebar_counts?.pending_review || 0;
    const sedangDikoreksiCount = sidebar_counts?.sedang_dikoreksi || 0;
    const needsRevisionCount = sidebar_counts?.needs_revision || 0;

    // Mobile drawer state
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Desktop collapsible sidebar state (saved in localStorage)
    const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
        try {
            return localStorage.getItem('sidebar_collapsed') === 'true';
        } catch {
            return false;
        }
    });

    // Dropdowns
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

    // Dark mode state
    const [isDark, setIsDark] = useState(() => {
        try {
            if (typeof window !== 'undefined') {
                return document.documentElement.classList.contains('dark');
            }
        } catch {}
        return false;
    });

    const toggleTheme = () => {
        const nextDark = !isDark;
        setIsDark(nextDark);
        try {
            if (nextDark) {
                document.documentElement.classList.add('dark');
                localStorage.setItem('theme', 'dark');
            } else {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('theme', 'light');
            }
        } catch {}
    };

    const toggleSidebarCollapse = () => {
        setSidebarCollapsed((prev) => {
            const next = !prev;
            try {
                localStorage.setItem('sidebar_collapsed', String(next));
            } catch { }
            return next;
        });
    };

    const handleLogout = (e) => {
        e.preventDefault();
        router.post('/logout');
    };

    const isActive = (path) => {
        if (!path || !url) return false;
        if (path === '/dashboard') return url === '/dashboard';
        if (path === '/keuangan/spj') {
            return url === '/keuangan/spj' || (url.startsWith('/keuangan/spj/') && !url.includes('/dikoreksi') && !url.includes('/disetujui'));
        }
        if (path === '/keuangan/spj/dikoreksi') return url.startsWith('/keuangan/spj/dikoreksi');
        if (path === '/keuangan/spj/disetujui') return url.startsWith('/keuangan/spj/disetujui');
        if (path === '/spj/create') return url.startsWith('/spj/create');
        if (path === '/spj?status=Dikoreksi') {
            return url === '/spj' && (typeof window !== 'undefined' && window.location.search.toLowerCase().includes('status=dikoreksi'));
        }
        if (path === '/spj') {
            return url === '/spj' && (typeof window === 'undefined' || !window.location.search.toLowerCase().includes('status=dikoreksi'));
        }
        return url.startsWith(path);
    };

    const getPageTitle = () => {
        if (title) return title;
        if (url === '/dashboard') return 'Dashboard';
        if (url.includes('/keuangan/spj/dikoreksi')) return 'SPJ Sedang Dikoreksi';
        if (url.includes('/keuangan/spj/disetujui')) return 'Laporan SPJ Disetujui';
        if (url.includes('/keuangan/spj')) return 'Review SPJ';
        if (url.includes('/generator')) return 'Generator Dokumen SPJ';
        if (url.includes('/panduan')) return 'Panduan & Checklist SPJ';
        if (url.includes('/spj/create')) return 'Buat SPJ Baru';
        if (url.includes('/edit')) return 'Edit SPJ';
        if (url.match(/\/spj\/[^\/]+$/)) return 'Detail SPJ';
        if (url.startsWith('/spj-history')) return 'Riwayat SPJ';
        if (url.startsWith('/spj')) return 'Data SPJ Bidang';
        if (url.startsWith('/calendar')) return 'Kalender SPJ';
        if (url.includes('/pegawai')) return 'Master Pegawai';
        if (url.startsWith('/activity')) return 'Log Aktivitas User';
        if (url.includes('/backup')) return 'Backup Database';
        if (url.startsWith('/user')) return 'Manajemen User';
        if (url.startsWith('/register')) return 'Tambah User Baru';
        if (url.startsWith('/profile')) return 'Profil Pengguna';
        if (url.startsWith('/change-password')) return 'Ubah Password';
        if (url.startsWith('/notifications')) return 'Notifikasi';
        return 'E-SPJ';
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0b1324] flex transition-colors duration-200">
            {/* Mobile Backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    'fixed inset-y-0 left-0 z-40 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-all duration-300 ease-in-out lg:sticky lg:top-0 lg:h-screen lg:shrink-0',
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
                    sidebarCollapsed ? 'lg:w-20 w-64' : 'w-64'
                )}
            >
                {/* Logo & Brand */}
                <div className="h-16 shrink-0 flex items-center justify-between px-4 border-b border-slate-100 dark:border-slate-800">
                    <Link
                        href="/dashboard"
                        className={cn(
                            'flex items-center gap-3 transition-all group',
                            sidebarCollapsed ? 'lg:justify-center lg:w-full' : ''
                        )}
                        title="E-SPJ BKPSDM Buleleng"
                    >
                        <div className="w-9 h-9 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 p-1 flex items-center justify-center shrink-0 shadow-2xs group-hover:border-blue-200 group-hover:bg-blue-50/30 transition-all">
                            <img
                                src="https://raw.githubusercontent.com/purnamayasa7/Images/main/KabBuleleng.png"
                                alt="Logo Buleleng"
                                className="w-7 h-7 object-contain"
                            />
                        </div>
                        <div
                            className={cn(
                                'leading-tight transition-opacity duration-200',
                                sidebarCollapsed ? 'lg:hidden' : 'block'
                            )}
                        >
                            <span className="font-extrabold text-[17px] tracking-tight text-slate-900 dark:text-white block">
                                E-SPJ
                            </span>
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 block -mt-0.5">
                                BKPSDM Buleleng
                            </span>
                        </div>
                    </Link>
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="lg:hidden text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 p-1 rounded-md"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Nav Links */}
                <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto custom-scrollbar">
                    {/* SECTION: MENU UTAMA */}
                    {sidebarCollapsed ? (
                        <div className="hidden lg:block my-2 border-t border-slate-100 dark:border-slate-800 mx-2" />
                    ) : (
                        <div className="px-3 pt-1 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                            Menu Utama
                        </div>
                    )}

                    <Link
                        href="/dashboard"
                        title="Dashboard"
                        className={cn(
                            'flex items-center rounded-xl text-sm font-medium transition-all',
                            sidebarCollapsed ? 'lg:justify-center lg:px-0 lg:py-2.5 px-3 py-2.5 gap-3' : 'gap-3 px-3 py-2.5',
                            isActive('/dashboard')
                                ? 'bg-linear-to-r from-[#2a4574] via-[#3b5a97] to-[#4c6fc1] text-white shadow-sm shadow-[#2a4574]/20'
                                : 'text-slate-700 dark:text-slate-300 hover:bg-[#e8f0fe] dark:hover:bg-slate-800 hover:text-[#2a4574] dark:hover:text-blue-400'
                        )}
                    >
                        <LayoutDashboard className={cn('w-4 h-4 shrink-0', isActive('/dashboard') ? 'text-white' : 'text-[#2a4574]')} />
                        <span className={cn(sidebarCollapsed ? 'lg:hidden' : 'inline')}>Dashboard</span>
                    </Link>

                    {isKeuangan ? (
                        /* ================== MENU ROLE KEUANGAN ================== */
                        <>
                            {/* SECTION: VERIFIKASI SPJ */}
                            {sidebarCollapsed ? (
                                <div className="hidden lg:block my-2 border-t border-slate-100 dark:border-slate-800 mx-2" />
                            ) : (
                                <div className="px-3 pt-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                    Verifikasi SPJ
                                </div>
                            )}

                            {/* Antrean Review */}
                            <Link
                                href="/keuangan/spj"
                                title="Antrean Review"
                                className={cn(
                                    'flex items-center justify-between rounded-xl text-sm font-medium transition-all',
                                    sidebarCollapsed ? 'lg:justify-center lg:px-0 lg:py-2.5 px-3 py-2.5' : 'px-3 py-2.5',
                                    isActive('/keuangan/spj')
                                        ? 'bg-linear-to-r from-[#2a4574] via-[#3b5a97] to-[#4c6fc1] text-white shadow-sm shadow-[#2a4574]/20'
                                        : 'text-slate-700 dark:text-slate-300 hover:bg-[#e8f0fe] dark:hover:bg-slate-800 hover:text-[#2a4574] dark:hover:text-blue-400'
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <Clock className={cn('w-4 h-4 shrink-0', isActive('/keuangan/spj') ? 'text-white' : 'text-[#2a4574]')} />
                                    <span className={cn(sidebarCollapsed ? 'lg:hidden' : 'inline')}>Antrean Review</span>
                                </div>
                                {!sidebarCollapsed && pendingReviewCount > 0 && (
                                    <span
                                        className={cn(
                                            'text-[10px] font-bold px-2 py-0.5 rounded-full transition-all',
                                            isActive('/keuangan/spj')
                                                ? 'bg-white/20 text-white'
                                                : 'bg-emerald-100 text-emerald-800 badge-glow-emerald'
                                        )}
                                    >
                                        {pendingReviewCount}
                                    </span>
                                )}
                            </Link>

                            {/* Sedang Dikoreksi */}
                            <Link
                                href="/keuangan/spj/dikoreksi"
                                title="Sedang Dikoreksi (Menunggu Bidang)"
                                className={cn(
                                    'flex items-center justify-between rounded-xl text-sm font-medium transition-all',
                                    sidebarCollapsed ? 'lg:justify-center lg:px-0 lg:py-2.5 px-3 py-2.5' : 'px-3 py-2.5',
                                    isActive('/keuangan/spj/dikoreksi')
                                        ? 'bg-linear-to-r from-[#2a4574] via-[#3b5a97] to-[#4c6fc1] text-white shadow-sm shadow-[#2a4574]/20'
                                        : 'text-slate-700 dark:text-slate-300 hover:bg-[#e8f0fe] dark:hover:bg-slate-800 hover:text-[#2a4574] dark:hover:text-blue-400'
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <AlertCircle className={cn('w-4 h-4 shrink-0', isActive('/keuangan/spj/dikoreksi') ? 'text-white' : 'text-amber-600')} />
                                    <span className={cn(sidebarCollapsed ? 'lg:hidden' : 'inline')}>Sedang Dikoreksi</span>
                                </div>
                                {!sidebarCollapsed && sedangDikoreksiCount > 0 && (
                                    <span
                                        className={cn(
                                            'text-[10px] font-bold px-2 py-0.5 rounded-full transition-all',
                                            isActive('/keuangan/spj/dikoreksi')
                                                ? 'bg-white/20 text-white'
                                                : 'bg-amber-100 text-amber-800 badge-glow-amber'
                                        )}
                                    >
                                        {sedangDikoreksiCount}
                                    </span>
                                )}
                            </Link>

                            {/* Riwayat SPJ */}
                            <Link
                                href="/spj-history"
                                title="Riwayat SPJ"
                                className={cn(
                                    'flex items-center rounded-xl text-sm font-medium transition-all',
                                    sidebarCollapsed ? 'lg:justify-center lg:px-0 lg:py-2.5 px-3 py-2.5 gap-3' : 'gap-3 px-3 py-2.5',
                                    isActive('/spj-history')
                                        ? 'bg-linear-to-r from-[#2a4574] via-[#3b5a97] to-[#4c6fc1] text-white shadow-sm shadow-[#2a4574]/20'
                                        : 'text-slate-700 dark:text-slate-300 hover:bg-[#e8f0fe] dark:hover:bg-slate-800 hover:text-[#2a4574] dark:hover:text-blue-400'
                                )}
                            >
                                <History className={cn('w-4 h-4 shrink-0', isActive('/spj-history') ? 'text-white' : 'text-[#2a4574]')} />
                                <span className={cn(sidebarCollapsed ? 'lg:hidden' : 'inline')}>Riwayat SPJ</span>
                            </Link>

                            {/* SECTION: LAPORAN & JADWAL */}
                            {sidebarCollapsed ? (
                                <div className="hidden lg:block my-2 border-t border-slate-100 dark:border-slate-800 mx-2" />
                            ) : (
                                <div className="px-3 pt-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                    Laporan & Jadwal
                                </div>
                            )}

                            {/* SPJ Disetujui */}
                            <Link
                                href="/keuangan/spj/disetujui"
                                title="SPJ Disetujui (Arsip)"
                                className={cn(
                                    'flex items-center rounded-xl text-sm font-medium transition-all',
                                    sidebarCollapsed ? 'lg:justify-center lg:px-0 lg:py-2.5 px-3 py-2.5 gap-3' : 'gap-3 px-3 py-2.5',
                                    isActive('/keuangan/spj/disetujui')
                                        ? 'bg-linear-to-r from-[#2a4574] via-[#3b5a97] to-[#4c6fc1] text-white shadow-sm shadow-[#2a4574]/20'
                                        : 'text-slate-700 dark:text-slate-300 hover:bg-[#e8f0fe] dark:hover:bg-slate-800 hover:text-[#2a4574] dark:hover:text-blue-400'
                                )}
                            >
                                <FileCheck2 className={cn('w-4 h-4 shrink-0', isActive('/keuangan/spj/disetujui') ? 'text-white' : 'text-[#2a4574]')} />
                                <span className={cn(sidebarCollapsed ? 'lg:hidden' : 'inline')}>SPJ Disetujui</span>
                            </Link>

                            {/* Kalender SPJ */}
                            <Link
                                href="/calendar/spj"
                                title="Kalender SPJ"
                                className={cn(
                                    'flex items-center rounded-xl text-sm font-medium transition-all',
                                    sidebarCollapsed ? 'lg:justify-center lg:px-0 lg:py-2.5 px-3 py-2.5 gap-3' : 'gap-3 px-3 py-2.5',
                                    isActive('/calendar/spj')
                                        ? 'bg-linear-to-r from-[#2a4574] via-[#3b5a97] to-[#4c6fc1] text-white shadow-sm shadow-[#2a4574]/20'
                                        : 'text-slate-700 dark:text-slate-300 hover:bg-[#e8f0fe] dark:hover:bg-slate-800 hover:text-[#2a4574] dark:hover:text-blue-400'
                                )}
                            >
                                <Calendar className={cn('w-4 h-4 shrink-0', isActive('/calendar/spj') ? 'text-white' : 'text-[#2a4574]')} />
                                <span className={cn(sidebarCollapsed ? 'lg:hidden' : 'inline')}>Kalender SPJ</span>
                            </Link>

                            {/* SECTION: ADMINISTRASI & SISTEM */}
                            {sidebarCollapsed ? (
                                <div className="hidden lg:block my-2 border-t border-slate-100 dark:border-slate-800 mx-2" />
                            ) : (
                                <div className="px-3 pt-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                    Administrasi & Sistem
                                </div>
                            )}

                            {/* Manajemen User */}
                            <Link
                                href="/user"
                                title="Manajemen User"
                                className={cn(
                                    'flex items-center rounded-xl text-sm font-medium transition-all',
                                    sidebarCollapsed ? 'lg:justify-center lg:px-0 lg:py-2.5 px-3 py-2.5 gap-3' : 'gap-3 px-3 py-2.5',
                                    isActive('/user')
                                        ? 'bg-linear-to-r from-[#2a4574] via-[#3b5a97] to-[#4c6fc1] text-white shadow-sm shadow-[#2a4574]/20'
                                        : 'text-slate-700 dark:text-slate-300 hover:bg-[#e8f0fe] dark:hover:bg-slate-800 hover:text-[#2a4574] dark:hover:text-blue-400'
                                )}
                            >
                                <Users className={cn('w-4 h-4 shrink-0', isActive('/user') ? 'text-white' : 'text-[#2a4574]')} />
                                <span className={cn(sidebarCollapsed ? 'lg:hidden' : 'inline')}>Manajemen User</span>
                            </Link>

                            {/* Data Pegawai */}
                            <Link
                                href="/keuangan/pegawai"
                                title="Data Pegawai"
                                className={cn(
                                    'flex items-center rounded-xl text-sm font-medium transition-all',
                                    sidebarCollapsed ? 'lg:justify-center lg:px-0 lg:py-2.5 px-3 py-2.5 gap-3' : 'gap-3 px-3 py-2.5',
                                    isActive('/keuangan/pegawai')
                                        ? 'bg-linear-to-r from-[#2a4574] via-[#3b5a97] to-[#4c6fc1] text-white shadow-sm shadow-[#2a4574]/20'
                                        : 'text-slate-700 dark:text-slate-300 hover:bg-[#e8f0fe] dark:hover:bg-slate-800 hover:text-[#2a4574] dark:hover:text-blue-400'
                                )}
                            >
                                <UserCheck className={cn('w-4 h-4 shrink-0', isActive('/keuangan/pegawai') ? 'text-white' : 'text-[#2a4574]')} />
                                <span className={cn(sidebarCollapsed ? 'lg:hidden' : 'inline')}>Data Pegawai</span>
                            </Link>

                            {/* Log Aktivitas */}
                            <Link
                                href="/activity"
                                title="Log Aktivitas"
                                className={cn(
                                    'flex items-center rounded-xl text-sm font-medium transition-all',
                                    sidebarCollapsed ? 'lg:justify-center lg:px-0 lg:py-2.5 px-3 py-2.5 gap-3' : 'gap-3 px-3 py-2.5',
                                    isActive('/activity')
                                        ? 'bg-linear-to-r from-[#2a4574] via-[#3b5a97] to-[#4c6fc1] text-white shadow-sm shadow-[#2a4574]/20'
                                        : 'text-slate-700 dark:text-slate-300 hover:bg-[#e8f0fe] dark:hover:bg-slate-800 hover:text-[#2a4574] dark:hover:text-blue-400'
                                )}
                            >
                                <Activity className={cn('w-4 h-4 shrink-0', isActive('/activity') ? 'text-white' : 'text-[#2a4574]')} />
                                <span className={cn(sidebarCollapsed ? 'lg:hidden' : 'inline')}>Log Aktivitas</span>
                            </Link>

                            {/* Generator Dokumen */}
                            <Link
                                href="/generator"
                                title="Generator Dokumen (Kuitansi/SPD)"
                                className={cn(
                                    'flex items-center rounded-xl text-sm font-medium transition-all',
                                    sidebarCollapsed ? 'lg:justify-center lg:px-0 lg:py-2.5 px-3 py-2.5 gap-3' : 'gap-3 px-3 py-2.5',
                                    isActive('/generator')
                                        ? 'bg-linear-to-r from-[#2a4574] via-[#3b5a97] to-[#4c6fc1] text-white shadow-sm shadow-[#2a4574]/20'
                                        : 'text-slate-700 dark:text-slate-300 hover:bg-[#e8f0fe] dark:hover:bg-slate-800 hover:text-[#2a4574] dark:hover:text-blue-400'
                                )}
                            >
                                <Receipt className={cn('w-4 h-4 shrink-0', isActive('/generator') ? 'text-white' : 'text-[#2a4574]')} />
                                <span className={cn(sidebarCollapsed ? 'lg:hidden' : 'inline')}>Generator Dokumen</span>
                            </Link>

                            {/* Backup Database */}
                            <Link
                                href="/keuangan/backup"
                                title="Backup Database"
                                className={cn(
                                    'flex items-center rounded-xl text-sm font-medium transition-all',
                                    sidebarCollapsed ? 'lg:justify-center lg:px-0 lg:py-2.5 px-3 py-2.5 gap-3' : 'gap-3 px-3 py-2.5',
                                    isActive('/keuangan/backup')
                                        ? 'bg-linear-to-r from-[#2a4574] via-[#3b5a97] to-[#4c6fc1] text-white shadow-sm shadow-[#2a4574]/20'
                                        : 'text-slate-700 dark:text-slate-300 hover:bg-[#e8f0fe] dark:hover:bg-slate-800 hover:text-[#2a4574] dark:hover:text-blue-400'
                                )}
                            >
                                <Database className={cn('w-4 h-4 shrink-0', isActive('/keuangan/backup') ? 'text-white' : 'text-[#2a4574]')} />
                                <span className={cn(sidebarCollapsed ? 'lg:hidden' : 'inline')}>Backup Database</span>
                            </Link>
                        </>
                    ) : (
                        /* ================== MENU ROLE BIDANG ================== */
                        <>
                            {/* SECTION: KELOLA SPJ */}
                            {sidebarCollapsed ? (
                                <div className="hidden lg:block my-2 border-t border-slate-100 dark:border-slate-800 mx-2" />
                            ) : (
                                <div className="px-3 pt-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                    Kelola SPJ
                                </div>
                            )}

                            {/* Buat SPJ Baru (Akses Cepat) */}
                            <Link
                                href="/spj/create"
                                title="Buat SPJ Baru"
                                className={cn(
                                    'flex items-center rounded-xl text-sm font-medium transition-all',
                                    sidebarCollapsed ? 'lg:justify-center lg:px-0 lg:py-2.5 px-3 py-2.5 gap-3' : 'gap-3 px-3 py-2.5',
                                    isActive('/spj/create')
                                        ? 'bg-linear-to-r from-[#2a4574] via-[#3b5a97] to-[#4c6fc1] text-white shadow-sm shadow-[#2a4574]/20'
                                        : 'text-[#2a4574] font-semibold bg-blue-50/70 hover:bg-blue-100/70 border border-blue-200/60'
                                )}
                            >
                                <PlusCircle className={cn('w-4 h-4 shrink-0', isActive('/spj/create') ? 'text-white' : 'text-[#2a4574]')} />
                                <span className={cn(sidebarCollapsed ? 'lg:hidden' : 'inline')}>Buat SPJ Baru</span>
                            </Link>

                            {/* Data SPJ Saya */}
                            <Link
                                href="/spj"
                                title="Data SPJ Saya"
                                className={cn(
                                    'flex items-center rounded-xl text-sm font-medium transition-all',
                                    sidebarCollapsed ? 'lg:justify-center lg:px-0 lg:py-2.5 px-3 py-2.5 gap-3' : 'gap-3 px-3 py-2.5',
                                    isActive('/spj')
                                        ? 'bg-linear-to-r from-[#2a4574] via-[#3b5a97] to-[#4c6fc1] text-white shadow-sm shadow-[#2a4574]/20'
                                        : 'text-slate-700 dark:text-slate-300 hover:bg-[#e8f0fe] dark:hover:bg-slate-800 hover:text-[#2a4574] dark:hover:text-blue-400'
                                )}
                            >
                                <FileText className={cn('w-4 h-4 shrink-0', isActive('/spj') ? 'text-white' : 'text-[#2a4574]')} />
                                <span className={cn(sidebarCollapsed ? 'lg:hidden' : 'inline')}>Data SPJ Saya</span>
                            </Link>

                            {/* Perlu Perbaikan (Dikoreksi) */}
                            <Link
                                href="/spj?status=Dikoreksi"
                                title="Perlu Perbaikan"
                                className={cn(
                                    'flex items-center justify-between rounded-xl text-sm font-medium transition-all',
                                    sidebarCollapsed ? 'lg:justify-center lg:px-0 lg:py-2.5 px-3 py-2.5' : 'px-3 py-2.5',
                                    isActive('/spj?status=Dikoreksi')
                                        ? 'bg-linear-to-r from-[#2a4574] via-[#3b5a97] to-[#4c6fc1] text-white shadow-sm shadow-[#2a4574]/20'
                                        : 'text-slate-700 hover:bg-rose-50 hover:text-rose-700'
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <AlertCircle className={cn('w-4 h-4 shrink-0', isActive('/spj?status=Dikoreksi') ? 'text-white' : 'text-rose-600')} />
                                    <span className={cn(sidebarCollapsed ? 'lg:hidden' : 'inline')}>Perlu Perbaikan</span>
                                </div>
                                {!sidebarCollapsed && needsRevisionCount > 0 && (
                                    <span
                                        className={cn(
                                            'text-[10px] font-bold px-2 py-0.5 rounded-full transition-all',
                                            isActive('/spj?status=Dikoreksi')
                                                ? 'bg-white/20 text-white'
                                                : 'bg-rose-100 text-rose-700 badge-glow-rose'
                                        )}
                                    >
                                        {needsRevisionCount}
                                    </span>
                                )}
                            </Link>

                            {/* Riwayat SPJ */}
                            <Link
                                href="/spj-history"
                                title="Riwayat SPJ"
                                className={cn(
                                    'flex items-center rounded-xl text-sm font-medium transition-all',
                                    sidebarCollapsed ? 'lg:justify-center lg:px-0 lg:py-2.5 px-3 py-2.5 gap-3' : 'gap-3 px-3 py-2.5',
                                    isActive('/spj-history')
                                        ? 'bg-linear-to-r from-[#2a4574] via-[#3b5a97] to-[#4c6fc1] text-white shadow-sm shadow-[#2a4574]/20'
                                        : 'text-slate-700 dark:text-slate-300 hover:bg-[#e8f0fe] dark:hover:bg-slate-800 hover:text-[#2a4574] dark:hover:text-blue-400'
                                )}
                            >
                                <History className={cn('w-4 h-4 shrink-0', isActive('/spj-history') ? 'text-white' : 'text-[#2a4574]')} />
                                <span className={cn(sidebarCollapsed ? 'lg:hidden' : 'inline')}>Riwayat SPJ</span>
                            </Link>

                            {/* SECTION: ALAT & AGENDA */}
                            {sidebarCollapsed ? (
                                <div className="hidden lg:block my-2 border-t border-slate-100 dark:border-slate-800 mx-2" />
                            ) : (
                                <div className="px-3 pt-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                    Alat & Agenda
                                </div>
                            )}

                            {/* Generator Dokumen */}
                            <Link
                                href="/generator"
                                title="Generator Dokumen (Kuitansi/SPD)"
                                className={cn(
                                    'flex items-center rounded-xl text-sm font-medium transition-all',
                                    sidebarCollapsed ? 'lg:justify-center lg:px-0 lg:py-2.5 px-3 py-2.5 gap-3' : 'gap-3 px-3 py-2.5',
                                    isActive('/generator')
                                        ? 'bg-linear-to-r from-[#2a4574] via-[#3b5a97] to-[#4c6fc1] text-white shadow-sm shadow-[#2a4574]/20'
                                        : 'text-slate-700 dark:text-slate-300 hover:bg-[#e8f0fe] dark:hover:bg-slate-800 hover:text-[#2a4574] dark:hover:text-blue-400'
                                )}
                            >
                                <Receipt className={cn('w-4 h-4 shrink-0', isActive('/generator') ? 'text-white' : 'text-[#2a4574]')} />
                                <span className={cn(sidebarCollapsed ? 'lg:hidden' : 'inline')}>Generator Dokumen</span>
                            </Link>

                            {/* Kalender SPJ */}
                            <Link
                                href="/calendar/spj"
                                title="Kalender SPJ"
                                className={cn(
                                    'flex items-center rounded-xl text-sm font-medium transition-all',
                                    sidebarCollapsed ? 'lg:justify-center lg:px-0 lg:py-2.5 px-3 py-2.5 gap-3' : 'gap-3 px-3 py-2.5',
                                    isActive('/calendar/spj')
                                        ? 'bg-linear-to-r from-[#2a4574] via-[#3b5a97] to-[#4c6fc1] text-white shadow-sm shadow-[#2a4574]/20'
                                        : 'text-slate-700 dark:text-slate-300 hover:bg-[#e8f0fe] dark:hover:bg-slate-800 hover:text-[#2a4574] dark:hover:text-blue-400'
                                )}
                            >
                                <Calendar className={cn('w-4 h-4 shrink-0', isActive('/calendar/spj') ? 'text-white' : 'text-[#2a4574]')} />
                                <span className={cn(sidebarCollapsed ? 'lg:hidden' : 'inline')}>Kalender SPJ</span>
                            </Link>

                            {/* SECTION: INFORMASI */}
                            {sidebarCollapsed ? (
                                <div className="hidden lg:block my-2 border-t border-slate-100 dark:border-slate-800 mx-2" />
                            ) : (
                                <div className="px-3 pt-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                    Informasi
                                </div>
                            )}

                            {/* Panduan & Checklist */}
                            <Link
                                href="/panduan/checklist"
                                title="Panduan & Checklist SPJ"
                                className={cn(
                                    'flex items-center rounded-xl text-sm font-medium transition-all',
                                    sidebarCollapsed ? 'lg:justify-center lg:px-0 lg:py-2.5 px-3 py-2.5 gap-3' : 'gap-3 px-3 py-2.5',
                                    isActive('/panduan/checklist')
                                        ? 'bg-linear-to-r from-[#2a4574] via-[#3b5a97] to-[#4c6fc1] text-white shadow-sm shadow-[#2a4574]/20'
                                        : 'text-slate-700 dark:text-slate-300 hover:bg-[#e8f0fe] dark:hover:bg-slate-800 hover:text-[#2a4574] dark:hover:text-blue-400'
                                )}
                            >
                                <HelpCircle className={cn('w-4 h-4 shrink-0', isActive('/panduan/checklist') ? 'text-white' : 'text-[#2a4574]')} />
                                <span className={cn(sidebarCollapsed ? 'lg:hidden' : 'inline')}>Panduan & Checklist</span>
                            </Link>
                        </>
                    )}
                </nav>

                {/* Sidebar Footer - Login Sebagai (Pinned at Bottom) */}
                <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80 shrink-0">
                    <div className={cn(sidebarCollapsed ? 'lg:hidden' : 'block')}>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-normal">Login sebagai:</p>
                        <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate mt-0.5">
                            {user.role || (isKeuangan ? 'Keuangan' : user.bidang || 'Bidang')}
                        </p>
                        {user.name && (
                            <p className="text-xs text-slate-400 dark:text-slate-500 truncate mt-0.5">
                                {user.name}
                            </p>
                        )}
                    </div>
                    {sidebarCollapsed && (
                        <div
                            className="hidden lg:flex flex-col items-center justify-center text-center cursor-pointer py-1"
                            title={`Login sebagai: ${user.role || (isKeuangan ? 'Keuangan' : user.bidang || 'Bidang')}${user.name ? ` (${user.name})` : ''}`}>
                            <div className="w-8 h-8 rounded-full bg-[#2a4574]/10 dark:bg-[#2a4574]/30 text-[#2a4574] dark:text-blue-400 font-bold flex items-center justify-center text-xs">
                                {getInitials(user.name)}
                            </div>
                        </div>
                    )}
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Topbar */}
                <header className="h-16 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6 shadow-2xs transition-colors">
                    <div className="flex items-center gap-3">
                        {/* Mobile drawer toggle */}
                        <button
                            onClick={() => setSidebarOpen(true)}
                            className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                            title="Buka Menu"
                        >
                            <Menu className="w-5 h-5" />
                        </button>

                        {/* Desktop sidebar toggle button */}
                        <button
                            onClick={toggleSidebarCollapse}
                            className="hidden lg:flex p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                            title={sidebarCollapsed ? 'Perluas Sidebar' : 'Ciutkan Sidebar'}
                        >
                            <Menu className="w-5 h-5" />
                        </button>

                        <h1 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-slate-100">
                            {getPageTitle()}
                        </h1>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                        {/* Theme Toggle Button (Sun / Moon) */}
                        <button
                            type="button"
                            onClick={toggleTheme}
                            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                            title={isDark ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
                            aria-label="Toggle Mode Gelap"
                        >
                            {isDark ? (
                                <Sun className="w-5 h-5 text-amber-400 hover:rotate-45 transition-transform" />
                            ) : (
                                <Moon className="w-5 h-5 text-slate-600 dark:text-slate-300 hover:-rotate-12 transition-transform" />
                            )}
                        </button>

                        {/* Notification Bell with Dropdown List */}
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                                className="relative p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                                title="Notifikasi"
                            >
                                <Bell className="w-5 h-5" />
                                {unread_notifications_count > 0 && (
                                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                                        {unread_notifications_count > 9 ? '9+' : unread_notifications_count}
                                    </span>
                                )}
                            </button>

                            {notifDropdownOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-30"
                                        onClick={() => setNotifDropdownOpen(false)}
                                    />
                                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 z-40 overflow-hidden animate-in fade-in zoom-in-95">
                                        {/* Dropdown Header */}
                                        <div className="px-4 py-2.5 bg-[#2a4574] text-white flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Bell className="w-4 h-4" />
                                                <span className="font-bold text-xs uppercase tracking-wider">Notifikasi</span>
                                            </div>
                                            {unread_notifications_count > 0 && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        router.post('/notifications/read-all', {}, { preserveScroll: true });
                                                    }}
                                                    className="text-[11px] text-blue-200 hover:text-white underline transition-colors cursor-pointer"
                                                >
                                                    Tandai semua dibaca
                                                </button>
                                            )}
                                        </div>

                                        {/* Dropdown List Items */}
                                        <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-80 overflow-y-auto custom-scrollbar">
                                            {recent_notifications.length > 0 ? (
                                                recent_notifications.map((notif) => {
                                                    const message = notif.data?.message || 'Pemberitahuan baru';
                                                    const isUnread = !notif.read_at;
                                                    const { bg, icon: IconComp } = getNotificationItemMeta(notif);

                                                    return (
                                                        <a
                                                            key={notif.id}
                                                            href={`/notifications/${notif.id}/open`}
                                                            onClick={() => setNotifDropdownOpen(false)}
                                                            className={cn(
                                                                'flex items-start gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors text-left w-full',
                                                                isUnread && 'bg-blue-50/40 dark:bg-blue-950/30'
                                                            )}
                                                        >
                                                            <div
                                                                className={cn(
                                                                    'w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-white shadow-2xs',
                                                                    bg
                                                                )}
                                                            >
                                                                <IconComp className="w-4 h-4" />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                                                                    {notif.created_at}
                                                                </div>
                                                                <p
                                                                    className={cn(
                                                                        'text-xs leading-snug line-clamp-2 mt-0.5',
                                                                        isUnread ? 'font-bold text-slate-900 dark:text-white' : 'font-normal text-slate-600 dark:text-slate-300'
                                                                    )}
                                                                >
                                                                    {message}
                                                                </p>
                                                            </div>
                                                        </a>
                                                    );
                                                })
                                            ) : (
                                                <div className="p-6 text-center text-slate-400 dark:text-slate-500 text-xs">
                                                    Tidak ada notifikasi baru
                                                </div>
                                            )}
                                        </div>

                                        {/* Dropdown Footer */}
                                        <div className="p-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 text-center">
                                            <Link
                                                href="/notifications"
                                                onClick={() => setNotifDropdownOpen(false)}
                                                className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-[#2a4574] dark:hover:text-blue-400 transition-colors inline-block py-1"
                                            >
                                                Lihat Semua Notifikasi
                                            </Link>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* User Menu Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                                className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                            >
                                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 font-semibold flex items-center justify-center text-xs">
                                    {getInitials(user.name)}
                                </div>
                                <div className="hidden sm:block text-left">
                                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 leading-tight">
                                        {user.name || 'User'}
                                    </p>
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{user.role || 'Member'}</p>
                                </div>
                                <ChevronDown className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                            </button>

                            {userDropdownOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-30"
                                        onClick={() => setUserDropdownOpen(false)}
                                    />
                                    <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 py-1.5 z-40 text-sm animate-in fade-in zoom-in-95">
                                        <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                                            <p className="text-xs text-slate-400 dark:text-slate-500">Masuk sebagai</p>
                                            <p className="font-semibold text-slate-800 dark:text-slate-100 truncate">{user.name}</p>
                                            <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                                                {user.bidang || user.role}
                                            </span>
                                        </div>
                                        <Link
                                            href="/profile"
                                            className="flex items-center gap-2 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                            onClick={() => setUserDropdownOpen(false)}
                                        >
                                            <User className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                                            <span>Profil Saya</span>
                                        </Link>
                                        <Link
                                            href="/change-password"
                                            className="flex items-center gap-2 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                            onClick={() => setUserDropdownOpen(false)}
                                        >
                                            <KeyRound className="w-4 h-4 text-slate-400 dark:text-slate-500" />
                                            <span>Ubah Password</span>
                                        </Link>
                                        <div className="border-t border-slate-100 dark:border-slate-800 my-1" />
                                        <button
                                            onClick={handleLogout}
                                            className="w-full flex items-center gap-2 px-4 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors text-left cursor-pointer"
                                        >
                                            <LogOut className="w-4 h-4 text-rose-500" />
                                            <span>Keluar</span>
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                {/* Flash Messages */}
                {flash?.success && (
                    <div className="mx-4 sm:mx-6 mt-4 p-3.5 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center gap-3 text-emerald-800 dark:text-emerald-200 text-sm">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <span>{flash.success}</span>
                    </div>
                )}
                {flash?.error && (
                    <div className="mx-4 sm:mx-6 mt-4 p-3.5 bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 rounded-xl flex items-center gap-3 text-rose-800 dark:text-rose-200 text-sm">
                        <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0" />
                        <span>{flash.error}</span>
                    </div>
                )}

                {/* Page Content */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}
