<?php

namespace ReinVanOyen\Cmf;

use Illuminate\Foundation\Application;
use Illuminate\Support\Str;
use ReinVanOyen\Cmf\Exceptions\CouldntGuessMetaException;

class RelationshipMetaGuesser
{
    /**
     * Guess the meta class name from the relationship name
     *
     * @param $name
     * @return string
     * @throws CouldntGuessMetaException
     */
    public static function getMeta($name): string
    {
        $name = Str::studly(Str::singular($name));
        $model = self::getMetaNamespace().'\\'.$name.'Meta';

        if (! class_exists($model)) {
            throw new CouldntGuessMetaException();
        }

        return $model;
    }

    /**
     * @return string
     */
    public static function getMetaNamespace()
    {
        return config('cmf.meta_namespace');
    }
}
