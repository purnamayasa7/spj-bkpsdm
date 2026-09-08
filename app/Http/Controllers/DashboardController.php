<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Spj;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();

        $year = (int) $request->get('year', now()->year);

        if (!in_array($year, [2025, 2026])) {
            $year = 2025;
        }

        $baseQuery = Spj::whereYear('created_at', $year);

        if ($user->role_id === 2) {
            $baseQuery->where('bidang', $user->bidang);
        }

        // ===== CARD =====
        $totalDikirim   = (clone $baseQuery)->where('status', 'Dikirim')->count();
        $totalDikoreksi = (clone $baseQuery)->where('status', 'Dikoreksi')->count();
        $totalDisetujui = (clone $baseQuery)->where('status', 'Disetujui')->count();
        $totalDitolak   = (clone $baseQuery)->where('status', 'Ditolak')->count();

        // ===== FINANCIAL METRICS =====
        $totalNominalDisetujui = (int) (clone $baseQuery)->where('status', 'Disetujui')->sum('nilai');
        $totalNominalDikirim   = (int) (clone $baseQuery)->where('status', 'Dikirim')->sum('nilai');

        // ===== REKAP BIDANG & ANTREAN REVIEW (ROLE 1 / KEUANGAN) =====
        $rekapBidang = collect();
        $antreanReview = collect();
        $recentActivities = collect();

        if ($user->role_id === 1) {
            $rekapBidang = Spj::select('bidang', DB::raw('COUNT(*) as total'))
                ->whereYear('created_at', $year)
                ->groupBy('bidang')
                ->orderBy('bidang')
                ->get();

            $antreanReview = Spj::select('id', 'bidang', 'kegiatan', 'nilai', 'created_at')
                ->whereYear('created_at', $year)
                ->where('status', 'Dikirim')
                ->orderBy('created_at', 'asc')
                ->take(5)
                ->get()
                ->map(function ($s) {
                    return [
                        'id' => $s->id,
                        'bidang' => $s->bidang,
                        'kegiatan' => $s->kegiatan,
                        'nilai' => $s->nilai,
                        'created_at_formatted' => $s->created_at ? $s->created_at->translatedFormat('d M Y') : '-',
                        'time_ago' => $s->created_at ? $s->created_at->diffForHumans() : '',
                    ];
                });

            $recentActivities = \App\Models\Activities::with('user')->latest()->take(7)->get()->map(function ($act) {
                return [
                    'id' => $act->id,
                    'action' => $act->action,
                    'description' => $act->description,
                    'bidang' => $act->bidang,
                    'user_name' => $act->user->name ?? 'User',
                    'time_ago' => $act->created_at ? $act->created_at->diffForHumans() : '',
                ];
            });
        }

        // ===== WIDGET KHUSUS BIDANG (ROLE 2) =====
        $perluPerbaikan = collect();
        $pengajuanTerbaruBidang = collect();

        if ($user->role_id === 2) {
            $perluPerbaikan = Spj::select('id', 'kegiatan', 'nilai', 'keterangan', 'updated_at')
                ->whereYear('created_at', $year)
                ->where('bidang', $user->bidang)
                ->where('status', 'Dikoreksi')
                ->latest('updated_at')
                ->take(5)
                ->get()
                ->map(function ($s) {
                    return [
                        'id' => $s->id,
                        'kegiatan' => $s->kegiatan,
                        'nilai' => $s->nilai,
                        'keterangan' => $s->keterangan ?: 'Menunggu perbaikan berkas sesuai arahan verifikator.',
                        'updated_at_formatted' => $s->updated_at ? $s->updated_at->translatedFormat('d M Y') : '-',
                        'time_ago' => $s->updated_at ? $s->updated_at->diffForHumans() : '',
                    ];
                });

            $pengajuanTerbaruBidang = Spj::select('id', 'kegiatan', 'nilai', 'status', 'created_at')
                ->whereYear('created_at', $year)
                ->where('bidang', $user->bidang)
                ->latest()
                ->take(5)
                ->get()
                ->map(function ($s) {
                    return [
                        'id' => $s->id,
                        'kegiatan' => $s->kegiatan,
                        'nilai' => $s->nilai,
                        'status' => $s->status,
                        'created_at_formatted' => $s->created_at ? $s->created_at->translatedFormat('d M Y') : '-',
                        'time_ago' => $s->created_at ? $s->created_at->diffForHumans() : '',
                    ];
                });
        }

        // ===== REKAP BULANAN =====
        $rekapTahunan = Spj::select(
            DB::raw('MONTH(created_at) as bulan'),
            DB::raw('COUNT(*) as total')
        )
            ->whereYear('created_at', $year)
            ->when($user->role_id === 2, fn($q) => $q->where('bidang', $user->bidang))
            ->groupBy(DB::raw('MONTH(created_at)'))
            ->orderBy(DB::raw('MONTH(created_at)'))
            ->get();

        $bulanLabels = [
            'Januari',
            'Februari',
            'Maret',
            'April',
            'Mei',
            'Juni',
            'Juli',
            'Agustus',
            'September',
            'Oktober',
            'November',
            'Desember'
        ];

        $rekapData = array_fill(0, 12, 0);
        foreach ($rekapTahunan as $r) {
            $rekapData[$r->bulan - 1] = $r->total;
        }

        $roleLabel = $user->role_id === 1 ? 'Keuangan' : 'Bidang';

        return Inertia::render('Dashboard/Index', [
            'totalDikirim' => $totalDikirim,
            'totalDikoreksi' => $totalDikoreksi,
            'totalDisetujui' => $totalDisetujui,
            'totalDitolak' => $totalDitolak,
            'totalNominalDisetujui' => $totalNominalDisetujui,
            'totalNominalDikirim' => $totalNominalDikirim,
            'rekapBidang' => $rekapBidang,
            'rekapData' => $rekapData,
            'bulanLabels' => $bulanLabels,
            'roleLabel' => $roleLabel,
            'recentActivities' => $recentActivities,
            'antreanReview' => $antreanReview,
            'perluPerbaikan' => $perluPerbaikan,
            'pengajuanTerbaruBidang' => $pengajuanTerbaruBidang,
            'year' => (string) $year,
        ]);
    }

    // ================= AJAX =================
    public function data(Request $request)
    {
        $user = Auth::user();

        // ===== VALIDASI TAHUN =====
        $year = in_array((int)$request->year, [2025, 2026])
            ? (int)$request->year
            : date('Y');

        // ===== BASE QUERY =====
        $baseQuery = Spj::whereYear('created_at', $year);

        if ($user->role_id === 2) {
            $baseQuery->where('bidang', $user->bidang);
        }

        // ===== CARD =====
        $cards = [
            'dikirim'   => (clone $baseQuery)->where('status', 'Dikirim')->count(),
            'dikoreksi' => (clone $baseQuery)->where('status', 'Dikoreksi')->count(),
            'disetujui' => (clone $baseQuery)->where('status', 'Disetujui')->count(),
            'ditolak'   => (clone $baseQuery)->where('status', 'Ditolak')->count(),
        ];

        // ===== BULANAN =====
        $bulanan = array_fill(0, 12, 0);

        $bulananData = Spj::select(
            DB::raw('MONTH(created_at) as bulan'),
            DB::raw('COUNT(*) as total')
        )
            ->whereYear('created_at', $year)
            ->when($user->role_id === 2, fn($q) => $q->where('bidang', $user->bidang))
            ->groupBy(DB::raw('MONTH(created_at)'))
            ->pluck('total', 'bulan');

        foreach ($bulananData as $bulan => $total) {
            $bulanan[$bulan - 1] = $total;
        }

        // ===== BIDANG (ROLE 1 SAJA) =====
        $bidang = collect();
        if ($user->role_id === 1) {
            $bidang = Spj::select('bidang', DB::raw('COUNT(*) as total'))
                ->whereYear('created_at', $year)
                ->groupBy('bidang')
                ->orderBy('bidang')
                ->get();
        }

        return response()->json([
            'cards'   => $cards,
            'bulanan' => $bulanan,
            'bidang'  => $bidang,
        ]);
    }
}
