<?php

namespace ReinVanOyen\Cmf\Console;

use Illuminate\Console\Command;
use ReinVanOyen\Cmf\Facades\Cmf;

class VersionCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cmf:version';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Displays the version of the CMF package';

    /**
     * Execute the console command.
     *
     * @return void
     */
    public function handle()
    {
        $this->info('Laravel CMF '.Cmf::getVersion());
    }
}
