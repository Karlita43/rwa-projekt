<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

use App\Models\Cocktail;
use App\Models\Ingredient;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'tidal_access_token',
        'tidal_refresh_token',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'tidal_access_token',
        'tidal_refresh_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function ingredients()
    {
        return $this->belongsToMany(
            Ingredient::class,
            'ingredient_user',
            'user_id',
            'ingredient_id'
        );
    }

    public function cocktails()
    {
        return $this->hasMany(Cocktail::class);
    }

    public function favorites()
    {
        return $this->belongsToMany(
            Cocktail::class,
            'favorites',
            'user_id',
            'cocktail_id'
        );
    }

    //Alias jer controller koristi favoriteCocktails()
    public function favoriteCocktails()
    {
        return $this->favorites()->withTimestamps();
    }
}
