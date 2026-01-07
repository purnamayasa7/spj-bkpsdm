<?php

namespace App\Http\Controllers;

use App\Models\Activities;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\ActivityExport;


class ActivityController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();

        if (!$request->filled('date_from') && !$request->filled('date_to')) {
            return view('pages.activity.index', [
                'activities' => collect([])
            ]);
        }

        $query = Activities::with('user')->latest();

        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        if ($user->role === 'bidang') {
            $query->where('user_id', $user->id);
        }

        $activities = $query->get();

        return view('pages.activity.index', compact('activities'));
    }

    public function exportPDF(Request $request)
    {
        $user = Auth::user();
        $query = Activities::with('user')->latest();

        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        if ($user->role === 'bidang') {
            $query->where('user_id', $user->id);
        }

        $activities = $query->get();

        $pdf = PDF::loadView('pages.spj.export.activity-pdf', compact('activities'));
        return $pdf->stream('activity_' . now()->format('Ymd_His') . '.pdf');
    }

    public function exportExcel(Request $request)
    {
        $user = Auth::user();
        $query = Activities::with('user')->latest();

        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        if ($user->role === 'bidang') {
            $query->where('user_id', $user->id);
        }

        $activities = $query->get();

        return Excel::download(
            new ActivityExport($activities),
            'activity_' . now()->format('Ymd_His') . '.xlsx'
        );
    }
}
