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
     * Title of the CMF application
     *
     * @var string $title
     */
    private $title;

    /**
     * The modules of the CMF application
     *
     * @var array $modules
     */
    private $modules;

    /**
     * An associative array holding the modules, for easier access
     *
     * @var array $modulesMap
     */
    private $modulesMap = [];

    /**
     * Cmf constructor.
     * @param string $title
     */
    public function __construct(string $title)
    {
        $this->title = $title;
    }

    /**
     * Get the title of the CMF application
     *
     * @return string
     */
    public function getTitle(): string
    {
        return $this->title;
    }

    /**
     * Register modules to the CMF
     *
     * @param array $modules
     */
    public function registerModules(array $modules)
    {
        $this->modules = $modules;

        // Store all modules by id in the modules map
        foreach ($modules as $module) {
            $this->modulesMap[$module->id()] = $module;
            foreach ($module->submodules() as $submodule) {
                $this->modulesMap[$submodule->id()] = $submodule;
            }
        }
    }

    /**
     * Get a module by id
     *
     * @param string $id
     * @return Module
     */
    public function getModule(string $id): Module
    {
        return ($this->modulesMap[$id] ?? null);
    }

    /**
     * Get all modules
     *
     * @return array
     */
    public function getModules(): array
    {
        return $this->modules;
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
}
