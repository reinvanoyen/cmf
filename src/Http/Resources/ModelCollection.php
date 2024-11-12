<?php

namespace ReinVanOyen\Cmf\Http\Resources;

use Illuminate\Http\Resources\Json\ResourceCollection;

class ModelCollection extends ResourceCollection
{
    /**
     * @param array $components
     */
    public static function provision(array $components)
    {
        ModelResource::provision($components);
    }

    /**
     * @param array $fields
     */
    public static function fields(array $fields)
    {
        ModelResource::fields($fields);
    }

    /**
     * @param array $aliases
     */
    public static function aliases(array $aliases)
    {
        ModelResource::aliases($aliases);
    }

    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'data' => ModelResource::collection($this->collection),
        ];
    }
}
