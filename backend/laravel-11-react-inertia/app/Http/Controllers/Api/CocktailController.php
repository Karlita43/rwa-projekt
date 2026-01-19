<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cocktail;
use Illuminate\Http\Request;

class CocktailController extends Controller
{
    // GET /api/cocktails  (LISTA - bez sastojaka)
    public function index()
    {
        $cocktails = Cocktail::query()
            ->where('name', '!=', 'name')                  // makni dummy red
            ->where('description', '!=', 'description')    // dodatna sigurnost
            ->select(['id', 'name', 'description', 'image_url']) // samo što treba za kartice
            ->orderBy('id')
            ->get();

        return response()->json($cocktails);
    }

    // GET /api/cocktails/{id} (DETAIL - sa sastojcima)
    public function show($id)
    {
        $cocktail = Cocktail::query()
            ->where('name', '!=', 'name')
            ->where('description', '!=', 'description')
            ->with(['ingredients' => function ($q) {
                $q->select('ingredients.id', 'ingredients.name')
                  ->withPivot('quantity', 'unit');
            }])
            ->select(['id', 'name', 'description', 'instructions', 'image_url'])
            ->findOrFail($id);

        return response()->json($cocktail);
    }

    // GET /api/cocktails/search?ingredient=...
    // (LISTA - bez sastojaka, samo filtriranje po ingredientu)
    public function search(Request $request)
    {
        $ingredient = trim((string) $request->query('ingredient', ''));

        $cocktails = Cocktail::query()
            ->where('name', '!=', 'name')
            ->where('description', '!=', 'description')
            ->when($ingredient !== '', function ($query) use ($ingredient) {
                $query->whereHas('ingredients', function ($q) use ($ingredient) {
                    $q->where('category', $ingredient)
                      ->orWhere('name', 'like', "%{$ingredient}%");
                });
            })
            ->select(['id', 'name', 'description', 'image_url'])
            ->orderBy('id')
            ->get();

        return response()->json($cocktails);
    }
}
