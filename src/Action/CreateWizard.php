<?php

namespace ReinVanOyen\Cmf\Action;

use Illuminate\Http\Request;
use ReinVanOyen\Cmf\Http\Resources\ModelResource;
use ReinVanOyen\Cmf\Traits\CanRedirect;

class CreateWizard extends Action
{
    use CanRedirect;

    /**
     * @var string $model
     */
    private $model;

    /**
     * @var array $steps
     */
    private $steps;

    /**
     * @var int $restrictByFk
     */
    private $restrictByFk;

    /**
     * Create constructor.
     * @param string $model
     */
    public function __construct(string $model)
    {
        $this->model = $model;
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
     * @param string $title
     * @param array $components
     * @return $this
     */
    public function step(string $title, array $components = [])
    {
        $this->steps[] = [
            'title' => $title,
            'components' => $components,
        ];
        $this->export('steps', $this->steps);
        return $this;
    }

    /**
     * @return string
     */
    public function type(): string
    {
        return 'create-wizard';
    }

    /**
     * @param Request $request
     * @return array|mixed
     */
    public function save(Request $request)
    {
        $components = [];

        // Validate
        $validationRules = [];
        foreach ($this->steps as $step) {
            foreach ($step['components'] as $component) {
                $components[] = $component;
                $validationRules = array_merge($validationRules, $component->registerValidationRules($validationRules));
            }
        }

        $request->validate($validationRules);

        // Save
        $modelClass = $this->model;
        $model = new $modelClass();

        foreach ($this->steps as $step) {
            foreach ($step['components'] as $component) {
                $component->save($model, $request);
            }
        }

        if ($this->restrictByFk) {
            $model->{$this->restrictByFk} = $request->input($this->restrictByFk);
        }

        $model->save();

        ModelResource::provision($components);

        return new ModelResource($model);
    }
}
