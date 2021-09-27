<?php

namespace ReinVanOyen\Cmf\Support;

class Str
{
    public static function labelify(string $string): string
    {
        $string = str_replace('_', ' ', $string);
        return $string;
    }
}
