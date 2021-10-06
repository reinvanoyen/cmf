<?php

namespace ReinVanOyen\Cmf;

use Illuminate\Support\ServiceProvider;
use ReinVanOyen\Cmf\Console\UserCommand;

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