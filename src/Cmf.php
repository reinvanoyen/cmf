<?php

namespace ReinVanOyen\Cmf;

use Illuminate\Foundation\Auth\User;
use Illuminate\Support\Facades\Event;
use ReinVanOyen\Cmf\Events\ServingCmf;

/**
 * Class Cmf
 * @package ReinVanOyen\Cmf
 */
class Cmf
{
    /**
     * @var callable $gate
     */
    private $gate;

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
     * Get the version number of this package
     *
     * @return string
     */
    public function getVersion(): string
    {
        return '0.4.4';
    }

    /**
     * @param callable $gate
     * @return void
     */
    public function setGate(callable $gate)
    {
        $this->gate = $gate;
    }

    /**
     * @param User $user
     * @return bool
     */
    public function checkGate(User $user): bool
    {
        return ($this->gate ? call_user_func($this->gate, $user) : true);
    }

    /**
     * Register an array of modules
     *
     * @param array $modules
     */
    public function registerModules(array $modules)
    {
        foreach ($modules as $module) {
            $this->registerModule($module);
        }
    }

    /**
     * Register a module, all its submodules will also get registered
     *
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
     * Register a callback for when the application is serving
     *
     * @param $call
     */
    public function serving($call)
    {
        Event::listen(ServingCmf::class, $call);
    }

    /**
     * Get the path to the admin panel
     *
     * @param $path
     * @return string
     */
    public function getPath($path = null): string
    {
        return config('cmf.path', 'admin').($path ? '/'.$path : '');
    }
}
