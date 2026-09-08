<?php

namespace App\Http\Controllers;

use App\Models\Spj;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

use Inertia\Inertia;

class SpjHistoryController extends Controller
{
    public function index()
    {
        $year = request('year', now()->year);
        $user = Auth::user();

        $query = Spj::whereYear('created_at', $year);

        if ($user->role && $user->role->name !== 'Keuangan') {
            $query->where('Bidang', $user->bidang);
        }

        $spj = $query->latest()->get();

        return Inertia::render('History/Index', [
            'spj' => $spj,
            'year' => (string) $year,
        ]);
    }

    public function show(Spj $spj)
    {
        $user = Auth::user();

        if ($user->role && $user->role->name !== 'Keuangan' && $spj->bidang !== $user->bidang) {
            abort(403, 'Anda tidak memiliki akses ke SPJ ini.');
        }

        $histories = $spj->histories()
            ->with('actor')
            ->orderBy('created_at', 'asc')
            ->get();

        return Inertia::render('History/Show', [
            'spj' => $spj,
            'histories' => $histories,
        ]);
    }
}

