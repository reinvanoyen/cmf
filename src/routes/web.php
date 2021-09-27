<?php

use ReinVanOyen\Cmf\Http\Controllers\{
    FrontController,
    ComponentsController
};

use \ReinVanOyen\Cmf\Http\Middleware\{
    DispatchServingCmfEvent,
    Authenticate
};

Route::get('admin', [FrontController::class, 'index'])
    ->middleware('web');

Route::get('admin/{path}', [FrontController::class, 'index'])
    ->where('path', '.*')
    ->middleware('web');

Route::get('admin/{path}', [FrontController::class, 'index'])
    ->where('path', '.*')
    ->middleware('web');
