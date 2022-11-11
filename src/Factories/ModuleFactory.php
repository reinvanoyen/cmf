<?php

namespace ReinVanOyen\Cmf\Factories;

use ReinVanOyen\Cmf\Module;

class ModuleFactory
{
    public static function make($module)
    {
        if (is_string($module)) {
            return app($module);
        }
        if ($module instanceof  Module) {
            return $module;
        }
        return null;
    }
}
