<?php

namespace App\Http\Controllers;

use App\Models\Spj;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Response;

class SpjFileController extends Controller
{
    public function view($spjId, $index)
    {
        abort_unless(Auth::check(), 403);

        $spj = Spj::findOrFail($spjId);

        if (!in_array(Auth::user()->role_id, [1, 2])) {
            abort(403);
        }

        $folder = "/home/ppispj/spj_uploads/spj/{$spj->kode}";

        if (!is_dir($folder)) {
            abort(404);
        }

        $files = glob($folder . '/*.pdf');

        if (!$files || !isset($files[$index])) {
            abort(404);
        }

        return response()->file($files[$index], [
            'Content-Type' => 'application/pdf',
            'Content-Disposition' => 'inline'
        ]);
    }
}
