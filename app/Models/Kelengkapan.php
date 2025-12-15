<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kelengkapan extends Model
{
    use HasFactory;

    protected $table = 'kelengkapans';

    protected $fillable = [
        'spj_id', 'nama_dokumen', 'file_path', 'versi',
        'tanggal_upload', 'upload_by', 'status', 'alasan'
    ];

    // Relasi ke SPJ
    public function spj()
    {
        return $this->belongsTo(Spj::class, 'spj_id', 'id');
    }

}
