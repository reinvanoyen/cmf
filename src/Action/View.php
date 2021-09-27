<?php

namespace ReinVanOyen\Cmf\Action;

use Illuminate\Http\Request;
use ReinVanOyen\Cmf\Http\Resources\ModelResource;

class View extends Action
{
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
        return 'view';
    }

    /**
     * @return array|mixed
     */
    public function load(Request $request)
    {
        ModelResource::provision($this->components);

        return new ModelResource($this->model::findOrFail($request->get('id')));
    }
}
