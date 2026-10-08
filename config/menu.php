<?php

return [
    'api_url' => env('MENU_API_URL'),
    'cache_store' => env('MENU_CACHE_STORE', 'file'),
    'check_interval' => (int) env('MENU_CHECK_INTERVAL', 60),
];
