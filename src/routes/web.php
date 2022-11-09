<?php

use ReinVanOyen\Cmf\Http\Controllers\{
    FrontController,
    MediaController
};

Route::get('admin', [FrontController::class, 'index'])
    ->middleware('web');

Route::get('admin/{path}', [FrontController::class, 'index'])
    ->where('path', '.*')
    ->middleware('web');

Route::get('media/{id}/{filename}', [MediaController::class, 'streamFile'])
    ->where('id', '[0-9]+')
    ->middleware('web')
    ->name('mediafile');

Route::get('media/url/{id}/{filename}', [MediaController::class, 'redirectToFile'])
    ->where('id', '[0-9]+')
    ->middleware('web')
    ->name('mediafileurl');

Route::get('media/{conversion}/{id}/{filename}', [MediaController::class, 'streamFileConversion'])
    ->where('id', '[0-9]+')
    ->middleware('web')
    ->name('mediafileconversion');
