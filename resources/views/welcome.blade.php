<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title>Kinnor Coffee — Coffee, Cocktails &amp; Community</title>

    <meta
        name="description"
        content="A small family-owned specialty coffee shop and craft cocktail lounge in the heart of New Braunfels, Texas."
    >

    <meta name="theme-color" content="#2e4759">

    @vite([
        'resources/css/app.css',
        'resources/js/app.js',
    ])
</head>
<body>
    <div id="kinnor-app">
        <noscript>
            This website needs JavaScript enabled.
        </noscript>
    </div>
</body>
</html>
