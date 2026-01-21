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
        Schema::create('spj_histories', function (Blueprint $table) {
            $table->id();

            $table->string('spj_id', 14);
            $table->foreign('spj_id')
                ->references('id')
                ->on('spjs')
                ->cascadeOnDelete();

            $table->string('aksi');

            $table->string('status_sebelum')->nullable();
            $table->string('status_sesudah')->nullable();

            $table->text('keterangan')->nullable();

            $table->foreignId('actor_id')
                ->constrained('users')
                ->cascadeOnDelete();

            $table->string('actor_role')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('spj_histories');
    }
};
