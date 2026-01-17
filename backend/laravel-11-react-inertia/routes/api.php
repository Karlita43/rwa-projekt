<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\Api\CocktailController;
use Illuminate\Support\Facades\Route;

use App\Models\Cocktail;
use Illuminate\Http\Request;

// Authentication Routes

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);


Route::get('/cocktails', [CocktailController::class, 'index']);

Route::get('/cocktails/search', [CocktailController::class, 'search']);

Route::get('/cocktails/{id}', [CocktailController::class, 'show']);


// 3 koktela za pocetnu
use Illuminate\Support\Facades\Cache;

Route::get('/featured-cocktails', function () {
    return Cache::remember('featured_cocktails', now()->addMinutes(10), function () {
        return \App\Models\Cocktail::query()
            ->where('name', '!=', 'name')
            ->whereNotNull('image_url')
            ->inRandomOrder()
            ->take(3)
            ->get()
            ->map(function ($c) {
                return [
                    'id' => $c->id,
                    'name' => $c->name,
                    'description' => $c->description,
                    'image_url' => $c->image_url,
                ];
            });
    });
});

Route::middleware('auth:sanctum')->get('/me', function (Request $request) {
    return $request->user();
});