<?php

namespace App\Http\Controllers;

use App\Models\Spj;
use Illuminate\Support\Facades\Auth;

class SpjFileController extends Controller
{
    public function view($spjId, $index)
    {
        // 1️⃣ Must be authenticated
        abort_unless(Auth::check(), 403);

        // 2️⃣ SPJ must exist
        $spj = Spj::findOrFail($spjId);

        // 3️⃣ Authorization (adjust roles if needed)
        if (!in_array(Auth::user()->role_id, [1, 2])) {
            abort(403);
        }

        // 4️⃣ Absolute Linux upload path
        $folder = "/home/ppispj/spj_uploads/spj/{$spj->kode}";

        if (!is_dir($folder)) {
            abort(404);
        }

        // 5️⃣ Load PDFs and normalize index
        $files = glob($folder . '/*.pdf') ?: [];
        $index = (int) $index;

        if (!isset($files[$index])) {
            abort(404);
        }

        // 6️⃣ Serve PDF securely
        return response()->file($files[$index], [
            'Content-Type'        => 'application/pdf',
            'Content-Disposition' => 'inline',
        ]);
    }
}
