<?php

namespace App\Services;

use Illuminate\Contracts\Cache\LockTimeoutException;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Validator;
use RuntimeException;
use Throwable;

class PublishedMenu
{
    /** @return array{active: bool, frames: array}|null */
    public function get(): ?array
    {
        $url = config('menu.api_url');

        if (! $url) {
            return null;
        }

        $cache = Cache::store(config('menu.cache_store'));
        $key = 'published-menu:v1:'.hash('sha256', $url);
        $snapshot = $cache->get($key);

        if ($cache->has($key.':checked')) {
            return $snapshot['data'] ?? ['active' => false, 'frames' => []];
        }

        $lock = $cache->lock($key.':refresh', 10);

        try {
            $acquired = $snapshot ? $lock->get() : $lock->block(4);

            if (! $acquired) {
                return $snapshot['data'] ?? ['active' => false, 'frames' => []];
            }

            $snapshot = $cache->get($key);

            if ($cache->has($key.':checked')) {
                return $snapshot['data'] ?? ['active' => false, 'frames' => []];
            }

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
                    throw new RuntimeException('Menu API returned invalid JSON.');
                }

                $validated = Validator::make($body, [
                    'version' => ['required', 'string', 'regex:/^[a-f0-9]{64}$/'],
                    'data' => ['required', 'array:active,frames'],
                    'data.active' => ['required', 'boolean'],
                    'data.frames' => ['present', 'array', 'max:9'],
                    'data.frames.*' => ['array:number,label,note,availability,row,groups,footer'],
                    'data.frames.*.number' => ['required', 'string', 'distinct'],
                    'data.frames.*.label' => ['required', 'string'],
                    'data.frames.*.note' => ['present', 'string'],
                    'data.frames.*.availability' => ['present', 'string'],
                    'data.frames.*.row' => ['required', 'integer', 'between:1,9'],
                    'data.frames.*.footer' => ['sometimes', 'string'],
                    'data.frames.*.groups' => ['present', 'array'],
                    'data.frames.*.groups.*' => ['array:label,items'],
                    'data.frames.*.groups.*.label' => ['sometimes', 'string'],
                    'data.frames.*.groups.*.items' => ['present', 'array'],
                    'data.frames.*.groups.*.items.*' => ['array:name,price,description,detail'],
                    'data.frames.*.groups.*.items.*.name' => ['required', 'string'],
                    'data.frames.*.groups.*.items.*.price' => ['sometimes', 'string'],
                    'data.frames.*.groups.*.items.*.description' => ['sometimes', 'string'],
                    'data.frames.*.groups.*.items.*.detail' => ['sometimes', 'string'],
                ])->validate();

                if (! hash_equals($validated['version'], hash('sha256', json_encode($validated['data'], JSON_THROW_ON_ERROR)))) {
                    throw new RuntimeException('Menu API content does not match its version.');
                }

                if (($snapshot['version'] ?? null) !== $validated['version']) {
                    $cache->forever($key, $validated);
                }

                return $validated['data'];
            } catch (Throwable $exception) {
                report($exception);

                return $snapshot['data'] ?? ['active' => false, 'frames' => []];
            } finally {
                $cache->put($key.':checked', true, max(1, (int) config('menu.check_interval')));
            }
        } catch (LockTimeoutException $exception) {
            return $cache->get($key)['data'] ?? ['active' => false, 'frames' => []];
        } finally {
            $lock->release();
        }
    }
}
