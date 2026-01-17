<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request; //???

use App\Models\Cocktail;

class HomeController extends Controller
{
    public function index()
    {
        $cocktails = Cocktail::with('ingredients')
            ->inRandomOrder()
            ->take(3)
            ->get();

        return view('welcome', compact('cocktails'));
    }
}
