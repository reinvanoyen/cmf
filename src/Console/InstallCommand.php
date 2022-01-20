<?php

namespace ReinVanOyen\Cmf\Console;

use Illuminate\Console\Command;

class InstallCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cmf:install';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Installs or updates the CMF package';

    /**
     * Execute the console command.
     *
     * @return void
     */
    public function handle()
    {
        $this->call('vendor:publish', [
            '--tag' => 'cmf-provider',
            '--force' => false,
        ]);

        $this->call('vendor:publish', [
            '--tag' => 'cmf-config',
            '--force' => false,
        ]);

        $this->call('vendor:publish', [
            '--tag' => 'cmf-migrations',
            '--force' => true,
        ]);

        $this->call('vendor:publish', [
            '--tag' => 'cmf-assets',
            '--force' => true,
        ]);

        $this->call('view:clear');
    }
}
