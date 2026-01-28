<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $podaci = $request->validate([
            'name' => 'required|string|min:3|max:100', 
            'email' => 'required|unique:users|email', 
            'password' => 'required|string|confirmed|min:6'
        ]);
        $user = User::create([
            'name' => $podaci['name'],
            'email' => $podaci['email'],
            'password' => bcrypt($podaci['password'])
        ]);
        $token = $user->createToken('apptoken')->plainTextToken;
        $response =[
            'user' => $user, 
            'token' => $token
        ];
        return response($response, 201);
    }

    public function login(Request $request)
    {
        $podaci = $request->validate([ 
            'email' => 'required|email', 
            'password' => 'required|string'
        ]);
        $user = User::where('email', $podaci['email'])->first();
        if(!$user || !Hash::check($podaci['password'], $user->password)){
            return response([
                'poruka' => 'incorrect mail or password'
            ], 401);
        }            
        $token = $user->createToken('apptoken')->plainTextToken;
        $response =[
            'user' => $user, 
            'token' => $token
        ];
        return response($response, 200);
    }

    public function logout(Request $request)
    {
        auth()->user()->tokens()->delete();
        return[
            'poruka' => 'logout'
        ];
    }

}
