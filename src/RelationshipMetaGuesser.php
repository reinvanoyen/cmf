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
        $model = self::getMetaNamespace().'\\'.$name.'Meta';

        if (class_exists($model)) {
            return $model;
        }

        return null;
    }

    /**
     * @return string
     */
    public static function getMetaNamespace()
    {
        return Application::getInstance()->getNamespace().config('cmf.meta_namespace');
    }
}
