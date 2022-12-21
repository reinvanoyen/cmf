<?php

namespace ReinVanOyen\Cmf;

use Illuminate\Support\Facades\Event;
use ReinVanOyen\Cmf\Events\ServingCmf;

/**
 * Class Cmf
 * @package ReinVanOyen\Cmf
 */
class Cmf
{
    /**
     * @var ModuleRegistry $modules
     */
    private ModuleRegistry $modules;

    /**
     * Cmf constructor.
     * @param ModuleRegistry $modules
     */
    public function __construct(ModuleRegistry $modules)
    {
        $this->modules = $modules;
    }

    /**
     * @return string
     */
    public function getVersion(): string
    {
        return '0.1.14-dev';
    }

    /**
     * @param array $modules
     */
    public function registerModules(array $modules)
    {
        foreach ($modules as $module) {
            $this->registerModule($module);
        }
    }

    /**
     * @param $module
     */
    public function registerModule($module)
    {
        $module = $this->modules->add($module);

        if ($module) {
            foreach ($module->submodules() as $submodule) {
                $this->modules->add($submodule, false);
            }
        }
    }

    /**
     * Get a module by id
     *
     * @param string $id
     * @return Module
     */
    public function getModule(string $id): ?Module
    {
        return $this->modules->get($id);
    }

    /**
     * Get all root modules
     *
     * @return array
     */
    public function getModules(): array
    {
        return $this->modules->root();
    }

    /**
     * Call a callback function when the CMF is serving
     *
     * @param $call
     */
    public function serving($call)
    {
        Event::listen(ServingCmf::class, $call);
    }

    /**
     * @return string
     */
    public function getPath(): string
    {
        return config('cmf.path', 'admin');
    }
}
