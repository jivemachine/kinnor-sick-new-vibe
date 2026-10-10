<?php

namespace App\Services;

class PublishedMenu
{
    public function __construct(private CachedPublishedData $cache) {}

    /** @return array{active: bool, frames: array}|null */
    public function get(): ?array
    {
        return $this->cache->get(
            url: config('menu.api_url'),
            namespace: 'published-menu:v1',
            store: config('menu.cache_store'),
            checkInterval: (int) config('menu.check_interval'),
            rules: [
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
            ],
            unavailable: ['active' => false, 'frames' => []],
        );
    }
}
