<?php

use ReinVanOyen\Cmf\Http\Controllers\{
    FrontController,
    MediaController
};

use ReinVanOyen\Cmf\Facades\Cmf;

Route::middleware('web')
    ->prefix(Cmf::getPath())
    ->group(function () {
        Route::get('/', [FrontController::class, 'index']);

        Route::get('{path}', [FrontController::class, 'index'])
            ->where('path', '.*');
    });

Route::middleware('web')
    ->prefix('media')
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
