<?php

namespace App\Services;

use Illuminate\Contracts\Cache\LockTimeoutException;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Validator;
use RuntimeException;
use Throwable;

class CachedPublishedData
{
    /** @return array<string, mixed>|null */
    public function get(?string $url, string $namespace, string $store, int $checkInterval, array $rules, array $unavailable): ?array
    {
        if (! $url) {
            return null;
        }

        $cache = Cache::store($store);
        $key = $namespace.':'.hash('sha256', $url);
        $snapshot = $cache->get($key);

        if ($cache->has($key.':checked')) {
            return $snapshot['data'] ?? $unavailable;
        }

        $lock = $cache->lock($key.':refresh', 10);

        try {
            $acquired = $snapshot ? $lock->get() : $lock->block(4);

            if (! $acquired) {
                return $snapshot['data'] ?? $unavailable;
            }

            $snapshot = $cache->get($key);

            if ($cache->has($key.':checked')) {
                return $snapshot['data'] ?? $unavailable;
            }

            $retryAfter = max(1, $checkInterval);

            try {
                $request = Http::acceptJson()->connectTimeout(1)->timeout(3);

                if ($snapshot) {
                    $request = $request->withHeaders(['If-None-Match' => '"'.$snapshot['version'].'"']);
                }

                $response = $request->get($url);

                if ($response->status() === 304 && $snapshot) {
                    return $snapshot['data'];
                }

                $response->throw();
                $body = $response->json();

                if (! is_array($body)) {
                    throw new RuntimeException('Published content API returned invalid JSON.');
                }

                $validated = Validator::make($body, $rules)->validate();

                if (! hash_equals($validated['version'], hash('sha256', json_encode($validated['data'], JSON_THROW_ON_ERROR)))) {
                    throw new RuntimeException('Published content API content does not match its version.');
                }

                if (($snapshot['version'] ?? null) !== $validated['version']) {
                    $cache->forever($key, $validated);
                }

                return $validated['data'];
            } catch (Throwable $exception) {
                report($exception);
                $retryAfter = min(60, $retryAfter);

                return $snapshot['data'] ?? $unavailable;
            } finally {
                $cache->put($key.':checked', true, $retryAfter);
            }
        } catch (LockTimeoutException $exception) {
            return $cache->get($key)['data'] ?? $unavailable;
        } finally {
            $lock->release();
        }
    }
}
