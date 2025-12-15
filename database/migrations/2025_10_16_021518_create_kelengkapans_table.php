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
        Schema::create('kelengkapans', function (Blueprint $table) {
            $table->id();
            $table->string('spj_id', 14);
            $table->string('nama_dokumen', 100);
            $table->string('file_path', 255)->nullable();
            $table->string('status')->default('Belum Diverifikasi');
            $table->text('alasan')->nullable();
            $table->integer('versi')->default(1);
            $table->timestamp('tanggal_upload')->nullable();
            $table->string('upload_by', 100)->nullable();
            $table->timestamps();

            $table->foreign('spj_id')
            ->references('id')
            ->on('spjs')
            ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('kelengkapans');
    }
};
