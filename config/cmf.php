<?php

return [

    /*
    |--------------------------------------------------------------------------
    | CMF App Name
    |--------------------------------------------------------------------------
    |
    | This value is the name of your application. This value is used when the
    | framework needs to display the name of the application within the UI
    | or in other locations. Of course, you're free to change the value.
    |
    */

    'title' => env('APP_NAME', 'Your Application'),

    /*
    |--------------------------------------------------------------------------
    | Path
    |--------------------------------------------------------------------------
    |
    | The path from which the CMF application will be accessible.
    | Default is yourdomain.local/admin
    |
    */
    'path' => 'admin',

    /*
    |--------------------------------------------------------------------------
    | Locale
    |--------------------------------------------------------------------------
    |
    | The locale of the admin panel.
    |
    */
    'locale' => 'en',

    /*
    |--------------------------------------------------------------------------
    | Theme
    |--------------------------------------------------------------------------
    */
    'theme' => [
        'image' => '/vendor/cmf/assets/splash.jpg',
        'primary_color' => '#6226db',
        'primary_color_spin' => -30,
        'primary_color_strength' => 50,
        'border_radius' => '5px',
    ],

    /*
    |--------------------------------------------------------------------------
    | Media library disk
    |--------------------------------------------------------------------------
    |
    | The disk to use for the media library.
    |
    */
    'media_library_disk' => env('CMF_DEFAULT_MEDIA_DISK', 'public'),

    /*
    |--------------------------------------------------------------------------
    | Media conversions disk
    |--------------------------------------------------------------------------
    |
    | The disk to use for conversions of media files.
    |
    */
    'media_conversions_disk' => env('CMF_MEDIA_CONVERSIONS_DISK', 'public'),

    /*
    |--------------------------------------------------------------------------
    | Meta namespace
    |--------------------------------------------------------------------------
    |
    | The namespace of your Meta classes, excluding the application namespace.
    | e.g. App\Cmf\Meta becomes Cmf\Meta
    */
    'meta_namespace' => 'App\\Cmf\\Meta',

    /*
    |--------------------------------------------------------------------------
    | Modules namespace
    |--------------------------------------------------------------------------
    |
    | The namespace of your Module classes, excluding the application namespace.
    | e.g. App\Cmf\Modules becomes Cmf\Modules
    */
    'modules_namespace' => 'App\\Cmf\\Modules',

    /*
    |--------------------------------------------------------------------------
    | Media library file labels
    |--------------------------------------------------------------------------
    |
    | The different labels the user can tag media files with. This can be used for
    | organisational purposes or to implement differing behavior for files
    |
    */
    'media_library_file_labels' => [
        'photo' => [
            'name' => 'Photo',
            'color' => '#4458b3',
        ],
        'document' => [
            'name' => 'Document',
            'color' => '#f14000',
        ],
    ],

];
