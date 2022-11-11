<?php

namespace ReinVanOyen\Cmf;

use Illuminate\Support\Facades\Event;
use ReinVanOyen\Cmf\Events\ServingCmf;
use ReinVanOyen\Cmf\Factories\ModuleFactory;

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
     * @var ModuleRegistry $modules
     */
    private $modules;

    /**
     * Cmf constructor.
     * @param ModuleRegistry $modules
     * @param string $title
     */
    public function __construct(ModuleRegistry $modules, string $title)
    {
        $this->title = $title;
        $this->modules = $modules;
    }

    /**
     * Set the title of the CMF application
     *
     * @param string $title
     */
    public function setTitle(string $title)
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

        foreach ($module->submodules() as $submodule) {
            $this->modules->add($submodule, false);
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
}
