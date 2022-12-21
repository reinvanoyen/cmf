<?php

namespace ReinVanOyen\Cmf\Components;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use ReinVanOyen\Cmf\Contracts\{Exportable, Makeable};
use ReinVanOyen\Cmf\Action\Action;
use ReinVanOyen\Cmf\Http\Resources\ModelResource;
use ReinVanOyen\Cmf\Traits\CanExport;
use ReinVanOyen\Cmf\Traits\CanBeMade;

abstract class Component implements Exportable, Makeable, \JsonSerializable
{
    use CanExport;
    use CanBeMade;

    /**
     * @var Action $action
     */
    protected $action;

    /**
     * @param Model $model
     * @param Request $request
     */
    public function save(Model $model, Request $request)
    {
        //
    }

    /**
     * @param ModelResource $model
     * @param array $attributes
     */
    public function provision(ModelResource $model, array &$attributes)
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

    /**
     * @param array $validationRules
     * @return array
     */
    public function registerValidationRules(array $validationRules): array
    {
        return $validationRules;
    }
}
