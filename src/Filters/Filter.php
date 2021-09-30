<?php

namespace ReinVanOyen\Cmf\Filters;

use ReinVanOyen\Cmf\Contracts\{Exportable, Makeable};
use Illuminate\Http\Request;
use ReinVanOyen\Cmf\Action\Action;
use ReinVanOyen\Cmf\Traits\CanExport;
use ReinVanOyen\Cmf\Traits\CanBeMade;

abstract class Filter implements Exportable, Makeable, \JsonSerializable
{
    use CanExport;
    use CanBeMade;

    private $action;

    public function apply(Request $request, $query)
    {
        //
    }

    /**
     * @param Action $action
     */
    public function resolve(Action $action)
    {
        $this->action = $action;
    }
}
