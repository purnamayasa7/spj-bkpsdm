<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pegawai extends Model
{
    use HasFactory;

    protected $fillable = [
        'nip',
        'nama',
        'jabatan',
        'golongan',
        'pangkat',
        'bidang',
        'aktif',
        'ttd_path', 
    ];

    public function user()
    {
        return $this->hasOne(User::class);
    }
}
