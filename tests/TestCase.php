<?php

namespace ReinVanOyen\Cmf\Tests;

use ReinVanOyen\Cmf\CmfServiceProvider;

class TestCase extends \Orchestra\Testbench\TestCase
{
    public function setUp(): void
    {
        parent::setUp();

        $this->loadMigrations();
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

        $app['config']->set('cmf.meta_namespace', 'ReinVanOyen\\Cmf\\Tests\\Fixtures\\Meta');
        $app['config']->set('cmf.modules_namespace', 'ReinVanOyen\\Cmf\\Tests\\Fixtures\\Modules');
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
