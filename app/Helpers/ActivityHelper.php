<?php

use App\Models\Activities;
use Illuminate\Support\Facades\Auth;

if (!function_exists('logActivity')) {

    function logActivity($action, $description = null, $module = null)
    {
        $user = Auth::user();

        if(!$user) return;

        Activities::create([
            'user_id' => Auth::user()->id,
            'bidang' => $user->bidang ?? null,
            'action' => $action,
            'description' => $description,
            'module' => $module,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }
}
