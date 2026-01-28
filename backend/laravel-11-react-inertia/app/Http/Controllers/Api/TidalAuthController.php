<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Laravel\Sanctum\PersonalAccessToken;

class TidalAuthController extends Controller
{
    public function redirect(Request $request)
    {
        // ako je user već ulogiran u app i želi samo spojiti TIDAL
        $token = $request->query('token');
        if ($token) {
            $personal = PersonalAccessToken::findToken($token);
            if ($personal && $personal->tokenable) {
                session(['tidal_link_user_id' => $personal->tokenable->id]);
            }
        }

        $clientId = config('services.tidal.client_id');
        $redirectUri = config('services.tidal.redirect_uri');

        // PKCE
        $verifier = rtrim(strtr(base64_encode(random_bytes(64)), '+/', '-_'), '=');
        $challenge = rtrim(strtr(base64_encode(hash('sha256', $verifier, true)), '+/', '-_'), '=');

        $state = Str::random(40);

        session([
            'tidal_oauth_state' => $state,
            'tidal_oauth_verifier' => $verifier,
        ]);

        $params = [
            'response_type' => 'code',
            'client_id' => $clientId,
            'redirect_uri' => $redirectUri,
            'scope' => 'user.read search.read recommendations.read',
            'state' => $state,
            'code_challenge_method' => 'S256',
            'code_challenge' => $challenge,
        ];

        $url = 'https://login.tidal.com/authorize?' .
            http_build_query($params, '', '&', PHP_QUERY_RFC3986);

        return redirect()->away($url);
    }

    public function callback(Request $request)
    {
        if ($request->query('error')) {
            return response()->json([
                'message' => 'TIDAL OAuth error',
                'error' => $request->query('error'),
                'error_description' => $request->query('error_description'),
            ], 400);
        }

        $code = $request->query('code');
        $state = $request->query('state');

        if (!$code || !$state) {
            return response()->json(['message' => 'Missing code/state'], 400);
        }

        if (session('tidal_oauth_state') !== $state) {
            return response()->json(['message' => 'Invalid state'], 400);
        }

        $verifier = session('tidal_oauth_verifier');
        session()->forget(['tidal_oauth_state', 'tidal_oauth_verifier']);

        $clientId = config('services.tidal.client_id');
        $clientSecret = config('services.tidal.client_secret');
        $redirectUri = config('services.tidal.redirect_uri');

        // code -> token
        $tokenRes = Http::asForm()
            ->withBasicAuth($clientId, $clientSecret)
            ->post('https://auth.tidal.com/v1/oauth2/token', [
                'grant_type' => 'authorization_code',
                'code' => $code,
                'redirect_uri' => $redirectUri,
                'code_verifier' => $verifier,
            ]);

        if (!$tokenRes->successful()) {
            return response()->json([
                'message' => 'Token exchange failed',
                'body' => $tokenRes->json(),
            ], 400);
        }

        $accessToken = $tokenRes->json('access_token');
        $refreshToken = $tokenRes->json('refresh_token');
        $expiresIn = (int) $tokenRes->json('expires_in', 0);

        // TIDAL user
        $meRes = Http::withToken($accessToken)
            ->get('https://openapi.tidal.com/v2/users/me', [
                'countryCode' => config('services.tidal.country_code', 'HR'),
            ]);

        if (!$meRes->successful()) {
            return response()->json(['message' => 'Cannot fetch TIDAL user'], 400);
        }

        $tidalUserId = data_get($meRes->json(), 'data.id');
        $email = data_get($meRes->json(), 'data.attributes.email');
        $name = data_get($meRes->json(), 'data.attributes.username') ?? 'TIDAL user';

        // linking na već ulogiranog usera
        $linkUserId = session('tidal_link_user_id');
        session()->forget('tidal_link_user_id');

        if ($linkUserId) {
            $user = User::findOrFail($linkUserId);
        } else {
            $user = User::where('tidal_user_id', $tidalUserId)->first()
                ?? ($email ? User::where('email', $email)->first() : null);

            if (!$user) {
                $user = User::create([
                    'name' => $name,
                    'email' => $email ?: "tidal_{$tidalUserId}@example.local",
                    'password' => bcrypt(Str::random(32)),
                ]);
            }
        }

        // ✅ SPREMANJE TOKENA (KLJUČNO)
        $user->tidal_user_id = $tidalUserId;
        $user->tidal_refresh_token = $refreshToken;
        $user->tidal_access_token = $accessToken;
        $user->tidal_access_expires_at = $expiresIn
            ? now()->addSeconds($expiresIn)
            : now()->addHour();

        $user->save();

        // app token
        $appToken = $user->createToken('tidal-login')->plainTextToken;

        return redirect()->away(
            config('services.tidal.frontend_url') .
            '/auth/tidal/callback?token=' . urlencode($appToken)
        );
    }
}
