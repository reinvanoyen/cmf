<?php

namespace ReinVanOyen\Cmf\Action;

use Illuminate\Http\Request;
use ReinVanOyen\Cmf\Http\Resources\ModelResource;
use ReinVanOyen\Cmf\Traits\CanRedirect;

class Edit extends Action
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
     * Edit constructor.
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
     * @return string
     */
    public function type(): string
    {
        return 'edit';
    }

    /**
     * @return array|mixed
     */
    public function load(Request $request)
    {
        ModelResource::provision($this->components);

        return new ModelResource($this->model::findOrFail($request->get('id')));
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

        $validationRules['id'] = 'required|integer';

        $request->validate($validationRules);

        // Save
        $model = $this->model::findOrFail($request->input('id'));

        foreach ($this->components as $component) {
            $component->save($model, $request);
        }

        $model->save();

        ModelResource::provision($this->components);

        return new ModelResource($model);
    }
}
