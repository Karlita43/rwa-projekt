<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use App\Http\Controllers\Controller;
use App\Models\User;

class TidalAuthController extends Controller
{
    public function redirect(Request $request)
    {
        $clientId = config('services.tidal.client_id');
        $redirectUri = config('services.tidal.redirect_uri');

        // PKCE
        $verifier = rtrim(strtr(base64_encode(random_bytes(64)), '+/', '-_'), '=');
        $challenge = rtrim(strtr(base64_encode(hash('sha256', $verifier, true)), '+/', '-_'), '=');

        $state = Str::random(40);

        // spremi na kratko (npr. 10 min)
        session([
    'tidal_oauth_state' => $state,
    'tidal_oauth_verifier' => $verifier,
]);

        $scopes = urlencode("user.read search.read recommendations.read"); 
        $url = "https://login.tidal.com/authorize"
            . "?response_type=code"
            . "&client_id={$clientId}"
            . "&redirect_uri=" . urlencode($redirectUri)
            . "&scope={$scopes}"
            . "&state={$state}"
            . "&code_challenge_method=S256"
            . "&code_challenge={$challenge}";

        return redirect()->away($url);
    }

    public function callback(Request $request)
    {
        $code = $request->query('code');
        $state = $request->query('state');    

        if (!$code || !$state) {
            return response()->json(['message' => 'Missing code/state'], 400);
        }

        

        $expectedState = session('tidal_oauth_state');
        $verifier = session('tidal_oauth_verifier');

        if (!$expectedState || $expectedState !== $state || !$verifier) {
            return response()->json(['message' => 'Invalid/expired state'], 400);
        }

        // obriši iz sessiona da se ne može ponovo iskoristiti
        session()->forget(['tidal_oauth_state', 'tidal_oauth_verifier']);


        $clientId = config('services.tidal.client_id');
        $clientSecret = config('services.tidal.client_secret');
        $redirectUri = config('services.tidal.redirect_uri');

        // Zamjena code -> token (token endpoint)
        $tokenRes = Http::asForm()
            ->withBasicAuth($clientId, $clientSecret)
            ->post('https://auth.tidal.com/v1/oauth2/token', [
                'grant_type' => 'authorization_code',
                'client_id' => $clientId,
                'code' => $code,
                'redirect_uri' => $redirectUri,
                'code_verifier' => $verifier,
            ]);

        if (!$tokenRes->successful()) {
            return response()->json([
                'message' => 'Token exchange failed',
                'status' => $tokenRes->status(),
                'body' => $tokenRes->json(),
            ], 400);
        }

        $accessToken = $tokenRes->json('access_token');
        $refreshToken = $tokenRes->json('refresh_token');

        // 1) Dohvati TIDAL usera
        $countryCode = config('services.tidal.country_code', 'HR');

        $meRes = Http::withToken($accessToken)
            ->get('https://openapi.tidal.com/v2/users/me', [
                'countryCode' => $countryCode,
            ]);

        if (!$meRes->successful()) {
            return response()->json([
                'message' => 'Ne mogu dohvatiti TIDAL usera (/users/me)',
                'status' => $meRes->status(),
                'body' => $meRes->json(),
            ], 400);
        }

        $tidalUserId = data_get($meRes->json(), 'data.id');
        $email = data_get($meRes->json(), 'data.attributes.email');
        $name = data_get($meRes->json(), 'data.attributes.username')
            ?? data_get($meRes->json(), 'data.attributes.firstName')
            ?? 'TIDAL user';

        if (!$tidalUserId) {
            return response()->json(['message' => 'Nedostaje TIDAL user id'], 400);
        }

        // 2) Nađi ili kreiraj usera u tvojoj bazi

        $user = User::where('tidal_user_id', $tidalUserId)->first();

        if (!$user && $email) {
            // ako postoji user s istim emailom (npr. registriran normalno) – spoji račune
            $user = User::where('email', $email)->first();
        }

        if (!$user) {
            // nema ga ni po tidal_user_id ni po emailu -> kreiraj novog
            $user = User::create([
                'name' => $name,
                'email' => $email ?: ("tidal_{$tidalUserId}@example.local"),
                'password' => bcrypt(Str::random(32)),
                'tidal_user_id' => $tidalUserId,
                'tidal_refresh_token' => $refreshToken,
            ]);
        } else {
            // updateaj postojeći user (spoji/refresh token)
            if (!$user->tidal_user_id) {
                $user->tidal_user_id = $tidalUserId;
            }
            $user->tidal_refresh_token = $refreshToken;
            $user->save();
        }

        // 3) Izdaj Sanctum token
        $appToken = $user->createToken('tidal-login')->plainTextToken;

        // 4) Redirect na frontend (React) s tokenom
        $frontend = config('services.tidal.frontend_url');
        return redirect()->away($frontend . '/auth/tidal/callback?token=' . urlencode($appToken));       
    }
}
