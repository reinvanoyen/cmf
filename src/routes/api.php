<?php

use ReinVanOyen\Cmf\Http\Controllers\{
    ModulesController,
    ComponentsController,
    AuthController,
    MediaController
};

use \ReinVanOyen\Cmf\Http\Middleware\{
    Authenticate,
    DispatchServingCmfEvent
};

Route::middleware([
    'web',
    Authenticate::class,
    DispatchServingCmfEvent::class,
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

        // Media
        Route::post('media/rename-directory', [MediaController::class, 'renameDirectory']);
        Route::post('media/delete-directory', [MediaController::class, 'deleteDirectory']);
        Route::post('media/create-directory', [MediaController::class, 'createDirectory']);

        Route::post('media/upload', [MediaController::class, 'upload']);
        Route::post('media/rename-file', [MediaController::class, 'renameFile']);
        Route::post('media/delete-file', [MediaController::class, 'deleteFile']);
        Route::post('media/delete-files', [MediaController::class, 'deleteFiles']);

    });

Route::post('cmf/api/auth/login', [AuthController::class, 'login'])
    ->middleware(['web', 'guest',]);
