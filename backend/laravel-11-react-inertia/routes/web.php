<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use Inertia\Inertia;
use App\Models\Cocktail;
use App\Http\Controllers\Api\TidalAuthController;



// TIDAL OAuth (NE ide u auth:sanctum group)
Route::get('/auth/tidal/redirect', [TidalAuthController::class, 'redirect']);
Route::get('/auth/tidal/callback', [TidalAuthController::class, 'callback']);

Route::get('/', function () {
    $cocktails = Cocktail::with('ingredients')
        ->inRandomOrder()
        ->take(3)
        ->get()
        ->map(function ($c) {
            return [
                'id' => $c->id,
                'name' => $c->name,
                'image_url' => $c->image_url,
                'ingredients' => $c->ingredients->map(function ($i) {
                    return [
                        'name' => $i->name,
                        'quantity' => $i->pivot->quantity,
                        'unit' => $i->pivot->unit,
                    ];
                }),
            ];
        });

    return Inertia::render('Home', [
        'featuredCocktails' => $cocktails,
    ]);


});
