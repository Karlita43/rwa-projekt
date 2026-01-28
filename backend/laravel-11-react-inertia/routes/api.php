<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Api\CocktailController;
use App\Http\Controllers\Api\CocktailUserController;
use App\Http\Controllers\Api\IngredientController;
use App\Http\Controllers\Api\TidalMusicController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

// protected
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/cocktails', [CocktailUserController::class, 'store']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::delete('/cocktails/{id}', [CocktailUserController::class, 'destroy']);
    Route::put('/cocktails/{id}', [CocktailUserController::class, 'update']);
    Route::get('/user/cocktails', [CocktailUserController::class, 'myCocktailsOnly']);
    Route::get('/user/profile', [CocktailUserController::class, 'profile']);
    Route::get('/user/favorites', [CocktailUserController::class, 'favorites']);
    Route::post('/cocktails/{id}/favorite', [CocktailUserController::class, 'toggleFavorite']);

    // ✅ TIDAL recommendation (Bearer token)
    Route::get('/cocktails/{id}/tidal-track', [TidalMusicController::class, 'forCocktail']);
});

Route::get('/ingredients', [IngredientController::class, 'index']);

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);

Route::get('/cocktails', [CocktailController::class, 'index']);
Route::get('/cocktails/search', [CocktailController::class, 'search']);
Route::get('/cocktails/{id}', [CocktailController::class, 'show']);

// featured cocktails
Route::get('/featured-cocktails', function () {
    return Cache::remember('featured_cocktails', now()->addMinutes(10), function () {
        return \App\Models\Cocktail::query()
            ->whereNotNull('image_url')
            ->inRandomOrder()
            ->take(3)
            ->get()
            ->map(fn ($c) => [
                'id' => $c->id,
                'name' => $c->name,
                'description' => $c->description,
                'image_url' => $c->image_url,
            ]);
    });
});

Route::middleware('auth:sanctum')->get('/me', function (Request $request) {
    return $request->user();
});
