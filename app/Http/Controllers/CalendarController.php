<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Spj;

class CalendarController extends Controller
{
    public function index()
    {
        return view('pages.spj.calendar');
    }

    public function events()
    {
        $events = Spj::select(
            'id',
            'kegiatan as title',
            'tanggal_spj as start',
            'bidang'
        )->get();

        return response()->json($events);
    }
}
