<?php

namespace App\Http\Controllers;

use App\Models\Spj;
use Illuminate\Support\Facades\Auth;

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
            abort(404, 'Folder not found');
        }

        $files = glob($folder . '/*.pdf');

        if (empty($files)) {
            abort(404, 'No PDF files found');
        }

        $index = (int) $index;

        if (!array_key_exists($index, $files)) {
            abort(404, 'File not found');
        }

        return response()->file($files[$index], [
            'Content-Type'        => 'application/pdf',
            'Content-Disposition' => 'inline',
        ]);
    }
}
