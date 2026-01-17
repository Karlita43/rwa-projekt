<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\Api\CocktailController;
use Illuminate\Support\Facades\Route;

// Authentication Routes

Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);


Route::get('/cocktails', [CocktailController::class, 'index']);

Route::get('/cocktails/search', [CocktailController::class, 'search']);

Route::get('/cocktails/{id}', [CocktailController::class, 'show']);


Route::middleware('auth:sanctum')->get('/me', function (Request $request) {
    return $request->user();
});
