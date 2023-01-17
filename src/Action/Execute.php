<?php

namespace ReinVanOyen\Cmf\Action;

use Illuminate\Http\Request;
use ReinVanOyen\Cmf\Http\Resources\ModelResource;

class Execute extends Action
{
    /**
     * @var callable $handle
     */
    private $handle;

    /**
     * @param string $meta
     * @throws \ReinVanOyen\Cmf\Exceptions\InvalidMetaException
     */
    public function __construct(string $meta)
    {
        $this->meta($meta);
    }

    /**
     * @return string
     */
    public function type(): string
    {
        return 'execute';
    }

    /**
     * @param callable $handle
     * @return $this
     */
    public function handle(callable $handle)
    {
        $this->handle = $handle;
        return $this;
    }

    /**
     * @param Request $request
     * @return ModelResource
     */
    public function apiHandle(Request $request)
    {
        $modelClass = $this->getMeta()::getModel();
        $modelInstance = $modelClass::findOrFail($request->input('id'));

        $result = call_user_func($this->handle, $modelInstance, $request);

        return new ModelResource($modelInstance);
    }
}
