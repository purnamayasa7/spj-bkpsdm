<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SpjHistory extends Model
{
    protected $fillable = [
        'spj_id',
        'aksi',
        'status_sebelum',
        'status_sesudah',
        'keterangan',
        'actor_id',
        'actor_role',
        'user_id',
    ];

    public function spj(){
        return $this->belongsTo(Spj::class, 'spj_id', 'id');
    }

    public function actor(){
        return $this->belongsTo(User::class, 'actor_id');
    }    
}
