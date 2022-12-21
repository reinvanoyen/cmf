<?php

namespace ReinVanOyen\Cmf\Factories;

use ReinVanOyen\Cmf\Module;

class ModuleFactory
{
    /**
     * @param Module|string $module
     * @return Module|null
     */
    public function make($module): ?Module
    {
        if ($module instanceof Module) {
            return $module;
        }

        if (is_subclass_of($module, Module::class)) {
            return app($module);
        }

        return null;
    }
}
