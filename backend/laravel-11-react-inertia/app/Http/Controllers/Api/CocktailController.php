<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cocktail;
use Illuminate\Http\Request;

class CocktailController extends Controller
{
    private function visibleTo($query, ?int $userId)
    {
        return $query->where(function ($q) use ($userId) {
            $q->whereNull('user_id');
            if ($userId) {
                $q->orWhere('user_id', $userId);
            }
        });
    }

    // GET /api/cocktails
    public function index(Request $request)
    {
        $userId = optional(auth('sanctum')->user())->id;

        $query = Cocktail::query()->orderByDesc('id');
        $this->visibleTo($query, $userId);

        return response()->json(
            $query->paginate(9)
        )->header('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0')
         ->header('Pragma', 'no-cache');
    }

    // GET /api/cocktails/{id}
    public function show(Request $request, $id)
    {
        $userId = optional(auth('sanctum')->user())->id;

        $query = Cocktail::with('ingredients');
        $this->visibleTo($query, $userId);

        $cocktail = $query->findOrFail($id);

        return response()->json($cocktail);
    }

    // GET /api/cocktails/search
    public function search(Request $request)
    {
        $userId = optional(auth('sanctum')->user())->id;

        $q = trim((string) $request->query('q', ''));
        $ingredient = trim((string) $request->query('ingredient', ''));

        $query = Cocktail::query();
        $this->visibleTo($query, $userId);

        if ($q !== '') {
            $query->where(function ($sub) use ($q) {
                $sub->where('name', 'like', "%{$q}%")
                    ->orWhere('description', 'like', "%{$q}%");
            });
        }

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

    // GET /api/cocktails/category/{category}
public function byIngredientCategory(string $category)
{
    $userId = optional(auth('sanctum')->user())->id;

    $query = Cocktail::query();
    $this->visibleTo($query, $userId);

    // alkoholni sastojci
    $alcoholCategories = ['rum', 'votka', 'gin', 'tekila', 'viski', 'liker', 'prosecco', 'ginger beer'];

    // Iznimka bezalkoholno
    if ($category === 'bezalkoholno') {
        $cocktails = $query
            // ne smije imati nijedan alkoholni sastojak
            ->whereDoesntHave('ingredients', function ($q) use ($alcoholCategories) {
                $q->whereIn('category', $alcoholCategories);
            })
            //mora imati barem jedan bezalkoholni sastojak
            ->whereHas('ingredients', function ($q) {
                $q->where('category', 'bezalkoholno');
            })
            ->with('ingredients:id,name,category')
            ->orderBy('name')
            ->get();

        return response()->json($cocktails);
    }

    // Sve ostale kategorije, stara logika
    $cocktails = $query
        ->whereHas('ingredients', function ($q) use ($category) {
            $q->where('category', $category);
        })
        ->with('ingredients:id,name,category')
        ->orderBy('name')
        ->get();

    return response()->json($cocktails);
}
}
