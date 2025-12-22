<?php

class Cocktail extends Model
{
    protected $table = 'cocktails';

    public function ingredients()
    {
        return $this->belongsToMany(
            Ingredient::class,
            'cocktail_ingredients',
            'cocktail_id',
            'ingredient_id'
        )->withPivot('quantity', 'unit');
    }

    public function favoritedByUsers()
    {
        return $this->belongsToMany(
            User::class,
            'favorites',
            'cocktail_id',
            'user_id'
        );
    }
}
