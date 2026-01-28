<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Cocktail;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;

class TidalMusicController extends Controller
{
    public function forCocktail(Request $request, int $id)
    {
        $user = $request->user();

        if (!$user || !$user->tidal_access_token || !$user->tidal_access_expires_at) {
            return response()->json([
                'connected' => false,
                'track' => null,
                'message' => 'Korisnik nije povezan s TIDAL-om.',
            ], 200);
        }

        // Access token istek’o -> traži reconnect (ili ovdje možeš dodati refresh logiku kasnije)
        if (Carbon::parse($user->tidal_access_expires_at)->isPast()) {
            return response()->json([
                'connected' => false,
                'needs_reconnect' => true,
                'track' => null,
                'message' => 'TIDAL token je istekao. Spoji TIDAL ponovno.',
            ], 200);
        }

        $cocktail = Cocktail::findOrFail($id);
        $query = $cocktail->name;
        $countryCode = config('services.tidal.country_code', 'HR');

        // ✅ 1) OpenAPI v2 search (OAuth-friendly)
        $open = Http::withToken($user->tidal_access_token)
            ->withHeaders(['Accept' => 'application/vnd.api+json'])
            ->get('https://openapi.tidal.com/v2/search', [
                'query' => $query,
                'countryCode' => $countryCode,
                'limit' => 5,
                'types' => 'tracks',
            ]);

        \Log::info('TIDAL OPENAPI SEARCH', [
            'query' => $query,
            'status' => $open->status(),
            'body' => $open->json(),
        ]);

        if ($open->successful()) {
            $track = $this->extractFirstTrackFromOpenApi($open->json());
            return response()->json([
                'connected' => true,
                'query' => $query,
                'track' => $track, // može biti null ako nema rezultata
            ], 200);
        }

        // ❗ Ako OpenAPI ne radi, tek onda legacy fallback
        $legacy = Http::withToken($user->tidal_access_token)
            ->get('https://api.tidal.com/v1/search/tracks', [
                'query' => $query,
                'countryCode' => $countryCode,
                'limit' => 5,
            ]);

        \Log::info('TIDAL LEGACY SEARCH', [
            'query' => $query,
            'status' => $legacy->status(),
            'body' => $legacy->json(),
        ]);

        if ($legacy->successful()) {
            $item = $legacy->json('tracks.items.0') ?? $legacy->json('items.0');

            if (!$item) {
                return response()->json([
                    'connected' => true,
                    'query' => $query,
                    'track' => null,
                ], 200);
            }

            return response()->json([
                'connected' => true,
                'query' => $query,
                'track' => [
                    'id' => data_get($item, 'id'),
                    'title' => data_get($item, 'title'),
                    'artist' => data_get($item, 'artist.name'),
                    'url' => data_get($item, 'id') ? ('https://tidal.com/browse/track/' . data_get($item, 'id')) : null,
                    'cover' => null,
                ],
            ], 200);
        }

        // Ako oba failaju -> vrati pravi error (da frontend ne laže “nema preporuke”)
        return response()->json([
            'connected' => true,
            'track' => null,
            'message' => 'TIDAL search nije uspio',
            'status' => $open->status(),
            'openapi_body' => $open->json(),
            'legacy_status' => $legacy->status(),
            'legacy_body' => $legacy->json(),
        ], 200);
    }

    private function extractFirstTrackFromOpenApi(?array $json): ?array
    {
        if (!$json) return null;

        $data = data_get($json, 'data', []);
        if (empty($data)) return null;

        // "included" map za artist/album ako postoji
        $included = data_get($json, 'included', []);
        $incMap = [];
        foreach ($included as $inc) {
            $t = data_get($inc, 'type');
            $i = data_get($inc, 'id');
            if ($t && $i) $incMap["{$t}:{$i}"] = $inc;
        }

        // nađi prvi track
        $first = $data[0];

        $trackId = data_get($first, 'id');
        $title = data_get($first, 'attributes.title');

        $artistName = null;
        $artistId = data_get($first, 'relationships.artists.data.0.id');
        if ($artistId) {
            $artistName = data_get($incMap["artists:{$artistId}"] ?? null, 'attributes.name');
        }

        return [
            'id' => $trackId,
            'title' => $title,
            'artist' => $artistName,
            'url' => $trackId ? ('https://tidal.com/browse/track/' . $trackId) : null,
            'cover' => null,
        ];
    }
}
