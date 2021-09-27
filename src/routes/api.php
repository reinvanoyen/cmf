<?php

use ReinVanOyen\Cmf\Http\Controllers\{
    ModulesController,
    ComponentsController,
    AuthController
};

use \ReinVanOyen\Cmf\Http\Middleware\{
    Authenticate,
    DispatchServingCmfEvent
};

Route::middleware([
    'web',
    Authenticate::class,
    DispatchServingCmfEvent::class,
    //SetLocale::class,
])
    ->namespace('ReinVanOyen\Cmf\Http\Controllers')
    ->prefix('cmf/api')
    ->group(function() {

        Route::get('modules', [ModulesController::class, 'index']);
        Route::get('modules/{module}/{action}', [ModulesController::class, 'action']);

        Route::get('modules/{module}/{action}/{id}/{execute}', [ComponentsController::class, 'execute'])->where('id', '[0-9]+');
        Route::post('modules/{module}/{action}/{id}/{execute}', [ComponentsController::class, 'execute'])->where('id', '[0-9]+');

        // Get user data
        Route::get('auth/user', [AuthController::class, 'user']);
        Route::get('auth/logout', [AuthController::class, 'logout']);
    });

Route::post('cmf/api/auth/login', [AuthController::class, 'login'])
    ->middleware(['web', 'guest',]);
