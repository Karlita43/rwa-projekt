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
        Schema::create('cocktail_ingredients', function (Blueprint $table) {
            $table->primary(['cocktail_id', 'ingredient_id']);
            $table->unsignedInteger('cocktail_id');
            $table->unsignedInteger('ingredient_id');
            $table->decimal('quantity', 8, 2);
            $table->string('unit', 50);

            $table->foreign('cocktail_id')->references('id')->on('cocktails')->onDelete('cascade');
            $table->foreign('ingredient_id')->references('id')->on('ingredients')->onDelete('cascade');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cocktail_ingredients');
    }
};
