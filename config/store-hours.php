<?php

return [
    'api_url' => env('STORE_HOURS_API_URL'),
    'cache_store' => env('STORE_HOURS_CACHE_STORE', env('MENU_CACHE_STORE', 'file')),
    'check_interval' => (int) env('STORE_HOURS_CHECK_INTERVAL', env('MENU_CHECK_INTERVAL', 3600)),
];
