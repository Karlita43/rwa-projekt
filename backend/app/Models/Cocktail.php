<?php

class Cocktail extends Model
{
    protected $table = 'cocktails';

    public function ingredients()
    {
        return $this->belongsToMany(Ingredient::class)
                    ->withPivot('quantity', 'unit');
    }
}
