<?php

namespace ReinVanOyen\Cmf\Http\Resources;

// @TODO this class shouldn't really be extending ModelResource
// This was done, to avoid having to change the type hint on ModelResource everywhere
// Eventually this will have to be seperated

class ContentBlockResource extends ModelResource
{
    /**
     * ContentBlockResource constructor.
     * @param $resource
     * @param $components
     */
    public function __construct($resource, $components, $fields = [])
    {
        parent::__construct($resource);

        $this->components = $components;
        $this->fields = $fields;
    }

    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        $attributes = [
            'id' => $this->id,
        ];

        foreach ($this->components as $component) {
            $component->provision($this, $attributes);
        }

        foreach ($this->fields as $field) {
            $attributes[$field] = $this->{$field};
        }

        return $attributes;
    }
}
