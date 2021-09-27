const mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

// Styleguide
mix
    .sass('resources/sass/app.scss', 'public')
    .react('resources/js/app.js', 'public')
    .setPublicPath('public')
    .copy('public', '../public/vendor/cmf');

if (mix.inProduction()) {
    mix.version();
}
