<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use Inertia\Inertia;
use App\Models\Cocktail;

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
