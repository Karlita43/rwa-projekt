<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;


class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

     public function favoriteCocktails()
    {
        return $this->belongsToMany(
            Cocktail::class,
            'favorites',
            'user_id',
            'cocktail_id'
        );
    }

    public function ingredients()
    {
        return $this->belongsToMany(
            Ingredient::class,
            'user_ingredients',
            'user_id',
            'ingredient_id'
        )->withPivot('quantity', 'unit')
         ->withTimestamps();
    }


}
