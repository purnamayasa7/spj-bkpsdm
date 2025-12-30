<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Spj;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $year = now()->year;

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

        // ===== REKAP BIDANG (ROLE 1 SAJA) =====
        $rekapBidang = collect();
        if ($user->role_id === 1) {
            $rekapBidang = Spj::select('bidang', DB::raw('COUNT(*) as total'))
                ->whereYear('created_at', $year)
                ->groupBy('bidang')
                ->orderBy('bidang')
                ->get();
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

        $recentActivities = collect();
        if ($user->role_id === 1) {
            $recentActivities = \App\Models\Activities::latest()->take(7)->get();
        }

        return view('pages.dashboard', compact(
            'totalDikirim',
            'totalDikoreksi',
            'totalDisetujui',
            'totalDitolak',
            'rekapBidang',
            'rekapData',
            'bulanLabels',
            'roleLabel',
            'user',
            'recentActivities',
            'year'
        ));
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
