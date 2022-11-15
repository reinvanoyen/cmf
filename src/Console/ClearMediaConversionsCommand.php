<?php

namespace ReinVanOyen\Cmf\Console;

use Illuminate\Console\Command;
use Illuminate\Filesystem\Filesystem;
use ReinVanOyen\Cmf\Models\MediaFile;

class ClearMediaConversionsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cmf:clear-media-conversions';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clears all generated media conversions';

    /**
     * @var Filesystem $filesystem
     */
    private $filesystem;

    /**
     * MetaCommand constructor.
     * @param Filesystem $filesystem
     */
    public function __construct(Filesystem $filesystem)
    {
        $this->filesystem = $filesystem;
        parent::__construct();
    }

    /**
     * @throws \Illuminate\Contracts\Filesystem\FileNotFoundException
     */
    public function handle()
    {
        $files = MediaFile::all();

        foreach ($files as $file) {
            $file->clearConversions();
            $this->info('Deleting conversions of file with id '.$file->id);
        }
    }
}
