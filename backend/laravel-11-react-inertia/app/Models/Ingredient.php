<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Cocktail;

class Ingredient extends Model
{
    // ovo je opcionalno, ali nije problem da stoji
    protected $table = 'ingredients';

    protected $fillable = [
        'name',
        'category',
    ];

    public function cocktails()
    {
        return $this->belongsToMany(
            Cocktail::class,
            'cocktail_ingredients',
            'ingredient_id',
            'cocktail_id'
        )->withPivot('quantity', 'unit');
    }
}
