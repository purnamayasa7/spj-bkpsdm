<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Spj;

use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CalendarController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $query = Spj::select(
            'id',
            'kegiatan as title',
            'tanggal_spj as start',
            'bidang',
            'status',
            'nilai as nominal'
        );

        // Jika role Bidang, batasi hanya sesuai bidang user yang login
        if ($user && ($user->role_id === 2 || $user->role?->name === 'Bidang')) {
            $query->where('bidang', $user->bidang);
        }

        $events = $query->get();

        return Inertia::render('Calendar/Index', [
            'events' => $events,
        ]);
    }

    public function events()
    {
        $user = Auth::user();
        $query = Spj::select(
            'id',
            'kegiatan as title',
            'tanggal_spj as start',
            'bidang'
        );

        // Jika role Bidang, batasi hanya sesuai bidang user yang login
        if ($user && ($user->role_id === 2 || $user->role?->name === 'Bidang')) {
            $query->where('bidang', $user->bidang);
        }

        $events = $query->get();

        return response()->json($events);
    }
}
