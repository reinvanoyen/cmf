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
     * @var string $title
     */
    private $title;

    /**
     * @var array $modules
     */
    private $modules;

    /**
     * @var array $modulesMap
     */
    private $modulesMap = [];

    /**
     * @return string
     */
    public function getTitle(): string
    {
        return $this->title;
    }

    /**
     * @param string $title
     */
    public function setTitle(string $title)
    {
        $this->title = $title;
    }

    /**
     * @param array $modules
     */
    public function registerModules(array $modules)
    {
        $this->modules = $modules;

        // Store all modules by id in the modules map
        foreach ($modules as $module) {
            $this->modulesMap[$module->id()] = $module;
        }
    }

    /**
     * @param string $id
     * @return Module
     */
    public function getModule(string $id): Module
    {
        return ($this->modulesMap[$id] ?? null);
    }

    /**
     * @return array
     */
    public function getModules(): array
    {
        return $this->modules;
    }

    /**
     * @param $call
     */
    public function serving($call)
    {
        Event::listen(ServingCmf::class, $call);
    }
}
