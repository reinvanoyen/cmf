<?php

namespace ReinVanOyen\Cmf\Tests;

use ReinVanOyen\Cmf\Facades\Cmf;
use ReinVanOyen\Cmf\CmfServiceProvider;
use ReinVanOyen\Cmf\Tests\Fixtures\Modules\UserModule;

class TestCase extends \Orchestra\Testbench\TestCase
{
    public function setUp(): void
    {
        parent::setUp();

        $this->loadMigrations();

        Cmf::registerModules([
            UserModule::class,
        ]);
    }

    /**
     * Get package providers.
     *
     * @param  \Illuminate\Foundation\Application  $app
     *
     * @return array<int, class-string<\Illuminate\Support\ServiceProvider>>
     */
    protected function getPackageProviders($app)
    {
        return [
            CmfServiceProvider::class,
        ];
    }

    /**
     * Define environment.
     *
     * @param  \Illuminate\Foundation\Application  $app
     * @return void
     */
    protected function getEnvironmentSetUp($app)
    {
        $app['config']->set('database.connections.sqlite', [
            'driver'   => 'sqlite',
            'database' => ':memory:',
            'prefix'   => '',
        ]);
    }

    /**
     * Load the migrations for the test environment.
     *
     * @return void
     */
    protected function loadMigrations()
    {
        $this->loadMigrationsFrom([
            '--database' => 'sqlite',
            '--path' => realpath(__DIR__.'/Migrations'),
        ]);
    }
}
