<?php

namespace App\Exports;

use App\Models\Activities;
use Illuminate\Contracts\View\View;
use Maatwebsite\Excel\Concerns\FromView;

class ActivityExport implements FromView
{
    protected $activities;

    public function __construct($activities)
    {
        $this->activities = $activities;
    }

    public function view(): View
    {
        return view('pages.spj.export.activity-excel', [
            'activities' => $this->activities
        ]);
    }
}
