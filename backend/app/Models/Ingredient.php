<?php

class Ingredient extends Model
{
    protected $table = 'ingredients';

    public function cocktails()
    {
        public function cocktails()
    {
        return $this->belongsToMany(
            Cocktail::class,
            'cocktail_ingredients',
            'ingredient_id',
            'cocktail_id'
        ) ->withPivot('quantity', 'unit');
    }

     public function users()
    {
        return $this->belongsToMany(
            User::class,
            'user_ingredients',
            'ingredient_id',
            'user_id'
        );
    }

}
