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
        Cocktail::query()
            ->where('name', '!=', 'name')
            ->where('description', '!=', 'description')
            ->orderByDesc('id')
            ->paginate(9)
    );
}

    // GET /api/cocktails/{id}
    public function show($id)
{
    $cocktail = Cocktail::with('ingredients')->findOrFail($id);
    return response()->json($cocktail);
}

    public function search(Request $request)
{
    $q = trim((string) $request->query('q', ''));
    $ingredient = trim((string) $request->query('ingredient', ''));

    $query = Cocktail::query();

    // Search po tekstu (ime + opis)
    if ($q !== '') {
        $query->where(function ($sub) use ($q) {
            $sub->where('name', 'like', "%{$q}%")
                ->orWhere('description', 'like', "%{$q}%");
        });
    }

    // (Opcionalno) Search po ingredientu/kategoriji
    if ($ingredient !== '') {
        $query->whereHas('ingredients', function ($sub) use ($ingredient) {
            $sub->where('name', 'like', "%{$ingredient}%")
                ->orWhere('category', 'like', "%{$ingredient}%");
        })->with('ingredients');
    }

    return response()->json(
        $query->orderBy('name')->paginate(9)->withQueryString()
    );
}
}