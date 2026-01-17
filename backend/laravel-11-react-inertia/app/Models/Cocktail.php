<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Ingredient;

class Cocktail extends Model
{

    // Eksplicitno (nije obavezno, ali je dobra praksa)
    protected $table = 'cocktails';

    protected $fillable = [
        'name',
        'description',
        'instructions',
        'image_url',
    ];

    // Ako tablica NEMA created_at i updated_at, odkomentiraj ovo:
    // public $timestamps = false;

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
