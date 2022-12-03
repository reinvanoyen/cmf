<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="UTF-8" />
    <title>@yield('title', 'CMF')</title>
    <base href="{{ url('/') }}" />

    <meta name="robots" content="index, follow" />
    <meta name="author" content="Rein Van Oyen" />
    <meta name="robots" content="index, follow" />
    <meta name="description" content=""/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <meta name="csrf" content="{{ csrf_token() }}" />
    <meta name="cmf:path" content="{{ Cmf::getPath() }}" />

    <link href="{{ mix('app.css', 'vendor/cmf') }}" rel="stylesheet" />
    <link rel="preconnect" href="https://fonts.gstatic.com" />
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&family=Material+Icons+Outlined&display=swap" rel="stylesheet" />

    <style type="text/css">
        :root {
            --theme-image-src: url({{ config('cmf.theme_image_src') }});
        }
    </style>

</head>

<body>
@yield('body')
<script src="{{ mix('app.js', 'vendor/cmf')  }}"></script>
</body>
</html>
