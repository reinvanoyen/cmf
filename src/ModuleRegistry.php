<?php

namespace ReinVanOyen\Cmf;

use ReinVanOyen\Cmf\Factories\ModuleFactory;

class ModuleRegistry
{
    /**
     * @var array $modules
     */
    private $modules;

    /**
     * @var array $modulesMap
     */
    private $modulesMap;

    /**
     * @param $module
     * @param bool $isRoot
     * @return \Illuminate\Contracts\Foundation\Application|mixed|null
     */
    public function add($module, $isRoot = true)
    {
        $module = ModuleFactory::make($module);
        $this->modulesMap[$module->id()] = $module;

        if ($isRoot) {
            $this->modules[] = $module;
        }

        return $module;
    }

    /**
     * @param string $id
     * @return mixed|null
     */
    public function get(string $id): ?Module
    {
        return ($this->modulesMap[$id] ?? null);
    }

    /**
     * @return array
     */
    public function root(): array
    {
        return $this->modules;
    }

    /**
     * @return array
     */
    public function all(): array
    {
        return array_keys($this->modulesMap);
    }
}
