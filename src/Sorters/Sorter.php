<?php

namespace ReinVanOyen\Cmf\Sorters;

use ReinVanOyen\Cmf\Contracts\{Exportable, Makeable};
use Illuminate\Http\Request;
use ReinVanOyen\Cmf\Action\CollectionAction;
use ReinVanOyen\Cmf\Traits\CanExport;
use ReinVanOyen\Cmf\Traits\CanBeMade;

abstract class Sorter implements Exportable, Makeable, \JsonSerializable
{
    use CanExport;
    use CanBeMade;

    /**
     * @var $action
     */
    private $action;

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
     * @param $action
     * @return void
     */
    public function resolve($action): void
    {
        $this->action = $action;
    }

    /**
     * @return CollectionAction
     */
    public function getAction(): CollectionAction
    {
        return $this->action;
    }
}
