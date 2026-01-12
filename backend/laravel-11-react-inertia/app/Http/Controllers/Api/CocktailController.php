<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cocktail;
use Illuminate\Http\Request;

class CocktailController extends Controller
{
    // GET /api/cocktails
    public function index()
    {
        return response()->json(
            Cocktail::all()
        );
    }

    // GET /api/cocktails/{id}
    public function show($id)
    {
        $cocktail = Cocktail::findOrFail($id);

        return response()->json($cocktail);
    }

    public function search(Request $request)
{
    $ingredient = $request->query('ingredient');

    $cocktails = Cocktail::whereHas('ingredients', function ($q) use ($ingredient) {
        $q->where('category', $ingredient)
          ->orWhere('name', 'like', "%{$ingredient}%");
    })->with('ingredients')->get();

    return response()->json($cocktails);
}
}