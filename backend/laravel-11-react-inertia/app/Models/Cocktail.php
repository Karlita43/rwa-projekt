<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Ingredient;

class Cocktail extends Model
{
    protected $fillable = [
        'name',
        'description',
        'instructions',
        'image_url',
    ];

    public function ingredients()
    {
        return $this->belongsToMany(
            Ingredient::class,
            'cocktail_ingredients',
            'cocktail_id',
            'ingredient_id'
        )->withPivot('quantity', 'unit'); 
    }
}
