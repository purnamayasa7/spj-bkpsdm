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

        $query = Spj::query();

        if ($user->role_id === 2) {
            $query->where('bidang', $user->bidang);
        }

        $totalDikirim   = (clone $query)->where('status', 'Dikirim')->count();
        $totalDikoreksi = (clone $query)->where('status', 'Dikoreksi')->count();
        $totalDisetujui = (clone $query)->where('status', 'Disetujui')->count();
        $totalDitolak   = (clone $query)->where('status', 'Ditolak')->count();

        $rekapStatus = Spj::selectRaw('status, COUNT(*) as total')
            ->when($user->role_id === 2, fn($q) => $q->where('bidang', $user->bidang))
            ->groupBy('status')
            ->pluck('total', 'status');

        $semuaStatus = ['Dikirim', 'Dikoreksi', 'Disetujui', 'Ditolak'];

        foreach ($semuaStatus as $status) {
            if (!isset($rekapStatus[$status])) {
                $rekapStatus[$status] = 0;
            }
        }

        $rekapStatus = collect($rekapStatus)->sortBy(function ($value, $key) use ($semuaStatus) {
            return array_search($key, $semuaStatus);
        });


        // Rekap per bidang
        $rekapBidang = collect();
        if ($user->role_id === 1) {
            $rekapBidang = Spj::select('bidang', DB::raw('COUNT(*) as total'))
                ->groupBy('bidang')
                ->orderBy('bidang')
                ->get();
        }

        // Rekap bulanan total SPJ
        $rekapTahunan = Spj::select(
            DB::raw('MONTH(created_at) as bulan'),
            DB::raw('COUNT(*) as total')
        )
            ->whereYear('created_at', date('Y'))
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

        // Isi data per bulan
        $rekapData = array_fill(0, 12, 0);
        foreach ($rekapTahunan as $r) {
            $rekapData[$r->bulan - 1] = $r->total;
        }

        $roleLabel = $user->role_id === 1 ? 'Keuangan' : 'Bidang';

        // Rekap aktivitas hari ini

        $recentActivities = collect();
        if ($user->role_id === 1) {
            $recentActivities = \App\Models\Activities::latest()->take(7)->get();
        }


        return view('pages.dashboard', compact(
            'totalDikirim',
            'totalDikoreksi',
            'totalDisetujui',
            'totalDitolak',
            'rekapStatus',
            'rekapBidang',
            'rekapData',
            'bulanLabels',
            'roleLabel',
            'user',
            'recentActivities'
        ));
    }
}
