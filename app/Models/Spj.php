<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Spj extends Model
{
    use HasFactory;

    protected $table = 'spjs';
    protected $primaryKey = 'id';
    public $incrementing = false;   // <- WAJIB! karena id bukan auto increment
    protected $keyType = 'string';  // <- WAJIB! supaya dibaca sebagai string

    protected $fillable = [
        'id',
        'bidang',
        'jenis',
        'pptk',
        'kegiatan',
        'belanja',
        'nilai',
        'sumber_dana',
        'tanggal_spj',
        'tanggal_terima_spj',
        'kelengkapan_spj',
        'kelengkapan_spk',
        'keterangan',
        'status',
    ];

    public function kelengkapans()
    {
        return $this->hasMany(Kelengkapan::class, 'spj_id', 'id');
    }

}



