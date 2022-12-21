<?php

namespace ReinVanOyen\Cmf;

use ReinVanOyen\Cmf\Factories\ModuleFactory;

class ModuleRegistry
{
    /**
     * @var ModuleFactory $factory
     */
    private ModuleFactory $factory;

    /**
     * @var array $modules
     */
    private array $modules = [];

    /**
     * @var array $modulesMap
     */
    private array $modulesMap = [];

    /**
     * @param ModuleFactory $factory
     */
    public function __construct(ModuleFactory $factory)
    {
        $this->factory = $factory;
    }

    /**
     * @param string|Module $module
     * @param bool $isRoot
     * @return Module|null
     */
    public function add(Module|string $module, bool $isRoot = true): ?Module
    {
        $module = $this->factory->make($module);

        if (! $module) {
            return null;
        }

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
        return array_values($this->modulesMap);
    }
}
