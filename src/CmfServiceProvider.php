<?php

namespace ReinVanOyen\Cmf;

use Illuminate\Support\ServiceProvider;
use Intervention\Image\Image;
use ReinVanOyen\Cmf\Console\UserCommand;
use ReinVanOyen\Cmf\Contracts\MediaConverter;
use ReinVanOyen\Cmf\Media\Converter;

class CmfServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->singleton(Cmf::class, Cmf::class);
        $this->app->singleton(MakeableStorage::class, MakeableStorage::class);
        $this->app->bind(PathResolver::class, PathResolver::class);
        $this->app->singleton(MediaConverter::class, function () {
            $converter = new Converter();
            $converter->registerConversion('cmf-thumb', function (Image $image) {
                $image->fit(250, 250);
            });
            $converter->registerConversion('cmf-preview', function (Image $image) {
                $image->resize(450, null, function ($constraint) {
                    $constraint->aspectRatio();
                });
            });
            return $converter;
        });

        $this->app->when(Cmf::class)
            ->needs('$title')
            ->giveConfig('cmf.title');

        $this->commands([
            UserCommand::class,
        ]);
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPublishes();
        $this->loadRoutes();
        $this->loadViews();
    }

    /**
     *
     */
    private function registerPublishes()
    {
        $this->publishes([
            __DIR__.'/Console/stubs/CmfServiceProvider.stub' => app_path('Providers/CmfServiceProvider.php'),
        ], 'cmf');

        $this->publishes([
            __DIR__.'/../config/cmf.php' => config_path('cmf.php'),
        ], 'cmf');

        $this->publishes([
            __DIR__.'/../public' => public_path('vendor/cmf'),
        ], 'cmf');

        $this->publishes([
            __DIR__.'/../database/migrations' => database_path('migrations'),
        ], 'cmf');
    }

    /**
     *
     */
    private function loadRoutes()
    {
        $this->loadRoutesFrom(__DIR__.'/routes/api.php');
        $this->loadRoutesFrom(__DIR__.'/routes/web.php');
    }

    /**
     *
     */
    private function loadViews()
    {
        $this->loadViewsFrom(__DIR__.'/../resources/views', 'cmf');
    }
}
