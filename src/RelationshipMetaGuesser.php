<?php

namespace ReinVanOyen\Cmf;

use Illuminate\Foundation\Application;
use Illuminate\Support\Str;

class RelationshipMetaGuesser
{
    /**
     * Get the meta class name from the relationship name
     *
     * @param  string  $name
     * @return string
     */
    public static function getMeta($name): ?string
    {
        $name = Str::studly(Str::singular($name));
        $model = Application::getInstance()->getNamespace().'Cmf\\Meta\\'.$name.'Meta';

        if (class_exists($model)) {
            return $model;
        }

        return null;
    }
}
