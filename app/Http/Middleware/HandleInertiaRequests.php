<?php

namespace App\Http\Middleware;

use App\Models\Spj;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();

        return array_merge(parent::share($request), [
            'csrf_token' => csrf_token(),
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role?->name ?? ($user->role_id === 1 ? 'Keuangan' : 'Bidang'),
                    'role_id' => $user->role_id,
                    'bidang' => $user->bidang,
                    'nip' => $user->nip ?? null,
                ] : null,
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
                'warning' => fn () => $request->session()->get('warning'),
                'info' => fn () => $request->session()->get('info'),
            ],
            'unread_notifications_count' => fn () => $user
                ? $user->unreadNotifications()->count()
                : 0,
            'recent_notifications' => fn () => $user
                ? $user->notifications()->latest()->take(5)->get()->map(function ($n) {
                    return [
                        'id' => $n->id,
                        'data' => $n->data,
                        'read_at' => $n->read_at ? $n->read_at->toIso8601String() : null,
                        'created_at' => $n->created_at ? $n->created_at->diffForHumans() : '',
                    ];
                })
                : [],
            'sidebar_counts' => fn () => $user ? [
                'pending_review' => ($user->role_id === 1 || ($user->role?->name ?? '') === 'Keuangan')
                    ? Spj::where('status', 'Dikirim')->whereYear('created_at', now()->year)->count()
                    : 0,
                'sedang_dikoreksi' => ($user->role_id === 1 || ($user->role?->name ?? '') === 'Keuangan')
                    ? Spj::where('status', 'Dikoreksi')->whereYear('created_at', now()->year)->count()
                    : 0,
                'needs_revision' => ($user->role_id !== 1 && ($user->role?->name ?? '') !== 'Keuangan' && $user->bidang)
                    ? Spj::where('bidang', $user->bidang)->where('status', 'Dikoreksi')->whereYear('created_at', now()->year)->count()
                    : 0,
            ] : [
                'pending_review' => 0,
                'sedang_dikoreksi' => 0,
                'needs_revision' => 0,
            ],
        ]);
    }
}
