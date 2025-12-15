<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class SpjCreatedNotification extends Notification
{
    use Queueable;

    protected $spj;
    protected $bidangName;

    /**
     * Create a new notification instance.
     */
    public function __construct($spj, $bidangName)
    {
        $this->spj = $spj;
        $this->bidangName = $bidangName;
    }

    /**
     * Channel pengiriman notifikasi
     */
    public function via($notifiable)
    {
        return ['database'];
    }

    /**
     * Data notifikasi yang disimpan ke database
     */
    public function toArray($notifiable)
    {
        return [
        'spj_id' => $this->spj->id,
        'bidang' => $this->spj->bidang,
        'status' => 'Dikirim', // <── Tambahkan status default
        'title' => 'SPJ Baru Dikirim',
        'message' => "Bidang {$this->spj->bidang} telah mengirim SPJ baru dengan ID: {$this->spj->id}.",
        'url' => route('spj.show', ['id' => $this->spj->id]),
    ];
    }
}
