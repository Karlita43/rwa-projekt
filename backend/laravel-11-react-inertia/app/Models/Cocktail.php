<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Ingredient;

class Cocktail extends Model
{

    // Eksplicitno (nije obavezno, ali je dobra praksa)
    protected $table = 'cocktails';
    public $timestamps = false;
    protected $appends = ['image_url_resolved'];

    protected $fillable = [
        'name',
        'description',
        'instructions',
        'image_url',
        'user_id',
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

     public function getImageUrlResolvedAttribute()
    {
        $val = $this->image_url; // kolona iz baze

        if (!$val) return null;

        // Ako je već web URL
        if (preg_match('#^https?://#i', $val)) {
            return $val;
        }

        // Ako je filename (mojito.jpg) -> public/koktel_slike/mojito.jpg
        return asset('koktel_slike/' . ltrim($val, '/'));
    }
}
