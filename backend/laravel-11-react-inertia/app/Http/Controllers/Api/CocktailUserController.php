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
            'instructions' => ['required', 'string'],

            // URL slike (nije upload)
            'image_url' => ['nullable', 'url', 'max:2048'],

            // ingredients array
            'ingredients' => ['required', 'array', 'min:1'],
            'ingredients.*.ingredient_id' => ['required', 'integer', 'exists:ingredients,id'],
            'ingredients.*.quantity' => ['nullable', 'numeric', 'min:0'],
            'ingredients.*.unit' => ['nullable', 'string', 'max:50'],
        ]);

        $userId = $request->user()->id;

        $cocktail = DB::transaction(function () use ($validated, $userId) {

            $cocktail = Cocktail::create([
                'name' => $validated['name'],
                'description' => $validated['description'] ?? null,
                'instructions' => $validated['instructions'],
                'image_url' => $validated['image_url'] ?? null,
                'user_id' => $userId,
            ]);

            // sync pivot (ingredient_id => [quantity, unit])
            $syncData = [];
            foreach ($validated['ingredients'] as $row) {
                $syncData[$row['ingredient_id']] = [
                    'quantity' => $row['quantity'] ?? null,
                    'unit' => $row['unit'] ?? null,
                ];
            }

            $cocktail->ingredients()->sync($syncData);

            return $cocktail;
        });

        return response()->json($cocktail->load('ingredients'), 201);
    }
        public function destroy(Request $request, $id)
    {
            $userId = $request->user()->id;

            $cocktail = Cocktail::where('id', $id) ->where('user_id', $userId) ->first();
            if (!$cocktail) {
                return response()->json(['message' => 'Koktel nije pronađen.'], 404);
            }
            $cocktail->ingredients()->detach();
            $cocktail->delete();

        return response()->json(['message' => 'Koktel uspješno obrisan.'], 200);
    }

        public function userCocktails(Request $request)
        {
            if ($request->user()) {
                return Cocktail::whereNull('user_id')
                    ->orWhere('user_id', $request->user()->id)
                    ->with('ingredients')
                    ->get();
            }

            return Cocktail::whereNull('user_id')
                ->with('ingredients')
                ->get();
        }

        

            public function update(Request $request, $id)
        {
            $cocktail = Cocktail::find($id);

            if (!$cocktail) {
                return response()->json(['message' => 'Koktel nije pronađen.'], 404);
            }

            // ✅ samo owner smije mijenjati
            if ($cocktail->user_id !== $request->user()->id) {
                return response()->json(['message' => 'Nemaš dopuštenje za uređivanje ovog koktela.'], 403);
            }

            $validated = $request->validate([
                'name' => ['required', 'string', 'max:255', 'unique:cocktails,name,' . $id],
                'description' => ['nullable', 'string'],
                'instructions' => ['required', 'string'],
                'image_url' => ['nullable', 'url', 'max:2048'],

                'ingredients' => ['required', 'array', 'min:1'],
                'ingredients.*.ingredient_id' => ['required', 'integer', 'exists:ingredients,id'],
                'ingredients.*.quantity' => ['nullable', 'numeric', 'min:0'],
                'ingredients.*.unit' => ['nullable', 'string', 'max:50'],
            ]);

            $cocktail->name = $validated['name'];
            $cocktail->description = $validated['description'] ?? null;
            $cocktail->instructions = $validated['instructions'];
            $cocktail->image_url = $validated['image_url'] ?? null;
            $cocktail->save();

            $syncData = [];
            foreach ($validated['ingredients'] as $row) {
                $syncData[$row['ingredient_id']] = [
                    'quantity' => $row['quantity'] ?? null,
                    'unit' => $row['unit'] ?? null,
                ];
            }

            $cocktail->ingredients()->sync($syncData);

            return response()->json($cocktail->load('ingredients'), 200);
}

        public function myCocktailsOnly(Request $request)
        {
            $userId = $request->user()->id;

            return Cocktail::where('user_id', $userId)
                ->with('ingredients')
                ->get();
        }

        public function profile(Request $request)
{
    $user = $request->user();

    return response()->json([
        'username' => $user->name ?? $user->username ?? '',
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
                    // Ako je već favorit, ukloni ga
                    $user->favoriteCocktails()->detach($id);
                    return response()->json(['message' => 'Koktel uklonjen iz favorita.'], 200);
                } else {
                    // Ako nije favorit, dodaj ga
                    $user->favoriteCocktails()->attach($id);
                    return response()->json(['message' => 'Koktel dodan u favorite.'], 200);
                }
            }

}


