<?php

namespace ReinVanOyen\Cmf\Components;

use Illuminate\Database\Eloquent\Model;
use ReinVanOyen\Cmf\Action\Action;
use ReinVanOyen\Cmf\Http\Resources\ModelResource;

abstract class Compound extends Component
{
    /**
     * @var array $components
     */
    protected $components;

    /**
     * Compound constructor.
     * @param array $components
     */
    public function __construct(array $components = [])
    {
        $this->components = $components;
        $this->export('components', $this->components);
    }

    /**
     * @param Action $action
     */
    public function resolve(Action $action)
    {
        foreach ($this->components as $component) {
            $component->resolve($action);
        }

        parent::resolve($action);
    }

    /**
     * @param ModelResource $model
     * @param array $attributes
     */
    public function provision(ModelResource $model, array &$attributes)
    {
        foreach ($this->components as $component) {
            $component->provision($model, $attributes);
        }
    }

    /**
     * @param array $validationRules
     * @return array
     */
    public function registerValidationRules(array $validationRules): array
    {
        foreach ($this->components as $component) {
            $validationRules = array_merge($validationRules, $component->registerValidationRules($validationRules));
        }

        return $validationRules;
    }

    /**
     * @param Model $model
     * @param \Illuminate\Http\Request $request
     */
    public function save(Model $model, $request)
    {
        foreach ($this->components as $component) {
            $component->save($model, $request);
        }
    }
}
