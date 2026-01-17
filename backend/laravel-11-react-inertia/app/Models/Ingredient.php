<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Cocktail;

class Ingredient extends Model
{
    // (nije obavezno jer se tablica zove "ingredients",
    // ali je korisno eksplicitno)
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
        );
    }
}
