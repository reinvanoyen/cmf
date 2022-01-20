<?php

namespace ReinVanOyen\Cmf\Console;

use Illuminate\Console\Command;
use Illuminate\Filesystem\Filesystem;
use Illuminate\Foundation\Application;

class MetaCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cmf:meta {model}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Creates a new meta file';

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
        $namespace = $this->getMetaNamespace();
        $model = $this->argument('model');
        $path = str_replace('\\', '/', $namespace).'/';

        $contents = $this->filesystem->get(__DIR__.'/stubs/Meta.stub');

        $contents = str_replace(
            ['{{model}}', '{{ model }}',],
            [$model, $model,],
            $contents
        );

        $contents = str_replace(
            ['{{namespace}}', '{{ namespace }}',],
            [$namespace, $namespace,],
            $contents
        );

        if (! $this->filesystem->isDirectory($path)) {
            $this->filesystem->makeDirectory($path, 0777, true, true);
        }

        if ($this->filesystem->exists($path.$model.'Meta.php')) {
            $this->error($path.$model.'Meta.php already exists!');
            return false;
        }

        $this->filesystem->put($path.$model.'Meta.php', $contents);

        $this->info($model.'Meta created successfully.');
    }

    /**
     * @return string
     */
    private function getMetaNamespace()
    {
        return Application::getInstance()->getNamespace().config('cmf.meta_namespace');
    }
}
