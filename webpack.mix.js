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

mix
    .setPublicPath('public')
    .sass('resources/sass/app.scss', 'public/css')
    .js('resources/js/app.js', 'public/js').react();

mix.extract(['redux', 'redux-react', 'react', 'react-dom', 'react-trix', 'trix'], 'public/js/vendor.js');

if (mix.inProduction()) {
    mix.version();
    return;
}

mix.copy('public', '../public/vendor/cmf');

