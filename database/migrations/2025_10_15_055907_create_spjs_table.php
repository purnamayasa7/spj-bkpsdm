<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('spjs', function (Blueprint $table) {
            $table->string('id', 14)->primary();
            $table->string('bidang', 11);
            $table->string('jenis', 2);
            $table->string('pptk', 100);
            $table->string('kegiatan', 100);
            $table->string('belanja', 100);
            $table->integer('nilai');
            $table->string('sumber_dana', 50);
            $table->date('tanggal_spj');
            $table->date('tanggal_terima_spj');
            $table->text('kelengkapan_spj')->nullable();
            $table->string('kelengkapan_spk')->nullable();
            $table->text('keterangan')->nullable();
            $table->string('status', 10);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('spjs');
    }
};
