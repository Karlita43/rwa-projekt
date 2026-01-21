<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Ingredient;

class IngredientController extends Controller
{
    public function index()
    {
        return response()->json(
            Ingredient::query()
                ->orderBy('name')
                ->get(['id', 'name', 'category'])
        );
    }
}