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
    <meta name="cmf:version" content="{{ Cmf::getVersion() }}" />

    <link href="{{ mix('app.css', 'vendor/cmf') }}" rel="stylesheet" />
    <link rel="preconnect" href="https://fonts.gstatic.com" />
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&family=Material+Icons+Outlined&display=swap" rel="stylesheet" />

    <style>
        :root {
            --theme-image-src: url({{ $theme['image'] }});
            --primary-color: {{ $theme['primary_color'] }};
            --primary-color-alt-1: {{ $theme['primary_color_alt_1'] }};
            --primary-color-alt-2: {{ $theme['primary_color_alt_2'] }};
            --primary-color-alt-3: {{ $theme['primary_color_alt_3'] }};
            --fill-color: {{ $theme['fill_color'] }};
            --fill-color-alt-1: {{ $theme['fill_color_alt_1'] }};
            --fill-color-alt-2: {{ $theme['fill_color_alt_2'] }};
            --fill-color-alt-3: {{ $theme['fill_color_alt_3'] }};
        }
    </style>

</head>

<body>
@yield('body')
<script src="{{ Cmf::getPath('js/i18n') }}"></script>
<script src="{{ mix('app.js', 'vendor/cmf')  }}"></script>
</body>
</html>
