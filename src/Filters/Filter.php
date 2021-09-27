<?php

namespace ReinVanOyen\Cmf\Filters;

use ReinVanOyen\Cmf\Contracts\{Exportable, Makeable};
use Illuminate\Http\Request;
use ReinVanOyen\Cmf\Traits\CanExport;
use ReinVanOyen\Cmf\Traits\CanBeMade;

abstract class Filter implements Exportable, Makeable, \JsonSerializable
{
    use CanExport;
    use CanBeMade;

    public function apply(Request $request, $query)
    {
        //
    }
}
