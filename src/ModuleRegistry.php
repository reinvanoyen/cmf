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
     * Add a module to the registry. If the module you're passing is a string, we'll try to make it into an instance
     * before registering.
     *
     * @param string|Module $module
     * @param bool $isRoot
     * @return Module|null
     */
    public function add($module, bool $isRoot = true): ?Module
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
     * Get a module from the registry by its id
     *
     * @param string $id
     * @return mixed|null
     */
    public function get(string $id): ?Module
    {
        return ($this->modulesMap[$id] ?? null);
    }

    /**
     * Get all root modules
     *
     * @return array
     */
    public function root(): array
    {
        return $this->modules;
    }

    /**
     * Get all modules
     *
     * @return array
     */
    public function all(): array
    {
        return array_values($this->modulesMap);
    }
}
