<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Notifications\DatabaseNotification;

class NotificationController extends Controller
{
    
    public function index()
    {
        $user = Auth::user();

        if (!$user) {
            return redirect('/login')->with('error', 'Silakan login terlebih dahulu.');
        }

        $notifications = DatabaseNotification::where('notifiable_id', $user->id)
            ->where('notifiable_type', get_class($user))
            ->latest()

            ->take(50)
            ->get();

        return view('pages.notifications.index', compact('notifications'));
    }

    public function open($id)
    {
        $user = Auth::user();

        if (!$user) {
            return redirect('/login');
        }

        $notification = DatabaseNotification::where('id', $id)
            ->where('notifiable_id', $user->id)
            ->where('notifiable_type', get_class($user))
            ->first();

        if ($notification) {
            $notification->markAsRead();

            // Ambil SPJ ID dari notifikasi
            $spjId = $notification->data['spj_id'] ?? null;

            // Jika ada SPJ ID, arahkan ke halaman SPJ terkait
            if ($spjId) {
                return redirect()->route('spj.show', ['id' => $spjId]);
            }
        }

        return redirect()->route('notifications.index');
    }

    public function markAllAsRead()
    {
        $user = Auth::user();

        if ($user) {
            DatabaseNotification::where('notifiable_id', $user->id)
                ->where('notifiable_type', get_class($user))
                ->whereNull('read_at')
                ->update(['read_at' => now()]);
        }

        return back()->with('success', 'Semua notifikasi telah ditandai sebagai dibaca.');
    }

    public function markAsRead($id)
    {
        $user = Auth::user();

        if ($user) {
            $notification = DatabaseNotification::where('id', $id)
                ->where('notifiable_id', $user->id)
                ->where('notifiable_type', get_class($user))
                ->first();

            if ($notification) {
                $notification->markAsRead();
            }
        }

        return back();
    }
}
