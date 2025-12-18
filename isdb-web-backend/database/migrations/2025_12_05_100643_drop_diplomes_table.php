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
        Schema::dropIfExists('diplomes');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::create('diplomes', function (Blueprint $table) {
            $table->id()->primary();
            $table->string("nom")->unique();
            $table->timestamps();
        });
    }
};
