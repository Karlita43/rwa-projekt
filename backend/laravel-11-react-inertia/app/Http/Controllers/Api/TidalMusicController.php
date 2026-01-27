<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cocktail;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class TidalMusicController extends Controller
{
    public function forCocktail(Request $request, int $id)
    {
        $user = $request->user();

        if (!$user->tidal_refresh_token) {
            return response()->json([
                'connected' => false,
                'message' => 'Korisnik nije povezan s TIDAL-om.'
            ], 400);
        }

        $cocktail = Cocktail::findOrFail($id);
        $query = $cocktail->name;

        // 1) Refresh access token (TIDAL)
        $tokenRes = Http::asForm()->post('https://auth.tidal.com/v1/oauth2/token', [
            'grant_type' => 'refresh_token',
            'refresh_token' => $user->tidal_refresh_token,
        ]);

        if (!$tokenRes->successful()) {
            return response()->json([
                'connected' => true,
                'message' => 'Ne mogu refreshati TIDAL token',
                'status' => $tokenRes->status(),
                'body' => $tokenRes->json(),
            ], 400);
        }

        $accessToken = $tokenRes->json('access_token');

        // (opcionalno) ako TIDAL vrati novi refresh_token, spremi ga
        if ($tokenRes->json('refresh_token')) {
            $user->tidal_refresh_token = $tokenRes->json('refresh_token');
            $user->save();
        }

        // 2) Search tracks po imenu koktela
        $countryCode = config('services.tidal.country_code', 'HR');

        // VAŽNO: query ide u PATH -> mora biti URL-encoded (rawurlencode)
        // Primjer endpointa: /v2/searchresults/{QUERY}/relationships/tracks
        // (ovo je stvarni primjer iz TIDAL API korištenja) :contentReference[oaicite:0]{index=0}
        $encodedQuery = rawurlencode($query);

        $searchRes = Http::withToken($accessToken)->get(
            "https://openapi.tidal.com/v2/searchresults/{$encodedQuery}/relationships/tracks",
            [
                'countryCode' => $countryCode,
                'include' => 'tracks,tracks.artists,tracks.albums',
                'limit' => 5, // uzmi top 5 pa izaberi 1
            ]
        );

        if (!$searchRes->successful()) {
            return response()->json([
                'connected' => true,
                'message' => 'TIDAL search nije uspio',
                'status' => $searchRes->status(),
                'body' => $searchRes->json(),
            ], 400);
        }

        $data = $searchRes->json('data', []);
        $included = collect($searchRes->json('included', []));

        if (count($data) === 0) {
            return response()->json([
                'connected' => true,
                'query' => $query,
                'track' => null,
            ]);
        }

        // uzmi prvi (ili random)
        $first = $data[0]; // ili: $data[array_rand($data)]
        $trackId = $first['id'] ?? null;

        $track = $included->first(fn($x) => ($x['type'] ?? null) === 'tracks' && ($x['id'] ?? null) === $trackId);
        if (!$track) {
            return response()->json(['connected' => true, 'query' => $query, 'track' => null]);
        }

        $attrs = $track['attributes'] ?? [];

        // artist (ako je included došao)
        $artistName = null;
        $artistRelId = data_get($track, 'relationships.artists.data.0.id');
        if ($artistRelId) {
            $artist = $included->first(fn($x) => ($x['type'] ?? null) === 'artists' && ($x['id'] ?? null) === $artistRelId);
            $artistName = data_get($artist, 'attributes.name');
        }

        // album cover (ovisno o poljima; nekad ima "imageLinks"/"cover" varijacije)
        $albumCover = data_get($attrs, 'imageLinks.0.href');

        return response()->json([
            'connected' => true,
            'query' => $query,
            'track' => [
                'id' => $trackId,
                'title' => $attrs['title'] ?? $attrs['name'] ?? null,
                'artist' => $artistName,
                'cover' => $albumCover,
                // najčešće radi kao share link:
                'url' => $attrs['url'] ?? $attrs['externalUrl'] ?? null,
            ],
        ]);
    }
}
