<?php

use ReinVanOyen\Cmf\Http\Controllers\{
    FrontController,
    MediaController,
    TranslationsController
};

use \ReinVanOyen\Cmf\Http\Middleware\{
    Gate,
    SetLocale
};

use \Illuminate\Cookie\Middleware\EncryptCookies;
use \Illuminate\Session\Middleware\StartSession;

use ReinVanOyen\Cmf\Facades\Cmf;

Route::middleware([
    EncryptCookies::class,
    StartSession::class,
    Gate::class, SetLocale::class])
    ->prefix(Cmf::getPath())
    ->group(function () {

        Route::get('/', [FrontController::class, 'index']);
        Route::get('js/i18n', [TranslationsController::class, 'javascript']);

        Route::get('{path}', [FrontController::class, 'index'])->where('path', '.*');
    });

Route::prefix('media')
    ->group(function () {

        Route::get('{id}/{filename}', [MediaController::class, 'streamFile'])
            ->where('id', '[0-9]+')
            ->name('mediafile');

        Route::get('url/{id}/{filename}', [MediaController::class, 'redirectToFile'])
            ->where('id', '[0-9]+')
            ->name('mediafileurl');

        Route::get('{conversion}/{id}/{filename}', [MediaController::class, 'streamFileConversion'])
            ->where('id', '[0-9]+')
            ->name('mediafileconversion');
    });
