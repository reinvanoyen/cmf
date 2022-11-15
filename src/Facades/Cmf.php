<?php

namespace ReinVanOyen\Cmf\Facades;

use Illuminate\Support\Facades\Facade;

class Cmf extends Facade
{
    protected static function getFacadeAccessor()
    {
        return \ReinVanOyen\Cmf\Cmf::class;
    }
}
