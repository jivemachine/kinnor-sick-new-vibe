<?php

namespace App\Services;

class PublishedStoreHours
{
    public function __construct(private CachedPublishedData $cache) {}

    /** @return array{timezone: string, hours: array}|null */
    public function get(): ?array
    {
        return $this->cache->get(
            url: config('store-hours.api_url'),
            namespace: 'published-store-hours:v1',
            store: config('store-hours.cache_store'),
            checkInterval: (int) config('store-hours.check_interval'),
            rules: [
                'version' => ['required', 'string', 'regex:/^[a-f0-9]{64}$/'],
                'data' => ['required', 'array:timezone,hours'],
                'data.timezone' => ['required', 'in:America/Chicago'],
                'data.hours' => ['required', 'array', 'size:7'],
                'data.hours.*' => ['required', 'array:0,1', 'size:2'],
                'data.hours.*.0' => ['required', 'string', 'in:MON,TUE,WED,THU,FRI,SAT,SUN', 'distinct'],
                'data.hours.*.1' => ['required', 'string', 'max:100'],
            ],
            unavailable: ['timezone' => 'America/Chicago', 'hours' => []],
        );
    }
}
