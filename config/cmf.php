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

    'title' => env('APP_NAME'),

    /*
    |--------------------------------------------------------------------------
    | Theme image path
    |--------------------------------------------------------------------------
    |
    | This is the source to the image used in external pages such as the login page.
    | This option is provided to allow for quick customization of the CMF panel.
    |
    */
    'theme_image_src' => '/vendor/cmf/splash.jpg',

    /*
    |--------------------------------------------------------------------------
    | Media library disk
    |--------------------------------------------------------------------------
    |
    | The disk to use for the media library.
    |
    */
    'media_library_disk' => config('filesystems.default'),
];
