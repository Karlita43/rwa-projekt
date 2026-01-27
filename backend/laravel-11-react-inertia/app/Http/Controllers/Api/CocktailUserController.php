<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cocktail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CocktailUserController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255', 'unique:cocktails,name'],
            'description' => ['nullable', 'string'],
            'instructions' => ['nullable', 'string'],
            'category' => ['nullable', 'string'],
            'image_url' => ['nullable', 'string'],
            'ingredients' => ['nullable', 'array'],
        ]);

        $cocktail = new Cocktail();
        $cocktail->name = $validated['name'];
        $cocktail->description = $validated['description'] ?? null;
        $cocktail->instructions = $validated['instructions'] ?? null;
        $cocktail->category = $validated['category'] ?? null;
        $cocktail->image_url = $validated['image_url'] ?? null;
        $cocktail->user_id = $request->user()->id;
        $cocktail->save();

        if (!empty($validated['ingredients'])) {
            foreach ($validated['ingredients'] as $ingredient) {
                DB::table('cocktail_ingredients')->insert([
                    'cocktail_id' => $cocktail->id,
                    'ingredient_id' => $ingredient['id'],
                    'quantity' => $ingredient['quantity'] ?? null,
                    'unit' => $ingredient['unit'] ?? null,
                ]);
            }
        }

        return response()->json(['message' => 'Koktel uspješno dodan.'], 201);
    }

    public function destroy(Request $request, $id)
    {
        $user = $request->user();

        $cocktail = Cocktail::where('id', $id)
            ->where('user_id', $user->id)
            ->first();

        if (!$cocktail) {
            return response()->json(['message' => 'Koktel nije pronađen.'], 404);
        }

        DB::table('cocktail_ingredients')->where('cocktail_id', $id)->delete();
        $cocktail->delete();

        return response()->json(['message' => 'Koktel uspješno obrisan.'], 200);
    }

    public function update(Request $request, $id)
    {
        $user = $request->user();

        $cocktail = Cocktail::where('id', $id)
            ->where('user_id', $user->id)
            ->first();

        if (!$cocktail) {
            return response()->json(['message' => 'Koktel nije pronađen.'], 404);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'instructions' => ['nullable', 'string'],
            'category' => ['nullable', 'string'],
            'image_url' => ['nullable', 'string'],
            'ingredients' => ['nullable', 'array'],
        ]);

        $cocktail->name = $validated['name'];
        $cocktail->description = $validated['description'] ?? null;
        $cocktail->instructions = $validated['instructions'] ?? null;
        $cocktail->category = $validated['category'] ?? null;
        $cocktail->image_url = $validated['image_url'] ?? null;
        $cocktail->save();

        DB::table('cocktail_ingredients')->where('cocktail_id', $id)->delete();

        if (!empty($validated['ingredients'])) {
            foreach ($validated['ingredients'] as $ingredient) {
                DB::table('cocktail_ingredients')->insert([
                    'cocktail_id' => $cocktail->id,
                    'ingredient_id' => $ingredient['id'],
                    'quantity' => $ingredient['quantity'] ?? null,
                    'unit' => $ingredient['unit'] ?? null,
                ]);
            }
        }

        return response()->json(['message' => 'Koktel uspješno ažuriran.'], 200);
    }

    public function myCocktailsOnly(Request $request)
    {
        $user = $request->user();
        $cocktails = Cocktail::where('user_id', $user->id)->get();
        return response()->json($cocktails);
    }

    public function profile(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'username' => $user->name,
            'email' => $user->email,
        ]);
    }

    public function favorites(Request $request)
    {
        $user = $request->user();

        $favorites = $user->favoriteCocktails()->with('ingredients')->get();

        return response()->json($favorites);
    }

    public function toggleFavorite(Request $request, $id)
    {
        $user = $request->user();

        $cocktail = Cocktail::find($id);
        if (!$cocktail) {
            return response()->json(['message' => 'Koktel nije pronađen.'], 404);
        }

        if ($user->favoriteCocktails()->where('cocktail_id', $id)->exists()) {
            $user->favoriteCocktails()->detach($id);
            return response()->json(['message' => 'Koktel uklonjen iz favorita.'], 200);
        } else {
            $user->favoriteCocktails()->attach($id);
            return response()->json(['message' => 'Koktel dodan u favorite.'], 200);
        }
    }
}
