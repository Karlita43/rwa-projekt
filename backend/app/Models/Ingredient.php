<?php

class Ingredient extends Model
{
    protected $table = 'ingredients';

    public function cocktails()
    {
        return $this->belongsToMany(Cocktail::class)
                    ->withPivot('quantity', 'unit');
    }
}
