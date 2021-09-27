<?php

namespace ReinVanOyen\Cmf\Action;

use Illuminate\Http\Request;
use ReinVanOyen\Cmf\Http\Resources\ModelResource;
use ReinVanOyen\Cmf\Traits\CanRedirect;

class Create extends Action
{
    use CanRedirect;

    /**
     * @var string $model
     */
    private $model;

    /**
     * @var array $components
     */
    private $components;

    /**
     * @var int $restrictByFk
     */
    private $restrictByFk;

    /**
     * Create constructor.
     * @param string $model
     * @param array $components
     */
    public function __construct(string $model, array $components)
    {
        $this->model = $model;
        $this->components = $components;
        $this->export('components', $components);
    }

    /**
     * @param string $column
     * @return $this
     */
    public function restrictByForeignKey(string $column)
    {
        $this->restrictByFk = $column;
        $this->export('restrictByFk', $column);
        return $this;
    }

    /**
     * @return string
     */
    public function type(): string
    {
        return 'create';
    }

    /**
     * @param Request $request
     * @return array|mixed
     */
    public function save(Request $request)
    {
        // Validate
        $validationRules = [];
        foreach ($this->components as $component) {
            $validationRules = array_merge($validationRules, $component->registerValidationRules($validationRules));
        }

        $request->validate($validationRules);

        // Save
        $modelClass = $this->model;
        $model = new $modelClass();

        foreach ($this->components as $component) {
            $component->save($model, $request);
        }

        if ($this->restrictByFk) {
            $model->{$this->restrictByFk} = $request->input($this->restrictByFk);
        }

        $model->save();

        ModelResource::provision($this->components);

        return new ModelResource($model);
    }
}
