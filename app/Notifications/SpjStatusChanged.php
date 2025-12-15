<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SpjStatusChanged extends Notification
{
    use Queueable;

    protected $spj;
    protected $oldStatus;
    protected $newStatus;

    public function __construct($spj, $oldStatus, $newStatus)
    {
        $this->spj = $spj;
        $this->oldStatus = $oldStatus;
        $this->newStatus = $newStatus;
    }

    public function via($notifiable)
    {
        return ['database'];
    }

    public function toArray($notifiable)
    {
        return [
        'spj_id' => $this->spj->id,
        'bidang' => $this->spj->bidang,
        'status' => $this->newStatus, // <── status SPJ terbaru (Dikoreksi / Disetujui)
        'title' => 'Status SPJ Diperbarui',
        'message' => "Status SPJ bidang {$this->spj->bidang} (ID: {$this->spj->id}) berubah dari {$this->oldStatus} menjadi {$this->newStatus}.",
        'url' => route('spj.show', ['id' => $this->spj->id]), // opsional: link ke detail SPJ
    ];
    }
}
