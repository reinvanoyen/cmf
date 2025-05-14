<?php

namespace ReinVanOyen\Cmf\Action;

use Illuminate\Http\Request;
use ReinVanOyen\Cmf\Http\Resources\ModelResource;

class View extends Action
{
    /**
     * @param string $meta
     * @param array $components
     * @throws \ReinVanOyen\Cmf\Exceptions\InvalidMetaException
     */
    public function __construct(string $meta, array $components = [])
    {
        $this->meta($meta);
        $this->components(count($components) ? $components : $meta::view());
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
    public function apiLoad(Request $request)
    {
        $modelClass = $this->getMeta()::getModel();

        ModelResource::provision($this->components);

        return new ModelResource($modelClass::findOrFail($request->get('id')));
    }
}
