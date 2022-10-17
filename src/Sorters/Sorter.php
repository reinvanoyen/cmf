<?php

namespace ReinVanOyen\Cmf\Sorters;

use ReinVanOyen\Cmf\Contracts\{Exportable, Makeable};
use Illuminate\Http\Request;
use ReinVanOyen\Cmf\Action\Action;
use ReinVanOyen\Cmf\Action\CollectionAction;
use ReinVanOyen\Cmf\Traits\CanExport;
use ReinVanOyen\Cmf\Traits\CanBeMade;

abstract class Sorter implements Exportable, Makeable, \JsonSerializable
{
    use CanExport;
    use CanBeMade;

    /**
     * @var Action $action
     */
    protected $action;

    /**
     * @param Request $request
     * @param $query
     * @return mixed
     */
    public function apply(Request $request, $query)
    {
        return $query;
    }

    /**
     * @param CollectionAction $action
     */
    public function resolve(CollectionAction $action)
    {
        $this->action = $action;
    }
}
