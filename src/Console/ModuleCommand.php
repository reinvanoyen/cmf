<?php

namespace ReinVanOyen\Cmf\Console;

use Illuminate\Console\Command;
use Illuminate\Filesystem\Filesystem;
use Illuminate\Foundation\Application;
use Illuminate\Support\Str;

class ModuleCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cmf:module {model}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Creates a new module';

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
        $namespace = $this->getModulesNamespace();
        $model = $this->argument('model');
        $meta = $model.'Meta';
        $path = str_replace('\\', '/', $namespace).'/';

        $contents = $this->filesystem->get(__DIR__.'/stubs/Module.stub');

        $replace = [
            '{{ meta }}' => $meta,
            '{{ metaNamespace }}' => $this->getMetaNamespace(),
            '{{ namepace }}' => $namespace,
            '{{ model }}' => $model,
            '{{ modelPlural }}' => Str::plural($model),
            '{{ modelSingular }}' => Str::lower(Str::singular($model)),
        ];

        $contents = str_replace(array_keys($replace), array_values($replace), $contents);

        if (! $this->filesystem->isDirectory($path)) {
            $this->filesystem->makeDirectory($path, 0777, true, true);
        }

        if ($this->filesystem->exists($path.$model.'Module.php')) {
            $this->error($path.$model.'Module.php already exists!');
            return false;
        }

        $this->filesystem->put($path.$model.'Module.php', $contents);

        $this->info($model.'Module created successfully.');
    }

    /**
     * @return string
     */
    private function getModulesNamespace()
    {
        return config('cmf.modules_namespace');
    }

    /**
     * @return string
     */
    private function getMetaNamespace()
    {
        return config('cmf.meta_namespace');
    }
}
