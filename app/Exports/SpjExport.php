<?php

namespace App\Exports;

use App\Models\Spj;
use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;
use Illuminate\Support\Facades\Auth;

class SpjExport implements FromView
{
    protected $req;

    public function __construct($req)
    {
        $this->req = $req;
    }

    public function view(): View
    {
        $query = Spj::query();

        if ($this->req->filled('dariTanggal') && $this->req->filled('sampaiTanggal')) {
            $query->whereBetween('tanggal_spj', [$this->req->dariTanggal, $this->req->sampaiTanggal]);
        }

        if ($this->req->filled('status')) {
            $query->where('status', $this->req->status);
        }

        if (Auth::user()->role_id == 1) {
            if ($this->req->filled('bidang')) {
                $query->where('bidang', $this->req->bidang);
            }
        }

        if (Auth::user()->role_id == 2) {
            $query->where('bidang', Auth::user()->bidang);
        }

        return view('pages.spj.export.export-excel', [
            'spj' => $query->get()
        ]);
    }
}
