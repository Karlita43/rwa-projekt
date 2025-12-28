<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{
    public function login(Request $request)
{
    $credentials = $request->validate([
        'email' => ['required', 'email'],
        'password' => ['required'],
    ]);

    if (!Auth::attempt($credentials)) {
        return response()->json(['message' => 'Neispravan email ili lozinka.'], 401);
    }

    $request->session()->regenerate(); // važno za sigurnost

    return response()->json([
        'user' => $request->user(),
        'message' => 'Prijava uspješna',
    ]);
}

    public function register(Request $request)
{
    $data = $request->validate([
        'name' => ['required', 'string', 'max:255'],
        'email' => ['required', 'email', 'unique:users'],
        'password' => ['required', 'min:6', 'confirmed'],
    ]);

    $user = User::create([
        'name' => $data['name'],
        'email' => $data['email'],
        'password' => Hash::make($data['password']),
    ]);

    Auth::login($user); // <-- session login

    return response()->json([
        'user' => $user,
        'message' => 'Registracija uspješna',
    ], 201);
}

    public function logout(Request $request)
{
    Auth::logout();                     // odjava user-a iz sessiona
    $request->session()->invalidate();   // uništi session
    $request->session()->regenerateToken(); // regeneriraj CSRF token

    return response()->json([
        'message' => 'Uspješno ste se odjavili.'
    ]);
}

}
